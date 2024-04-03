export class Temperatura {
    filtrar({ temperatura, isMayor, collections, humedad }) {
        if (isMayor) {
            return collections.filter(data => data.temperatura <= temperatura && data.humedad <= humedad);
        } else {
            return collections.filter(data => data.temperatura >= temperatura && data.humedad >= humedad);
        }
    }
}


const registro = new Temperatura();

const temperaturas = [
    { temperatura: 10, humedad: 5 },
    { temperatura: 5, humedad: 9 },
    { temperatura: 25, humedad: 10 },
    { temperatura: 18, humedad: 8 },
    { temperatura: 22, humedad: 12 }
];

const temperaturasFiltradas = registro.filtrar({
    temperatura: 10,
    isMayor: true,
    collections: temperaturas,
    humedad: 20
});

console.log('Temperaturas filtradas (mayores que 10):', temperaturasFiltradas);

const temperaturasFiltradasMenor = registro.filtrar({
    temperatura: 10,
    isMayor: false,
    collections: temperaturas,
    humedad: 20
});

console.log('Temperaturas filtradas (menores que 10):', temperaturasFiltradasMenor);
