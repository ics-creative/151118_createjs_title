///<reference path="../libs/easeljs/easeljs.d.ts" />
///<reference path="CrossGraphicsContainer.ts" />
///<reference path="ParticleContainer.ts" />
///<reference path="StageHelper.ts" />

namespace project {
  "use strict";

  /**
   * パーティクルデモのメインクラスです。
   * @class project.Main
   */
  export class MainBase {
    private stageBase:createjs.Stage;
    protected stageOverlay:createjs.Stage;
    private stageCalcInside:createjs.Stage;
    private spotLightContainer:SpotLightContainer;

    /**
     * @constructor
     */
    constructor(emitPerFrame:number) {
      // 初期設定
      this.stageBase = new createjs.Stage("canvasBase");


      // パーティクルサンプルを作成
      var sample = new ParticleContainer(emitPerFrame);
      this.stageBase.addChild(sample);

      // Tickerを作成
      createjs.Ticker.setFPS(60);
      createjs.Ticker.timingMode = createjs.Ticker.RAF;
      createjs.Ticker.on("tick", this.handleTick, this);

      var stageOverlay = new createjs.Stage("canvasOverlay");
      this.stageOverlay = stageOverlay;

      this.stageOverlay.nextStage = this.stageBase;

      this.stageBase.on("stagemousemove", (ev)=>{sample.isMouseMoved = true;});

      // グラフィック
      this.spotLightContainer = new project.SpotLightContainer();
      stageOverlay.addChild(this.spotLightContainer);

      // 初期設定
      this.stageCalcInside = new createjs.Stage(document.createElement("canvas"));
      this.stageCalcInside.autoClear = false;

      // パーティクルサンプルを作成
      var crossGraphicsContainer = new CrossGraphicsContainer();
      this.stageCalcInside.addChild(crossGraphicsContainer);

      this.buildUi();

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

    protected buildUi():void {

    }

    /**
     * エンターフレームイベント
     */
    protected handleTick():void {

      this.spotLightContainer.drawContents(innerWidth, innerHeight);

      // create residual image effect
      this.stageBase.update();


      const context = this.stageCalcInside.canvas.getContext("2d");
      context.fillStyle = `rgba(0, 0, 0, ${0.35 * Math.random()})`;
      context.fillRect(0, 0, this.stageCalcInside.canvas.width, this.stageCalcInside.canvas.height);
      this.stageCalcInside.update();

      this.stageOverlay.update();
      const context2 = this.stageOverlay.canvas.getContext("2d");
      context2.globalCompositeOperation = "lighter";
      context2.drawImage(this.stageCalcInside.canvas, 0, 0);
    }

    /**
     * リサイズイベント
     */
    protected handleResize():void {
      clockmaker.StageHelper.highDPI(this.stageBase, innerWidth, innerHeight);
      clockmaker.StageHelper.highDPI(this.stageOverlay, innerWidth, innerHeight);
      clockmaker.StageHelper.highDPI(this.stageCalcInside, innerWidth, innerHeight);
    }
  }
}