import { imdecode, imencode, Mat } from 'opencv4nodejs';
import { TypedJSON } from 'typedjson';

TypedJSON.mapType(Mat, {
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
export * from './object';
export * from './VideoFrame';
export * from './ImageFrame';
export * from './StereoImageFrame';
export * from './StereoVideoFrame';
export * from './DepthImageFrame';
export * from './DepthVideoFrame';
