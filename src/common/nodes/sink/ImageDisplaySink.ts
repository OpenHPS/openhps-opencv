import { SinkNode, SinkNodeOptions } from '@openhps/core';
import { ImageFrame } from '@openhps/video';
import { imshow, waitKey } from 'opencv4nodejs';

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
        this.options.windowTitle = this.options.windowTitle || 'Debug';
    }

    /**
     * Push the data to the output
     *
     * @param {ImageFrame} data Input data
     * @returns {Promise<void>} Push promise
     */
    onPush(data: ImageFrame): Promise<void> {
        return new Promise<void>((resolve) => {
            imshow(this.options.windowTitle, data.image);
            if (this.options.waitKey) {
                waitKey(1);
            }
            resolve();
        });
    }
}

export interface ImageDisplayOptions extends SinkNodeOptions {
    windowTitle?: string;
    waitKey?: boolean;
}
