import { CV_8UC4, Mat, VideoCapture } from '@u4/opencv4nodejs';
import { AbstractVideoSource, VideoSourceOptions } from '../../../common/nodes';

export class VideoSource extends AbstractVideoSource {
    constructor(options?: VideoSourceOptions) {
        super(options);

        this.once('build', this.onBuild.bind(this));
        this.once('destroy', this.stop.bind(this));
    }

    protected onBuild(): void {
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
