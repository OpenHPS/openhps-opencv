import { VideoFrame } from '../../data';
import { SinkNode, SinkNodeOptions } from '@openhps/core';
import { imwriteAsync } from 'opencv4nodejs';

export class ImageSink<In extends VideoFrame> extends SinkNode<In> {
    protected options: ImageSinkOptions;

    constructor(options: ImageSinkOptions) {
        super(options);
    }

    public onPush(frame: In): Promise<void> {
        return new Promise((resolve, reject) => {
            imwriteAsync(this.options.filePath, frame.image).then(resolve).catch(reject);
        });
    }
}

export interface ImageSinkOptions extends SinkNodeOptions {
    filePath: string;
}
