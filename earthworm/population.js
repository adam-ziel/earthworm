// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Interactive Selection
// http://www.genarts.com/karl/papers/siggraph91.html


    // Create the population
  function Population(m, num) {
    this.mutationRate = m; // Mutation rate
    this.population = [];  // array to hold the current population
    this.matingPool = [];
    this.generations = 0;  // Number of generations
    for (var i = 0; i < popmax; i++) {
      this.population[i] = new Melody(new DNA(), 0, ((height-(i*(height/popmax))-height/popmax)));
    }

  // Display all faces
  this.display = function() {
    for (var i = 0; i < this.population.length; i++) {
      this.population[i].display(i);
    }
  }

  // Are we rolling over any of the faces?
  this.rollover = function(mx, my) {
    for (var i = 0; i < this.population.length; i++) {
      this.population[i].rollover(mx, my);
    }
  }
   this.clicked = function() {
    for (var i = 0; i < this.population.length; i++) {
        if(this.population[i].rolloverOn){
      this.population[i].clicked();
        }
    }
  }
  this.save = function() {
      for (var i = 0; i < this.population.length; i++) {
        if(this.population[i].willibeaparent){
      this.population[i].save();
        }
    }
  }
  this.decode = function() {
      for (var i = 0; i < this.population.length; i++) {
      this.population[i].decode();
  }
  }
  
  

  // Generate a mating pool
  this.selection = function() {
    // Clear the ArrayList
    this.matingPool = [];

    // Calculate total fitness of whole population
    var maxFitness = this.getMaxFitness();

    // Calculate fitness for each member of the population (scaled to value between 0 and 1)
    // Based on fitness, each member will get added to the mating pool a certain number of times
    // A higher fitness = more entries to mating pool = more likely to be picked as a parent
    // A lower fitness = fewer entries to mating pool = less likely to be picked as a parent
    for (var i = 0; i < this.population.length; i++) {
      var fitnessNormal = map(this.population[i].getFitness(), 0, maxFitness, 0, 1);
      var n = floor(fitnessNormal * 100);  // Arbitrary multiplier

      for (var j = 0; j < n; j++) {
        this.matingPool.push(this.population[i]);
      }
    }
  }  

  // Making the next generation
  this.reproduction = function() {
    // Refill the population with children from the mating pool
    for (var i = 0; i < this.population.length; i++) {
      // Sping the wheel of fortune to pick two parents
      var m = floor(random(this.matingPool.length));
      var d = floor(random(this.matingPool.length));
      // Pick two parents
      var mom = this.matingPool[m];
      var dad = this.matingPool[d];
      // Get their genes
      var momgenes = mom.getDNA();
      var dadgenes = dad.getDNA();
      // Mate their genes
      var child = momgenes.crossover(dadgenes);
      // Mutate their genes
      child.mutate(this.mutationRate);
      // Fill the new population with the new child
      this.population[i] = new Melody(child, 0, ((height-i*(height/num)-height/num)));
    }
    this.generations++;
  }

  this.getGenerations = function() {
    return this.generations;
  }

  // Find highest fintess for the population
  this.getMaxFitness = function() {
    var record = 0;
    for (var i = 0; i < this.population.length; i++) {
      if (this.population[i].getFitness() > record) {
        record = this.population[i].getFitness();
      }
    }
    return record;
  }
}

