const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  // Manejar la solicitud POST de los datos del ESP32
  if (req.method === 'POST' && req.url === '/datos') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString(); // Convertir los datos a cadena
    });

    req.on('end', () => {
      // Guardar los datos en un archivo
      fs.appendFile('datos.txt', body + '\n', (err) => {
        if (err) {
          console.error('Error al guardar los datos:', err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error interno del servidor');
          return;
        }

        console.log('Datos guardados correctamente:', body);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Datos recibidos y guardados correctamente');
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Ruta no encontrada');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});

