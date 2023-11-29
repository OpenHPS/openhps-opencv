import { SourceNode, SourceNodeOptions, TimeService, TimeUnit } from '@openhps/core';
import { cv } from '../../cv';
import { CameraObject, VideoFrame } from '@openhps/video';

export class VideoSource extends SourceNode<VideoFrame> {
    public videoCapture: cv.VideoCapture;
    protected options: VideoSourceOptions;
    protected timer: NodeJS.Timer;
    protected srcFPS: number;
    protected frame = 0;
    protected start: number;
    protected totalFrames: number;
    protected mat: cv.Mat;

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
            this.mat = new cv.Mat(this.options.height, this.options.width, cv.CV_8UC4);
        }
    }

    reset(): void {
        this.frame = 0;
    }

    release(): void {
        if (this.mat) {
            this.mat.delete();
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

    private _readFrame(): Promise<VideoFrame> {
        return new Promise((resolve, reject) => {
            const videoFrame = new VideoFrame();
            videoFrame.source = this.source as CameraObject;
            videoFrame.fps = this.options.fps;
            this.readFrame()
                .then((frameImage: cv.Mat) => {
                    if (!frameImage || frameImage.empty()) {
                        return resolve(undefined);
                    }
                    this.frame++; // Increase frame
                    videoFrame.phenomenonTimestamp = TimeUnit.SECOND.convert(
                        this.frame * (1.0 / videoFrame.fps),
                        TimeService.getUnit(),
                    );
                    videoFrame.rows = this.options.height || frameImage.size().height;
                    videoFrame.cols = this.options.width || frameImage.size().width;
                    videoFrame.image = frameImage;
                    resolve(videoFrame);
                })
                .catch(reject);
        });
    }

    /**
     * Load video from file, stream, port
     * @param {string} videoSource File path
     * @returns {VideoSource} Video source instance
     */
    load(videoSource: string | number | Element): this {
        this.videoCapture = new cv.VideoCapture(videoSource as any);
        if (videoSource instanceof HTMLVideoElement) {
            this.options.height = videoSource.videoHeight;
            this.options.width = videoSource.videoWidth;
            videoSource.height = videoSource.videoHeight;
            videoSource.width = videoSource.videoWidth;
        }
        return this;
    }

    protected readFrame(): Promise<cv.Mat> {
        return new Promise<cv.Mat>((resolve, reject) => {
            let mat = this.mat;
            try {
                if (mat === undefined) {
                    mat = new cv.Mat(this.options.height, this.options.width, cv.CV_8UC4);
                }
                this.videoCapture.read(mat);
                resolve(mat);
            } catch (ex) {
                if (this.mat == undefined) {
                    mat.delete(); // Clear
                }
                reject(ex);
            }
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
