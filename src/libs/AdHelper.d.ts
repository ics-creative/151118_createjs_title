declare module createjs {
	export class AdHelper extends EventDispatcher {
		constructor(stage:createjs.Stage);
		highDPI(enabled:boolean, scale:number):AdHelper;
		timeSync(framerate:number):AdHelper;
		watchFPS(showAlt:number, minFPS:number, tolerance:number):AdHelper;
	}
}
