function loop(func: () => void, fps: number) {
  setTimeout(() => requestAnimationFrame(func), 1000 / fps);
}

export function fpsLoop(initialFPS: number) {
  let started = false;
  let func = () => null;

  let fps = initialFPS;

  function loopFunction() {
    if (started) {
      func();
      loop(loopFunction, fps);
    }
  }

  return {
    setFunc: (newFunc: () => void) => {
      func = newFunc;
    },
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
