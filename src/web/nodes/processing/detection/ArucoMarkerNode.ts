import { ImageFrame } from '../../../../common';
import { ImageProcessingNode, ImageProcessingOptions } from '../ImageProcessingNode';
import { cv } from '../../../cv';

export class ArucoMarkerNode<InOut extends ImageFrame> extends ImageProcessingNode<InOut> {
    protected options: ArucoMarkerOptions;

    constructor(options: ArucoMarkerOptions) {
        super(options);
    }

    public processImage(image: cv.Mat): Promise<cv.Mat> {
        return new Promise((resolve) => {
            resolve(image);
        });
    }
}

export type ArucoMarkerOptions = ImageProcessingOptions;
