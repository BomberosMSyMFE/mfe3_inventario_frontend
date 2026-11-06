<template>
  <div class="bg-bombero-surface p-5 rounded-card border border-bombero-border shadow-sm">
    <div class="flex items-center justify-between border-b border-bombero-border pb-3 mb-4">
      <div class="flex items-center space-x-2">
        <svg class="w-4 h-4 text-bombero-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-sm font-bold text-bombero-text-primary uppercase tracking-wide">
          Ledger Transaccional SAGA (Auditoría Distribuida)
        </h3>
      </div>
      <span class="text-[11px] font-mono text-bombero-text-muted">
        MS-01 &harr; MS-03
      </span>
    </div>

    <div class="space-y-2.5">
      <div
        v-for="tx in transactions"
        :key="tx.transaccionId"
        class="p-3 rounded border flex flex-wrap items-center justify-between gap-3 text-xs transition-all"
        :class="tx.estado === 'RESERVADO' ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50 border-bombero-border'"
      >
        <div class="flex-1 min-w-[220px]">
          <div class="flex items-center space-x-2">
            <span class="font-mono font-bold text-bombero-text-primary text-[11px]">{{ tx.transaccionId }}</span>
            <span
              :class="tx.estado === 'RESERVADO' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-emerald-100 text-emerald-900 border-emerald-300'"
              class="px-2 py-0.5 rounded text-[10px] font-bold uppercase border font-mono"
            >
              {{ tx.estado }}
            </span>
          </div>
          <div class="text-[11px] text-bombero-text-secondary mt-1 flex flex-wrap gap-x-3">
            <span>Incidente: <strong class="font-mono text-bombero-text-primary">{{ tx.incidenteId }}</strong></span>
            <span>Unidad: <strong class="font-mono text-bombero-text-primary">{{ tx.camionId }}</strong></span>
            <span v-if="tx.materiales">Material: <strong class="font-mono text-bombero-text-primary">{{ tx.materiales }}</strong></span>
          </div>
        </div>

        <div v-if="tx.estado === 'RESERVADO'">
          <button
            @click="$emit('compensar', tx.transaccionId)"
            :disabled="cargando"
            class="px-3 py-1.5 rounded-btn bg-red-50 text-bombero-primary border border-red-200 hover:bg-red-100 font-semibold text-[11px] flex items-center space-x-1.5 transition-colors disabled:opacity-50"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <span>Ejecutar Rollback</span>
          </button>
        </div>
        <div v-else class="text-[11px] text-emerald-700 font-mono flex items-center space-x-1">
          <svg class="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span>STOCK RESTITUIDO</span>
        </div>
      </div>

      <div v-if="transactions.length === 0" class="p-6 text-center text-xs text-bombero-text-muted border border-dashed border-bombero-border rounded">
        No hay transacciones SAGA registradas en esta sesión. Use el simulador de despacho para probar la reserva.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface SagaTxItem {
  transaccionId: string;
  incidenteId: string;
  camionId: string;
  materiales?: string;
  estado: 'RESERVADO' | 'COMPENSADO_LIBERADO';
  timestamp?: string;
}

defineProps<{
  transactions: SagaTxItem[];
  cargando?: boolean;
}>();

defineEmits<{
  (e: 'compensar', transaccionId: string): void;
}>();
</script>
