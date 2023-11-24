import { ImageFrame } from '../../../common';
import { ImageProcessingNode, ImageProcessingOptions } from './ImageProcessingNode';
import { cv } from '../../cv';

export class ColorMaskNode<InOut extends ImageFrame> extends ImageProcessingNode<InOut> {
    protected options: ColorMaskOptions;

    constructor(options: ColorMaskOptions) {
        super(options);
    }

    processImage(image: cv.Mat): Promise<cv.Mat> {
        return new Promise((resolve) => {
            let mat = image.cvtColor(cv.COLOR_BGR2HSV);
            mat = mat.inRange(
                new cv.Vec3(this.options.minRange[0], this.options.minRange[1], this.options.minRange[2]),
                new cv.Vec3(this.options.maxRange[0], this.options.maxRange[1], this.options.maxRange[2]),
            );
            resolve(mat);
        });
    }
}

export interface ColorMaskOptions extends ImageProcessingOptions {
    minRange: number[];
    maxRange: number[];
}
