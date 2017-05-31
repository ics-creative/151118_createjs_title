///<reference path="../libs/easeljs/easeljs.d.ts" />
///<reference path="../src/CrossGraphicsContainer.ts" />
///<reference path="../src/ParticleContainer.ts" />
///<reference path="../src/SpotLightContainer.ts" />
///<reference path="../src/StageHelper.ts" />
///<reference path="../src/MainBase.ts" />

namespace project {
  "use strict";


  /** 1フレーム間に発生させる Particle 数 */
  const NUM_PARTICLES:number = 1;

  window.onload = ()=> {
    new project.Main(NUM_PARTICLES);
  };

  /**
   * パーティクルデモのメインクラスです。
   * @class project.Main
   */
  export class Main extends project.MainBase {
    /**
     * @constructor
     */
    constructor(emitPerFrame:number) {
      super(emitPerFrame);
    }
  }
}