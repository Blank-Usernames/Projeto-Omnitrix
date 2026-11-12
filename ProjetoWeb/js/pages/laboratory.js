import { getCurrentUser } from "../utils/auth.js";

const currentUser = getCurrentUser();

// Verificar se existe usuário autenticado
if (!currentUser) {
    window.location.href = "login.html";
}