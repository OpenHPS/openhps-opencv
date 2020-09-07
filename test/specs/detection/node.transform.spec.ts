import 'mocha';
import { OpenCV as cv, ImageResizeNode, ImageSource, ImageTransformNode, ImageFrame } from '../../../src';
import { ModelBuilder, CallbackSinkNode } from '@openhps/core';
import { expect } from 'chai';

describe('node processing', () => {
    describe('image transformation', () => {

        it('should be serializable', (done) => {
            const imageSource = new ImageSource();

            ModelBuilder.create()
                .from(imageSource)
                .via(new ImageResizeNode({
                    width: 600
                }))
                .via(new ImageTransformNode({
                    src: [
                        new cv.Point2(115, 114),
                        new cv.Point2(488, 115),
                        new cv.Point2(599, 423),
                        new cv.Point2(13, 419),
                    ],
                    width: 500,
                    height: 500
                }))
                .to(new CallbackSinkNode((frame: ImageFrame) => {
                    expect(frame.image.sizes[0]).to.equal(500);
                    expect(frame.image.sizes[1]).to.equal(500);
                    done();
                }))
                .build().then(model => {
                    imageSource.pushImage("./test/data/data-image-chess.jpg");
                }).catch(done);
        }).timeout(30000);
        
    });
});