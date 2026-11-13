// Resolve the local OpenCV prebuilt libraries (opencv-build-npm) so that the
// @u4/opencv4nodejs native bindings can load them in this environment.
// Existing environment variables always take precedence.
const fs = require('fs');
const path = require('path');

if (!process.env.OPENCV_BUILD_ROOT) {
    for (const candidate of ['esm', 'script', 'dist']) {
        const root = path.join(__dirname, '..', 'node_modules', '@u4', 'opencv-build', candidate);
        if (
            fs.existsSync(root) &&
            fs.readdirSync(root).some(
                (dir) => dir.startsWith('opencv-') && fs.existsSync(path.join(root, dir, 'auto-build.json')),
            )
        ) {
            process.env.OPENCV_BUILD_ROOT = root;
            break;
        }
    }
}
