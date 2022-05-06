import { VideoSource, FaceDetectionNode, EyeDetectionNode, ImageFrame, ImageFeatureObject } from '../../src';
import { expect } from 'chai';
import 'mocha';
import { SinkNode, TimedPullNode, TimeUnit } from '@openhps/core';
import { ModelBuilder } from '@openhps/core';

describe('video', () => {
    describe('object classifier', () => {

        it('should detect a face and two eyes', (done) => {
            ModelBuilder.create()
                .from(new VideoSource().load("./test/data/data-gaze-1.mp4"))
                .via(new FaceDetectionNode())
                .via(new EyeDetectionNode())
                .to(new (class DebugSink extends SinkNode<ImageFrame> {
                    public onPush(data: ImageFrame): Promise<void> {
                        return new Promise((resolve, reject) => {
                            expect(data.getObjects(ImageFeatureObject).length).to.equal(3);
                            done();
                            resolve();
                        });
                    }
                })())
                .build().then(model => {
                    Promise.resolve(model.pull());
                });
        }).timeout(30000);
        
    });
});