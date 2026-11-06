# MFE-03: Microfrontend de Inventario y Recursos Tácticos
**Sistema Integrado de Comando y Control de Incidentes — Bomberos SCZ**  
> **Asignatura:** Ingeniería de Software II (INF512) — UAGRM (Semestre 2/2026)  
> **Docente:** M.Sc. Ing. Rolando Antonio Martínez 
> **Responsable:** Jael Sandoval  
> **Tecnología:** Vue 3.5 / Vite 5 / TypeScript / Tailwind CSS / Apollo Client GraphQL  
> **Puerto Asignado:** `3003` | **Endpoint Backend:** `http://127.0.0.1:8003/graphql`  
> **Documentación Completa:** Consultar [`GUIA_MFE3_FRONTEND_TECNICA.md`](./GUIA_MFE3_FRONTEND_TECNICA.md)

---

## 1. Características Principales

1. **Gauges de Presión ERA (NFPA):** Monitoreo visual con medidores circulares para cilindros de oxígeno ($\ge 250$ bar = Verde / Apto para combate; $< 250$ bar = Rojo / Recarga obligatoria).
2. **Balance de Químicos:** Tarjetas reactivas de insumos extintores (Espumógeno AFFF 3%, Retardante Phos-Chek, PQS ABC) consumiendo GraphQL sin *over-fetching*.
3. **Mantenimiento Predictivo:** Control continuo de horómetros de maquinaria pesada (motobombas, generadores, motosierras) contra umbrales de fatiga de materiales.
4. **Auditoría SAGA en Vivo:** Historial de transacciones distribuidas con estado de reservas y compensaciones.
5. **Feed Táctico de Alertas WhatsApp:** Visualizador de notificaciones despachadas a los celulares del personal por n8n.
6. **Diseño Profesional:** 100% iconos vectoriales SVG limpios (sin emojis) y maquetación adaptativa libre de scroll horizontal.

---

## 2. Ejecución Rápida en Desarrollo Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor Vite en puerto 3003
npm run dev
```

Abra su navegador en: **`http://localhost:3003`**.

---

## 3. Integración con el Shell Principal de Nataly (`appshell_frontend`)

En el archivo de configuración del Shell anfitrión (`vite.config.ts` o `webpack.config.js`):

```javascript
remotes: {
  mfe3_inventario: 'http://localhost:3003/assets/remoteEntry.js',
}
```

E importar el componente en las rutas del Shell:
```javascript
const InventarioView = () => import('mfe3_inventario/InventarioApp');
```
