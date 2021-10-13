import { SourceNode } from '@openhps/core';
import { VideoFrame, ImageFrame, CameraObject } from '@openhps/video';
import { Mat, imread } from 'opencv4nodejs';
import * as fs from 'fs';
import * as path from 'path';

export class ImageSource extends SourceNode<ImageFrame> {
    get source(): CameraObject {
        return super.source as CameraObject;
    }

    loadDirectory(directory: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.readdir(directory, (err, files) => {
                if (err) {
                    return reject(err);
                }

                let promise: Promise<void> = Promise.resolve();
                for (let i = 0; i < files.length; i++) {
                    promise = promise.then(() => this.pushImage(path.join(directory, files[i])));
                }
                promise
                    .then(() => {
                        resolve();
                    })
                    .catch(reject);
            });
        });
    }

    pushImage(file: string): Promise<void>;
    pushImage(image: Mat): Promise<void>;
    pushImage(image: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const imageFrame = new ImageFrame();
            imageFrame.source = this.source;
            const frameImage: Mat = image instanceof Mat ? image : imread(image);

            if (frameImage.empty) {
                return reject(new Error());
            }
            imageFrame.image = frameImage;
            this.onceCompleted(imageFrame.uid)
                .then(() => {
                    resolve();
                })
                .catch(reject);
            this.push(imageFrame);
        });
    }

    /**
     * Pull the next image frame
     *
     * @returns {Promise<VideoFrame>} Pull promise
     */
    onPull(): Promise<VideoFrame> {
        return new Promise<VideoFrame>((resolve) => {
            resolve(undefined);
        });
    }
}
