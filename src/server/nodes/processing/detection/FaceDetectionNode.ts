import { ImageObjectClassifierNode } from './ImageObjectClassifierNode';
import { CascadeClassifier, HAAR_FRONTALFACE_DEFAULT } from 'opencv4nodejs';
import { ImageFeatureObject } from '../../../../common';

export class FaceDetectionNode extends ImageObjectClassifierNode<ImageFeatureObject> {
    constructor() {
        super(new CascadeClassifier(HAAR_FRONTALFACE_DEFAULT), ImageFeatureObject, 1);
    }
}
