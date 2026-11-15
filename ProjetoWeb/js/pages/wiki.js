import { getCurrentUser } from "../utils/auth.js";
import { getData } from "../utils/storage.js";

// Verificar autenticação
const currentUser = getCurrentUser();

if (!currentUser) {
    window.location.href = "../login.html";
} else {

    const users = getData("omnitrix_users") || [];

    const user = users.find(user => user.id === currentUser.id);

    // Recuperar ID do alien pela URL
    const paginaAtual = window.location.pathname;
    const nomeArquivo = paginaAtual.split("/").pop();
    const alienId = nomeArquivo.replace(".html", "");

    // Verificar se usuário possui o alien
    const verificarAlien = user.discoveredAliens.find(
        alien => alien.id === alienId
    );

    if (!verificarAlien) {
        window.location.href = "../roulette.html";
    }
}

/* WIKI PERSONALIZADA */
const user = users.find(user => user.id === currentUser.id);

// Recuperar ID selecionado
const alienId = Number(localStorage.getItem("selectedAlienId"));

// Procurar alien cadastrado
const alien = user.createdAliens.find(alien => alien.id === alienId);

if (!alien) {
    window.location.href = "laboratory.html";
}