import { ImageFrame } from '../../../common';
import { Mat } from '@u4/opencv4nodejs';
import { ImageProcessingNode, ImageProcessingOptions } from './ImageProcessingNode';
import { cv } from '../../cv';

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

    processImage(image: Mat): Promise<Mat> {
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
    static readonly ROTATION_90_CLOCKWISE: number = cv.ROTATE_90_CLOCKWISE;
    static readonly ROTATE_90_COUNTERCLOCKWISE: number = cv.ROTATE_90_COUNTERCLOCKWISE;
    static readonly ROTATE_180: number = cv.ROTATE_180;
}

export interface ImageRotationOptions extends ImageProcessingOptions {
    rotationCode: number;
}
