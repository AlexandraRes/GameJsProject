// import { RequestsSender, apiURL } from 'https://alexandrares.github.io/GameJS/assets/js/request_sender.js';
// const api = new RequestsSender(apiURL, handleApiResponse, handleApiError, true);
// const handleApiResponse = async r => {
//      response = await r;
// }

// const handleApiError = r => {
//     console.log('error', r);
// }
import api from './service/ApiClient.js';

// Основные переменные
let playerName = '';
let score = 0;
let highScore = 0;
let sequence = [];
let userSequence = [];
let isPlaying = false;

// Получаем элементы модального окна и игры
// const modal = document.getElementById('modal');
// const nameInput = document.getElementById('name-input');
// const errorMessage = document.getElementById('error-message');
// const gameContainer = document.getElementById('game-container');
const playerNameDisplay = document.getElementById('player-name');
// const submitNameButton = document.getElementById('submit-name');
const startGameButton = document.getElementById('start-game');
const logoutButton = document.getElementById('logout');
const welcomeMessage = document.getElementById('welcome-message');

// Звуки
const sounds = {
    green: new Audio('/assets/sounds/green.mp3'),
    red: new Audio('/assets/sounds/red.mp3'),
    yellow: new Audio('/assets/sounds/yellow.mp3'),
    blue: new Audio('/assets/sounds/blue.mp3'),
    click: new Audio('/assets/sounds/click.mp3'),
    start: new Audio('/assets/sounds/start-game.mp3')
    // green: new Audio('https://alexandrares.github.io/GameJS/assets/sounds/green.mp3'),
    // red: new Audio('https://alexandrares.github.io/GameJS/assets/sounds/red.mp3'),
    // yellow: new Audio('https://alexandrares.github.io/GameJS/assets/sounds/yellow.mp3'),
    // blue: new Audio('https://alexandrares.github.io/GameJS/assets/sounds/blue.mp3'),
    // click: new Audio('https://alexandrares.github.io/GameJS/assets/sounds/click.mp3'),
    // start: new Audio('https://alexandrares.github.io/GameJS/assets/sounds/start-game.mp3')
};

// Загружаем таблицу пользователей из localStorage или создаем новую, если ее нет
let usersTable = JSON.parse(localStorage.getItem('usersTable')) || {};

// Функция для обновления данных в таблице пользователей
function updateUsersTable() {
    localStorage.setItem('usersTable', JSON.stringify(usersTable));
}

// Проверка наличия пользователя в таблице
if (localStorage.getItem('currentUser')) {
    playerName = localStorage.getItem('currentUser');
    if (usersTable[playerName]) {
        score = usersTable[playerName].score;
        highScore = usersTable[playerName].highScore;
        welcomeMessage.textContent = "Мы рады снова вас видеть, " + playerName + "!";
    } else {
        usersTable[playerName] = { score: 0, highScore: 0 };
        updateUsersTable();
        welcomeMessage.textContent = "Рады с вами познакомиться!";
    }
    playerNameDisplay.textContent = playerName;
    document.getElementById('current-score').textContent = score;
    document.getElementById('high-score').textContent = highScore;
} else {
    welcomeMessage.textContent = "Рады с вами познакомиться!";
}

// Обработка нажатия на кнопку "Submit"
// submitNameButton.addEventListener('click', function () {
//     const name = nameInput.value.trim();

//     if (name === "") {
//         showError();
//     } else {
//         playerName = name.toLowerCase();
//         localStorage.setItem('currentUser', playerName);
//         playerNameDisplay.textContent = playerName;
//         if (!usersTable[playerName]) {
//             usersTable[playerName] = { score: 0, highScore: 0 };
//             welcomeMessage.textContent = "Рады с вами познакомиться, " + playerName + "!";
//         } else {
//             score = usersTable[playerName].score;
//             highScore = usersTable[playerName].highScore;
//             welcomeMessage.textContent = "Мы рады снова вас видеть, " + playerName + "!";
//         }
//         updateUsersTable();
//         closeModal();
//         document.getElementById('current-score').textContent = score;
//         document.getElementById('high-score').textContent = highScore;
//     }
// });

startGameButton.addEventListener('click', startGame);

