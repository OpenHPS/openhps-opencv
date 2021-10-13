import { ImageFrame } from './ImageFrame';
import { SerializableObject } from '@openhps/core';
import { Mat } from 'opencv4nodejs';
import { CameraObject } from './object';

@SerializableObject()
export class VideoFrame<I = Mat, C extends CameraObject = CameraObject> extends ImageFrame<I, C> {}
