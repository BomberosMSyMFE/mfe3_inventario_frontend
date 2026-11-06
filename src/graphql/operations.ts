import gql from 'graphql-tag';

// ====================================================================
// QUERIES DE INVENTARIO Y RECURSOS (MS-03)
// ====================================================================

// Query 1: Resuelve Over-fetching (auditoría específica de químicos)
export const AUDITORIA_STOCK_QUERY = gql`
  query AuditoriaStockGeneral($estacionId: ID) {
    auditoriaStockGeneral(estacionId: $estacionId) {
      id
      codigo
      nombre
      tipo
      litrosDisponibles
      lote
      fechaCaducidad
    }
  }
`;

// Query 2: Resuelve N+1 / Under-fetching (estación unificada con kits EPP y químicos)
export const INVENTARIO_ESTACION_QUERY = gql`
  query ObtenerInventarioEstacion($estacionId: ID!) {
    obtenerInventarioEstacion(estacionId: $estacionId) {
      estacionId
      nombreEstacion
      kitsDisponibles {
        id
        codigo
        presionOxigenoBares
        esSeguroParaCombate
        estado
        camionAsignadoId
      }
      suministrosQuimicos {
        id
        codigo
        nombre
        tipo
        litrosDisponibles
        lote
        fechaCaducidad
      }
    }
  }
`;

// Query 3: Consulta individual de kit EPP con validación de seguridad
export const CONSULTAR_KIT_EPP_QUERY = gql`
  query ConsultarKitEPP($codigo: String!) {
    consultarKitEPP(codigo: $codigo) {
      id
      codigo
      presionOxigenoBares
      esSeguroParaCombate
      estado
      camionAsignadoId
    }
  }
`;

// Query 4: Resumen de KPIs de Almacén para Dashboard Principal
export const RESUMEN_DASHBOARD_LOGISTICA_QUERY = gql`
  query ResumenDashboardLogistica {
    resumenDashboardLogistica {
      totalKits
      kitsSeguros
      totalQuimicosLitros
      totalHerramientas
      equiposMantenimiento
      reservasActivas
    }
  }
`;

// Query 5: Inventario General Unificado (Pestaña 1)
export const LISTAR_INVENTARIO_GENERAL_QUERY = gql`
  query ListarInventarioGeneral($categoria: String, $estado: String) {
    listarInventarioGeneral(categoria: $categoria, estado: $estado) {
      id
      codigo
      nombre
      categoria
      estado
      stockOVolumen
      unidadMedida
      detallesExtra
      estacionId
      requiereAtencion
    }
  }
`;

// Query 6: Listado de Equipos con Fatiga o Falla de Presión (Pestaña 4)
export const LISTAR_EQUIPOS_MANTENIMIENTO_QUERY = gql`
  query ListarEquiposMantenimiento {
    listarEquiposMantenimiento {
      id
      codigo
      nombre
      categoria
      estado
      stockOVolumen
      unidadMedida
      detallesExtra
      estacionId
      requiereAtencion
    }
  }
`;

// Query 7: Historial de Trazabilidad de Movimientos (Pestaña 3)
export const LISTAR_MOVIMIENTOS_QUERY = gql`
  query ListarMovimientos($limite: Int) {
    listarMovimientos(limite: $limite) {
      id
      tipoMovimiento
      itemCodigo
      itemNombre
      categoria
      cantidad
      motivo
      responsable
      createdAt
    }
  }
`;

// Query 8: Transacciones de Reserva y Rollback SAGA (Pestaña 2)
export const LISTAR_TRANSACCIONES_SAGA_QUERY = gql`
  query ListarTransaccionesSaga($estado: String) {
    listarTransaccionesSaga(estado: $estado) {
      transaccionId
      incidenteId
      camionId
      kitReservadoId
      litrosEspumogenoReservados
      estado
      createdAt
    }
  }
`;

// ====================================================================
// MUTACIONES TRANSACCIONALES SAGA (MS-01 <-> MS-03 <-> MS-02)
// ====================================================================

// Mutación SAGA 1: Paso 2 de Nataly (Reserva de Kit y Espumógeno)
export const RESERVAR_KIT_MUTATION = gql`
  mutation ReservarKitParaDespacho(
    $incidenteId: ID!
    $camionId: String!
    $litrosEspumogeno: Float!
  ) {
    reservarKitParaDespacho(
      incidenteId: $incidenteId
      camionId: $camionId
      litrosEspumogeno: $litrosEspumogeno
    ) {
      exito
      transaccionId
      materialesReservados
      mensaje
      codigoError
    }
  }
`;

// Mutación SAGA 2: Rollback Compensatorio de Nataly (Liberación si falla camión en MS-02)
export const LIBERAR_RESERVA_MUTATION = gql`
  mutation LiberarReservaCompensatoria($transaccionId: String!) {
    liberarReservaCompensatoria(transaccionId: $transaccionId) {
      exito
      mensaje
    }
  }
`;

