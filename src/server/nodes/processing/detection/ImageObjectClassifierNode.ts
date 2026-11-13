import { ProcessingNode } from '@openhps/core';
import { ImageFrame, ImageFeatureObject, ImageRectShape } from '../../../../common';
import { cv } from '../../../cv';

/**
 * Classify image features
 */
export class ImageObjectClassifierNode<T extends ImageFeatureObject> extends ProcessingNode<ImageFrame, ImageFrame> {
    private _classifier: cv.CascadeClassifier;
    private _imageObjectType: new () => T;

    private _maxResults: number;

    constructor(classifier: cv.CascadeClassifier, imageObjectType: new () => T, maxResults = -1) {
        super();
        this._classifier = classifier;
        this._imageObjectType = imageObjectType;
        this._maxResults = maxResults;
    }

    private _sortByNumDetections(result: { numDetections: number[] }): number[] {
        return result.numDetections
            .map((num, idx) => ({ num, idx }))
            .sort((n0, n1) => n1.num - n0.num)
            .map(({ idx }) => idx);
    }

    /**
     * Process the data that was pushed or pulled from this layer
     * @param {ImageFrame} data Data frame
     * @returns {Promise<ImageFrame>} Image frame processing promise
     */
    process(data: ImageFrame): Promise<ImageFrame> {
        return new Promise<ImageFrame>((resolve, reject) => {
            try {
                const result = this._classifier.detectMultiScaleGpu(data.image.bgrToGray()) as
                    { objects?: unknown; numDetections?: unknown } | null | undefined;
                // Depending on the OpenCV build the classifier does not always return the
                // documented { objects, numDetections } shape (e.g. null/undefined when no
                // objects were detected or when GPU detection is unavailable) - only accept
                // the documented shape, otherwise treat the frame as having no detections.
                if (result && Array.isArray(result.objects) && Array.isArray(result.numDetections)) {
                    const objects = result.objects;
                    const numDetections = result.numDetections as number[];
                    // Objects detected in image
                    const sortedIndexes = this._sortByNumDetections({ numDetections });
                    const limit =
                        this._maxResults !== -1
                            ? Math.min(this._maxResults, numDetections.length)
                            : numDetections.length;
                    for (let i = 0; i < limit; i++) {
                        const object = objects[sortedIndexes[i]];
                        const detections = numDetections[sortedIndexes[i]];
                        if (!object || detections === undefined) {
                            break;
                        }

                        // Create an image feature for the image frame
                        const imageFeature = new this._imageObjectType();
                        imageFeature.shape = new ImageRectShape(object as cv.Rect);
                        imageFeature.confidence = detections;
                        data.addObject(imageFeature);
                    }
                }
                resolve(data);
            } catch (ex) {
                reject(ex);
            }
        });
    }
}
