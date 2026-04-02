import { Animation } from "./anim/anim.js";
import { Game } from "./game/game.js";

const animation = new Animation({ canvas: document.getElementById('canvas') as HTMLCanvasElement });
const keys: Record<string, boolean> = {};
const game = new Game();

function update(deltaTimeSeconds: number) {
  if (keys['ArrowRight']) {
    console.log(`Right with ${deltaTimeSeconds}dt`);
  }

  game.update(deltaTimeSeconds);
}

function draw(ctx: CanvasRenderingContext2D) {
  game.draw(ctx);
}

function onKeydown(event: KeyboardEvent) {
  keys[event.key] = true;

  if (event.code === 'Space') animation.isRunning() ? animation.pause() : animation.play();
}

function onKeyup(event: KeyboardEvent) {
  keys[event.key] = false;
}

function bindEvents() {
  window.addEventListener('keydown', onKeydown);
  window.addEventListener('keyup', onKeyup);
}

animation.setUpdateCallback(update);
animation.setDrawCallback(draw);

bindEvents();
animation.init();
