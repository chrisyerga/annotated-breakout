// DOM animations

function AnimateBorderRightColor(element, fromColor, toColor, ms) {
	var startMS = Date.now();
	var endMS = startMS + ms;
	var tween = ms;
	var timer = setInterval(function () {

		var now = Date.now();
		if (now >= endMS) {
			clearInterval(timer);
			now = endMS;
		}

		var elapsed = now-startMS;
		var r =Math.floor((toColor[0]-fromColor[0])*elapsed/tween) + fromColor[0];
		var g =Math.floor((toColor[1]-fromColor[1])*elapsed/tween) + fromColor[1];
		var b =Math.floor((toColor[2]-fromColor[2])*elapsed/tween) + fromColor[2];

		var color = "rgb(" + r + "," + g + "," + b + ")";
		element.style.borderLeftColor = color;
	}, 5)
}