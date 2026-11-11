// ELEMENTOS DA PÁGINA
const palco = document.getElementById('palco-omnitrix');
const imgVisor = document.getElementById('img-visor');
const botao = document.getElementById('botao-girar');
const resultado = document.getElementById('resultado-roleta');

const imgResultado = document.getElementById('img-resultado');
const tagResultado = document.getElementById('tag-resultado');
const nomeResultado = document.getElementById('nome-resultado');
const raridadeResultado = document.getElementById('raridade-resultado');
const mensagemResultado = document.getElementById('mensagem-resultado');

// ALIENS
const PASTA = 'assets/images/icons/';

// nome = como aparece no site | arquivo = nome do arquivo na pasta
const aliens = [
    { nome: 'Aquático',       arquivo: 'icones_aliens_Aquatico.png',      raridade: 'Comum' },
    { nome: 'Besta',          arquivo: 'icones_aliens_Besta.png',         raridade: 'Comum' },
    { nome: 'Chama',          arquivo: 'icones_aliens_Chama.png',         raridade: 'Comum' },
    { nome: 'Diamante',       arquivo: 'icones_aliens_Diamante.png',      raridade: 'Raro' },
    { nome: 'Insectoide',     arquivo: 'icones_aliens_Insectoide.png',    raridade: 'Comum' },
    { nome: 'Massa Cinzenta', arquivo: 'icones_aliens_MassaCinzenta.png', raridade: 'Raro' },
    { nome: 'Quatro Braços',  arquivo: 'icones_aliens_QuatroBracos.png',  raridade: 'Comum' },
    { nome: 'Ultra T',        arquivo: 'icones_aliens_UltraT.png',        raridade: 'Épico' },
    { nome: 'XLR8',           arquivo: 'icones_aliens_XLR8.png',          raridade: 'Raro' },
].map((alien) => ({ ...alien, imagem: PASTA + alien.arquivo }));

// FUNÇÕES AUXILIARES
const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms));
const alienAleatorio = () => aliens[Math.floor(Math.random() * aliens.length)];

// remove acentos e deixa minúsculo: "Épico" vira "epico"
const normalizar = (texto) =>
    texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// pré-carrega os ícones para não piscar durante o giro
aliens.forEach((alien) => { new Image().src = alien.imagem; });

// GIRAR
botao.addEventListener('click', async () => {
    botao.disabled = true;
    resultado.hidden = true;
    palco.classList.remove('sorteado');
    palco.classList.add('girando');
    imgVisor.hidden = false;

    const escolhido = alienAleatorio(); // sorteia antes da animação

    // 25 trocas a cada 100 ms (≈ 2,5 segundos)
    let anterior = null;
    for (let i = 0; i < 25; i++) {
        let alien = alienAleatorio();
        while (alien === anterior) alien = alienAleatorio(); // evita repetir em sequência
        anterior = alien;
        imgVisor.src = alien.imagem;
        await esperar(100);
    }

    // alien final
    imgVisor.src = escolhido.imagem;
    palco.classList.remove('girando');
    palco.classList.add('sorteado');

    // resultado
    imgResultado.src = escolhido.imagem;
    tagResultado.textContent = 'ALIEN DESBLOQUEADO';
    nomeResultado.textContent = escolhido.nome;
    raridadeResultado.textContent = escolhido.raridade;
    raridadeResultado.className = 'raridade-' + normalizar(escolhido.raridade);
    mensagemResultado.textContent = `O Omnitrix escolheu ${escolhido.nome}!`;
    resultado.hidden = false;
    resultado.scrollIntoView({ behavior: 'smooth', block: 'center' });

    botao.disabled = false;
});
import { getCurrentUser } from "../utils/auth.js";

const currentUser = getCurrentUser();

// Verificar se existe usuário autenticado
if (!currentUser) {
    window.location.href = "login.html";
}
