import { ImageFrame } from './ImageFrame';
import { SerializableObject } from '@openhps/core';

@SerializableObject()
export class VideoFrame extends ImageFrame {
    public fps: number;
    public width: number;
    public height: number;
    public fourcc: number;

    constructor() {
        super();
    }
}
