import { getCurrentUser } from "../utils/auth.js";
import { getData, saveData, removeData } from "../utils/storage.js";

const currentUser = getCurrentUser();
const users = getData("omnitrix_users") || [];
const form = document.getElementById("lab-form");

// Verificar se existe usuário autenticado
if (!currentUser) {
    window.location.href = "login.html";
}

const btnCreate = document.getElementById("btn-create");
const btnAliens = document.getElementById("btn-aliens");

const createSection = document.getElementById("create-section");
const aliensSection = document.getElementById("aliens-section");

// ABRIR CRIAÇÃO
function abrirCriacao() {
    createSection.hidden = false;
    aliensSection.hidden = true;

    btnCreate.classList.add("btn-primary");
    btnCreate.classList.remove("btn-secondary");

    btnAliens.classList.add("btn-secondary");
    btnAliens.classList.remove("btn-primary");
}

btnCreate.addEventListener("click", () => {
    abrirCriacao();
});

// ABRIR MEUS ALIENS
function abrirMeusAliens() {
    createSection.hidden = true;
    aliensSection.hidden = false;

    btnAliens.classList.add("btn-primary");
    btnAliens.classList.remove("btn-secondary");

    btnCreate.classList.add("btn-secondary");
    btnCreate.classList.remove("btn-primary");

    carregarAliens();
}

btnAliens.addEventListener("click", () => {
    abrirMeusAliens();
});

/* ATUALIZAR PRÉVIA */
function atualizarPreview() {
    const previewName = document.getElementById("preview-name");
    const previewSpecies = document.getElementById("preview-species");
    const previewPlanet = document.getElementById("preview-planet");
    const previewHability = document.getElementById("preview-hability");
    const previewElement = document.getElementById("preview-element");
    const previewImage = document.querySelector("#preview-image img");

    previewName.textContent = document.getElementById("alien-name").value || "???";
    previewSpecies.textContent = document.getElementById("alien-species").value || "???";
    previewPlanet.textContent = document.getElementById("alien-planet").value || "???";
    previewHability.textContent = document.getElementById("alien-hability").value || "???";
    previewElement.textContent = document.getElementById("alien-element").value || "???";

    const image = document.getElementById("alien-image").value;

    previewImage.src = image || "assets/images/icons/Ben_10_Blocked.png";
}

document.getElementById("alien-name").addEventListener("input", atualizarPreview);
document.getElementById("alien-species").addEventListener("input", atualizarPreview);
document.getElementById("alien-planet").addEventListener("input", atualizarPreview);
document.getElementById("alien-hability").addEventListener("input", atualizarPreview);
document.getElementById("alien-element").addEventListener("input", atualizarPreview);
document.getElementById("alien-image").addEventListener("input", atualizarPreview);


/* CADASTRAR ALIEN */
function cadastrarAlien() {
    // Capturar inputs
    const alienName = document.getElementById("alien-name").value.trim();
    const alienSpecies = document.getElementById("alien-species").value.trim();
    const alienPlanet = document.getElementById("alien-planet").value.trim();
    const alienHability = document.getElementById("alien-hability").value.trim();
    const alienElement = document.getElementById("alien-element").value.trim();
    const alienPhrase = document.getElementById("phrase-effect").value.trim();
    const alienDescription = document.getElementById("alien-description").value.trim();
    const alienPowers = document.getElementById("power-description").value.trim();
    const alienType = document.getElementById("alien-type").value;
    const alienImage = document.getElementById("alien-image").value.trim();


    // Validação
    const message = document.getElementById("lab-message");

    if (
        !alienName ||
        !alienSpecies ||
        !alienPlanet ||
        !alienHability ||
        !alienElement ||
        !alienPhrase ||
        !alienDescription ||
        !alienPowers ||
        !alienImage
    ) {
        message.textContent = "Todos os campos precisam ser preenchidos."
        message.style.color = "#ff4444";
        return;
    }

    // Verificar limite de aliens
    const user = users.find(user => user.id === currentUser.id);
    if (user.createdAliens.length >= 8) {
        message.textContent = "Você atingiu o limite de 8 aliens cadastrados!";
        message.style.color = "#ff4444";
        return;
    }

    // Criar objeto
    const newAlien = {
        id: Date.now(),
        name: alienName,
        species: alienSpecies,
        planet: alienPlanet,
        hability: alienHability,
        element: alienElement,
        phrase: alienPhrase,
        description: alienDescription,
        powers: alienPowers,
        type: alienType,
        image: alienImage
    };

    // Adicionar ao array
    user.createdAliens.push(newAlien);
    user.stats.totalCreated = user.createdAliens.length;

    // Atualizar LocalStorage
    saveData("omnitrix_users", users);

    // Limpar o formulário
    form.reset();
    atualizarPreview();

    // Mensagem de sucesso
    message.textContent = "Alien cadastrado com sucesso!"
    message.style.color = "var(--primary)";

    setTimeout(() => {
        abrirMeusAliens();
        message.textContent = "";
    }, 1000);
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    cadastrarAlien();
});

