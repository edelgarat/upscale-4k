import { Size, SizeAndSquare } from "../Renderer/hooks/useVideoElementSize";

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
