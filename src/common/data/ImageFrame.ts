import 'reflect-metadata';
import { DataFrame, SerializableObject, SerializableMember, CameraObject } from '@openhps/core';
import { ImageFeatureObject } from './object/ImageFeatureObject';
import { imdecode, imencode, Mat } from 'opencv4nodejs';

@SerializableObject()
export class ImageFrame extends DataFrame {
    @SerializableMember({
        serializer: (image: Mat) => {
            return imencode('.jpg', image);
        },
        deserializer: (json: any) => {
            return imdecode(json);
        },
    })
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
     * Source object clone that captured the data frame
     *
     * @returns {CameraObject} Source data object
     */
    get source(): CameraObject {
        return this.source;
    }

    /**
     * Set the source object clone that captured the data frame
     *
     * @param {CameraObject} object Source data object
     */
    set source(object: CameraObject) {
        this.source = object;
    }
}
