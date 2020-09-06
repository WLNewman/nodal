const graph = document.getElementById('graph');
const con = graph.getContext('2d');
const font = con.font = " 12px Trebuchet MS";


graph.addEventListener('DOMContentLoaded', init());
graph.addEventListener('mousedown', mouseDiff);
graph.addEventListener('mouseup', drawEdges);
document.addEventListener('keydown', keyPress);
document.addEventListener('mousemove', changeNode);
graph.addEventListener('click', disp);


let nodeList = [];
let pathWay = [];
let first = 0;
let n = 0;
let num = 1;
let stop = false;
let mouseX = 0;
let mouseY = 0;
let path = false;


class Node {
	constructor(x, y, color, sisters) {
		this.x = x;
		this.y = y;
		this.color = color;
		this.sisters = sisters;
		this.distance = 99999999999;
		this.previous = [];
		// weight is edge weight same index as sisters
		this.weight = []
		this.weight.push(1);
		nodeList.push(this);
	}

	// following draws when created
	draw() {
		con.beginPath();
   		con.arc(this.x, this.y, 5, 0, Math.PI * 2, true);
		con.fillStyle = this.color;
		con.fill();
		con.closePath();
	}

	addSister(node) {
		this.sisters.push(node);
		this.weight.push(1);
	}
	removeSister(n) {
		let x = this.sisters.indexOf(n);
		this.sisters.splice(x, 1);
		this.weight.splice(x, 1);
	}
	deleteSelf() {
		// delete reference to self as sister
		let s = 0;
		for (s in this.sisters) {
			this.sisters[s].removeSister(this);
		}
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

	finalPath(target) {
		// draw the shortest pathway
		if (target == this) {
			con.fillStyle = 'yellow';
			let message = 'D= ' + target.distance;
			con.fillText(message, target.x, (target.y - 15));
		}

		con.beginPath();

		let endX = this.previous.x;
		let endY = this.previous.y; 

		con.moveTo(this.x, this.y);
		con.lineTo(endX, endY);
		con.lineWidth = 2;

		con.strokeStyle = 'green';
		con.stroke();
		con.closePath();

		con.lineWidth = 1;

		let z = this.previous;
		if (z.previous.length != 0) {
			z.finalPath();
		}
	}


	changeDistance(n) {
		this.distance = n;
	}
	changePrevious(n) {
		this.previous = n;
	}
	changeColor(c) {
		this.color = c;
	}
	changeXY(x, y) {
		this.x = x;
		this.y = y;
	}
	changeWeight(s, num) {
		let ind = this.sisters.indexOf(s);
		this.weight[ind] += num;
	}
	findWeight(s) {
		let x = this.sisters.indexOf(s);
		return this.weight[x];
	}

	drawArrow(edgeC) {
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

			con.strokeStyle = edgeC;
			con.stroke();

			angle += (-1.8) * (2 * Math.PI)
			x = r *Math.cos(angle) + endX;
			y = r *Math.sin(angle) + endY;

			con.lineTo(x,y);
			con.fillStyle = 'dimGray';
			con.fill();
			
			con.closePath();

			// draw weight

			con.fillStyle = 'pink';
			let midX = (endX + this.x) / 2;
			let midY = (20 + endY + this.y) / 2;
			con.fillText(this.weight[s], midX, midY);
		}
	}
}


function init() {
	// set up the canvas for drawing (sorry about the horrendous length for controls)
	alert('CONTROLS:\nAdd node: click\n\nMove node: right click\n\nPathfinder: go to \'A\' in the top right, hit go and select node\n\nAdd edge: hover near target edge and press space\n\nDelete node: ctrl on top\n\nDelete edge: same as add edge, but use ctrl\n\n'
)
	let canvas = document.getElementById('graph');
	if(graph.getContext) {
		let con = graph.getContext('2d');

		con.canvas.width = window.innerWidth;
		con.canvas.height = window.innerHeight;
	}
}

function erase() {
	// the erase button
	nodeList = [];
	first = 0;
	con.fillStyle = 'black';
	con.fillRect(0, 0, window.innerWidth, window.innerHeight);
}

