import { SinkNode, SinkNodeOptions } from '@openhps/core';
import { ImageFrame } from '@openhps/video';
import { cv } from '../../cv';

/**
 * OpenCV Image Display Sink
 *
 * ## About
 * This sink node will display the image frame using ```imshow```
 */
export class ImageDisplaySink extends SinkNode<ImageFrame> {
    protected options: ImageDisplayOptions;

    constructor(options?: ImageDisplayOptions) {
        super(options);
        this.options.canvas = this.options.canvas || 'debug';
    }

    /**
     * Push the data to the output
     * @param {ImageFrame} data Input data
     * @returns {Promise<void>} Push promise
     */
    onPush(data: ImageFrame): Promise<void> {
        return new Promise<void>((resolve) => {
            cv.imshow(this.options.canvas, data.image);
            resolve();
        });
    }
}

export interface ImageDisplayOptions extends SinkNodeOptions {
    canvas?: string | HTMLCanvasElement;
}
