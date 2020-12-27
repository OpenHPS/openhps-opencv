import 'reflect-metadata';
import { DataFrame, SerializableMember, SerializableObject } from '@openhps/core';
import { ImageFeatureObject } from './object/ImageFeatureObject';
import { Mat } from 'opencv4nodejs';

@SerializableObject()
export class ImageFrame extends DataFrame {
    private _image: Mat;

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
     * OpenCV image
     *
     * @returns {Mat} OpenCV image Mat
     */
    @SerializableMember({
        serializer: (image: Mat): any => {
            if (image === undefined) {
                return undefined;
            }
            // NOTE: The image is stored in memory of OpenCV
            // meaning this function will cause lag
            return image.getDataAsArray();
        },
        deserializer: (json: any): Mat => {
            if (json === undefined) {
                return undefined;
            }
            return new Mat(json);
        },
        constructor: Mat,
    })
    public get image(): Mat {
        return this._image;
    }

    public set image(image: Mat) {
        this._image = image;
    }

    /**
     * Grayscale OpenCV image
     *
     * @returns {Mat} OpenCV grayscale image
     */
    public get imageGrayscale(): Mat {
        return this._image.bgrToGray();
    }
}
