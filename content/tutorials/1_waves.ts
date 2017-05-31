///<reference path="../libs/easeljs/easeljs.d.ts" />
///<reference path="../src/CrossGraphicsContainer.ts" />
///<reference path="../src/ParticleContainer.ts" />
///<reference path="../src/SpotLightContainer.ts" />
///<reference path="../src/StageHelper.ts" />

namespace project {

	window.onload = ()=> {
		new project.Main();
	};

	/** 1フレーム間に発生させる Particle 数 */
	const NUM_PARTICLES:number = 1;

	/**
	 * パーティクルデモのメインクラスです。
	 * @class project.Main
	 */
	export class Main {
		private stageBase:createjs.Stage;
		private stageOverlay:createjs.Stage;
		private stageCalcInside:createjs.Stage;
		private bmpBg:SpotLightContainer;


		/**
		 * @constructor
		 */
		constructor() {

			// 初期設定
			this.stageBase = new createjs.Stage("canvasBase");

			// パーティクルサンプルを作成
			var sample = new ParticleContainer(NUM_PARTICLES);
			this.stageBase.addChild(sample);

			// Tickerを作成
			createjs.Ticker.setFPS(60);
			createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
			createjs.Ticker.on("tick", this.handleTick, this);


			var stageOverlay = new createjs.Stage("canvasOverlay");

			// グラフィック
			this.bmpBg = new SpotLightContainer();
			stageOverlay.addChild(this.bmpBg);
			this.stageOverlay = stageOverlay;

			// 初期設定
			this.stageCalcInside = new createjs.Stage(document.createElement("canvas"));
			this.stageCalcInside.autoClear = false;

			// パーティクルサンプルを作成
			var crossGraphicsContainer = new CrossGraphicsContainer();
			this.stageCalcInside.addChild(crossGraphicsContainer);

			document.body.appendChild(this.stageCalcInside.canvas)

			// リサイズイベント
			this.handleResize();
			window.addEventListener("resize", ()=> {
				this.handleResize()
			});

			// iframe埋め込み & スマホ対策
			setTimeout(()=> {
				this.handleResize();
			}, 100);
		}



		/**
		 * エンターフレームイベント
		 */
		private handleTick():void {

			this.bmpBg.drawContents(innerWidth, innerHeight);

			// create residual image effect
			this.stageBase.update();

			const context = this.stageCalcInside.canvas.getContext("2d");
			context.fillStyle = `rgba(0, 0, 0, ${0.5 * Math.random()})`;
			context.fillRect(0, 0,
				this.stageCalcInside.canvas.width,
				this.stageCalcInside.canvas.height);
			this.stageCalcInside.update();

			this.stageOverlay.update();
			const context2 = this.stageOverlay.canvas.getContext("2d");
			context2.globalCompositeOperation = "lighter";
			context2.drawImage(this.stageCalcInside.canvas, 0, 0);
		}

		/**
		 * リサイズイベント
		 */
		private handleResize():void {
			var w = innerWidth;
			var h = innerHeight;

			clockmaker.StageHelper.highDPI(this.stageBase, w, h);
			clockmaker.StageHelper.highDPI(this.stageOverlay, w, h);
			clockmaker.StageHelper.highDPI(this.stageCalcInside, w, h);
		}
	}
}