// Malakoi http://imaginationrock.com 
// Genetic Algorithm adapted from an example by Daniel Shiffman @ http://natureofcode.com
//u gotta fix the population size method so it doesn't refresh everything. 
//genes [0] codes for mode. genes [1] codes for rhythm. 
// possibilities for advanced options screen:: mutation rate, melodic range, lock modal to ionian, rhymic homophony

//fixed a dirty bug, dirtily. basic sliders weren't updating without calling the advanced screen and closing it again, so I just initialized the advanced screen as on and closed it along with the instructions. no idea what's up. 
var darwintoggle=false;
var count = -1;
var droneamp = 0.1;
var tonality = "modal";
var itoggle = true;
var atoggle = false;
var ibuttonstring = ""
var abuttonstring = ""
var dbuttonstring = ""
var tbuttonstring = ""
var ilockstring = ""
var rlockstring = ""
var notenum;
var drones = [];
var population;
var info;

var dtoggle = false;
var volume;
var basicsliders = [];
var advancedsliders = [];
var bpm = 120;
var notecontrol;
var popmax = 5;
//var mutationRate = 0.05;
var mutationRate = 0.02;
var rlocktoggle = false;
var ilocktoggle = false;
//var lowrange = -2;
//var highrange = 10;
var lowrange = 1;
var highrange = 8;
function setup() {
    atoggle=true;

  createCanvas(windowWidth-20,windowHeight-20);
   darwin = loadImage("resources/Darwin.jpg");
    dna = loadGif('resources/dna.gif');
    //tree = loadImage('resources/transtree.png');
    tanpura = loadSound('resources/drone.mp3')
    tanpura.amp(0.3);
    delay = new p5.Delay();
  delay.process(tanpura, .69, .8, 4300);
  delay.setType('pingPong');
  delay.amp(1);


  //advanced buttons
  //dbutton = new Button(width-190, height-135, 150, 20, dbuttonstring);
  var buttonspace = height/2-165;
  //normal button
  tbutton = new Button(width-155, 165+buttonspace*0.2, 100, 20, tonality);
  sbutton = new Button(width-145, 165+buttonspace*0.4, 100, 20, "bounce");
  rbutton = new Button(width-165, 165+buttonspace*0.6, 100, 20, "start over");
  //make basic sliders in order
  volume = new Slider(width-180, height*0.618+(height*0.312/3), 100, 10, 0, 1);
  volume.pos = 80;
  basicsliders.push(volume);
  notecontrol = new Slider(width-180, height*0.618+(height*0.312*(2/3)), 100, 10, 2.1, 20);
  notecontrol.pos = 30;
  basicsliders.push(notecontrol);
   notenum = basicsliders[1].getvalue();
   bpmcontrol = new Slider(width-180, height*0.618, 100, 10, 40, 200);
  bpmcontrol.pos = 30;
  basicsliders.push(bpmcontrol);
   bpm = basicsliders[2].getvalue();
   //make advanced sliders in order
   popcontrol = new Slider(width-180, height-(height*0.4), 100, 10, 2.1, 20);
  popcontrol.pos = 30;
  advancedsliders.push(popcontrol);
  popmax = round(advancedsliders[0].getvalue());
  population = new Population(mutationRate,popmax);
   
  
  population.decode();
  
}

function mousePressed() {
    if(darwintoggle) {
        nextGen();
        println("new batch!");
        //window.location.href = 'love';
    } else if (ibutton.rollover && itoggle) {
        itoggle = false;
        atoggle=false;
    } else if (ibutton.rollover && !itoggle) {
        itoggle = true;
    } else if (tbutton.rollover && tonality=="modal") {
        
        tonality = "chromatic";
        //population.decode();
        
    } else if (tbutton.rollover && tonality=="chromatic") {
        
        //tonality = "pentatonic";
        tonality = "modal";
        //population.decode();
        
    } else if (tbutton.rollover && tonality=="pentatonic") { //pentatonic isn't implemented yet
        
        tonality = "modal";
        //population.decode();
       
    } else if (abutton.rollover && atoggle) {
        atoggle = false;
    } else if (abutton.rollover && !atoggle) {
        atoggle = true;
    } else if(population.rollover) {
        population.clicked();
    } 
    if(sbutton.rollover){
        population.save();
    }
    if (dbutton.rollover && dtoggle) {
        dtoggle = false;
        // for(var i=0;i<drones.length;i++){
        //     drones[i].stop();
        // }
        // for(var i=0;i<drones.length;i++){
        //     drones[i].stop();
        // }
        tanpura.stop();
    } else if (dbutton.rollover && !dtoggle) {
        dtoggle = true;
        // drone();
        // for(var i=0;i<drones.length;i++){
        //     drones[i].start();
        // }
        tanpura.loop();
        
    } else if (ilock.rollover && !ilocktoggle){
        ilocktoggle = true;
    } else if (ilock.rollover && ilocktoggle){
        ilocktoggle = false;
    } else if (rlock.rollover && !rlocktoggle){
        rlocktoggle = true;
        population.decode();
    }   else if (rlock.rollover && rlocktoggle){
        rlocktoggle = false;
        population.decode();
    } else if (rbutton.rollover){
        //population = new Population(mutationRate,popmax);
        popmax = round(advancedsliders[0].getvalue());
        population = new Population(mutationRate, popmax);
        population.decode();
    }
        
        
    for(var i=0; i<basicsliders.length; i++) {
        if (basicsliders[i].over) {
        basicsliders[i].move = true;
        }
    }
    for(var i=0; i<advancedsliders.length; i++) {
        if (advancedsliders[i].over) {
        advancedsliders[i].move = true;
        }
    }
}

