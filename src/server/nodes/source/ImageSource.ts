import { SourceNode } from '@openhps/core';
import { VideoFrame, ImageFrame, CameraObject } from '../../../common';
import { Mat, imread } from 'opencv4nodejs';

export class ImageSource extends SourceNode<ImageFrame> {
    get source(): CameraObject {
        return super.source as CameraObject;
    }

    public pushImage(file: string): Promise<void>;
    public pushImage(image: Mat): Promise<void>;
    public pushImage(image: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const imageFrame = new ImageFrame();
            imageFrame.source = this.source;
            const frameImage: Mat = image instanceof Mat ? image : imread(image);

            if (frameImage.empty) {
                return reject(new Error());
            }
            imageFrame.image = frameImage;
            this.push(imageFrame)
                .then(() => {
                    resolve();
                })
                .catch(reject);
        });
    }

    /**
     * Pull the next image frame
     *
     * @returns {Promise<VideoFrame>} Pull promise
     */
    public onPull(): Promise<VideoFrame> {
        return new Promise<VideoFrame>((resolve) => {
            resolve(undefined);
        });
    }
}
