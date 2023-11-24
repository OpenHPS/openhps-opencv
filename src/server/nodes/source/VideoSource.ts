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
    CV_8UC4,
} from '@u4/opencv4nodejs';

export class VideoSource extends SourceNode<VideoFrame> {
    public videoCapture: VideoCapture;
    protected options: VideoSourceOptions;
    protected timer: NodeJS.Timer;
    protected srcFPS: number;
    protected frame = 0;
    protected start: number;
    protected totalFrames: number;
    protected mat: Mat;

    constructor(options?: VideoSourceOptions) {
        super(options);
        this.options.sharedImageFrame =
            this.options.sharedImageFrame === undefined ? true : this.options.sharedImageFrame;
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
        if (this.options.sharedImageFrame) {
            this.mat = new Mat(this.options.height, this.options.width, CV_8UC4);
        }
    }

    /**
     * Load video from file, stream, port
     * @param {string} videoSource File path
     * @returns {VideoSource} Video source instance
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
        if (this.videoCapture.release) {
            this.videoCapture.release();
        }
        if (this.mat) {
            if (this.mat.release) {
                this.mat.release();
            } else {
                (this.mat as any).delete();
            }
        }
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
     * @returns {Promise<VideoSource>} Pull promise
     */
    onPull(): Promise<VideoFrame> {
        return this._readFrame();
    }

    protected readFrame(): Promise<Mat> {
        return this.videoCapture.readAsync();
    }

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
    /**
     * Shared image frame
     * @default true
     */
    sharedImageFrame?: boolean;
}
