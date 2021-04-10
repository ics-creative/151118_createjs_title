/**
 * 大量のパーティクルを発生させてみた
 * マウスを押してる間でてくるよ
 * @see http://wonderfl.net/c/4WjT
 * @class demo.ParticleSample
 */
export class ParticleContainer extends createjs.Container {
  private _emitter: ParticleEmitter;
  private _emitterForMouse: ParticleEmitter;
  private readonly _bg: createjs.Shape;

  private _isMouseMoved: boolean = false;

  private _tickCount: number = 0;

  set isMouseMoved(value: boolean) {
    this._isMouseMoved = true;
  }

  constructor(numParticlesPerFrame: number) {
    super();

    this._bg = new createjs.Shape();
    this.addChild(this._bg);

    this._emitter = new ParticleEmitter(numParticlesPerFrame, 2.0, 2.0);
    this.addChild(this._emitter.container);

    this._emitterForMouse = new ParticleEmitter(2, 6.0, 6.0);
    this.addChild(this._emitterForMouse.container);

    this.on("tick", this.enterFrameHandler, this);
  }

  /**
   * エンターフレームイベント
   * @param event
   */
  private enterFrameHandler(event: createjs.Event): void {
    this._tickCount = this._tickCount + 1;
    if (this._tickCount % 2 == 0) {
      this._emitter.emit(
        window.innerWidth * Math.random(),
        (window.innerHeight / 5) * (Math.random() - 0.5) +
          (window.innerHeight * 6) / 10
      );
    }

    this._emitter.update();

    if (this._isMouseMoved == true) {
      let pt = this.globalToLocal(
        this.getStage().mouseX,
        this.getStage().mouseY
      );
      this._emitterForMouse.emit(pt.x, pt.y);
      this._isMouseMoved = false;
    }

    this._emitterForMouse.update();

    const hue =
      Math.sin((((-1 * Date.now()) / 400) * Math.PI) / 180) * 45 + 200;
    // 背景
    const color1 = createjs.Graphics.getHSL(hue, 100, 60);
    const color2 = createjs.Graphics.getHSL(hue + 120, 100, 40);

    this._bg.graphics
      .clear()
      .beginLinearGradientFill(
        [color1, color2],
        [0, 1],
        0,
        0,
        0,
        window.innerHeight
      )
      .drawRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

/**
 * パーティクル発生装置。マウス座標から速度を計算する。
 * @class project.Emitter
 */
class Emitter {
  /** 速度(X方向) */
  public vy: number = 0;
  /** 速度(Y方向) */
  public x: number = 0;
  /** マウスのX座標 */
  public latestY: number = 0;
  /** マウスのY座標 */
  public latestX: number = 0;
  /** パーティクル発生のX座標 */
  public y: number = 0;
  /** パーティクル発生のY座標 */
  public vx: number = 0;

  /**
   * @constructor
   */
  constructor() {}

  /**
   * パーティクルエミッターの計算を行います。この計算によりマウスの引力が計算されます。
   * @method
   */
  public update(): void {
    const dx: number = this.latestX - this.x;
    const dy: number = this.latestY - this.y;
    const d: number = Math.sqrt(dx * dx + dy * dy) * 0.2;
    const rad: number = Math.atan2(dy, dx);

    this.vx += Math.cos(rad) * d;
    this.vy += Math.sin(rad) * d;

    this.vx *= 0.4;
    this.vy *= 0.4;

    this.x += this.vx;
    this.y += this.vy;
  }
}

/**
 * パーティクルエミッター
 * @class project.ParticleEmitter
 */
class ParticleEmitter extends Emitter {
  public container: createjs.Container;
  private PRE_CACHE_PARTICLES: number = 100;
  private _particleActive: Particle[];
  private _particlePool: Particle[];

  /**
   * @constructor
   * @param numParticles 1フレーム間に発生させる Particle 数
   * @param startVx
   * @param startVy
   */
  constructor(
    private numParticles: number,
    private startVx: number,
    private startVy: number
  ) {
    super();

    this.container = new createjs.Container();

    this._particleActive = [];
    this._particlePool = [];

    /* 予め必要そうな分だけ作成しておく */
    for (let i = 0; i < this.PRE_CACHE_PARTICLES; i++) {
      this._particlePool.push(new Particle());
    }
  }

  /**
   * パーティクルを発生させます。
   * @param {number} x パーティクルの発生座標
   * @param {number} y パーティクルの発生座標
   * @method
   */
  public emit(x: number, y: number) {
    for (let i = 0; i < this.numParticles; i++) {
      this.getNewParticle(x, y);
    }
  }

  /**
   * パーティクルを更新します。
   * @method
   */
  public update() {
    super.update();

    for (let i = 0; i < this._particleActive.length; i++) {
      let p = this._particleActive[i];
      if (!p.getIsDead()) {
        // 跳ね返り判定するならココに書く

        p.update();
      } else {
        this.removeParticle(p);
      }
    }
  }

  /**
   * パーティクルを追加します。
   * @param {THREE.Vector3} emitPoint
   * @method
   */
  private getNewParticle(emitX: number, emitY: number) {
    const p: Particle = this.fromPool();
    p.resetParameters(emitX, emitY, this.startVx, this.startVy);
    this._particleActive.push(p);
    this.container.addChild(p);
    return p;
  }

  /**
   * パーティクルを削除します。
   * @param {Particle} p
   * @method
   */
  public removeParticle(p: Particle) {
    this.container.removeChild(p);

    const index = this._particleActive.indexOf(p);
    if (index > -1) {
      this._particleActive.splice(index, 1);
    }

    this.toPool(p);
  }

  /**
   * アクティブなパーティクルを取り出します。
   * @returns {project.Particle[]}
   * @method
   */
  public getActiveParticles(): Particle[] {
    return this._particleActive;
  }

  /**
   * プールからインスタンスを取り出します。
   * プールになければ新しいインスタンスを作成します。
   * @returns {project.Particle}
   * @method
   */
  private fromPool(): Particle {
    if (this._particlePool.length > 0) return this._particlePool.shift();
    else return new Particle();
  }

  /**
   * プールにインスタンスを格納します。
   * @param {project.Particle}
   * @method
   */
  private toPool(particle: Particle) {
    this._particlePool.push(particle);
  }
}

/**
 * @class demo.Particle
 */
class Particle extends createjs.Shape {
  public vx: number;
  public vy: number;
  public life: number;
  public size: number;
  public vSize: number;
  public baseAlpha: number;

  private _count: number;
  private _destroy: boolean;
  private MAX_SIZE: number = 128;

  /**
   * コンストラクタ
   * @constructor
   */
  constructor() {
    super();

    const size =
      Math.random() *
        Math.random() *
        Math.random() *
        Math.random() *
        this.MAX_SIZE +
      2;
    this.size = size;

    const colorHsl: string = createjs.Graphics.getHSL(
      0,
      0,
      20 + Math.random() * 50
    );

    this.graphics.clear();
    if (Math.random() < 0.4) {
      // もやっとした円
      this.graphics.beginRadialGradientFill(
        [colorHsl, "#000000"],
        [0.0, 1.0],
        0,
        0,
        0,
        0,
        0,
        this.size
      );
    } else if (Math.random() < 0.1) {
      // 輪郭だけの円
      this.graphics
        .setStrokeStyle(1) // 線の太さ
        .beginStroke(createjs.Graphics.getRGB(255, 255, 255));
    } else if (Math.random() < 0.3) {
      // 輪郭だけの円
      this.graphics
        .setStrokeStyle(1.5) // 線の太さ
        .beginStroke(createjs.Graphics.getRGB(255, 255, 255));
    } else {
      // キリッとした円
      this.graphics.beginFill(colorHsl);
    }

    this.graphics.drawCircle(0, 0, this.size);
    this.graphics.endFill();

    // 大量のオブジェクトを重ねるとおかしくなる
    this.compositeOperation = "lighter";

    this.mouseEnabled = false;
    const padding = 2;
    this.cache(
      -this.size - padding,
      -this.size - padding,
      this.size * 2 + padding * 2,
      this.size * 2 + padding * 2
    );

    this._destroy = true;
  }

  /**
   * パーティクルをリセットします。
   * @param emitX
   * @param emitY
   */
  public resetParameters(
    emitX: number,
    emitY: number,
    startVx: number,
    startVy: number
  ): void {
    this.x = emitX;
    this.y = emitY;
    this.vx = (Math.random() - 0.5) * startVx;
    this.vy = (Math.random() - 0.5) * startVy;
    this.life = Math.random() * Math.random() * 400 + 40;
    this.vSize = Math.random() * 0.5;
    this.baseAlpha = 0.7;
    this._destroy = false;
    this._count = 0;

    this.alpha = 1.0;
    this.scaleX = this.scaleY = 1.0;
  }

  /**
   * パーティクル個別の内部計算を行います。
   * @method
   */
  public update(): void {
    // 重力計算
    this.vy -= 0.05;

    // 摩擦計算
    this.vx *= 0.98;
    this.vy *= 0.98;

    this.x += this.vx;
    this.y += this.vy;

    this._count++;

    const maxD: number = 1 - this._count / this.life;
    const sizeNew: number = 1 - (this._count / this.life) * this.vSize;

    this.alpha = Math.random() * 0.3 + this.baseAlpha * maxD;
    this.scaleX = this.scaleY = sizeNew;

    // 死亡フラグ
    if (this.life < this._count) {
      this._destroy = true;
      this.parent.removeChild(this);
    }
  }

  /**
   * パーティクルが死んでいるかどうかを確認します。
   * @returns {boolean}
   * @method
   */
  public getIsDead(): boolean {
    return this._destroy;
  }
}
