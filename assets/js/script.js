// Смена цвета кнопок 
const button = document.querySelectorAll('.button-logout');

setInterval(changeButtonBackground, 200);

function changeButtonBackground() {
    button.forEach(button => {
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        button.style.backgroundColor = randomColor;
    });
}

// Открытие меню на моб.устройствах
document.addEventListener("DOMContentLoaded", function () {
    const burgerIcon = document.getElementById("burger-icon");
    const burgerMenuContent = document.getElementById("burger-menu-content");

    burgerIcon.addEventListener("click", function () {
        burgerMenuContent.classList.toggle("open");
    });

    document.addEventListener("click", function (e) {
        if (!burgerMenuContent.contains(e.target) && e.target !== burgerIcon) {
            burgerMenuContent.classList.remove("open");
        }
    });
}); 

