import { imdecode, imencode, Mat } from 'opencv4nodejs';
import { DataSerializer } from '@openhps/core';

DataSerializer.registerType(Mat, {
    serializer: (image: Mat) => {
        if (!image) {
            return undefined;
        }
        return imencode('.jpg', image);
    },
    deserializer: (json: any) => {
        if (!json) {
            return undefined;
        }
        return imdecode(json);
    },
});

export * from './features';
export * from '@openhps/video';
