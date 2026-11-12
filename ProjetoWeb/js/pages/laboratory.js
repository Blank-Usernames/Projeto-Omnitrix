import { getData, saveData } from "../utils/storage.js";
import { getCurrentUser } from "../utils/auth.js";
// Ajuste o caminho abaixo caso o alien.js esteja em outra pasta
import { aliens as officialAliens } from "../data/alien.js";

/* LABORATÓRIO */

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const MAX_IMAGE_DIMENSION = 300;       // px (reduz o tamanho salvo no localStorage)

const RARITY_LABELS = {
    comum: "Comum",
    incomum: "Incomum",
    raro: "Raro",
    epico: "Épico",
    lendario: "Lendário"
};

// Só quem está logado pode acessar o laboratório
const currentUser = getCurrentUser();
if (!currentUser) {
    window.location.href = "login.html";
}

/* ELEMENTOS */
const form = document.getElementById("lab-form");
const message = document.getElementById("lab-message");
const nameInput = document.getElementById("alien-name");
const descriptionInput = document.getElementById("alien-description");
const rarityInput = document.getElementById("alien-rarity");
const imageInput = document.getElementById("alien-image");

const previewImage = document.getElementById("preview-image");
const previewName = document.getElementById("preview-name");
const previewRarity = document.getElementById("preview-rarity");
const previewDescription = document.getElementById("preview-description");

const createdList = document.getElementById("created-list");
const createdEmpty = document.getElementById("created-empty");

let imageData = ""; // imagem já redimensionada (base64)

/* UTILITÁRIOS */
function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
}

// Recuperar o usuário completo (com aliens criados) da lista de usuários
function getUserRecord() {
    const users = getData("omnitrix_users") || [];
    const index = users.findIndex(user => user.id === currentUser.id);
    return { users, index };
}

// Redimensionar a imagem para economizar espaço no localStorage
function resizeImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
        reader.onload = () => {
            const img = new Image();

            img.onerror = () => reject(new Error("Arquivo de imagem inválido."));
            img.onload = () => {
                const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(img.width, img.height));
                const canvas = document.createElement("canvas");
                canvas.width = Math.round(img.width * scale);
                canvas.height = Math.round(img.height * scale);

                canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL("image/png")); // PNG mantém a transparência
            };

            img.src = reader.result;
        };

        reader.readAsDataURL(file);
    });
}

/* PRÉVIA */
function updatePreview() {
    previewName.textContent = nameInput.value.trim() || "???";

    const rarity = rarityInput.value;
    previewRarity.textContent = RARITY_LABELS[rarity];
    previewRarity.className = "rarity-" + rarity;

    previewDescription.textContent = "Descrição: " + (descriptionInput.value.trim() || "???");

    previewImage.innerHTML = "";
    if (imageData) {
        const img = document.createElement("img");
        img.src = imageData;
        img.alt = "Prévia do alien";
        previewImage.appendChild(img);
    } else {
        const span = document.createElement("span");
        span.textContent = "SEM IMAGEM";
        previewImage.appendChild(span);
    }
}

/* LISTA DE ALIENS CRIADOS */
function renderCreatedAliens() {
    const { users, index } = getUserRecord();
    const created = index >= 0 ? users[index].createdAliens || [] : [];

    createdList.innerHTML = "";
    createdEmpty.hidden = created.length > 0;

    created.forEach(alien => {
        const card = document.createElement("article");
        card.className = "lab-card";

        const imageBox = document.createElement("div");
        imageBox.className = "lab-card-image";
        const img = document.createElement("img");
        img.src = alien.image;
        img.alt = alien.name;
        imageBox.appendChild(img);

        const title = document.createElement("h3");
        title.textContent = alien.name;

        const rarity = document.createElement("p");
        rarity.textContent = "Raridade: ";
        const rarityValue = document.createElement("span");
        rarityValue.className = "rarity-" + alien.rarity;
        rarityValue.textContent = RARITY_LABELS[alien.rarity];
        rarity.appendChild(rarityValue);

        const description = document.createElement("p");
        description.textContent = alien.description;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "btn-secondary lab-delete";
        deleteButton.textContent = "EXCLUIR";
        deleteButton.addEventListener("click", () => deleteAlien(alien.id));

        card.append(imageBox, title, rarity, description, deleteButton);
        createdList.appendChild(card);
    });
}

function deleteAlien(alienId) {
    const { users, index } = getUserRecord();
    if (index < 0) return;

    users[index].createdAliens = (users[index].createdAliens || []).filter(alien => alien.id !== alienId);
    users[index].stats.totalCreated = users[index].createdAliens.length;

    saveData("omnitrix_users", users);
    renderCreatedAliens();
    showMessage("Alien excluído.", "success");
}

/* CRIAÇÃO */
function createAlien(event) {
    event.preventDefault();

    const name = nameInput.value.trim();
    const description = descriptionInput.value.trim();
    const rarity = rarityInput.value;

    // Validações
    if (!name || !description || !imageData) {
        showMessage("Preencha todos os campos e escolha uma imagem.", "error");
        return;
    }

    const { users, index } = getUserRecord();
    if (index < 0) {
        showMessage("Usuário não encontrado. Faça login novamente.", "error");
        return;
    }

    const user = users[index];
    user.createdAliens = user.createdAliens || [];

    // Nome duplicado (entre os oficiais e os criados pelo usuário)
    const lowerName = name.toLowerCase();
    const duplicated =
        officialAliens.some(alien => alien.name.toLowerCase() === lowerName) ||
        user.createdAliens.some(alien => alien.name.toLowerCase() === lowerName);

    if (duplicated) {
        showMessage("Já existe um alien com esse nome.", "error");
        return;
    }

    // Criar objeto do alien
    const newAlien = {
        id: "custom-" + Date.now(),
        name: name,
        description: description,
        rarity: rarity,
        image: imageData,
        custom: true
    };

    user.createdAliens.push(newAlien);
    user.stats.totalCreated = user.createdAliens.length;

    // Salvar (o localStorage tem limite de espaço)
    try {
        saveData("omnitrix_users", users);
    } catch (error) {
        showMessage("Sem espaço para salvar. Exclua algum alien criado e tente de novo.", "error");
        return;
    }

    form.reset();
    imageData = "";
    updatePreview();
    renderCreatedAliens();
    showMessage("Alien \"" + name + "\" criado com sucesso!", "success");
}

/* EVENTOS */
imageInput.addEventListener("change", async () => {
    const file = imageInput.files[0];
    imageData = "";

    if (!file) {
        updatePreview();
        return;
    }

    if (!file.type.startsWith("image/")) {
        imageInput.value = "";
        showMessage("O arquivo precisa ser uma imagem.", "error");
        updatePreview();
        return;
    }

    if (file.size > MAX_FILE_SIZE) {
        imageInput.value = "";
        showMessage("A imagem deve ter no máximo 2 MB.", "error");
        updatePreview();
        return;
    }

    try {
        imageData = await resizeImage(file);
        showMessage("", "");
    } catch (error) {
        imageInput.value = "";
        showMessage(error.message, "error");
    }

    updatePreview();
});

[nameInput, descriptionInput, rarityInput].forEach(field => {
    field.addEventListener("input", updatePreview);
});

form.addEventListener("submit", createAlien);

form.addEventListener("reset", () => {
    imageData = "";
    showMessage("", "");
    // aguarda o reset limpar os campos antes de atualizar a prévia
    setTimeout(updatePreview, 0);
});

updatePreview();
renderCreatedAliens();
