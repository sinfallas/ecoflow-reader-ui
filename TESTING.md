# Estrategia de Pruebas (UI)

El frontend sigue la misma filosofía de confiabilidad que la API base. 

## Herramientas Planificadas
A medida que el proyecto crezca, integraremos:
* **Vitest:** Para pruebas unitarias ultrarrápidas de las funciones utilitarias y la lógica de cálculo de energía.
* **Vue Test Utils:** Para montar componentes de forma aislada y simular interacciones del usuario (clics en interruptores de CA/CC).

## Validación Continua
Actualmente, la primera línea de defensa es el compilador de TypeScript. Antes de cada *commit*, asegúrate de que el proyecto compile sin errores de tipado ejecutando:
```bash
docker exec -it ecoflow_ui npm run build
```
