
function calculateColor(value,saturation = 100,lightness= 50) {
    var hue = (value ) % 360; // Rango de colores de 0 a 360
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`; // Color en formato HSL
}

export function colorear(styleSheet,startColor={value:207,saturation:100,lightness:90},limit){
    for (var i = 0; i < limit; i++) {
        const fValue = ((startColor.value)%360)+i*(30/limit)
        const fSaturation = startColor.saturation
        const fLightness = startColor.lightness-i*(50/limit)
        
        const  color = `hsl(${fValue}, ${fSaturation}%, ${fLightness<50?50:fLightness}%)` 
        const rule = 
        `.sensor--${i} { 
            background-color: ${color}; 
            color:${fLightness<=60?"#d7ecfd":"#222"}
        }`;
    styleSheet.insertRule(rule, styleSheet.cssRules.length);
}
}
