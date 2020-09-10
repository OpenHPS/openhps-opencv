import { VideoSource, VideoSink } from '../../src';
import { expect } from 'chai';
import 'mocha';
import { ModelBuilder } from '@openhps/core';

describe('video', () => {
    describe('output', () => {

        it('should save a video frame by frame', (done) => {
            let model;
            ModelBuilder.create()
                .from(new VideoSource(null, {
                    autoPlay: true,
                    videoSource: "./test/data/data-gaze-1.mp4"
                }))
                .to(new VideoSink({
                    codec: 'mp4v',
                    fps: 30,
                    filePath: './test/data/output.mp4',
                    width: 640,
                    height: 480
                }))
                .build().then(m => {
                    setTimeout(() => {
                        m.emit('destroy');
                        done();
                    }, 5000);
                });
        }).timeout(30000);

    });
});