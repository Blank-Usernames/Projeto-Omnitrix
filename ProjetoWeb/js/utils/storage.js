/* STORAGE */

/* RECUPERAR DADOS */
export function getData(key) {
    return JSON.parse(localStorage.getItem(key));
}

/* SALVAR DADOS */
export function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

/* REMOVER DADOS */
export function removeData(key) {
    localStorage.removeItem(key);
}