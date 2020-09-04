const graph = document.getElementById('graph');
const con = graph.getContext('2d');


graph.addEventListener('DOMContentLoaded', init());
graph.addEventListener('click', createNode);
graph.addEventListener('click', drawEdges);
document.addEventListener('mousemove', changeNode);
graph.addEventListener('click', disp);

let nodeList = [];
let first = 0;
let n = 0;

class Node {
	constructor(x, y, color, sisters) {
		this.x = x;
		this.y = y;
		this.color = color;
		this.sisters = sisters;
		nodeList.push(this);

// following draws when created
	}

	draw() {
		con.beginPath();
   		con.arc(this.x, this.y, 5, 0, Math.PI * 2, true);
		con.fillStyle = this.color;
		con.fill();
		con.closePath();
	}

	addSister(node) {
		this.sisters.push(node)
	}

	changeColor(c) {
		this.color = c;
	}

	drawArrow() {
		for (var s=0; s < this.sisters.length; s++) {
			con.beginPath();

			let endX = this.sisters[s].x;
			let endY = this.sisters[s].y 

			con.moveTo(this.x, this.y);
			con.lineTo(endX, endY);

			let r = 7;

			let dx = endX - this.x;
			let dy = endY - this.y;
			let angle = Math.atan2(dy,dx);			

			angle += (1.2/3.0) * (2 * Math.PI)
			let x = r *Math.cos(angle) + endX;
			let y = r *Math.sin(angle) + endY;

			con.moveTo(x, y);
			con.lineTo(endX,endY);

			con.strokeStyle = 'Aquamarine';
			con.stroke();

			angle += (-1.8) * (2 * Math.PI)
			x = r *Math.cos(angle) + endX;
			y = r *Math.sin(angle) + endY;

			con.lineTo(x,y);
			con.fillStyle = 'dimGray';
			con.fill();
			
			con.closePath();
		}
	}
}


function erase() {
	// the erase button
	nodeList = [];
	first = 0;
	con.fillStyle = 'black';
	con.fillRect(0, 0, window.innerWidth, window.innerHeight);
	console.log("clear");
}

function init() {
	// set up the canvas for drawing
	let canvas = document.getElementById('graph');
	if(graph.getContext) {
		let con = graph.getContext('2d');

		con.canvas.width = window.innerWidth;
		con.canvas.height = window.innerHeight;

		console.log('success');
	}
}


function createNode() {
	if (first == 0) {
		first = new Node((0.5 * window.innerWidth), (0.5 * window.innerHeight), 'orange', []);
		let p = document.getElementById('prompt');
		p.style.display = 'none';
	}
	else {
		for (n in nodeList)
			// hitbox
			dx = (event.clientX - nodeList[n].x);
			dy = (event.clientY - nodeList[n].y);
			diff = Math.sqrt((dx * dx) + (dy * dy));
			// making sure they don't overlap
			if (diff > 15){
				n = new Node(event.clientX, event.clientY, 'white', [first]);
				first.addSister(n);
			}
			else {
				console.log("verbooten!");
			}
		}
	updateDraw();
	}

function changeNode() {
	let x = event.clientX;
	let y = event.clientY;

	for (n in nodeList) {
		// hitbox
		let dx = (x - nodeList[n].x);
		let dy = (y - nodeList[n].y);
		let diff = Math.sqrt((dx * dx) + (dy * dy));

		if (diff <= 10){
			first.changeColor('white');
			first = nodeList[n];
			first.changeColor('orange');
			updateDraw();
		}
	}
}

function updateDraw() {
	// when graph changes call this to update
	con.fillStyle = 'black';
	con.fillRect(0, 0, window.innerWidth, window.innerHeight);
	for (n in nodeList) {
		nodeList[n].draw()
	}
	drawEdges();
}

function drawEdges() {
	for (n in nodeList) {
		nodeList[n].drawArrow();
	}
}

function menu(menu) {
	// display a hidden menu's contents
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
