class Note {
  constructor() {
    this.x = 100;
    this.y = SIZE * 6;
    this.w = SIZE * 0.75;
    this.h = this.w;

    this.velY = 0;

    this.newNoteY = this.y;
  }

  move(newNote) {
    this.newNoteY = (6 - newNote * 0.5) * SIZE;
    this.velY = (this.newNoteY - this.y) * 0.02;
  }

  update() {
    this.y += this.velY;

    if ((this.velY < 0 && this.y < this.newNoteY) || (this.velY > 0 && this.y > this.newNoteY)) {
      this.velY = 0;
      this.y = this.newNoteY;
    }
  }

  draw(ctx) {
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(this.x - this.w * 0.5, this.y - this.h * 0.5, this.w, this.h);
  }
}
