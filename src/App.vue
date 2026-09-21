<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import api from './services/api'
import type { DevicesResponse } from './types/ecoflow'

const telemetria = ref<DevicesResponse | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
let pollingInterval: number | undefined

const fetchTelemetria = async () => {
  try {
    const data = await api.getDevices()
    telemetria.value = data
    error.value = null
  } catch (err: any) {
    error.value = err.message || 'Error al conectar con la API'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Carga inicial
  fetchTelemetria()
  // Refrescar en segundo plano cada 10 segundos
  pollingInterval = setInterval(fetchTelemetria, 10000)
})

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval)
})
</script>

<template>
  <div class="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
    <header class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-green-400">EcoFlow Reader</h1>
      <div class="flex items-center gap-2">
        <span class="relative flex h-3 w-3">
          <span v-if="!error" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3" :class="error ? 'bg-red-500' : 'bg-green-500'"></span>
        </span>
        <span class="text-sm text-gray-400">{{ error ? 'Desconectado' : 'En vivo' }}</span>
      </div>
    </header>
    
    <div v-if="loading && !telemetria" class="text-gray-400 flex items-center justify-center h-64">
      <span class="animate-pulse text-lg">Conectando con la telemetría...</span>
    </div>
    
    <div v-else-if="error && !telemetria" class="bg-red-900/50 text-red-200 p-4 rounded-lg border border-red-800">
      {{ error }}
    </div>
    
    <div v-else class="space-y-8">
      <div v-for="(device, sn) in telemetria?.devices" :key="sn" class="space-y-6">
        
        <div class="flex items-center gap-4 border-b border-gray-700 pb-2">
          <h2 class="text-xl font-semibold text-gray-200">Dispositivo: <span class="text-blue-400 font-mono text-lg">{{ sn }}</span></h2>
        </div>

        <div v-if="device.error" class="text-red-400 bg-red-900/20 p-4 rounded-lg">
          {{ device.error }}
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <!-- Tarjeta de Batería -->
          <div class="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700/50 flex flex-col justify-between">
            <div>
              <h3 class="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4">Batería</h3>
              <div class="flex items-end gap-2 mb-2">
                <span class="text-5xl font-bold" :class="device.battery?.level > 20 ? 'text-green-400' : 'text-red-400'">
                  {{ device.battery?.level }}%
                </span>
              </div>
              
              <!-- Barra de progreso -->
              <div class="w-full bg-gray-700 rounded-full h-2.5 mb-6">
                <div class="h-2.5 rounded-full transition-all duration-500" 
                     :class="device.battery?.level > 20 ? 'bg-green-500' : 'bg-red-500'" 
                     :style="{ width: `${device.battery?.level}%` }">
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="block text-gray-500">Temperatura</span>
                <span class="font-medium text-gray-200">{{ device.battery?.temp_c }} °C</span>
              </div>
              <div>
                <span class="block text-gray-500">Salud</span>
                <span class="font-medium text-gray-200">{{ device.battery?.health }}%</span>
              </div>
              <div>
                <span class="block text-gray-500">Ciclos</span>
                <span class="font-medium text-gray-200">{{ device.battery?.cycles }}</span>
              </div>
            </div>
          </div>

          <!-- Tarjeta de Entrada -->
          <div class="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700/50">
            <h3 class="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4">Entrada (Input)</h3>
            <div class="mb-6">
              <span class="text-4xl font-bold text-yellow-400">{{ device.power_in?.total_watts }}</span>
              <span class="text-gray-400 ml-1">W</span>
            </div>
            
            <div class="space-y-3 text-sm">
              <div class="flex justify-between items-center">
                <span class="text-gray-500">Red Eléctrica (AC)</span>
                <span class="font-medium text-gray-200">{{ device.power_in?.ac_watts }} W</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-500">Solar (MPPT)</span>
                <span class="font-medium text-gray-200">{{ device.power_in?.solar_watts }} W</span>
              </div>
              <div v-if="device.power_in?.time_remaining_mins > 0" class="flex justify-between items-center pt-3 border-t border-gray-700">
                <span class="text-gray-500">Tiempo de carga</span>
                <span class="font-medium text-blue-300">
                  {{ Math.floor(device.power_in.time_remaining_mins / 60) }}h {{ device.power_in.time_remaining_mins % 60 }}m
                </span>
              </div>
            </div>
          </div>

          <!-- Tarjeta de Salida -->
          <div class="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700/50">
            <h3 class="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4">Salida (Output)</h3>
            <div class="mb-6">
              <span class="text-4xl font-bold text-blue-400">{{ device.power_out?.total_watts }}</span>
              <span class="text-gray-400 ml-1">W</span>
            </div>
            
            <div class="space-y-3 text-sm">
              <div class="flex justify-between items-center">
                <span class="text-gray-500">Inversor AC</span>
                <div class="flex items-center gap-2">
                  <!-- Indicador visual del estado del puerto -->
                  <span class="h-2 w-2 rounded-full" :class="device.power_out?.ac_enabled ? 'bg-green-500' : 'bg-gray-600'"></span>
                  <span class="font-medium text-gray-200">{{ device.power_out?.ac_watts }} W</span>
                </div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-500">Puertos DC / USB</span>
                <div class="flex items-center gap-2">
                  <span class="h-2 w-2 rounded-full" :class="device.power_out?.dc_enabled ? 'bg-green-500' : 'bg-gray-600'"></span>
                  <span class="font-medium text-gray-200">{{ device.power_out?.total_watts - device.power_out?.ac_watts }} W</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>