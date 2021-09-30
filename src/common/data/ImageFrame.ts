import 'reflect-metadata';
import { DataFrame, SerializableObject, SerializableMember } from '@openhps/core';
import { ImageFeatureObject } from './object/ImageFeatureObject';
import { imdecode, imencode, Mat } from 'opencv4nodejs';
import { CameraObject } from './object';

@SerializableObject()
export class ImageFrame extends DataFrame {
    @SerializableMember({
        serializer: (image: Mat) => {
            if (!image) {
                return undefined;
            }
            return imencode('.jpg', image);
        },
        deserializer: (json: any) => {
            if (!json) {
                return undefined;
            }
            return imdecode(json);
        },
    })
    image: Mat;

    /**
     * Height (rows)
     */
    @SerializableMember()
    rows: number;
    /**
     * Width (cols)
     */
    @SerializableMember()
    cols: number;
    @SerializableMember()
    fourcc: number;
    @SerializableMember()
    fps: number;

    get imageFeatures(): ImageFeatureObject[] {
        const imageFeatures = new Array<ImageFeatureObject>();
        this.getObjects().forEach((object) => {
            if (object instanceof ImageFeatureObject) {
                imageFeatures.push(object);
            }
        });
        return imageFeatures;
    }

    addImageFeature(imageFeature: ImageFeatureObject): void {
        this.addObject(imageFeature);
    }

    /**
     * Source object clone that captured the data frame
     *
     * @returns {CameraObject} Source data object
     */
    get source(): CameraObject {
        return super.source as CameraObject;
    }

    /**
     * Set the source object clone that captured the data frame
     *
     * @param {CameraObject} object Source data object
     */
    set source(object: CameraObject) {
        super.source = object;
    }
}
