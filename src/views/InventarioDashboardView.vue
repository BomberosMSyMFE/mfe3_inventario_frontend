<template>
  <div class="flex h-screen bg-bombero-bg text-bombero-text-primary overflow-hidden font-sans">
    <!-- 1. SIDEBAR IZQUIERDO FIJO Y MODERNO -->
    <AppSidebar
      :seccionActiva="seccionActiva"
      :alertaMantenimiento="kpis.equiposMantenimiento"
      :reservasActivas="kpis.reservasActivas"
      :dbConectada="!errorGeneral"
      @cambiarSeccion="seccionActiva = $event"
      @abrirModalN8n="modalN8nAbierto = true"
    />

    <!-- 2. CONTENEDOR PRINCIPAL CON HEADER SUPERIOR Y SCROLL VERTICAL -->
    <div class="flex-1 flex flex-col min-w-0 overflow-y-auto">
      <!-- HEADER SUPERIOR MINIMALISTA -->
      <AppHeader
        :seccionActiva="seccionActiva"
        :estacionSeleccionada="estacionSeleccionada"
        :cargando="cargando"
        @abrirRegistro="modalRegistroAbierto = true"
      />

      <!-- ÁREA DE CONTENIDO PRINCIPAL -->
      <main class="flex-1 p-6 lg:p-8 space-y-6">
        <!-- Banner de Alerta en caso de Error de Conexión -->
        <div
          v-if="errorGeneral"
          class="p-4 rounded-card bg-red-50 border border-red-200 text-red-900 text-xs flex items-center justify-between shadow-xs"
        >
          <div class="flex items-center space-x-2.5">
            <svg class="w-5 h-5 text-red-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <div>
              <span class="font-bold">Error de Conexión GraphQL (Puerto 8003):</span>
              <p class="mt-0.5 text-red-800 font-mono">{{ errorGeneral }}</p>
            </div>
          </div>
          <button
            @click="recargarTodo"
            class="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-900 font-bold rounded text-[11px] transition-colors"
          >
            Reintentar
          </button>
        </div>

        <!-- ============================================================= -->
        <!-- VISTA 1: DASHBOARD PRINCIPAL DE RESUMEN LOGÍSTICO             -->
        <!-- ============================================================= -->
        <section v-if="seccionActiva === 'dashboard'" class="space-y-6">
          <!-- FILA DE TARJETAS MÉTRICAS SUPERIORES -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <!-- Métrica 1: Kits EPP Seguros -->
            <div class="bg-bombero-surface p-4 rounded-card border border-bombero-border shadow-xs flex items-center justify-between">
              <div>
                <span class="text-[11px] uppercase font-bold text-bombero-text-secondary tracking-wider block">
                  Kits EPP Seguros
                </span>
                <div class="font-mono text-2xl font-extrabold text-emerald-700 mt-1">
                  {{ kpis.kitsSeguros }} / {{ kpis.totalKits }}
                </div>
                <span class="text-[11px] text-emerald-700 font-medium mt-0.5 block">&ge; 250 Bares (NFPA)</span>
              </div>
              <div class="w-10 h-10 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>

            <!-- Métrica 2: Químicos Extintores -->
            <div class="bg-bombero-surface p-4 rounded-card border border-bombero-border shadow-xs flex items-center justify-between">
              <div>
                <span class="text-[11px] uppercase font-bold text-bombero-text-secondary tracking-wider block">
                  Agentes Químicos
                </span>
                <div class="font-mono text-2xl font-extrabold text-blue-700 mt-1">
                  {{ formatDecimal(kpis.totalQuimicosLitros) }} L
                </div>
                <span class="text-[11px] text-blue-700 font-medium mt-0.5 block">Espumógeno & Retardante</span>
              </div>
              <div class="w-10 h-10 rounded bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            </div>

            <!-- Métrica 3: Maquinaria y Herramientas -->
            <div class="bg-bombero-surface p-4 rounded-card border border-bombero-border shadow-xs flex items-center justify-between">
              <div>
                <span class="text-[11px] uppercase font-bold text-bombero-text-secondary tracking-wider block">
                  Maquinaria Operativa
                </span>
                <div class="font-mono text-2xl font-extrabold text-slate-800 mt-1">
                  {{ kpis.totalHerramientas }}
                </div>
                <span class="text-[11px] text-slate-600 font-medium mt-0.5 block">Motobombas & Equipos</span>
              </div>
              <div class="w-10 h-10 rounded bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200 shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>

            <!-- Métrica 4: Equipos en Taller -->
            <div class="bg-bombero-surface p-4 rounded-card border border-bombero-border shadow-xs flex items-center justify-between">
              <div>
                <span class="text-[11px] uppercase font-bold text-red-800 tracking-wider block">
                  En Mantenimiento
                </span>
                <div class="font-mono text-2xl font-extrabold text-red-600 mt-1">
                  {{ kpis.equiposMantenimiento }}
                </div>
                <span class="text-[11px] text-red-700 font-medium mt-0.5 block">Fatiga o Cilindro &lt; 250</span>
              </div>
              <div class="w-10 h-10 rounded bg-red-50 text-red-600 flex items-center justify-center border border-red-200 shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>

            <!-- Métrica 5: Reservas SAGA Activas (Destacada) -->
            <div class="bg-bombero-surface p-4 rounded-card border-2 border-amber-300 shadow-xs flex items-center justify-between bg-amber-50/20">
              <div>
                <span class="text-[11px] uppercase font-bold text-amber-900 tracking-wider block">
                  Reservas SAGA Activas
                </span>
                <div class="font-mono text-2xl font-extrabold text-amber-700 mt-1">
                  {{ kpis.reservasActivas }}
                </div>
                <span class="text-[11px] text-amber-800 font-medium mt-0.5 block">Enlace MS-01 & MS-02</span>
              </div>
              <div class="w-10 h-10 rounded bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-300 shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- INDICADOR DESTACADO: ENLACE SAGA DISTRIBUIDO -->
          <div class="p-4 bg-amber-500/10 border border-amber-200 rounded-card flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center space-x-3.5">
              <div class="w-9 h-9 rounded bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 class="text-xs font-bold text-amber-950 uppercase tracking-wide">
                  Participante SAGA: Orquestación con MS-01 (Comandancia)
                </h4>
                <p class="text-[11px] text-amber-800">
                  Las reservas de kits y espumógeno se ejecutan atómicamente cuando el orquestador de despacho emite la orden de salida.
                </p>
              </div>
            </div>

            <div class="flex items-center space-x-3">
              <button
                @click="seccionActiva = 'saga'"
                class="px-3.5 py-1.5 rounded-btn bg-white border border-amber-300 text-amber-900 hover:bg-amber-50 text-xs font-bold transition-colors cursor-pointer"
              >
                Ver Ledger SAGA
              </button>
            </div>
          </div>

          <!-- SECCIÓN: MANÓMETROS DE OXÍGENO Y MANTENIMIENTO PREDICTIVO IA -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Columna Izquierda: Kits EPP con Presión Real -->
            <div class="lg:col-span-2 bg-bombero-surface p-5 rounded-card border border-bombero-border shadow-xs">
              <div class="flex items-center justify-between border-b border-bombero-border pb-3 mb-4">
                <div class="flex items-center space-x-2">
                  <div class="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
                  <h3 class="text-xs font-bold uppercase tracking-wider text-bombero-text-primary">
                    Manómetros de Oxígeno EPP (Regla &ge; 250 Bar)
                  </h3>
                </div>
                <span class="text-[11px] font-mono text-bombero-text-secondary">
                  Monitoreo de Seguridad de Vida
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <OxygenPressureGauge
                  v-for="kit in kitsEppSede"
                  :key="kit.id"
                  :codigo="kit.codigo"
                  :bares="kit.presionOxigenoBares"
                  :esSeguro="kit.esSeguroParaCombate"
                  :estado="kit.estado"
                  :camionAsignadoId="kit.camionAsignadoId"
                />
              </div>

              <div v-if="kitsEppSede.length === 0" class="py-8 text-center text-xs text-bombero-text-muted">
                No hay kits registrados actualmente.
              </div>
            </div>

            <!-- Columna Derecha: Control de Horas y Notificaciones Automáticas n8n -->
            <div class="space-y-4">
              <!-- Card 1: Control de Horas de Trabajo (Herramientas & Maquinaria) -->
              <div class="bg-bombero-surface p-4 rounded-card border border-bombero-border shadow-xs space-y-3">
                <div class="flex items-center justify-between border-b border-bombero-border pb-2.5">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-slate-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h4 class="text-xs font-bold uppercase tracking-wider text-bombero-text-primary">
                      Horómetros de Herramientas
                    </h4>
                  </div>
                  <span class="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-100 text-slate-700 border border-slate-300 font-bold">
                    Control de Uso
                  </span>
                </div>

                <p class="text-[11px] text-slate-600 leading-relaxed">
                  Seguimiento de horas trabajadas para programar cambio de aceite, afilado y service antes de que fallen en un incendio.
                </p>

                <div class="space-y-2.5">
                  <div
                    v-for="h in herramientasSede.slice(0, 3)"
                    :key="h.id"
                    class="p-2.5 rounded border border-slate-200 bg-slate-50/70 space-y-1.5"
                  >
                    <div class="flex items-center justify-between">
                      <span class="font-bold text-[11px] text-slate-800 truncate max-w-[170px]" :title="h.nombre">
                        {{ h.nombre }}
                      </span>
                      <span
                        class="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase border flex items-center space-x-1"
                        :class="h.horasUso >= h.umbralFatigaHoras || h.estado.includes('MANTENIMIENTO') ? 'bg-red-100 text-red-900 border-red-300' : 'bg-emerald-100 text-emerald-900 border-emerald-300'"
                      >
                        <svg v-if="h.horasUso >= h.umbralFatigaHoras || h.estado.includes('MANTENIMIENTO')" class="w-2.5 h-2.5 text-red-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <svg v-else class="w-2.5 h-2.5 text-emerald-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{{ h.horasUso >= h.umbralFatigaHoras || h.estado.includes('MANTENIMIENTO') ? 'Requiere Servicio' : 'En Servicio' }}</span>
                      </span>
                    </div>

                    <!-- Barra de Progreso de Horas -->
                    <div>
                      <div class="flex justify-between text-[10px] text-slate-500 font-mono mb-1">
                        <span>Horas: <strong>{{ h.horasUso }}</strong> / {{ h.umbralFatigaHoras }}h límite</span>
                        <span>{{ Math.min(100, Math.round((h.horasUso / (h.umbralFatigaHoras || 1)) * 100)) }}%</span>
                      </div>
                      <div class="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          class="h-1.5 rounded-full transition-all"
                          :class="h.horasUso >= h.umbralFatigaHoras ? 'bg-red-600' : h.horasUso / h.umbralFatigaHoras >= 0.7 ? 'bg-amber-500' : 'bg-emerald-500'"
                          :style="{ width: `${Math.min(100, Math.round((h.horasUso / (h.umbralFatigaHoras || 1)) * 100))}%` }"
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div v-if="herramientasSede.length === 0" class="py-4 text-center text-[11px] text-slate-500">
                    No hay herramientas registradas para análisis.
                  </div>
                </div>

                <button
                  type="button"
                  @click="seccionActiva = 'mantenimiento'"
                  class="w-full py-1.5 px-3 rounded-btn border border-slate-300 hover:bg-slate-50 text-[11px] font-bold text-slate-800 transition-colors cursor-pointer text-center block"
                >
                  Ir a Taller de Mantenimiento &rarr;
                </button>
              </div>

              <!-- Card 2: Registro de Notificaciones Automáticas (n8n WhatsApp) -->
              <div class="bg-bombero-surface p-4 rounded-card border border-bombero-border shadow-xs space-y-3">
                <div class="flex items-center justify-between border-b border-bombero-border pb-2.5">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-slate-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <h4 class="text-xs font-bold uppercase tracking-wider text-bombero-text-primary">
                      Notificaciones de Inventario (n8n)
                    </h4>
                  </div>
                  <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>Canal WhatsApp Activo</span>
                  </span>
                </div>

                <p class="text-[11px] text-slate-600 leading-relaxed">
                  Registro de avisos automáticos despachados a sala de crisis ante reservas o mantenimiento.
                </p>

                <!-- Lista de Últimas Alertas Enviadas -->
                <div class="space-y-1.5">
                  <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Últimas Alertas Despachadas
                  </span>

                  <div
                    v-for="alerta in ultimasAlertasWhatsapp"
                    :key="alerta.id"
                    class="p-2 rounded bg-slate-50 border border-slate-200 text-[11px] space-y-0.5"
                  >
                    <div class="flex items-center justify-between">
                      <span class="font-bold text-slate-800 flex items-center space-x-1.5">
                        <!-- Icono SVG según tipo de alerta -->
                        <svg v-if="alerta.tipo === 'RESERVA_SAGA'" class="w-3.5 h-3.5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <svg v-else-if="alerta.tipo === 'COMPENSACION_SAGA'" class="w-3.5 h-3.5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        <svg v-else class="w-3.5 h-3.5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span class="truncate max-w-[160px]">{{ alerta.titulo }}</span>
                      </span>
                      <span class="inline-flex items-center space-x-1 font-mono text-[10px] text-emerald-700 font-bold">
                        <svg class="w-3 h-3 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Despachado</span>
                      </span>
                    </div>
                    <div class="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>{{ alerta.destinatario }}</span>
                      <span>{{ alerta.fecha }}</span>
                    </div>
                  </div>

                  <div v-if="ultimasAlertasWhatsapp.length === 0" class="py-2 text-center text-[10px] text-slate-400">
                    Esperando eventos de inventario o SAGA...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ============================================================= -->
        <!-- VISTA 2: INVENTARIO GENERAL DE RECURSOS                       -->
        <!-- ============================================================= -->
        <section v-else-if="seccionActiva === 'inventario'" class="space-y-4">
          <!-- Barra de Filtros Espaciosa -->
          <div class="bg-bombero-surface p-4 rounded-card border border-bombero-border shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-3 flex-1">
              <!-- Buscador -->
              <div class="relative min-w-[240px]">
                <input
                  v-model="filtroTexto"
                  type="text"
                  placeholder="Buscar por código o nombre..."
                  class="w-full pl-8 pr-3 py-2 text-xs border border-bombero-border rounded-btn bg-white focus:outline-none focus:ring-1 focus:ring-bombero-secondary"
                />
                <svg class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <!-- Filtro Categoría -->
              <select
                v-model="filtroCategoria"
                class="px-3 py-2 text-xs border border-bombero-border rounded-btn bg-white focus:outline-none cursor-pointer"
              >
                <option value="">Todas las Categorías</option>
                <option value="QUIMICO">Insumos Químicos</option>
                <option value="EPP">Equipos EPP / Oxígeno</option>
                <option value="HERRAMIENTA">Herramientas / Maquinaria</option>
              </select>

              <!-- Filtro Estado -->
              <select
                v-model="filtroEstado"
                class="px-3 py-2 text-xs border border-bombero-border rounded-btn bg-white focus:outline-none cursor-pointer"
              >
                <option value="">Todos los Estados</option>
                <option value="DISPONIBLE">DISPONIBLE</option>
                <option value="ASIGNADO_CAMION">ASIGNADO_CAMION</option>
                <option value="MANTENIMIENTO_REQUERIDO">MANTENIMIENTO_REQUERIDO</option>
                <option value="VENCIDO">VENCIDO</option>
              </select>
            </div>

            <div class="flex items-center space-x-2">
              <span class="text-xs text-bombero-text-secondary font-mono mr-1">
                {{ itemsFiltrados.length }} recursos
              </span>
              <button
                @click="exportarInventarioCSV"
                class="px-3 py-2 rounded-btn bg-white border border-bombero-border hover:bg-slate-50 text-bombero-text-secondary text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
                title="Descargar auditoría de inventario en archivo CSV/Excel"
              >
                <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Exportar CSV</span>
              </button>
              <button
                @click="modalRegistroAbierto = true"
                class="px-3.5 py-2 rounded-btn bg-bombero-primary hover:bg-bombero-primary-hover text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
              >
                <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>+ Registrar Ítem</span>
              </button>
            </div>
          </div>

          <!-- Tabla Profesional Espaciosa -->
          <div class="bg-bombero-surface border border-bombero-border rounded-card shadow-xs overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-100 text-bombero-text-secondary uppercase text-[11px] font-bold border-b border-bombero-border">
                  <tr>
                    <th class="px-5 py-3.5">Código</th>
                    <th class="px-5 py-3.5">Descripción del Recurso</th>
                    <th class="px-4 py-3.5">Categoría</th>
                    <th class="px-5 py-3.5">Stock / Medición</th>
                    <th class="px-5 py-3.5">Detalles Técnicos</th>
                    <th class="px-4 py-3.5">Estado Operativo</th>
                    <th class="px-5 py-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-bombero-border bg-white">
                  <tr
                    v-for="item in itemsFiltrados"
                    :key="item.id"
                    class="hover:bg-slate-50/80 transition-colors"
                    :class="{ 'bg-red-50/20': item.requiereAtencion }"
                  >
                    <!-- Código -->
                    <td class="px-5 py-4 font-mono font-bold text-bombero-text-primary whitespace-nowrap">
                      {{ item.codigo }}
                    </td>

                    <!-- Nombre -->
                    <td class="px-5 py-4 font-medium text-bombero-text-primary">
                      {{ item.nombre }}
                    </td>

                    <!-- Categoría Badge -->
                    <td class="px-4 py-4 whitespace-nowrap">
                      <span
                        class="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border"
                        :class="{
                          'bg-blue-50 text-blue-800 border-blue-200': item.categoria === 'QUIMICO',
                          'bg-purple-50 text-purple-800 border-purple-200': item.categoria === 'EPP',
                          'bg-slate-100 text-slate-800 border-slate-300': item.categoria === 'HERRAMIENTA'
                        }"
                      >
                        {{ item.categoria }}
                      </span>
                    </td>

                    <!-- Stock / Medición -->
                    <td class="px-5 py-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {{ item.stockOVolumen }} {{ item.unidadMedida }}
                    </td>

                    <!-- Detalles Técnicos -->
                    <td class="px-5 py-4 text-[11px] text-bombero-text-secondary">
                      <div class="flex items-center space-x-1.5">
                        <span v-if="item.requiereAtencion" class="text-red-600 font-bold flex items-center space-x-1 shrink-0">
                          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                          </svg>
                          <span>ALERTA:</span>
                        </span>
                        <span>{{ item.detallesExtra || 'Parámetro regular' }}</span>
                      </div>
                    </td>

                    <!-- Estado Badge Semáforo -->
                    <td class="px-4 py-4 whitespace-nowrap">
                      <span
                        class="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border"
                        :class="claseSemaforoEstado(item.estado)"
                      >
                        {{ item.estado }}
                      </span>
                    </td>

                    <!-- Acciones -->
                    <td class="px-5 py-4 text-right whitespace-nowrap">
                      <div class="flex items-center justify-end space-x-2">
                        <!-- Botón Ajuste de Stock -->
                        <button
                          @click="abrirAjusteStock(item)"
                          class="px-2.5 py-1 rounded-btn bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold border border-slate-300 transition-colors"
                          title="Registrar entrada, salida o merma"
                        >
                          Ajustar
                        </button>

                        <!-- Botón Derivar a Taller / Calibrar -->
                        <button
                          v-if="item.categoria === 'HERRAMIENTA' || item.categoria === 'EPP'"
                          @click="abrirMantenimiento(item, item.estado === 'MANTENIMIENTO_REQUERIDO')"
                          class="px-2.5 py-1 rounded-btn text-[11px] font-semibold border transition-colors"
                          :class="item.estado === 'MANTENIMIENTO_REQUERIDO'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-800 border-red-300 hover:bg-red-100'"
                        >
                          {{ item.estado === 'MANTENIMIENTO_REQUERIDO' ? 'Calibrar' : 'A Taller' }}
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr v-if="itemsFiltrados.length === 0 && !cargando">
                    <td colspan="7" class="px-6 py-12 text-center text-xs text-bombero-text-muted">
                      No se encontraron recursos que coincidan con los filtros de búsqueda.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ============================================================= -->
        <!-- VISTA 3: RESERVAS SAGA Y ORQUESTACIÓN DISTRIBUIDA             -->
        <!-- ============================================================= -->
        <section v-else-if="seccionActiva === 'saga'" class="space-y-6">
          <!-- Banner Explicativo Arquitectura SAGA -->
          <div class="p-4 bg-bombero-surface border border-bombero-border rounded-card shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div class="max-w-3xl">
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase">
                  SAGA PARTICIPANT
                </span>
                <h3 class="text-sm font-bold text-bombero-text-primary">
                  Protocolo Transaccional Despacho de Emergencia
                </h3>
              </div>
              <p class="text-xs text-bombero-text-secondary mt-1 leading-relaxed">
                El orquestador en <strong>MS-01 (Nataly, NestJS)</strong> llama a la mutación <code class="bg-slate-100 px-1 py-0.2 rounded font-mono">reservarKitParaDespacho</code> en MS-03.
                Si la reserva de camión en <strong>MS-02 (Flotas)</strong> fracasa, el orquestador dispara automáticamente <code class="bg-slate-100 px-1 py-0.2 rounded font-mono">liberarReservaCompensatoria</code> en MS-03, devolviendo los insumos de forma atómica.
              </p>
            </div>
          </div>

          <!-- Tabla de Transacciones SAGA -->
          <div class="bg-bombero-surface border border-bombero-border rounded-card shadow-xs overflow-hidden">
            <div class="px-4 py-3 border-b border-bombero-border flex items-center justify-between">
              <h4 class="text-xs font-bold text-bombero-text-primary uppercase tracking-wide">
                Ledger de Transacciones SAGA en MS-03
              </h4>
              <span class="text-[11px] text-bombero-text-secondary font-mono">
                {{ transaccionesSaga.length }} eventos auditados
              </span>
            </div>

            <div class="overflow-hidden">
              <table class="w-full text-left text-xs table-fixed">
                <thead class="bg-slate-100 text-bombero-text-secondary uppercase text-[10px] font-bold border-b border-bombero-border">
                  <tr>
                    <th class="w-36 px-3.5 py-3">Transacción ID</th>
                    <th class="w-28 px-3.5 py-3">Incidente</th>
                    <th class="w-28 px-3.5 py-3">Unidad Camión</th>
                    <th class="px-3.5 py-3">Materiales Bloqueados</th>
                    <th class="w-36 px-3.5 py-3">Estado SAGA</th>
                    <th class="w-28 px-3.5 py-3">Fecha</th>
                    <th class="w-32 px-3.5 py-3 text-right">Compensación</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-bombero-border bg-white">
                  <tr
                    v-for="tx in transaccionesSaga"
                    :key="tx.transaccionId"
                    class="hover:bg-slate-50/80 transition-colors"
                    :class="{ 'bg-amber-50/30': tx.estado === 'RESERVADO' }"
                  >
                    <td class="px-3.5 py-3 font-mono font-bold text-bombero-text-primary truncate">
                      {{ tx.transaccionId }}
                    </td>
                    <td class="px-3.5 py-3 font-mono text-slate-700 truncate">
                      {{ tx.incidenteId }}
                    </td>
                    <td class="px-3.5 py-3 font-mono font-bold text-slate-800 truncate">
                      {{ tx.camionId }}
                    </td>
                    <td class="px-3.5 py-3 text-[11px] text-bombero-text-secondary">
                      <div class="line-clamp-2 leading-relaxed">
                        <span v-if="tx.kitReservadoId" class="font-mono font-bold text-slate-800">
                          {{ tx.kitReservadoId }}
                        </span>
                        <span v-if="tx.litrosEspumogenoReservados > 0">
                          + {{ tx.litrosEspumogenoReservados }}L Espumógeno
                        </span>
                      </div>
                    </td>
                    <td class="px-3.5 py-3">
                      <span
                        class="inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border"
                        :class="tx.estado === 'RESERVADO' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-emerald-100 text-emerald-900 border-emerald-300'"
                      >
                        {{ tx.estado }}
                      </span>
                    </td>
                    <td class="px-3.5 py-3 font-mono text-[11px] text-slate-500 truncate">
                      {{ formatearFechaCorta(tx.createdAt) }}
                    </td>
                    <td class="px-3.5 py-3 text-right">
                      <button
                        v-if="tx.estado === 'RESERVADO'"
                        @click="ejecutarRollbackSaga(tx.transaccionId)"
                        :disabled="ejecutandoRollback === tx.transaccionId"
                        class="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-bombero-primary border border-red-200 text-[10px] font-bold transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <span v-if="ejecutandoRollback === tx.transaccionId">Liberando...</span>
                        <span v-else>Rollback Manual</span>
                      </button>
                      <span v-else class="text-[10px] text-emerald-700 font-mono font-bold">
                        RESTITUIDO ✅
                      </span>
                    </td>
                  </tr>

                  <tr v-if="transaccionesSaga.length === 0 && !cargando">
                    <td colspan="7" class="px-6 py-12 text-center text-xs text-bombero-text-muted">
                      No hay transacciones SAGA registradas en esta sesión.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ============================================================= -->
        <!-- VISTA 4: MOVIMIENTOS Y TRAZABILIDAD                           -->
        <!-- ============================================================= -->
        <section v-else-if="seccionActiva === 'movimientos'" class="space-y-4">
          <div class="bg-bombero-surface p-4 rounded-card border border-bombero-border shadow-xs flex items-center justify-between">
            <div>
              <h3 class="text-xs font-bold text-bombero-text-primary uppercase tracking-wide">
                Libro de Trazabilidad de Movimientos
              </h3>
              <p class="text-[11px] text-bombero-text-muted mt-0.5">
                Historial cronológico inmutable de entradas, salidas operativas y eventos SAGA.
              </p>
            </div>
            <button
              @click="recargarMovimientos"
              class="px-3 py-1.5 rounded-btn bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
            >
              Actualizar
            </button>
          </div>

          <div class="bg-bombero-surface border border-bombero-border rounded-card shadow-xs overflow-hidden">
            <div class="overflow-hidden">
              <table class="w-full text-left text-xs table-fixed">
                <thead class="bg-slate-100 text-bombero-text-secondary uppercase text-[10px] font-bold border-b border-bombero-border">
                  <tr>
                    <th class="w-28 px-3 py-3">Fecha</th>
                    <th class="w-32 px-3 py-3">Tipo</th>
                    <th class="w-28 px-3 py-3">Código</th>
                    <th class="w-40 px-3 py-3">Recurso</th>
                    <th class="w-20 px-3 py-3">Cat.</th>
                    <th class="w-16 px-2 py-3 text-right">Cant.</th>
                    <th class="px-3 py-3">Motivo Justificado</th>
                    <th class="w-28 px-3 py-3 text-right">Responsable</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-bombero-border bg-white">
                  <tr
                    v-for="mov in movimientos"
                    :key="mov.id"
                    class="hover:bg-slate-50/80 transition-colors"
                  >
                    <td class="px-3 py-2.5 font-mono text-[11px] text-slate-600 truncate">
                      {{ formatearFechaCorta(mov.createdAt) }}
                    </td>
                    <td class="px-3 py-2.5">
                      <span
                        class="inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border"
                        :class="{
                          'bg-emerald-50 text-emerald-800 border-emerald-200': mov.tipoMovimiento === 'ENTRADA' || mov.tipoMovimiento === 'SAGA_ROLLBACK' || mov.tipoMovimiento === 'COMPENSACION_SAGA',
                          'bg-red-50 text-red-800 border-red-200': mov.tipoMovimiento === 'SALIDA' || mov.tipoMovimiento === 'MERMA_CADUCIDAD',
                          'bg-amber-50 text-amber-800 border-amber-200': mov.tipoMovimiento === 'SAGA_RESERVA' || mov.tipoMovimiento === 'RESERVA_SAGA',
                          'bg-blue-50 text-blue-800 border-blue-200': mov.tipoMovimiento === 'AJUSTE_AUDITORIA'
                        }"
                      >
                        {{ mov.tipoMovimiento }}
                      </span>
                    </td>
                    <td class="px-3 py-2.5 font-mono font-bold text-bombero-text-primary truncate">
                      {{ mov.itemCodigo }}
                    </td>
                    <td class="px-3 py-2.5 font-medium text-bombero-text-primary truncate" :title="mov.itemNombre">
                      {{ mov.itemNombre }}
                    </td>
                    <td class="px-3 py-2.5 font-mono text-[10px] uppercase text-slate-600 truncate">
                      {{ mov.categoria }}
                    </td>
                    <td class="px-2 py-2.5 font-mono font-bold text-right text-slate-900 truncate">
                      {{ mov.cantidad }}
                    </td>
                    <td class="px-3 py-2.5 text-[11px] text-bombero-text-secondary">
                      <p class="line-clamp-2 leading-relaxed" :title="mov.motivo">
                        {{ mov.motivo }}
                      </p>
                    </td>
                    <td class="px-3 py-2.5 text-[11px] text-slate-700 text-right truncate" :title="mov.responsable">
                      {{ mov.responsable }}
                    </td>
                  </tr>

                  <tr v-if="movimientos.length === 0 && !cargando">
                    <td colspan="8" class="px-6 py-12 text-center text-xs text-bombero-text-muted">
                      No hay registros de movimientos en el libro contable.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ============================================================= -->
        <!-- VISTA 5: MANTENIMIENTO PREVENTIVO Y FATIGA                    -->
        <!-- ============================================================= -->
        <section v-else-if="seccionActiva === 'mantenimiento'" class="space-y-4">
          <!-- Banner de Alerta Técnica -->
          <div class="p-4 bg-red-50 border border-red-200 rounded-card flex items-start space-x-3 shadow-xs">
            <svg class="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <div class="text-xs">
              <h4 class="font-bold text-red-900 uppercase">
                Control Preventivo: Equipos con Fatiga de Uso o Presión Insuficiente
              </h4>
              <p class="text-red-800 mt-0.5 leading-relaxed">
                Herramientas motorizadas que superaron su horómetro de fatiga y tanques de oxígeno
                que requieren recarga preventiva (&lt; 250 bares). Estos equipos deben ser calibrados
                antes de autorizar su asignación a una dotación operativa.
              </p>
            </div>
          </div>

          <div class="bg-bombero-surface border border-bombero-border rounded-card shadow-xs overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-100 text-bombero-text-secondary uppercase text-[11px] font-bold border-b border-bombero-border">
                  <tr>
                    <th class="px-5 py-3.5">Código</th>
                    <th class="px-5 py-3.5">Equipo / Maquinaria</th>
                    <th class="px-4 py-3.5">Categoría</th>
                    <th class="px-5 py-3.5">Métrica Operativa</th>
                    <th class="px-5 py-3.5">Diagnóstico de Taller</th>
                    <th class="px-4 py-3.5">Estado</th>
                    <th class="px-5 py-3.5 text-right">Acción Técnica</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-bombero-border bg-white">
                  <tr
                    v-for="item in equiposMantenimiento"
                    :key="item.id"
                    class="hover:bg-slate-50/80 transition-colors bg-red-50/15"
                  >
                    <td class="px-5 py-4 font-mono font-bold text-bombero-text-primary whitespace-nowrap">
                      {{ item.codigo }}
                    </td>
                    <td class="px-5 py-4 font-medium text-bombero-text-primary">
                      {{ item.nombre }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap">
                      <span class="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border bg-slate-100 text-slate-800 border-slate-300">
                        {{ item.categoria }}
                      </span>
                    </td>
                    <td class="px-5 py-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {{ item.stockOVolumen }} {{ item.unidadMedida }}
                    </td>
                    <td class="px-5 py-4 text-[11px] text-red-800 font-medium">
                      {{ item.detallesExtra }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap">
                      <span
                        class="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border"
                        :class="claseSemaforoEstado(item.estado)"
                      >
                        {{ item.estado }}
                      </span>
                    </td>
                    <td class="px-5 py-4 text-right whitespace-nowrap">
                      <button
                        @click="abrirMantenimiento(item, true)"
                        class="px-3 py-1.5 rounded-btn bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors shadow-xs"
                      >
                        Calibrar / Retornar
                      </button>
                    </td>
                  </tr>

                  <tr v-if="equiposMantenimiento.length === 0 && !cargando">
                    <td colspan="7" class="px-6 py-12 text-center text-xs text-emerald-800 bg-emerald-50/30">
                      <div class="flex flex-col items-center justify-center space-y-1">
                        <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span class="font-bold">Todos los recursos operan dentro de los márgenes seguros.</span>
                        <span class="text-[11px] text-emerald-600">No hay alertas de fatiga ni tanques con presión deficiente.</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- 3. MODALES OPERATIVOS INTELIGENTES -->
    <!-- Modal 1: Registro Dinámico Inteligente de Nuevo Ítem -->
    <DynamicCreateItemModal
      :abierto="modalRegistroAbierto"
      :itemsExistentes="itemsInventario"
      @cerrar="modalRegistroAbierto = false"
      @guardado="handleItemGuardado"
    />

    <!-- Modal 2: Ajuste de Stock Operativo -->
    <StockAdjustmentModal
      :abierto="modalAjusteAbierto"
      :itemCodigo="itemSeleccionado?.codigo || ''"
      :itemNombre="itemSeleccionado?.nombre || ''"
      :categoria="itemSeleccionado?.categoria || ''"
      :itemActual="itemSeleccionado"
      @cerrar="modalAjusteAbierto = false"
      @ajustado="handleStockAjustado"
    />

    <!-- Modal 3: Taller y Calibración -->
    <MaintenanceActionModal
      :abierto="modalMantenimientoAbierto"
      :item="itemSeleccionado"
      :modoRetorno="modoRetornoMantenimiento"
      @cerrar="modalMantenimientoAbierto = false"
      @actualizado="handleMantenimientoActualizado"
    />

    <!-- Modal 4: Automatización de Alertas n8n -->
    <N8nAlertModal
      :abierto="modalN8nAbierto"
      :insumosQuimicos="quimicosSede"
      :herramientas="herramientasSede"
      @cerrar="modalN8nAbierto = false"
    />

    <!-- Toast Flotante de Éxito al Guardar / Actualizar -->
    <transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="notificacionExito"
        class="fixed bottom-6 right-6 z-50 p-4 bg-emerald-700 text-white rounded-card shadow-2xl flex items-center space-x-3 text-xs font-bold border border-emerald-500"
      >
        <svg class="w-5 h-5 text-emerald-200 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span>{{ notificacionExito }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { apolloClient } from '../apollo/client';
import {
  RESUMEN_DASHBOARD_LOGISTICA_QUERY,
  LISTAR_INVENTARIO_GENERAL_QUERY,
  LISTAR_EQUIPOS_MANTENIMIENTO_QUERY,
  LISTAR_MOVIMIENTOS_QUERY,
  LISTAR_TRANSACCIONES_SAGA_QUERY,
  INVENTARIO_ESTACION_QUERY,
  RESERVAR_KIT_MUTATION,
  LIBERAR_RESERVA_MUTATION,
} from '../graphql/operations';

import AppSidebar from '../components/AppSidebar.vue';
import AppHeader from '../components/AppHeader.vue';
import DynamicCreateItemModal from '../components/DynamicCreateItemModal.vue';
import StockAdjustmentModal from '../components/StockAdjustmentModal.vue';
import MaintenanceActionModal from '../components/MaintenanceActionModal.vue';
import N8nAlertModal from '../components/N8nAlertModal.vue';
import OxygenPressureGauge from '../components/OxygenPressureGauge.vue';

// Navegación de Sección Activa
const seccionActiva = ref<string>('dashboard');
const estacionSeleccionada = ref<string>('EST-01');
const cargando = ref(false);
const errorGeneral = ref<string | null>(null);
const notificacionExito = ref<string | null>(null);

// Formateador compacto de fechas para evitar ensanchar tablas
function formatearFechaCorta(fechaStr: string): string {
  if (!fechaStr) return '-';
  try {
    const d = new Date(fechaStr);
    if (isNaN(d.getTime())) return fechaStr.substring(0, 16);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const horas = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${dia}/${mes} ${horas}:${mins}`;
  } catch {
    return String(fechaStr).substring(0, 16);
  }
}

// Filtros de Inventario General
const filtroTexto = ref('');
const filtroCategoria = ref('');
const filtroEstado = ref('');

// Estado de Datos Global
const kpis = ref({
  totalKits: 0,
  kitsSeguros: 0,
  totalQuimicosLitros: 0,
  totalHerramientas: 0,
  equiposMantenimiento: 0,
  reservasActivas: 0,
});

const itemsInventario = ref<any[]>([]);
const equiposMantenimiento = ref<any[]>([]);
const movimientos = ref<any[]>([]);
const transaccionesSaga = ref<any[]>([]);
const kitsEppSede = ref<any[]>([]);
const quimicosSede = ref<any[]>([]);
const herramientasSede = computed(() => itemsInventario.value.filter(i => i.categoria === 'HERRAMIENTA'));

// Lista reactiva de últimas alertas despachadas hacia WhatsApp (n8n)
const ultimasAlertasWhatsapp = computed(() => {
  const lista: any[] = [];
  
  transaccionesSaga.value.slice(0, 2).forEach((tx) => {
    lista.push({
      id: tx.transaccionId,
      tipo: tx.estado === 'RESERVADO' ? 'RESERVA_SAGA' : 'COMPENSACION_SAGA',
      titulo: tx.estado === 'RESERVADO' ? `Reserva #${tx.incidenteId} (${tx.camionId})` : `Compensación #${tx.transaccionId}`,
      destinatario: 'Nataly Martínez (Comandos)',
      fecha: formatearFechaCorta(tx.createdAt),
      estadoEnvio: 'Despachado',
    });
  });

  movimientos.value
    .filter((m) => m.tipoMovimiento?.includes('SAGA') || m.tipoMovimiento === 'AJUSTE_AUDITORIA')
    .slice(0, 3 - lista.length)
    .forEach((m) => {
      lista.push({
        id: m.id,
        tipo: 'ALERTA_STOCK',
        titulo: `${m.itemCodigo}: ${m.tipoMovimiento}`,
        destinatario: 'Operador de Guardia',
        fecha: formatearFechaCorta(m.createdAt),
        estadoEnvio: 'Despachado',
      });
    });

  return lista;
});

