import { SourceNode, SourceNodeOptions, TimeService, TimeUnit } from '@openhps/core';
import { CameraObject, VideoFrame } from '@openhps/video';
import {
    VideoCapture,
    Mat,
    CAP_PROP_FPS,
    CAP_PROP_FOURCC,
    CAP_PROP_BRIGHTNESS,
    CAP_PROP_CONTRAST,
    CAP_PROP_FRAME_COUNT,
} from '@u4/opencv4nodejs';

export abstract class AbstractVideoSource extends SourceNode<VideoFrame> {
    public videoCapture: VideoCapture;
    protected options: VideoSourceOptions;
    protected timer: NodeJS.Timer;
    protected srcFPS: number;
    protected frame = 0;
    protected start: number;
    protected totalFrames: number;

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
     * @param {string} videoSource File path
     * @returns {AbstractVideoSource} Video source instance
     */
    load(videoSource: string | number | Element): this {
        this.videoCapture = new VideoCapture(videoSource as any);
        this.srcFPS = this.videoCapture.get(CAP_PROP_FPS);
        this.options.fps = this.options['fps'] === undefined ? this.srcFPS : this.options.fps;
        this.options.fourcc = this.videoCapture.get(CAP_PROP_FOURCC);
        this.totalFrames = this.videoCapture.get(CAP_PROP_FRAME_COUNT);

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

    reset(): void {
        this.frame = 0;
        this.videoCapture.reset();
    }

    release(): void {
        this.videoCapture.release();
    }

    /**
     * Start playback of the video stream
     * @returns {number} Running frame grab timer
     */
    play(): NodeJS.Timer {
        let ready = true;
        this.timer = setInterval(
            () => {
                if (ready || !this.options.throttleRead) {
                    ready = false;
                    this._readFrame()
                        .then((videoFrame: VideoFrame) => {
                            if (!videoFrame) {
                                return clearInterval(this.timer as any);
                            }
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
        this.start = Date.now();
        return this.timer;
    }

    stop(): void {
        if (this.timer) {
            clearInterval(this.timer as any);
        }
    }

    get currentFrameCount(): number {
        return this.frame;
    }

    get totalFrameCount(): number {
        return this.totalFrames;
    }

    get actualFPS(): number {
        return Math.round((this.frame / ((Date.now() - this.start) / 1000)) * 100) / 100;
    }

    /**
     * Pull the next frame
     * @returns {Promise<AbstractVideoSource>} Pull promise
     */
    onPull(): Promise<VideoFrame> {
        return this._readFrame();
    }

    protected abstract readFrame(): Promise<Mat>;

    private _readFrame(): Promise<VideoFrame> {
        return new Promise((resolve, reject) => {
            const videoFrame = new VideoFrame();
            videoFrame.source = this.source as CameraObject;
            videoFrame.fps = this.options.fps;
            this.readFrame()
                .then((frameImage: Mat) => {
                    if (!frameImage || frameImage.empty) {
                        return resolve(undefined);
                    }
                    this.frame++; // Increase frame
                    videoFrame.phenomenonTimestamp = TimeUnit.SECOND.convert(
                        this.frame * (1.0 / videoFrame.fps),
                        TimeService.getUnit(),
                    );
                    videoFrame.rows = this.options.height || frameImage.sizes[0];
                    videoFrame.cols = this.options.width || frameImage.sizes[1];
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
    /**
     * Frames to skip
     * @default 1
     */
    frameSkip?: number;
}
