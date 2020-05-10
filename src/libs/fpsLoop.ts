function loop(func: () => void, fps: number) {
  setTimeout(() => requestAnimationFrame(func), 1000 / fps);
}

export function fpsLoop(func: () => void, initialFPS: number) {
  let started = false;

  let fps = initialFPS;

  function loopFunction() {
    func();
    started && loop(loopFunction, fps);
  }

  return {
    start: () => {
      started = true;
      loopFunction();
    },
    stop: () => {
      started = false;
    },
    setFPS: (newFPS: number) => {
      fps = newFPS;
    },
  };
}

export type fpsLoopType = ReturnType<typeof fpsLoop>;
