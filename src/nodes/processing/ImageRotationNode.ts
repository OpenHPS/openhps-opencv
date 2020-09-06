import { ImageFrame } from '../../data';
import { Mat } from 'opencv4nodejs';
import { ImageProcessingOptions, ImageProcessingNode } from './ImageProcessingNode';

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
        return new Promise((resolve) => {
            const mat = image.rotate(this.options.rotationCode);
            resolve(mat);
        });
    }
}

export interface ImageRotationOptions extends ImageProcessingOptions {
    rotationCode: number;
}
