import { ImageFrame, OpenCV } from '../../../../common';
import { ImageProcessingNode, ImageProcessingOptions } from '../ImageProcessingNode';

export class ArucoMarkerNode<InOut extends ImageFrame> extends ImageProcessingNode<InOut> {
    protected options: ArucoMarkerOptions;

    constructor(options: ArucoMarkerOptions) {
        super(options);
    }

    public processImage(image: OpenCV.Mat): Promise<OpenCV.Mat> {
        return new Promise((resolve) => {
            resolve(image);
        });
    }
}

export type ArucoMarkerOptions = ImageProcessingOptions;
