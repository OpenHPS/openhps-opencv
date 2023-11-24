import { imdecode, imencode, Mat } from '@u4/opencv4nodejs';
import { DataSerializer } from '@openhps/core';

/**
 * Initialize OpenHPS OpenCV types
 */
export function initialize() {
    DataSerializer.registerType(Mat, {
        serializer: (image: Mat) => {
            if (!image) {
                return undefined;
            }
            return imencode('.jpg', image);
        },
        deserializer: (buffer: Buffer) => {
            if (!buffer) {
                return undefined;
            }
            return imdecode(buffer);
        },
    });
}

if (typeof window === 'object' && (window as any).cv.Mat) {
    initialize();
} else {
    initialize();
}

export * from './features';
export * from '@openhps/video';
export * as OpenCV from '@u4/opencv4nodejs';
