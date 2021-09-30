import { CameraObject } from './CameraObject';
import { SerializableObject, SerializableMember } from '@openhps/core';

@SerializableObject()
export class StereoCameraObject extends CameraObject {
    @SerializableMember()
    public leftCamera: CameraObject;
    @SerializableMember()
    public rightCamera: CameraObject;

    constructor(left?: CameraObject, right?: CameraObject) {
        super();
        this.leftCamera = left;
        this.rightCamera = right;
        if (left !== undefined && right !== undefined) {
            this.uid = left.uid + right.uid;
        }
    }
}
