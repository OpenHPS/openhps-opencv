import { CallbackSinkNode, DataSerializer, ModelBuilder } from '@openhps/core';
import { expect } from 'chai';
import 'mocha';
import { imread, imshow, imshowWait } from 'opencv4nodejs';
import { CameraCalibrationNode, CameraObject, ImageFrame, VideoSource } from '../../src';

describe('video', () => {
    describe('calibration', () => {

        it('should calibrate a camera object', (done) => {
            const callbackSinkNode = new CallbackSinkNode();
            let model;
            ModelBuilder.create()
                .from(new VideoSource({
                    source: new CameraObject("samsung-s20fe")
                }).load("./test/data/data-chessboard.mp4"))
                .via(new CameraCalibrationNode({
                    boardSize: [6, 9],
                    drawChessboardCorners: true,
                    minFrames: 0
                }))
                .to(callbackSinkNode)
                .build().then(m => {
                    model = m;
                    callbackSinkNode.callback = (frame: ImageFrame) => {
                        expect(frame.source.distortionCoefficients.length).to.equal(5);
                        done();
                    }
                    model.on('error', done);
                    model.pull();
                });
        }).timeout(30000);
        
    });
});