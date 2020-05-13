import React from "react";

import { FullSizes, getVideoElementSizes, getVideoSize, initialFullSizes } from "../../libs/sizes";

export function useVideoElementSizes(videoElement: HTMLVideoElement) {
  const [size, setSize] = React.useState<FullSizes>(initialFullSizes);

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
