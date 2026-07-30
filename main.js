const cnv = document.createElement("canvas");
const ctx = cnv.getContext("2d");
cnv.width = 1300;
cnv.height = 512;
document.body.appendChild(cnv);
ctx.fillStyle = "#000000";
ctx.font = "40px Arial";

const SIZE = cnv.height / (64 - 48);
const midiRects = [];

let ID;
let time = performance.now();
let prevPitch = -1;

function loop() {
  ID = requestAnimationFrame(loop);
  const newTime = performance.now();
  const t = newTime - time;
  time = newTime;

  const midi = currentPitch;

  for (let i = midiRects.length - 1; i >= 0; i--) {
    if (midiRects[i].offscreen()) {
      midiRects.splice(i, 1);
    }
  }
  
  if (ID % 8 == 0) {
    if (midi > 0) {
      midiRects.push(new MidiRect(midi));
    }
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, cnv.width, cnv.height);

  for (rect of midiRects) {
    rect.update();
    rect.draw(ctx);
  }

  ctx.fillText(midi + " " + t, 20, 50);
}

loop();

class MidiRect {
  constructor(midi) {
    this.midi = midi;

    this.x = 500;
    this.y = 7 * SIZE;
    this.w = 10;
    this.h = SIZE;
    this.xVel = -1;
  }

  offscreen() {
    return this.x < 0;
  }
  update() {
    this.x += this.xVel;
  }
  draw(ctx) {
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}
