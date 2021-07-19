A nostalgic Pokemon game in the style of the original Gameboy version. 

- An "open world" stage:
  This makes use of HTML Canvas to animate a sprite on the screen.
  When the character enters the grass there is a chance that they will encounter an enemy Pokemon. 
  
 - A battle mode :
A dynamic damage system has been developed which uses different characteristics to calculate damage based on the type of attack, the Pokemon type and the corresponding attack and defence attributes of both the attacking and defending Pokemon. These are based on calculations used in the original game to offer a closer playing experience to the original.

Live Demo: https://gameboy-classic.herokuapp.com/

<img src="./Thumbnail.png">

-How I built this:
* Being my first project of relative complexity, I chose to focus entirely on vanilla Javascript. The game was a favourite of mine as a child so I had a good understanding of how the end project should turn out. I built the two modes of the game - the "open-world" and battle mode - as separate components which would be rendered to the screen based on which state the player is currently in.
* I used an open source Pokemon API for information and statistics of the Pokemon characters, as well as images. I then built a dynamic damage system which is analogous to the original damage system in the Nintendo games; which calculates damage based on the type of attack, the Pokemon type and the corresponding attack and defence attributes of both the attacking and defending Pokemon.  

-What I learnt:
* I had to learn how HTML Canvas works in order to animate sprites and build the "open-world" aspects of the game.
* To achieve the signature spiralling black screen which proceeds a battle in Pokemon, I had to understand and implement recursive functions.
* I gained a good understanding of how animations work in CSS as well as event timings using Async/Await.
* I used CSS variables in order to dynamically change the colour of damage bars dependent on the level of damage.
* This was my first time experiencing and appreciating the advantages of CSS grid, given the structured layout of the battle mode in Pokemon.

-What I would do differently if I were to do it again:
* Interface in case API goes down.
* Backup of data for simplistic game.
* Make it more responsive.
* Limitations of vanilla Js - react would avoid getElementByID.
* wouldnt work on all browsers - use a build tool to transpile es6 features.
* everyting is declared in global scope.
* Use modules to bundle code (less requests for JS files, avoid namespace pollution, allow more re-use etc).
