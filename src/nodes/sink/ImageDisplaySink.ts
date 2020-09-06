import { SinkNode } from '@openhps/core';
import { ImageFrame } from '../../data';
import { imshow, Mat, waitKey, Vec3 } from 'opencv4nodejs';

/**
 * OpenCV Image Display Sink
 * 
 * ## About
 * This sink node will display the image frame using ```imshow```
 */
export class ImageDisplaySink extends SinkNode<ImageFrame> {
    private _windowTitle: string;

    constructor(windowTitle = 'Debug Image') {
        super();
        this._windowTitle = windowTitle;
    }

    /**
     * Push the data to the output
     *
     * @param {ImageFrame} data Input data
     * @returns {Promise<void>} Push promise
     */
    public onPush(data: ImageFrame): Promise<void> {
        return new Promise<void>((resolve) => {
            const debugImage: Mat = data.image.copy();
            data.imageFeatures.forEach((feature) => {
                debugImage.drawRectangle(feature.shape, new Vec3(255, 0, 0), 3);
            });
            imshow(this._windowTitle, debugImage);
            waitKey(1);
            resolve();
        });
    }
}
