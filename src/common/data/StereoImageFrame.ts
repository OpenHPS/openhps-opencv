import { DataFrame, SerializableObject, SerializableMember } from '@openhps/core';
import { Mat } from 'opencv4nodejs';
import { ImageFrame } from './ImageFrame';
import { PerspectiveCameraObject, StereoCameraObject } from './object';

@SerializableObject()
export class StereoImageFrame<I = Mat> extends DataFrame {
    @SerializableMember()
    left: ImageFrame<I, PerspectiveCameraObject>;
    @SerializableMember()
    right: ImageFrame<I, PerspectiveCameraObject>;

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
