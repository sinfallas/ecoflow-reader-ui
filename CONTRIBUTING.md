# Guía de Contribución (UI)

Toda colaboración es bienvenida. Mantén en mente las siguientes directrices al proponer cambios:

## Flujo de Trabajo
1. **TypeScript Estricto:** No utilices `any`. Aprovecha las interfaces de TypeScript para mapear exactamente las respuestas que devuelve el backend.
2. **Composition API:** Todo componente nuevo debe usar el formato `<script setup lang="ts">` nativo de Vue 3. No utilices la Options API antigua.
3. **Gestión de Paquetes:** Si necesitas instalar una nueva dependencia (ej. `npm install axios`), hazlo siempre **dentro** del contenedor, nunca en tu máquina local:
   ```bash
   docker exec -it ecoflow_ui sh
   ```

## Estilos y Diseño
El proyecto utiliza un enfoque de diseño modular. Asegúrate de mantener la limpieza visual y de no saturar el panel de control, priorizando la legibilidad de la telemetría de energía.
