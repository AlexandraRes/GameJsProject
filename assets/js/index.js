// import { RequestsSender, apiURL, logCallback, errorCallback } from "./request_sender.js";
import api from './service/ApiClient.js';

function showResponse(message = "", type = "error") {
  const responseElement = document.querySelector(".response-message");
  if (responseElement) {
    responseElement.textContent = message;
    if (type === "error") {
      responseElement.className = "response-message error";
      responseElement.style.color = "red";
    } else {
      responseElement.className = "response-message success";
      responseElement.style.color = "green";
    }
  } else {
    console.error("Элемент для вывода сообщений не найден.");
  }
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

document.getElementById("register-btn").addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    showResponse("Введите имя пользователя и пароль!", "error");
    return;
  }

  const hashedPassword = await hashPassword(password);

  const response = await api.post(`players`, {
    login: username,
    password: hashedPassword 
  });

  if (response.error) {
    showResponse("Нее второй пользователь с данным кодом не будет существовать ;)", "error");
    return;
  }
  showResponse("Ладно, ты пройдешь", "success");

});

document.getElementById("login-btn").addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    showResponse("Введите имя пользователя и пароль!", "error");
    return;
  }

  const hashedPassword = await hashPassword(password);

  const response = await api.post(`login`, {
    login: username,
    password: hashedPassword 
  });

  if (response.error) {
    showResponse("Ошибка, а вот теперь гадай в чем именно :)", "error");
    return;
  }

  const unsavedScore = localStorage.getItem('unsaved_score');
  const currentUser = localStorage.getItem('currentUser');

  if (unsavedScore && currentUser === username) {
    await api.put(`players/${currentUser}`, { score: Number(unsavedScore) });
    localStorage.removeItem('unsaved_score');
  }

  showResponse("Успешный успех, а сила в памяти!", "success");
  setTimeout(function () {
    window.location.href = '/rules.html';
  }, 2000);
  sessionStorage.setItem("userLoggedIn", true);

  console.log(response);
  
  localStorage.setItem('currentUser', username);
});
