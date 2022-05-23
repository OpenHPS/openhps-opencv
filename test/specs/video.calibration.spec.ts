import { CallbackSinkNode, ModelBuilder } from '@openhps/core';
import { expect } from 'chai';
import 'mocha';
import { CameraCalibrationNode, CameraObject, ImageFrame, ImageResizeNode, ImageSource } from '../../src';

describe('video', () => {
    describe('calibration', () => {

        it('should calibrate a camera object', (done) => {
            const callbackSinkNode = new CallbackSinkNode();
            let model;
            let source = new ImageSource({
                source: new CameraObject("samsung-s20fe"),
            });
            ModelBuilder.create()
                .from(source)
                .via(new ImageResizeNode({
                    width: 1920,
                    height: 1080
                }))
                .via(new CameraCalibrationNode({
                    boardSize: [6, 9],
                    drawChessboardCorners: true,
                    minFrames: 10
                }))
                .to(callbackSinkNode)
                .build().then(m => {
                    model = m;
                    callbackSinkNode.callback = (frame: ImageFrame) => {
                        if (frame.source.distortionCoefficients) {
                            //console.log(frame.source.distortionCoefficients, frame.source.cameraMatrix)
                            expect(frame.source.distortionCoefficients.length).to.equal(5);
                            done();
                        }
                    }
                    source.loadDirectory("test/data/calibration");
                    model.on('error', done);
                });
        }).timeout(3000000);
        
    });
});