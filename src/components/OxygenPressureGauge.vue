<template>
  <div class="bg-bombero-surface p-4 rounded-card border border-bombero-border shadow-sm flex flex-col justify-between hover:border-bombero-border-dark transition-all">
    <div class="flex items-center justify-between border-b border-bombero-border pb-2 mb-3">
      <div class="flex items-center space-x-2">
        <svg class="w-4 h-4 text-bombero-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <span class="font-mono text-xs font-bold text-bombero-text-primary uppercase">{{ codigo }}</span>
      </div>
      <span
        :class="badgeEstadoClass"
        class="text-[11px] font-semibold px-2 py-0.5 rounded uppercase"
      >
        {{ estadoLegible }}
      </span>
    </div>

    <!-- Indicador Circular de Presión -->
    <div class="flex flex-col items-center py-2">
      <div class="relative w-28 h-28 flex items-center justify-center">
        <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path
            class="text-slate-100"
            stroke-width="3.5"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            :class="esSeguro ? 'text-emerald-600' : 'text-bombero-primary'"
            stroke-dasharray="100, 100"
            :stroke-dashoffset="100 - porcentaje"
            stroke-linecap="round"
            stroke-width="3.5"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div class="absolute flex flex-col items-center">
          <span class="font-mono text-2xl font-bold tracking-tight text-bombero-text-primary">{{ bares }}</span>
          <span class="font-mono text-[10px] text-bombero-text-muted uppercase">Bares</span>
        </div>
      </div>

      <!-- Badge de Seguridad NFPA -->
      <div class="mt-3 text-center">
        <span
          v-if="esSeguro"
          class="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200"
        >
          <svg class="w-3 h-3 mr-1 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          APTO PARA COMBATE (&ge;250 BAR)
        </span>
        <span
          v-else
          class="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-800 border border-red-200"
        >
          <svg class="w-3 h-3 mr-1 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          PRESIÓN CRÍTICA (&lt;250 BAR)
        </span>
      </div>
    </div>

    <!-- Asignación vehicular si corresponde -->
    <div class="mt-2 pt-2 border-t border-bombero-border text-[11px] text-bombero-text-secondary flex justify-between">
      <span>Asignación:</span>
      <span class="font-mono font-semibold text-bombero-text-primary">
        {{ camionAsignadoId ? camionAsignadoId : 'EN ALMACÉN' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  codigo: string;
  bares: number;
  esSeguro: boolean;
  estado: string;
  camionAsignadoId?: string | null;
}>();

const porcentaje = computed(() => Math.min(Math.round((props.bares / 300) * 100), 100));

const estadoLegible = computed(() => {
  switch (props.estado) {
    case 'DISPONIBLE': return 'Disponible';
    case 'ASIGNADO_CAMION': return 'En Cisterna';
    case 'MANTENIMIENTO_REQUERIDO': return 'Mantenimiento';
    case 'EN_DESINFECCION': return 'Desinfección';
    default: return props.estado;
  }
});

const badgeEstadoClass = computed(() => {
  switch (props.estado) {
    case 'DISPONIBLE':
      return 'bg-emerald-50 text-emerald-800 border border-emerald-200';
    case 'ASIGNADO_CAMION':
      return 'bg-amber-50 text-amber-800 border border-amber-200';
    case 'MANTENIMIENTO_REQUERIDO':
      return 'bg-red-50 text-red-800 border border-red-200';
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200';
  }
});
</script>
