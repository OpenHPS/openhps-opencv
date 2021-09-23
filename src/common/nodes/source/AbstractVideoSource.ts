import { SourceNode, SourceNodeOptions } from '@openhps/core';
import { VideoFrame } from '../../data';
import {
    VideoCapture,
    Mat,
    CAP_PROP_FPS,
    CAP_PROP_FOURCC,
    CAP_PROP_BRIGHTNESS,
    CAP_PROP_CONTRAST,
} from 'opencv4nodejs';

export abstract class AbstractVideoSource extends SourceNode<VideoFrame> {
    public videoCapture: VideoCapture;
    protected options: VideoSourceOptions;
    private _timer: NodeJS.Timer;
    private _srcFPS: number;
    private _frame: number;
    private _start: number;

    constructor(options?: VideoSourceOptions) {
        super(options);

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

    /**
     * Load video from file, stream, port
     *
     * @param {string} videoSource File path
     * @returns {AbstractVideoSource} Video source instance
     */
    public load(videoSource: string | number | Element): this {
        this.videoCapture = new VideoCapture(videoSource as any);
        this._srcFPS = this.videoCapture.get(CAP_PROP_FPS);
        this.options.fps = this.options['fps'] === undefined ? this._srcFPS : this.options.fps;
        this.options.fourcc = this.videoCapture.get(CAP_PROP_FOURCC);

        if (this.options['brightness'] !== undefined) {
            this.videoCapture.set(CAP_PROP_BRIGHTNESS, this.options.brightness);
        }
        if (this.options['contrast'] !== undefined) {
            this.videoCapture.set(CAP_PROP_CONTRAST, this.options.contrast);
        }
        if (this.options.fps !== -1) {
            this.videoCapture.set(CAP_PROP_FPS, this.options.fps);
        }

        return this;
    }

    public reset(): void {
        this.videoCapture.reset();
    }

    public release(): void {
        this.videoCapture.release();
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
        this._start = Date.now();
        return this._timer;
    }

    public stop(): void {
        if (this._timer) {
            clearInterval(this._timer);
        }
    }

    public get actualFPS(): number {
        return Math.round((this._frame / ((Date.now() - this._start) / 1000)) * 100) / 100;
    }

    /**
     * Pull the next frame
     *
     * @returns {Promise<AbstractVideoSource>} Pull promise
     */
    public onPull(): Promise<VideoFrame> {
        return this._readFrame();
    }

    protected abstract readFrame(): Promise<Mat>;

    private _readFrame(): Promise<VideoFrame> {
        return new Promise((resolve, reject) => {
            const videoFrame = new VideoFrame();
            videoFrame.source = this.source;
            videoFrame.fps = this.options.fps;
            this.readFrame()
                .then((frameImage: Mat) => {
                    if (!frameImage) {
                        return resolve(undefined);
                    }
                    videoFrame.height = this.options.height || frameImage.sizes[0];
                    videoFrame.width = this.options.width || frameImage.sizes[1];
                    videoFrame.image = frameImage;
                    videoFrame.fourcc = this.options.fourcc;
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
    videoSource?: string | Element | number;
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
    fourcc?: number;
    width?: number;
    height?: number;
}
