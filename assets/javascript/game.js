// This is a simple representation of a hangman game. 

// Let's start off by declaring an object for the game. Everything about the game will live in here!
var HangmanGame = {
    // We'll have an array of available words
    availableWords: ["apple", "orange", "banana", "grape", "avocado", "lemon", "watermelon"],
    
    // Let's also make a placeholder variable for the currently selected word.
    currentWord: null,

    // Now, we'll create a placeholder variable for total number of wins, and losses.
    totalWins: 0,
    totalLosses: 0,

    // Let's not forget about the total number of guesses available!
    availableNumberOfGuesses: 10,

    // Now we'll also create an empty array for the letters the user has guessed. 
    // We'll figure out how many times the user has guessed by the length of this array as we fill it up
    guessedLetters: [],

    // Finally, let's have a variable for if the game has started yet or not.
    isStarted: false,

    /* 
    Now that we have our variables declared, let's write some functions to manipulate those variables in the way we want!

    Keep in mind that there are lots of ways to do this. There's no real "right or wrong" way, as long as it works the way you expect it to!
    In this exercise, I'll be breaking down each piece into its own little function
    */

    // First things first, we need to listen for when a person types on their keyboard. 
    listenToKeyboard: function() {
        // In this function, we will do a very simple document.onkeypress listener
        // What I'm doing here below is assigning the `onkeypress` event to the `handleKeyPress` method we have declared just below
        // The reason we use the `.bind(this)` is to help maintain scope within this HangmanGame object. 
        document.onkeypress = this.handleKeyPress.bind(this)
    },

    handleKeyPress: function(event) {
        // If this is the first time, we'll hide all elements with `hide-when-started` class
        if (!this.isStarted) {
            this.handleFirstTimeStart();
        } else { // If we are started, we will do something with the keyboard entry
            
            //Let's declare a letterGuessed variable. This is a string which represents which letter was guessed.
        
            var letterGuessed = String.fromCharCode(event.which);
            // Now we will call the `handleGuess` function and pass the letterGuessed variable.
            this.handleGuess(letterGuessed);
        }

    },

    // Here we declare a little function to handle all the logic for when we start for the first time
    handleFirstTimeStart: function() {
        // Let's hide each element with the class of `hide-when-started`. 
        // This could have been broken out into a separate function if we wanted.
        var hideWhenStartedElements = document.getElementsByClassName('hide-when-started');
        for(var j=0; j<hideWhenStartedElements.length; j++) {            
            hideWhenStartedElements[j].style.display = 'none';
        }
        // Similarily, we will show the elements with a class of `show-when-started`
        var showWhenStartedElements = document.getElementsByClassName('show-when-started');
        for(var j=0; j<hideWhenStartedElements.length; j++) {          
            // This is a different way to set the style in javascript. I'm using it here so I can make use of the !important CSS priority
            showWhenStartedElements[j].style.setProperty('display','block','important'); 
        }

        // Let's go ahead and choose a random word
        this.chooseRandomWord();
        // If we had anything else we wanted to do here when the game is started for the first time, we would put it here.
        this.displayCurrentWord();
        // Now we set isStarted to true because the game has begun!
        this.isStarted = true;
    },

    // When the game is running, we will handle the guessed letter
    handleGuess: function(letter) {
        // First, let's look to make sure the passed variable is even valid!
        // Below is a way to check if the passed `letter` is not anything between a-z or A-Z     
        if (letter.length !== 1 || !letter.match(/[a-z]/i) ) {
            // If there's anything wrong, just return out of this function
            return;
        }
        // Let's go ahead and lowercase the letter so there is no confusion
        letter = letter.toLowerCase();
        // If the letter doesn't already exist in the guessedLetters array, let's add it and run a "turn" in the game
        if (this.guessedLetters.indexOf(letter) === -1) {
            this.guessedLetters.push(letter);
            this.handleTurn();
        }
    },

    // This function is to be called after a letter is guessed. It will look to see if the player has lost or won, and perform appropriate resets.
    handleTurn: function() {

        var hasWon = false;// Real quick, let's create a variable that represents if this is a winning turn. Default it to false.
        // The way that I am checking the `win` condition is if there are no more underscores in the obfuscated word
        var currentObfuscatedWord = this.getObfuscatedWord();
        // If we have 0 underscores in the word, the `.indexOf("_")` method will return -1
        if (currentObfuscatedWord.indexOf("_")  === -1) { 
            hasWon = true;  // We set the hasWon variable to true if there are no underscores
        }

        // So, if we have won, let's celebrate and reset!
        if (hasWon === true) {
            alert("Congratulations, you have won"); 
            this.totalWins++; // Update totalWins   
            this.resetGame(); // And reset the game     
        }
        // Now let's look to see if you have any guesses left. 
        // The way I'll do it here is by looking at the availableNumberOfGuesses and comparing it to the number of guessedLetters
        else if (this.availableNumberOfGuesses <= this.guessedLetters.length) {
            // No more guesses!
            alert("Oh no, you lost! Resetting.")
            this.totalLosses++; // Update totalLosses
            this.resetGame(); // And reset the game
        }
        
        // Whether we win or lose, or keep playing, update all the dynamic information on the page
        this.displayUpdatedGameData();
    },
    
    // This function is responsible for resetting the state of the game after a win or loss. 
    resetGame: function() {
        this.chooseRandomWord(); // Choose a new random word            
        this.guessedLetters = []; // Reset the guessed letters
    },
    // Here we declare a function that will choose a random word from the available words, and set it to the currentWord
    chooseRandomWord: function() {
        // Pick a random number that is within the range of the availableWords array
        var randomNumber = Math.floor(Math.random() * this.availableWords.length);
        // Set the word to the array index of the random number chosen
        this.currentWord = this.availableWords[randomNumber];        
    },



    // This function is responsible for displaying the current word, with or without underscores
    displayCurrentWord: function() {
        
        // Now, we could easily just put the content in here like this
        // document.getElementById('hangman-active-word').innerHTML = this.getObfuscatedWord();

        // But I want to give each letter a bit of padding between each one, so I'm going to do something different

        // start by getting the word.
        var word = this.getObfuscatedWord();
        var displayedContent = '';// Create an empty variable to build our displayed content in.
        for (var j=0;j<word.length; j++) {
            // I'm using a span with the bootstrap utility p-1 class to give each letter some padding
            displayedContent += '<span class="p-1">' + word[j] + '</span>';
        }
        // Now set the #hangman-active-word element's HTML to the built up displayedContent
        document.getElementById('hangman-active-word').innerHTML = displayedContent;
    },

    // This function is responsible for generating and RETURNING the `_ _ _ _ _ _` word. 
    // Note that this can have the real letters replaced if they are guessed!
    getObfuscatedWord: function() {
        // We start with an empty string
        var builtWord = "";
        // Now we loop through every letter in the chosen word, just like it was an array
        for (var j=0; j<this.currentWord.length; j++) {
            // In this loop, we are going to have another loop that 
            // looks at each of the guessed letters (in the `guessedLetters` array) and look for matches
            var hasLetterMatch = false;// We declare this boolean variable outside of the guessedLetters loop and default it to false.
            var currentLetter = this.currentWord[j]; // For an easy reference to the current letter we are checking
            for (var k=0; k<this.guessedLetters.length; k++) {
                // If the letter in the word matches this guessed letter, then...we have a match!
                if (currentLetter === this.guessedLetters[k]) {
                    // When there's a match, we set the hasMatch to true
                    hasLetterMatch = true;
                }
            }
            // Now we check the `hasLetterMatch` boolean
            if (hasLetterMatch === true) { // If there is a match from guessed letters, we show that letter
                builtWord += currentLetter;
            } else { // if there is not a match, we will show the underscore
                builtWord += "_";
            }
        }
        // Now we return the fully build word. Phew!
        return builtWord;
    },

    // This function is responsible for updating all of the dynamic number values on the page
    displayUpdatedGameData: function() {
        document.getElementById('total-number-losses').innerText = this.totalLosses;
        document.getElementById('total-number-wins').innerText = this.totalWins;
        // For the number of guesses left, we set it to the number of available guesses minus the number of guessed letters.
        document.getElementById('number-guesses-left').innerText = (this.availableNumberOfGuesses - this.guessedLetters.length);
        // Display the guessed letters. I will use .join(" ") to join the array into a string, with each item separated by a space.
        document.getElementById('guessed-letters').innerText = this.guessedLetters.join(" ")

        // Now we call the displayCurrentWord function to get that displayed
        this.displayCurrentWord();
    },

    // This `initialize` function will give us an entry point from outside of the object.
    initialize: function() {
        // First we will start by running the `listenToKeyboard()` function to start listening for when the user enters a key
        this.listenToKeyboard();
        
    }
}


// Now that we have made our HangmanGame object. Let's run the `initialize` function to let the object start doing its thing!
HangmanGame.initialize();
