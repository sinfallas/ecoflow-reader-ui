import { test, expect } from '@playwright/test';

test('El panel renderiza la estructura principal y conecta', async ({ page }) => {
  // 1. Interceptamos la llamada a FastAPI antes de que salga del navegador
  await page.route('**/api/v1/devices', async route => {
    const json = {
      devices: {
        'R331ZABASH2L2360': {
          battery: { level: 85, temp_c: 36, health: 98, cycles: 184 },
          power_in: { total_watts: 76, ac_watts: 76, solar_watts: 0, time_remaining_mins: 5939 },
          power_out: { total_watts: 94, ac_watts: 76, dc_enabled: true, ac_enabled: true }
        }
      }
    };
    await route.fulfill({ json });
  });

  // 2. Navegamos a la raíz de la aplicación
  await page.goto('/');

  // 3. Verificamos que el título de la App esté visible
  await expect(page.getByText('EcoFlow Reader', { exact: true })).toBeVisible();

  // 4. Verificamos que los bloques estructurales (Tarjetas) se hayan renderizado
  await expect(page.getByText('BATERÍA')).toBeVisible();
  await expect(page.getByText('ENTRADA (INPUT)')).toBeVisible();
  await expect(page.getByText('SALIDA (OUTPUT)')).toBeVisible();

  // 5. Verificamos que los datos mockeados se reflejen
  await expect(page.getByText('85%')).toBeVisible();
  await expect(page.getByText('En vivo')).toBeVisible();

  // 6. Prueba de Regresión Visual
  await expect(page).toHaveScreenshot('panel-principal.png', { fullPage: true });
});
