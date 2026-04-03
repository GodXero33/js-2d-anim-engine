export interface AnimationApplication {
  draw: (ctx: CanvasRenderingContext2D) => void;
  update: (deltaTimeSeconds: number)  => void;
};

type AnimationConstructorOptions = {
  canvas: HTMLCanvasElement | undefined;
};

export class Animation {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  width = 0;
  height = 0;

  private fps = 60;
  private frameInterval = 1000 / this.fps;
  private lastTime = 0;
  private accumulator = 0;
  private running = false;
  private animationFrame = -1;
  private blurWhileRunning = false;

  private updateCallback: ((deltaTimeSeconds: number) => void) | undefined;
  private drawCallback: ((ctx:CanvasRenderingContext2D) => void) | undefined;

  constructor({
    canvas
  }: AnimationConstructorOptions) {
    if (!canvas) throw new Error('Can\'t create an Animtaion instance without Canvas Element');

    this.canvas = canvas;
    const ctxTemp = canvas.getContext('2d');

    if (!ctxTemp) throw new Error('Failed to get canvas rendedring context object');

    this.ctx = ctxTemp;
  }

  private update(deltaTimeSeconds: number) {
    this.updateCallback?.(deltaTimeSeconds);
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const transform = this.ctx.getTransform();

    this.ctx.translate(this.width * 0.5, this.height * 0.5);
    this.drawCallback?.(this.ctx);
    this.ctx.setTransform(transform);
  }

  private animate(time: number) {
    if (!this.running) return;

    const delta = time - this.lastTime;
    this.lastTime = time;
    this.accumulator += delta;

    while (this.accumulator >= this.frameInterval) {
      this.update(this.frameInterval / 1000);
      this.accumulator -= this.frameInterval;
    }

    this.draw();
    this.animationFrame = requestAnimationFrame(this.animate.bind(this));
  }

  play() {
    if (this.running) return;

    this.running = true;
    this.animationFrame = requestAnimationFrame(this.animate.bind(this));
  }

  pause() {
    this.running = false;
    cancelAnimationFrame(this.animationFrame);
  }

  private onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.draw();
  }

  private onBlur() {
    this.blurWhileRunning = this.running;
    this.pause();
  }

  private onFocus() {
    if (this.blurWhileRunning) this.play();
  }

  private bindEvents() {
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('blur', this.onBlur.bind(this));
    window.addEventListener('focus', this.onFocus.bind(this));
  }

  isRunning() {
    return this.running == true;
  }

  setFPS(newFPS: number) {
    this.fps = newFPS;
    this.frameInterval = 1000 / this.fps;
  }

  setUpdateCallback(updateCallback: (deltaTimeSeconds: number) => void) {
    this.updateCallback = updateCallback;
  }

  setDrawCallback(drawCallback: (ctx: CanvasRenderingContext2D) => void) {
    this.drawCallback = drawCallback;
  }

  init() {
    this.onResize();
    this.bindEvents();
    this.play();
  }
}
