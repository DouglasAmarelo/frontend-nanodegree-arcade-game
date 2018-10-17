// Helper
function randomNumer(arr) {
	return Math.floor(Math.random() * arr.length);
}

// Variables
var score     = 0;
var positionX = [0, 101, 202, 303, 404];
var positionY = [62, 145, 230];
var arrSpeeds = [100, 150, 200, 250, 400, 500];
var arrGems   = ['images/Gem-Blue.png', 'images/Gem-Green.png','images/Gem-Orange.png'];
var scoreEl   = document.querySelector('.score-number');
var objGems   = {
	element: document.querySelector('.items-number'),
	score: 0,
	image: function() {
		return arrGems[randomNumer(arrGems)]
	}
};

// Functions

// Set a random position for the player
function playerPosition() {
	var playerInitialPosition = {
		x: positionX[randomNumer(positionX)],
		y: 400
	};
	return playerInitialPosition;
};

// Set a random position for the gems
function itemPosition() {
	var itemRandomPosition = {
		x: positionX[randomNumer(positionX)],
		y: positionY[randomNumer(positionY)]
	};
	return itemRandomPosition;
};

// Verify if the player and the enemy collided
function checkCollisions(allEnemies, player) {
	for (var i = 0; i <= (allEnemies.length - 1); i++) {
		var enemy = allEnemies[i];

		if ((player.y >= (enemy.y - 50) && player.y <= (enemy.y + 50)) && (player.x >= (enemy.x - 50) && player.x <= (enemy.x + 50))) {
			player.x = playerPosition().x;
			player.y = playerPosition().y;
			updateScore('error');
		}
	}
};

// Verify if the player got the gem
function checkCollisionsWithItems(item, player) {
	if ((player.y >= (item.y - 50) && player.y <= (item.y + 50)) && (player.x >= (item.x - 50) && player.x <= (item.x + 50))) {
		item.update();
		updateGemScore();
	}
};

// Update the game score
function updateScore(type) {
	if (type === 'success') {
		score += 1;
	}
	else if (type === 'error') {
		score -= 1;
	}

	if (score <= 0) {
		score = 0;
		swal(
			'OH NOO!',
			'You lost!!!',
			'error'
		);
	}

	scoreEl.textContent = score;

	animateScore(scoreEl.parentNode.parentNode, type);
};

// Update the gems scores
function updateGemScore() {
	var element = objGems.element;
	objGems.score++;

	element.textContent = objGems.score;

	animateScore(element.parentNode.parentNode, 'success');
}

// Make an animation in the elements that are updating
function animateScore(element, cssClass) {
	element.classList.add(cssClass, 'update-score');
	setTimeout(function() {
		element.classList.remove(cssClass, 'update-score');
	}, 1000);
}

// Enemies our player must avoid
var Enemy = function(x, y, sprite) {
	this.x = x;
	this.y = y;
	this.sprite = sprite ? sprite : 'images/enemy-bug.png';
	this.speed = arrSpeeds[randomNumer(arrSpeeds)];
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.
	this.x += this.speed * dt;
	if (this.x >= 505) {
		this.x = 0;
	};
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y, sprite) {
	this.x = x,
	this.y = y,
	this.sprite = sprite ? sprite : 'images/char-boy.png';
};

Player.prototype.update = function() {
	if (this.y <= 0) {
		this.x = playerPosition().x;
		this.y = playerPosition().y;
		updateScore('success');
	}
};

Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
	if (key === 'left' && this.x > 0) {
		this.x -= 101;
	}
	else if (key === 'right' && this.x < 400) {
		this.x += 101;
	}
	else if (key === 'up' && this.y > 0) {
		this.y -= 90;
	}
	else if (key === 'down' && this.y < 400) {
		this.y += 90;
	}
	else {
		console.log('Nop!!!');
	}
};

var Items = function(x, y, sprite) {
	this.x = x,
	this.y = y,
	this.sprite = sprite ? sprite : 'images/Gem-Blue.png';
};

Items.prototype.update = function() {
	this.x = itemPosition().x;
	this.y = itemPosition().y;
	this.sprite = objGems.image();
};

Items.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [
	new Enemy(0, 62),
	new Enemy(202, 145),
	new Enemy(404, 230)
];

var item = new Items(
	itemPosition().x,
	itemPosition().y,
	objGems.image()
);
