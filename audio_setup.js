let audioContext;
let sampleRate;
let currentPitch;

async function startAudio() {

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true
  });

  audioContext = new AudioContext();
  sampleRate = audioContext.sampleRate;

  console.log("prima del caricamento");

  await audioContext.audioWorklet.addModule(
    "pitch_processor.js?v3"
  );

  console.log("dopo il caricamento");


  const workletNode = new AudioWorkletNode(
    audioContext,
    "pitch_processor"
  );

  console.log("nodo creato");

  workletNode.port.onmessage = (event) => {

    const frequency = event.data;

    //console.log("frequency: ", frequency);
    currentPitch = freqToMidi(frequency.frequency);
};


  const source = audioContext.createMediaStreamSource(stream);

  source.connect(workletNode);
}


startAudio();

const freqToMidi = (f) => {
    return Math.floor(Math.log2(f / 440) * 12) + 69;
}

const freqToNote = (freq) => {
  const midi = Math.floor(Math.log2(freq / 440) * 12) + 69;

  const okt = Math.floor(midi / 12);
  const noteIndex = midi - okt * 12;

  const notePool = ["DO", "DO#", "RE", "RE#", "MI", "FA", "FA#", "SOL", "SOL#", "LA", "LA#", "SI"];
  
  return notePool[noteIndex] + okt;
}

