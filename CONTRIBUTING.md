# Guía de Contribución (UI)

Toda colaboración es bienvenida. Mantén en mente las siguientes directrices al proponer cambios:

## Flujo de Trabajo
1. **TypeScript Estricto:** No utilices `any`. Aprovecha las interfaces de TypeScript para mapear exactamente las respuestas que devuelve el backend.
2. **Composition API:** Todo componente nuevo debe usar el formato `<script setup lang="ts">` nativo de Vue 3. No utilices la Options API antigua.
3. **Gestión de Paquetes:** Si necesitas instalar una nueva dependencia (ej. `npm install axios`), hazlo siempre **dentro** del contenedor, nunca en tu máquina local. Usa `docker compose exec ui-dev sh` si tu entorno está corriendo, o `docker compose run --rm ui-dev sh` si está apagado.

## Estilos y Diseño
El proyecto utiliza un enfoque de diseño modular. Asegúrate de mantener la limpieza visual y de no saturar el panel de control, priorizando la legibilidad de la telemetría de energía.

## Criterios de Aceptación (Pull Requests)
Antes de enviar tus cambios, debes superar dos filtros de validación para garantizar que ni la lógica ni la interfaz se hayan roto.

### Paso 1: Validación Lógica (TypeScript)
Garantiza que no existan errores de tipado o variables mal asignadas.
* Si el entorno de desarrollo (`ui-dev`) está apagado, lanza un contenedor temporal:
  ```bash
  docker compose run --rm ui-dev sh -c "npm install && npm run build"
  ```
* Si tu entorno de desarrollo (`ui-dev`) está corriendo en segundo plano:
  ```bash
  docker compose exec ui-dev npm run build
  ```

### Paso 2: Validación Visual (Playwright)
Garantiza que la interfaz coincida píxel por píxel. 
**Prerrequisitos:** Asegúrate de tener la API corriendo (con `MOCK_MODE=true` para datos estáticos) y el entorno de producción compilado y levantado (`docker compose up -d --build ui-prod`).

Ejecuta la suite de pruebas E2E instanciando su contenedor temporal:
```bash
docker compose run --rm ui-e2e bash -c "npm install && npx -y playwright test"
```

**Cambios Visuales Intencionales:** Si tu PR modifica intencionalmente el diseño (márgenes, colores, distribución), la prueba visual anterior fallará deliberadamente. Debes actualizar la imagen de referencia (snapshot) explícitamente y subirla a Git:
```bash
docker compose run --rm ui-e2e bash -c "npm install && npx -y playwright test --update-snapshots"
```
