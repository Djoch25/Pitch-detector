class Coin {
  constructor(note) {
    this.x = 1400;
    this.y = (6 - note * 0.5) * SIZE;
    this.w = SIZE * 0.5;
    this.h = this.w;

    this.velX = -1;
  }

  offscreen() {
    return this.x < 20;
  }

  update() {
    this.x += this.velX;
  }

  draw(ctx) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(this.x - this.w * 0.5, this.y - this.h * 0.5, this.w, this.h);
  }
}
