<template>
  <aside class="w-64 bg-bombero-dark text-slate-200 flex flex-col shrink-0 min-h-screen border-r border-neutral-800 shadow-xl select-none">
    <!-- Encabezado Institucional del Sidebar -->
    <div class="p-5 border-b border-neutral-800 flex items-center space-x-3">
      <div class="w-10 h-10 rounded bg-bombero-primary flex items-center justify-center text-white shadow-md shrink-0">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
      </div>
      <div class="overflow-hidden">
        <div class="flex items-center space-x-1.5">
          <span class="font-extrabold text-sm tracking-wider text-white">BOMBEROS SCZ</span>
       </div>
         <p class="text-[11px] text-slate-400 truncate">Logística & Almacén</p>
      </div>
    </div>

    <!-- Navegación Principal -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Menú Principal">
      <div class="px-3 pb-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
        Gestión Logística
      </div>

      <!-- Item 1: Dashboard -->
      <button
        type="button"
        @click="$emit('cambiarSeccion', 'dashboard')"
        :class="[
          'w-full flex items-center justify-between px-3.5 py-2.5 rounded-btn text-xs font-medium transition-colors text-left',
          seccionActiva === 'dashboard'
            ? 'bg-bombero-primary text-white font-bold shadow-sm'
            : 'text-slate-300 hover:bg-neutral-800 hover:text-white'
        ]"
      >
        <div class="flex items-center space-x-3">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span>Dashboard</span>
        </div>
      </button>

      <!-- Item 2: Inventario General -->
      <button
        type="button"
        @click="$emit('cambiarSeccion', 'inventario')"
        :class="[
          'w-full flex items-center justify-between px-3.5 py-2.5 rounded-btn text-xs font-medium transition-colors text-left',
          seccionActiva === 'inventario'
            ? 'bg-bombero-primary text-white font-bold shadow-sm'
            : 'text-slate-300 hover:bg-neutral-800 hover:text-white'
        ]"
      >
        <div class="flex items-center space-x-3">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>Inventario General</span>
        </div>
      </button>

      <!-- Item 3: Reservas SAGA -->
      <button
        type="button"
        @click="$emit('cambiarSeccion', 'saga')"
        :class="[
          'w-full flex items-center justify-between px-3.5 py-2.5 rounded-btn text-xs font-medium transition-colors text-left',
          seccionActiva === 'saga'
            ? 'bg-bombero-primary text-white font-bold shadow-sm'
            : 'text-slate-300 hover:bg-neutral-800 hover:text-white'
        ]"
      >
        <div class="flex items-center space-x-3">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Reservas SAGA</span>
        </div>
        <span
          v-if="reservasActivas > 0"
          class="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-400 text-neutral-900"
        >
          {{ reservasActivas }}
        </span>
      </button>

      <!-- Item 4: Movimientos -->
      <button
        type="button"
        @click="$emit('cambiarSeccion', 'movimientos')"
        :class="[
          'w-full flex items-center justify-between px-3.5 py-2.5 rounded-btn text-xs font-medium transition-colors text-left',
          seccionActiva === 'movimientos'
            ? 'bg-bombero-primary text-white font-bold shadow-sm'
            : 'text-slate-300 hover:bg-neutral-800 hover:text-white'
        ]"
      >
        <div class="flex items-center space-x-3">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <span>Movimientos</span>
        </div>
      </button>

      <!-- Item 5: Mantenimiento Preventivo -->
      <button
        type="button"
        @click="$emit('cambiarSeccion', 'mantenimiento')"
        :class="[
          'w-full flex items-center justify-between px-3.5 py-2.5 rounded-btn text-xs font-medium transition-colors text-left',
          seccionActiva === 'mantenimiento'
            ? 'bg-bombero-primary text-white font-bold shadow-sm'
            : 'text-slate-300 hover:bg-neutral-800 hover:text-white'
        ]"
      >
        <div class="flex items-center space-x-3">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Mantenimiento</span>
        </div>
        <span
          v-if="alertaMantenimiento > 0"
          class="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-red-600 text-white"
        >
          {{ alertaMantenimiento }}
        </span>
      </button>

      <!-- Sección de Automatización n8n -->
      <div class="pt-5 px-3 pb-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
        Automatización (n8n)
      </div>

      <button
        type="button"
        @click="$emit('abrirModalN8n')"
        class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-btn text-xs font-medium text-slate-300 hover:bg-neutral-800 hover:text-white transition-colors text-left border border-neutral-800 hover:border-neutral-700"
      >
        <div class="flex items-center space-x-3">
          <svg class="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Alerta Quiebre Stock</span>
        </div>
        <span class="text-[9px] font-mono text-slate-400 uppercase">Webhook</span>
      </button>
    </nav>

    <!-- Footer del Sidebar Minimalista -->
    <div class="p-3 border-t border-neutral-800 bg-neutral-900/40 text-[10px] text-slate-400 text-center font-mono">
      Cuerpo de Bomberos • Inventario
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  seccionActiva: string;
  alertaMantenimiento: number;
  reservasActivas: number;
  dbConectada: boolean;
}>();

defineEmits<{
  (e: 'cambiarSeccion', seccion: string): void;
  (e: 'abrirModalN8n'): void;
}>();
</script>
