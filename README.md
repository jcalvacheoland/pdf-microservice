# PDF Microservice

Microservicio para generar PDFs a partir de HTML y almacenarlos en Azure Blob Storage.

## Descripción

Este servicio recibe contenido HTML, lo convierte a PDF usando Playwright (navegador Chromium headless), y lo sube automáticamente a Azure Blob Storage, retornando la URL pública del archivo.

## Características

- Generación de PDFs a partir de HTML
- Procesamiento completamente en memoria (sin archivos temporales)
- Almacenamiento automático en Azure Blob Storage
- Autenticación mediante API Key
- Formato A4 con soporte para backgrounds CSS

## Arquitectura

### Flujo de generación del PDF

1. **Endpoint API** ([server.ts:20](src/server.ts#L20))
   - Recibe petición POST en `/api/pdf` con HTML y opciones
   - Valida autenticación mediante `x-api-key` header

2. **Generación del PDF** ([generatePdf.ts:3](src/generatePdf.ts#L3))
   - Lanza navegador Chromium headless
   - Renderiza el HTML en la página
   - Genera el PDF con `page.pdf()` en formato A4
   - Retorna el PDF como Buffer en memoria

3. **Almacenamiento** ([server.ts:35](src/server.ts#L35))
   - Crea nombre único para el archivo
   - Sube el PDF a Azure Blob Storage
   - Retorna URL pública del archivo

**Nota importante**: El PDF nunca se guarda en el sistema de archivos local, todo el procesamiento ocurre en memoria.

## Instalación

```bash
npm install
```

## Configuración

Crear archivo `.env` con las siguientes variables:

```env
API_TOKEN=tu_token_secreto
AZURE_STORAGE_CONNECTION_STRING=tu_connection_string
AZURE_CONTAINER_NAME=nombre_del_contenedor
PORT=3000
```

## Uso

### Iniciar el servidor

```bash
npm start
```

### Generar un PDF

```bash
curl -X POST http://localhost:3000/api/pdf \
  -H "Content-Type: application/json" \
  -H "x-api-key: tu_token_secreto" \
  -d '{
    "html": "<html><body><h1>Hola Mundo</h1></body></html>",
    "options": {
      "format": "A4",
      "printBackground": true
    }
  }'
```

### Respuesta

```json
{
  "success": true,
  "url": "https://your-storage.blob.core.windows.net/container/pdf-1234567890.pdf"
}
```

## API

### POST /api/pdf

Genera un PDF a partir de HTML.

**Headers:**
- `x-api-key`: Token de autenticación (requerido)
- `Content-Type`: application/json

**Body:**
```json
{
  "html": "string (requerido)",
  "options": {
    "format": "A4",
    "printBackground": true,
    "preferCSSPageSize": true
  }
}
```

**Opciones de PDF disponibles:**
- `format`: Tamaño de página (A4, Letter, etc.)
- `printBackground`: Imprimir fondos CSS
- `preferCSSPageSize`: Usar tamaño definido en CSS
- Ver más opciones en [Playwright PDF API](https://playwright.dev/docs/api/class-page#page-pdf)

## Seguridad

- Autenticación mediante API Key en header `x-api-key`
- Validación de contenido HTML requerido
- Límite de 10MB para el body de la petición
- Sandbox del navegador deshabilitado solo para Docker/contenedores

## Tecnologías

- **Express**: Framework web
- **Playwright**: Generación de PDFs
- **Azure Blob Storage**: Almacenamiento de archivos
- **TypeScript**: Lenguaje de programación

## Estructura del proyecto

```
pdf-microservice/
├── src/
│   ├── server.ts           # Servidor Express y endpoint API
│   ├── generatePdf.ts      # Lógica de generación de PDFs
│   └── uploadToAzure.ts    # Cliente de Azure Blob Storage
├── .env                    # Variables de entorno
└── package.json
```

## License

MIT
