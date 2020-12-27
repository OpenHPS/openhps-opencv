import { Mat } from 'opencv4nodejs';
import { ImageFrame, OpenCV } from '../../../common';
import { ImageDilateOptions } from '../../../server';
import { ImageProcessingNode } from './ImageProcessingNode';

export class ImageDilateNode<InOut extends ImageFrame> extends ImageProcessingNode<InOut> {
    protected options: ImageDilateOptions;

    constructor(options?: ImageDilateOptions) {
        super(options);
    }

    public processImage(image: OpenCV.Mat): Promise<OpenCV.Mat> {
        return new Promise((resolve) => {
            const dst = new Mat();
            const kernel = new Mat();
            (OpenCV as any).dilate(
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
