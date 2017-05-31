///<reference path="easeljs/easeljs.d.ts" />

declare module createjs {
	export class AdHelper extends EventDispatcher {
		constructor(stage:createjs.Stage);
		highDPI(enabled:boolean = true, scale:number = 1):AdHelper;
		timeSync(framerate:number):AdHelper;
		watchFPS(showAlt:number, minFPS:number, tolerance:number):AdHelper;
	}
}
