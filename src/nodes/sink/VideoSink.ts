import { VideoFrame } from '../../data';
import { SinkNode, SinkNodeOptions } from '@openhps/core';
import { VideoWriter, Size } from 'opencv4nodejs';

export class VideoSink<In extends VideoFrame> extends SinkNode<In> {
    protected options: VideoSinkOptions;
    private _writer: VideoWriter;

    constructor(options: VideoSinkOptions) {
        super(options);

        this.once('build', this._createWriter.bind(this));
        this.once('destroy', this._destroyWriter.bind(this));
    }

    private _createWriter(): void {
        this._writer = new VideoWriter(
            this.options.filePath,
            VideoWriter.fourcc(this.options.codec),
            this.options.fps,
            new Size(this.options.width, this.options.height),
        );
    }

    private _destroyWriter(): void {
        this._writer.release();
    }

    public onPush(frame: In): Promise<void> {
        return new Promise((resolve, reject) => {
            // Validate image size
            let image = frame.image;
            if (image.sizes[0] !== this.options.height || image.sizes[1] !== this.options.width) {
                image = image.resize(this.options.height, this.options.width);
            }

            this._writer.writeAsync(image).then(resolve).catch(reject);
        });
    }
}

export interface VideoSinkOptions extends SinkNodeOptions {
    filePath: string;
    fps: number;
    codec: string;
    width: number;
    height: number;
}
