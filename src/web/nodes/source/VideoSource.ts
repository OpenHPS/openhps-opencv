import { CV_8UC4, Mat, VideoCapture } from '@u4/opencv4nodejs';
import { AbstractVideoSource } from '../../../common/nodes';

export class VideoSource extends AbstractVideoSource {
    /**
     * Load video from file, stream, port
     * @param {string} videoSource File path
     * @returns {VideoSource} Video source instance
     */
    load(videoSource: string | number | Element): this {
        this.videoCapture = new VideoCapture(videoSource as any);
        return this;
    }

    protected readFrame(): Promise<Mat> {
        return new Promise<Mat>((resolve) => {
            const mat = new Mat(this.options.height, this.options.width, CV_8UC4);
            (this.videoCapture as any).read(mat);
            resolve(mat);
        });
    }
}
