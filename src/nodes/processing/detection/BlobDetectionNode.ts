import { ImageFrame } from "../../../data";
import { GraphShape, NodeOptions } from '@openhps/core';
import { ImageErodeNode } from "../ImageErodeNode";
import { ImageDilateNode } from "../ImageDilateNode";

export class BlobDetectionNode<InOut extends ImageFrame> extends GraphShape<InOut, InOut> {
    protected options: BlobDetectionOptions;

    constructor(options?: BlobDetectionOptions) {
        super();
        this.options = options || {};
    
        this._build();
    }

    private _build(): void {
        this.addNode(new ImageErodeNode());
        this.addNode(new ImageDilateNode());
    }

}

export interface BlobDetectionOptions extends NodeOptions {

}
