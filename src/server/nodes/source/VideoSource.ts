import { Mat } from '@u4/opencv4nodejs';
import { AbstractVideoSource } from '../../../common/nodes';

export class VideoSource extends AbstractVideoSource {
    protected readFrame(): Promise<Mat> {
        return this.videoCapture.readAsync();
    }
}
