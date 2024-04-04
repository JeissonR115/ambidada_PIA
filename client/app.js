document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const apiDataDiv = document.getElementById('api-data');

    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value;
        fetch(`https://api.publicapis.org/entries?title=${searchTerm}`)
            .then(response => response.json())
            .then(data => {
                apiDataDiv.innerHTML = '';
                if (data.entries && data.entries.length > 0) {
                    data.entries.forEach(entry => {
                        apiDataDiv.innerHTML += `<p>${entry.API} - ${entry.Description}</p>`;
                    });
                } else {
                    apiDataDiv.innerHTML = '<p>No se encontraron resultados.</p>';
                }
            })
            .catch(error => {
                console.error('Error al consumir la API:', error);
            });
    });
});
