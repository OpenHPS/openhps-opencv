import { DataFrame, SerializableObject } from '@openhps/core';
import { Mat } from 'opencv4nodejs';

@SerializableObject()
export class StereoImageFrame extends DataFrame {
    public leftImage: Mat;
    public rightImage: Mat;
}
