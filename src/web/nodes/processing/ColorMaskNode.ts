import { ImageFrame } from '../../../common';
import { ColorMaskOptions } from '../../../server';
import { ImageProcessingNode } from './ImageProcessingNode';
import { cv } from '../../cv';

export class ColorMaskNode<InOut extends ImageFrame> extends ImageProcessingNode<InOut> {
    protected options: ColorMaskOptions;

    constructor(options: ColorMaskOptions) {
        super(options);
    }

    processImage(image: cv.Mat): Promise<cv.Mat> {
        return new Promise((resolve) => {
            const hsv = new cv.Mat();
            cv.cvtColor(image, hsv, cv.COLOR_BGR2HSV);
            const dst = new cv.Mat();
            const low = cv.matFromArray(3, 1, cv.CV_64FC1, this.options.minRange);
            const high = cv.matFromArray(3, 1, cv.CV_64FC1, this.options.maxRange);
            cv.inRange(hsv, low, high, dst);
            low.delete();
            high.delete();
            hsv.delete();
            resolve(dst);
        });
    }
}
