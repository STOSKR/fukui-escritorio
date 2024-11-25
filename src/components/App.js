import React, { useState } from 'react';
import {
    Container,
    Paper,
    Tabs,
    Tab,
    Box
} from '@mui/material';
import PedidosActivos from './PedidosActivos';
import Historial from './Historial';
import Estadisticas from './Estadisticas';

function App() {
    const [tabActual, setTabActual] = useState(0);

    return (
        <Container>
            <Paper elevation={3}>
                <Tabs
                    value={tabActual}
                    onChange={(e, newValue) => setTabActual(newValue)}
                >
                    <Tab label="Pedidos Activos" />
                    <Tab label="Historial" />
                    <Tab label="Estadísticas" />
                </Tabs>

                <Box p={3}>
                    {tabActual === 0 && <PedidosActivos />}
                    {tabActual === 1 && <Historial />}
                    {tabActual === 2 && <Estadisticas />}
                </Box>
            </Paper>
        </Container>
    );
}

export default App; 