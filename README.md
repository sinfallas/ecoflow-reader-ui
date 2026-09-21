# EcoFlow Reader UI

Panel de telemetría web moderno y responsivo para monitorear estaciones de energía EcoFlow en tiempo real. Este frontend se comunica con la API para visualizar el estado de la batería, flujos de entrada (AC/Solar) y consumos de salida.

Construido con **Vue 3 (Composition API)**, **TypeScript**, **Tailwind CSS v4** y empaquetado con **Vite**.

## Arquitectura

El proyecto utiliza Docker Compose con dos entornos aislados:
1. **Desarrollo (`ui-dev`)**: Utiliza un contenedor de Node para ofrecer *Hot-Module Replacement* (HMR) a través del puerto 5173.
2. **Producción (`ui-prod`)**: Utiliza un *Multi-stage build* que compila los archivos estáticos y los sirve mediante un servidor **Nginx** ultraligero en el puerto 80.

## Requisitos Previos

* Docker y Docker Compose instalados.
* La API backend de EcoFlow Reader corriendo y con los orígenes CORS configurados adecuadamente.

## Configuración Inicial

1. Clona este repositorio.
2. Copia la plantilla de variables de entorno:
   ```bash
   cp .env.example .env
   ```
3. Edita el archivo `.env` y asegúrate de que la URL apunte a tu API local:
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   ```

## Despliegue

### Entorno de Desarrollo
Para programar y realizar cambios en tiempo real:

```bash
docker compose up -d ui-dev
```
Accede al panel desde tu navegador en: `http://localhost:5173`

### Entorno de Producción
Para compilar la aplicación final y servirla de forma nativa con Nginx:

```bash
docker compose up -d --build ui-prod
```
Accede al panel de producción directamente en: `http://localhost`

## Limpieza del Sistema

Si necesitas purgar cachés de Vite, módulos de Node locales y limpiar las redes de Docker, ejecuta el script de mantenimiento incluido (requiere permisos de root):

```bash
sudo ./limpieza.sh
```

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
