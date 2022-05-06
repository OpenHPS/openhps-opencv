import { Rect } from '@u4/opencv4nodejs';
import { AbsolutePosition, SerializableObject } from '@openhps/core';

@SerializableObject()
export class ImageRectShape extends Rect {
    constructor(rect: Rect) {
        super(rect.x, rect.y, rect.width, rect.height);
    }

    public get center(): AbsolutePosition {
        return null;
    }

    public get squareSize(): number {
        return this.width * this.height;
    }
}
