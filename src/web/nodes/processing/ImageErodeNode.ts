import { Mat } from '@u4/opencv4nodejs';
import { ImageFrame, OpenCV } from '../../../common';
import { ImageErodeOptions } from '../../../server';
import { ImageProcessingNode } from './ImageProcessingNode';

export class ImageErodeNode<InOut extends ImageFrame> extends ImageProcessingNode<InOut> {
    protected options: ImageErodeOptions;

    constructor(options?: ImageErodeOptions) {
        super(options);
    }

    processImage(image: OpenCV.Mat): Promise<OpenCV.Mat> {
        return new Promise((resolve) => {
            const dst = new Mat();
            const kernel = new Mat();
            (OpenCV as any).erode(
                image,
                dst,
                kernel,
                new (OpenCV as any).Point(0, 0),
                this.options.iterations ? this.options.iterations : 1,
            );
            (kernel as any).delete();
            resolve(dst);
        });
    }
}
