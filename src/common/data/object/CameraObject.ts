import { SerializableObject, SerializableMember, DataObject, Vector2, SerializableArrayMember } from '@openhps/core';

/**
 * Camera source object
 */
@SerializableObject()
export class CameraObject extends DataObject {
    /**
     * Number of columns (width)
     */
    @SerializableMember()
    cols: number;

    /**
     * Focal length
     */
    @SerializableMember()
    focalLength: Vector2;

    /**
     * Principal point
     */
    @SerializableMember()
    principalPoint: Vector2;

    /**
     * Skew coefficient
     */
    @SerializableMember()
    skewCoefficient: number;

    /**
     * Distortion coefficients
     */
    @SerializableArrayMember(Number)
    distortionCoefficients: number[];

    /**
     * Number of rows (height)
     */
    @SerializableMember()
    rows: number;

    /**
     * Camera model type
     */
    @SerializableMember()
    type: CameraType;
}

export enum CameraType {
    PINHOLE,
    FISHEYE,
    PERSPECTIVE,
    EQUIRECTANGULAR,
    UNKNOWN,
}
