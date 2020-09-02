function run() {
	document.body.style.backgroundColor = "white";
}

function erase() {
	alert("Are you sure you want to erase?")
}

function speak(){
	let elem = document.getElementById("j");
	if (elem.style.color = "white"){
		elem.style.color = "orange";
	}
	else if (elem.style.color = "orange"){
		elem.style.color = "white";
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

function draw() {
	let canvas = document.getElementById('nodes');
	// canvas.style.border = '1px solid white';
	if(canvas.getContext) {
		let con = canvas.getContext('2d');

		con.canvas.width = window.innerWidth;
		con.canvas.height = window.innerHeight;

		con.beginPath();
		con.arc(200, 75, 5, 0, Math.PI * 2, true);
		// con.lineWidth = 10;
		con.fillStyle = "white";
		con.fill();
	}
}