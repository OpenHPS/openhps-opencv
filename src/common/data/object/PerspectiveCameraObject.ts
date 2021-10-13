import { SerializableMember, SerializableObject } from '@openhps/core';
import { CameraObject } from './CameraObject';

@SerializableObject()
export class PerspectiveCameraObject extends CameraObject {
    /**
     * Camera frustum vertical field of view.
     */
    @SerializableMember()
    fov: number;

    /**
     * Camera frustum near plane.
     */
    @SerializableMember()
    near: number;

    /**
     * Camera frustum far plane.
     */
    @SerializableMember()
    far: number;

    constructor(uid?: string, displayName?: string, width?: number, height?: number, fov = 50, near = 0.1, far = 2000) {
        super(uid, displayName, width, height);
        this.fov = fov;
        this.near = near;
        this.far = far;
    }
}
