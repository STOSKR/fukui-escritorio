const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
    const pedidoPrueba = {
        cliente: {
            nombre: "Juan Pérez",
            telefono: "123456789"
        },
        items: [
            {
                id: "1",
                nombre: "Producto 1",
                cantidad: 2,
                precio: 10.50
            }
        ],
        total: 21.00,
        metodoPago: "efectivo"
    };

    ws.send(JSON.stringify(pedidoPrueba));
});

ws.on('message', (data) => {
    console.log('Respuesta recibida:', data.toString());
}); 