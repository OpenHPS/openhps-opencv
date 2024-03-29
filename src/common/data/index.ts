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

if (typeof window === 'object') {
    if ((window as any).cv.Mat) {
        initialize();
    } else {
        // eslint-disable-next-line
        var Module = {
            onRuntimeInitialized: function () {
                initialize();
            },
        };
    }
} else {
    initialize();
}

export * from './features';
export * from '@openhps/video';
