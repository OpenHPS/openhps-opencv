import { DataObject, SerializableObject, SerializableMember, SerializableArrayMember } from '@openhps/core';
import { ImageRectShape } from './ImageRectShape';

@SerializableObject()
export class ImageFeatureObject extends DataObject {
    private _confidence: number;
    @SerializableArrayMember(ImageFeatureObject)
    private _containedFeatures: ImageFeatureObject[] = new Array<ImageFeatureObject>();
    private _shape: ImageRectShape;

    /**
     * Confidence of image features
     *
     * @returns {number} confidence
     */
    @SerializableMember()
    public get confidence(): number {
        return this._confidence;
    }

    public set confidence(confidence: number) {
        this._confidence = confidence;
    }

    @SerializableMember()
    public get shape(): ImageRectShape {
        return this._shape as ImageRectShape;
    }

    public set shape(shape: ImageRectShape) {
        this._shape = shape;
    }
}
