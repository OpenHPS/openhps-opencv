import { Mat } from '@u4/opencv4nodejs';
import { ImageFrame, OpenCV } from '../../../common';
import { GaussianBlurOptions } from '../../../server';
import { ImageProcessingNode } from './ImageProcessingNode';

export class GaussianBlurNode<InOut extends ImageFrame> extends ImageProcessingNode<InOut> {
    protected options: GaussianBlurOptions;

    constructor(options: GaussianBlurOptions) {
        super(options);
    }

    processImage(image: OpenCV.Mat): Promise<OpenCV.Mat> {
        return new Promise((resolve) => {
            const dst = new Mat();
            (OpenCV as any).GaussianBlur(
                image,
                dst,
                new OpenCV.Size(this.options.kernelSize, this.options.kernelSize),
                0,
            );
            resolve(dst);
        });
    }
}