// Modales
const modalRegistroAbierto = ref(false);
const modalAjusteAbierto = ref(false);
const modalMantenimientoAbierto = ref(false);
const modalN8nAbierto = ref(false);

const itemSeleccionado = ref<any>(null);
const modoRetornoMantenimiento = ref(false);

const ejecutandoRollback = ref<string | null>(null);

// Filtrado Reactivo de Inventario General
const itemsFiltrados = computed(() => {
  return itemsInventario.value.filter((item) => {
    if (filtroTexto.value) {
      const q = filtroTexto.value.toLowerCase();
      const matchCod = item.codigo?.toLowerCase().includes(q);
      const matchNom = item.nombre?.toLowerCase().includes(q);
      if (!matchCod && !matchNom) return false;
    }
    if (filtroCategoria.value && item.categoria !== filtroCategoria.value) {
      return false;
    }
    if (filtroEstado.value && item.estado !== filtroEstado.value) {
      return false;
    }
    return true;
  });
});

function claseSemaforoEstado(estado: string) {
  switch (estado) {
    case 'DISPONIBLE':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'ASIGNADO_CAMION':
      return 'bg-blue-50 text-blue-800 border-blue-200';
    case 'MANTENIMIENTO_REQUERIDO':
      return 'bg-red-50 text-red-800 border-red-200';
    case 'VENCIDO':
    case 'DE_BAJA':
      return 'bg-slate-100 text-slate-800 border-slate-300';
    default:
      return 'bg-amber-50 text-amber-800 border-amber-200';
  }
}

