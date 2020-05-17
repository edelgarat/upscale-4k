import { without } from "ramda";

import { runForVideoElement } from "./app";
import { onDomElementRemoved } from "./libs/onDomElementRemoved";
import { convertNodeListToArray } from "./libs/convertNodeListToArray";

function findVideoElements(where: HTMLElement) {
  return convertNodeListToArray(where.getElementsByTagName("video")) as HTMLVideoElement[];
}

type EnhancedHTMLVideoElement = HTMLVideoElement & { destroySubscribed?: boolean; onRemoveHandler?: () => void };
let foundVideos: EnhancedHTMLVideoElement[] = [];

function runSearch() {
  const videoElements = findVideoElements(document.body);
  videoElements.forEach((video: EnhancedHTMLVideoElement) => {
    if (foundVideos.includes(video)) return;
    video.onRemoveHandler = runForVideoElement(video);
    foundVideos.push(video);
  });
}

function runCleaner() {
  foundVideos.forEach((video) => {
    if (video.destroySubscribed) return;
    video.destroySubscribed = true;
    onDomElementRemoved(video, function () {
      foundVideos = without([video], foundVideos);
      video.onRemoveHandler();
    });
  });
}

function initialize() {
  console.log("initialize upscale 4k");
  runSearch();

  setInterval(() => {
    runSearch();
    runCleaner();
  }, 1000);
}

window.onload = initialize;
