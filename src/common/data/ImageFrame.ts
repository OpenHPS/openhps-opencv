import 'reflect-metadata';
import { DataFrame, SerializableObject } from '@openhps/core';
import { ImageFeatureObject } from './object/ImageFeatureObject';
import { Mat } from 'opencv4nodejs';

@SerializableObject()
export class ImageFrame extends DataFrame {
    public image: Mat;

    public get imageFeatures(): ImageFeatureObject[] {
        const imageFeatures = new Array<ImageFeatureObject>();
        this.getObjects().forEach((object) => {
            if (object instanceof ImageFeatureObject) {
                imageFeatures.push(object);
            }
        });
        return imageFeatures;
    }

    public addImageFeature(imageFeature: ImageFeatureObject): void {
        this.addObject(imageFeature);
    }

    /**
     * Grayscale OpenCV image
     *
     * @returns {Mat} OpenCV grayscale image
     */
    public get imageGrayscale(): Mat {
        return this.image.bgrToGray();
    }
}
