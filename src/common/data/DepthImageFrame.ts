import { ImageFrame } from './ImageFrame';
import { SerializableMember, SerializableObject } from '@openhps/core';
import { Mat } from 'opencv4nodejs';
import { CameraObject } from './object';

@SerializableObject()
export class DepthImageFrame<I = Mat, C extends CameraObject = CameraObject> extends ImageFrame<I, C> {
    @SerializableMember()
    depth: Mat;
}
