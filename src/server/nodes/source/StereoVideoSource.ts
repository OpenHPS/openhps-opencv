import { SourceNode, StereoCameraObject, SourceNodeOptions } from '@openhps/core';
import { StereoVideoFrame } from '../../../common';
import { VideoCapture, Mat } from 'opencv4nodejs';

export class StereoVideoSource extends SourceNode<StereoVideoFrame> {
    private _leftVideoCapture: VideoCapture;
    private _rightVideoCapture: VideoCapture;

    constructor(options?: StereoVideoOptions) {
        super(options);
    }

    /**
     * Load video from file or stream path
     *
     * @param {string} filePathLeft Video file for left camera
     * @param {string} filePathRight Video file for right camera
     * @returns {StereoVideoSource} Stereo video source
     */
    public fromFiles(filePathLeft: string, filePathRight: string): StereoVideoSource {
        this._leftVideoCapture = new VideoCapture(filePathLeft);
        this._rightVideoCapture = new VideoCapture(filePathRight);
        return this;
    }

    /**
     * Load video from port
     *
     * @param {number} portLeft COM Port of left camera
     * @param {number} portRight COM Port of right camera
     * @returns {StereoVideoSource} Stero video source
     */
    public fromPorts(portLeft: number, portRight: number): StereoVideoSource {
        this._leftVideoCapture = new VideoCapture(portLeft);
        this._rightVideoCapture = new VideoCapture(portRight);
        return this;
    }

    public reset(): void {
        this._leftVideoCapture.reset();
        this._rightVideoCapture.reset();
    }

    public release(): void {
        this._leftVideoCapture.release();
        this._rightVideoCapture.release();
    }

    public play(): void {
        const videoPlayback: NodeJS.Timeout = setInterval(() => {
            const videoFrame = new StereoVideoFrame();
            videoFrame.source = this.source as StereoCameraObject;
            const leftImage: Mat = this._leftVideoCapture.read();
            const rightImage: Mat = this._rightVideoCapture.read();
            if (leftImage.empty || rightImage.empty) {
                return clearInterval(videoPlayback);
            }
            videoFrame.leftImage = leftImage;
            videoFrame.rightImage = rightImage;
            this.push(videoFrame);
        }, 50);
    }

    /**
     * Pull the next frame
     *
     * @returns {Promise<StereoVideoSource>} Pull promise
     */
    public onPull(): Promise<StereoVideoFrame> {
        return new Promise<StereoVideoFrame>((resolve) => {
            const videoFrame = new StereoVideoFrame();
            videoFrame.source = this.source as StereoCameraObject;
            const leftImage: Mat = this._leftVideoCapture.read();
            const rightImage: Mat = this._rightVideoCapture.read();
            if (leftImage.empty || rightImage.empty) {
                return resolve(undefined);
            }
            videoFrame.leftImage = leftImage;
            videoFrame.rightImage = rightImage;
            resolve(videoFrame);
        });
    }
}

export interface StereoVideoOptions extends SourceNodeOptions {
    source?: StereoCameraObject;
}
