import { ImageFrame } from '../../../../common';
import { ProcessingNode, ProcessingNodeOptions } from '@openhps/core';
import { cv } from '../../../cv';

export class ContourDetectionNode<InOut extends ImageFrame> extends ProcessingNode<InOut, InOut> {
    protected options: ContourDetectionOptions;

    constructor(options?: ContourDetectionOptions) {
        super(options);
    }

    process(frame: InOut): Promise<InOut> {
        return new Promise((resolve) => {
            if (frame.image) {
                // eslint-disable-next-line
                const contours: cv.Contour[] = frame.image.findContours(
                    this.options.mode ? this.options.mode : cv.RETR_EXTERNAL,
                    this.options.method ? this.options.method : cv.CHAIN_APPROX_SIMPLE,
                );
            }
            resolve(frame);
        });
    }
}

export interface ContourDetectionOptions extends ProcessingNodeOptions {
    mode?: number;
    method?: number;
}
