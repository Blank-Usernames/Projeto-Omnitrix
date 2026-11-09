import { login } from "../utils/auth.js";

/* FORMULÁRIO DE LOGIN */
const form = document.querySelector("form");
const message = document.getElementById("login-message");

form.addEventListener("submit", (event) => {

    event.preventDefault();

    // Capturar informações
    const username = document.getElementById("user-login").value;
    const password = document.getElementById("passwd-login").value;

    // Executar login
    const resultado = login(username, password);

    // Resultados do login
    message.textContent = resultado.message;

    if (resultado.success) {
        message.style.color = "var(--primary)";

        setTimeout(() => {
            window.location.href = "roulette.html";
        }, 1000);

    } else {
        message.style.color = "#ff4444";
    }
});