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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h2 class="text-base font-bold tracking-wide">
            {{ modoRetorno ? 'RETORNO DE TALLER / CALIBRACIÓN' : 'DERIVAR A MANTENIMIENTO TÉCNICO' }}
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

      <!-- Alerta de Error en Validación / Servidor -->
      <div v-if="errorServidor" class="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-card text-xs text-red-900 flex items-start space-x-2">
        <svg class="w-4 h-4 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <div class="font-medium">
          <span class="font-bold">Error en la operación:</span> {{ errorServidor }}
        </div>
      </div>

      <!-- Cuerpo del Formulario -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Resumen del Ítem -->
        <div class="p-3 bg-slate-50 border border-bombero-border rounded-card text-xs space-y-1">
          <div class="flex items-center justify-between">
            <span class="text-bombero-text-secondary font-medium">Código:</span>
            <span class="font-mono font-bold text-bombero-text-primary">{{ item?.codigo }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-bombero-text-secondary font-medium">Recurso:</span>
            <span class="font-medium text-bombero-text-primary">{{ item?.nombre }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-bombero-text-secondary font-medium">Categoría:</span>
            <span class="font-mono uppercase text-bombero-text-primary">{{ item?.categoria }}</span>
          </div>
        </div>

        <!-- MODO RETORNO: CAMPOS DE CALIBRACIÓN -->
        <div v-if="modoRetorno" class="space-y-4">
          <!-- Si es EPP, pedir nueva presión -->
          <div v-if="item?.categoria === 'EPP'">
            <label class="block text-xs font-bold uppercase tracking-wider text-bombero-text-secondary mb-1">
              Nueva Presión de Carga (Bares) <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="formulario.nuevaPresion"
              type="number"
              min="200"
              max="350"
              step="5"
              required
              class="w-full px-3 py-2 font-mono text-xs border border-bombero-border rounded-btn bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-bombero-secondary"
            />
            <span class="text-[11px] text-emerald-700 mt-1 block font-medium">
              Recomendación de seguridad: 300 bares para cilindros de fibra de carbono.
            </span>
          </div>

          <!-- Si es Herramienta, opción de reiniciar horómetro -->
          <div v-if="item?.categoria === 'HERRAMIENTA'" class="space-y-2">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input
                v-model="formulario.reiniciarHoras"
                type="checkbox"
                class="w-4 h-4 text-bombero-secondary rounded border-gray-300 focus:ring-bombero-secondary"
              />
              <span class="text-xs font-bold text-bombero-text-primary">
                Reiniciar Horómetro Operativo a 0.0 hrs tras servicio preventivo
              </span>
            </label>
            <p class="text-[11px] text-bombero-text-muted">
              Al marcar esta casilla, el contador de horas de uso se reiniciará a cero y el equipo quedará en estado DISPONIBLE.
            </p>
          </div>
        </div>

        <!-- MODO ENVÍO A TALLER -->
        <div v-else class="space-y-2">
          <p class="text-xs text-bombero-text-secondary leading-relaxed">
            Se derivará este equipo al taller de mantenimiento preventivo y correctivo. Quedará bloqueado para asignación en el despacho de incidentes (MS-01) hasta su calibración.
          </p>
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
            class="px-5 py-2 rounded-btn bg-bombero-primary hover:bg-bombero-primary-hover text-white text-xs font-bold flex items-center space-x-2 transition-colors disabled:opacity-50 shadow-sm"
          >
            <svg v-if="enviando" class="w-4 h-4 animate-spin text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <svg v-else class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{{ enviando ? 'Procesando...' : (modoRetorno ? 'Registrar Retorno Calibrado' : 'Confirmar Derivación a Taller') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { apolloClient } from '../apollo/client';
import {
  CAMBIAR_ESTADO_ITEM_MUTATION,
  RETORNAR_DE_MANTENIMIENTO_MUTATION
} from '../graphql/operations';

const props = defineProps<{
  abierto: boolean;
  item: any;
  modoRetorno: boolean;
}>();

const emit = defineEmits<{
  (e: 'cerrar'): void;
  (e: 'actualizado'): void;
}>();

const enviando = ref(false);
const errorServidor = ref<string | null>(null);

const formulario = reactive({
  nuevaPresion: 300,
  reiniciarHoras: true,
});

watch(
  () => props.abierto,
  (val) => {
    if (val) {
      errorServidor.value = null;
      formulario.nuevaPresion = 300;
      formulario.reiniciarHoras = true;
    }
  }
);

function cerrarModal() {
  if (!enviando.value) {
    emit('cerrar');
  }
}

async function handleSubmit() {
  if (!props.item) return;
  errorServidor.value = null;
  enviando.value = true;

  try {
    if (props.modoRetorno) {
      // Retornar de mantenimiento
      const resp = await apolloClient.mutate({
        mutation: RETORNAR_DE_MANTENIMIENTO_MUTATION,
        variables: {
          codigo: props.item.codigo,
          categoria: props.item.categoria,
          nuevaPresion: props.item.categoria === 'EPP' ? Math.round(Number(formulario.nuevaPresion)) : null,
          reiniciarHoras: props.item.categoria === 'HERRAMIENTA' ? Boolean(formulario.reiniciarHoras) : null,
        },
      });

      if (resp.data?.retornarDeMantenimiento?.exito) {
        emit('actualizado');
        emit('cerrar');
      } else {
        errorServidor.value = resp.data?.retornarDeMantenimiento?.mensaje || 'Error al retornar de mantenimiento.';
      }
    } else {
      // Enviar a taller
      const resp = await apolloClient.mutate({
        mutation: CAMBIAR_ESTADO_ITEM_MUTATION,
        variables: {
          codigo: props.item.codigo,
          categoria: props.item.categoria,
          nuevoEstado: 'MANTENIMIENTO_REQUERIDO',
        },
      });

      if (resp.data?.cambiarEstadoItem?.exito) {
        emit('actualizado');
        emit('cerrar');
      } else {
        errorServidor.value = resp.data?.cambiarEstadoItem?.mensaje || 'Error al enviar a taller.';
      }
    }
  } catch (err: any) {
    errorServidor.value =
      err.graphQLErrors?.[0]?.message || err.message || 'Error de comunicación con el servidor.';
  } finally {
    enviando.value = false;
  }
}
</script>
