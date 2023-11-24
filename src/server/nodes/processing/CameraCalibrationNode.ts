import { Matrix3, ProcessingNode, ProcessingNodeOptions } from '@openhps/core';
import { ImageFrame } from '../../../common';
import { cv } from '../../cv';

export class CameraCalibrationNode extends ProcessingNode<ImageFrame, ImageFrame> {
    protected options: CameraCalibrationOptions;

    constructor(options?: CameraCalibrationOptions) {
        super(options);
    }

    /**
     * Process the data that was pushed or pulled from this layer
     * @param {ImageFrame} data Data frame
     * @returns {Promise<ImageFrame>} Image frame processing promise
     */
    process(data: ImageFrame): Promise<ImageFrame> {
        return new Promise<ImageFrame>((resolve, reject) => {
            const boardSize = new cv.Size(this.options.boardSize[0], this.options.boardSize[1]);
            const criteria = new cv.TermCriteria(cv.termCriteria.EPS | cv.termCriteria.MAX_ITER, 30, 0.001);

            const objectPoint: number[][] = [];
            for (let i = 0; i < boardSize.width; i++) {
                for (let j = 0; j < boardSize.height; j++) {
                    objectPoint.push([j, i, 0]);
                }
            }

            let calibrationData: CameraCalibrationData;
            const gray: cv.Mat = data.image.bgrToGray();
            let matrix: cv.Mat;
            // Get previously stored data
            this.getNodeData(data.source, {
                objectPoints: [],
                imagePoints: [],
            })
                .then((nodeData: CameraCalibrationData) => {
                    calibrationData = nodeData;
                    return gray.findChessboardCornersAsync(
                        boardSize,
                        cv.CALIB_CB_ADAPTIVE_THRESH | cv.CALIB_CB_FAST_CHECK | cv.CALIB_CB_NORMALIZE_IMAGE,
                    );
                })
                .then((value: { returnValue: boolean; corners: cv.Point2[] }) => {
                    if (value.returnValue) {
                        return gray.cornerSubPixAsync(value.corners, new cv.Size(4, 4), new cv.Size(0, 0), criteria);
                    } else {
                        resolve(data);
                    }
                })
                .then((corners: cv.Point2[]) => {
                    calibrationData.imagePoints.push(corners.map((corner) => [corner.x, corner.y]));
                    calibrationData.objectPoints.push(objectPoint);

                    // Draw chessboard corners if enabled
                    if (this.options.drawChessboardCorners) {
                        data.image.drawChessboardCorners(boardSize, corners, true);
                    }

                    if (calibrationData.imagePoints.length >= this.options.minFrames) {
                        const objectPoints: cv.Point3[][] = calibrationData.objectPoints.map((objectPointArray) =>
                            objectPointArray.map((point) => new cv.Point3(point[0], point[1], point[2])),
                        );
                        const imagePoints: cv.Point2[][] = calibrationData.imagePoints.map((imagePointArray) =>
                            imagePointArray.map((point) => new cv.Point2(point[0], point[1])),
                        );

                        // Initialize camera matrix
                        matrix = cv.initCameraMatrix2D(
                            objectPoints as any,
                            imagePoints as any,
                            new cv.Size(data.image.cols, data.image.rows),
                        );

                        // Perform camera calibration based on chessboard
                        return cv.calibrateCameraAsync(
                            objectPoints as any,
                            imagePoints as any,
                            new cv.Size(data.image.cols, data.image.rows),
                            matrix,
                            [],
                            cv.CALIB_USE_INTRINSIC_GUESS,
                            criteria,
                        );
                    }

                    this.setNodeData(data.source, calibrationData)
                        .then(() => {
                            resolve(data);
                        })
                        .catch(reject);
                })
                .then((val) => {
                    if (!val) {
                        return resolve(data);
                    }

                    // Save calibration data
                    data.source.distortionCoefficients = val.distCoeffs;
                    data.source.cameraMatrix = Matrix3.fromArray(matrix.getDataAsArray());
                    calibrationData.imagePoints = [];
                    calibrationData.objectPoints = [];
                    this.setNodeData(data.source, calibrationData)
                        .then(() => {
                            resolve(data);
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }
}

export interface CameraCalibrationOptions extends ProcessingNodeOptions {
    /**
     * Draw chessboard corners after detection
     * @default false
     */
    drawChessboardCorners?: boolean;
    boardSize: number[];
    minFrames?: number;
}

interface CameraCalibrationData {
    objectPoints: number[][][];
    imagePoints: number[][][];
}
