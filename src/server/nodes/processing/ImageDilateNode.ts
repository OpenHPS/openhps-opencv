import { ImageFrame } from '../../../common';
import { ImageProcessingNode, ImageProcessingOptions } from './ImageProcessingNode';
import { cv } from '../../cv';

export class ImageDilateNode<InOut extends ImageFrame> extends ImageProcessingNode<InOut> {
    protected options: ImageDilateOptions;

    constructor(options?: ImageDilateOptions) {
        super(options);
    }

    processImage(image: cv.Mat): Promise<cv.Mat> {
        return new Promise((resolve) => {
            const mat = image.dilate(
                new cv.Mat(),
                new cv.Point2(0, 0),
                this.options.iterations ? this.options.iterations : 1,
            );
            resolve(mat);
        });
    }
}

export interface ImageDilateOptions extends ImageProcessingOptions {
    iterations?: number;
}
