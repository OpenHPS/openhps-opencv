import { ProcessingNode } from '@openhps/core';
import { ImageFrame, StereoImageFrame } from '../../../common';

export class DisparityProcessingNode extends ProcessingNode<StereoImageFrame, ImageFrame> {
    /**
     * Process the data that was pushed or pulled from this layer
     *
     * @param {StereoImageFrame} data Data frame
     * @returns {Promise<ImageFrame>} Image frame processing promise
     */
    public process(data: StereoImageFrame): Promise<ImageFrame> {
        return new Promise<ImageFrame>((resolve) => {
            const imageFrame = new ImageFrame();
            imageFrame.source = data.source;
            resolve(imageFrame);
        });
    }
}
