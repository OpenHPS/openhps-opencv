import { ImageFrame, OpenCV } from '../../../common';
import { ImageProcessingNode, ImageProcessingOptions } from './ImageProcessingNode';

export class ImageDilateNode<InOut extends ImageFrame> extends ImageProcessingNode<InOut> {
    protected options: ImageDilateOptions;

    constructor(options?: ImageDilateOptions) {
        super(options);
    }

    processImage(image: OpenCV.Mat): Promise<OpenCV.Mat> {
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
