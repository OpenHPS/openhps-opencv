import { VideoSource, VideoSink } from '../../src';
import { expect } from 'chai';
import 'mocha';
import { ModelBuilder } from '@openhps/core';

describe('video', () => {
    describe('output', () => {

        it('should save a video frame by frame', (done) => {
            const source = new VideoSource(null, {
                autoPlay: true,
                videoSource: "./test/data/data-gaze-1.mp4",
                fps: -1,
                throttleRead: true,
                throttlePush: true
            });
            ModelBuilder.create()
                .from(source)
                .to(new VideoSink({
                    codec: 'mp4v',
                    filePath: './test/data/output.mp4',
                    fps: 30
                }))
                .build().then(m => {
                    setTimeout(() => {
                        m.destroy();
                        done();
                    }, 1000);
                });
        }).timeout(30000);

    });
});