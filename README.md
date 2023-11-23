<h1 align="center">
  <img alt="OpenHPS" src="https://openhps.org/images/logo_text-512.png" width="40%" /><br />
  @openhps/opencv
</h1>
<p align="center">
    <a href="https://github.com/OpenHPS/openhps-opencv/actions/workflows/main.yml" target="_blank">
        <img alt="Build Status" src="https://github.com/OpenHPS/openhps-opencv/actions/workflows/main.yml/badge.svg">
    </a>
    <a href="https://codecov.io/gh/OpenHPS/openhps-opencv">
        <img src="https://codecov.io/gh/OpenHPS/openhps-opencv/branch/master/graph/badge.svg"/>
    </a>
    <a href="https://codeclimate.com/github/OpenHPS/openhps-opencv/" target="_blank">
        <img alt="Maintainability" src="https://img.shields.io/codeclimate/maintainability/OpenHPS/openhps-opencv">
    </a>
    <a href="https://badge.fury.io/js/@openhps%2Fopencv">
        <img src="https://badge.fury.io/js/@openhps%2Fopencv.svg" alt="npm version" height="18">
    </a>
</p>

<h3 align="center">
    <a href="https://github.com/OpenHPS/openhps-core">@openhps/core</a> &mdash; <a href="https://openhps.org/docs/opencv">API</a>
</h3>

<br />

This repository contains the OpenCV component for OpenHPS (Open Source Hybrid Positioning System). It uses [@u4/opencv4nodejs](https://www.npmjs.com/package/@u4/opencv4nodejs) bindings to create abstract image detection and tracking nodes.

OpenHPS is a data processing positioning framework. It is designed to support many different use cases ranging from simple positioning such as detecting the position of a pawn on a chessboard using RFID, to indoor positioning methods using multiple cameras.

## Features
- Image and video data frames and objects.
- Image tracking and detection.
- Image and video sources.

## Getting Started
If you have [npm installed](https://www.npmjs.com/get-npm), start using @openhps/csv with the following command.
```bash
npm install @openhps/opencv --save
```

### Web
- `openhps-opencv.js`: OpenHPS - OpenCV module containing OpenCV.js
- `openhps-opencv.external.js`: OpenHPS - OpenCV module without OpenCV.js

#### Building a custom OpenCV.js
```bash
git clone https://github.com/opencv/opencv.git
cd opencv
git clone https://github.com/opencv/opencv_contrib.git
docker run --rm -v $(pwd):/src -u $(id -u):$(id -g) \ 
    emscripten/emsdk:2.0.10 emcmake python3 ./platforms/js/build_js.py build_js \
    --cmake_option="-DOPENCV_EXTRA_MODULES_PATH=/src/opencv_contrib/modules/" \
    --cmake_option="-DBUILD_opencv_aruco=ON"
```

## Contributors
The framework is open source and is mainly developed by PhD Student Maxim Van de Wynckel as part of his research towards *Hybrid Positioning and Implicit Human-Computer Interaction* under the supervision of Prof. Dr. Beat Signer.

## Contributing
Use of OpenHPS, contributions and feedback is highly appreciated. Please read our [contributing guidelines](CONTRIBUTING.md) for more information.

## License
Copyright (C) 2019-2023 Maxim Van de Wynckel & Vrije Universiteit Brussel

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.