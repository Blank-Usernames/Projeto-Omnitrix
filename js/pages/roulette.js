import { aliens } from "../data/alien.js";
import { getData, saveData } from "../utils/storage.js";
import { getCurrentUser } from "../utils/auth.js";

// Recuperar usuário ativo e registro de usuários
const currentUser = getCurrentUser();
const users = getData("omnitrix_users") || [];

// Verificar se existe usuário autenticado
if (!currentUser) {
    window.location.href = "login.html";
}

/* ELEMENTOS DA ROLETA */
const button = document.getElementById("botao-girar");
const resultSection = document.getElementById("resultado-roleta");
const resultImage = document.getElementById("img-resultado");
const resultName = document.getElementById("nome-resultado");
const resultRarity = document.getElementById("raridade-resultado");
const resultTag = document.getElementById("tag-resultado");
const resultMessage = document.getElementById("mensagem-resultado");
const totalRolls = document.getElementById("total-giros");


/* SORTEAR ALIEN */
export function sortearAlien() {

    const numero = Math.random() * 100;

    // Determinar raridade
    let raridade;
    if (numero < 50) {
        raridade = "COMUM";
    } else if (numero < 80) {
        raridade = "INCOMUM";
    } else if (numero < 95) {
        raridade = "RARO";
    } else {
        raridade = "LENDÁRIO";
    }

    // Filtrar aliens pela raridade sorteada
    const aliensDisponiveis = aliens.filter(alien =>
        alien.rarity === raridade
    );

    // Sortear um alien da categoria
    const indice = Math.floor(Math.random() * aliensDisponiveis.length);

    return aliensDisponiveis[indice];
}

/* REGISTRAR ALIEN OBTIDO */
function registrarObtencao(alien) {

    // Encontrar usuário correspondente
    const user = users.find(user => user.id === currentUser.id);

    // Incrementar quantidade de giros
    user.stats.totalRolls++;

    // Procurar alien na coleção
    const alienExistente = user.discoveredAliens.find(item =>
        item.id === alien.id
    );

    // Verificar se é uma duplicata
    if (alienExistente) {
        alienExistente.quantity++;
    } else {
        // Adicionar novo alien
        user.discoveredAliens.push({
            id: alien.id,
            quantity: 1
        });

        // Atualizar quantidade de descobertas
        user.stats.totalDiscovered++;
    }

    // Salvar alterações
    saveData("omnitrix_users", users);

    return {
        isNew: !alienExistente,
        quantity: alienExistente ? alienExistente.quantity : 1
    };
}

/* EVENTO DE GIRO */
button.addEventListener("click", () => {

    // Sortear alien
    const alien = sortearAlien();
    animarRoleta(alien);

    // Atualização do card realizada ao mesmo tempo da animação
    let intervalo = setTimeout(() => {
        // Atualizar imagem
        resultImage.src = alien.image;
        resultImage.alt = alien.name;

        // Atualizar informações
        resultName.textContent = alien.name;
        resultRarity.textContent = alien.rarity;

        // Trocar cor do texto de acordo com a raridade
        if (alien.rarity === "INCOMUM") {
            resultRarity.style.color = "#4da6ff";
        } else if (alien.rarity === "RARO") {
            resultRarity.style.color = "#884dff";
        } else if (alien.rarity === "LENDÁRIO") {
            resultRarity.style.color = "#ea6010";
        }
    }, 2500)

    // Registrar obtenção
    const resultado = registrarObtencao(alien);

    // Verificar se é uma nova descoberta
    if (resultado.isNew) {

        resultTag.textContent = "NOVO ALIEN!";
        resultMessage.textContent = "Você descobriu um novo alienígena!";

    } else {
        resultTag.textContent = "DUPLICATA!";
        resultMessage.textContent = `Você possui ${resultado.quantity} cópias deste alien.`;
    }

    // Exibir resultado
    resultSection.hidden = false;

    // Atualizar contador
    totalRolls.textContent = getData("omnitrix_users")
        .find(user => user.id === getCurrentUser().id)
        .stats.totalRolls;
});

function animarRoleta(alienSorteado) {
    const visorImage = document.getElementById("img-visor");

    // Desabilitar botão enquanto a animação estiver rodando
    button.setAttribute('disabled','');

    let intervalo = setInterval(() => {
        // Escolhe um alien aleatório apenas para a animação
        const indice = Math.floor(Math.random() * aliens.length);
        const alienAleatorio = aliens[indice];

        visorImage.src = alienAleatorio.image;
        visorImage.alt = alienAleatorio.name;
        visorImage.hidden = false;

    }, 100);

    setTimeout(() => {
        clearInterval(intervalo);

        // Mostra o alien que realmente foi sorteado
        visorImage.src = alienSorteado.image;
        visorImage.alt = alienSorteado.name;

        // Habilita o botão novamente
        button.removeAttribute('disabled');
    }, 2500); 
}