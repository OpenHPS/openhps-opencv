import { ImageFrame } from '../../data';
import { Mat } from 'opencv4nodejs';
import { ImageProcessingOptions, ImageProcessingNode } from './ImageProcessingNode';
import * as OpenCV from 'opencv4nodejs';

/**
 * Image rotation node
 *
 * ## Usage
 * ```typescript
 * new ImageRotationNode({
 *      width:
 * })
 * ```
 */
export class ImageRotationNode<InOut extends ImageFrame> extends ImageProcessingNode<InOut> {
    public options: ImageRotationOptions;

    constructor(options?: ImageRotationOptions) {
        super(options);
    }

    public processImage(image: Mat): Promise<Mat> {
        return new Promise((resolve, reject) => {
            image
                .rotateAsync(this.options.rotationCode)
                .then((mat: Mat) => {
                    resolve(mat);
                })
                .catch(reject);
        });
    }
}

export class ImageRotation {
    static readonly ROTATION_90_CLOCKWISE: number = OpenCV.ROTATE_90_CLOCKWISE;
    static readonly ROTATE_90_COUNTERCLOCKWISE: number = OpenCV.ROTATE_90_COUNTERCLOCKWISE;
    static readonly ROTATE_180: number = OpenCV.ROTATE_180;
}

export interface ImageRotationOptions extends ImageProcessingOptions {
    rotationCode: number;
}
