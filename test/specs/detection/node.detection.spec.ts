import 'mocha';
import { ImageFrame, OpenCV as cv, ImageResizeNode, ImageSource } from '../../../src';
import { ModelBuilder, CallbackSinkNode, ProcessingNode } from '@openhps/core';
import { ROTATE_90_CLOCKWISE } from 'opencv4nodejs';
import { expect } from 'chai';

describe('node processing', () => {
    describe('image detection', () => {

        it('should detect blobs', (done) => {
            const imageSource = new ImageSource();
            ModelBuilder.create()
                .from(imageSource)
                .via(new ImageResizeNode({
                    width: 600
                }))
                .via(new (class BallTracking extends ProcessingNode<ImageFrame> {
                    public process(frame: ImageFrame): Promise<ImageFrame> {
                        return new Promise((resolve, reject) => {
                            frame.image.rotateAsync(ROTATE_90_CLOCKWISE).then(mat => {
                                return mat.cvtColorAsync(cv.COLOR_BGR2HSV);
                            }).then(mat => {
                                return mat.inRangeAsync(new cv.Vec3(80, 150, 150), new cv.Vec3(250, 250, 250));
                            }).then(mat => {
                                return mat.dilateAsync(new cv.Mat(), new cv.Point2(0, 0), 2);
                            }).then(mat => {
                                frame.image = mat;
                                return mat.findContoursAsync(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
                            }).then((contours: cv.Contour[]) => {
                                if (contours.length >= 1) {
                                    // Sort contours by area
                                    contours = contours.sort((a, b) => a.area - b.area);
                                    // Select the contour with the largest area size
                                    const m = contours[0].moments();
                                    const center = new cv.Vec2(m.m10 / m.m00, m.m01 / m.m00);
                                    expect(Math.round(center.x)).to.equal(624);
                                    expect(Math.round(center.y)).to.equal(340);
                                    done();
                                }
                                resolve(frame);
                            }).catch(reject);
                        });
                    }
                }))
                .to(new CallbackSinkNode((frame: ImageFrame) => {

                }))
                .build().then(model => {
                    imageSource.pushImage("./test/data/data-image-sphero.jpg");
                }).catch(done);
        }).timeout(30000);
        
    });
});