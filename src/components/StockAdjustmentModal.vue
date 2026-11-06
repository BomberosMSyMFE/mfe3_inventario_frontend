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
      <div class="bg-bombero-secondary text-white px-6 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-2.5">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <h2 class="text-base font-bold tracking-wide">
            {{ tituloModal }}
          </h2>
        </div>
        <button
          @click="cerrarModal"
          :disabled="enviando"
          class="text-white/80 hover:text-white transition-colors p-1"
          aria-label="Cerrar modal"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Alerta de Error si ocurre -->
      <div v-if="errorServidor" class="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-card text-xs text-red-900 flex items-start space-x-2">
        <svg class="w-4 h-4 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <div class="font-medium">
          <span class="font-bold">Error:</span> {{ errorServidor }}
        </div>
      </div>

      <!-- Formulario de Ajuste -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4 text-xs">
        <!-- Tarjeta de Resumen del Ítem -->
        <div class="p-3 bg-slate-50 border border-bombero-border rounded-card text-xs space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-bombero-text-secondary font-medium">Recurso:</span>
            <span class="font-bold text-bombero-text-primary">{{ itemNombre || itemCodigo }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-bombero-text-secondary font-medium">Código:</span>
            <span class="font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">{{ itemCodigo }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-bombero-text-secondary font-medium">Estado / Valor Actual:</span>
            <span class="font-mono font-bold text-bombero-secondary">{{ valorActualTexto }}</span>
          </div>
        </div>

        <!-- 1. CASO HERRAMIENTA: REGISTRO DE HORAS -->
        <div v-if="esHerramienta" class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-bombero-text-secondary mb-1">
              Horas Trabajadas en el Incendio (+) <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model.number="formulario.cantidad"
                type="number"
                min="0.5"
                step="0.5"
                required
                class="w-full px-3 py-2 font-mono text-xs border border-bombero-border rounded-btn bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-bombero-secondary font-bold"
              />
              <span class="absolute right-3 top-2 text-[11px] font-bold text-slate-400">Horas</span>
            </div>
            <p class="mt-1 text-[11px] text-slate-500 flex items-start space-x-1.5">
              <svg class="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Estas horas se <strong>sumarán automáticamente</strong> a las horas actuales del equipo. La Inteligencia Artificial evaluará el desgaste y avisará a WhatsApp si requiere mantenimiento.</span>
            </p>
          </div>
        </div>

        <!-- 2. CASO EPP: LECTURA DEL MANÓMETRO -->
        <div v-else-if="esEpp" class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-bombero-text-secondary mb-1">
              Lectura del Manómetro de Oxígeno <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model.number="formulario.cantidad"
                type="number"
                min="0"
                max="350"
                step="5"
                required
                class="w-full px-3 py-2 font-mono text-xs border border-bombero-border rounded-btn bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-bombero-secondary font-bold"
              />
              <span class="absolute right-3 top-2 text-[11px] font-bold text-slate-400">Bares</span>
            </div>
            <p class="mt-1 text-[11px]" :class="formulario.cantidad >= 250 ? 'text-emerald-700' : 'text-amber-700'">
              {{ formulario.cantidad >= 250
                ? '✅ Presión óptima (>= 250 bares). El kit permanecerá DISPONIBLE para combate.'
                : '⚠️ Presión baja (< 250 bares). El sistema lo pasará a MANTENIMIENTO y te avisará por WhatsApp.'
              }}
            </p>
          </div>
        </div>

        <!-- 3. CASO QUÍMICO O GENÉRICO: ENTRADA / SALIDA -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-bombero-text-secondary mb-1">
              Acción de Almacén <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formulario.tipoMovimiento"
              class="w-full px-3 py-2 text-xs border border-bombero-border rounded-btn bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-bombero-secondary cursor-pointer"
            >
              <option value="SALIDA">Salida / Consumo en Emergencia</option>
              <option value="ENTRADA">Entrada / Reabastecimiento</option>
              <option value="MERMA_CADUCIDAD">Baja / Descarte por Caducidad</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-bombero-text-secondary mb-1">
              Cantidad en Litros <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model.number="formulario.cantidad"
                type="number"
                min="1"
                step="1"
                required
                class="w-full px-3 py-2 font-mono text-xs border border-bombero-border rounded-btn bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-bombero-secondary font-bold"
              />
              <span class="absolute right-3 top-2 text-[11px] font-bold text-slate-400">Litros</span>
            </div>
            <p class="mt-1 text-[10px] text-slate-500">
              Si el stock restante queda en &le; 200 Litros, n8n emitirá la alerta automática.
            </p>
          </div>
        </div>

        <!-- Motivo -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-bombero-text-secondary mb-1">
            Motivo de la Operación <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formulario.motivo"
            type="text"
            required
            placeholder="Ej: Retorno tras atención de incendio forestal"
            class="w-full px-3 py-2 text-xs border border-bombero-border rounded-btn bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-bombero-secondary"
          />
        </div>

        <!-- Responsable -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-bombero-text-secondary mb-1">
            Oficial Responsable <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formulario.responsable"
            type="text"
            required
            class="w-full px-3 py-2 text-xs border border-bombero-border rounded-btn bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-bombero-secondary"
          />
        </div>

        <!-- Botones de Acción -->
        <div class="flex items-center justify-end space-x-3 pt-4 border-t border-bombero-border">
          <button
            type="button"
            @click="cerrarModal"
            :disabled="enviando"
            class="px-4 py-2 rounded-btn border border-bombero-border bg-white text-xs font-semibold text-bombero-text-secondary hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            :disabled="enviando"
            class="px-5 py-2 rounded-btn bg-bombero-secondary hover:bg-black text-white text-xs font-bold flex items-center space-x-2 transition-colors disabled:opacity-50 shadow-sm"
          >
            <svg v-if="enviando" class="w-4 h-4 animate-spin text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <svg v-else class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{{ enviando ? 'Guardando...' : 'Confirmar Ajuste' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue';
import { apolloClient } from '../apollo/client';
import { REGISTRAR_MOVIMIENTO_STOCK_MUTATION } from '../graphql/operations';

const props = defineProps<{
  abierto: boolean;
  itemCodigo: string;
  itemNombre?: string;
  categoria?: string;
  itemActual?: any;
}>();

const emit = defineEmits<{
  (e: 'cerrar'): void;
  (e: 'ajustado'): void;
}>();

const enviando = ref(false);
const errorServidor = ref<string | null>(null);

const esHerramienta = computed(() => {
  return props.categoria === 'HERRAMIENTA' || props.itemCodigo?.startsWith('MOTO-') || props.itemCodigo?.startsWith('HERR-');
});

const esEpp = computed(() => {
  return props.categoria === 'EPP' || props.itemCodigo?.startsWith('KIT-');
});

const tituloModal = computed(() => {
  if (esHerramienta.value) return 'REGISTRAR HORAS DE USO / OPERACIÓN';
  if (esEpp.value) return 'REVISIÓN DE PRESIÓN DE OXÍGENO';
  return 'AJUSTE DE STOCK OPERATIVO';
});

const valorActualTexto = computed(() => {
  if (!props.itemActual) return '—';
  if (esHerramienta.value) {
    return `${props.itemActual.horasUso || 0} Horas acumuladas (Límite: ${props.itemActual.umbralFatigaHoras || 200}h)`;
  }
  if (esEpp.value) {
    return `${props.itemActual.presionOxigenoBares || 0} Bares de Oxígeno`;
  }
  return `${props.itemActual.litrosDisponibles || 0} Litros Disponibles`;
});

const formulario = reactive({
  tipoMovimiento: 'SALIDA',
  cantidad: 5,
  motivo: '',
  responsable: 'Jefa de Logística Jael Sandoval',
});

watch(
  () => props.abierto,
  (val) => {
    if (val) {
      errorServidor.value = null;
      if (esHerramienta.value) {
        formulario.tipoMovimiento = 'SALIDA';
        formulario.cantidad = 4;
        formulario.motivo = 'Horas acumuladas tras atención de incendio';
      } else if (esEpp.value) {
        formulario.tipoMovimiento = 'AJUSTE_AUDITORIA';
        formulario.cantidad = props.itemActual?.presionOxigenoBares ?? 240;
        formulario.motivo = 'Inspección de manómetro post-incidente';
      } else {
        formulario.tipoMovimiento = 'SALIDA';
        formulario.cantidad = 50;
        formulario.motivo = 'Consumo en cisterna para extinción de incendio';
      }
    }
  }
);

function cerrarModal() {
  if (!enviando.value) {
    emit('cerrar');
  }
}

async function handleSubmit() {
  errorServidor.value = null;
  enviando.value = true;

  try {
    const resp = await apolloClient.mutate({
      mutation: REGISTRAR_MOVIMIENTO_STOCK_MUTATION,
      variables: {
        itemCodigo: props.itemCodigo,
        tipoMovimiento: formulario.tipoMovimiento,
        cantidad: Number(formulario.cantidad),
        motivo: formulario.motivo.trim(),
        responsable: formulario.responsable.trim(),
      },
    });

    if (resp.data?.registrarMovimientoStock?.exito) {
      emit('ajustado');
      cerrarModal();
    } else {
      errorServidor.value = resp.data?.registrarMovimientoStock?.mensaje || 'No se pudo registrar el ajuste.';
    }
  } catch (err: any) {
    console.error('Error al registrar ajuste de stock:', err);
    errorServidor.value = err.message || 'Error de conexión con el servidor.';
  } finally {
    enviando.value = false;
  }
}
</script>
