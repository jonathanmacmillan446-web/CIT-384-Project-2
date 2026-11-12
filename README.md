# Giga Pet JavaScript – Project 2

A small virtual pet game built with HTML, CSS, JavaScript, and jQuery. Take care of Biscuit the cat by giving treats, playing, exercising, and napping.

## 🚀 Live Demo
You can view the published website here: [Live Website on GitHub Pages](https://jonathanmacmillan446-web.github.io/CIT-384-Project-2/)

## Features
- `pet_info` object with `name`, `weight`, `happiness`, and `energy`
- **Treat**: happiness and weight go up
- **Play**: happiness goes up, weight goes down (uses energy)
- **Exercise**: happiness and weight go down (uses energy)
- **Nap** (new button): restores energy, shown below happiness with an energy bar
- Values can never go below zero (energy is capped at 100)
- Speech bubble with a comment from the pet after every button press (no `alert()` or `console.log()`)
- Mood indicator, hopping animation, and sound effects (can be turned off)

## Unique jQuery methods
1. [`.animate()`](https://api.jquery.com/animate/) – animates the energy bar width, the speech bubble opacity, and the pet's hop.
2. [`.delay()`](https://api.jquery.com/delay/) – keeps the speech bubble on screen for 2.5 seconds before it fades out.

Both are explained with comments in `script.js`.