function mouseReleased() {
    if(advancedsliders[0].move){
        popmax = round(advancedsliders[0].getvalue())
    }
    //popmax = round(advancedsliders[0].getvalue())
    //if(advancedsliders[0].move) {
      //  population = new Population(mutationRate,popmax);
    //}
    if(basicsliders[1].move) {
        nextGen();
    } else if (advancedsliders[0].move) {
        //popmax = advancedsliders[0].getvalue();
        population = []; 
        population = new Population(mutationRate, popmax);
        population.decode();
    }
  for(var i=0; i<basicsliders.length; i++) {
  basicsliders[i].move = false;
}
    for(var i=0; i<advancedsliders.length; i++) {
  advancedsliders[i].move = false;
}
}




function draw() {
   
  background(230);
  
  
  population.display();
  if(!itoggle){
     population.rollover(mouseX,mouseY); 
  }
  translate(0,0);
  
  
 
  
    tbutton.label = tonality;
  tbutton.over();
  tbutton.display();
  sbutton.over();
  sbutton.display();
  rbutton.over();
  rbutton.display();
 
  
  //update basicsliders
  if(!atoggle){
  for(var i=0; i<basicsliders.length; i++) {
    basicsliders[i].update();
    basicsliders[i].display();
    }
  }
  
    
    //do slider things 
    masterVolume(basicsliders[0].getvalue());
    
    notenum = basicsliders[1].getvalue();
    popmax = advancedsliders[0].getvalue();
    
    //basicslider text 
    textAlign(LEFT, CENTER);
    if(basicsliders[0].over) {
        fill(0);
        
    } else {
        
        fill(140, 140, 100);
    }
    text("volume " + round(map(basicsliders[0].getvalue(), 0, 1, 0, 10)), width-180,height*0.618+(height*0.312/3)-30, 180, 40);
    if(basicsliders[1].over) {
        fill(0);
        
    } else {
        
        fill(140, 140, 100);
    }
    text("length " + floor(basicsliders[1].getvalue()+1), width-180,height*0.618+(height*0.312*(2/3))-30, 180, 40);
    if(basicsliders[2].over) {
        fill(0);
        
    } else {
        
        fill(140, 140, 100);
    }
    text("speed " + floor(basicsliders[2].getvalue()), width-180,height*0.618-30, 180, 40);
    translate(0,0);
    //
    textAlign(LEFT, LEFT);
    
    text(" generation " + population.getGenerations(), width-180, height-(height/9), 195, 20);
    
    //advanced screen 
   if(atoggle) {
    abuttonstring = "hide advanced";
    textAlign(LEFT, CENTER);
    fill(140, 140, 100);
    rect(width-195, height/2, 190, height/2);
    fill(255, 180);
    rect(width-195, height/2, 190, height/2);
    fill(0);
    textSize(18);
    } if (!atoggle) {
    abuttonstring = "show advanced";
  }
  abutton = new Button(width-190, height/2-23, 180, 20, abuttonstring);
  abutton.over();
  
  abutton.display();
  if(atoggle){
    //update advanced sliders
    for(var i=0; i<advancedsliders.length; i++) {
     advancedsliders[i].update();
     advancedsliders[i].display();
    }
  
  //advanced text
  textAlign(LEFT, CENTER);
  
    if(advancedsliders[0].over) {
        
        fill(0);
        
    } else {
        
        fill(140, 140, 100);
    }
    text("population size " + round(advancedsliders[0].getvalue()), width-180,height-(height*0.4)-30, 180, 40);
    
    //drone button
    if(dtoggle) {
    dbuttonstring = "drone off";
    } if (!dtoggle) {
    dbuttonstring = "drone on";
  }
    dbutton = new Button(width-190, height-(height*0.3), 150, 20, dbuttonstring);
  dbutton.over();
  dbutton.display();
  //ionian lock button 
    if(ilocktoggle) {
    ilockstring = "lock to ionian ON";
    } if (!ilocktoggle) {
    ilockstring = "lock to ionian";
  }
  ilock = new Button(width-190, height-(height*0.2), 150, 20, ilockstring);
  ilock.over();
  ilock.display();
  //ionian lock button 
    if(rlocktoggle) {
    rlockstring = "rhythmic homophony ON";
    } if (!rlocktoggle) {
    rlockstring = "rhythmic homophony";
  }
  rlock = new Button(width-190, height-(height*0.1), 180, 20, rlockstring);
  rlock.over();
  rlock.display();
  
  
  }
  //insructions
  if(itoggle) {
    ibuttonstring = "got it";
    
    fill(140, 140, 100, 230);
    rect(width-(width*0.618), 0, width*0.618, height);
    //image(tree, 0, 0);
    fill(0);
    textSize(18);
    textAlign(LEFT, CENTER);
    text("click on darwin >>\nto evolve a new generation.",width-310, 10, 200, 100);
    textAlign(LEFT, TOP);
    text("mouse over a melody to play it.\nclick on a melody to add it to the mating pool."
      ,width-(width*0.618)+10, 100, (width*0.618)/2, height/2);
    textSize(13);
    text("click modal to switch back and forth from chromatic mode. modal can yeild any of the diatonic modes excluding locrian, while chromatic uses all twelve tones.\n\nselect a melody and click bounce to save it to your computer as a MIDI file.\n\nshow advanced for more options."
      ,(width*0.618), height*0.618, (width*0.618)/2, height/2);
    
    textAlign(RIGHT, TOP);
    fill(255);
    text("v 1.1"
      ,0, height-20, width, 100);
     
  } if (!itoggle) {
    ibuttonstring = "show instructions";
  }
  ibutton = new Button(width-190, 165, 180, 20, ibuttonstring);
  ibutton.over();
  ibutton.display();
  
  ///darwin button, always on top :' )  RIP beautiful soul 
  //image is 106×145 and hangs at the top, everything else should be scaled porportionally and start at 324
  image (darwin, width-200+94/2, 10);
  //if mouse is over darwin set darwin toggle
  if(mouseX>width-200+94/2 && mouseX<width-47 && mouseY>10 && mouseY<155){
      darwintoggle = true;
  } else {
      darwintoggle = false;
  }
  //note that this is actually a cruddy solution. 
  //tint() can't be called on dna until it is loaded,
  //which takes a second. if the user mouses over
  //darwin before dna is loaded, it won't display. 
  //I'm betting on dna being fully loaded after 4 seconds 
  if(darwintoggle && millis()>3000){
     tint(255, 80);
    image (dna, width-200+94/2, 10); 
  } 
  
}

// If the button is clicked, evolve next generation
function nextGen() {
    notenum = basicsliders[1].getvalue();
  population.selection();
  population.reproduction();
  population.decode();
}

function count() {
    population.count();
}

//synthesizing a drone is cool but why. 
// function drone() {
//     drones = []
//      var harmonic = 2;
//     for(var i=0; i<8; i++){
       
//         var drone = new p5.Oscillator();
//         drone.setType('sine');
//         drone.freq(droneamp);
//         drone.pan(random(0, 0.5));
//         drone.amp(droneamp-(i*0.1));
//         drones.push(drone);
//         var drone2 = new p5.Oscillator();
//         drone2.setType('sine');
//         drone2.freq(midiToFreq(43)*harmonic+random(-2, 2));
//         drone2.pan(random(-0.5, 0));
//         drone2.amp(droneamp-(i*0.1));
//         drones.push(drone2);
//         harmonic *= harmonic;
//         if (harmonic> 32){
//             harmonic = 2;
//         }
//     }
   
// }
//dynamic response to window resizing is cool but doesn't work when objects are instantiated with positions in setup()
// function windowResized() {
//   resizeCanvas(
//     window.innerWidth,
//     window.innerHeight
//   );
//   redraw();
// }
