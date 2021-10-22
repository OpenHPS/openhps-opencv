Scripts to build opencv4nodejs on ubuntu 18.04. ([Repository](https://hub.docker.com/r/maximvdw/opencv-nodejs/tags/)).
Based on: https://github.com/justadudewhohacks/opencv4nodejs-docker-images/tree/master/opencv-nodejs

Usage:
``` bash
./build.sh <OpenCV version> <with contrib?> <node major version>
```

Build OpenCV 3.4.1 with contrib and node version 9.x:
``` bash
./build.sh 3.4.1 y 9
```