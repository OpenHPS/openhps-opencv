import { DataFrame, SerializableObject, SerializableMember } from '@openhps/core';
import { Mat } from 'opencv4nodejs';

@SerializableObject()
export class StereoImageFrame extends DataFrame {
    private _leftImage: Mat;
    private _rightImage: Mat;

    @SerializableMember({
        serializer: (image: Mat): any => {
            if (image === undefined) {
                return undefined;
            }
            return image.getDataAsArray();
        },
        deserializer: (json: any): Mat => {
            if (json === undefined) {
                return undefined;
            }
            return new Mat(json);
        },
    })
    public get leftImage(): Mat {
        return this._leftImage;
    }

    public set leftImage(image: Mat) {
        this._leftImage = image;
    }

    @SerializableMember({
        serializer: (image: Mat): any => {
            if (image === undefined) {
                return undefined;
            }
            return image.getDataAsArray();
        },
        deserializer: (json: any): Mat => {
            if (json === undefined) {
                return undefined;
            }
            return new Mat(json);
        },
    })
    public get rightImage(): Mat {
        return this._rightImage;
    }

    public set rightImage(image: Mat) {
        this._rightImage = image;
    }
}
