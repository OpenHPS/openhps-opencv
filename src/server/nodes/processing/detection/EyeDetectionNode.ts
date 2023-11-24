import { ImageObjectClassifierNode } from './ImageObjectClassifierNode';
import { cv } from '../../../cv';
import { ImageFeatureObject, ImageFrame } from '../../../../common';

export class EyeDetectionNode extends ImageObjectClassifierNode<ImageFeatureObject> {
    constructor() {
        super(new cv.CascadeClassifier(cv.HAAR_EYE), ImageFeatureObject, 2);
    }

    /**
     * Process the data that was pushed or pulled from this layer
     * @param {ImageFrame} data Data frame
     * @returns {Promise<ImageFrame>} Image frame processing promise
     */
    process(data: ImageFrame): Promise<ImageFrame> {
        return new Promise<ImageFrame>((resolve, reject) => {
            let faceDetected = false;
            data.getObjects(ImageFeatureObject).forEach(() => {
                faceDetected = true;
            });
            if (faceDetected) {
                super
                    .process(data)
                    .then((frame) => {
                        resolve(frame);
                    })
                    .catch((ex) => {
                        reject(ex);
                    });
            } else {
                resolve(data);
            }
        });
    }
}
