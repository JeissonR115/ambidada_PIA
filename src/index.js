let datos = "";

async function agregarDatos() {
    try {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const temperatura = await new Promise((resolve) => {
            readline.question('Ingrese la temperatura: ', (temperatura) => {
                resolve(temperatura);
            });
        });

        const humedad = await new Promise((resolve) => {
            readline.question('Ingrese la humedad: ', (humedad) => {
                resolve(humedad);
            });
        });

        const fecha = await new Promise((resolve) => {
            readline.question('Ingrese la fecha (YYYY-MM-DD): ', (fecha) => {
                resolve(fecha);
            });
        });

        datos = { temperatura, humedad, fecha };
        console.log('Datos añadidos correctamente:', datos);
        readline.close();
    } catch (error) {
        console.error('Error al agregar datos:', error);
    }
}

function mostrarDatos() {
    try {
        if (!datos) {
            throw new Error('No hay datos para mostrar.');
        }
        console.log('Datos registrados:', datos);
    } catch (error) {
        console.error('Error al mostrar datos:', error);
    }
}

async function inicio() {
    await agregarDatos();
    mostrarDatos();
}

inicio();
