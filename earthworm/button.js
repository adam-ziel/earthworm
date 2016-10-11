function Button(x, y, w, h, label) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.label = label;
  this.rollover = false;
  
  this.over = function() {
      if(mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
          this.rollover = true;
      } else {
          this.rollover = false;
      }
  }
  
  this.display = function() {
    strokeWeight(0);
    //rect(this.x, this.y, this.w, this.h);
    textAlign(CENTER, CENTER);
    textSize(14);
    textFont("consolas")
      if(this.rollover){
          strokeWeight(0);
        fill(140, 140, 100, 100);
    } else {
        strokeWeight(0);
        noFill();
        //fill(20, 240, 250);
    }
    //just in the beinning
    if(itoggle){
        fill(230);
    }
    if(itoggle &&this.rollover){
        fill(0, 204, 204);
    }
    
    ellipseMode(CORNER); 
    ellipse(this.x, this.y, this.w, this.h);
    fill(0);
    text(this.label, this.x, this.y, this.w, this.h);
  }
  
}