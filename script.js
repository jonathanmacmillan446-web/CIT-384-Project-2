$(function() { // Runs once all the DOM elements on the page are ready to be used.

  // Show the starting name, weight, happiness, and energy in the HTML
  checkAndUpdatePetInfoInHtml();

  // When each button is clicked, it calls the function for that button (functions are below)
  $('.treat-button').click(clickedTreatButton);
  $('.play-button').click(clickedPlayButton);
  $('.exercise-button').click(clickedExerciseButton);
  $('.nap-button').click(clickedNapButton); // new button

  // Greeting when the page first loads
  petSays("Hi! I'm " + pet_info.name + ". Click a button to take care of me!");
});

// Object that holds all of the pet's information.
// "energy" is the new key that goes with the new Nap button.
var pet_info = {
  name: "Biscuit",
  weight: 12,
  happiness: 10,
  energy: 80
};

// The pet picks a random line from one of these arrays after each action
var petComments = {
  treat:    ["Yum! More please!", "Crunchy and delicious!", "You're the best, human!"],
  play:     ["Wheee! Chase the string!", "Again, again!", "That was so fun!"],
  exercise: ["Huff... puff... okay, I'm working on it.", "Do I HAVE to?", "Feeling the burn..."],
  nap:      ["Zzz... five more minutes...", "*curls up in a sunny spot*", "Ahh, I feel recharged!"],
  tired:    ["I'm way too tired. Can I take a nap first?", "*yawns* No energy left..."]
};

function clickedTreatButton() {
  pet_info.happiness += 2; // Increase pet happiness
  pet_info.weight += 1;    // Increase pet weight
  pet_info.energy += 5;    // Snacks give a little energy
  petSays(randomComment('treat'));
  bouncePet(1);
  playSound(660);
  checkAndUpdatePetInfoInHtml();
}

function clickedPlayButton() {
  if (pet_info.energy < 15) { // Too tired to play
    petSays(randomComment('tired'));
    playSound(200);
    return;
  }
  pet_info.happiness += 3; // Increase pet happiness
  pet_info.weight -= 1;    // Decrease pet weight
  pet_info.energy -= 15;   // Playing uses energy
  petSays(randomComment('play'));
  bouncePet(3);
  playSound(880);
  checkAndUpdatePetInfoInHtml();
}

function clickedExerciseButton() {
  if (pet_info.energy < 20) { // Too tired to exercise
    petSays(randomComment('tired'));
    playSound(200);
    return;
  }
  pet_info.happiness -= 2; // Decrease pet happiness
  pet_info.weight -= 2;    // Decrease pet weight
  pet_info.energy -= 20;   // Exercise uses a lot of energy
  petSays(randomComment('exercise'));
  bouncePet(2);
  playSound(330);
  checkAndUpdatePetInfoInHtml();
}

// NEW behavior: napping restores energy and makes the pet a little happier
function clickedNapButton() {
  pet_info.energy += 40;
  pet_info.happiness += 1;
  petSays(randomComment('nap'));
  playSound(440);
  checkAndUpdatePetInfoInHtml();
}

function checkAndUpdatePetInfoInHtml() {
  checkWeightAndHappinessBeforeUpdating();
  updatePetInfoInHtml();
}

// Bug fix: keeps the values from going below zero (and keeps energy at most 100)
function checkWeightAndHappinessBeforeUpdating() {
  if (pet_info.weight < 0) {
    pet_info.weight = 0;
  }
  if (pet_info.happiness < 0) {
    pet_info.happiness = 0;
  }
  if (pet_info.energy < 0) {
    pet_info.energy = 0;
  }
  if (pet_info.energy > 100) {
    pet_info.energy = 100;
  }
}

// Updates the HTML with the current values in the pet_info object
function updatePetInfoInHtml() {
  $('.name').text(pet_info['name']);
  $('.weight').text(pet_info['weight']);
  $('.happiness').text(pet_info['happiness']);
  $('.energy').text(pet_info['energy']);
  $('.mood-text').text(getMood());

  /*
   * UNIQUE METHOD #1: .animate()
   * .animate(properties, duration) smoothly changes numeric CSS properties
   * from their current value to a new value over a period of time.
   * Here it grows or shrinks the green energy bar to the new energy
   * percentage over 400 milliseconds, instead of jumping instantly.
   */
  $('.energy-fill').animate({ width: pet_info.energy + '%' }, 400);
}

// Picks a mood word based on the pet's current stats
function getMood() {
  if (pet_info.energy < 20) {
    return "Sleepy";
  } else if (pet_info.happiness >= 20) {
    return "Overjoyed";
  } else if (pet_info.happiness >= 10) {
    return "Happy";
  } else if (pet_info.happiness > 0) {
    return "Grumpy";
  } else {
    return "Miserable";
  }
}

// Returns a random comment from the petComments array for the given action
function randomComment(action) {
  var list = petComments[action];
  return list[Math.floor(Math.random() * list.length)];
}

// Visual notification: shows a speech bubble with a comment from the pet
function petSays(message) {
  var bubble = $('.speech-bubble');

  // Clear any bubble animation that is still running so clicks don't pile up
  bubble.clearQueue().finish();

  bubble.text(message);

  /*
   * UNIQUE METHOD #2: .delay()
   * .delay(milliseconds) pauses the animation queue of an element.
   * The bubble first animates to fully visible (.animate opacity to 1),
   * then .delay(2500) makes it wait 2.5 seconds while the user reads it,
   * and only then does the next .animate() fade it back out.
   * Without .delay(), the fade-out would start right after the fade-in.
   */
  bubble.css('opacity', 0)
        .animate({ opacity: 1 }, 200)
        .delay(2500)
        .animate({ opacity: 0 }, 600);
}

// Makes the pet image hop up and down a number of times using .animate()
function bouncePet(times) {
  var pet = $('.pet-image');
  pet.finish(); // jump to the end of any hop that is still running
  for (var i = 0; i < times; i++) {
    pet.animate({ top: '-25px' }, 150)
       .animate({ top: '0px' }, 150);
  }
}

// Extra: short sound effect using the Web Audio API (no audio files needed)
var audioContext = null;
function playSound(frequency) {
  if (!$('.sound-checkbox').is(':checked')) {
    return;
  }
  try {
    if (audioContext === null) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    var oscillator = audioContext.createOscillator();
    var volume = audioContext.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.value = frequency;
    volume.gain.setValueAtTime(0.15, audioContext.currentTime);
    volume.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
    oscillator.connect(volume);
    volume.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (e) {
    // If the browser can't play audio, the game still works without sound
  }
}
