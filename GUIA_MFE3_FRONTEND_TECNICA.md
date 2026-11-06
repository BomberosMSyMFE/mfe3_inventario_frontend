# GUÍA TÉCNICA Y DE ARQUITECTURA: MFE-03 MICROFRONTEND DE INVENTARIO
## Sistema Integrado de Comando y Control de Incidentes — Bomberos SCZ
> **Asignatura:** Ingeniería de Software II (INF512) — UAGRM (Semestre 2/2026)  
> **Docente:** M.Sc. Ing. Rolando Antonio Martínez 
> **Responsable del Microfrontend:** Jael Sandoval (Frontend & Microfrontends)  
> **Tecnología Base:** Vue 3.5 + Vite 5 + TypeScript + Tailwind CSS + Apollo Client GraphQL  
> **Patrón Arquitectónico:** Microfrontend Federado (Module Federation / Single-SPA)  
> **Puerto Asignado Local:** `3003` | **Endpoint Backend:** `http://127.0.0.1:8003/graphql`

---

## 1. Propósito y Alcance del Microfrontend

El **MFE-03 (Inventario y Recursos)** es el microfrontend federado responsable de proporcionar al personal de logística, maquinistas y comandantes de incidente una interfaz gráfica táctica, reactiva y de alta disponibilidad para:

1. **Monitoreo en Tiempo Real de Presión ERA (Value Object NFPA):** Visualización mediante medidores circulares (*gauges*) del nivel de oxígeno en tanques de bomberos, diferenciando visualmente los aptos para combate ($\ge 250$ bar) de los que requieren recarga ($< 250$ bar).
2. **Control Volumétrico de Agentes Extintores:** Supervisión de reservas de espumógenos AFFF y retardantes químicos forestales, consumiendo queries GraphQL optimizadas sin *over-fetching*.
3. **Mantenimiento Predictivo de Herramientas y Maquinaria:** Seguimiento continuo de horómetros acumulados (`horas_uso`) contra el umbral crítico de fatiga de materiales (`umbral_fatiga_horas`) para motobombas, generadores y motosierras.
4. **Auditoría de Transacciones SAGA:** Visor en vivo de reservas atómicas y rollbacks compensatorios orquestados por el MS-01 de Nataly.
5. **Centro de Alertas n8n / WhatsApp:** Consulta y monitoreo de las alertas de quiebre de stock emitidas automáticamente a los teléfonos celulares de guardia.

---

## 2. Arquitectura de Software y Estructura del Código

El microfrontend está construido con **Vue 3 Composition API** utilizando `<script setup lang="ts">`, tipado estricto con **TypeScript** y estilos utilitarios con **Tailwind CSS**.

```text
mfe3_inventario_frontend/
├── src/
│   ├── apollo/
│   │   └── client.ts                 # Configuración de Apollo Client HTTP Link hacia puerto 8003
│   ├── components/                   # Componentes Tácticos Modulares
│   │   ├── AppHeader.vue             # Cabecera con estado de conexión GraphQL y hora en vivo
│   │   ├── AppSidebar.vue            # Menú lateral táctico con iconos vectoriales SVG limpios
│   │   ├── OxygenPressureGauge.vue   # Gauges SVG para manómetros de tanques ERA (Regla 250 bares)
│   │   ├── ChemicalStockCards.vue    # Tarjetas de agentes extintores (AFFF / Phos-Chek)
│   │   ├── MaintenanceHoursCard.vue  # Horómetros de maquinaria y clasificación de fatiga
│   │   ├── SagaAuditLedger.vue       # Tabla auditora de transacciones SAGA distribuidas
│   │   ├── StockAdjustModal.vue      # Modal para entradas, salidas y ajustes de stock
│   │   ├── DynamicCreateModal.vue    # Modal para registro dinámico de nuevos equipos
│   │   └── N8nAlertModal.vue         # Modal con el historial de alertas despachadas a WhatsApp
│   ├── graphql/
│   │   └── operations.ts             # Definición de Queries y Mutations con `graphql-tag` (gql)
│   ├── views/
│   │   └── InventarioDashboardView.vue # Vista orquestadora principal con pestañas tácticas
│   ├── App.vue                       # Componente Raíz exportado vía Module Federation
│   ├── main.ts                       # Punto de entrada en modo Standalone (montaje en #app)
│   └── style.css                     # Directivas Tailwind (@tailwind base, components, utilities)
├── Dockerfile                        # Configuración para despliegue en contenedor con Nginx
├── nginx.conf                        # Servidor Nginx con soporte de SPA y cabeceras CORS
├── package.json                      # Dependencias y scripts de construcción
├── tailwind.config.js                # Paleta de colores tácticos (Slate, Emerald, Amber, Rose)
├── tsconfig.json                     # Configuración estricta de TypeScript
└── vite.config.ts                    # Plugin de Vite Federation para exponer ./InventarioApp
```

