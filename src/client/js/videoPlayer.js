const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");
const textArea = document.getElementById("textArea");

let volumeValue = 0.5;
video.volume = volumeValue;
let nowPlaying = false;
let controlsTimeout = null;
let controlsMovementTimeout = null;

const hideControls = () => videoControls.classList.remove("showing");

const showControls = () => videoControls.classList.add("showing");

const handleMute = (e) => {
  if (video.muted) {
    video.muted = false;
    video.volume = volumeValue;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleInputVolumeRange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtnIcon.classList = "fas fa-volume-up";
  }
  if (value == 0) {
    video.muted = true;
    muteBtnIcon.classList = "fas fa-volume-mute";
  }
  video.volume = value;
};

const handleChangeVolumeRange = (event) => {
  const {
    target: { value },
  } = event;
  if (value != 0) {
    volumeValue = value;
  }
};

const formatTime = (seconds) => {
  const startIdx = seconds >= 3600 ? 11 : 14;
  return new Date(seconds * 1000).toISOString().substring(startIdx, 19);
};

const handleLoadedMetaData = () => {
  if (video.readyState >= 2) {
    console.log(video.duration);
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
    showControls();
  }
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleVideoEnded = () => {
  video.currentTime = 0;
  playBtnIcon.classList = "fas fa-play";
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleTimelineMouseDown = () => {
  nowPlaying = video.paused ? false : true;
  video.pause();
};

const handleTimelineMouseUp = () => {
  if (nowPlaying) {
    video.play();
  } else {
    video.pause();
  }
};

const handleFullscreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
};

const handleFullScreenBtn = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    fullScreenIcon.classList = "fas fa-compress";
  } else {
    fullScreenIcon.classList = "fas fa-expand";
  }
};

const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
    controlsTimeout = setTimeout(hideControls, 3000);
  } else {
    video.pause();
    showControls();
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  showControls();
  if (!video.paused) {
    controlsMovementTimeout = setTimeout(hideControls, 3000);
  }
};

const handleMouseLeave = () => {
  if (!video.paused) {
    hideControls();
  }
};

const handleKeystroke = (event) => {
  showControls();
  if (event.target !== textArea) {
    if (event.code == "Space") {
      event.preventDefault();
      handlePlayClick();
      if (video.paused) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
      }
    }
    if (event.code == "KeyF") {
      handleFullscreen();
    }
    if (event.code == "KeyM") {
      handleMute();
    }
  }
};

const handleEnded = (e) => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, { method: "POST" });
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleInputVolumeRange);
volumeRange.addEventListener("change", handleChangeVolumeRange);
video.addEventListener("loadedmetadata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleVideoEnded);
video.addEventListener("click", handlePlayClick);
video.addEventListener("ended", handleEnded);
videoContainer.addEventListener("fullscreenchange", handleFullScreenBtn);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
timeline.addEventListener("mousedown", handleTimelineMouseDown);
timeline.addEventListener("mouseup", handleTimelineMouseUp);
window.addEventListener("keydown", handleKeystroke);
fullScreenBtn.addEventListener("click", handleFullscreen);
