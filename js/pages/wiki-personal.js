import { getCurrentUser } from "../utils/auth.js";
import { getData, removeData } from "../utils/storage.js";

const currentUser = getCurrentUser();
const users = getData("omnitrix_users") || [];

if (!currentUser) {
    window.location.href = "login.html";
}

const user = users.find(user => user.id === currentUser.id);

// Recuperar ID selecionado
const alienId = Number(localStorage.getItem("selectedAlienId"));

// Procurar alien cadastrado
const alien = user.createdAliens.find(alien => alien.id === alienId);

if (!alien) {
    window.location.href = "laboratory.html";
}

// Carregar informações do objeto
const alienImage = document.getElementById("alien-image");
const alienInfoName = document.getElementById("alien-info-name");
const alienSpecies = document.getElementById("alien-species");
const alienPlanet = document.getElementById("alien-planet");
const alienHability = document.getElementById("alien-hability");
const alienElement = document.getElementById("alien-element");
const alienType = document.getElementById("alien-type");

const alienName = document.getElementById("alien-name");
const alienPhrase = document.getElementById("alien-phrase");
const alienDescription = document.getElementById("alien-description");
const alienPowers = document.getElementById("alien-powers");


alienImage.src = alien.image;
alienImage.alt = alien.name;
alienInfoName.textContent = alien.name;
alienSpecies.textContent = alien.species;
alienPlanet.textContent = alien.planet;
alienHability.textContent = alien.hability;
alienElement.textContent = alien.element;
alienType.textContent= alien.type;

alienName.textContent = alien.name;
alienPhrase.textContent = alien.phrase;
alienDescription.textContent = alien.description;
alienPowers.textContent = alien.powers;

// Remover ID ao sair da página
window.addEventListener("beforeunload", () => {
    removeData("selectedAlienId");
});


