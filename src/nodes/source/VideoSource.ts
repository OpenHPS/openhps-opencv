import { SourceNode, CameraObject, SourceNodeOptions } from '@openhps/core';
import { VideoFrame } from '../../data';
import { VideoCapture, Mat, CAP_PROP_FPS, CAP_PROP_FOURCC, VideoWriter } from 'opencv4nodejs';

export class VideoSource extends SourceNode<VideoFrame> {
    private _videoCapture: VideoCapture;
    protected options: VideoSourceOptions;
    private _timer: NodeJS.Timer;

    constructor(source?: CameraObject, options?: VideoSourceOptions) {
        super(source, options);

        this.once('build', this._onBuild.bind(this));
        this.once('destroy', this.stop.bind(this));
    }

    private _onBuild(): void {
        if (this.options.videoSource) {
            this.load(this.options.videoSource);
        }
        if (this.options.autoPlay) {
            return this.play();
        }
    }

    /**
     * Load video from file, stream, port
     *
     * @param {string} videoSource File path
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
        if (this._timer) {
            clearInterval(this._timer);
        }
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
        videoFrame.fps = this._videoCapture.get(CAP_PROP_FPS);

        const frameImage: Mat = this._videoCapture.read();
        if (frameImage.empty) {
            return undefined;
        }
        videoFrame.height = frameImage.sizes[0];
        videoFrame.width = frameImage.sizes[1];
        videoFrame.image = frameImage;
        videoFrame.fourcc = this._videoCapture.get(CAP_PROP_FOURCC);
        return videoFrame;
    }
}

export interface VideoSourceOptions extends SourceNodeOptions {
    /**
     * Autoplay the video when building the node
     */
    autoPlay?: boolean;

    videoSource?: string;
}