form.addEventListener("reset", () => {
    const message = document.getElementById("lab-message");
    message.textContent = "";
});

/* CARREGAR ALIENS */
function carregarAliens() {
    const user = users.find(user => user.id === currentUser.id);

    const container = document.querySelector(".my-aliens-container");
    const emptyMessage = document.getElementById("lab-empty");

    // Remover cards antigos
    container.querySelectorAll(".lab-card").forEach(card => card.remove());

    // Verificar se existem aliens cadastrados
    if (user.createdAliens.length === 0) {
        emptyMessage.hidden = false;
        return;
    }

    emptyMessage.hidden = true;

    // Percorrer aliens cadastrados
    user.createdAliens.forEach(alien => {

        // Criar elementos
        const card = document.createElement("div");
        const imageContainer = document.createElement("div");
        const image = document.createElement("img");
        const name = document.createElement("h3");
        const species = document.createElement("p");
        const planet = document.createElement("p");
        const buttonContainer = document.createElement("div");
        const deleteButton = document.createElement("button");
        const wikiButton = document.createElement("button");

        // Adicionar classes
        card.classList.add("lab-card");
        imageContainer.classList.add("lab-card-image");
        buttonContainer.classList.add("lab-card-buttons");
        deleteButton.classList.add("btn-secondary", "lab-delete");
        wikiButton.classList.add("btn-secondary", "lab-wiki");

        // Identificar alien
        card.dataset.alienId = alien.id;

        // Preencher informações
        image.src = alien.image;
        image.alt = alien.name;

        name.textContent = alien.name;
        species.textContent = "Espécie: " + alien.species;
        planet.textContent = "Planeta: " + alien.planet;

        deleteButton.textContent = "EXCLUIR";
        wikiButton.textContent = "WIKI";

        // Organizar elementos
        imageContainer.appendChild(image);

        card.appendChild(imageContainer);
        card.appendChild(name);
        card.appendChild(species);
        card.appendChild(planet);
        buttonContainer.appendChild(deleteButton);
        buttonContainer.appendChild(wikiButton);
        card.appendChild(buttonContainer);

        // Inserir card]
        container.appendChild(card);
    });
}

/* DELETAR ALIENS */
function deletarAlien(alienId) {
    const user = users.find(user => user.id === currentUser.id);

    // Remover alien pelo ID
    user.createdAliens = user.createdAliens.filter(alien => alien.id !== alienId);

    // Atualizar estatísticas
    user.stats.totalCreated = user.createdAliens.length;

    // Atualizar LocalStorage
    saveData("omnitrix_users", users);

    // Atualizar os cards
    carregarAliens();
}

/* BOTÕES DOS CARDS */
const cardContainer = document.querySelector("#cards-container");

cardContainer.addEventListener("click", (event) => {

    // Verificar se clicou em EXCLUIR
    const deleteButton = event.target.closest(".lab-delete");

    // Deletar objeto
    if (deleteButton) {
        const card = deleteButton.closest(".lab-card");
        const alienId = Number(card.dataset.alienId);

        deletarAlien(alienId);
        return;
    }

    // Verificar se clicou em WIKI
    const wikiButton = event.target.closest(".lab-wiki");

    // Direcionar para wiki
    if (wikiButton) {
        const card = wikiButton.closest(".lab-card");
        const alienId = Number(card.dataset.alienId);

        // Armazenar o ID do alien selecionado
        localStorage.setItem("selectedAlienId", alienId);

        // Abrir a página Wiki
        window.location.href = "wiki.html";
    }

    // Obs. alienId é convertido novamente para Number, pois dataset é String
});