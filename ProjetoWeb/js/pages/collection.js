import { getCurrentUser } from "../utils/auth.js";
import { getData } from "../utils/storage.js";
import { aliens } from "../data/alien.js";

const currentUser = getCurrentUser();
const users = getData("omnitrix_users") || [];

// Verificar se existe usuário autenticado
if (!currentUser) {
    window.location.href = "login.html";
} else {
    // Aqui teremos acesso aos dados completos do usuário
    const user = users.find(user => user.id === currentUser.id);

    if (user) {
        carregarColecao(user);
    }
}

/* CARREGAR COLEÇÃO */
function carregarColecao(user) {
    const cards = document.querySelectorAll(".alien-card");

    cards.forEach(card => {
        const alienId = card.dataset.alien;


        // Procurar o alien na base de dados oficial
        const alien = aliens.find(alien => alien.id === alienId);

        // Verificar se o usuário descobriu esse alien
        const descobertoTrue = user.discoveredAliens.find(
            item => item.id === alienId
        );

        // Trocando as propriedades
        if (descobertoTrue && alien) {
            card.classList.remove("locked");
            card.classList.add("unlocked");

            const imagem = card.querySelector("img");

            card.style.setProperty(
                "--after-content",
                `"${alien.name}"`
            );

            imagem.src = alien.image;
            imagem.alt = alien.name;
        }
    });
}

/* ATUALIZANDO PAINEL */
function atualizarPainel(alien, quantidade) {
    const infoImage = document.getElementById("info-image");
    const infoName = document.getElementById("info-name");
    const infoRarity = document.getElementById("info-rarity");
    const qtdAlien = document.getElementById("qtd-alien");
    const wikiLink = document.getElementById("wiki-link");

    // TROCANDO AS INFORMAÇÕES
    infoImage.src = alien.image;
    infoImage.alt = alien.name;

    infoName.textContent = alien.name;
    infoRarity.textContent = alien.rarity;

    // Cor das raridades
    if (alien.rarity === "COMUM") {
        infoRarity.style.color = "var(--primary)";
    } else if (alien.rarity === "INCOMUM") {
        infoRarity.style.color = "#4da6ff";
    } else if (alien.rarity === "RARO") {
        infoRarity.style.color = "#884dff";
    } else if (alien.rarity === "LENDÁRIO") {
        infoRarity.style.color = "#ea6010";
    }

    // Aqui entra a quantidade do alien no LocalStorage
    qtdAlien.textContent = quantidade;

    wikiLink.href = alien.wiki;
}

const cardContainer = document.querySelector(".card-container");

cardContainer.addEventListener("click", (event) => {

    // Verifica qual card foi clicado
    const card = event.target.closest(".alien-card");

    // Verifica se o alien está bloqueado
    if (!card || card.classList.contains("locked")) {
        return;
    }

    // Acessando o card por seu ID
    const alienId = card.dataset.alien;

    // Recuperando informações do alien e do usuário
    const alien = aliens.find(alien => alien.id === alienId);
    const user = users.find(user => user.id === currentUser.id);
    const descoberto = user.discoveredAliens.find(
        item => item.id === alienId
    );

    // Enviando informações para o painel
    if (alien && descoberto) {
        atualizarPainel(alien, descoberto.quantity);
    }
});