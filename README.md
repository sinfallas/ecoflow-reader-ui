# EcoFlow Reader UI

Panel de telemetría web moderno y responsivo para monitorear estaciones de energía EcoFlow en tiempo real. Este frontend se comunica con la API para visualizar el estado de la batería, flujos de entrada (AC/Solar) y consumos de salida.

Construido con **Vue 3 (Composition API)**, **TypeScript**, **Tailwind CSS v4** y empaquetado con **Vite**.

## Arquitectura

El proyecto utiliza Docker Compose con tres entornos aislados según su propósito:
1. **Desarrollo (`ui-dev`)**: Utiliza un contenedor de Node para ofrecer *Hot-Module Replacement* (HMR) a través del puerto 5173. Servidor de ejecución continua.
2. **Producción (`ui-prod`)**: Utiliza un *Multi-stage build* que compila los archivos estáticos y los sirve mediante un servidor **Nginx** ultraligero en el puerto 80. Servidor de ejecución continua.
3. **Pruebas (`ui-e2e`)**: Contenedor efímero dedicado a la ejecución de Playwright para pruebas de Regresión Visual y End-to-End. Solo se invoca bajo demanda.

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

### Desarrollo sin Hardware (Modo Simulado)
Si vas a trabajar en la interfaz gráfica pero no posees una estación EcoFlow física, la API cuenta con un modo de simulación. En el repositorio del backend (`ecoflow-reader-api`), asegúrate de tener `MOCK_MODE=true` en su archivo `.env`. El frontend consumirá estos datos estáticos perfectamente.

## Despliegue y Flujo de Trabajo

### 1. Entorno de Desarrollo
Para programar y realizar cambios en el código visualizando los resultados en tiempo real:

```bash
docker compose up -d ui-dev
```
Accede al panel desde tu navegador en: `http://localhost:5173`

### 2. Entorno de Producción
Para compilar la aplicación final, minificar el código y servirlo de forma nativa con Nginx:

```bash
docker compose up -d --build ui-prod
```
Accede al panel de producción directamente en: `http://localhost`

### 3. Entorno de Pruebas (E2E)
A diferencia de los entornos anteriores, el entorno de pruebas no se deja "encendido" en segundo plano. Se lanza como un proceso temporal que evalúa la interfaz de producción y luego se apaga automáticamente. 

Con el entorno de **producción** encendido y la **API en modo simulado**, ejecuta:
```bash
docker compose run --rm ui-e2e bash -c "npm install && npx -y playwright test"
```
*(Para más detalles sobre las pruebas visuales y la validación de TypeScript, lee `TESTING.md`)*.

## Limpieza del Sistema

Si necesitas purgar cachés de Vite, módulos de Node locales, reportes temporales de las pruebas de Playwright y limpiar las redes de Docker, ejecuta el script de mantenimiento incluido (requiere permisos de root):

```bash
sudo ./limpieza.sh
```

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
