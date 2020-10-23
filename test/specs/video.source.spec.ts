import { VideoSource, ImageFrame, ImageDisplaySink, OpenCV } from '../../src';

import { expect } from 'chai';
import 'mocha';
import { ModelBuilder, SinkNode, TimedPullNode, TimeUnit, CallbackSinkNode } from '@openhps/core';

describe('video', () => {
    describe('input', () => {

        it('should load video frames from file', (done) => {
            const callbackSinkNode = new CallbackSinkNode();
            let image1;
            let model;
            ModelBuilder.create()
                .from(new VideoSource().load("./test/data/data-gaze-1.mp4"))
                .to(callbackSinkNode)
                .build().then(m => {
                    model = m;
                    callbackSinkNode.callback = (frame: ImageFrame) => {
                        image1 = frame.image;
                        expect(image1.getData().byteLength).to.equal(6220800);
                    }
                    return model.pull();
                }).then(() => {
                    callbackSinkNode.callback = (frame: ImageFrame) => {
                        const image2 = frame.image;
                        expect(image2.getData().byteLength).to.equal(6220800);
                        expect(image1).to.not.equal(image2);
                        done();
                    }
                    Promise.resolve(model.pull());
                });
        }).timeout(30000);

        it('should reset video', (done) => {
            const videoInput = new VideoSource().load("./test/data/data-gaze-1.mp4");
            ModelBuilder.create()
                .from(videoInput)
                .to(new (class DebugSink extends SinkNode<ImageFrame> {
                    public onPush(data: ImageFrame): Promise<void> {
                        return new Promise((resolve, reject) => {
                            const image1 = data.image;
                            expect(image1.getData().byteLength).to.equal(6220800);
                            videoInput.reset();
                            // const image2 = frame.getImage();
                            // expect(image2.getData().byteLength).to.equal(6220800);
                            // expect(image1).to.not.equal(image2);
                            done();
                            resolve();
                        });
                    }
                })())
                .build().then(model => {
                    Promise.resolve(model.pull());
                });
        }).timeout(10000);
        
        it('fps', (done) => {
            const callbackSinkNode = new CallbackSinkNode();
            let model;
            let videoSource = new VideoSource(undefined, {
                autoPlay: true,
                fps: 60
            }).load(0 + OpenCV.CAP_DSHOW);
            videoSource.videoCapture.set(OpenCV.CAP_PROP_FOURCC, OpenCV.VideoWriter.fourcc('MJPG'));
            videoSource.videoCapture.set(OpenCV.CAP_PROP_FPS, 30);
            videoSource.videoCapture.set(OpenCV.CAP_PROP_FRAME_WIDTH, 1980);
            videoSource.videoCapture.set(OpenCV.CAP_PROP_FRAME_HEIGHT, 1020);
            ModelBuilder.create()
                .from(videoSource)
                .to(new ImageDisplaySink())
                .build().then(m => {
                    model = m;
                });
        }).timeout(30000);

    });
});