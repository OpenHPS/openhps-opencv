import { ImageFrame } from '../../../common';
import { ImageProcessingNode, ImageProcessingOptions } from './ImageProcessingNode';
import { cv } from '../../cv';

/**
 * Image resize node
 *
 * ## Usage
 * ```typescript
 * new ImageResizeNode({
 *      width:
 * })
 * ```
 */
export class ImageResizeNode<InOut extends ImageFrame> extends ImageProcessingNode<InOut> {
    public options: ImageResizeOptions;

    constructor(options?: ImageResizeOptions) {
        super(options);
    }

    processImage(image: cv.Mat): Promise<cv.Mat> {
        return new Promise((resolve) => {
            // Get the scaling
            let scale = 1.0;
            if (this.options.width) {
                scale = this.options.width / image.sizes[1];
            } else if (this.options.height) {
                scale = this.options.height / image.sizes[0];
            }
            // Resize the image
            const mat = image.resize(
                Math.round(image.sizes[0] * scale),
                Math.round(image.sizes[1] * scale),
                this.options.fx ? this.options.fx : 2,
                this.options.fy ? this.options.fy : 2,
                this.options.interpolation ? this.options.interpolation : cv.INTER_CUBIC,
            );
            resolve(mat);
        });
    }
}

export interface ImageResizeOptions extends ImageProcessingOptions {
    width?: number;
    height?: number;
    fx?: number;
    fy?: number;
    interpolation?: number;
}