function createNode() {
	if (first == 0) {
		first = new Node((0.5 * window.innerWidth), (0.5 * window.innerHeight), 'orange', []);
		let p = document.getElementById('prompt');
		p.style.display = 'none';
	}
	else if (path == true) {
		path = false;
		updateDraw(nodeList, 'Aquamarine')
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
	updateDraw(nodeList, 'Aquamarine');
	}

function changeNode() {
	mouseX = event.clientX;
	mouseY = event.clientY;

	// show paths instead of changing nodes
	if (path == true) {
		activateDijkstra()
	}
	else {
		for (n in nodeList) {
			// hitbox
			diff = pythagoras(mouseX, mouseY, nodeList[n].x, nodeList[n].y);
			if (diff <= 8){
				first.changeColor('white');
				first = nodeList[n];
				first.changeColor('orange');
				updateDraw(nodeList, 'Aquamarine');
			}
		}
	}
}

function mouseDiff() {
	if (event.button === 0) {
		createNode();
	}
	else if (event.button === 2) {
		drag();
	}
}

function drag() {
	first.changeXY(mouseX, mouseY);
	updateDraw(nodeList, 'Aquamarine');
}

function pythagoras(x1, y1, x2, y2) {
	let dx = (x1 - x2);
	let dy = (y1 - y2);
	let diff = Math.sqrt((dx ** 2) + (dy ** 2));
	return diff;
}

function updateDraw(list, c) {
	// when graph changes call this to update
	con.fillStyle = 'black';
	con.fillRect(0, 0, window.innerWidth, window.innerHeight);
	for (n in list) {
		list[n].draw()
	}
	drawEdges(c);
}

function drawEdges(c) {
	for (n in nodeList) {
		nodeList[n].drawArrow(c);
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
	console.log(nodeList);
}

function keyPress() {
	switch (event.key) {
		case " ":
			// link two unjoined edges
			for (n in nodeList){
				if (nodeList[n] !== first){
					// prevent looping
					diff = pythagoras(mouseX, mouseY, nodeList[n].x, nodeList[n].y);
					if (diff < 35) {
						// prevent parallel edges
						if (first.notSister(nodeList[n])){
							first.addSister(nodeList[n]);
							nodeList[n].addSister(first);
						}
					}
				}
			}
			updateDraw(nodeList, 'Aquamarine');			
			break;
		case "Control":
		// remove edges/nodes
			if (nodeList.length > 1) { //prevents glitch on empty list
				for (n in nodeList){
					diff = pythagoras(mouseX, mouseY, nodeList[n].x, nodeList[n].y);

					//delete first
					if (nodeList[n] === first && diff < 10) {
						nodeList[n].deleteSelf();
						nodeList.splice(n, 1);
						first = nodeList[0];
						first.changeColor('orange');
					}
					//delete edge between first and other
					 else if (nodeList[n] !== first && diff < 25) {
						first.removeSister(nodeList[n]);
						nodeList[n].removeSister(first);
					}
				}	
			}
			updateDraw(nodeList, 'Aquamarine');		
			break;

		//decrease weight
		case 'Left':
		case 'ArrowLeft':
			for (n in nodeList){
				diff = pythagoras(mouseX, mouseY, nodeList[n].x, nodeList[n].y);
				
				//delete edge between first and other
				if (nodeList[n] !== first && diff < 25) {
					first.changeWeight(nodeList[n], -1);
					nodeList[n].changeWeight(first, -1);
				}
			}
			updateDraw(nodeList, 'Aquamarine');
			break;	
		//increase weight
		case 'Right':
		case 'ArrowRight':
			for (n in nodeList){
				diff = pythagoras(mouseX, mouseY, nodeList[n].x, nodeList[n].y);
				
				//delete edge between first and other
				if (nodeList[n] !== first && diff < 25) {
					first.changeWeight(nodeList[n], 1);
					nodeList[n].changeWeight(first, 1);
				}
			}
			updateDraw(nodeList, 'Aquamarine');
			break;	
		}		
	}


function activateDijkstra() {
	let choice = document.getElementsByName('bott');
	if (path == false) {
	alert('now please select the target');}
	path = true; 
	for (i=0; i < choice.length; i++){
		if (choice[i].checked && choice[i].value == 'dijkstra'){
			let copy = [];
			for (n in nodeList) {
				copy.push(nodeList[n]);
			}
			for (n in nodeList){
				diff = pythagoras(mouseX, mouseY, nodeList[n].x, nodeList[n].y);
				
				//activate dijkstra
				if (nodeList[n] !== first && diff < 25) {
					dijkstra(copy, first, nodeList[n]);
				}
			}
		}
		else if (choice[i].checked && choice[i].value == 'A*'){
			console.log('placeholder');
		}
	}
}

function dijkstra(list, source, target) {
	con.fillStyle = 'black';
	con.fillRect(0, 0, window.innerWidth, window.innerHeight);

	source.changeDistance(0);

	let visited = [];
	var len = list.length;

	while (list.length > 0) {
		let min = 100000000000;
		let activeNode = 'f';

		for (n in list) {
			if (list[n].distance < min) {
				min = list[n].distance;
				activeNode = list[n];
			}
		}
		visited.push(activeNode);
		list.splice(list.indexOf(activeNode), 1);
		updateDraw(visited, 'red');

		let sis = activeNode.sisters;

		for (s in sis) {
			// ALSO DON'T FORGET TO SORT SIS LATER
			let altPath = activeNode.distance + activeNode.findWeight(sis[s]);
			if (altPath <= sis[s].distance){
				sis[s].changeDistance(altPath);
				sis[s].changePrevious(activeNode);
			}
		}
	}

	target.finalPath(target);

	for (n in visited) {
		visited[n].changeDistance(99999999999);
		visited[n].changePrevious([]);
	}
}
