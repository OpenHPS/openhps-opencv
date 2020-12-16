import { SourceNode, CameraObject, SourceNodeOptions } from '@openhps/core';
import { VideoFrame } from '../../data';
import {
    VideoCapture,
    Mat,
    CAP_PROP_FPS,
    CAP_PROP_FOURCC,
    CAP_PROP_BRIGHTNESS,
    CAP_PROP_CONTRAST,
} from 'opencv4nodejs';

export class VideoSource extends SourceNode<VideoFrame> {
    private _videoCapture: VideoCapture;
    protected options: VideoSourceOptions;
    private _timer: NodeJS.Timer;
    private _srcFPS: number;
    private _frame: number;
    private _start: number;

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
            this.play();
        }
    }

    public get videoCapture(): VideoCapture {
        return this._videoCapture;
    }

    /**
     * Load video from file, stream, port
     *
     * @param {string} videoSource File path
     * @returns {VideoSource} Video source instance
     */
    public load(videoSource: string | number): VideoSource {
        this._videoCapture = new VideoCapture(videoSource as string);
        this._srcFPS = this._videoCapture.get(CAP_PROP_FPS);
        this.options.fps = this.options['fps'] === undefined ? this._srcFPS : this.options.fps;

        if (this.options['brightness'] !== undefined) {
            this._videoCapture.set(CAP_PROP_BRIGHTNESS, this.options.brightness);
        }
        if (this.options['contrast'] !== undefined) {
            this._videoCapture.set(CAP_PROP_CONTRAST, this.options.contrast);
        }
        if (this.options.fps !== -1) {
            this._videoCapture.set(CAP_PROP_FPS, this.options.fps);
        }

        return this;
    }

    public reset(): void {
        this._videoCapture.reset();
    }

    public release(): void {
        this._videoCapture.release();
    }

    /**
     * Start playback of the video stream
     *
     * @returns {NodeJS.Timer} Running frame grab timer
     */
    public play(): NodeJS.Timer {
        let ready = true;
        this._frame = 0;
        this._timer = setInterval(
            () => {
                if (ready || !this.options.throttleRead) {
                    ready = false;
                    this._readFrame()
                        .then((videoFrame: VideoFrame) => {
                            if (!videoFrame) {
                                return clearInterval(this._timer);
                            }
                            this._frame++;
                            if (!this.options.throttlePush) {
                                ready = true;
                            }
                            return this.push(videoFrame);
                        })
                        .then(() => {
                            if (this.options.throttlePush) {
                                ready = true;
                            }
                        })
                        .catch((ex) => {
                            this.logger('error', { ex });
                        });
                }
            },
            this.options.fps === -1 ? 0 : 1000 / this.options.fps,
        );
        this._start = new Date().getTime();
        return this._timer;
    }

    public stop(): void {
        if (this._timer) {
            clearInterval(this._timer);
        }
    }

    public get actualFPS(): number {
        return Math.round((this._frame / ((new Date().getTime() - this._start) / 1000)) * 100) / 100;
    }

    /**
     * Pull the next frame
     *
     * @returns {Promise<VideoSource>} Pull promise
     */
    public onPull(): Promise<VideoFrame> {
        return this._readFrame();
    }

    private _readFrame(): Promise<VideoFrame> {
        return new Promise((resolve, reject) => {
            const videoFrame = new VideoFrame();
            videoFrame.source = this.source;
            videoFrame.fps = this.options.fps;
            this._videoCapture
                .readAsync()
                .then((frameImage: Mat) => {
                    if (frameImage.empty) {
                        return resolve(undefined);
                    }
                    videoFrame.height = frameImage.sizes[0];
                    videoFrame.width = frameImage.sizes[1];
                    videoFrame.image = frameImage;
                    videoFrame.fourcc = this._videoCapture.get(CAP_PROP_FOURCC);
                    resolve(videoFrame);
                })
                .catch(reject);
        });
    }
}

export interface VideoSourceOptions extends SourceNodeOptions {
    /**
     * Autoplay the video when building the node
     */
    autoPlay?: boolean;
    videoSource?: string;
    /**
     * Playback frames per second
     */
    fps?: number;
    /**
     * Frame skipping
     */
    throttlePush?: boolean;
    throttleRead?: boolean;
    brightness?: number;
    contrast?: number;
}
