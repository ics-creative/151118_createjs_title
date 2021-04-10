export class SpotLightContainer extends createjs.Shape {
  constructor() {
    super();
  }

  public drawContents(w: number, h: number): void {
    this.graphics.clear();
    this.graphics
      .beginFill(createjs.Graphics.getHSL(0, 0, 0))
      .drawRect(0, 0, w, h);
    {
      const dx = (w * 1) / 3 + (w / 10) * Math.sin(Date.now() / 4000);
      const dy = (h * 1) / 3;
      const size = w / 2;

      // もやっとした円
      this.graphics.beginRadialGradientFill(
        [
          createjs.Graphics.getHSL(0, 0, 100, 0.3 + 0.008 * Math.random()),
          createjs.Graphics.getHSL(0, 0, 0, 0),
        ],
        [0.0, 1.0],
        dx,
        dy,
        0,
        dx,
        dy,
        size
      );

      this.graphics.drawCircle(dx, dy, size);
      this.graphics.endFill();
    }

    {
      const dx = (w * 3) / 4 + (w / 15) * Math.cos(Date.now() / 10000);
      const dy = (h * 2) / 3;
      const size = w / 3;

      // もやっとした円
      this.graphics.beginRadialGradientFill(
        [
          createjs.Graphics.getHSL(0, 0, 100, 0.3 + 0.006 * Math.random()),
          createjs.Graphics.getHSL(0, 0, 0, 0),
        ],
        [0.0, 1.0],
        dx,
        dy,
        0,
        dx,
        dy,
        size
      );

      this.graphics.drawCircle(dx, dy, size);
      this.graphics.endFill();
    }
  }
}
