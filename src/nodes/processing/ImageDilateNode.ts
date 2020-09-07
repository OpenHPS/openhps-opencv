import { ImageFrame } from '../../data';
import { ImageProcessingOptions, ImageProcessingNode } from './ImageProcessingNode';
import { OpenCV } from '../..';

export class ImageDilateNode<InOut extends ImageFrame> extends ImageProcessingNode<InOut> {
    protected options: ImageDilateOptions;

    constructor(options?: ImageDilateOptions) {
        super(options);
    }

    public processImage(image: OpenCV.Mat): Promise<OpenCV.Mat> {
        return new Promise((resolve) => {
            const mat = image.dilate(
                new OpenCV.Mat(),
                new OpenCV.Point2(0, 0),
                this.options.iterations ? this.options.iterations : 1,
            );
            resolve(mat);
        });
    }
}

export interface ImageDilateOptions extends ImageProcessingOptions {
    iterations?: number;
}
