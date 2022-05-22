import { imdecode, imencode, Mat } from '@u4/opencv4nodejs';
import { DataSerializer } from '@openhps/core';

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

export * from './features';
export * from '@openhps/video';
