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
      console.log("fps loop start");
      started = true;
      loopFunction();
    },
    stop: () => {
      console.log("fps loop stop");
      started = false;
    },
    setFPS: (newFPS: number) => {
      fps = newFPS;
    },
  };
}

export type fpsLoopType = ReturnType<typeof fpsLoop>;
