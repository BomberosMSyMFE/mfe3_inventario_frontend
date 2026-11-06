<template>
  <div
    v-if="abierto"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto"
  >
    <div
      class="bg-bombero-surface border border-bombero-border rounded-card w-full max-w-lg shadow-xl overflow-hidden my-8"
      role="dialog"
      aria-modal="true"
    >
      <!-- Cabecera del Modal -->
      <div class="bg-bombero-dark text-white px-6 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-2.5">
          <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h2 class="text-sm font-bold tracking-wide uppercase">
            Automatización de Alertas n8n (Punto 07)
          </h2>
        </div>
        <button
          @click="$emit('cerrar')"
          class="text-slate-400 hover:text-white transition-colors p-1"
          aria-label="Cerrar modal"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-4 text-xs">
        <!-- Banner Explicativo -->
        <div class="p-3 bg-amber-50 border border-amber-200 rounded-card text-amber-900 space-y-1">
          <p class="font-bold flex items-center space-x-1.5">
            <svg class="w-4 h-4 text-amber-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span>Alertas Automáticas hacia WhatsApp</span>
          </p>
          <p class="text-[11px] leading-relaxed">
            MS-03 emite eventos automáticos a <strong>n8n</strong> ante quiebre crítico de suministros químicos (&le; 200L) o cuando la <strong>IA detecta fatiga mecánica</strong> en herramientas, despachando la notificación inmediata a la Central y al WhatsApp del Operador (<strong>+59160495035</strong>).
          </p>
        </div>

        <!-- Parámetros del Webhook -->
        <div class="space-y-2 border border-bombero-border rounded p-3 bg-slate-50">
          <div class="flex items-center justify-between">
            <span class="text-bombero-text-secondary font-medium">Endpoint Webhook n8n:</span>
            <span class="font-mono text-[11px] font-bold text-bombero-text-primary">
              http://localhost:5678/webhook/alerta-quiebre-stock
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-bombero-text-secondary font-medium">Gateway Emisor WhatsApp:</span>
            <span class="font-mono text-[11px] font-bold text-emerald-700">Central Bomberos (+591 68809827)</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-bombero-text-secondary font-medium">Destinatario Oficial:</span>
            <span class="font-mono text-[11px] font-bold text-emerald-700">Operador / Admin (+591 60495035)</span>
          </div>
        </div>

        <!-- Selector de Tipo de Alerta -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-bombero-text-secondary mb-1">
            Tipo de Alerta para Simulación <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-2 gap-2 mb-3">
            <button
              type="button"
              @click="cambiarTipoAlerta('STOCK')"
              :class="tipoAlerta === 'STOCK' ? 'bg-amber-500 text-neutral-900 font-bold border-amber-600 shadow-sm' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'"
              class="px-3 py-2 text-xs rounded border transition-colors flex items-center justify-center space-x-1.5"
            >
              <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span>Quiebre de Stock (&le; 200L)</span>
            </button>
            <button
              type="button"
              @click="cambiarTipoAlerta('MANTENIMIENTO')"
              :class="tipoAlerta === 'MANTENIMIENTO' ? 'bg-amber-500 text-neutral-900 font-bold border-amber-600 shadow-sm' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'"
              class="px-3 py-2 text-xs rounded border transition-colors flex items-center justify-center space-x-1.5"
            >
              <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Mantenimiento Preventivo (Fatiga)</span>
            </button>
          </div>
        </div>

        <!-- Selector de Ítem para Prueba: Stock -->
        <div v-if="tipoAlerta === 'STOCK'">
          <label class="block text-xs font-bold uppercase tracking-wider text-bombero-text-secondary mb-1">
            Seleccionar Insumo Químico <span class="text-red-500">*</span>
          </label>
          <select
            v-model="codigoSeleccionado"
            class="w-full px-3 py-2 text-xs border border-bombero-border rounded-btn bg-white focus:outline-none focus:ring-1 focus:ring-bombero-secondary cursor-pointer"
          >
            <option v-for="q in insumosQuimicos" :key="q.codigo" :value="q.codigo">
              {{ q.codigo }} — {{ q.nombre }} ({{ q.litrosDisponibles }}L)
            </option>
          </select>
        </div>

        <!-- Selector de Ítem para Prueba: Mantenimiento -->
        <div v-else>
          <label class="block text-xs font-bold uppercase tracking-wider text-bombero-text-secondary mb-1">
            Seleccionar Herramienta / Maquinaria <span class="text-red-500">*</span>
          </label>
          <select
            v-model="codigoSeleccionado"
            class="w-full px-3 py-2 text-xs border border-bombero-border rounded-btn bg-white focus:outline-none focus:ring-1 focus:ring-bombero-secondary cursor-pointer"
          >
            <option v-for="h in herramientas" :key="h.codigo" :value="h.codigo">
              {{ h.codigo }} — {{ h.nombre }} ({{ h.horasUso }} hrs / Umbral: {{ h.umbralFatigaHoras }} hrs)
            </option>
          </select>
        </div>

        <!-- Respuesta del Servidor -->
        <div v-if="resultado" class="p-3 rounded text-xs" :class="resultado.exito ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-red-50 border border-red-200 text-red-900'">
          <span class="font-bold">{{ resultado.exito ? 'Despacho Exitoso:' : 'Fallo en la emisión:' }}</span>
          <p class="mt-0.5 font-mono text-[11px]">{{ resultado.mensaje }}</p>
        </div>

        <!-- Botones de Acción -->
        <div class="flex items-center justify-end space-x-3 pt-3 border-t border-bombero-border">
          <button
            type="button"
            @click="$emit('cerrar')"
            class="px-4 py-2 rounded-btn border border-bombero-border bg-white text-xs font-semibold text-bombero-text-secondary hover:bg-slate-50 transition-colors"
          >
            Cerrar
          </button>

          <button
            type="button"
            @click="dispararAlertaN8n"
            :disabled="enviando || !codigoSeleccionado"
            class="px-5 py-2 rounded-btn bg-amber-500 hover:bg-amber-600 text-neutral-900 text-xs font-bold flex items-center space-x-2 transition-colors disabled:opacity-50 shadow-sm"
          >
            <svg v-if="enviando" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{{ enviando ? 'Despachando...' : 'Emitir Webhook a n8n' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { apolloClient } from '../apollo/client';
import { EMITIR_ALERTA_N8N_MUTATION } from '../graphql/operations';

const props = withDefaults(
  defineProps<{
    abierto: boolean;
    insumosQuimicos: any[];
    herramientas?: any[];
  }>(),
  {
    herramientas: () => [],
  }
);

defineEmits<{
  (e: 'cerrar'): void;
}>();

const tipoAlerta = ref<'STOCK' | 'MANTENIMIENTO'>('STOCK');
const codigoSeleccionado = ref('');
const enviando = ref(false);
const resultado = ref<{ exito: boolean; mensaje: string } | null>(null);

function cambiarTipoAlerta(tipo: 'STOCK' | 'MANTENIMIENTO') {
  tipoAlerta.value = tipo;
  resultado.value = null;
  if (tipo === 'STOCK') {
    codigoSeleccionado.value = props.insumosQuimicos?.[0]?.codigo || '';
  } else {
    codigoSeleccionado.value = props.herramientas?.[0]?.codigo || '';
  }
}

watch(
  () => props.abierto,
  (val) => {
    if (val) {
      resultado.value = null;
      cambiarTipoAlerta(tipoAlerta.value);
    }
  }
);

async function dispararAlertaN8n() {
  if (!codigoSeleccionado.value) return;
  enviando.value = true;
  resultado.value = null;

  try {
    const { data } = await apolloClient.mutate({
      mutation: EMITIR_ALERTA_N8N_MUTATION,
      variables: { codigo: codigoSeleccionado.value },
    });

    resultado.value = {
      exito: data?.emitirAlertaQuiebreStockN8n?.exito ?? true,
      mensaje: data?.emitirAlertaQuiebreStockN8n?.mensaje ?? 'Webhook procesado.',
    };
  } catch (err: any) {
    resultado.value = {
      exito: false,
      mensaje: err.message || 'Error al conectar con el backend de MS-03.',
    };
  } finally {
    enviando.value = false;
  }
}
</script>
