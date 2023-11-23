import { imdecode, imencode, Mat } from '@u4/opencv4nodejs';
import * as cv from '@techstark/opencv-js';
import { DataSerializer } from '@openhps/core';

/**
 *
 */
function registerTypes() {
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

if (typeof window === 'object') {
    (cv as any).onRuntimeInitialized = () => {
        registerTypes();
    };
} else {
    registerTypes();
}

export * from './features';
export * from '@openhps/video';
export * as OpenCV from '@u4/opencv4nodejs';
