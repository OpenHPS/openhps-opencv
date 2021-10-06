import { ImageFrame } from '../../../../common';
import { ProcessingNode, ProcessingNodeOptions } from '@openhps/core';
import { RETR_EXTERNAL, CHAIN_APPROX_SIMPLE, Contour } from 'opencv4nodejs';

export class ContourDetectionNode<InOut extends ImageFrame> extends ProcessingNode<InOut, InOut> {
    protected options: ContourDetectionOptions;

    constructor(options?: ContourDetectionOptions) {
        super(options);
    }

    process(frame: InOut): Promise<InOut> {
        return new Promise((resolve) => {
            if (frame.image) {
                const contours: Contour[] = frame.image.findContours(
                    this.options.mode ? this.options.mode : RETR_EXTERNAL,
                    this.options.method ? this.options.method : CHAIN_APPROX_SIMPLE,
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