function formatDecimal(val: number) {
  if (val === undefined || val === null) return '0.0';
  return Number(val).toLocaleString('es-BO', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function cambiarEstacion(nuevaEstacion: string) {
  estacionSeleccionada.value = nuevaEstacion;
  recargarTodo();
}

// Carga Consolidada de Datos
async function recargarTodo() {
  cargando.value = true;
  errorGeneral.value = null;

  try {
    await Promise.all([
      cargarKpis(),
      cargarInventarioGeneral(),
      cargarEquiposMantenimiento(),
      cargarMovimientos(),
      cargarTransaccionesSaga(),
      cargarInventarioEstacion(),
    ]);
  } catch (err: any) {
    errorGeneral.value = err.message || 'Error de comunicación con el backend de Inventario (Puerto 8003).';
  } finally {
    cargando.value = false;
  }
}

async function cargarKpis() {
  try {
    const { data } = await apolloClient.query({
      query: RESUMEN_DASHBOARD_LOGISTICA_QUERY,
      fetchPolicy: 'network-only',
    });
    if (data?.resumenDashboardLogistica) {
      kpis.value = data.resumenDashboardLogistica;
    }
  } catch (e: any) {
    console.error('Error al cargar KPIs:', e);
  }
}

async function cargarInventarioGeneral() {
  try {
    const { data } = await apolloClient.query({
      query: LISTAR_INVENTARIO_GENERAL_QUERY,
      fetchPolicy: 'network-only',
    });
    if (data?.listarInventarioGeneral) {
      itemsInventario.value = data.listarInventarioGeneral;
    }
  } catch (e: any) {
    console.error('Error al cargar inventario general:', e);
  }
}

async function cargarEquiposMantenimiento() {
  try {
    const { data } = await apolloClient.query({
      query: LISTAR_EQUIPOS_MANTENIMIENTO_QUERY,
      fetchPolicy: 'network-only',
    });
    if (data?.listarEquiposMantenimiento) {
      equiposMantenimiento.value = data.listarEquiposMantenimiento;
    }
  } catch (e: any) {
    console.error('Error al cargar equipos de mantenimiento:', e);
  }
}

async function cargarMovimientos() {
  try {
    const { data } = await apolloClient.query({
      query: LISTAR_MOVIMIENTOS_QUERY,
      variables: { limite: 50 },
      fetchPolicy: 'network-only',
    });
    if (data?.listarMovimientos) {
      movimientos.value = data.listarMovimientos;
    }
  } catch (e: any) {
    console.error('Error al cargar movimientos:', e);
  }
}

async function cargarTransaccionesSaga() {
  try {
    const { data } = await apolloClient.query({
      query: LISTAR_TRANSACCIONES_SAGA_QUERY,
      fetchPolicy: 'network-only',
    });
    if (data?.listarTransaccionesSaga) {
      transaccionesSaga.value = data.listarTransaccionesSaga;
    }
  } catch (e: any) {
    console.error('Error al cargar transacciones SAGA:', e);
  }
}

async function cargarInventarioEstacion() {
  try {
    const { data } = await apolloClient.query({
      query: INVENTARIO_ESTACION_QUERY,
      variables: { estacionId: estacionSeleccionada.value },
      fetchPolicy: 'network-only',
    });
    if (data?.obtenerInventarioEstacion) {
      kitsEppSede.value = data.obtenerInventarioEstacion.kitsDisponibles || [];
      quimicosSede.value = data.obtenerInventarioEstacion.suministrosQuimicos || [];
    }
  } catch (e: any) {
    console.error('Error al cargar inventario de estación:', e);
  }
}

function recargarMovimientos() {
  cargarMovimientos();
}

function abrirAjusteStock(item: any) {
  itemSeleccionado.value = item;
  modalAjusteAbierto.value = true;
}

function abrirMantenimiento(item: any, esRetorno: boolean) {
  itemSeleccionado.value = item;
  modoRetornoMantenimiento.value = esRetorno;
  modalMantenimientoAbierto.value = true;
}

function handleItemGuardado(payload: any) {
  const cod = payload?.codigo || 'Recurso';
  notificacionExito.value = `¡${cod} registrado y guardado exitosamente en la base de datos PostgreSQL!`;
  seccionActiva.value = 'inventario'; // Navegar a la tabla de inventario para ver el nuevo ítem
  recargarTodo();
  setTimeout(() => {
    notificacionExito.value = null;
  }, 5000);
}

function handleStockAjustado() {
  notificacionExito.value = '¡Ajuste de stock registrado y asentado en el kardex de movimientos!';
  recargarTodo();
  setTimeout(() => {
    notificacionExito.value = null;
  }, 4000);
}

function handleMantenimientoActualizado() {
  notificacionExito.value = '¡Estado operativo actualizado y registrado en taller técnico!';
  recargarTodo();
  setTimeout(() => {
    notificacionExito.value = null;
  }, 4000);
}

async function ejecutarRollbackSaga(transaccionId: string) {
  ejecutandoRollback.value = transaccionId;

  try {
    const { data } = await apolloClient.mutate({
      mutation: LIBERAR_RESERVA_MUTATION,
      variables: { transaccionId },
    });

    if (data?.liberarReservaCompensatoria?.exito) {
      await recargarTodo();
    }
  } catch (err: any) {
    console.error('Error al ejecutar rollback:', err);
  } finally {
    ejecutandoRollback.value = null;
  }
}

function exportarInventarioCSV() {
  if (!itemsFiltrados.value || itemsFiltrados.value.length === 0) return;

  const encabezados = ['Codigo', 'Nombre', 'Categoria', 'Estado', 'Stock_Volumen', 'Unidad', 'Estacion', 'Detalles'];
  const filas = itemsFiltrados.value.map((item: any) => [
    item.codigo,
    `"${(item.nombre || '').replace(/"/g, '""')}"`,
    item.categoria,
    item.estado,
    item.stockOVolumen,
    item.unidadMedida,
    item.estacionId,
    `"${(item.detallesExtra || '').replace(/"/g, '""')}"`
  ]);

  const contenidoCsv = [encabezados.join(','), ...filas.map((f: any[]) => f.join(','))].join('\n');
  const blob = new Blob([contenidoCsv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `inventario_bomberos_${estacionSeleccionada.value}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

onMounted(() => {
  recargarTodo();

  // Integración con App Shell (Punto 02): Escucha cambios de sede del Host
  window.addEventListener('SEDE_CAMBIADA', (event: any) => {
    if (event.detail?.estacionId) {
      estacionSeleccionada.value = event.detail.estacionId;
      recargarTodo();
    }
  });

  // Escucha evento de emergencia despachada para refrescar reservas SAGA en vivo
  window.addEventListener('SAGA_DESPACHO_ACTUALIZADO', () => {
    cargarTransaccionesSaga();
    cargarKpis();
  });
});
</script>
