import { getData, saveData } from "./storage.js";

/* CADASTRO */
export function cadastro(username, email, password, confirmPassword) {

    // Recuperar usuários cadastrados
    const users = getData("omnitrix_users") || [];

    // Verificar usuário duplicado
    if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
        return {
            success: false,
            message: "Nome de usuário já cadastrado."
        };
    }

    // Verificar email duplicado
    if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
        return {
            success: false,
            message: "E-mail já cadastrado."
        };
    }

    /*OBS: O método some() verifica alguma condição na estrutura e retorna TRUE ou FALSE */

    // Verificar se as senhas correspondem
    if (password != confirmPassword) {
        return {
            success: false,
            message: "As senhas não correspondem."
        };
    }

    // Criar objeto do usuário
    const newUser = {
        id: Date.now(),
        username: username,
        email: email,
        password: password,
        discoveredAliens: [],
        createdAliens: [],
        stats: {
            totalRolls: 0,
            totalDiscovered: 0,
            totalCreated: 0
        }
    };

    // Adicionar ao array
    users.push(newUser);

    // Salvar no LocalStorage
    saveData("omnitrix_users", users);

    // Retornar sucesso
    return {
        success: true,
        message: "Cadastro realizado com sucesso!"
    };
}

export function login() {

}

export function logout() {

}

export function getCurrentUser() {

}