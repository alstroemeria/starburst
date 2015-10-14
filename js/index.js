window.requestAnimFrame = (function(){
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	function( callback ) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

var canvas = document.getElementById('mainCanvas');
var inter = document.getElementsByClassName('interface')[0]
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');
var mousePos={x:canvas.width/2, y:canvas.height/2};


function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top
	};
}
inter.addEventListener('mousemove', function(event) {
	mousePos = getMousePos(canvas, event);
}, false);

inter.addEventListener('mousedown', function(event) {
	particleSystem.shuffle();
}, false);


var numParticles = 1500,
	power = 100,
	speed = 0.8,
	attraction = 0.97,
	size = 1.4,
	color = '#000';

var gui = new dat.GUI();
gui.close();
gui.add(window, 'power').min(1).max(500).step(1).name('Power');
gui.add(window, 'speed').min(0.1).max(2).step(0.1).name('Speed');
gui.add(window, 'attraction').min(0.9).max(1).step(0.01).name('Attraction');
gui.add(window, 'size').min(0.5).max(3).step(0.1).name('Size');
gui.add(window, 'numParticles').min(1).max(5000).step(1).name('Particles').onFinishChange(function() {
	particleSystem = new ParticleSystem();
});
gui.addColor(window, 'color').name('Color');

var Particle = function(x, y) {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.lastX = x;
    this.lastY = y;
};

Particle.prototype.draw = function () {
    this.lastX = this.x;
    this.lastY = this.y;
    angle = Math.atan2( this.y - mousePos.y, this.x - mousePos.x);
    this.dx -= speed * Math.cos(angle);
    this.dy -= speed * Math.sin(angle);
    this.x += this.dx;
    this.y += this.dy;
    this.x *= attraction;
    this.y *= attraction;

	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
	ctx.fill();
};

var ParticleSystem = function () {
	this.particles = [];
	for (var i = 0; i < numParticles; i++) {
		randX =  Math.random() * canvas.width;
        randY =  Math.random() * canvas.height;
		this.particles.push(new Particle(randX, randY));
	}
};

ParticleSystem.prototype.draw = function () {
	for (var i = 0; i < this.particles.length; i++) {
		this.particles[i].draw();
	}
};

ParticleSystem.prototype.shuffle = function () {
	for (var i = 0; i < numParticles; i++) {
		randAngle = Math.random()* 360;
        randPower = Math.random()* power/2;
		this.particles[i].dx += randPower * Math.cos(randAngle);
		this.particles[i].dy += randPower * Math.sin(randAngle);
	}
};
var particleSystem = new ParticleSystem();

window.onresize = function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	particleSystem = new ParticleSystem();
};

(function animate(){
	requestAnimFrame(animate);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	particleSystem.draw();
})();