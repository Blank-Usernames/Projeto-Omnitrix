import { getCurrentUser, logout } from "./utils/auth.js";

/* NAVBAR */
const guestLinks = document.querySelectorAll("[data-guest-only]");
const authLinks = document.querySelectorAll("[data-auth-only]");

const currentUser = getCurrentUser();

// Verificar estado da autenticação
if (currentUser) {
    // Esconder links de visitantes
    guestLinks.forEach(link => {
        link.style.display = "none";
    });
} else {
    // Esconder links de usuários autenticados
    authLinks.forEach(link => {
        link.style.display = "none";
    });
}

const logoutLink = document.getElementById("logout-link");

logoutLink.addEventListener("click", (event) => {
    event.preventDefault();
    logout();
});