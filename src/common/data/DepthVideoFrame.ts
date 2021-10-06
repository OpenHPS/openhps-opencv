import { SerializableObject } from '@openhps/core';
import { Mat } from 'opencv4nodejs';
import { DepthImageFrame } from './DepthImageFrame';
import { CameraObject } from './object';

@SerializableObject()
export class DepthVideoFrame<I = Mat, C extends CameraObject = CameraObject> extends DepthImageFrame<I, C> {}
