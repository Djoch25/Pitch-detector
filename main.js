const cnv = document.createElement("canvas");
const ctx = cnv.getContext("2d");
cnv.width = 1300;
cnv.height = 500;
document.body.appendChild(cnv);
ctx.fillStyle = "#000000";
ctx.font = "40px Arial";

const SIZE = 50;

function background() {
  ctx.clearRect(0, 0, 1300, 500);
  for (let i = 1; i <= 5; i++) {
    ctx.beginPath();
    ctx.moveTo(50, SIZE * i);
    ctx.lineTo(1000, SIZE * i);
    ctx.closePath();
    ctx.stroke();
  }
}

const coins = [];
const note = new Note();
let ID;
let time = performance.now();

function loop() {
  ID = requestAnimationFrame(loop);
  console.log(currentPitch);

  for (let i = coins.length - 1; i >= 0; i--) {
    if (coins[i].offscreen()) coins.splice(i, 1);
  }

  if (ID % 180 == 0) {
    const note = Math.floor(Math.random() * 7);
    coins.push(new Coin(note));
  }

  note.update();

  const midi = freqToMidi(currentPitch);
  switch(midi) {
  case 60: note.move(0); break;
  case 62: note.move(1); break;
  case 64: note.move(2); break;
  case 65: note.move(3); break;
  case 67: note.move(4); break;
  case 69: note.move(5); break;
  case 71: note.move(6); break;
  }

  background();

  for (let coin of coins) {
    coin.update();   
    coin.draw(ctx);
  }

  note.draw(ctx);

  ctx.fillText(freqToMidi(currentPitch), 20, 20);
}

loop();
