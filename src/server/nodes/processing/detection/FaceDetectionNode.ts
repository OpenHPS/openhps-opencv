import { ImageObjectClassifierNode } from './ImageObjectClassifierNode';
import { cv } from '../../../cv';
import { ImageFeatureObject } from '../../../../common';

export class FaceDetectionNode extends ImageObjectClassifierNode<ImageFeatureObject> {
    constructor() {
        if (!(cv.CascadeClassifier instanceof Function)) {
            throw new Error(`Cascade classifiers not included in OpenCV!`);
        }
        super(new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_DEFAULT), ImageFeatureObject, 1);
    }
}
