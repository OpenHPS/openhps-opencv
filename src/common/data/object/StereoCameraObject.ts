import { CameraObject } from './CameraObject';
import { SerializableObject, SerializableMember } from '@openhps/core';
import { PerspectiveCameraObject } from './PerspectiveCameraObject';

@SerializableObject()
export class StereoCameraObject extends CameraObject {
    @SerializableMember()
    cameraL: PerspectiveCameraObject;
    @SerializableMember()
    cameraR: PerspectiveCameraObject;
    /**
     * Camera eye separation
     *
     * @default 0.064
     */
    @SerializableMember()
    eyeSep = 0.064;

    constructor(uid?: string, displayName?: string, left?: PerspectiveCameraObject, right?: PerspectiveCameraObject) {
        super(uid, displayName);
        this.cameraL = left;
        this.cameraR = right;
        if (left !== undefined && right !== undefined) {
            this.uid = left.uid + right.uid;
        }
    }
}