// ====================================================================
// MUTACIONES CRUD DINÁMICAS Y CONTROL DE STOCK
// ====================================================================

// Registrar Insumo Químico (con Lote y Caducidad obligatorios)
export const REGISTRAR_INSUMO_QUIMICO_MUTATION = gql`
  mutation RegistrarInsumoQuimico(
    $codigo: String!
    $nombre: String!
    $tipo: TipoSuministro!
    $litrosDisponibles: Float!
    $lote: String!
    $fechaCaducidad: String!
    $estacionId: ID
  ) {
    registrarInsumoQuimico(
      codigo: $codigo
      nombre: $nombre
      tipo: $tipo
      litrosDisponibles: $litrosDisponibles
      lote: $lote
      fechaCaducidad: $fechaCaducidad
      estacionId: $estacionId
    ) {
      id
      codigo
      nombre
      tipo
      litrosDisponibles
      lote
      fechaCaducidad
    }
  }
`;

// Registrar Kit EPP (con Presión en Bares y regla de seguridad >= 250)
export const REGISTRAR_KIT_EPP_MUTATION = gql`
  mutation RegistrarKitEPP(
    $codigo: String!
    $presionOxigenoBares: Int!
    $estacionId: ID
  ) {
    registrarKitEPP(
      codigo: $codigo
      presionOxigenoBares: $presionOxigenoBares
      estacionId: $estacionId
    ) {
      id
      codigo
      presionOxigenoBares
      esSeguroParaCombate
      estado
      camionAsignadoId
    }
  }
`;

// Registrar Herramienta / Motobomba (con horas de uso y umbral de fatiga)
export const REGISTRAR_HERRAMIENTA_MUTATION = gql`
  mutation RegistrarHerramienta(
    $codigo: String!
    $nombre: String!
    $tipo: String!
    $horasUso: Float!
    $umbralFatigaHoras: Float!
    $estacionId: ID
  ) {
    registrarHerramienta(
      codigo: $codigo
      nombre: $nombre
      tipo: $tipo
      horasUso: $horasUso
      umbralFatigaHoras: $umbralFatigaHoras
      estacionId: $estacionId
    ) {
      id
      codigo
      nombre
      tipo
      horasUso
      umbralFatigaHoras
      requiereMantenimiento
      estado
      estacionId
    }
  }
`;

// Registrar Ajuste / Movimiento de Stock (Entradas, Salidas, Descartes)
export const REGISTRAR_MOVIMIENTO_STOCK_MUTATION = gql`
  mutation RegistrarMovimientoStock(
    $itemCodigo: String!
    $tipoMovimiento: String!
    $cantidad: Float!
    $motivo: String!
    $responsable: String
  ) {
    registrarMovimientoStock(
      itemCodigo: $itemCodigo
      tipoMovimiento: $tipoMovimiento
      cantidad: $cantidad
      motivo: $motivo
      responsable: $responsable
    ) {
      exito
      mensaje
      itemCodigo
    }
  }
`;

// Actualizar Horas de Uso en Operaciones
export const ACTUALIZAR_HORAS_USO_MUTATION = gql`
  mutation ActualizarHorasUsoHerramienta(
    $codigo: String!
    $horasAdicionales: Float!
  ) {
    actualizarHorasUsoHerramienta(
      codigo: $codigo
      horasAdicionales: $horasAdicionales
    ) {
      id
      codigo
      nombre
      horasUso
      umbralFatigaHoras
      requiereMantenimiento
      estado
    }
  }
`;

// Cambiar Estado Administrativo (Taller, Desinfección, Baja)
export const CAMBIAR_ESTADO_ITEM_MUTATION = gql`
  mutation CambiarEstadoItem(
    $codigo: String!
    $categoria: CategoriaItem!
    $nuevoEstado: EstadoMaterial!
  ) {
    cambiarEstadoItem(
      codigo: $codigo
      categoria: $categoria
      nuevoEstado: $nuevoEstado
    ) {
      exito
      mensaje
      itemCodigo
    }
  }
`;

// Retornar de Mantenimiento Preventivo (Reset de Horas o Recarga de Oxígeno)
export const RETORNAR_DE_MANTENIMIENTO_MUTATION = gql`
  mutation RetornarDeMantenimiento(
    $codigo: String!
    $categoria: CategoriaItem!
    $nuevaPresion: Int
    $reiniciarHoras: Boolean
  ) {
    retornarDeMantenimiento(
      codigo: $codigo
      categoria: $categoria
      nuevaPresion: $nuevaPresion
      reiniciarHoras: $reiniciarHoras
    ) {
      exito
      mensaje
      itemCodigo
    }
  }
`;

// Automatización n8n: Emisión de Alerta de Quiebre de Stock
export const EMITIR_ALERTA_N8N_MUTATION = gql`
  mutation EmitirAlertaQuiebreStockN8n($codigo: String!) {
    emitirAlertaQuiebreStockN8n(codigo: $codigo) {
      exito
      mensaje
      itemCodigo
    }
  }
`;
