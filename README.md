# EcoFlow Reader UI

Panel de control web reactivo para monitorear la telemetría, el consumo y el estado de batería de múltiples equipos EcoFlow. 

Este frontend está desarrollado con **Vue 3** y **Vite**, y está diseñado para consumir exclusivamente los datos proporcionados por `ecoflow-reader-api`.

## Entorno de Desarrollo (Docker)

No es necesario instalar Node.js ni NPM en el sistema anfitrión. Todo el flujo de trabajo está encapsulado.

1. **Prepara las variables de entorno:**
   ```bash
   cp .env.example .env
   ```
2. **Levanta el servidor de desarrollo:**
   ```bash
   docker compose up -d
   ```
3. **Accede al panel:**
   Abre `http://localhost:5173` en tu navegador. El servidor cuenta con *Hot Module Replacement* (HMR), por lo que cualquier edición en los archivos `.vue` se reflejará instantáneamente.

## Licencia

Distribuido bajo la licencia MIT.
