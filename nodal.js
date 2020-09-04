const graph = document.getElementById('graph');
const con = graph.getContext('2d');


graph.addEventListener('DOMContentLoaded', init());
graph.addEventListener('mouseup', createNode);
graph.addEventListener('mouseup', drawEdges);
document.addEventListener('keydown', link);
document.addEventListener('mousemove', changeNode);
graph.addEventListener('click', disp);


let nodeList = [];
let first = 0;
let n = 0;
let num = 1;
let stop = false;
let mouseX = 0;
let mouseY = 0;


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
		this.sisters.push(node);
	}

	notSister(n) {
		// used to verify no parallel edges don't know why I needed to declare s
		let s = 0;
		for (s in this.sisters) {
			if (this.sisters[s] == n) {
				return false;
			}
		}
		return true;
	}

	changeColor(c) {
		this.color = c;
	}

	changeXY(x, y) {
		this.x = x;
		this.y = y;
	}

	drawArrow() {
		for (var s=0; s < this.sisters.length; s++) {
			con.beginPath();

			let endX = this.sisters[s].x;
			let endY = this.sisters[s].y; 

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
			diff = pythagoras(event.clientX, event.clientY, nodeList[n].x, nodeList[n].y);
			// making sure they don't overlap
			console.log(diff);
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
	mouseX = event.clientX;
	mouseY = event.clientY;

	for (n in nodeList) {
		// hitbox
		diff = pythagoras(mouseX, mouseY, nodeList[n].x, nodeList[n].y);
		if (diff <= 5){
			first.changeColor('white');
			first = nodeList[n];
			first.changeColor('orange');
			updateDraw();
		}
	}
}

function link() {
	// link two unjoined edges
	for (n in nodeList){
		if (nodeList[n] !== first){
			// prevent looping
			diff = pythagoras(mouseX, mouseY, nodeList[n].x, nodeList[n].y);
			console.log(diff);
			if (diff < 25) {
				// prevent parallel edges
				if (first.notSister(nodeList[n])){
					first.addSister(nodeList[n]);
					nodeList[n].addSister(first);
					updateDraw();
				}
			}
		}
	}
}

function pythagoras(x1, y1, x2, y2) {
	let dx = (x1 - x2);
	let dy = (y1 - y2);
	let diff = Math.sqrt((dx ** 2) + (dy ** 2));
	return diff;
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

