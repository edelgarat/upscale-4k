import React from "react";

export type Rect = { x: number; y: number };
export type Size = { width: number; height: number };
export type SizeAndSquare = Size & { square: number };

function getSquare(size: Size) {
  return size.width * size.height;
}

function sizeAndSquare(size: Size) {
  return { width: size.width, height: size.height, square: getSquare(size) };
}

function getVideoElementSizes(video: HTMLVideoElement) {
  const rect = video.getBoundingClientRect();
  return { ...sizeAndSquare({ width: rect.width, height: rect.height }), x: rect.x, y: rect.y };
}

function getVideoSize(video: HTMLVideoElement) {
  return sizeAndSquare({ width: video.videoWidth, height: video.videoHeight });
}

type FullSizes = { videoElement: SizeAndSquare & Rect; video: SizeAndSquare };

export function useVideoElementSize(videoElement: HTMLVideoElement) {
  const [size, setSize] = React.useState<FullSizes>(() => ({
    video: { width: 0, height: 0, square: 0 },
    videoElement: { width: 0, height: 0, square: 0, x: 0, y: 0 },
  }));

  const sizeRef = React.useRef(size);

  React.useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  React.useEffect(() => {
    const run = () => {
      const currentVideoSize = getVideoSize(videoElement);
      const currentVideoElementSize = getVideoElementSizes(videoElement);

      if (
        currentVideoSize.square === sizeRef.current.video.square &&
        currentVideoElementSize.square === sizeRef.current.videoElement.square
      )
        return;

      setSize({ video: currentVideoSize, videoElement: currentVideoElementSize });
    };
    run();

    const videoSizeInterval = setInterval(run, 1000);
    return () => clearInterval(videoSizeInterval);
  }, []);

  return size;
}
