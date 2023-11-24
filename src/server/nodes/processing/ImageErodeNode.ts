import { ImageFrame } from '../../../common';
import { ImageProcessingNode, ImageProcessingOptions } from './ImageProcessingNode';
import { cv } from '../../cv';

export class ImageErodeNode<InOut extends ImageFrame> extends ImageProcessingNode<InOut> {
    protected options: ImageErodeOptions;

    constructor(options?: ImageErodeOptions) {
        super(options);
    }

    processImage(image: cv.Mat): Promise<cv.Mat> {
        return new Promise((resolve) => {
            const mat = image.erode(
                new cv.Mat(),
                new cv.Point2(0, 0),
                this.options.iterations ? this.options.iterations : 1,
            );
            resolve(mat);
        });
    }
}

export interface ImageErodeOptions extends ImageProcessingOptions {
    iterations?: number;
}
