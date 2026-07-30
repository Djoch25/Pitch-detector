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
      midiRects.push(new midiRect(midi));
    }
  }

  for (rect of midiRects) {
    rect.update();
    rect.draw(ctx);
  }

  ctx.fillText(midi + " " + t, 20, 50);
}

loop();
