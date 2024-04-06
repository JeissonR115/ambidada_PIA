// Importa la función colorear desde el archivo color.js
import { colorear } from "./color.js";

// Selecciona elementos del DOM
const searchButton = document.getElementById('search-button'); // Botón de búsqueda
const apiDataDiv = document.getElementById('api-data'); // Contenedor para mostrar los datos de la API
const radioButtons = document.querySelectorAll('.filter-changer--input'); // Botones de radio para filtrar
const searchInput = document.getElementById('search-input'); // Campo de entrada de búsqueda

// Crea un nuevo elemento <style> en el <head> del documento para aplicar estilos dinámicos
const styleElement = document.createElement('style');
document.head.appendChild(styleElement);
const styleSheet = styleElement.sheet; // Hoja de estilo CSS

// Función asincrónica para obtener datos de la API
async function getData(input) {
    try {
        // Encuentra el botón de radio seleccionado
        const attribute = findAttribute(radioButtons).value;
        // Realiza una solicitud a la API con el atributo seleccionado y el término de búsqueda (si se proporciona)
        const response = await fetch(`http://localhost:3000/sensordata${switchAttribute(attribute)}${attribute != 'all' ? input : ""}`);
        // Devuelve los datos obtenidos en formato JSON
        return await response.json();
    } catch (error) {
        console.error('Error al consumir la API:', error);
        return []; // Devuelve un array vacío en caso de error
    }
}

// Función para mapear los atributos a las rutas de la API
function switchAttribute(attribute) {
    // Objeto que mapea los atributos a las rutas de la API
    const attributeList = {
        date: '/date?one_day=true&start_date=', // Ruta para buscar por fecha
        ambient: '/find/ambient/', // Ruta para buscar por ambiente
        temperature: '/find/temperature/', // Ruta para buscar por temperatura
        place: '/find/place/', // Ruta para buscar por lugar
        all: '/', // Ruta para obtener todos los datos
    }
    // Devuelve la ruta correspondiente al atributo
    return attributeList[attribute]
}

// Función para encontrar el botón de radio seleccionado
function findAttribute(inputs) {
    let attribute; // Inicializa la variable attribute
    // Itera sobre los botones de radio
    inputs.forEach(input => input.checked ? attribute = input : false)
    // Devuelve el botón de radio seleccionado
    return attribute
}

// Función para mostrar los datos obtenidos en el contenedor especificado
function showData(data, container) {
    // Limpia el contenedor
    container.innerHTML = '';
    // Verifica si hay datos disponibles
    if (data.length > 0) {
        // Itera sobre los datos y los muestra en el contenedor
        data.forEach((sensor, i) => {
            container.innerHTML += `
                <div class="sensor sensor--${i}">
                    humedad: ${sensor.ambient}% - 
                    temperatura: ${sensor.temperature}°C -
                    fecha: ${sensor.fecha.match(/^(\d{4}-\d{2}-\d{2})/)[1]} 
                    hora: ${sensor.fecha.match(/T(\d{2}:\d{2}:\d{2})/)[1]}
                </div>
            `;
        });
    } else {
        // Muestra un mensaje si no se encontraron resultados
        apiDataDiv.innerHTML = '<p>No se encontraron resultados.</p>';
    }
}

// Función para realizar la búsqueda y mostrar los resultados
async function search() {
    // Obtiene el término de búsqueda ingresado por el usuario
    const searchTerm = searchInput.value;
    // Obtiene los datos de la API con el término de búsqueda
    const data = await getData(searchTerm);
    // Muestra los datos obtenidos en el contenedor
    showData(data, apiDataDiv);
    // Aplica colores dinámicos a los elementos HTML según la cantidad de datos obtenidos
    colorear(styleSheet, { value: 207, saturation: 85, lightness: 90 }, data.length);
}

// Listeners de eventos
// Ejecuta la función search() cuando cambia el contenido del campo de búsqueda
searchInput.addEventListener('change', search);
// Ejecuta la función search() cuando se hace clic en el botón de búsqueda
searchButton.addEventListener('click', search);
// Ejecuta la función search() cuando se selecciona un botón de radio
radioButtons.forEach(radioButton => radioButton.addEventListener("click", search));
