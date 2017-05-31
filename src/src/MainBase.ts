import {SpotLightContainer} from './SpotLightContainer';
import {ParticleContainer} from './ParticleContainer';
import {StageHelper} from './StageHelper';
import {CrossGraphicsContainer} from './CrossGraphicsContainer';
/**
 * パーティクルデモのメインクラスです。
 * @class project.Main
 */
export class MainBase {
  private stageBase: createjs.Stage;
  protected stageOverlay: createjs.Stage;
  private stageCalcInside: createjs.Stage;
  private spotLightContainer: SpotLightContainer;

  /**
   * @constructor
   */
  constructor(emitPerFrame: number) {
    // 初期設定
    this.stageBase = new createjs.Stage('canvasBase');


    // パーティクルサンプルを作成
    var sample = new ParticleContainer(emitPerFrame);
    this.stageBase.addChild(sample);

    // Tickerを作成
    createjs.Ticker.setFPS(60);
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.on('tick', this.handleTick, this);

    var stageOverlay  = new createjs.Stage('canvasOverlay');
    this.stageOverlay = stageOverlay;

    this.stageOverlay.nextStage = this.stageBase;

    this.stageBase.on('stagemousemove', (ev) => {
      sample.isMouseMoved = true;
    });

    // グラフィック
    this.spotLightContainer = new SpotLightContainer();
    stageOverlay.addChild(this.spotLightContainer);

    // 初期設定
    this.stageCalcInside           = new createjs.Stage(document.createElement('canvas'));
    this.stageCalcInside.autoClear = false;

    // パーティクルサンプルを作成
    var crossGraphicsContainer = new CrossGraphicsContainer();
    this.stageCalcInside.addChild(crossGraphicsContainer);

    this.buildUi();

    // リサイズイベント
    this.handleResize();
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // iframe埋め込み & スマホ対策
    setTimeout(() => {
      this.handleResize();
    }, 100);
  }

  protected buildUi(): void {

  }

  /**
   * エンターフレームイベント
   */
  protected handleTick(): void {

    this.spotLightContainer.drawContents(innerWidth, innerHeight);

    // create residual image effect
    this.stageBase.update();


    const canvas      = (<HTMLCanvasElement> this.stageCalcInside.canvas);
    const context     = canvas.getContext('2d');
    context.fillStyle = `rgba(0, 0, 0, ${0.35 * Math.random()})`;
    context.fillRect(0, 0, canvas.width, canvas.height);
    this.stageCalcInside.update();

    this.stageOverlay.update();
    const canvasOverlay               = (<HTMLCanvasElement> this.stageOverlay.canvas);
    const context2                    = canvasOverlay.getContext('2d');
    context2.globalCompositeOperation = 'lighter';
    context2.drawImage(canvas, 0, 0);
  }

  /**
   * リサイズイベント
   */
  protected handleResize(): void {
    StageHelper.highDPI(this.stageBase, innerWidth, innerHeight);
    StageHelper.highDPI(this.stageOverlay, innerWidth, innerHeight);
    StageHelper.highDPI(this.stageCalcInside, innerWidth, innerHeight);
  }
}