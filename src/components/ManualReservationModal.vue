<template>
  <div v-if="abierto" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div class="relative bg-white rounded-card shadow-2xl border border-bombero-border max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <!-- Encabezado del Modal -->
      <div class="px-6 py-4 bg-bombero-dark text-white flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-bombero-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 class="text-sm font-bold uppercase tracking-wide">
            Simulador de Reserva SAGA (Paso 2 Despacho)
          </h3>
        </div>
        <button
          @click="cerrar"
          class="text-slate-400 hover:text-white transition-colors"
          title="Cerrar modal"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Banner de Error del Servidor (Regla 7.2: Modal NO se cierra en error) -->
      <div v-if="errorServidor" class="mx-6 mt-4 p-3 rounded bg-red-50 border border-red-200 text-red-800 text-xs flex items-start space-x-2">
        <svg class="w-4 h-4 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div>
          <span class="font-bold">Rechazo de Reserva en Almacén:</span>
          <p class="mt-0.5">{{ errorServidor }}</p>
        </div>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4 text-xs">
        <!-- Campo Incidente ID -->
        <div>
          <label class="block font-semibold text-bombero-text-secondary uppercase text-[11px] mb-1">
            Identificador del Incidente (ID) *
          </label>
          <input
            v-model="formulario.incidenteId"
            type="text"
            placeholder="Ej: INC-2026-SCZ-101"
            :class="errores.incidenteId ? 'border-red-600 bg-red-50 text-red-900' : 'border-bombero-border bg-white text-bombero-text-primary'"
            class="w-full px-3 py-2 rounded-btn border font-mono text-xs focus:outline-none focus:border-bombero-primary"
          />
          <p v-if="errores.incidenteId" class="text-red-600 text-[11px] mt-1 font-medium">
            {{ errores.incidenteId }}
          </p>
        </div>

        <!-- Campo Camión ID -->
        <div>
          <label class="block font-semibold text-bombero-text-secondary uppercase text-[11px] mb-1">
            Unidad / Camión Asignado *
          </label>
          <input
            v-model="formulario.camionId"
            type="text"
            placeholder="Ej: B-04-SCZ"
            :class="errores.camionId ? 'border-red-600 bg-red-50 text-red-900' : 'border-bombero-border bg-white text-bombero-text-primary'"
            class="w-full px-3 py-2 rounded-btn border font-mono text-xs focus:outline-none focus:border-bombero-primary"
          />
          <p v-if="errores.camionId" class="text-red-600 text-[11px] mt-1 font-medium">
            {{ errores.camionId }}
          </p>
        </div>

        <!-- Campo Litros Espumógeno -->
        <div>
          <label class="block font-semibold text-bombero-text-secondary uppercase text-[11px] mb-1">
            Litros de Espumógeno AFFF Requeridos *
          </label>
          <input
            v-model.number="formulario.litrosEspumogeno"
            type="number"
            step="10"
            min="0"
            placeholder="Ej: 150.0"
            :class="errores.litrosEspumogeno ? 'border-red-600 bg-red-50 text-red-900' : 'border-bombero-border bg-white text-bombero-text-primary'"
            class="w-full px-3 py-2 rounded-btn border font-mono text-xs focus:outline-none focus:border-bombero-primary"
          />
          <p v-if="errores.litrosEspumogeno" class="text-red-600 text-[11px] mt-1 font-medium">
            {{ errores.litrosEspumogeno }}
          </p>
        </div>

        <div class="bg-slate-50 p-3 rounded border border-bombero-border text-[11px] text-bombero-text-secondary space-y-1">
          <p class="font-bold text-bombero-text-primary">Comportamiento Interno en MS-03:</p>
          <ul class="list-disc list-inside space-y-0.5">
            <li>Verifica existencia de Kit EPP con presi&oacute;n &ge; 250 bares.</li>
            <li>Descuenta autom&aacute;ticamente el volumen de espum&oacute;geno.</li>
            <li>Crea un registro de auditor&iacute;a en el ledger SAGA.</li>
          </ul>
        </div>

        <!-- Acciones del Modal -->
        <div class="pt-3 border-t border-bombero-border flex items-center justify-end space-x-2">
          <button
            type="button"
            @click="cerrar"
            class="px-4 py-2 rounded-btn border border-bombero-border text-bombero-text-secondary hover:bg-slate-50 font-semibold text-xs transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="cargando"
            class="px-5 py-2 rounded-btn bg-bombero-primary hover:bg-bombero-primary-hover text-white font-bold text-xs flex items-center space-x-1.5 transition-colors disabled:opacity-50"
          >
            <svg v-if="cargando" class="animate-spin w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Ejecutar Mutación SAGA</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';

const props = defineProps<{
  abierto: boolean;
  cargando?: boolean;
  errorServidor?: string | null;
}>();

const emit = defineEmits<{
  (e: 'cerrar'): void;
  (e: 'reservar', payload: { incidenteId: string; camionId: string; litrosEspumogeno: number }): void;
}>();

const formulario = reactive({
  incidenteId: 'INC-2026-SCZ-101',
  camionId: 'B-04-SCZ',
  litrosEspumogeno: 150.0,
});

const errores = reactive({
  incidenteId: '',
  camionId: '',
  litrosEspumogeno: '',
});

watch(() => props.abierto, (val) => {
  if (val) {
    errores.incidenteId = '';
    errores.camionId = '';
    errores.litrosEspumogeno = '';
  }
});

function validar(): boolean {
  let valido = true;
  errores.incidenteId = '';
  errores.camionId = '';
  errores.litrosEspumogeno = '';

  if (!formulario.incidenteId.trim()) {
    errores.incidenteId = 'El código del incidente es obligatorio.';
    valido = false;
  }
  if (!formulario.camionId.trim()) {
    errores.camionId = 'La unidad vehicular asignada es obligatoria.';
    valido = false;
  }
  if (formulario.litrosEspumogeno === null || formulario.litrosEspumogeno === undefined || formulario.litrosEspumogeno < 0) {
    errores.litrosEspumogeno = 'Especifique un volumen válido en litros (>= 0).';
    valido = false;
  }
  return valido;
}

function handleSubmit() {
  if (!validar()) return;
  emit('reservar', {
    incidenteId: formulario.incidenteId.trim(),
    camionId: formulario.camionId.trim(),
    litrosEspumogeno: Number(formulario.litrosEspumogeno),
  });
}

function cerrar() {
  emit('cerrar');
}
</script>
