import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import App from './App.vue'
import api from './services/api'

// Interceptamos (mockeamos) las peticiones reales a FastAPI
vi.mock('./services/api', () => ({
  default: {
    getDevices: vi.fn()
  }
}))

describe('Panel de Telemetría (App.vue)', () => {
  it('muestra el mensaje de conexión al iniciar', () => {
    // Al montar el componente sin datos, debe mostrar el estado de carga
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Conectando con la telemetría...')
  })

  it('renderiza el número de serie y el nivel de batería al recibir datos', async () => {
    // 1. Simulamos una respuesta exitosa de la API con los datos de tu batería
    const mockData = {
      devices: {
        'R331ZABASH2L2360': {
          battery: { level: 98, temp_c: 36, health: 98, cycles: 184 },
          power_in: { total_watts: 76, ac_watts: 76, solar_watts: 0, time_remaining_mins: 5939 },
          power_out: { total_watts: 94, ac_watts: 76, dc_enabled: true, ac_enabled: true }
        }
      }
    }
    
    // Le decimos al mock qué devolver cuando se llame a getDevices()
    vi.mocked(api.getDevices).mockResolvedValue(mockData)

    // 2. Montamos el componente
    const wrapper = mount(App)

    // 3. Forzamos a Vue a esperar que se resuelvan las promesas (onMounted)
    await new Promise(resolve => setTimeout(resolve, 0))

    // 4. Verificamos que los datos se imprimieron en el HTML
    expect(wrapper.text()).toContain('R331ZABASH2L2360')
    expect(wrapper.text()).toContain('98%')
  })
})
