import { FillGradient, Graphics } from 'pixi.js';
import { DIRECTIONS, getCorners, randomNumber, ShapeType, SMALL_SCREEN_SIZE} from './utils';

export interface ShapeData {
	graphics: Graphics;
	type: ShapeType;
	area: number;
}

export class Shapes {
	constructor() {}

	public createShape(type: ShapeType): ShapeData {
		const shape = new Graphics();
		const color = this.randomColor();
		const size = window.innerWidth > SMALL_SCREEN_SIZE ? randomNumber(30, 60) : randomNumber(20, 30);
		let area = 0;

		const shadow = new FillGradient({
			end: { x: 0.7, y: 1 },
			colorStops: [
				{ offset: 0.2, color: color },
				{ offset: 1, color: 0x000000 },
			],
		});

		switch (type) {
			case ShapeType.TRIANGLE: {
				const corners = getCorners(3, size);
				shape.poly(corners).fill({ color: color }).stroke({ width: 4, fill: shadow, alpha: 0.5 });
				area = this.shapeArea(corners);
				
				break;
			}

			case ShapeType.SQUARE: {
				shape.poly(getCorners(4, size)).fill({ color: color }).stroke({ width: 4, fill: shadow, alpha: 0.5 });
				area = this.shapeArea(getCorners(4, size));
				break;
			}

			case ShapeType.PENTAGON: {
				shape.poly(getCorners(5, size)).fill({ color: color }).stroke({ width: 4, fill: shadow, alpha: 0.5 });
				area = this.shapeArea(getCorners(5, size));
				break;
			}

			case ShapeType.HEXAGON: {
				shape.poly(getCorners(6, size)).fill({ color: color }).stroke({ width: 4, fill: shadow, alpha: 0.5 });
				area = this.shapeArea(getCorners(6, size));
				break;
			}

			case ShapeType.CIRCLE: {
				shape.circle(0, 0, size).fill({ color: color }).stroke({ width: 4, fill: shadow, alpha: 0.5 });
				area = Math.PI * size * size;
				break;
			}

			case ShapeType.ELLIPSE: {
				const rx = window.innerWidth > SMALL_SCREEN_SIZE ? randomNumber(30, 60) : randomNumber(30, 40);
				const ry = window.innerWidth > SMALL_SCREEN_SIZE ? randomNumber(20, 30) : randomNumber(20, 30);

				shape.ellipse(0, 0, rx, ry).fill({ color: color }).stroke({ width: 4, fill: shadow, alpha: 0.5 });
				area = Math.PI * rx * ry;

				break;
			}

			case ShapeType.STAR: {
				const outerRadius = size;
				const innerRadius = size * 0.5;
				shape
					.star(0, 0, 5, outerRadius, innerRadius)
					.fill({ color })
					.stroke({ width: 2, fill: shadow, alpha: 0.5 });
				area = 5 * outerRadius * innerRadius * Math.sin(Math.PI / 5);
				break;
			}

			case ShapeType.IRREGULAR: {
				const points: number[] = [];
				for (let i = 0; i < randomNumber(4, 8); i++) {
					const [dx, dy] = DIRECTIONS[i];
					points.push(dx * size * randomNumber(0.4, 1), dy * size * randomNumber(0.4, 1));
				}
				shape.poly(points).fill({ color }).stroke({ width: 4, fill: shadow, alpha: 0.5 });
				area = this.shapeArea(points);
				break;
			}
		}

		return { graphics: shape, type, area};
	}

	private shapeArea(corners: number[]): number {
		let area = 0;
		const points = corners.length / 2;
		let j = points - 1;

		for (let i = 0; i < points; i++) {
			const xi = corners[i * 2];
			const yi = corners[i * 2 + 1];
			const xj = corners[j * 2];
			const yj = corners[j * 2 + 1];
			area += (xj + xi) * (yj - yi);
			j = i;
		}

		return Math.abs(area / 2);
	}

	private randomColor(): number {
		const r = randomNumber(90, 255);
		const g = randomNumber(90, 255);
		const b = randomNumber(90, 255);

		return (r << 16) | (g << 8) | b;
	}
}
