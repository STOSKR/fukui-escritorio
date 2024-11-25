const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');
const WebSocket = require('ws');

const store = new Store({
    defaults: {
        pedidos: [],
        historial: [],
        configuracion: {
            impresora: '',
            nombreNegocio: 'Mi Negocio',
            puerto: 8080
        }
    }
});

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    mainWindow.loadFile('index.html');
    mainWindow.webContents.openDevTools();

    // Iniciar servidor WebSocket
    iniciarServidorWS();
}

function iniciarServidorWS() {
    const puerto = store.get('configuracion.puerto');
    const wss = new WebSocket.Server({ port: puerto });

    wss.on('connection', (ws) => {
        console.log('Nueva conexión WebSocket establecida');

        ws.on('message', async (message) => {
            try {
                const pedido = JSON.parse(message);

                // Validar el formato del pedido
                if (validarPedido(pedido)) {
                    // Agregar el pedido a la lista de pedidos activos
                    const pedidosActuales = store.get('pedidos') || [];
                    const nuevoPedido = {
                        ...pedido,
                        id: Date.now(),
                        fecha: new Date().toISOString(),
                        estado: 'pendiente'
                    };

                    store.set('pedidos', [...pedidosActuales, nuevoPedido]);

                    // Notificar a la ventana principal
                    if (mainWindow) {
                        mainWindow.webContents.send('nuevo-pedido', nuevoPedido);
                    }

                    // Confirmar recepción
                    ws.send(JSON.stringify({
                        status: 'success',
                        message: 'Pedido recibido',
                        pedidoId: nuevoPedido.id
                    }));
                }
            } catch (error) {
                console.error('Error al procesar pedido:', error);
                ws.send(JSON.stringify({
                    status: 'error',
                    message: 'Error al procesar el pedido'
                }));
            }
        });
    });

    console.log(`Servidor WebSocket iniciado en puerto ${puerto}`);
}

function validarPedido(pedido) {
    // Validación básica del formato del pedido
    return pedido
        && pedido.cliente
        && Array.isArray(pedido.items)
        && pedido.total
        && pedido.metodoPago;
}

// Espera a que la app esté lista y webpack haya compilado
app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Manejadores de IPC para el almacenamiento
ipcMain.handle('store-get', (event, key) => {
    const value = store.get(key);
    // Asegurarse de que pedidos y historial siempre sean arrays
    if (key === 'pedidos' || key === 'historial') {
        return Array.isArray(value) ? value : [];
    }
    return value;
});

ipcMain.handle('store-set', (event, key, value) => {
    try {
        store.set(key, value);
        return true;
    } catch (error) {
        console.error('Error al guardar en store:', error);
        return false;
    }
}); 