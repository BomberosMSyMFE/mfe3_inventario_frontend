<template>
  <div
    v-if="abierto"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto"
  >
    <div
      class="bg-bombero-surface border border-bombero-border rounded-card w-full max-w-xl shadow-xl overflow-hidden my-8"
      role="dialog"
      aria-modal="true"
    >
      <!-- Cabecera del Modal -->
      <div class="bg-bombero-secondary text-white px-6 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-2.5">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <h2 class="text-base font-bold tracking-wide">
            REGISTRAR NUEVO RECURSO EN ALMACÉN
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

      <!-- Selector de Categoría -->
      <div class="p-6 pb-2">
        <label class="block text-xs font-bold uppercase tracking-wider text-bombero-text-secondary mb-2">
          ¿Qué tipo de recurso deseas ingresar? <span class="text-red-500">*</span>
        </label>
        <div class="grid grid-cols-3 gap-2">
          <button
            type="button"
            @click="seleccionarCategoria('QUIMICO')"
            :class="[
              'px-3 py-2.5 rounded-btn text-xs font-bold border transition-colors flex items-center justify-center space-x-1.5',
              categoria === 'QUIMICO'
                ? 'bg-bombero-secondary text-white border-bombero-secondary shadow-sm'
                : 'bg-white text-bombero-text-secondary border-bombero-border hover:bg-slate-50'
            ]"
          >
            <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <span>Insumo Químico</span>
          </button>

          <button
            type="button"
            @click="seleccionarCategoria('EPP')"
            :class="[
              'px-3 py-2.5 rounded-btn text-xs font-bold border transition-colors flex items-center justify-center space-x-1.5',
              categoria === 'EPP'
                ? 'bg-bombero-secondary text-white border-bombero-secondary shadow-sm'
                : 'bg-white text-bombero-text-secondary border-bombero-border hover:bg-slate-50'
            ]"
          >
            <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Kit EPP / Oxígeno</span>
          </button>

          <button
            type="button"
            @click="seleccionarCategoria('HERRAMIENTA')"
            :class="[
              'px-3 py-2.5 rounded-btn text-xs font-bold border transition-colors flex items-center justify-center space-x-1.5',
              categoria === 'HERRAMIENTA'
                ? 'bg-bombero-secondary text-white border-bombero-secondary shadow-sm'
                : 'bg-white text-bombero-text-secondary border-bombero-border hover:bg-slate-50'
            ]"
          >
            <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Herramienta</span>
          </button>
        </div>
      </div>

      <!-- Alerta de Error si ocurre -->
      <div v-if="errorServidor" class="mx-6 mt-2 p-3 bg-red-50 border border-red-200 rounded-card text-xs text-red-900 flex items-start space-x-2">
        <svg class="w-4 h-4 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <div class="font-medium">
          <span class="font-bold">Error al registrar:</span> {{ errorServidor }}
        </div>
      </div>

      <!-- Formulario Simplificado -->
      <form @submit.prevent="handleSubmit" class="p-6 pt-3 space-y-4 text-xs">
        <!-- Código Automático y Estación -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-bold uppercase tracking-wider text-bombero-text-secondary">
                Código del Ítem <span class="text-red-500">*</span>
              </label>
              <span class="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                Auto-generado
              </span>
            </div>
            <div class="flex space-x-1.5">
              <input
                v-model="formulario.codigo"
                type="text"
                required
                class="w-full px-3 py-2 font-mono text-xs border border-bombero-border rounded-btn bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-bombero-secondary uppercase font-bold text-slate-800"
              />
              <button
                type="button"
                @click="autoAsignarCodigo"
                class="px-2.5 py-1 text-slate-600 bg-slate-100 hover:bg-slate-200 border border-bombero-border rounded-btn text-xs font-bold flex items-center justify-center cursor-pointer"
                title="Regenerar siguiente código"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-bombero-text-secondary mb-1">
              Estación / Sede <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formulario.estacionId"
              class="w-full px-3 py-2 text-xs border border-bombero-border rounded-btn bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-bombero-secondary cursor-pointer"
            >
              <option value="EST-01">EST-01: Estación Central Centro</option>
              <option value="EST-02">EST-02: Estación Norte Parque Industrial</option>
            </select>
          </div>
        </div>

        <!-- 1. CAMPOS PARA QUÍMICO -->
        <div v-if="categoria === 'QUIMICO'" class="space-y-3 border-t border-bombero-border pt-3">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-bombero-text-secondary mb-1">
              Nombre del Insumo Químico <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formulario.nombre"
              type="text"
              required
              placeholder="Ej: Espuma Fluorosintética AFFF 3%"
              class="w-full px-3 py-2 text-xs border border-bombero-border rounded-btn bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-bombero-secondary"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-bombero-text-secondary mb-1">
                Tipo de Agente <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formulario.tipoQuimico"
                class="w-full px-3 py-2 text-xs border border-bombero-border rounded-btn bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-bombero-secondary cursor-pointer"
              >
                <option value="ESPUMOGENO_AFFF">Espumógeno AFFF (Hidrocarburos)</option>
                <option value="RETARDANTE_FORESTAL">Retardante Forestal</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-bombero-text-secondary mb-1">
                Litros Iniciales <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="formulario.litrosDisponibles"
                type="number"
                min="0"
                step="1"
                required
                class="w-full px-3 py-2 font-mono text-xs border border-bombero-border rounded-btn bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-bombero-secondary"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-bombero-text-secondary mb-1">
                Lote de Fabricación <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formulario.lote"
                type="text"
                required
                class="w-full px-3 py-2 font-mono text-xs border border-bombero-border rounded-btn bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-bombero-secondary uppercase"
              />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-bombero-text-secondary mb-1">
                Fecha de Vencimiento <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formulario.fechaCaducidad"
                type="date"
                required
                class="w-full px-3 py-2 text-xs border border-bombero-border rounded-btn bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-bombero-secondary cursor-pointer"
              />
            </div>
          </div>
        </div>

        <!-- 2. CAMPOS PARA KIT EPP (OXÍGENO) -->
        <div v-if="categoria === 'EPP'" class="space-y-3 border-t border-bombero-border pt-3">
          <div class="p-3 bg-slate-50 border border-slate-200 rounded text-slate-700 space-y-1">
            <p class="font-bold">¿Qué es un Kit EPP?</p>
            <p class="text-[11px] leading-relaxed">
              Es el <strong>Equipo de Respiración Autónoma (ERA)</strong> completo para 1 bombero: Cilindro de oxígeno comprimido, máscara panorámica con válvula y arnés con manómetro.
            </p>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-bold uppercase tracking-wider text-bombero-text-secondary">
                Presión del Tanque (Bares) <span class="text-red-500">*</span>
              </label>
              <span class="font-mono text-xs font-bold" :class="formulario.presionOxigenoBares >= 250 ? 'text-emerald-700' : 'text-red-600'">
                {{ formulario.presionOxigenoBares }} BARES
              </span>
            </div>
            <input
              v-model.number="formulario.presionOxigenoBares"
              type="number"
              min="0"
              max="350"
              step="5"
              required
              class="w-full px-3 py-2 font-mono text-xs border border-bombero-border rounded-btn bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-bombero-secondary font-bold"
            />
            <p class="mt-1 text-[11px]" :class="formulario.presionOxigenoBares >= 250 ? 'text-emerald-700' : 'text-amber-700'">
              {{ formulario.presionOxigenoBares >= 250
                ? '✅ Presión óptima y segura (>= 250 bares). Listo para combate.'
                : '⚠️ Presión baja (< 250 bares). El sistema lo marcará en MANTENIMIENTO para recarga.'
              }}
            </p>
          </div>
        </div>

        <!-- 3. CAMPOS PARA HERRAMIENTA / MAQUINARIA -->
        <div v-if="categoria === 'HERRAMIENTA'" class="space-y-3 border-t border-bombero-border pt-3">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-bombero-text-secondary mb-1">
              Nombre de la Herramienta o Maquinaria <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formulario.nombre"
              type="text"
              required
              placeholder="Ej: Motobomba Forestal Mark-3"
              class="w-full px-3 py-2 text-xs border border-bombero-border rounded-btn bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-bombero-secondary"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-bombero-text-secondary mb-1">
                Tipo <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formulario.tipoHerramienta"
                class="w-full px-3 py-2 text-xs border border-bombero-border rounded-btn bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-bombero-secondary cursor-pointer"
              >
                <option value="MOTOBOMBA">Motobomba</option>
                <option value="MOTOSIERRA">Motosierra</option>
                <option value="MANGUERA">Manguera Alta Presión</option>
                <option value="GENERADOR">Generador Eléctrico</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-bombero-text-secondary mb-1">
                Horas Iniciales <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="formulario.horasUso"
                type="number"
                min="0"
                step="1"
                required
                class="w-full px-3 py-2 font-mono text-xs border border-bombero-border rounded-btn bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-bombero-secondary"
              />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-bombero-text-secondary mb-1">
                Límite de Fatiga (Horas) <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="formulario.umbralFatigaHoras"
                type="number"
                min="10"
                step="10"
                required
                class="w-full px-3 py-2 font-mono text-xs border border-bombero-border rounded-btn bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-bombero-secondary"
              />
            </div>
          </div>
          <p class="text-[11px] text-slate-500">
            La Inteligencia Artificial vigilará las horas de trabajo respecto al límite de fatiga para programar mantenimientos preventivos.
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
            <span>{{ enviando ? 'Guardando...' : 'Guardar Ítem' }}</span>
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
  REGISTRAR_INSUMO_QUIMICO_MUTATION,
  REGISTRAR_KIT_EPP_MUTATION,
  REGISTRAR_HERRAMIENTA_MUTATION
} from '../graphql/operations';

