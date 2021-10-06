import { DataSerializer } from '@openhps/core';
import { expect } from 'chai';
import 'mocha';
import { imread } from 'opencv4nodejs';
import { ImageFrame } from '../../src';

describe('image', () => {
    describe('frame', () => {

        it('should be serializable', () => {
            const frame = new ImageFrame();
            frame.image = imread("./test/data/data-image-chess.jpg");
            const serializedFrame = DataSerializer.serialize(frame);
            console.log(serializedFrame)
            const deserializedFrame: ImageFrame = DataSerializer.deserialize(serializedFrame);
            expect(deserializedFrame.image).to.eql(frame.image);
        });
        
    });
});