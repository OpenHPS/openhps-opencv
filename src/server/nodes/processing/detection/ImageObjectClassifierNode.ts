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
        return new Promise<ImageFrame>((resolve) => {
            const result = this._classifier.detectMultiScaleGpu(data.image.bgrToGray()) as any;
            if (result !== null) {
                // Objects detected in image
                const sortedIndexes = this._sortByNumDetections(result);
                for (
                    let i = 0;
                    i <
                    (this._maxResults !== -1
                        ? this._maxResults > result.objects.length
                            ? result.objects.length
                            : this._maxResults
                        : result.objects.length);
                    i++
                ) {
                    const object = result.objects[sortedIndexes[i]];
                    const numDetections = result.numDetections[sortedIndexes[i]];

                    // Create an image feature for the image frame
                    const imageFeature = new this._imageObjectType();
                    imageFeature.shape = new ImageRectShape(object);
                    imageFeature.confidence = numDetections;
                    data.addObject(imageFeature);
                }
            }
            resolve(data);
        });
    }
}
