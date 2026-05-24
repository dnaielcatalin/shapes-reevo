import { Container, Graphics, Ticker, type Application } from 'pixi.js';
import { GRADIENT, MAX_GRAVITY, MAX_SHAPES_PER_SECOND, MIN_GRAVITY, MIN_SHAPES_PER_SECOND, randomNumber, ShapeType, SMALL_SCREEN_SIZE, STROKE } from './utils';
import { Shapes, type ShapeData } from './Shapes';
import * as PIXISound from '@pixi/sound';
import { STAGE } from './main';

export class Game {
	private _gameContext = new Container();
	private _shapesContext = new Container();

	private _mask: Graphics;
	private _bg: Graphics;
	private _border: Graphics;

	private _shapes: Shapes;
	private _shapeStorage: Array<ShapeData> = [];

	private _rectangleX: number = 0;
	private _rectangleY: number = 0;
	private _rectangleW: number = 0;
	private _rectangleH: number = 0;

	private _padding: number = window.innerWidth > SMALL_SCREEN_SIZE ? 64 : 32;

	private _shapesPerSecond: number = 1;
	private _gravity: number = 100;

	constructor(app: Application) {

		this._mask = new Graphics();
		this._gameContext.addChild(this._mask);

		this._bg = new Graphics();
		this._bg.eventMode = 'static';
		this._bg.on('pointerdown', (e) => {
			const pos = e.getLocalPosition(this._bg);
			this.spawnShape(pos.x, pos.y);

			PIXISound.Sound.from('sounds/popin.mp3').play({ volume: 0.15 });
		});

		this._border = new Graphics();

		this._shapesContext = new Container();
		this._shapes = new Shapes();

		this._gameContext.addChild(this._bg);
		this._shapesContext.mask = this._mask;
		this._gameContext.addChild(this._shapesContext);
		this._gameContext.addChild(this._border);

		STAGE.addChild(this._gameContext);

		this.rectangleBounds();
		this.resize();
		this.initTicker();
		this.updateFields();

		app.renderer.on('resize', () => {
			this.rectangleBounds();
			this.resize();
		});
	}

	get shapesPerSecond(): number {
		return this._shapesPerSecond;
	}

	get gravity(): number {
		return this._gravity;
	}

	get spawnIntervalMs(): number {
		return 1000 / this._shapesPerSecond;
	}

	public increaseSpawnSpeed() {
		this._shapesPerSecond = Math.min(MAX_SHAPES_PER_SECOND, this._shapesPerSecond + 1);
	}

	public decreaseSpawnSpeed() {
		this._shapesPerSecond = Math.max(MIN_SHAPES_PER_SECOND, this._shapesPerSecond - 1);
	}

	public increaseGravity() {
		this._gravity = Math.min(MAX_GRAVITY, this._gravity + 10);
	}

	public decreaseGravity() {
		this._gravity = Math.max(MIN_GRAVITY, this._gravity - 10);
	}

	private updateFields() {
		let count = 0;
		let inScreenArea = 0
		for(let i = 0; i < this._shapeStorage.length; i++) {
			const shape = this._shapeStorage[i];
			if(shape.graphics.y > this._rectangleY) {
				inScreenArea += shape.area;
				count++;
			}
		}

		const countElement = document.getElementById('shape-counter');
		countElement.textContent = 'Shapes: ' + count;

		const areaElement = document.getElementById('area-text');
		areaElement.textContent = 'Area: ' + Math.round(inScreenArea)
	}

	private initTicker() {
		let passedDT = 0;
		Ticker.shared.add(() => {
			const dt = Ticker.shared.deltaMS / 1000;

			passedDT += Ticker.shared.deltaMS;
			if (passedDT >= this.spawnIntervalMs) {
				passedDT -= this.spawnIntervalMs;
				this.randomSpawn();
			}

			for (let i = 0; i < this._shapeStorage.length; i++) {
				const shape = this._shapeStorage[i];

				shape.graphics.y += this.gravity * dt;

				if (shape.graphics.y > this._rectangleY * 2 + this._rectangleH) {
					this._shapeStorage.splice(i, 1);
					shape.graphics.destroy();
				}
			}

			this.updateFields();
		});
	}

	private rectangleBounds() {
		this._rectangleX = this._padding;
		this._rectangleY = this._padding;
		this._rectangleW = window.innerWidth - this._padding * 2;
		this._rectangleH = window.innerHeight - this._padding * 2;
	}

	private resize() {
		this._padding = window.innerWidth > SMALL_SCREEN_SIZE ? 64 : 32;

		for (let i = 0; i < this._shapeStorage.length; i++) {
			const shape = this._shapeStorage[i];

			if (shape.graphics.x > this._rectangleW + this._rectangleX * 2) {
				this._shapeStorage.splice(i, 1);
				shape.graphics.destroy();
			}
		}

		this._mask
			.clear()
			.roundRect(this._rectangleX, this._rectangleY, this._rectangleW, this._rectangleH, 5)
			.fill(0xffffff);

		this._bg
			.clear()
			.roundRect(this._rectangleX, this._rectangleY, this._rectangleW, this._rectangleH, 5)
			.fill(GRADIENT);

		this._border
			.clear()
			.roundRect(this._rectangleX, this._rectangleY, this._rectangleW, this._rectangleH, 5)
			.stroke({ fill: STROKE, width: 1 });
	}

	private randomSpawn() {
		const x = randomNumber(this._rectangleX + this._padding, this._rectangleW );
		const y = this._rectangleY - this._padding ;

		this.spawnShape(x, y);
	}

	private spawnShape(x: number, y: number) {
		const randomInt = Math.floor(Math.random() * Object.keys(ShapeType).length);
		const shapeData = this._shapes.createShape(Object.values(ShapeType)[randomInt]);

		shapeData.graphics.x = x;
		shapeData.graphics.y = y;

		shapeData.graphics.eventMode = 'static';
		shapeData.graphics.cursor = 'pointer';
		shapeData.graphics.on('pointerdown', () => {

			PIXISound.Sound.from('sounds/bloop.mp3').play({ volume: 0.15 });

			const index = this._shapeStorage.indexOf(shapeData);
			this._shapeStorage.splice(index, 1);
			shapeData.graphics.destroy();
		});

		this._shapesContext.addChild(shapeData.graphics);
		this._shapeStorage.push(shapeData);
	}
}
