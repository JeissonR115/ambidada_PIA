import { colorear } from "./color.js";
const searchButton = document.getElementById('search-button');
const apiDataDiv = document.getElementById('api-data');
const searchInput = document.getElementById('search-input');
let styleElement = document.createElement('style');
document.head.appendChild(styleElement);
let styleSheet = styleElement.sheet;


 async function getData(input) {
    try {
        const response = await fetch(`http://localhost:3000/sensordata/date?start_date=${input}&one_day=true`);
        return await response.json();
    } catch (error) {
        console.error('Error al consumir la API:', error);
        return [];
    }
}
function showData(data,container) {
    container.innerHTML = '';
    if (data.length > 0) {
        data.forEach((sensor, i) => {
            container.innerHTML += `
        <div class = "sensor sensor--${i}">
        humedad: ${sensor.ambient}% - 
        temperatura: ${sensor.temperature}°C -
        fecha: ${sensor.fecha.match(/^(\d{4}-\d{2}-\d{2})/)[1]} 
        hora: ${sensor.fecha.match(/T(\d{2}:\d{2}:\d{2})/)[1]}
        </div>

        `;
        });
    } else {
        apiDataDiv.innerHTML = '<p>No se encontraron resultados.</p>';
    }
}
searchButton.addEventListener('click', async function() {
    const searchTerm = searchInput.value;
    const data = await getData(searchTerm);
    console.log(data.length)
    showData(data, apiDataDiv);
    colorear(styleSheet,{value:207,saturation:85,lightness:90},data.length)
});