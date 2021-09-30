import { DataFrame, SerializableObject, SerializableMember } from '@openhps/core';
import { ImageFrame } from './ImageFrame';
import { StereoCameraObject } from './object';

@SerializableObject()
export class StereoImageFrame extends DataFrame {
    @SerializableMember()
    public left: ImageFrame;
    @SerializableMember()
    public right: ImageFrame;

    /**
     * Source object clone that captured the data frame
     *
     * @returns {StereoCameraObject} Source data object
     */
    get source(): StereoCameraObject {
        return super.source as StereoCameraObject;
    }

    /**
     * Set the source object clone that captured the data frame
     *
     * @param {StereoCameraObject} object Source data object
     */
    set source(object: StereoCameraObject) {
        super.source = object;
    }
}
