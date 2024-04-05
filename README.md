# Proyecto PIA - Ambidada

Este proyecto es parte del Proyecto Integrador de Aprendizaje (PIA) desarrollado por Jeisson, Kevin y Bryan.

# Indice
- [Proyecto PIA - Ambidada](#proyecto-pia---ambidada)
- [Indice](#indice)
  - [Descripción](#descripción)
  - [Instalación](#instalación)
  - [Uso](#uso)
  - [Endpoints de la API](#endpoints-de-la-api)
  - [Autores](#autores)
  - [Licencia](#licencia)

## Descripción

El proyecto Ambidada PIA es una aplicación backend desarrollada con Node.js y Express. Proporciona funcionalidades para interactuar con una base de datos MongoDB y ofrece una API RESTful para acceder y manipular datos relacionados con sensores.

## Instalación

1. Clona este repositorio en tu máquina local:

    ```bash
    git clone https://github.com/JeissonR115/ambidada_PIA.git
    ```

2. Ingresa al directorio del proyecto:

    ```bash
    cd ambidada_PIA
    ```

3. Instala las dependencias utilizando npm:

    ```bash
    npm install
    ```

4. Crea un archivo `.env` en el directorio raíz del proyecto y configura las variables de entorno según sea necesario.Ejemplo: 
    ```bash
    DB_URL = 'mongodb+srv://ambidata2024:***@ambidata.vn0dlbx.mongodb.net/'
    PORT = 3000
    DB_NAME = ambidata
    ```

## Uso

Para iniciar el servidor, ejecuta el siguiente comando:

```bash
node server/index.js
```


## Endpoints de la API

-   `GET /sensorData`: Obtiene todos los datos de los sensores.
-   `GET /sensorData/date`: Obtiene datos de los sensores dentro de un rango de fechas.
    - Ejemplos de uso:
      - `GET /sensordata/date?start_date=2022-05&end_date=2023-02` con un rango de inicio y fin
      - `GET /sensordata/date?start_date=2022-05` con un rango de inicio hasta la ultima fecha
      - `GET /sensordata/date?start_date=2022-05?one_day=true` sin rango solo muestra los que tenga la fecha 

-   `GET /sensorData/find/:attribute/:data`: Busca datos de los sensores por un atributo específico.
-   `GET /sensorData/find`: Filtra datos numéricos con alguno de estos condicionales(`mayor`,`menor`,`igual`).
    -   Ejemplo de uso: `GET /sensordata/find?atributo=temperature&dato=30&condicion=mayor`

## Autores

-   Jeisson Rodriguez 
-   Kevin Ramirez
-   Bryan Zabala

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.