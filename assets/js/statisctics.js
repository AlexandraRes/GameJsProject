const url = "https://d5dsv84kj5buag61adme.apigw.yandexcloud.net";

let isAscending = true;
let users = [];
let currentPage = 1;
const rowsPerPage = 5;
let sortColumn = "number"; 

/**
 * Сортируем пользователей по очкам вверх или вниз
 * 
 * @param {*} users 
 * @param {*} ascending 
 * @returns 
 */
const sortUsersByScore = (users, ascending = true) => {
    return users.sort((a, b) => {
        return ascending ? a.Score - b.Score : b.Score - a.Score;
    });
};

/**
 * Сортируем пользователей по заданной колонке
 * 
 * @param {Array} users 
 * @param {String} column 
 * @param {Boolean} ascending 
 * @returns 
 */
const sortUsers = (users, column, ascending = true) => {
    return [...users].sort((a, b) => {
        if (column === "score") {
            return ascending ? a.Score - b.Score : b.Score - a.Score;
        } else if (column === "login") {
            return ascending
                ? a.Login.localeCompare(b.Login)
                : b.Login.localeCompare(a.Login);
        }
    });
};


/**
 * Получение списка пользователей
 */
const usersGet = async () => {
    try {
        const response = await fetch(`${url}/players`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        users = await response.json();
        renderUsersTable(users);
        renderPagination(users.length);
    } catch (e) {
        console.log(e);
    }
};

/**
 * Фильтрация пользователей по логину
 */
const filterUsers = (query) => {
    const filteredUsers = users.filter(user =>
        user.Login.toLowerCase().includes(query.toLowerCase())
    );
    currentPage = 1;
    renderUsersTable(filteredUsers);
    renderPagination(filteredUsers.length);
};

/**
 * Рендерим таблицу
 * 
 * @param {Array} users 
 */
const renderUsersTable = (users) => {
    const tableContainer = document.getElementById("users-table-container");
    const startIdx = (currentPage - 1) * rowsPerPage;
    const paginatedUsers = users.slice(startIdx, startIdx + rowsPerPage);

    const topScores = [...users]
        .sort((a, b) => b.Score - a.Score)
        .slice(0, 3)
        .map(user => user.Score);

    const table = document.createElement("table");
    table.classList.add("users-table");

    const header = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headers = ["№", "Login", "Score"];

    headers.forEach((headerText) => {
        const th = document.createElement("th");
        th.textContent = headerText;

        th.style.cursor = "pointer";
        th.addEventListener("click", (e) => {
            let target = e.target

            if (target.textContent === 'Login') {
                sortColumn = "login";
            } else if (target.textContent === 'Score') {
                sortColumn = "score";
            } else {
                return;
            }

            isAscending = !isAscending;
            const sortedUsers = sortUsers(users, sortColumn, isAscending);
            
            renderUsersTable(sortedUsers);
        });

        headerRow.appendChild(th);
    });

    header.appendChild(headerRow);
    table.appendChild(header);

    const tbody = document.createElement("tbody");

    /* создаем тело таблицы */
    paginatedUsers.forEach((user, index) => {
        const row = document.createElement("tr");

        if (user.Score === topScores[0]) row.classList.add("row-green");
        else if (user.Score === topScores[1]) row.classList.add("row-yellow");
        else if (user.Score === topScores[2]) row.classList.add("row-red");

        const numberCell = document.createElement("td");
        numberCell.textContent = index + 1;
        row.appendChild(numberCell);

        const loginCell = document.createElement("td");
        loginCell.textContent = user.Login;
        row.appendChild(loginCell);

        const scoreCell = document.createElement("td");
        scoreCell.textContent = user.Score;
        row.appendChild(scoreCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);

    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
};

/**
 * Рендер пагинации
 */
const renderPagination = (totalRows) => {
    const paginationContainer = document.getElementById("pagination-container");
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.classList.add("pagination-button");
        if (i === currentPage) button.classList.add("active");
        button.addEventListener("click", () => {
            currentPage = i;
            renderUsersTable(users);
        });
        paginationContainer.appendChild(button);
    }
};

/**
 * Обработчик поиска
 */
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.createElement("input");
    searchInput.setAttribute("type", "text");
    searchInput.classList.add('search');
    searchInput.setAttribute("placeholder", "Поиск по логину...");
    searchInput.addEventListener("input", (e) => {
        filterUsers(e.target.value);
    });

    const tableContainer = document.getElementById("users-table-container");
    tableContainer.parentNode.insertBefore(searchInput, tableContainer);

    usersGet();
});



