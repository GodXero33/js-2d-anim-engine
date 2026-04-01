import { Game } from "./game/game.js";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

let width = 0;
let height = 0;
let fps = 60;
let frameInterval = 1000 / fps;
let lastTime = 0;
let accumulator = 0;
let running = false;
let animationFrame = -1;

const keys: Record<string, boolean> = {};
const game = new Game();

function update(deltaTimeSeconds: number) {
  if (keys['ArrowRight']) {
    console.log(`Right with ${deltaTimeSeconds}dt`);
  }

  game.update(deltaTimeSeconds);
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  const transform = ctx.getTransform();

  ctx.translate(width * 0.5, height * 0.5);
  game.draw(ctx);
  ctx.setTransform(transform);
}

function animate(time: number) {
  if (!running) return;

  const delta = time - lastTime;
  lastTime = time;
  accumulator += delta;

  while (accumulator >= frameInterval) {
    update(frameInterval / 1000);
    accumulator -= frameInterval;
  }

  draw();
  animationFrame = requestAnimationFrame(animate);
}

function play() {
  if (running) return;

  running = true;
  animationFrame = requestAnimationFrame(animate);
}

function pause() {
  running = false;
  cancelAnimationFrame(animationFrame);
}

function onResize() {
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width;
  canvas.height = height;
}

function onKeydown(event: KeyboardEvent) {
  keys[event.key] = true;

  if (event.code === 'Space') running ? pause() : play();
}

function onKeyup(event: KeyboardEvent) {
  keys[event.key] = false;
}

function bindEvents() {
  window.addEventListener('resize', onResize);
  window.addEventListener('keydown', onKeydown);
  window.addEventListener('keyup', onKeyup);
}

function setFPS(newFPS: number) {
  fps = newFPS;
  frameInterval = 1000 / fps;
}

function init() {
  onResize();
  bindEvents();
  play();
}

init();
setFPS(60);
