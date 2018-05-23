export class StageHelper {
  static highDPI(stage: createjs.Stage, w: number, h: number) {
    const backingRatio = StageHelper._getBackingRatio(stage);
    const scale = Math.max(1, (window.devicePixelRatio || 1) / backingRatio);
    const canvas = <HTMLCanvasElement>stage.canvas;
    const style = canvas.style;

    //console.log(scale, window.devicePixelRatio, backingRatio)

    canvas.width = w * scale;
    canvas.height = h * scale;
    //style.width = w + "px";
    //style.height = h + "px";
    stage.scaleX = stage.scaleY = scale;
    return this;
  }

  static _getBackingRatio(stage: createjs.Stage): number {
    const ctx = <any>(<HTMLCanvasElement>stage.canvas).getContext("2d");
    return (
      ctx.backingStorePixelRatio ||
      ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      1
    );
  }
}
