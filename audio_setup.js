let audioContext;
let sampleRate;

async function startAudio() {

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true
  });

  audioContext = new AudioContext();
  sampleRate = audioContext.sampleRate;

  console.log("prima del caricamento ciao");

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

    console.log("frequency: ", frequency);
};


  const source = audioContext.createMediaStreamSource(stream);

  source.connect(workletNode);
}


startAudio();
