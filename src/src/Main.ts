import "createjs-easeljs";
import "noise";
import {MainBase} from './MainBase';

import { pngTitle } from '../assets/title-assets/title.png';

/** 1フレーム間に発生させる Particle 数 */
const NUM_PARTICLES: number = 1;

// 起動コード
window.addEventListener('DOMContentLoaded', () => {
  new Main(NUM_PARTICLES);

  const title  = document.createElement('img');
  title.src    = pngTitle;
  title.width  = 400;
  title.height = 160;
  title.id     = 'mainTitle';
  document.body.appendChild(title);

  requestAnimationFrame(() => {
    title.classList.add('show');
  });
});


/**
 * パーティクルデモのメインクラスです。
 * @class project.Main
 */
class Main extends MainBase {
  /**
   * @constructor
   */
  constructor(emitPerFrame: number) {
    super(emitPerFrame);

    this.buildUi();
  }

  protected buildUi(): void {
  }

  /**
   * リサイズイベント
   */
  protected handleResize(): void {
    super.handleResize();
  }
}