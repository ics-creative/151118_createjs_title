var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../libs/easeljs/easeljs.d.ts" />
var clockmaker;
(function (clockmaker) {
    "use strict";
    var StageHelper = (function () {
        function StageHelper() {
        }
        StageHelper.highDPI = function (stage, w, h) {
            var backingRatio = StageHelper._getBackingRatio(stage);
            var scale = Math.max(1, (window.devicePixelRatio || 1) / backingRatio);
            var canvas = stage.canvas, style = canvas.style;
            //console.log(scale, window.devicePixelRatio, backingRatio)
            canvas.width = w * scale;
            canvas.height = h * scale;
            //style.width = w + "px";
            //style.height = h + "px";
            stage.scaleX = stage.scaleY = scale;
            return this;
        };
        StageHelper._getBackingRatio = function (stage) {
            var ctx = stage.canvas.getContext("2d");
            return ctx.backingStorePixelRatio || ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || 1;
        };
        return StageHelper;
    }());
    clockmaker.StageHelper = StageHelper;
})(clockmaker || (clockmaker = {}));
///<reference path="../libs/easeljs/easeljs.d.ts" />
var project;
(function (project) {
    "use strict";
    /**
     * @see FrocessingSample by nutsu http://wonderfl.net/c/kvXp
     */
    var CrossGraphicsContainer = (function (_super) {
        __extends(CrossGraphicsContainer, _super);
        function CrossGraphicsContainer() {
            _super.call(this);
            this.time = 0;
            /** 線自体の個数です。 */
            this.MAX_LINES = 10;
            /** 線の水平方向の頂点数です。 */
            this.MAX_VERTEX = 10;
            this.mouseEnabled = false;
            noise.seed(0);
            this.vertexArr = [];
            for (var i = 0; i < this.MAX_LINES; i++) {
                this.vertexArr[i] = [];
                var num = (this.MAX_VERTEX - 1) * Math.random() * Math.random() + 1;
                for (var j = 0; j <= num; j++) {
                    this.vertexArr[i][j] = 0;
                }
            }
            this.on("tick", this.handleTick, this);
        }
        /**
         * エンターフレームイベント
         * @param event
         */
        CrossGraphicsContainer.prototype.handleTick = function (event) {
            this.time = Date.now() / 5000;
            this.graphics.clear();
            for (var i = 0; i < this.MAX_LINES; i++) {
                this.drawWave(this.vertexArr[i], (0.05 * i) + 0.001, // ゼロ対策(ゼロのときに太さが1pxになるため)
                i * 0.10);
            }
        };
        /**
         * ウェーブを描きます。
         * @param vertexArr    頂点配列
         * @param strokeSize    線の太さ
         * @param timeOffset    波のオフセット
         */
        CrossGraphicsContainer.prototype.drawWave = function (vertexArr, strokeSize, timeOffset) {
            var vertexNum = vertexArr.length - 1;
            var stageW = window.innerWidth;
            var stageH = window.innerHeight;
            // draw #1
            this.graphics.setStrokeStyle(strokeSize).beginStroke("white");
            for (var i = 0; i <= vertexNum; i++) {
                var noiseValue = noise.perlin2(i * 0.2, this.time + timeOffset);
                // 小さくする
                noiseValue *= 0.5;
                //vertexArr[i] += (((noiseValue) * innerHeight * 2) - vertexArr[i]) * 0.05;
                vertexArr[i] = (noiseValue) * innerHeight * 2;
            }
            var BASE_Y = stageH / 2;
            var points = [];
            points.push({ x: -200, y: BASE_Y });
            for (var i = 0; i <= vertexNum; i++) {
                points.push({
                    x: (stageW * (i / vertexNum)) >> 0,
                    y: vertexArr[i] + BASE_Y
                });
            }
            points.push({ x: stageW + 200, y: BASE_Y });
            for (var i = 0; i < points.length; i++) {
                if (i >= 2) {
                    // マウスの軌跡を変数に保存
                    var p0x = points[i - 0].x;
                    var p0y = points[i - 0].y;
                    var p1x = points[i - 1].x;
                    var p1y = points[i - 1].y;
                    var p2x = points[i - 2].x;
                    var p2y = points[i - 2].y;
                    // カーブ用の頂点を割り出す
                    var curveStartX = (p2x + p1x) / 2;
                    var curveStartY = (p2y + p1y) / 2;
                    var curveEndX = (p0x + p1x) / 2;
                    var curveEndY = (p0y + p1y) / 2;
                    // カーブは中間点を結ぶ。マウスの座標は制御点として扱う。
                    this.graphics
                        .moveTo(curveStartX, curveStartY)
                        .curveTo(p1x, p1y, curveEndX, curveEndY);
                }
            }
            this.graphics.endStroke();
        };
        return CrossGraphicsContainer;
    }(createjs.Shape));
    project.CrossGraphicsContainer = CrossGraphicsContainer;
})(project || (project = {}));
///<reference path="../libs/easeljs/easeljs.d.ts" />
var project;
(function (project) {
    "use strict";
    var SpotLightContainer = (function (_super) {
        __extends(SpotLightContainer, _super);
        function SpotLightContainer() {
            _super.call(this);
        }
        SpotLightContainer.prototype.drawContents = function (w, h) {
            this.graphics.clear();
            this.graphics.beginFill(createjs.Graphics.getHSL(0, 0, 0)).drawRect(0, 0, w, h);
            var dx = w * 1 / 3 + w / 10 * Math.sin(Date.now() / 4000);
            var dy = h * 1 / 3;
            var size = w / 2;
            // もやっとした円
            this.graphics.beginRadialGradientFill([createjs.Graphics.getHSL(0, 0, 100, 0.3 + 0.008 * Math.random()),
                createjs.Graphics.getHSL(0, 0, 0, 0)], [0.0, 1.0], dx, dy, 0, dx, dy, size);
            this.graphics.drawCircle(dx, dy, size);
            this.graphics.endFill();
            var dx = w * 3 / 4 + w / 15 * Math.cos(Date.now() / 10000);
            var dy = h * 2 / 3;
            var size = w / 3;
            // もやっとした円
            this.graphics.beginRadialGradientFill([
                createjs.Graphics.getHSL(0, 0, 100, 0.3 + 0.006 * Math.random()),
                createjs.Graphics.getHSL(0, 0, 0, 0)], [0.0, 1.0], dx, dy, 0, dx, dy, size);
            this.graphics.drawCircle(dx, dy, size);
            this.graphics.endFill();
        };
        return SpotLightContainer;
    }(createjs.Shape));
    project.SpotLightContainer = SpotLightContainer;
})(project || (project = {}));
///<reference path="../libs/easeljs/easeljs.d.ts" />
var project;
(function (project) {
    "use strict";
    /**
     * 大量のパーティクルを発生させてみた
     * マウスを押してる間でてくるよ
     * @see http://wonderfl.net/c/4WjT
     * @class demo.ParticleSample
     */
    var ParticleContainer = (function (_super) {
        __extends(ParticleContainer, _super);
        function ParticleContainer(numParticlesPerFrame) {
            _super.call(this);
            this._time = 0;
            this._isMouseMoved = false;
            this._tickCount = 0;
            this._bg = new createjs.Shape();
            this.addChild(this._bg);
            this._emitter = new ParticleEmitter(numParticlesPerFrame, 2.0, 2.0);
            this.addChild(this._emitter.container);
            this._emitterForMouse = new ParticleEmitter(2, 6.0, 6.0);
            this.addChild(this._emitterForMouse.container);
            this.on("tick", this.enterFrameHandler, this);
        }
        Object.defineProperty(ParticleContainer.prototype, "isMouseMoved", {
            set: function (value) {
                this._isMouseMoved = true;
                g;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * エンターフレームイベント
         * @param event
         */
        ParticleContainer.prototype.enterFrameHandler = function (event) {
            this._tickCount = this._tickCount + 1;
            if (this._tickCount % 2 == 0) {
                this._emitter.emit(window.innerWidth * Math.random(), window.innerHeight / 5 * (Math.random() - 0.5) + window.innerHeight * 6 / 10);
            }
            this._emitter.update();
            if (this._isMouseMoved == true) {
                var pt = this.globalToLocal(this.getStage().mouseX, this.getStage().mouseY);
                this._emitterForMouse.emit(pt.x, pt.y);
                this._isMouseMoved = false;
            }
            this._emitterForMouse.update();
            var hue = Math.sin(-1 * Date.now() / 400 * Math.PI / 180) * 45 + 200;
            // 背景
            var color1 = createjs.Graphics.getHSL(hue, 100, 60);
            var color2 = createjs.Graphics.getHSL(hue + 120, 100, 40);
            this._bg.graphics
                .clear()
                .beginLinearGradientFill([color1, color2], [0, 1], 0, 0, 0, window.innerHeight)
                .drawRect(0, 0, window.innerWidth, window.innerHeight);
        };
        return ParticleContainer;
    }(createjs.Container));
    project.ParticleContainer = ParticleContainer;
    /**
     * パーティクル発生装置。マウス座標から速度を計算する。
     * @class project.Emitter
     */
    var Emitter = (function () {
        /**
         * @constructor
         */
        function Emitter() {
            /** 速度(X方向) */
            this.vy = 0;
            /** 速度(Y方向) */
            this.x = 0;
            /** マウスのX座標 */
            this.latestY = 0;
            /** マウスのY座標 */
            this.latestX = 0;
            /** パーティクル発生のX座標 */
            this.y = 0;
            /** パーティクル発生のY座標 */
            this.vx = 0;
        }
        /**
         * パーティクルエミッターの計算を行います。この計算によりマウスの引力が計算されます。
         * @method
         */
        Emitter.prototype.update = function () {
            var dx = this.latestX - this.x;
            var dy = this.latestY - this.y;
            var d = Math.sqrt(dx * dx + dy * dy) * 0.2;
            var rad = Math.atan2(dy, dx);
            this.vx += Math.cos(rad) * d;
            this.vy += Math.sin(rad) * d;
            this.vx *= 0.4;
            this.vy *= 0.4;
            this.x += this.vx;
            this.y += this.vy;
        };
        return Emitter;
    }());
    /**
     * パーティクルエミッター
     * @class project.ParticleEmitter
     */
    var ParticleEmitter = (function (_super) {
        __extends(ParticleEmitter, _super);
        /**
         * @constructor
         * @param numParticles 1フレーム間に発生させる Particle 数
         * @param vx
         * @param vy
         */
        function ParticleEmitter(numParticles, startVx, startVy) {
            _super.call(this);
            this.numParticles = numParticles;
            this.startVx = startVx;
            this.startVy = startVy;
            this.PRE_CACHE_PARTICLES = 100;
            this.container = new createjs.Container();
            this._particleActive = [];
            this._particlePool = [];
            /* 予め必要そうな分だけ作成しておく */
            for (var i = 0; i < this.PRE_CACHE_PARTICLES; i++) {
                this._particlePool.push(new Particle());
            }
        }
        /**
         * パーティクルを発生させます。
         * @param {number} x パーティクルの発生座標
         * @param {number} y パーティクルの発生座標
         * @method
         */
        ParticleEmitter.prototype.emit = function (x, y) {
            for (var i = 0; i < this.numParticles; i++) {
                this.getNewParticle(x, y);
            }
        };
        /**
         * パーティクルを更新します。
         * @method
         */
        ParticleEmitter.prototype.update = function () {
            _super.prototype.update.call(this);
            for (var i = 0; i < this._particleActive.length; i++) {
                var p = this._particleActive[i];
                if (!p.getIsDead()) {
                    // 跳ね返り判定するならココに書く
                    p.update();
                }
                else {
                    this.removeParticle(p);
                }
            }
        };
        /**
         * パーティクルを追加します。
         * @param {THREE.Vector3} emitPoint
         * @method
         */
        ParticleEmitter.prototype.getNewParticle = function (emitX, emitY) {
            var p = this.fromPool();
            p.resetParameters(emitX, emitY, this.startVx, this.startVy);
            this._particleActive.push(p);
            this.container.addChild(p);
            return p;
        };
        /**
         * パーティクルを削除します。
         * @param {Particle} particle
         * @method
         */
        ParticleEmitter.prototype.removeParticle = function (p) {
            this.container.removeChild(p);
            var index = this._particleActive.indexOf(p);
            if (index > -1) {
                this._particleActive.splice(index, 1);
            }
            this.toPool(p);
        };
        /**
         * アクティブなパーティクルを取り出します。
         * @returns {project.Particle[]}
         * @method
         */
        ParticleEmitter.prototype.getActiveParticles = function () {
            return this._particleActive;
        };
        /**
         * プールからインスタンスを取り出します。
         * プールになければ新しいインスタンスを作成します。
         * @returns {project.Particle}
         * @method
         */
        ParticleEmitter.prototype.fromPool = function () {
            if (this._particlePool.length > 0)
                return this._particlePool.shift();
            else
                return new Particle();
        };
        /**
         * プールにインスタンスを格納します。
         * @param {project.Particle}
         * @method
         */
        ParticleEmitter.prototype.toPool = function (particle) {
            this._particlePool.push(particle);
        };
        return ParticleEmitter;
    }(Emitter));
    /**
     * @class demo.Particle
     */
    var Particle = (function (_super) {
        __extends(Particle, _super);
        /**
         * コンストラクタ
         * @constructor
         */
        function Particle() {
            _super.call(this);
            this.MAX_SIZE = 128;
            var size = Math.random() * Math.random() * Math.random() * Math.random() * this.MAX_SIZE + 2;
            this.size = size;
            var colorHsl = createjs.Graphics.getHSL(0, 0, 20 + Math.random() * 50);
            this.graphics.clear();
            if (Math.random() < 0.4) {
                // もやっとした円
                this.graphics.beginRadialGradientFill([colorHsl, "#000000"], [0.0, 1.0], 0, 0, 0, 0, 0, this.size);
            }
            else if (Math.random() < 0.1) {
                // 輪郭だけの円
                this.graphics
                    .setStrokeStyle(1) // 線の太さ
                    .beginStroke(createjs.Graphics.getRGB(255, 255, 255));
            }
            else if (Math.random() < 0.3) {
                // 輪郭だけの円
                this.graphics
                    .setStrokeStyle(1.5) // 線の太さ
                    .beginStroke(createjs.Graphics.getRGB(255, 255, 255));
            }
            else {
                // キリッとした円
                this.graphics.beginFill(colorHsl);
            }
            this.graphics.drawCircle(0, 0, this.size);
            this.graphics.endFill();
            // 大量のオブジェクトを重ねるとおかしくなる
            this.compositeOperation = "lighter";
            this.mouseEnabled = false;
            var padding = 2;
            this.cache(-this.size - padding, -this.size - padding, this.size * 2 + padding * 2, this.size * 2 + padding * 2);
            this._destroy = true;
        }
        /**
         * パーティクルをリセットします。
         * @param emitX
         * @param emitY
         */
        Particle.prototype.resetParameters = function (emitX, emitY, startVx, startVy) {
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
        };
        /**
         * パーティクル個別の内部計算を行います。
         * @method
         */
        Particle.prototype.update = function () {
            // 重力計算
            this.vy -= 0.05;
            // 摩擦計算
            this.vx *= 0.98;
            this.vy *= 0.98;
            this.x += this.vx;
            this.y += this.vy;
            this._count++;
            var maxD = (1 - this._count / this.life);
            var sizeNew = (1 - this._count / this.life * this.vSize);
            this.alpha = Math.random() * 0.3 + this.baseAlpha * maxD;
            this.scaleX = this.scaleY = sizeNew;
            // 死亡フラグ
            if (this.life < this._count) {
                this._destroy = true;
                this.parent.removeChild(this);
            }
        };
        /**
         * パーティクルが死んでいるかどうかを確認します。
         * @returns {boolean}
         * @method
         */
        Particle.prototype.getIsDead = function () {
            return this._destroy;
        };
        return Particle;
    }(createjs.Shape));
})(project || (project = {}));
///<reference path="../libs/easeljs/easeljs.d.ts" />
///<reference path="CrossGraphicsContainer.ts" />
///<reference path="ParticleContainer.ts" />
///<reference path="StageHelper.ts" />
var project;
(function (project) {
    "use strict";
    /**
     * パーティクルデモのメインクラスです。
     * @class project.Main
     */
    var MainBase = (function () {
        /**
         * @constructor
         */
        function MainBase(emitPerFrame) {
            var _this = this;
            // 初期設定
            this.stageBase = new createjs.Stage("canvasBase");
            // パーティクルサンプルを作成
            var sample = new project.ParticleContainer(emitPerFrame);
            this.stageBase.addChild(sample);
            // Tickerを作成
            createjs.Ticker.setFPS(60);
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.on("tick", this.handleTick, this);
            var stageOverlay = new createjs.Stage("canvasOverlay");
            this.stageOverlay = stageOverlay;
            this.stageOverlay.nextStage = this.stageBase;
            this.stageBase.on("stagemousemove", function (ev) { sample.isMouseMoved = true; });
            // グラフィック
            this.spotLightContainer = new project.SpotLightContainer();
            stageOverlay.addChild(this.spotLightContainer);
            // 初期設定
            this.stageCalcInside = new createjs.Stage(document.createElement("canvas"));
            this.stageCalcInside.autoClear = false;
            // パーティクルサンプルを作成
            var crossGraphicsContainer = new project.CrossGraphicsContainer();
            this.stageCalcInside.addChild(crossGraphicsContainer);
            this.buildUi();
            // リサイズイベント
            this.handleResize();
            window.addEventListener("resize", function () {
                _this.handleResize();
            });
            // iframe埋め込み & スマホ対策
            setTimeout(function () {
                _this.handleResize();
            }, 100);
        }
        MainBase.prototype.buildUi = function () {
        };
        /**
         * エンターフレームイベント
         */
        MainBase.prototype.handleTick = function () {
            this.spotLightContainer.drawContents(innerWidth, innerHeight);
            // create residual image effect
            this.stageBase.update();
            var context = this.stageCalcInside.canvas.getContext("2d");
            context.fillStyle = "rgba(0, 0, 0, " + 0.35 * Math.random() + ")";
            context.fillRect(0, 0, this.stageCalcInside.canvas.width, this.stageCalcInside.canvas.height);
            this.stageCalcInside.update();
            this.stageOverlay.update();
            var context2 = this.stageOverlay.canvas.getContext("2d");
            context2.globalCompositeOperation = "lighter";
            context2.drawImage(this.stageCalcInside.canvas, 0, 0);
        };
        /**
         * リサイズイベント
         */
        MainBase.prototype.handleResize = function () {
            clockmaker.StageHelper.highDPI(this.stageBase, innerWidth, innerHeight);
            clockmaker.StageHelper.highDPI(this.stageOverlay, innerWidth, innerHeight);
            clockmaker.StageHelper.highDPI(this.stageCalcInside, innerWidth, innerHeight);
        };
        return MainBase;
    }());
    project.MainBase = MainBase;
})(project || (project = {}));
///<reference path="../libs/easeljs/easeljs.d.ts" />
///<reference path="CrossGraphicsContainer.ts" />
///<reference path="ParticleContainer.ts" />
///<reference path="StageHelper.ts" />
///<reference path="MainBase.ts" />
var project;
(function (project) {
    "use strict";
    /** 1フレーム間に発生させる Particle 数 */
    var NUM_PARTICLES = 1;
    // 起動コード
    window.addEventListener("DOMContentLoaded", function () {
        new project.Main(NUM_PARTICLES);
        var title = document.getElementById("mainTitle");
        if (title != null) {
            requestAnimationFrame(function () {
                title.classList.add("show");
            });
        }
    });
    /**
     * パーティクルデモのメインクラスです。
     * @class project.Main
     */
    var Main = (function (_super) {
        __extends(Main, _super);
        /**
         * @constructor
         */
        function Main(emitPerFrame) {
            _super.call(this, emitPerFrame);
            this.buildUi();
        }
        Main.prototype.buildUi = function () {
        };
        /**
         * リサイズイベント
         */
        Main.prototype.handleResize = function () {
            _super.prototype.handleResize.call(this);
        };
        return Main;
    }(project.MainBase));
    project.Main = Main;
})(project || (project = {}));
//# sourceMappingURL=home.js.map