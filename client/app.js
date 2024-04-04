document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const apiDataDiv = document.getElementById('api-data');

    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value;
        fetch(`http://localhost:3000/sensordata/date?start_date=${searchTerm}`)
            .then(response => response.json())
            .then(data => {
                apiDataDiv.innerHTML = '';
                if(data.length > 0){
                    data.forEach((sensor,i) => {
                    apiDataDiv.innerHTML += `
                    <div class = "sensor sensor--${i}">
                    humedad: ${sensor.ambient}% - 
                    temperatura: ${sensor.temperature}°C -
                    fecha: ${sensor.fecha.match(/^(\d{4}-\d{2}-\d{2})/)[1]} 
                    hora: ${sensor.fecha.match(/T(\d{2}:\d{2}:\d{2})/)[1]}
                    </div>

                    `;
                });
                }else{
                    apiDataDiv.innerHTML = '<p>No se encontraron resultados.</p>';
                }
            })
            .catch(error => {
                console.error('Error al consumir la API:', error);
            });
    });
});
