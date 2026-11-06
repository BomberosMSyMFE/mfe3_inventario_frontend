<template>
  <div class="bg-bombero-surface rounded-card border border-bombero-border shadow-sm overflow-hidden">
    <div class="px-5 py-3.5 border-b border-bombero-border bg-slate-50 flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center space-x-2">
        <svg class="w-4 h-4 text-bombero-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
        <h3 class="text-sm font-bold text-bombero-text-primary uppercase tracking-wide">
          Balance de Químicos y Agentes Extintores
        </h3>
      </div>
      <span class="font-mono text-[11px] text-bombero-text-secondary bg-white border border-bombero-border px-2 py-0.5 rounded">
        GraphQL: auditoriaStockGeneral
      </span>
    </div>

    <div class="table-responsive">
      <table class="w-full text-left text-xs text-bombero-text-secondary">
        <thead class="bg-slate-100 text-bombero-text-primary uppercase font-bold text-[11px] border-b border-bombero-border">
          <tr>
            <th class="px-5 py-3 font-mono">Código</th>
            <th class="px-5 py-3">Insumo Químico</th>
            <th class="px-5 py-3">Tipo</th>
            <th class="px-5 py-3 font-mono">Lote</th>
            <th class="px-5 py-3 font-mono">Caducidad</th>
            <th class="px-5 py-3 text-right">Volumen Disponible</th>
            <th class="px-5 py-3 text-center">Nivel Operativo</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-bombero-border">
          <tr
            v-for="item in items"
            :key="item.id || item.codigo"
            class="hover:bg-slate-50 transition-colors"
          >
            <td class="px-5 py-3 font-mono font-bold text-bombero-text-primary">{{ item.codigo }}</td>
            <td class="px-5 py-3 font-semibold text-bombero-text-primary">{{ item.nombre }}</td>
            <td class="px-5 py-3">
              <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
                {{ item.tipo }}
              </span>
            </td>
            <td class="px-5 py-3 font-mono text-bombero-text-secondary">{{ item.lote || 'N/A' }}</td>
            <td class="px-5 py-3 font-mono text-bombero-text-secondary">{{ item.fechaCaducidad || 'VIGENTE' }}</td>
            <td class="px-5 py-3 text-right font-mono font-bold text-sm text-slate-900">
              {{ formatNumber(item.litrosDisponibles) }} L
            </td>
            <td class="px-5 py-3 text-center">
              <span
                v-if="item.litrosDisponibles >= 500"
                class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase"
              >
                Óptimo
              </span>
              <span
                v-else-if="item.litrosDisponibles >= 250"
                class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase"
              >
                Atención (Mínimo)
              </span>
              <span
                v-else
                class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-800 border border-red-200 uppercase"
              >
                Crítico / Reponer
              </span>
            </td>
          </tr>
          <tr v-if="items.length === 0">
            <td colspan="7" class="px-5 py-8 text-center text-bombero-text-muted">
              No hay suministros químicos registrados en el almacén.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="px-5 py-2.5 bg-slate-50 border-t border-bombero-border flex justify-between items-center text-[11px] text-bombero-text-muted">
      <span>Mostrando {{ items.length }} suministros en almacén</span>
      <span class="font-mono">Estándar NFPA 11 / 18</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: Array<{
    id?: string;
    codigo: string;
    nombre: string;
    tipo: string;
    litrosDisponibles: number;
    lote?: string;
    fechaCaducidad?: string;
  }>;
}>();

function formatNumber(num: number): string {
  return new Intl.NumberFormat('es-BO', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(num);
}
</script>
