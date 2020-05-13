export type Rect = { x: number; y: number };
export type Size = { width: number; height: number };
export type SizeAndSquare = Size & { square: number };
export type FullSizes = { videoElement: SizeAndSquare & Rect; video: SizeAndSquare };

export const initialFullSizes: FullSizes = {
  video: { width: 0, height: 0, square: 0 },
  videoElement: { width: 0, height: 0, square: 0, x: 0, y: 0 },
};

function getSquare(size: Size) {
  return size.width * size.height;
}

function sizeAndSquare(size: Size) {
  return { width: size.width, height: size.height, square: getSquare(size) };
}

export function getVideoElementSizes(video: HTMLVideoElement) {
  const rect = video.getBoundingClientRect();
  return { ...sizeAndSquare({ width: rect.width, height: rect.height }), x: rect.x, y: rect.y };
}

export function getVideoSize(video: HTMLVideoElement) {
  return sizeAndSquare({ width: video.videoWidth, height: video.videoHeight });
}

export function calculateVideoSizes(videoElement: SizeAndSquare, video: SizeAndSquare): Size {
  const videoDimension = video.width / video.height;

  const newWidth = videoElement.width;
  const newHeight = newWidth / videoDimension;
  if (newHeight < videoElement.height) {
    return { width: newWidth, height: newHeight };
  }

  const newHeight2 = videoElement.height;
  const newWidth2 = newHeight2 * videoDimension;
  return { width: newWidth2, height: newHeight2 };
}
