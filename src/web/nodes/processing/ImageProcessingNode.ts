import { ImageFrame, OpenCV } from '../../../common';
import { ProcessingNode, ProcessingNodeOptions } from '@openhps/core';

export abstract class ImageProcessingNode<InOut extends ImageFrame> extends ProcessingNode<InOut> {
    protected options: ImageProcessingOptions;

    constructor(options?: ImageProcessingOptions) {
        super(options);
    }

    public process(frame: InOut): Promise<InOut> {
        return new Promise((resolve, reject) => {
            if (frame.image) {
                this.processImage(frame.image, frame)
                    .then((image) => {
                        if (frame.image !== image) {
                            (frame.image as any).delete();
                        }
                        frame.image = image;
                        resolve(frame);
                    })
                    .catch(reject);
            } else {
                resolve(frame);
            }
        });
    }

    public abstract processImage(image: OpenCV.Mat, frame?: InOut): Promise<OpenCV.Mat>;
}

export type ImageProcessingOptions = ProcessingNodeOptions;
