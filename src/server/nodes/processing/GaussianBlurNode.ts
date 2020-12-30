import { ImageFrame, OpenCV } from '../../../common';
import { ImageProcessingNode, ImageProcessingOptions } from './ImageProcessingNode';

export class GaussianBlurNode<InOut extends ImageFrame> extends ImageProcessingNode<InOut> {
    protected options: GaussianBlurOptions;

    constructor(options: GaussianBlurOptions) {
        super(options);
    }

    public processImage(image: OpenCV.Mat): Promise<OpenCV.Mat> {
        return new Promise((resolve, reject) => {
            image
                .gaussianBlurAsync(new OpenCV.Size(this.options.kernelSize, this.options.kernelSize), 0)
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
