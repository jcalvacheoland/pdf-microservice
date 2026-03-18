# Despliegue en Dokploy (VPS)

## Requisitos previos

- VPS con Dokploy instalado
- Repo en GitHub
- Dominio con DNS configurado (ej. Cloudflare)

---

## 1. Subir el repo a GitHub

Si el repo está en Azure DevOps u otro origen, agrega GitHub como segundo remote:

```bash
git remote add github https://github.com/tu-usuario/pdf-microservice.git
git checkout -b main
git push -u github main
```

> Cada vez que quieras desplegar, haz `git push github master:main`

---

## 2. Configurar el proyecto en Dokploy

### Provider
- **Provider**: GitHub
- **Repository**: pdf-microservice
- **Branch**: main
- **Trigger Type**: On Push

### Build Type
- Seleccionar **Dockerfile**
- **Dockerfile path**: `Dockerfile`

### Environment Settings
Agregar las siguientes variables de entorno:

```env
API_TOKEN=tu_token_secreto
AZURE_STORAGE_CONNECTION_STRING=tu_connection_string
AZURE_STORAGE_CONTAINER_NAME=pdf
AXXIS_OLAND_AZURE_STORAGE_CONNECTION_STRING=tu_connection_string_axxis
AXXIS_OLAND_AZURE_STORAGE_CONTAINER_NAME=axxis-oland
```

> Usar **Environment Settings**, no Build-time Arguments ni Build-time Secrets.

---

## 3. Configurar el dominio

### En Cloudflare (DNS)
Crear un registro tipo `A`:

| Campo | Valor |
|-------|-------|
| Tipo | `A` |
| Nombre | `service` (o el subdominio que prefieras) |
| Destino | IP del VPS |
| Proxy | Desactivado (nube gris) para el setup inicial |

### En Dokploy (Domain)
- **Host**: `service.tudominio.com`
- **Container Port**: `3000`
- **HTTPS**: activado
- **Cert**: letsencrypt

---

## 4. Deploy

Haz clic en **Deploy** en Dokploy. A partir de este momento, cada `git push github master:main` disparará un redeploy automático.

---

## Verificar que funciona

```bash
curl -X POST https://service.tudominio.com/api/pdf \
  -H "Content-Type: application/json" \
  -H "x-api-key: tu_token_secreto" \
  -d '{"html": "<h1>Test</h1>"}'
```

Respuesta esperada:
```json
{
  "success": true,
  "url": "https://storage.blob.core.windows.net/pdf/pdf-1234567890.pdf"
}
```
