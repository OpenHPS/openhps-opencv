import { CallbackSinkNode, ModelBuilder } from '@openhps/core';
import { expect } from 'chai';
import 'mocha';
import { CameraCalibrationNode, CameraObject, ImageFrame, ImageResizeNode, ImageSource, VideoSource } from '../../src';

describe('video', () => {
    describe('calibration', () => {

        // it('should calibrate a camera object from images', (done) => {
        //     const callbackSinkNode = new CallbackSinkNode();
        //     let model;
        //     let source = new ImageSource({
        //         source: new CameraObject("samsung-s20fe"),
        //     });
        //     ModelBuilder.create()
        //         .from(source)
        //         .via(new ImageResizeNode({
        //             width: 1920,
        //             height: 1080
        //         }))
        //         .via(new CameraCalibrationNode({
        //             boardSize: [6, 9],
        //             drawChessboardCorners: true,
        //             minFrames: 32
        //         }))
        //         .to(callbackSinkNode)
        //         .build().then(m => {
        //             model = m;
        //             callbackSinkNode.callback = (frame: ImageFrame) => {
        //                 if (frame.source.distortionCoefficients) {
        //                     console.log(frame.source.distortionCoefficients, frame.source.cameraMatrix)
        //                     expect(frame.source.distortionCoefficients.length).to.equal(5);
        //                     done();
        //                     model.destroy();
        //                 }
        //             }
        //             source.loadDirectory("test/data/calibration3");
        //             model.on('error', done);
        //         });
        // }).timeout('5m');

        // it('should calibrate a camera object from a video', (done) => {
        //     const callbackSinkNode = new CallbackSinkNode();
        //     let model;
        //     let source = new VideoSource({
        //         source: new CameraObject("samsung-s20fe2"),
        //         autoPlay: false,
        //         videoSource: "./test/data/data_chessboard3.mp4"
        //     });
        //     ModelBuilder.create()
        //         .from(source)
        //         .via(new CameraCalibrationNode({
        //             boardSize: [6, 9],
        //             drawChessboardCorners: true,
        //             minFrames: source.totalFrameCount
        //         }))
        //         .to(callbackSinkNode)
        //         .build().then(m => {
        //             model = m;
        //             callbackSinkNode.callback = (frame: ImageFrame) => {
        //                 if (frame.source.distortionCoefficients) {
        //                     console.log(frame.source.distortionCoefficients, frame.source.cameraMatrix)
        //                     expect(frame.source.distortionCoefficients.length).to.equal(5);
        //                     done();
        //                     model.destroy();
        //                 }
        //             }
        //             source.play();
        //             model.on('error', done);
        //         });
        // }).timeout('5m');
        
    });
});