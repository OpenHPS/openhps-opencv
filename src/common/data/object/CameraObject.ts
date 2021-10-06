import { SerializableObject, SerializableMember, DataObject, SerializableArrayMember, Matrix3 } from '@openhps/core';

/**
 * Camera source object
 */
@SerializableObject()
export class CameraObject extends DataObject {
    /**
     * Width
     */
    @SerializableMember()
    width: number;

    /**
     * Height
     */
    @SerializableMember()
    height: number;

    /**
     * Distortion coefficients
     */
    @SerializableArrayMember(Number)
    distortionCoefficients: number[];

    @SerializableMember()
    cameraMatrix: Matrix3;

    /**
     * Camera frustum aspect ratio.
     */
    get aspect(): number {
        return this.width / this.height;
    }

    constructor(uid?: string, displayName?: string, width?: number, height?: number) {
        super(uid, displayName);
        this.width = width || 0;
        this.height = height || 0;
    }
}