// Функция для показа ошибки при пустом имени
// function showError() {
//     nameInput.classList.add('error');
//     errorMessage.style.display = 'block';
// }

// Закрытие модального окна
// function closeModal() {
//     modal.style.display = 'none';
//     gameContainer.style.display = 'block';
// }

// Запуск игры
function startGame() {
    isPlaying = true;
    startGameButton.removeEventListener('click', startGame);
    resetGame();
    disableButtons();
    sounds.start.play();
    setTimeout(() => {
        nextRound();
        playSequence();
    }, 1000);
    audioPlayer.volume = 0.1;
}

// Функция сброса игры
function resetGame() {
    score = 0;
    sequence = [];
    userSequence = [];
    document.getElementById('current-score').textContent = score;
}

// Генерация следующей последовательности
function nextRound() {
    let nextColor = ['green', 'red', 'yellow', 'blue'][Math.floor(Math.random() * 4)];
    sequence.push(nextColor);
}

// Функция для блокировки кнопок
function disableButtons() {
    document.querySelectorAll('.color-button').forEach(button => {
        button.classList.add('disabled');
        button.style.pointerEvents = 'none';
    });
}

// Функция для разблокировки кнопок
function enableButtons() {
    document.querySelectorAll('.color-button').forEach(button => {
        button.classList.remove('disabled');
        button.style.pointerEvents = 'auto';
    });
}

// Проигрывание последовательности цветов
function playSequence() {
    let delay = 0;
    disableButtons();
    sequence.forEach((color, index) => {
        setTimeout(() => {
            flashButton(color);
            if (index === sequence.length - 1) {
                setTimeout(() => {
                    enableButtons();
                }, 1000);
            }
        }, delay);
        delay += 1000;
    });
    userSequence = [];
}

// Проигрывание звука и подсветка цвета
function flashButton(color) {
    sounds[color].play();
}

// Обработка кликов на цветные кнопки
document.querySelectorAll('.color-button').forEach(button => {
    button.addEventListener('click', (e) => {
        const selectedColor = e.target.id;
        sounds.click.play();
        userSequence.push(selectedColor);
        checkUserSequence();
    });
});

// Проверка последовательности пользователя
function checkUserSequence() {
    if (!isPlaying) {
        return;
    }

    if (userSequence[userSequence.length - 1] !== sequence[userSequence.length - 1]) {
        endGame();
        startGameButton.addEventListener('click', startGame);
        return;
    }

    if (userSequence.length === sequence.length) {
        score++;
        document.getElementById('current-score').textContent = score;
        usersTable[playerName].score = score;
        if (score > highScore) {
            highScore = score;
            usersTable[playerName].highScore = highScore;
            document.getElementById('high-score').textContent = highScore;
        }
        updateUsersTable();
        setTimeout(() => {
            nextRound();
            playSequence();
        }, 1000);
    }
}

// Функция завершения игры
async function endGame() {
    isPlaying = false;
    alert(`Игра окончена! Ваш счёт: ${score}`);

    const response = await api.put(`players/${localStorage.getItem('currentUser')}`, { score: score });

    if (response.error) {
        localStorage.setItem('unsaved_score', score);
    }
    

    usersTable[playerName].score = 0;
    updateUsersTable();
    document.getElementById('current-score').textContent = 0;

}


// Обработка выхода из игры
logoutButton.addEventListener('click', function () {
    localStorage.removeItem('currentUser');
    // playerName = '';
    // gameContainer.style.display = 'none';
    // modal.style.display = 'flex';
    // nameInput.value = '';
    // welcomeMessage.textContent = '';
    window.location.href = '/index.html';
    if (isPlayingMusic) {
        audioPlayer.pause();
        playIcon.textContent = '▶️';
        isPlayingMusic = false;
        audioPlayer.volume = 1;
    }
});

// Музыка
const playButton = document.getElementById('playButton');
const playIcon = document.getElementById('playIcon');
const audioPlayer = document.getElementById('audioPlayer');
let isPlayingMusic = false;

playButton.addEventListener('click', () => {
    if (isPlayingMusic) {
        audioPlayer.pause();
        playIcon.textContent = '▶️';
        isPlayingMusic = false;
    } else {
        audioPlayer.play();
        playIcon.textContent = '⏸️';
        isPlayingMusic = true;
    }
});