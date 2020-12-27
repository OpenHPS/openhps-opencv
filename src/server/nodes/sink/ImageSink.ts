import { VideoFrame } from '../../../common';
import { SinkNode, SinkNodeOptions } from '@openhps/core';
import { imwriteAsync } from 'opencv4nodejs';

export class ImageSink<In extends VideoFrame> extends SinkNode<In> {
    protected options: ImageSinkOptions;

    constructor(options: ImageSinkOptions) {
        super(options);
    }

    public onPush(frame: In): Promise<void> {
        return new Promise((resolve, reject) => {
            let fileName = this.options.filePath;
            fileName = fileName.replace(/{createdTimestamp}/gi, String(frame.createdTimestamp));
            imwriteAsync(fileName, frame.image).then(resolve).catch(reject);
        });
    }
}

export interface ImageSinkOptions extends SinkNodeOptions {
    /**
     * File to save it to
     *
     * ## Placeholders
     * - ```{createdTimestamp}```: Timestamp of the created frame
     */
    filePath: string;
}
