import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import store from '../store/store';

function PedidosActivos() {
    const [pedidos, setPedidos] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [nuevoPedido, setNuevoPedido] = useState({
        cliente: '',
        items: [],
        total: 0,
        metodoPago: 'efectivo'
    });

    useEffect(() => {
        const cargarPedidos = async () => {
            try {
                const pedidosGuardados = await store.get('pedidos');
                setPedidos(Array.isArray(pedidosGuardados) ? pedidosGuardados : []);
            } catch (error) {
                console.error('Error al cargar pedidos:', error);
                setPedidos([]);
            }
        };

        cargarPedidos();

        // Suscribirse a nuevos pedidos
        store.onNuevoPedido((nuevoPedido) => {
            setPedidos(pedidosActuales => [...pedidosActuales, nuevoPedido]);
        });
    }, []);

    const handleNuevoPedido = () => {
        setDialogOpen(true);
    };

    const guardarPedido = async () => {
        const pedidoNuevo = {
            ...nuevoPedido,
            id: Date.now(),
            fecha: new Date().toISOString(),
            estado: 'pendiente'
        };

        const pedidosActualizados = [...pedidos, pedidoNuevo];

        try {
            await store.set('pedidos', pedidosActualizados);
            setPedidos(pedidosActualizados);
            setDialogOpen(false);
            setNuevoPedido({
                cliente: '',
                items: [],
                total: 0,
                metodoPago: 'efectivo'
            });
        } catch (error) {
            console.error('Error al guardar pedido:', error);
            // Aquí podrías mostrar un mensaje de error al usuario
        }
    };

    const completarPedido = async (pedido) => {
        try {
            // Obtener historial actual
            const historialActual = await store.get('historial') || [];

            // Mover al historial
            await store.set('historial', [...historialActual, { ...pedido, estado: 'completado' }]);

            // Eliminar de pedidos activos
            const pedidosActualizados = pedidos.filter(p => p.id !== pedido.id);
            await store.set('pedidos', pedidosActualizados);
            setPedidos(pedidosActualizados);

            // Aquí iría la lógica de impresión
            imprimirTicket(pedido);
        } catch (error) {
            console.error('Error al completar pedido:', error);
            // Aquí podrías mostrar un mensaje de error al usuario
        }
    };

    const imprimirTicket = (pedido) => {
        // Implementaremos la impresión más adelante
        console.log('Imprimiendo ticket para:', pedido);
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5">Pedidos Activos</Typography>
                <Button variant="contained" color="primary" onClick={handleNuevoPedido}>
                    Nuevo Pedido
                </Button>
            </Box>

            <Grid container spacing={2}>
                {pedidos.map((pedido) => (
                    <Grid item xs={12} sm={6} md={4} key={pedido.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Cliente: {pedido.cliente}</Typography>
                                <Typography>Total: ${pedido.total}</Typography>
                                <Typography>Método de pago: {pedido.metodoPago}</Typography>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => completarPedido(pedido)}
                                    fullWidth
                                    sx={{ mt: 2 }}
                                >
                                    Completar y Imprimir
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Nuevo Pedido</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Cliente"
                        fullWidth
                        value={nuevoPedido.cliente}
                        onChange={(e) => setNuevoPedido({ ...nuevoPedido, cliente: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Total"
                        type="number"
                        fullWidth
                        value={nuevoPedido.total}
                        onChange={(e) => setNuevoPedido({ ...nuevoPedido, total: parseFloat(e.target.value) })}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Método de Pago</InputLabel>
                        <Select
                            value={nuevoPedido.metodoPago}
                            onChange={(e) => setNuevoPedido({ ...nuevoPedido, metodoPago: e.target.value })}
                        >
                            <MenuItem value="efectivo">Efectivo</MenuItem>
                            <MenuItem value="tarjeta">Tarjeta</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={guardarPedido} variant="contained" color="primary">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default PedidosActivos; 