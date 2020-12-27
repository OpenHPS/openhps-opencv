import { ImageFrame, OpenCV } from '../../../common';
import { ImageProcessingNode, ImageProcessingOptions } from './ImageProcessingNode';

export class ColorMaskNode<InOut extends ImageFrame> extends ImageProcessingNode<InOut> {
    protected options: ColorMaskOptions;

    constructor(options: ColorMaskOptions) {
        super(options);
    }

    public processImage(image: OpenCV.Mat): Promise<OpenCV.Mat> {
        return new Promise((resolve) => {
            let mat = image.cvtColor(OpenCV.COLOR_BGR2HSV);
            mat = mat.inRange(
                new OpenCV.Vec3(this.options.minRange[0], this.options.minRange[1], this.options.minRange[2]),
                new OpenCV.Vec3(this.options.maxRange[0], this.options.maxRange[1], this.options.maxRange[2]),
            );
            resolve(mat);
        });
    }
}

export interface ColorMaskOptions extends ImageProcessingOptions {
    minRange: number[];
    maxRange: number[];
}
