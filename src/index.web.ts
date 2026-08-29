/* eslint-disable import/export -- the overlap below is deliberate and
   resolved by the explicit re-export; see the comment on it. */
export * from './common';
export * from './web';

// Both `./common` (which re-exports @openhps/video) and `./web` declare
// ImageProcessingNode and ImageProcessingOptions, and two `export *` declarations
// exporting the same name is an error rather than a last-one-wins. @openhps/video
// grew those exports after this package was written; the OpenCV-backed
// implementations here are the ones @openhps/opencv means, so they are re-exported
// explicitly, which takes precedence over the wildcards.
export { ImageProcessingNode, ImageProcessingOptions } from './web/nodes/processing/ImageProcessingNode';
