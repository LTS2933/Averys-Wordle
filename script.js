let maxGuesses = 6;
let currentGuess = 0;
let answer = 'SEVEN'; // Always set the answer to "SEVEN"
let lines = [];
let board = document.getElementById('board');

// Fetch lines from the text file
fetch('lines.txt')
    .then(response => response.text())
    .then(data => {
        lines = data.split('\n').map(line => line.trim());
        startGame(); // Start the game once lines are loaded
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        showMessage('Failed to load lines.');
    });

function startGame() {
    currentGuess = 0;
    board.innerHTML = ''; // Clear the board content
    document.getElementById('message').innerText = '';

    for (let i = 0; i < maxGuesses; i++) {
        addRow();
    }
}

function addRow() {
    for (let i = 0; i < 5; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        board.appendChild(tile);
    }
}

document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(e) {
    if (currentGuess >= maxGuesses) return;

    const key = e.key.toUpperCase();

    if (key.length === 1 && key >= 'A' && key <= 'Z') {
        addLetter(key);
    } else if (key === 'BACKSPACE') {
        removeLetter();
    } else if (key === 'ENTER') {
        checkGuess();
    }
}

function addLetter(letter) {
    const tiles = document.querySelectorAll('.tile');
    for (let i = currentGuess * 5; i < (currentGuess + 1) * 5; i++) {
        if (tiles[i].innerText === '') {
            tiles[i].innerText = letter;
            break;
        }
    }
}

function removeLetter() {
    const tiles = document.querySelectorAll('.tile');
    for (let i = (currentGuess + 1) * 5 - 1; i >= currentGuess * 5; i--) {
        if (tiles[i].innerText !== '') {
            tiles[i].innerText = '';
            break;
        }
    }
}

function checkGuess() {
    const guess = getGuess();
    if (guess.length !== 5) {
        showMessage('Please enter a 5-letter word.');
        return;
    }

    if (guess !== answer) {
        showMessage('Word not in word list.');
        return;
    }

    const tiles = document.querySelectorAll('.tile');

    // Highlight the guessed word as correct
    for (let i = 0; i < 5; i++) {
        const tile = tiles[currentGuess * 5 + i];
        tile.classList.add('correct');
    }

    if (guess === answer) {
        // Pick a random line from lines.txt
        const randomLine = lines[Math.floor(Math.random() * lines.length)];
        showMessage(randomLine);
        currentGuess = maxGuesses; // Stop the game
    } else {
        currentGuess++;
        if (currentGuess >= maxGuesses) {
            showMessage(`Sorry, you did not guess correctly. The correct answer was ${answer}.`);
        }
    }
}

function getGuess() {
    const tiles = document.querySelectorAll('.tile');
    let guess = '';
    for (let i = currentGuess * 5; i < (currentGuess + 1) * 5; i++) {
        guess += tiles[i].innerText;
    }
    return guess;
}

function showMessage(message) {
    document.getElementById('message').innerText = message;
}

function restartGame() {
    currentGuess = 0;
    board.innerHTML = ''; 
    document.getElementById('message').innerText = ''; 
    startGame();

    document.getElementById('restart').blur();
    document.body.focus();
}

document.getElementById('restart').addEventListener('click', restartGame);
