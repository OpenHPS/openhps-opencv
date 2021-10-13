import { SerializableObject } from '@openhps/core';
import { Mat } from 'opencv4nodejs';
import { StereoImageFrame } from './StereoImageFrame';

@SerializableObject()
export class StereoVideoFrame<I = Mat> extends StereoImageFrame<I> {}
