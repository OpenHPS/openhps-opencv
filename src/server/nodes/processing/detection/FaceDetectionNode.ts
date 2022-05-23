import { ImageObjectClassifierNode } from './ImageObjectClassifierNode';
import { CascadeClassifier, HAAR_FRONTALFACE_DEFAULT } from '@u4/opencv4nodejs';
import { ImageFeatureObject } from '../../../../common';

export class FaceDetectionNode extends ImageObjectClassifierNode<ImageFeatureObject> {
    constructor() {
        if (!(CascadeClassifier instanceof Function)) {
            throw new Error(`Cascade classifiers not included in OpenCV!`);
        }
        super(new CascadeClassifier(HAAR_FRONTALFACE_DEFAULT), ImageFeatureObject, 1);
    }
}
