import { ImageFrame } from '../../../common';
import { ImageProcessingNode, ImageProcessingOptions } from './ImageProcessingNode';
import { cv } from '../../cv';

export class GaussianBlurNode<InOut extends ImageFrame> extends ImageProcessingNode<InOut> {
    protected options: GaussianBlurOptions;

    constructor(options: GaussianBlurOptions) {
        super(options);
    }

    processImage(image: cv.Mat): Promise<cv.Mat> {
        return new Promise((resolve, reject) => {
            image
                .gaussianBlurAsync(new cv.Size(this.options.kernelSize, this.options.kernelSize), 0)
                .then((mat) => {
                    resolve(mat);
                })
                .catch(reject);
        });
    }
}

export interface GaussianBlurOptions extends ImageProcessingOptions {
    kernelSize: number;
}
