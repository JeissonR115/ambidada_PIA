export class Temperatura {
    filtrar({ temperatura, isMayor, collections, humedad }) {
        if (isMayor) {
            return collections.filter(data => data.temperatura <= temperatura && data.humedad <= humedad);
        } else {
            return collections.filter(data => data.temperatura >= temperatura && data.humedad >= humedad);
        }
    }
}





