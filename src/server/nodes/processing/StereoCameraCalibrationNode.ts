import { ProcessingNode } from '@openhps/core';
import { StereoImageFrame } from '../../../common';
import { cv } from '../../cv';

export class StereoCameraCalibrationNode extends ProcessingNode<StereoImageFrame, StereoImageFrame> {
    /**
     * Process the data that was pushed or pulled from this layer
     * @param {StereoImageFrame} data Data frame
     * @returns {Promise<StereoImageFrame>} Stereo image frame processing promise
     */
    process(data: StereoImageFrame): Promise<StereoImageFrame> {
        return new Promise<StereoImageFrame>((resolve, reject) => {
            const boardSize = new cv.Size(8, 6);
            const promises = [];
            promises.push(
                data.left.image.findChessboardCornersAsync(
                    boardSize,
                    cv.CALIB_CB_ADAPTIVE_THRESH | cv.CALIB_CB_FAST_CHECK | cv.CALIB_CB_NORMALIZE_IMAGE,
                ),
            );
            promises.push(
                data.right.image.findChessboardCornersAsync(
                    boardSize,
                    cv.CALIB_CB_ADAPTIVE_THRESH | cv.CALIB_CB_FAST_CHECK | cv.CALIB_CB_NORMALIZE_IMAGE,
                ),
            );

            Promise.all(promises).then((values: Array<{ returnValue: boolean; corners: cv.Point2[] }>) => {
                if (values[0].returnValue && values[1].returnValue) {
                    const imageFrame = new StereoImageFrame();
                    imageFrame.source = data.source;
                    imageFrame.left = data.left;
                    imageFrame.right = data.right;
                    const drawPromises = [];
                    drawPromises.push(
                        imageFrame.left.image.drawChessboardCornersAsync(boardSize, values[0].corners, true),
                    );
                    drawPromises.push(
                        imageFrame.right.image.drawChessboardCornersAsync(boardSize, values[1].corners, true),
                    );

                    Promise.all(drawPromises)
                        .then(() => {
                            resolve(imageFrame);
                        })
                        .catch(reject);
                } else {
                    resolve(undefined);
                }
            });
        });
    }
}
