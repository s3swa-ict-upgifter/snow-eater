// Global variables:
var monster1 = new snowEaterProto(0,0); // Creats a new snowEater monster.
var flake = "";	// A Flake object.
var timer;	// Timer for running the flakes.
var maxMonsterSpeed = 20;	// Variable giving the speed to move the monster.
var snowFallSpeed = 15; // Variable giving the speed to flakes to fall.
var pointsbegin = 10;

var swallowImageSources =
  [
    "images/snowEater3.png",
    "images/snowEater.png"
  ];

// SnowEater object prototype:
function snowEaterProto(x,y){ 
  this.x = x;
  this.y = y;
  this.id = "snowEater";
  this.src= "images/snowEater.png";
   var direction = 0;
	var speed = 0;
	var deltaTime = 0;
	var accelartionTime = 1000.0;
	this.setDirection = function (d) {
		if (direction === d)
			return;
		direction = d;
		deltaTime = 0;
	};
	function lerp(value1, value2, amount) {
		amount = amount < 0 ? 0 : amount;
		amount = amount > 1 ? 1 : amount;
		return value1 + (value2 - value1) * amount;
	}
	function move() {
		//lets just assume js will call our method every 16 ms
		//setTimeout/setInterval is not that accurate tho
		//so you should better calculate elapsed time
		deltaTime += 16;
		speed = lerp(speed, direction * maxMonsterSpeed, deltaTime / accelartionTime);
				this.x += speed;
		var snowEaterElem = find(this.id);
		if (snowEaterElem) {
			snowEaterElem.style.left = this.x + "px";
		}
	}
	setInterval(move.bind(this), 16); //60 ups
}

// SnowFlake object constructor:
function snowFlake(x, y, id) {
  this.x = x;
  this.y = y;
  this.id = id;
}

function swallow(monsterId){
  var index = 0;
  var src = "";
  var timer2 = setInterval(showNextImage, 40);
  function showNextImage(){
    if(index < swallowImageSources.length){
      src = swallowImageSources[index];
      find(monsterId).src = src;
      index++;
    } else{
      clearInterval(timer2);
    }
  }
}

// Creates a snowFlake and HTML-elements containing the flake image.
function createFlake(x,y){

  var i;

  // Creates a new snowFlake object with location and id:
  flake=new snowFlake(x,y, "snowFlake"+1);

  // Creates an img element for the flake and appends it to body:
  var flakeElem = document.createElement("img");

  // Creates and sets an src attribute to the flakeElem:

  var src = document.createAttribute("src");
  src.value = "images/snowFlake.jpg";
  flakeElem.setAttributeNode(src);

  // Creates and sets a class attribute value:
  var class_attr = document.createAttribute("class");
  class_attr.value = "snowFlake";
  flakeElem.setAttributeNode(class_attr);

  // Creates and sets a id attribute value:
  var id_attr = document.createAttribute("id");
  id_attr.value = flake.id;
  flakeElem.setAttributeNode(id_attr);

  // Sets the position:
  flakeElem.style.left = x+"px";
  flakeElem.style.top = y+"px";

  $( "body" ).append(flakeElem);

}

function endGame(){
  window.alert('you lose');
  $(".end").css('z-index', 999)

}

// Keeps the flakes falling and checks also if a flake
// has been caught.
function letItSnow(){

  var i, x, y, flakeElem;
  var fallingStep = snowFallSpeed;
  flake.y += fallingStep;

  var flakeElem = $(`#${flake.id}`);

  if(flakeElem){
    flakeElem.style.top = flake.y+"px";

    // When the flake hits the groundLevel, it will be sent back up.
    var groundLevel = getWindowHeight()-100; // from the roof!

    var monsterMouthLevel = groundLevel-70;
    var monsterMouthLeft = monster1.x+10;	// Left part of mouth.
    var monsterMouthRight = monster1.x+130;	// Right part of mouth.

    // Random x value for the "new" flake:
    var random_x = Math.floor((Math.random() * getWindowWidth()));

    // Test first if flake is inside the mouth:
    if(flake.x > monsterMouthLeft &&
      flake.x < monsterMouthRight &&
      flake.y > monsterMouthLevel){

      sendFlakeUp(random_x, flakeElem);
      swallow(monster1.id);
      // Adds a point:

    } else if(flake.y > groundLevel){
      sendFlakeUp(random_x, flakeElem);
      addaPoint();
    }

    // Recursive call:
    timer = setTimeout("letItSnow()",40);
  }
}

// Starts the snowing:
function init(){
	$(".end").css('z-index', -1);
    document.addEventListener("keydown", keydown);
    document.addEventListener("keyup", keyup);
  createFlake(200,0);
  letItSnow();
}
function keydown(e) {
    var event = e.which || e.keyCode;
    console.log("keydown " + event);
    switch (event) {
        case 37: //left;
            monster1.setDirection(-1);
            break;
        case 38: //up;
            break;
        case 39: //right;
            monster1.setDirection(1);
            break;
        case 40: //down;
            break;
    }
}
function keyup(e) {
    var event = e.which || e.keyCode;
    console.log("keyup " + event);
    switch (event) {
        case 37: //left;
            monster1.setDirection(0);
            break;
        case 38: //up;
            break;
        case 39: //right;
            monster1.setDirection(0);
            break;
        case 40: //down;
            break;
    }

}

// Looks for and returns the element defined by id.
// If not found, returns false.
function find(id){
  var elem = $(`#${id}`);
  return elem;
}

// Adds one to the points:
var addaPoint = function (){
  var currentAmount = parseInt($("#amount")).html());
  if (currentAmount == 1) {
    var newAmount = currentAmount-1;
    $("#amount")).html(newAmount);
    endGame();
    return window.location.reload();
  } else {
    var newAmount = currentAmount-1;
    $("#amount")).html(newAmount);
  }
};

// Sends the flake back up to the point (x,0):
var sendFlakeUp = function (x, flakeElem){
  flakeElem.style.top = 0;
  flake.y = 0;
  flake.x = x;
  flakeElem.style.left = flake.x+"px";
};

// Help: http://stackoverflow.com/questions/3437786/
// get-the-size-of-the-screen-current-web-page-and-browser-window
// Returns the height of the window:
function getWindowHeight(){

  var height = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

  return height;
}
// Returns the width of the window:
function getWindowWidth(){
  var width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

  return width;
}
