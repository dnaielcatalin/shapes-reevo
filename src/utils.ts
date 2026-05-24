import { FillGradient } from "pixi.js";

export const MAX_GRAVITY = 1000;
export const MIN_GRAVITY = 0;
export const MAX_SHAPES_PER_SECOND = 10;
export const MIN_SHAPES_PER_SECOND = 1;

export const HOLD_SPEED = 50

export const SMALL_SCREEN_SIZE = 1000;

export const DIRECTIONS = [
	[0, -1],
	[1, -1],
	[1, 0],
	[1, 1],
	[0, 1],
	[-1, 1],
	[-1, 0],
	[-1, -1],
];

export const GRADIENT = new FillGradient({
	end: { x: 0, y: 1 },
	colorStops: [
		{ offset: 0, color: 0x4a3d66 },
		{ offset: 0.4, color: 0x322646 },
		{ offset: 1, color: 0x1d182a },
	],
});

export const STROKE = new FillGradient({
	end: { x: 0, y: 1 },
	colorStops: [
		{ offset: 0, color: 0x4a3d66 },
		{ offset: 0.4, color: 0x322646 },
		{ offset: 1, color: 0x8f59d2 },
	],
});

export const SHADOW = new FillGradient({
	end: { x: 0.7, y: 1 },
	colorStops: [
		{ offset: 0.2, color: 0x000000 },
		{ offset: 1, color: 0x000000 },
	],
});

export enum ShapeType {
	TRIANGLE = 'triangle',
	SQUARE = 'square',
	PENTAGON = 'pentagon',
	HEXAGON = 'hexagon',
	CIRCLE = 'circle',
	ELLIPSE = 'ellipse',
	STAR = 'star',
	IRREGULAR = 'irregular',
}

export function randomNumber(min: number, max: number) {
	return min + Math.random() * (max - min);
}

export function getCorners(sides: number, r: number): number[] {
	const corners: Array<number> = [];

	for (let i = 0; i < sides; i++) {
		const angle = (i / sides) * Math.PI * 2;
		corners.push(Math.cos(angle) * r, Math.sin(angle) * r);
	}
	return corners;
}

export function toggleButton(button: HTMLElement, condition: boolean) {
	button.style.opacity = condition ? '0.5' : '1';
	button.style.cursor = condition ? 'not-allowed' : 'pointer';
	button.style.pointerEvents = condition ? 'none' : 'auto';
}
