let noCols=30;
let noRows=30;
let play;
let density = 0.2;
let gameResult;
function setup() {
  reset();
}

function reset(){
  gameResult=undefined;
    play = new board(noCols,noRows,floor(noCols*noRows*density));
  createCanvas(play.boxSize*play.width, play.boxSize*play.height);
}

function draw() {
  background(220);
  play.show();
  push();
  textSize(width/4);
  textAlign(CENTER,CENTER);
  fill(0,255,255);
  if(gameResult!=undefined) play.showAllMines();
  if(gameResult==false) text("LOSS",width/2,height/2);
  else if(gameResult==true) text("WIN",width/2,height/2);
  pop();
}

function mousePressed(){
  if(gameResult!=undefined) {reset();return;}
  let x = floor(mouseX/play.boxSize);
  let y = floor(mouseY/play.boxSize);
  play.clicked(y,x);
}

function keyTyped(){
  if(gameResult!=undefined) return
  let x = floor(mouseX/play.boxSize);
  let y = floor(mouseY/play.boxSize);
  play.keyT(y,x,key);
}