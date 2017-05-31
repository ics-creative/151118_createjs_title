///<reference path="../libs/easeljs/easeljs.d.ts" />
///<reference path="CrossGraphicsContainer.ts" />
///<reference path="ParticleContainer.ts" />
///<reference path="StageHelper.ts" />
///<reference path="MainBase.ts" />


namespace project {
  "use strict";

  /** 1フレーム間に発生させる Particle 数 */
  const NUM_PARTICLES:number = 1;

  // 起動コード
  window.addEventListener("DOMContentLoaded", () => {
    new project.Main(NUM_PARTICLES);

    let title = document.getElementById("mainTitle");
    if(title != null){
      requestAnimationFrame(()=>{
        title.classList.add("show");
      });
    }
  });


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

      this.buildUi();
    }

    protected buildUi():void {
    }

    /**
     * リサイズイベント
     */
    protected handleResize():void {
      super.handleResize();
    }
  }
}