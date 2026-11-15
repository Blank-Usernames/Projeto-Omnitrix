import { cadastro } from "../utils/auth.js";

/* FORMULÁRIO DE CADASTRO */
const form = document.querySelector("form");
const message = document.getElementById("register-message");

form.addEventListener("submit", (event) => {

    event.preventDefault();

    // Capturar informações
    const username = document.getElementById("nome-usuario").value.trim();
    const email = document.getElementById("email-usuario").value.trim();
    const password = document.getElementById("senha-usuario").value.trim();
    const confirmPassword = document.getElementById("confirmar-senha").value.trim();

    // Executar cadastro
    const resultado = cadastro(username, email, password, confirmPassword);

    // Resultados do cadastro
    message.textContent = resultado.message;

    if (resultado.success) {
        message.style.color = "var(--primary)";

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);

    } else {
        message.style.color = "#ff4444";
    }
});

form.addEventListener("reset", () => {
    message.textContent = "";
});