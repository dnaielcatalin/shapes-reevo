import { Application, Container } from 'pixi.js';
import { Game } from './Game';
import { MAX_GRAVITY, MIN_GRAVITY, MAX_SHAPES_PER_SECOND, MIN_SHAPES_PER_SECOND, toggleButton, HOLD_SPEED } from './utils';

export let STAGE: Container;

async function init() {

	const appElement = document.getElementById('app')!;
	const gravityPlus = document.getElementById('gravityButtonPlus');
	const gravityMinus = document.getElementById('gravityButtonMinus');
	const gravitySpan = document.getElementById('gravityValue');

	const shapesPerSecondPlus = document.getElementById('spsButtonPlus');
	const shapesPerSecondMinus = document.getElementById('spsButtonMinus');
	const shapesPerSecondSpan = document.getElementById('spsValue');

	const app = new Application();
	await app.init({
		resizeTo: appElement,
		backgroundColor: 0x2f2f2f,
		antialias: true,
		resolution: window.devicePixelRatio,
		autoDensity: true,
	});

	appElement.appendChild(app.canvas);

	STAGE = app.stage;

	const game = new Game(app);

	toggleButton(shapesPerSecondMinus, game.shapesPerSecond === MIN_SHAPES_PER_SECOND);

	let interval: any;
	gravityPlus.addEventListener('pointerdown', () => {
		interval = setInterval(() => {
			if(game.gravity === MAX_GRAVITY) {
				clearInterval(interval);
				return;
			}

			game.increaseGravity();
			gravitySpan.textContent = game.gravity.toString();

			toggleButton(gravityPlus, game.gravity === MAX_GRAVITY);
			toggleButton(gravityMinus, game.gravity === MIN_GRAVITY);
		}, HOLD_SPEED);
	});

	gravityPlus.addEventListener('pointerout', () => {
		clearInterval(interval);
	});

	gravityPlus.addEventListener('pointerup', () => {
		clearInterval(interval);
	});

	gravityMinus.addEventListener('pointerdown', () => {
		interval = setInterval(() => {

		if(game.gravity === MIN_GRAVITY) {
			clearInterval(interval);
			return;
		}

		game.decreaseGravity();
		gravitySpan.textContent = game.gravity.toString();

		toggleButton(gravityMinus, game.gravity === MIN_GRAVITY);
		toggleButton(gravityPlus, game.gravity === MAX_GRAVITY);
		}, HOLD_SPEED);

	});

	gravityMinus.addEventListener('pointerout', () => {
		clearInterval(interval);
	});

	gravityMinus.addEventListener('pointerup', () => {
		clearInterval(interval);
	});

	shapesPerSecondPlus.addEventListener('pointerdown', () => {
		game.increaseSpawnSpeed();
		shapesPerSecondSpan.textContent = game.shapesPerSecond.toString();

		toggleButton(shapesPerSecondPlus, game.shapesPerSecond === MAX_SHAPES_PER_SECOND);
		toggleButton(shapesPerSecondMinus, game.shapesPerSecond === MIN_SHAPES_PER_SECOND);
	});

	shapesPerSecondMinus.addEventListener('pointerdown', () => {
		game.decreaseSpawnSpeed();
		shapesPerSecondSpan.textContent = game.shapesPerSecond.toString();

		toggleButton(shapesPerSecondMinus, game.shapesPerSecond === MIN_SHAPES_PER_SECOND);
		toggleButton(shapesPerSecondPlus, game.shapesPerSecond === MAX_SHAPES_PER_SECOND);
	});
}

init();