const props = withDefaults(
  defineProps<{
    abierto: boolean;
    itemsExistentes?: any[];
  }>(),
  {
    itemsExistentes: () => [],
  }
);

const emit = defineEmits<{
  (e: 'cerrar'): void;
  (e: 'guardado', item: any): void;
}>();

const categoria = ref<'QUIMICO' | 'EPP' | 'HERRAMIENTA'>('QUIMICO');
const enviando = ref(false);
const errorServidor = ref<string | null>(null);

const formulario = reactive({
  codigo: '',
  nombre: '',
  estacionId: 'EST-01',
  tipoQuimico: 'ESPUMOGENO_AFFF',
  litrosDisponibles: 250,
  lote: 'LT-2026-01',
  fechaCaducidad: '2027-12-31',
  presionOxigenoBares: 300,
  tipoHerramienta: 'MOTOBOMBA',
  horasUso: 0,
  umbralFatigaHoras: 200,
});

function calcularSiguienteCodigo(cat: 'QUIMICO' | 'EPP' | 'HERRAMIENTA') {
  const items = props.itemsExistentes || [];
  if (cat === 'QUIMICO') {
    const quimicos = items.filter((i) => i.categoria === 'QUIMICO' || i.codigo?.startsWith('QUIM-'));
    return `QUIM-${String(quimicos.length + 1).padStart(2, '0')}`;
  } else if (cat === 'EPP') {
    const kits = items.filter((i) => i.categoria === 'EPP' || i.codigo?.startsWith('KIT-'));
    return `KIT-EPP-${String(kits.length + 1).padStart(2, '0')}`;
  } else {
    const herrs = items.filter((i) => i.categoria === 'HERRAMIENTA' || i.codigo?.startsWith('HERR-') || i.codigo?.startsWith('MOTO-'));
    return `HERR-${String(herrs.length + 1).padStart(2, '0')}`;
  }
}

