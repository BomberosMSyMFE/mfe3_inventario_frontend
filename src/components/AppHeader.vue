<template>
  <header class="bg-bombero-surface border-b border-bombero-border px-6 py-3.5 flex items-center justify-between shadow-xs sticky top-0 z-30">
    <!-- Título de la Sección Activa -->
    <div class="flex items-center space-x-3">
      <h1 class="text-base font-bold text-bombero-text-primary uppercase tracking-wide">
        {{ tituloVista }}
      </h1>
      <span class="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
        {{ subtituloVista }}
      </span>
    </div>

    <!-- Controles Rápidos: Registro -->
    <div class="flex items-center space-x-3">
      <!-- Botón Primario: Registrar Nuevo Ítem -->
      <button
        type="button"
        @click="$emit('abrirRegistro')"
        class="px-4 py-2 rounded-btn bg-bombero-primary hover:bg-bombero-primary-hover text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm cursor-pointer"
      >
        <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Registrar Nuevo Ítem</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  seccionActiva: string;
  estacionSeleccionada: string;
  cargando: boolean;
}>();

defineEmits<{
  (e: 'cambiarEstacion', estacion: string): void;
  (e: 'sincronizar'): void;
  (e: 'abrirRegistro'): void;
}>();

const tituloVista = computed(() => {
  switch (props.seccionActiva) {
    case 'dashboard': return 'Dashboard de Resumen Logístico';
    case 'inventario': return 'Inventario General de Recursos';
    case 'saga': return 'Control de Reservas SAGA';
    case 'movimientos': return 'Trazabilidad y Movimientos';
    case 'mantenimiento': return 'Taller y Mantenimiento Preventivo';
    default: return 'Gestión de Inventario';
  }
});

const subtituloVista = computed(() => {
  switch (props.seccionActiva) {
    case 'dashboard': return 'Métricas en tiempo real';
    case 'inventario': return 'Recursos, EPPs y Químicos';
    case 'saga': return 'Enlace MS-01 & MS-02';
    case 'movimientos': return 'Auditoría inmutable';
    case 'mantenimiento': return 'Fatiga y Presión NFPA';
    default: return 'MS-03 / MFE-03';
  }
});
</script>
