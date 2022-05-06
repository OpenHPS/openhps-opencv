import { Mat } from '@u4/opencv4nodejs';
import { ImageFrame, OpenCV } from '../../../common';
import { ColorMaskOptions } from '../../../server';
import { ImageProcessingNode } from './ImageProcessingNode';

export class ColorMaskNode<InOut extends ImageFrame> extends ImageProcessingNode<InOut> {
    protected options: ColorMaskOptions;

    constructor(options: ColorMaskOptions) {
        super(options);
    }

    processImage(image: OpenCV.Mat): Promise<OpenCV.Mat> {
        return new Promise((resolve) => {
            const hsv = new Mat();
            (OpenCV as any).cvtColor(image, hsv, OpenCV.COLOR_BGR2HSV);
            const dst = new Mat();
            const low = (OpenCV as any).matFromArray(3, 1, OpenCV.CV_64FC1, this.options.minRange);
            const high = (OpenCV as any).matFromArray(3, 1, OpenCV.CV_64FC1, this.options.maxRange);
            (OpenCV as any).inRange(hsv, low, high, dst);
            low.delete();
            high.delete();
            (hsv as any).delete();
            resolve(dst);
        });
    }
}
