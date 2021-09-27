import { DataFrame, SerializableObject, SerializableMember, StereoCameraObject } from '@openhps/core';
import { imdecode, imencode, Mat } from 'opencv4nodejs';

@SerializableObject()
export class StereoImageFrame extends DataFrame {
    @SerializableMember({
        serializer: (image: Mat) => {
            return imencode('.jpg', image);
        },
        deserializer: (json: any) => {
            return imdecode(json);
        },
    })
    public leftImage: Mat;
    @SerializableMember({
        serializer: (image: Mat) => {
            return imencode('.jpg', image);
        },
        deserializer: (json: any) => {
            return imdecode(json);
        },
    })
    public rightImage: Mat;

    /**
     * Source object clone that captured the data frame
     *
     * @returns {StereoCameraObject} Source data object
     */
    get source(): StereoCameraObject {
        return this.source;
    }

    /**
     * Set the source object clone that captured the data frame
     *
     * @param {StereoCameraObject} object Source data object
     */
    set source(object: StereoCameraObject) {
        this.source = object;
    }
}