---

## 3. Integración por Federación de Módulos (Module Federation)

El microfrontend implementa **Vite Plugin Federation** (`@originjs/vite-plugin-federation`), lo que permite que funcione de dos formas:
1. **Modo Autónomo (Standalone):** Corre por sí solo en el puerto `3003` para desarrollo local y pruebas aisladas.
2. **Modo Federado (Remote dentro del Shell de Nataly):** Expone su componente principal a través de un archivo `remoteEntry.js`.

### Configuración en `vite.config.ts`:
```typescript
federation({
  name: 'mfe3_inventario',
  filename: 'remoteEntry.js',
  exposes: {
    './InventarioApp': './src/App.vue',
  },
  shared: ['vue', 'vue-router']
})
```

### Cómo consumirlo desde el App Shell Anfitrión (`appshell_frontend`):
En el archivo de configuración del Shell anfitrión (Angular, React o Webpack):
```javascript
// Configuración de Remotes en el Shell
remotes: {
  mfe3_inventario: 'http://localhost:3003/assets/remoteEntry.js',
}

// Carga perezosa (Lazy Loading) del Microfrontend
const InventarioView = () => import('mfe3_inventario/InventarioApp');
```

---

## 4. Diseño de UI / UX Táctico y Normas de Calidad

* **Cero Emojis:** Todos los pictogramas utilizan **iconos SVG vectoriales limpios** o componentes de `lucide-vue-next` para mantener una apariencia militar/profesional propia de un cuerpo de bomberos.
* **Sin Desbordes Horizontales:** Todas las tablas de datos (`movimientos_inventario` y `transacciones_saga`) utilizan clases `table-fixed w-full`, anchos de columna porcentuales y truncamiento de texto (`truncate` / `line-clamp-2`), garantizando que la interfaz se ajuste perfectamente a cualquier resolución de pantalla sin necesidad de barras de desplazamiento horizontal.
* **Paleta de Colores de Seguridad:**
  - `Emerald (#10b981)`: Disponibilidad operativa / Presión de oxígeno segura ($\ge 250$ bar).
  - `Amber (#f59e0b)`: Mantenimiento preventivo / Advertencia de stock bajo.
  - `Rose (#f43f5e)`: Quiebre de stock crítico / Equipo fuera de servicio ($< 250$ bar).
  - `Slate (#0f172a)`: Fondo táctico de alto contraste para centros de control de emergencias.

---

## 5. Guía de Ejecución Local Paso a Paso (Solo Frontend)

Sigue estos pasos para levantar únicamente el microfrontend MFE-03 en modo de desarrollo local:

### Prerrequisitos:
* **Node.js:** Versión 18.x o 20.x instalada (`node -v`).
* **npm:** Versión 9+ o 10+ (`npm -v`).
* *(Opcional pero recomendado)*: El backend `ms3_inventario_backend` corriendo en el puerto `8003`.

---

### Paso 1: Clonar o Situarse en el Directorio
Abre una terminal y dirígete a la carpeta del microfrontend:
```powershell
cd mfe3_inventario_frontend
```

---

### Paso 2: Configurar las Variables de Entorno
Crea o revisa el archivo `.env` en la raíz de `mfe3_inventario_frontend/`:
```properties
VITE_GRAPHQL_ENDPOINT=http://127.0.0.1:8003/graphql
```
*Si el backend está alojado en otro host o puerto, ajusta la URL en esta variable.*

---

### Paso 3: Instalar Dependencias
Instala los paquetes de Node.js necesarios:
```powershell
npm install
```

---

### Paso 4: Iniciar el Servidor de Desarrollo
Ejecuta el servidor Vite:
```powershell
npm run dev
```

**Salida esperada:**
```text
  VITE v5.4.10  ready in 450 ms

  ➜  Local:   http://localhost:3003/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Abre tu navegador en: **`http://localhost:3003`**.

---

### Paso 5: Compilación para Producción (Build & Preview)
Para verificar la compilación estática y la generación del manifiesto de federación `remoteEntry.js`:
```powershell
# 1. Compilar TypeScript y empaquetar con Vite
npm run build

# 2. Probar el servidor de previsualización en el puerto 3003
npm run preview
```
*Los archivos estáticos optimizados se generarán en la carpeta `dist/`.*
