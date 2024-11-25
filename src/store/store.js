const { ipcRenderer } = window.require('electron');

const store = {
    get: async (key) => {
        return await ipcRenderer.invoke('store-get', key);
    },
    set: async (key, value) => {
        return await ipcRenderer.invoke('store-set', key, value);
    },
    onNuevoPedido: (callback) => {
        ipcRenderer.on('nuevo-pedido', (_, pedido) => callback(pedido));
    }
};

export default store; 