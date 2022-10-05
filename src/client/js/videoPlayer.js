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

let volumeValue = 0.5;
video.volume = volumeValue;
let nowPlaying = false;
let controlsTimeout = null;
let controlsMovementTimeout = null;

const hideControls = () => videoControls.classList.remove("showing");

const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
    videoControls.classList.add("showing");
    clearTimeout(controlsMovementTimeout);
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

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
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
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

const handleKeystroke = (event) => {
  console.log(event);
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);

  if (event.code == "Space") {
    event.preventDefault();
    handlePlayClick();
  }
  if (event.code == "KeyF") {
    handleFullscreen();
  }
  if (event.code == "KeyM") {
    handleMute();
  }
};

const showControlsWhenPaused = () => {
  if (video.paused) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
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
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
  showControlsWhenPaused();
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
  showControlsWhenPaused();
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleInputVolumeRange);
volumeRange.addEventListener("change", handleChangeVolumeRange);
video.addEventListener("loadeddata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleVideoEnded);
video.addEventListener("click", handlePlayClick);
timeline.addEventListener("input", handleTimelineChange);
timeline.addEventListener("mousedown", handleTimelineMouseDown);
timeline.addEventListener("mouseup", handleTimelineMouseUp);
window.addEventListener("keydown", handleKeystroke);
fullScreenBtn.addEventListener("click", handleFullscreen);
videoContainer.addEventListener("fullscreenchange", handleFullScreenBtn);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
