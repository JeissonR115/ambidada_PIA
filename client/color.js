
export function colorear(styleSheet, startColor = { value: 207, saturation: 100, lightness: 90 }, limit) {
    for (var i = 0; i < limit; i++) {
        const fValue = ((startColor.value) % 360) + i * (30 / limit)// Cálculo del nuevo valor de tono (Hue) utilizando el valor inicial y el índice de iteración
        const fSaturation = startColor.saturation// Conserva la saturación del color inicial
        const fLightness = startColor.lightness - i * (50 / limit)// Calcula el nuevo valor de claridad (Lightness) utilizando el valor inicial y el índice de iteración

        // Construye la cadena de color en formato HSL (Hue, Saturation, Lightness)
        const color = `hsl(${fValue}, ${fSaturation}%, ${fLightness < 50 ? 50 : fLightness}%)`
        // Construye la regla de estilo CSS para aplicar el color al elemento HTML
        const rule =
            `.sensor--${i} { 
            background-color: ${color}; 
            color:${fLightness <= 60 ? "#d7ecfd" : "#222"};/*Cambia el color del texto según la claridad del fondo*/
        }`;
        // Inserta la regla de estilo en la hoja de estilo CSS
        styleSheet.insertRule(rule, styleSheet.cssRules.length);
    }
}
