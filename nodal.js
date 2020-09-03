function run() {
	document.body.style.backgroundColor = "white";
}

function erase() {
	for (var i=1; i < nodeList.length; i++) {
		nodeList.splice[i];
	}
}


nodeList = []

class Node {
	constructor(x, y, color, sisters) {
		this.x = x;
		this.y = y;
		this.color = color;
		this.sisters = sisters;
		nodeList.push(this);

// following draws when created
		this.canvas = document.getElementById("graph");
		this.con = this.canvas.getContext('2d');
		this.con.beginPath();

   		this.con.arc(this.x, this.y, 5, 0, Math.PI * 2, true);
		this.con.fillStyle = this.color;
		this.con.fill();
		this.con.closePath();
	}

	x() {
		return this._x;
	}
	y() {
		return this._y;
	}

	addSister(node) {
		this.sisters.push(node)
	}

	drawArrow() {
		for (var s=0; s < this.sisters.length; s++) {
			this.con = this.canvas.getContext('2d');
			this.con.beginPath();

			let endX = this.sisters[s].x;
			let endY = this.sisters[s].y 

			this.con.moveTo(this.x, this.y);
			this.con.lineTo(endX, endY);

			let r = 10;

			let dx = endX - this.x;
			let dy = endY - this.y;
			let angle = Math.atan2(dy,dx);			

			angle += (1.2/3.0) * (2 * Math.PI)
			let x = r *Math.cos(angle) + endX;
			let y = r *Math.sin(angle) + endY;

			this.con.moveTo(x, y);
			this.con.lineTo(endX,endY);
			this.con.strokeStyle = 'white';
			this.con.stroke();
			this.con.closePath();
		}
	}
}


function drawNodes() {
	for (n in nodeList) {
		nodeList[n].draw();
	}
}

function menu(menu) {
	let i = document.getElementById(menu);
	if(i.style.display === "block"){
		i.style.display = "none";
	}
	else {
		i.style.display = "block";
	}
}

function disp() {
	for (n in nodeList) {
		console.log(nodeList[n]);
	}
}

function draw() {
	let canvas = document.getElementById('graph');
	// canvas.style.border = '1px solid white';
	if(canvas.getContext) {
		let con = canvas.getContext('2d');

		con.canvas.width = window.innerWidth;
		con.canvas.height = window.innerHeight;

		console.log('success');
	}
}
