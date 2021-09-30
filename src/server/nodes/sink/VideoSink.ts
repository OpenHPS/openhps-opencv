import { VideoFrame } from '../../../common';
import { SinkNode, SinkNodeOptions } from '@openhps/core';
import { VideoWriter, Size } from 'opencv4nodejs';
import * as fs from 'fs';

export class VideoSink<In extends VideoFrame> extends SinkNode<In> {
    protected options: VideoSinkOptions;
    private _writer: VideoWriter;

    constructor(options: VideoSinkOptions) {
        super(options);

        this.once('destroy', this._destroyWriter.bind(this));
    }

    public get videoWriter(): VideoWriter {
        return this._writer;
    }

    private _destroyWriter(): void {
        this._writer.release();
    }

    public onPush(frame: In): Promise<void> {
        return new Promise((resolve, reject) => {
            const width = this.options.width || frame.cols;
            const height = this.options.height || frame.rows;

            // Create writer on first frame
            if (!this._writer) {
                // Check if the file exists
                if (fs.existsSync(this.options.filePath)) {
                    fs.unlinkSync(this.options.filePath);
                }

                this._writer = new VideoWriter(
                    this.options.filePath,
                    this.options.codec ? VideoWriter.fourcc(this.options.codec) : frame.fourcc,
                    this.options.fps || frame.fps,
                    new Size(width, height),
                );
            }

            // Validate image size
            let image = frame.image;
            if (image.sizes[0] !== height || image.sizes[1] !== width) {
                image = image.resize(height, width);
            }

            this._writer.writeAsync(image).then(resolve).catch(reject);
        });
    }
}

export interface VideoSinkOptions extends SinkNodeOptions {
    filePath: string;
    fps?: number;
    codec?: string;
    width?: number;
    height?: number;
}
