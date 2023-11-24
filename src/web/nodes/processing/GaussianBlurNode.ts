import { ImageFrame } from '../../../common';
import { GaussianBlurOptions } from '../../../server';
import { ImageProcessingNode } from './ImageProcessingNode';
import { cv } from '../../cv';

export class GaussianBlurNode<InOut extends ImageFrame> extends ImageProcessingNode<InOut> {
    protected options: GaussianBlurOptions;

    constructor(options: GaussianBlurOptions) {
        super(options);
    }

    processImage(image: cv.Mat): Promise<cv.Mat> {
        return new Promise((resolve) => {
            const dst = new cv.Mat();
            cv.GaussianBlur(image, dst, new cv.Size(this.options.kernelSize, this.options.kernelSize), 0);
            resolve(dst);
        });
    }
}
