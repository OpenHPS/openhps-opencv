import { ProcessingNode, ProcessingNodeOptions } from '@openhps/core';
import { ColorOrder, ImageFrame } from '@openhps/video';
import { cv } from '../../cv';

export class Uint8ImageToMat<In extends ImageFrame, Out extends ImageFrame> extends ProcessingNode<In, Out> {
    protected frameType: new (...args: any[]) => Out;

    constructor(frameType: new (...args: any[]) => Out, options?: ProcessingNodeOptions) {
        super(options);
        this.frameType = frameType;
    }

    process(frame: In): Promise<Out> {
        return new Promise((resolve) => {
            const newFrame = new this.frameType(frame);
            newFrame.height = frame.height;
            newFrame.width = frame.width;
            let type = cv.CV_8UC4;
            switch (frame.source.colorOrder) {
                case ColorOrder.RGB:
                case ColorOrder.BGR:
                    type = cv.CV_8UC3;
                    break;
                case ColorOrder.RGBA:
                case ColorOrder.BGRA:
                    type = cv.CV_8UC4;
                    break;
            }
            const image = cv.matFromArray(frame.height, frame.width, type, Array.prototype.slice.call(frame.image));
            newFrame.image = image;
            resolve(newFrame);
        });
    }
}