function autoAsignarCodigo() {
  formulario.codigo = calcularSiguienteCodigo(categoria.value);
}

function seleccionarCategoria(cat: 'QUIMICO' | 'EPP' | 'HERRAMIENTA') {
  categoria.value = cat;
  autoAsignarCodigo();

  if (cat === 'QUIMICO') {
    formulario.nombre = 'Espuma Fluorosintética AFFF 3%';
    formulario.litrosDisponibles = 250;
    formulario.lote = `LT-2026-${Math.floor(Math.random() * 90 + 10)}`;
    formulario.fechaCaducidad = '2027-12-31';
  } else if (cat === 'EPP') {
    formulario.nombre = `Kit Autónomo de Protección ERA (${formulario.codigo})`;
    formulario.presionOxigenoBares = 300;
  } else {
    formulario.nombre = 'Motobomba Forestal de Caudal Alto';
    formulario.tipoHerramienta = 'MOTOBOMBA';
    formulario.horasUso = 0;
    formulario.umbralFatigaHoras = 200;
  }
}

watch(
  () => props.abierto,
  (val) => {
    if (val) {
      errorServidor.value = null;
      seleccionarCategoria(categoria.value);
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
    let resp: any = null;

    if (categoria.value === 'QUIMICO') {
      resp = await apolloClient.mutate({
        mutation: REGISTRAR_INSUMO_QUIMICO_MUTATION,
        variables: {
          codigo: formulario.codigo.trim().toUpperCase(),
          nombre: formulario.nombre.trim(),
          tipo: formulario.tipoQuimico,
          litrosDisponibles: Number(formulario.litrosDisponibles),
          lote: formulario.lote.trim().toUpperCase(),
          fechaCaducidad: formulario.fechaCaducidad,
          estacionId: formulario.estacionId,
        },
      });
      emit('guardado', resp?.data?.registrarInsumoQuimico);
    } else if (categoria.value === 'EPP') {
      resp = await apolloClient.mutate({
        mutation: REGISTRAR_KIT_EPP_MUTATION,
        variables: {
          codigo: formulario.codigo.trim().toUpperCase(),
          presionOxigenoBares: Number(formulario.presionOxigenoBares),
          estacionId: formulario.estacionId,
        },
      });
      emit('guardado', resp?.data?.registrarKitEPP);
    } else if (categoria.value === 'HERRAMIENTA') {
      resp = await apolloClient.mutate({
        mutation: REGISTRAR_HERRAMIENTA_MUTATION,
        variables: {
          codigo: formulario.codigo.trim().toUpperCase(),
          nombre: formulario.nombre.trim(),
          tipo: formulario.tipoHerramienta,
          horasUso: Number(formulario.horasUso),
          umbralFatigaHoras: Number(formulario.umbralFatigaHoras),
          estacionId: formulario.estacionId,
        },
      });
      emit('guardado', resp?.data?.registrarHerramienta);
    }

    cerrarModal();
  } catch (err: any) {
    console.error('Error al registrar nuevo recurso:', err);
    errorServidor.value = err.message || 'Error en el servidor al guardar el ítem.';
  } finally {
    enviando.value = false;
  }
}
</script>
