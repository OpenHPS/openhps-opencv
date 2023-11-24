import { ImageFrame } from '../../../common';
import { ImageErodeOptions } from '../../../server';
import { ImageProcessingNode } from './ImageProcessingNode';
import { cv } from '../../cv';

export class ImageErodeNode<InOut extends ImageFrame> extends ImageProcessingNode<InOut> {
    protected options: ImageErodeOptions;

    constructor(options?: ImageErodeOptions) {
        super(options);
    }

    processImage(image: cv.Mat): Promise<cv.Mat> {
        return new Promise((resolve) => {
            const dst = new cv.Mat();
            const kernel = new cv.Mat();
            cv.erode(image, dst, kernel, new cv.Point(0, 0), this.options.iterations ? this.options.iterations : 1);
            kernel.delete();
            resolve(dst);
        });
    }
}
