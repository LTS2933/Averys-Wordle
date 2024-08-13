let maxGuesses = 6;
let currentGuess = 0;
let answer = '';
let words = [];
let adjectives = [];
let board = document.getElementById('board');

// Fetch words from the text file
fetch('words.txt')
    .then(response => response.text())
    .then(data => {
        words = data.split('\n').map(word => word.trim().toUpperCase());
        return fetch('adjectives.txt'); // Fetch adjectives after words are loaded
    })
    .then(response => response.text())
    .then(data => {
        adjectives = data.split('\n').map(adj => adj.trim());
        startGame(); // Start the game once both words and adjectives are loaded
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        showMessage('Failed to load word list or adjectives.');
    });

function startGame() {
    currentGuess = 0;
    board.innerHTML = ''; // Clear the board content
    document.getElementById('message').innerText = '';

    // 50% chance to make the answer "Avery"
    if (Math.random() < 0.5) {
        answer = 'AVERY';
    } else {
        answer = words[Math.floor(Math.random() * words.length)];
    }

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
    const tiles = document.querySelectorAll('.tile');

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

    if (!words.includes(guess)) {
        showMessage('Word not in word list.');
        return;
    }

    const tiles = document.querySelectorAll('.tile');
    const answerLetterCount = {};
    const guessLetterCount = {};

    // Count the occurrences of each letter in the answer
    for (let i = 0; i < 5; i++) {
        const letter = answer[i];
        answerLetterCount[letter] = (answerLetterCount[letter] || 0) + 1;
    }

    // First pass: Identify correct positions (green)
    for (let i = 0; i < 5; i++) {
        const tile = tiles[currentGuess * 5 + i];
        const letter = guess[i];
        if (letter === answer[i]) {
            tile.classList.add('correct');
            guessLetterCount[letter] = (guessLetterCount[letter] || 0) + 1;
        }
    }

    // Second pass: Identify present letters (yellow) and absent letters (gray)
    for (let i = 0; i < 5; i++) {
        const tile = tiles[currentGuess * 5 + i];
        const letter = guess[i];
        if (!tile.classList.contains('correct')) {
            if (answer.includes(letter) && (guessLetterCount[letter] || 0) < answerLetterCount[letter]) {
                tile.classList.add('present');
                guessLetterCount[letter] = (guessLetterCount[letter] || 0) + 1;
            } else {
                tile.classList.add('absent');
            }
        }
    }

    if (guess === answer) {
        if (answer === 'AVERY') {
            const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
            showMessage(`I love you so much Avery. You're so ${randomAdjective}, so the answer was always you.`);
        } else {
            showMessage('Congratulations! You guessed correctly.');
        }
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

