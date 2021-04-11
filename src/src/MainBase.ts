import { SpotLightContainer } from "./SpotLightContainer";
import { ParticleContainer } from "./ParticleContainer";
import { StageHelper } from "./StageHelper";
import { CrossGraphicsContainer } from "./CrossGraphicsContainer";
/**
 * パーティクルデモのメインクラスです。
 * @class project.Main
 */
export class MainBase {
  private readonly stageBase: createjs.Stage;
  protected stageOverlay: createjs.Stage;
  private readonly stageCalcInside: createjs.Stage;
  private readonly spotLightContainer: SpotLightContainer;
  private _context: CanvasRenderingContext2D;
  private _context2: CanvasRenderingContext2D;
  private _canvas: HTMLCanvasElement;

  /**
   * @constructor
   */
  constructor(emitPerFrame: number) {
    // 初期設定
    this.stageBase = new createjs.Stage("canvasBase");

    // パーティクルサンプルを作成
    const sample = new ParticleContainer(emitPerFrame);
    this.stageBase.addChild(sample);

    const stageOverlay = new createjs.Stage("canvasOverlay");
    this.stageOverlay = stageOverlay;

    this.stageOverlay.nextStage = this.stageBase;

    this.stageBase.on("stagemousemove", (ev) => {
      sample.isMouseMoved = true;
    });

    // グラフィック
    this.spotLightContainer = new SpotLightContainer();
    stageOverlay.addChild(this.spotLightContainer);

    // 初期設定
    this.stageCalcInside = new createjs.Stage(document.createElement("canvas"));
    this.stageCalcInside.autoClear = false;

    // パーティクルサンプルを作成
    const crossGraphicsContainer = new CrossGraphicsContainer();
    this.stageCalcInside.addChild(crossGraphicsContainer);

    const canvas = this.stageCalcInside.canvas as HTMLCanvasElement;
    this._canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error();
    }
    this._context = context;
    const canvasOverlay = this.stageOverlay.canvas as HTMLCanvasElement;
    const context2 = canvasOverlay.getContext("2d");
    if (!context2) {
      throw new Error();
    }
    this._context2 = context2;

    this.buildUi();

    // リサイズイベント
    this.handleResize();
    window.addEventListener("resize", () => {
      this.handleResize();
    });

    // 通常
    createjs.Ticker.framerate = 60;
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    let isNeedUpdate = true;
    const updateTick = () => {
      if (isNeedUpdate) {
        this.handleTick();
      }
    };
    createjs.Ticker.on("tick", updateTick);

    const mediaQuery =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion)");

    // 未対応ブラウザでは処理をはずす
    if (!mediaQuery) {
      return;
    }

    const update = () => {
      const warn = document.querySelector<HTMLDivElement>(".reduceMotionWarn");
      // Tickerを作成
      if (mediaQuery.matches) {
        // 演出しない
        this.handleTick();
        isNeedUpdate = false;
        warn?.removeAttribute("hidden");
      } else {
        isNeedUpdate = true;
        warn?.setAttribute("hidden", "true");
      }
    };

    mediaQuery.addEventListener("change", update);

    update();
  }

  protected buildUi(): void {}

  /**
   * エンターフレームイベント
   */
  protected handleTick(): void {
    this.spotLightContainer.drawContents(innerWidth, innerHeight);

    // create residual image effect
    this.stageBase.update();

    const canvas = this._canvas;
    this._context.fillStyle = `rgba(0, 0, 0, ${0.35 * Math.random()})`;
    this._context.fillRect(0, 0, canvas.width, canvas.height);
    this.stageCalcInside.update();

    this.stageOverlay.update();
    this._context2.globalCompositeOperation = "lighter";
    this._context2.drawImage(canvas, 0, 0);
  }

  /**
   * リサイズイベント
   */
  protected handleResize(): void {
    StageHelper.highDPI(this.stageBase, innerWidth, innerHeight);
    StageHelper.highDPI(this.stageOverlay, innerWidth, innerHeight);
    StageHelper.highDPI(this.stageCalcInside, innerWidth, innerHeight);

    this.handleTick();
  }
}
