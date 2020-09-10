import { VideoFrame } from '../../data';
import { SinkNode, SinkNodeOptions } from '@openhps/core';
import { VideoWriter, Size } from 'opencv4nodejs';

export class VideoSink<In extends VideoFrame> extends SinkNode<In> {
    protected options: VideoSinkOptions;
    private _writer: VideoWriter;

    constructor(options: VideoSinkOptions) {
        super(options);

        this.once('destroy', this._destroyWriter.bind(this));
    }

    private _destroyWriter(): void {
        this._writer.release();
    }

    public onPush(frame: In): Promise<void> {
        return new Promise((resolve, reject) => {
            const width = this.options.width || frame.width;
            const height = this.options.height || frame.height;

            // Create writer on first frame
            if (!this._writer) {
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
