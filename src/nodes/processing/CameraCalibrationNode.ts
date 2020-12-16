import { ProcessingNode } from '@openhps/core';
import { ImageFrame } from '../../data';
import { Size, CALIB_CB_ADAPTIVE_THRESH, CALIB_CB_FAST_CHECK, CALIB_CB_NORMALIZE_IMAGE, Point2 } from 'opencv4nodejs';

export class CameraCalibrationNode extends ProcessingNode<ImageFrame, ImageFrame> {
    /**
     * Process the data that was pushed or pulled from this layer
     *
     * @param {ImageFrame} data Data frame
     * @returns {Promise<ImageFrame>} Image frame processing promise
     */
    public process(data: ImageFrame): Promise<ImageFrame> {
        return new Promise<ImageFrame>((resolve) => {
            const boardSize = new Size(8, 6);
            data.image
                .findChessboardCornersAsync(
                    boardSize,
                    CALIB_CB_ADAPTIVE_THRESH | CALIB_CB_FAST_CHECK | CALIB_CB_NORMALIZE_IMAGE,
                )
                .then((value: { returnValue: boolean; corners: Point2[] }) => {
                    const imageFrame = new ImageFrame();
                    imageFrame.source = data.source;
                    imageFrame.image = data.image;
                    if (value.returnValue) {
                        imageFrame.image.drawChessboardCorners(boardSize, value.corners, true);
                        resolve(imageFrame);
                    } else {
                        resolve(undefined);
                    }
                });
        });
    }
}
