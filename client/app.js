import { colorear } from "./color.js";
const searchButton = document.getElementById('search-button');
const apiDataDiv = document.getElementById('api-data');
const radioButtons = document.querySelectorAll('.filter-changer--input');
const searchInput = document.getElementById('search-input');
const styleElement = document.createElement('style');
document.head.appendChild(styleElement);
const styleSheet = styleElement.sheet;

async function getData(input) {
    try {
        const attribute = findAttribute(radioButtons).value
        const response = await fetch(`http://localhost:3000/sensordata${switchAttribute(attribute)}${attribute != 'all' ? input : ""}`);
        return await response.json();
    } catch (error) {
        console.error('Error al consumir la API:', error);
        return [];
    }
}
function switchAttribute(attribute) {
    const attributeList = {
        date: '/date?one_day=true&start_date=',
        ambient: '/find/ambient/',
        temperature: '/find/temperature/',
        place: '/find/place/',
        all: '/',
    }

    return attributeList[attribute]
}
function findAttribute(inputs) {
    let attribute;
    inputs.forEach(input => input.checked ? attribute = input : false)
    return attribute
}
function showData(data, container) {
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
async function search() {
    const searchTerm = searchInput.value;
    const data = await getData(searchTerm);
    showData(data, apiDataDiv);
    colorear(styleSheet, { value: 207, saturation: 85, lightness: 90 }, data.length)
}
searchInput.addEventListener('change', search);
searchButton.addEventListener('click', search)
radioButtons.forEach(radioButton => radioButton.addEventListener("click", search))