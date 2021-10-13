import { ImageFrame } from '../../../common';
import { Mat, Point2, Size } from 'opencv4nodejs';
import * as cv from 'opencv4nodejs';
import { ImageProcessingNode, ImageProcessingOptions } from './ImageProcessingNode';

export class ImageTransformNode<InOut extends ImageFrame> extends ImageProcessingNode<InOut> {
    protected options: ImageTransformOptions;

    constructor(options: ImageTransformOptions) {
        super(options);
    }

    /**
     * Transform the image
     *
     * @author Adrian Rosenbrock
     * @see {@link https://www.pyimagesearch.com/2014/08/25/4-point-opencv-getperspective-transform-example/}
     * @param {Mat} image Image to process and transform
     * @returns {Promise<Mat>} Processed image promise
     */
    processImage(image: Mat): Promise<Mat> {
        return new Promise((resolve, reject) => {
            const tl = this.options.src[0];
            const tr = this.options.src[1];
            const br = this.options.src[2];
            const bl = this.options.src[3];

            // compute the width of the new image, which will be the
            // maximum distance between bottom-right and bottom-left
            // x-coordiates or the top-right and top-left x-coordinates
            const widthA = Math.sqrt((br.x - bl.x) ** 2 + (br.y - bl.y) ** 2);
            const widthB = Math.sqrt((tr.x - tl.x) ** 2 + (tr.y - tl.y) ** 2);
            const maxWidth = this.options.width || Math.max(widthA, widthB);

            // compute the height of the new image, which will be the
            // maximum distance between the top-right and bottom-right
            // y-coordinates or the top-left and bottom-left y-coordinates
            const heightA = Math.sqrt((tr.x - br.x) ** 2 + (tr.y - br.y) ** 2);
            const heightB = Math.sqrt((tl.x - bl.x) ** 2 + (tl.y - bl.y) ** 2);
            const maxHeight = this.options.height || Math.max(heightA, heightB);

            const dst = this.options.dst || [
                new Point2(0, 0),
                new Point2(maxWidth - 1, 0),
                new Point2(maxWidth - 1, maxHeight - 1),
                new Point2(0, maxHeight - 1),
            ];

            const transformation: Mat = cv.getPerspectiveTransform(this.options.src, dst);
            image
                .warpPerspectiveAsync(transformation, new Size(maxWidth, maxHeight))
                .then((mat: Mat) => {
                    resolve(mat);
                })
                .catch(reject);
        });
    }
}

export interface ImageTransformOptions extends ImageProcessingOptions {
    src: Point2[];
    dst?: Point2[];
    height?: number;
    width?: number;
}
