# Estrategia de Pruebas (UI)

El frontend asegura la estabilidad de la interfaz a través de pruebas End-to-End (E2E) y de regresión visual utilizando **Playwright** en un entorno Dockerizado.

## Pruebas End-to-End (E2E) y Regresión Visual
Playwright navega por la aplicación como lo haría un usuario real, interactúa con el DOM y toma capturas de pantalla de los componentes clave. Estas capturas se comparan píxel por píxel con una imagen base (snapshot) guardada en el repositorio. Esto garantiza que no haya mutaciones de CSS ni cambios de maquetación accidentales.

### Flujo y Prerrequisitos
Antes de ejecutar la suite de pruebas, debes garantizar que el ecosistema esté funcionando:

1. **La API (Backend):** Debe estar corriendo. Para las pruebas visuales, es **obligatorio** activar el `MOCK_MODE=true` en el `.env` del backend. Esto asegura que la telemetría devuelta sea siempre la misma (estática) y las pruebas no fallen por fluctuaciones naturales en la batería física.
2. **El Frontend (Producción):** Playwright ejecuta las pruebas contra el servidor de producción (`ui-prod`). Esta es la mejor práctica, ya que valida el código final, comprimido y servido por Nginx, garantizando que el build definitivo no se haya roto durante la compilación de Vite. Asegúrate de levantarlo previamente:
   ```bash
   docker compose up -d --build ui-prod
   ```

### Ejecutar el Entorno de Pruebas
A diferencia de los entornos de desarrollo o producción, el entorno de pruebas (`ui-e2e`) **no es un servidor que se deja corriendo en segundo plano**. Es un contenedor efímero: nace, ejecuta los tests y se destruye automáticamente.

Una vez cumplidos los prerrequisitos, corre la suite completa lanzando un contenedor temporal (`run --rm`):
```bash
docker compose run --rm ui-e2e bash -c "npm install && npx -y playwright test"
```

### Actualizar Snapshots (Gestión Deliberada)
Para evitar que el repositorio crezca descontroladamente con imágenes basura, las capturas base (`snapshots`) solo se actualizan cuando se realiza un cambio visual de forma deliberada. 

Si modificas el diseño (ej. alterar un color o ajustar la grilla) y estás conforme con el resultado, actualiza las referencias oficiales ejecutando:
```bash
docker compose run --rm ui-e2e bash -c "npm install && npx -y playwright test --update-snapshots"
```
**Importante:** Recuerda hacer `git add` de la carpeta `e2e/` para subir las nuevas imágenes actualizadas en tu commit.

## Validación Continua (TypeScript)
Como primera línea de defensa antes de probar la interfaz visual, debes garantizar que el código no tenga errores lógicos ni de tipado. El comando a utilizar depende de tu estado de trabajo actual:

* **Escenario A (Tu entorno de desarrollo `ui-dev` está APAGADO):**
  Debes levantar un contenedor temporal que instale las dependencias, revise el código y se autodestruya:
  ```bash
  docker compose run --rm ui-dev sh -c "npm install && npm run build"
  ```
* **Escenario B (Tu entorno de desarrollo `ui-dev` ya está CORRIENDO en segundo plano):**
  Puedes ejecutar la validación directamente dentro del contenedor activo usando `exec` (es mucho más rápido porque las dependencias ya existen):
  ```bash
  docker compose exec ui-dev npm run build
  ```

## Herramientas Planificadas (Futuro)
A medida que el proyecto crezca en complejidad de cálculo, integraremos:
* **Vitest:** Para pruebas unitarias aisladas de las funciones utilitarias y transformación de datos (ej. conversores de Watts a kWh).
