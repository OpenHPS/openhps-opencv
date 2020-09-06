import { SourceNode, CameraObject, SourceNodeOptions } from '@openhps/core';
import { VideoFrame } from '../../data';
import { VideoCapture, Mat } from 'opencv4nodejs';

export class VideoSource extends SourceNode<VideoFrame> {
    private _videoCapture: VideoCapture;
    protected options: VideoSourceOptions;
    private _timer: NodeJS.Timer;

    constructor(source?: CameraObject, options?: VideoSourceOptions) {
        super(source, options);

        this.once('build', this._onBuild.bind(this));
        this.once('destroy', this._onDestroy.bind(this));
    }

    private _onBuild(): void {
        if (this.options.autoPlay) {
            return this.play();
        }
    }

    private _onDestroy(): void {

    }

    /**
     * Load video from file, stream, port
     *
     * @param {string} filePath File path
     * @returns {VideoSource} Video source instance
     */
    public load(videoSource: string | number): VideoSource {
        this._videoCapture = new VideoCapture(videoSource as string);
        return this;
    }

    public reset(): void {
        this._videoCapture.reset();
    }

    public release(): void {
        this._videoCapture.release();
    }

    public play(): void {
        this._timer = setInterval(() => {
            const videoFrame = this._readFrame();
            if (!videoFrame) {
                return clearInterval(this._timer);
            }
            Promise.resolve(this.push(videoFrame));
        }, 0);
    }

    public stop(): void {
        clearInterval(this._timer);
    }

    /**
     * Pull the next frame
     *
     * @returns {Promise<VideoSource>} Pull promise
     */
    public onPull(): Promise<VideoFrame> {
        return new Promise<VideoFrame>((resolve) => {
            resolve(this._readFrame());
        });
    }

    private _readFrame(): VideoFrame {
        const videoFrame = new VideoFrame();
        const frameImage: Mat = this._videoCapture.read();
        if (frameImage.empty) {
            return undefined;
        }
        videoFrame.image = frameImage;
        return videoFrame;
    }
}

export interface VideoSourceOptions extends SourceNodeOptions {
    /**
     * Autoplay the video when building the node
     */
    autoPlay?: boolean;
}
