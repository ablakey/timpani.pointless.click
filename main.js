const playButton = document.querySelector("button");
const audioElement = document.querySelector("audio");
const input = document.querySelector("input");

let context;
let lastSound = 0;
let audioBuffer;
let isPlaying = false;

function makeSource(buffer) {
  var source = context.createBufferSource();
  var compressor = context.createDynamicsCompressor();
  var gain = context.createGain();
  gain.gain.value = 0.2;
  source.buffer = buffer;
  source.connect(gain);
  gain.connect(compressor);
  compressor.connect(context.destination);
  return source;
}

async function setup() {
  // set up context.
  context = new AudioContext();

  // Get audio.
  const sound = await fetch("/timpani.mp3");
  const buffer = await sound.arrayBuffer();
  audioBuffer = await context.decodeAudioData(buffer);

  source = context.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(context.destination);
}

function doSound() {
  if (!isPlaying) {
    return;
  }

  const bpm = input.value;
  const bps = input.value / 60;

  const now = performance.now();
  if (now - lastSound > 1000 / bps) {
    lastSound = now;
    var source = makeSource(audioBuffer);
    source.start(context.currentTime);
  }

  window.requestAnimationFrame(doSound);
}

playButton.onclick = () => {
  isPlaying = !isPlaying;
  if (isPlaying) {
    doSound();
  }
};

setup();
