export class Game {
  speed: number;
  t: number;
  x: number;
  y: number;
  r: number;

  constructor() {
    this.speed = 0.01;
    this.t = 0;
    this.x = 0;
    this.y = 0;
    this.r = 300;
  }

  update(deltaTimeSeconds: number) {
    this.t += deltaTimeSeconds;
    this.x = Math.sin(this.t) * this.r;
    this.y = Math.cos(this.t) * this.r;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(this.x + 10, this.y);
    ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
    ctx.fill();
  }
}
