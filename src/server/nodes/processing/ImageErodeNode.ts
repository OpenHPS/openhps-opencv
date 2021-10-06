import { ImageFrame, OpenCV } from '../../../common';
import { ImageProcessingNode, ImageProcessingOptions } from './ImageProcessingNode';

export class ImageErodeNode<InOut extends ImageFrame> extends ImageProcessingNode<InOut> {
    protected options: ImageErodeOptions;

    constructor(options?: ImageErodeOptions) {
        super(options);
    }

    processImage(image: OpenCV.Mat): Promise<OpenCV.Mat> {
        return new Promise((resolve) => {
            const mat = image.erode(
                new OpenCV.Mat(),
                new OpenCV.Point2(0, 0),
                this.options.iterations ? this.options.iterations : 1,
            );
            resolve(mat);
        });
    }
}

export interface ImageErodeOptions extends ImageProcessingOptions {
    iterations?: number;
}
