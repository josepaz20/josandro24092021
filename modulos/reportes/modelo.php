<?php

// ********************** MODULO REPORTES **********************

require_once('../../servicios/accesoDatos.php');

date_default_timezone_set('America/Bogota');

class Reporte extends AccesoDatos {

    /**
     * Obtiene la informacion de todos los CLIENTES CORPORATIVOS registrados en el sistema. 
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     */
    public function getLlamadasCorp($filtro = "") {
        $this->consulta = "SELECT 
                            llamada.idLlamada, 
                            llamada.idHistorial, 
                            CONCAT(empleado.nombres, ' ', empleado.apellidos) AS atendidaPor,  
                            llamada.idCorporativo, 
                            corporativo.razonSocial, 
                            municipio.nombreMcpo, 
                            tipo_llamada.tipo, 
                            llamada.fechaRecibido, 
                            (SELECT cierre.fechaCierre FROM cierre WHERE cierre.idLlamada = llamada.idLlamada LIMIT 1) AS fechaCierre, 
                            llamada.fechaSolucion, 
                            llamada.prioridad, 
                            llamada.asunto, 
                            llamada.reiteracion, 
                            llamada.estado 
                           FROM llamada 
                           INNER JOIN empleado ON llamada.idEmpleado = empleado.idEmpleado 
                           INNER JOIN corporativo ON llamada.idCorporativo = corporativo.idCorporativo 
                           INNER JOIN tipo_llamada ON tipo_llamada.idTipoLlamada = llamada.idTipoLlamada 
                           INNER JOIN municipio ON llamada.idMcpo = municipio.idMcpo";
        if ($filtro != '') {
            $this->consulta .= $filtro;
        }
//        echo "$this->consulta";
        $numRegistros = $this->consultarBD('llamadas_BD');
        $this->mensaje = "REGISTROS ENCONTRADOS: <b>$numRegistros</b>";
        if ($numRegistros > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Obtiene la informacion de todos los CLIENTES CORPORATIVOS registrados en el sistema. 
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     */
    public function getLlamadasRes($filtro = "") {
        $this->consulta = "SELECT 
                            llamada.idLlamada, 
                            llamada.idHistorial, 
                            CONCAT(empleado.nombres, ' ', empleado.apellidos) AS atendidaPor,  
                            llamada.idResidencial, 
                            CONCAT(residencial.nombres, ' ', residencial.apellidos) AS cliente, 
                            municipio.nombreMcpo, 
                            tipo_llamada.tipo, 
                            llamada.fechaRecibido, 
                            (SELECT cierre.fechaCierre FROM cierre WHERE cierre.idLlamada = llamada.idLlamada LIMIT 1) AS fechaCierre, 
                            llamada.fechaSolucion, 
                            llamada.prioridad, 
                            llamada.asunto, 
                            llamada.reiteracion, 
                            llamada.estado 
                           FROM llamada 
                           INNER JOIN empleado ON llamada.idEmpleado = empleado.idEmpleado 
                           INNER JOIN residencial ON llamada.idResidencial = residencial.idResidencial 
                           INNER JOIN tipo_llamada ON tipo_llamada.idTipoLlamada = llamada.idTipoLlamada 
                           INNER JOIN municipio ON llamada.idMcpo = municipio.idMcpo";
        if ($filtro != '') {
            $this->consulta .= $filtro;
        }
//        echo "$this->consulta";
        $numRegistros = $this->consultarBD('llamadas_BD');
        $this->mensaje = "REGISTROS ENCONTRADOS: <b>$numRegistros</b>";
        if ($numRegistros > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Obtiene la informacion de todos los CLIENTES CORPORATIVOS registrados en el sistema. 
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     */
    public function getOrdenesCorp($filtro = "") {
        $this->consulta = "SELECT 
                            asignaciones.idAsignada, 
                            (SELECT CONCAT(empleado.nombres, ' ', empleado.apellidos) FROM empleado WHERE empleado.idEmpleado = asignaciones.idAsignador LIMIT 1) AS asignador,
                            IF(asignaciones.idAsignado IS NOT NULL, 
                                (SELECT CONCAT(empleado.nombres, ' ', empleado.apellidos) FROM empleado WHERE empleado.idEmpleado = asignaciones.idAsignado LIMIT 1), 
                                'NO ASIGNADO'
                              ) AS asignado, 
                            municipio.nombreMcpo, 
                            corporativo.razonSocial, 
                            asignaciones.motivo, 
                            asignaciones.descripcion, 
                            asignaciones.fechaAsignacion, 
                            asignaciones.estado 
                           FROM asignaciones 
                           INNER JOIN corporativo ON asignaciones.idCorporativo = corporativo.idCorporativo 
                           INNER JOIN municipio ON asignaciones.idMcpo = municipio.idMcpo";
        if ($filtro != '') {
            $this->consulta .= $filtro;
        }
//        echo "$this->consulta";
        $numRegistros = $this->consultarBD('llamadas_BD');
        $this->mensaje = "REGISTROS ENCONTRADOS: <b>$numRegistros</b>";
        if ($numRegistros > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Obtiene la informacion de todos los CLIENTES CORPORATIVOS registrados en el sistema. 
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     */
    public function getOrdenesRes($filtro = "") {
        $this->consulta = "SELECT 
                            asignaciones.idAsignada, 
                            (SELECT CONCAT(empleado.nombres, ' ', empleado.apellidos) FROM empleado WHERE empleado.idEmpleado = asignaciones.idAsignador LIMIT 1) AS asignador,
                            IF(asignaciones.idAsignado IS NOT NULL, 
                                (SELECT CONCAT(empleado.nombres, ' ', empleado.apellidos) FROM empleado WHERE empleado.idEmpleado = asignaciones.idAsignado LIMIT 1), 
                                'NO ASIGNADO'
                              ) AS asignado, 
                            municipio.nombreMcpo, 
                            CONCAT(residencial.nombres, ' ', residencial.apellidos) AS cliente, 
                            asignaciones.motivo, 
                            asignaciones.descripcion, 
                            asignaciones.fechaAsignacion, 
                            asignaciones.estado 
                           FROM asignaciones 
                           INNER JOIN residencial ON asignaciones.idResidencial = residencial.idResidencial 
                           INNER JOIN municipio ON asignaciones.idMcpo = municipio.idMcpo";
        if ($filtro != '') {
            $this->consulta .= $filtro;
        }
//        echo "$this->consulta";
        $numRegistros = $this->consultarBD('llamadas_BD');
        $this->mensaje = "REGISTROS ENCONTRADOS: <b>$numRegistros</b>";
        if ($numRegistros > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Obtiene la informacion de todos los CLIENTES CORPORATIVOS registrados en el sistema. 
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     */
    public function buscarResidencial($filtro = '') {
        $this->consulta = "SELECT 
        residencial.idResidencial,
        residencial.cedula AS identificacion,
        CONCAT(residencial.nombres, ' ', residencial.apellidos) AS cliente
        FROM residencial
        WHERE $filtro LIMIT 1";
//        echo $this->consulta;
        return $this->consultarBD();
    }

    public function buscarCorporativo($filtro = '') {
        $this->consulta = "SELECT 
        corporativo.idCorporativo,
        corporativo.nit AS identificacion,
        razonSocial AS cliente
        FROM corporativo
        WHERE $filtro LIMIT 1";
        //echo $this->consulta;
        return $this->consultarBD();
    }

    public function getFacturasCorp($filtro = "") {
        $this->consulta = "SELECT
        factura.idFactura,
        CONCAT(
        prefijo.prefijo,
        factura.consecutivo
        ) AS codigo,
        corporativo.idCorporativo,
        corporativo.razonSocial,
        municipio.nombreMcpo,
        factura.totalFactura,
        factura.baseImponible,
        factura.deuda,
        factura.abono,
        factura.saldoAbonos,
        factura.periodoFacturado,
        factura.anioFacturado,
        factura.estado,
        factura.enviada,
        factura.tipoCliente
        FROM factura
        INNER JOIN prefijo ON factura.idPrefijo = prefijo.idPrefijo
        INNER JOIN corporativo ON factura.idCorporativo = corporativo.idCorporativo
        INNER JOIN municipio ON corporativo.idMcpo = municipio.idMcpo";
        if ($filtro != '') {
            $this->consulta .= $filtro;
        }
//        echo "$this->consulta";
        $numRegistros = $this->consultarBD();
        $this->mensaje = "REGISTROS ENCONTRADOS: <b>$numRegistros</b>";
        if ($numRegistros > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Obtiene la informacion de todos los CLIENTES CORPORATIVOS registrados en el sistema. 
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     */
    public function getFacturasRes($filtro = "") {
        $this->consulta = "SELECT
        factura.idFactura,
        CONCAT(
        prefijo.prefijo,
        factura.consecutivo
        ) AS codigo,
        CONCAT(residencial.nombres, ' ', residencial.apellidos) AS razonSocial,
        municipio.nombreMcpo,
        factura.totalFactura,
        factura.baseImponible,
        factura.deuda,
        factura.abono,
        factura.saldoAbonos,
        factura.periodoFacturado,
        factura.anioFacturado,
        factura.estado,
        factura.enviada,
        factura.tipoCliente
        FROM factura
        INNER JOIN prefijo ON factura.idPrefijo = prefijo.idPrefijo
        INNER JOIN residencial ON factura.idResidencial = residencial.idResidencial
        INNER JOIN municipio ON residencial.idMcpo = municipio.idMcpo";
        if ($filtro != '') {
            $this->consulta .= $filtro;
        }
//        echo "$this->consulta";
        $numRegistros = $this->consultarBD();
        $this->mensaje = "REGISTROS ENCONTRADOS: <b>$numRegistros</b>";
        if ($numRegistros > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Obtiene la informacion de todos los CLIENTES CORPORATIVOS registrados en el sistema. 
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     */
    public function getRecaudosCorp($filtro = "") {
        $this->consulta = "SELECT
        recaudo.idRecaudo,
        corporativo.idCorporativo,
        corporativo.razonSocial AS cliente,
        CONCAT(empleado.primerNombre, ' ', empleado.primerApellido) AS empleado,
        IF(recaudo.idFactura IS NOT NULL,
        (SELECT factura.periodoFacturado FROM factura WHERE factura.idFactura = recaudo.idFactura LIMIT 1),
        'SIN PERIODO'
        ) AS periodo,
        recaudo.fechaHoraRecaudo,
        recaudo.concepto,
        recaudo.valorRecaudo,
        recaudo.tipoRecaudo
        FROM recaudo
        INNER JOIN corporativo ON recaudo.idCorporativo = corporativo.idCorporativo
        INNER JOIN empleado ON recaudo.idEmpleado = empleado.idEmpleado";
        if ($filtro != '') {
            $this->consulta .= $filtro;
        }
//        echo $this->consulta;
        $numRegistros = $this->consultarBD();
        $this->mensaje = "REGISTROS ENCONTRADOS: <b>$numRegistros</b>";
        if ($numRegistros > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Obtiene la informacion de todos los CLIENTES CORPORATIVOS registrados en el sistema. 
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     */
    public function getRecaudosRes($filtro = "") {
        $this->consulta = "SELECT
        recaudo.idRecaudo,
        CONCAT(residencial.nombres, ' ', residencial.apellidos) AS cliente,
        CONCAT(empleado.primerNombre, ' ', empleado.primerApellido) AS empleado,
        IF(recaudo.idFactura IS NOT NULL,
        (SELECT factura.periodoFacturado FROM factura WHERE factura.idFactura = recaudo.idFactura LIMIT 1),
        'SIN PERIODO'
        ) AS periodo,
        recaudo.fechaHoraRecaudo,
        recaudo.concepto,
        recaudo.valorRecaudo,
        recaudo.tipoRecaudo
        FROM recaudo
        INNER JOIN residencial ON recaudo.idResidencial = residencial.idResidencial
        INNER JOIN empleado ON recaudo.idEmpleado = empleado.idEmpleado";
        if ($filtro != '') {
            $this->consulta .= $filtro;
        }
//        echo "$this->consulta";
        $numRegistros = $this->consultarBD();
        $this->mensaje = "REGISTROS ENCONTRADOS: <b>$numRegistros</b>";
        if ($numRegistros > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Obtiene la informacion de todos los CLIENTES CORPORATIVOS registrados en el sistema. 
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     */
    public function getCorporativo($filtro = "") {
        $this->consulta = "SELECT
        corporativo.idCorporativo AS idCliente,
        cuenta.idCuenta,
        corporativo.razonSocial AS cliente,
        CONCAT(municipio.nombreMcpo, ' - ', departamento.nombreDpto) as ubicacion
        FROM corporativo
        INNER JOIN cuenta ON corporativo.idCorporativo = cuenta.idCorporativo
        INNER JOIN municipio ON corporativo.idMcpo = municipio.idMcpo
        INNER JOIN departamento ON municipio.idDpto = departamento.idDpto";
        if ($filtro != '') {
            $this->consulta .= $filtro;
        }
//        echo "$this->consulta";
        if ($this->consultarBD() > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Obtiene la informacion de todos los CLIENTES CORPORATIVOS registrados en el sistema. 
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     */
    public function getResidencial($filtro = "") {
        $this->consulta = "SELECT
        residencial.idResidencial AS idCliente,
        cuenta.idCuenta,
        CONCAT(residencial.nombres, ' ', residencial.apellidos) AS cliente,
        CONCAT(municipio.nombreMcpo, ' - ', departamento.nombreDpto) AS ubicacion
        FROM residencial
        INNER JOIN cuenta ON residencial.idResidencial = cuenta.idResidencial
        INNER JOIN municipio ON residencial.idMcpo = municipio.idMcpo
        INNER JOIN departamento ON municipio.idDpto = departamento.idDpto";
        if ($filtro != '') {
            $this->consulta .= $filtro;
        }
//        echo "$this->consulta";
        if ($this->consultarBD() > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Obtiene la informacion de todos los CLIENTES CORPORATIVOS registrados en el sistema. 
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     */
    public function getContratosCorpRptContratacion($filtro = '') {
        $this->consulta = "SELECT
        contrato.idContrato,
        corporativo.idCorporativo,
        corporativo.razonSocial AS cliente,
        contrato.estado
        FROM contrato
        INNER JOIN corporativo ON contrato.idCorporativo = corporativo.idCorporativo";
        if ($filtro != '') {
            $this->consulta .= $filtro;
        }
        if ($this->consultarBD() > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Obtiene la informacion de todos los CLIENTES CORPORATIVOS registrados en el sistema. 
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     */
    public function getContratosResRptContratacion($filtro = '') {
        $this->consulta = "SELECT
        contrato.idContrato,
        residencial.idResidencial,
        CONCAT(residencial.nombres, ' ', residencial.apellidos) AS cliente,
        contrato.estado
        FROM contrato
        INNER JOIN residencial ON contrato.idResidencial = residencial.idResidencial";
        if ($filtro != '') {
            $this->consulta .= $filtro;
        }
        if ($this->consultarBD() > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Obtiene la informacion de todos los CLIENTES CORPORATIVOS registrados en el sistema. 
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     */
    public function getServiciosRptContratacion($filtro = '') {
        $this->consulta = "SELECT
        servicio.idServicio,
        servicio.conceptoFacturacion,
        CONCAT(municipio.nombreMcpo, '-', departamento.nombreDpto) AS ubicacion,
        servicio.fechaInicio,
        servicio.fechaFin,
        servicio.duracion,
        plan_internet.totalPago,
        servicio.estado
        FROM servicio
        INNER JOIN municipio ON servicio.idMcpo = municipio.idMcpo
        INNER JOIN departamento ON municipio.idDpto = departamento.idDpto
        INNER JOIN internet ON servicio.idServicio = internet.idServicio
        INNER JOIN plan_internet ON internet.idPlanInternet = plan_internet.idPlanInternet";
        if ($filtro != '') {
            $this->consulta .= $filtro;
        }
        if ($this->consultarBD() > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Obtiene la informacion de todos los CLIENTES CORPORATIVOS registrados en el sistema. 
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     */
    public function getFacturasRptContratacion($filtro = '') {
        $this->consulta = "SELECT
        factura.idFactura,
        CONCAT(prefijo.prefijo, factura.consecutivo) AS NUM_FACTURA,
        factura.periodoFacturado,
        factura.anioFacturado,
        factura.totalFactura,
        factura.estado
        FROM factura
        INNER JOIN prefijo ON factura.idPrefijo = prefijo.idPrefijo";
        if ($filtro != '') {
            $this->consulta .= $filtro;
        }
        if ($this->consultarBD() > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function getEmpleadosNovedades($mes = 0) {
        $this->consulta = "SELECT
        empleado.idEmpleado,
        empleado.cedula,
        CONCAT(empleado.primerApellido, ' ', empleado.segundoApellido) AS apellidos,
        CONCAT(empleado.primerNombre, ' ', empleado.segundoNombre) AS nombres,
        CONCAT(empleado.primerApellido, ' ', empleado.segundoApellido, ' ', empleado.primerNombre, ' ', empleado.segundoNombre) AS empleado
        FROM empleado
        INNER JOIN asistencia ON empleado.idEmpleado = asistencia.idEmpleado
        WHERE empleado.estado = 'Activo'
        AND MONTH(asistencia.fechaAsistencia) = $mes
        GROUP BY empleado.idEmpleado
        ORDER BY empleado";
        if ($this->consultarBD() > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function getNovedades($idEmpleado = 0, $labora = 0, $mes = 0, $anio = 0, $asiste = 0) {
        $this->consulta = "SELECT
        COUNT(asistencia.idAsistencia) AS dias
        FROM asistencia
        WHERE asistencia.asiste = $asiste
        AND asistencia.labora = $labora
        AND MONTH(asistencia.fechaAsistencia) = $mes
        AND YEAR(asistencia.fechaAsistencia) = $anio
        AND asistencia.idEmpleado = $idEmpleado";
        if ($this->consultarBD() > 0) {
            if ($this->registros[0]['dias'] != NULL) {
                return $this->registros[0]['dias'];
            } else {
                return 0;
            }
        } else {
            return 999;
        }
    }

    /**
     * Obtiene la informacion de todos los CLIENTES CORPORATIVOS registrados en el sistema. 
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     */
    public function getAsistenciaRptNovedades($filtro = '') {
        $this->consulta = "SELECT
        asistencia.fechaAsistencia,
        CONCAT(empleado.nombres, ' ', empleado.apellidos) AS empleado,
        IF(asistencia.asiste = 1, 'SI', 'NO') AS asiste,
        CASE asistencia.labora
        WHEN 1 THEN 'Dia Completo'
        WHEN 2 THEN 'Medio Dia'
        WHEN 3 THEN '1/4 de Dia'
        END AS labora,
        asistencia.observacion,
        asistencia.fechaHoraReg,
        asistencia.registradoPor
        FROM asistencia
        INNER JOIN empleado ON asistencia.idEmpleado = empleado.idEmpleado";
        if ($filtro != '') {
            $this->consulta .= $filtro;
        }
        if ($this->consultarBD() > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Obtiene la informacion de todos los CLIENTES CORPORATIVOS registrados en el sistema. 
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     */
    public function getNumFactura($idRecaudo = 0) {
        $this->consulta = "SELECT factura.consecutivo AS NUM_FACTURA
        FROM recaudo
        INNER JOIN factura ON recaudo.idFactura = factura.idFactura
        INNER JOIN prefijo ON factura.idPrefijo = prefijo.idPrefijo
        WHERE recaudo.idRecaudo = $idRecaudo
        LIMIT 1";
        if ($this->consultarBD() > 0) {
            return $this->registros[0]['NUM_FACTURA'];
        } else {
            return 0;
        }
    }

    /**
     * Obtiene la informacion de todos los CLIENTES CORPORATIVOS registrados en el sistema. 
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     */
    public function buscarEnCajaBancos($numFactura = '') {
        $this->consulta = "SELECT CONCAT(movimiento_caja_personal.idMovimiento, '@', caja_personal.idCaja) AS ID_MOVIMIENTO
        FROM movimiento_caja_personal
        INNER JOIN caja_personal ON movimiento_caja_personal.idCajaPersonal = caja_personal.idCajaPersonal
        WHERE movimiento_caja_personal.concepto LIKE 'Pago Factura_$numFactura%'
        AND movimiento_caja_personal.idCajaPersonal = 84
        LIMIT 1";
//        echo $this->consulta;
        if ($this->consultarBD('ModuloFinanciero_BD') > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function buscarEnCajaRecaudos($numFactura = '') {
        $this->consulta = "SELECT CONCAT(movimiento_caja_personal.idMovimiento, '@', caja_personal.idCaja) AS ID_MOVIMIENTO
        FROM movimiento_caja_personal
        INNER JOIN caja_personal ON movimiento_caja_personal.idCajaPersonal = caja_personal.idCajaPersonal
        WHERE movimiento_caja_personal.concepto LIKE 'Pago Factura_$numFactura%'
        AND caja_personal.idTipoCaja = 2
        LIMIT 1";
//        echo $this->consulta;
        if ($this->consultarBD('ModuloFinanciero_BD') > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function getRutaRespaldo($idMovimiento = 0, $idCaja = 0) {
        $this->consulta = "SELECT
        respaldo.ruta
        FROM respaldo
        INNER JOIN respaldo_caja ON respaldo.idRespaldo = respaldo_caja.idRespaldo
        WHERE respaldo_caja.idMovimiento = $idMovimiento";
        if ($idCaja != 0) {
            $this->consulta .= " AND respaldo_caja.idCaja = $idCaja";
        }
//        echo $this->consulta;
        if ($this->consultarBD('ModuloFinanciero_BD') > 0) {
            return $this->registros[0]['ruta'];
        } else {
            return 'NO ENCONTRADA';
        }
    }

    public function getInformeRecaudosCorp($filtro = '') {
        $this->consulta = "SELECT
        recaudo.idRecaudo,
        CONCAT(empleado.nombres, ' ', empleado.apellidos) AS empleado,
        corporativo.razonSocial AS cliente,
        recaudo.tipoCliente,
        recaudo.idFactura,
        CONCAT(prefijo.prefijo, factura.consecutivo) AS numeroFactura,
        recaudo.fechaHoraRecaudo,
        recaudo.fechaPago,
        recaudo.fechaCobro,
        recaudo.concepto,
        factura.baseImponible AS VLR_BASE,
        factura.ivaPago AS VLR_IVA,
        factura.deuda AS DEUDA,
        factura.descuento AS DESCUENTO,
        factura.vlrProntoPago_1 AS VLR_PRONTO_PAGO,
        factura.totalFactura AS VLR_TOTAL,
        (SELECT SUM(nota_debito.totalPago) FROM nota_debito WHERE nota_debito.idFactura = factura.idFactura) AS DESCUENTO_1,
        recaudo.valorRecaudo,
        recaudo.vlrReteIVA,
        recaudo.vlrReteFuente,
        recaudo.vlrReteICA,
        recaudo.vlrEstampillas,
        recaudo.vlrOtrosDescuentos,
        recaudo.tipoRecaudo
        FROM recaudo
        INNER JOIN empleado ON recaudo.idEmpleado = empleado.idEmpleado
        INNER JOIN corporativo ON recaudo.idCorporativo = corporativo.idCorporativo
        INNER JOIN factura ON recaudo.idFactura = factura.idFactura
        INNER JOIN prefijo ON factura.idPrefijo = prefijo.idPrefijo";
        if ($filtro != '') {
            $this->consulta .= " $filtro";
        }
        if ($this->consultarBD() > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function getInformeRecaudosRes($filtro = '') {
        $this->consulta = "SELECT
        recaudo.idRecaudo,
        CONCAT(empleado.nombres, ' ', empleado.apellidos) AS empleado,
        CONCAT(residencial.apellidos, ' ', residencial.nombres) AS cliente,
        recaudo.tipoCliente,
        recaudo.idFactura,
        CONCAT(prefijo.prefijo, factura.consecutivo) AS numeroFactura,
        recaudo.fechaHoraRecaudo,
        recaudo.fechaPago,
        recaudo.fechaCobro,
        recaudo.concepto,
        factura.baseImponible AS VLR_BASE,
        factura.ivaPago AS VLR_IVA,
        factura.deuda AS DEUDA,
        factura.descuento AS DESCUENTO,
        factura.vlrProntoPago_1 AS VLR_PRONTO_PAGO,
        factura.totalFactura AS VLR_TOTAL,
        (SELECT SUM(nota_debito.totalPago) FROM nota_debito WHERE nota_debito.idFactura = factura.idFactura) AS DESCUENTO_1,
        recaudo.valorRecaudo,
        recaudo.vlrReteIVA,
        recaudo.vlrReteFuente,
        recaudo.vlrReteICA,
        recaudo.vlrEstampillas,
        recaudo.vlrOtrosDescuentos,
        recaudo.tipoRecaudo
        FROM recaudo
        INNER JOIN empleado ON recaudo.idEmpleado = empleado.idEmpleado
        INNER JOIN residencial ON recaudo.idResidencial = residencial.idResidencial
        INNER JOIN factura ON recaudo.idFactura = factura.idFactura
        INNER JOIN prefijo ON factura.idPrefijo = prefijo.idPrefijo";
        if ($filtro != '') {
            $this->consulta .= " $filtro";
        }
        if ($this->consultarBD() > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function buscarRecaudoEnCajaMenor($fechaHora = '') {
        $this->consulta = "SELECT concepto, valor FROM movimiento_caja_menor WHERE fechaHora = '$fechaHora' LIMIT 1";
        if ($this->consultarBD('ModuloFinanciero_BD') > 0) {
            return true;
        } else {
            $fechaHora_1 = substr($fechaHora, 0, strlen($fechaHora) - 1);
            $this->consulta = "SELECT concepto, valor FROM movimiento_caja_menor WHERE fechaHora LIKE '$fechaHora_1%' LIMIT 1";
            if ($this->consultarBD('ModuloFinanciero_BD') > 0) {
                return true;
            } else {
                return false;
            }
        }
    }

    public function buscarRecaudoEnCajaRecaudos($fechaHora = '') {
        $this->consulta = "SELECT idCajaPersonal, concepto, valor FROM movimiento_caja_personal WHERE fechaHora = '$fechaHora' LIMIT 1";
        if ($this->consultarBD('ModuloFinanciero_BD') > 0) {
            return true;
        } else {
            $fechaHora_1 = substr($fechaHora, 0, strlen($fechaHora) - 1);
            $this->consulta = "SELECT idCajaPersonal, concepto, valor FROM movimiento_caja_personal WHERE fechaHora LIKE '$fechaHora_1%' LIMIT 1";
            if ($this->consultarBD('ModuloFinanciero_BD') > 0) {
                return true;
            } else {
                return false;
            }
        }
    }

    public function getInformeFacturadoCorp($numMes = 0, $anio = 0, $estado = '', $negacion = '', $admin = false) {
        $this->consulta = "SELECT
        CONCAT(prefijo.prefijo, factura.consecutivo) AS NUM_FACTURA,
        factura.fechaEmision AS FECHA_EXPEDICION,
        factura.baseImponible AS VLR_BASE,
        factura.ivaPago AS VLR_IVA,
        factura.deuda AS DEUDA,
        factura.descuento AS DESCUENTO,
        (SELECT SUM(nota_debito.totalPago) FROM nota_debito WHERE nota_debito.idFactura = factura.idFactura) AS DESCUENTO_1,
        factura.totalFactura AS VLR_TOTAL,
        factura.periodoFacturado AS PERIODO_FACTURADO,
        corporativo.razonSocial AS CLIENTE,
        corporativo.nit AS IDENTIFICACION,
        factura.estado AS ESTADO_FACTURA
        FROM factura
        INNER JOIN prefijo ON factura.idPrefijo = prefijo.idPrefijo
        INNER JOIN corporativo ON factura.idCorporativo = corporativo.idCorporativo
        WHERE MONTH(factura.fechaEmision) = $numMes
        AND YEAR(factura.fechaEmision) = $anio
        AND factura.estado = '$estado'
        AND corporativo.clasificacion $negacion = 1";
        if ($negacion == '' && !$admin) {
            $this->consulta .= " AND corporativo.idCorporativo != 490
        AND corporativo.idCorporativo != 553
        AND corporativo.idCorporativo != 334";
        }
        if ($this->consultarBD() > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function getInformeFacturadoRes($numMes = 0, $anio = 0, $estado = '') {
        $this->consulta = "SELECT
        CONCAT(prefijo.prefijo, factura.consecutivo) AS NUM_FACTURA,
        factura.fechaEmision AS FECHA_EXPEDICION,
        factura.baseImponible AS VLR_BASE,
        factura.ivaPago AS VLR_IVA,
        factura.deuda AS DEUDA,
        factura.descuento AS DESCUENTO,
        (SELECT SUM(nota_debito.totalPago) FROM nota_debito WHERE nota_debito.idFactura = factura.idFactura) AS DESCUENTO_1,
        factura.totalFactura AS VLR_TOTAL,
        factura.periodoFacturado AS PERIODO_FACTURADO,
        CONCAT(residencial.nombres, ' ', residencial.apellidos) AS CLIENTE,
        residencial.cedula AS IDENTIFICACION,
        factura.estado AS ESTADO_FACTURA
        FROM factura
        INNER JOIN prefijo ON factura.idPrefijo = prefijo.idPrefijo
        INNER JOIN residencial ON factura.idResidencial = residencial.idResidencial
        WHERE MONTH(factura.fechaEmision) = $numMes
        AND YEAR(factura.fechaEmision) = $anio
        AND factura.estado = '$estado'";
        if ($this->consultarBD() > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function getReporteVentasCorp($fechaHoy = '', $mes = 0, $anio = 0) {
        $this->consulta = "SELECT
        corporativo.idCorporativo AS ID_CLIENTE,
        corporativo.nit AS IDENTIFICACION,
        corporativo.razonSocial AS CLIENTE,
        corporativo.celular1 AS CELULAR1,
        corporativo.celular2 AS CELULAR2,
        corporativo.telefono AS TELEFONO,
        servicio.conceptoFacturacion AS SERVICIO,
        plan_internet.velBajada AS VEL_BAJADA,
        plan_internet.velSubida AS VEL_SUBIDA,
        (SELECT CONCAT(municipio.nombreMcpo, '-', departamento.nombreDpto) FROM municipio INNER JOIN departamento ON municipio.idDpto = departamento.idDpto WHERE municipio.idMcpo = servicio.idMcpo) AS UBICACION,
        servicio.dirInstalacion AS DIR_INSTALACION,
        servicio.fechaInicio AS FECHA_INICIO,
        servicio.duracion AS DURACION,
        servicio.fechaActivacion AS FECHA_ACTIVACION,
        plan_internet.totalPago AS VALOR_MENSUAL,
        servicio.valorInstalacion AS VALOR_INSTALACION,
        ((plan_internet.totalPago * servicio.duracion) + servicio.valorInstalacion) AS VLR_TOTAL_CONTRATO,
        servicio.registradoPor AS REGISTRADO_POR,
        (SELECT CONCAT(empleado.primerNombre, ' ', empleado.primerApellido, ' ', empleado.segundoApellido) FROM empleado WHERE empleado.idEmpleado = contrato.registradoPor LIMIT 1) AS REGISTRADO_POR_CONTRATO,
        servicio.fechaHoraReg AS FECHA_HORA_REG,
        servicio.estado AS ESTADO_SERVICIO,
        contrato.estado AS ESTADO_CONTRATO,
        IF(servicio.tvanaloga = 1, 'ANALOGA', IF((SELECT COUNT(servicio_tv.idServicioTv) FROM servicio_tv WHERE servicio_tv.idServicio = servicio.idServicio AND servicio_tv.estado = 'Registrado') > 0, 'DIGITAL', 'SIN TV')) AS TELEVISION,
        servicio.observacion AS OBSERVACION,
        servicio.motivoelimina AS MOTIVO_ELIMINA,
        servicio.observacionelimina AS OBSERVACION_ELIMINA,
        contrato.legalizadopor AS LEGALIZADO_POR,
        contrato.fechahoraleg AS FECHA_LEGAL
        FROM servicio
        INNER JOIN contrato ON contrato.idContrato = servicio.idContrato
        INNER JOIN corporativo ON corporativo.idCorporativo = contrato.idCorporativo
        INNER JOIN internet ON servicio.idServicio = internet.idServicio
        INNER JOIN plan_internet ON internet.idPlanInternet = plan_internet.idPlanInternet ";
        if ($fechaHoy != '' && $mes == 0 && $anio == 0) {
            $this->consulta .= " AND DATE(servicio.fechaHoraReg) = '$fechaHoy'";
        } else {
            $this->consulta .= " AND YEAR(servicio.fechaHoraReg) = $anio AND MONTH(servicio.fechaHoraReg) = $mes";
        }
//        $this->consulta .= " AND servicio.fechaHoraReg >= '2021-01-01 00:00:00'";
//        echo $this->consulta;
        $this->consultarBD();
        return $this->registros;
    }

    public function getReporteVentasRes($fechaHoy = '', $mes = 0, $anio = 0) {
        $this->consulta = "SELECT
        residencial.idResidencial AS ID_CLIENTE,
        residencial.cedula AS IDENTIFICACION,
        residencial.celular1 AS CELULAR1,
        residencial.celular2 AS CELULAR2,
        residencial.telefono AS TELEFONO,
        CONCAT(residencial.apellidos, ' ', residencial.nombres) AS CLIENTE,
        servicio.conceptoFacturacion AS SERVICIO,
        plan_internet.velBajada AS VEL_BAJADA,
        plan_internet.velSubida AS VEL_SUBIDA,
        (SELECT CONCAT(municipio.nombreMcpo, '-', departamento.nombreDpto) FROM municipio INNER JOIN departamento ON municipio.idDpto = departamento.idDpto WHERE municipio.idMcpo = servicio.idMcpo) AS UBICACION,
        servicio.dirInstalacion AS DIR_INSTALACION,
        servicio.fechaActivacion AS FECHA_ACTIVACION,
        servicio.fechaInicio AS FECHA_INICIO,
        servicio.duracion AS DURACION,
        plan_internet.totalPago AS VALOR_MENSUAL,
        servicio.valorInstalacion AS VALOR_INSTALACION,
        ((plan_internet.totalPago * servicio.duracion) + servicio.valorInstalacion) AS VLR_TOTAL_CONTRATO,
        servicio.registradoPor AS REGISTRADO_POR,
        (SELECT CONCAT(empleado.primerNombre, ' ', empleado.primerApellido, ' ', empleado.segundoApellido) FROM empleado WHERE empleado.idEmpleado = contrato.registradoPor LIMIT 1) AS REGISTRADO_POR_CONTRATO,
        servicio.fechaHoraReg AS FECHA_HORA_REG,
        servicio.estado AS ESTADO_SERVICIO,
        contrato.estado AS ESTADO_CONTRATO,
        IF(servicio.tvanaloga = 1, 'ANALOGA', IF((SELECT COUNT(servicio_tv.idServicioTv) FROM servicio_tv WHERE servicio_tv.idServicio = servicio.idServicio AND servicio_tv.estado = 'Registrado') > 0, 'DIGITAL', 'SIN TV')) AS TELEVISION,
        servicio.observacion AS OBSERVACION,
        servicio.motivoelimina AS MOTIVO_ELIMINA,
        servicio.observacionelimina AS OBSERVACION_ELIMINA,
        contrato.legalizadopor AS LEGALIZADO_POR,
        contrato.fechahoraleg AS FECHA_LEGAL
        FROM servicio
        INNER JOIN contrato ON contrato.idContrato = servicio.idContrato
        INNER JOIN residencial ON residencial.idResidencial = contrato.idResidencial
        INNER JOIN internet ON servicio.idServicio = internet.idServicio
        INNER JOIN plan_internet ON internet.idPlanInternet = plan_internet.idPlanInternet ";
        if ($fechaHoy != '' && $mes == 0 && $anio == 0) {
            $this->consulta .= " AND DATE(servicio.fechaHoraReg) = '$fechaHoy'";
        } else {
            $this->consulta .= " AND YEAR(servicio.fechaHoraReg) = $anio AND MONTH(servicio.fechaHoraReg) = $mes";
        }
//        $this->consulta .= " AND servicio.fechaHoraReg >= '2021-01-01 00:00:00'";
        $this->consultarBD();
        return $this->registros;
    }

    public function getInfoReporteIngresos($fechaInicio = '0000-00-00', $fechaFin = '0000-00-00', $segmento = '') {
        $this->consulta = "SELECT
        IF(factura.idCorporativo IS NULL, (SELECT CONCAT(residencial.nombres, ' ', residencial.apellidos) FROM residencial WHERE residencial.idResidencial = factura.idResidencial LIMIT 1), (SELECT corporativo.razonSocial FROM corporativo WHERE corporativo.idCorporativo = factura.idCorporativo LIMIT 1)) AS CLIENTE,
        IF(factura.idCorporativo IS NULL, (SELECT residencial.cedula FROM residencial WHERE residencial.idResidencial = factura.idResidencial LIMIT 1), (SELECT corporativo.nit FROM corporativo WHERE corporativo.idCorporativo = factura.idCorporativo LIMIT 1)) AS IDENTIFICACION,
        IF(factura.idCorporativo IS NULL, (SELECT municipio.nombreMcpo FROM municipio INNER JOIN residencial ON municipio.idMcpo = residencial.idMcpo WHERE residencial.idResidencial = factura.idResidencial LIMIT 1), (SELECT municipio.nombreMcpo FROM municipio INNER JOIN corporativo ON municipio.idMcpo = corporativo.idMcpo WHERE corporativo.idCorporativo = factura.idCorporativo LIMIT 1)) AS MUNICIPIO,
        IF(factura.idCorporativo IS NULL, (SELECT departamento.nombreDpto FROM departamento INNER JOIN municipio ON departamento.idDpto = municipio.idDpto INNER JOIN residencial ON municipio.idMcpo = residencial.idMcpo WHERE residencial.idResidencial = recaudo.idResidencial LIMIT 1), (SELECT departamento.nombreDpto FROM departamento INNER JOIN municipio ON departamento.idDpto = municipio.idDpto INNER JOIN corporativo ON municipio.idMcpo = corporativo.idMcpo WHERE corporativo.idCorporativo = recaudo.idCorporativo LIMIT 1)) AS DEPARTAMENTO,
        CONCAT('CP', factura.consecutivo) AS NUM_FACTURA,
        factura.fechaEmision AS FECHA_EXPEDICION,
        CONCAT(factura.periodoFacturado, '-', factura.anioFacturado) AS PERIODO_FACTURADO,
        factura.baseImponible AS VLR_BASE,
        factura.ivaPago AS VLR_IVA,
        factura.totalFactura AS VLR_TOTAL,
        (SELECT SUM(deudas.valorDeuda) FROM deudas
        WHERE deudas.idCuenta = IF(factura.idCorporativo IS NULL, (SELECT cuenta.idCuenta FROM cuenta WHERE cuenta.idResidencial = factura.idResidencial LIMIT 1), (SELECT cuenta.idCuenta FROM cuenta WHERE cuenta.idCorporativo = factura.idCorporativo LIMIT 1))
        AND deudas.fechaFin = DATE(recaudo.fechaHoraRecaudo)
        AND deudas.idFactura != factura.idFactura
        ) AS VLR_DEUDA,
        recaudo.valorRecaudo AS VLR_RECAUDO,
        recaudo.concepto AS CONCEPTO_RECAUDO,
        recaudo.vlrReteIVA AS VLR_RETE_IVA,
        (recaudo.vlrReteFuente + factura.retefuentePago) AS VLR_RETE_FUENTE,
        recaudo.vlrReteICA AS VLR_RETE_ICA,
        recaudo.vlrEstampillas AS VLR_ESTAMPILLAS,
        recaudo.vlrOtrosDescuentos AS VLR_OTROS_DESCUENTOS,
        (SELECT SUM(nota_debito.totalPago) FROM nota_debito WHERE nota_debito.idFactura = factura.idFactura AND nota_debito.tipo = 'Descuento') AS VLR_DESCUENTO_POR_FALLAS,
        factura.prontoPago AS APLICA_PRONTO_PAGO,
        factura.vlrProntoPago AS VLR_PRONTO_PAGO,
        recaudo.fechaHoraRecaudo AS FECHA_REGISTRO_RECAUDO,
        recaudo.fechaPago AS FECHA_PAGO_RECAUDO,
        recaudo.fechaCobro AS FECHA_COBRO_RECAUDO,
        (SELECT COUNT(contrato_factura.idContratoFactura) FROM contrato_factura WHERE contrato_factura.porInstalacion = 1 AND contrato_factura.idFactura = factura.idFactura) AS POR_INSTALACION,
        (SELECT GROUP_CONCAT(concepto_factura.concepto SEPARATOR '||') FROM concepto_factura WHERE concepto_factura.idFactura = factura.idFactura) AS CONCEPTOS_FACTURA,
        CONCAT(empleado.primerNombre, ' ', empleado.primerApellido, ' ', empleado.segundoApellido) AS RECAUDADO_POR
        FROM recaudo
        INNER JOIN empleado ON recaudo.idEmpleado = empleado.idEmpleado
        INNER JOIN factura ON recaudo.idFactura = factura.idFactura ";
        switch ($segmento) {
            case 'Masivo Hogar':
                $this->consulta .= "WHERE recaudo.idResidencial IS NOT NULL
        AND DATE(recaudo.fechaHoraRecaudo) >= '$fechaInicio' AND DATE(recaudo.fechaHoraRecaudo) <= '$fechaFin' ";
//                $this->consulta .= "WHERE recaudo.idResidencial IS NOT NULL
//                                     AND IF(recaudo.fechaCobro != '0000-00-00', YEAR(recaudo.fechaCobro), YEAR(recaudo.fechaHoraRecaudo)) = $anio ";
                break;
            case 'Masivo Negocios':
                $this->consulta .= "WHERE recaudo.idCorporativo IS NOT NULL 
                                     AND factura.ivaPago = 0 
                                     AND DATE(recaudo.fechaHoraRecaudo) >= '$fechaInicio' AND DATE(recaudo.fechaHoraRecaudo) <= '$fechaFin' ";
                break;
            case 'Empresarial':
                $this->consulta .= "WHERE recaudo.idCorporativo IS NOT NULL 
                                     AND factura.ivaPago != 0 
                                     AND factura.idCorporativo != 490 
                                     AND factura.idCorporativo != 553 
                                     AND factura.idCorporativo != 334 
                                     AND factura.idCorporativo != 697 
                                     AND factura.idCorporativo != 1021 
                                     AND DATE(recaudo.fechaHoraRecaudo) >= '$fechaInicio' AND DATE(recaudo.fechaHoraRecaudo) <= '$fechaFin' ";
                break;
            case 'Proyectos':
                $this->consulta .= "WHERE recaudo.idCorporativo IS NOT NULL 
                                     AND factura.ivaPago != 0 
                                     AND (factura.idCorporativo = 490 
                                      OR factura.idCorporativo = 553 
                                      OR factura.idCorporativo = 334 
                                      OR factura.idCorporativo = 697 
                                      OR factura.idCorporativo = 1021) 
                                     AND DATE(recaudo.fechaHoraRecaudo) >= '$fechaInicio' AND DATE(recaudo.fechaHoraRecaudo) <= '$fechaFin' ";
                break;
        }
//        if ($mes != '') {
//            $this->consulta .= "AND MONTH(recaudo.fechaHoraRecaudo) = $mes ";
//        }
        $this->consulta .= " ORDER BY DATE(recaudo.fechaHoraRecaudo) ASC";
//        $this->consulta .= " LIMIT 0, 500";
        $this->consultarBD();
        return $this->registros;
    }

    public function getInfoCajaRecaudadora($concepto = '') {
        $this->consulta = "SELECT 
                            movimiento_caja_menor.idCajaMenor, 
                            empleado.nombres, 
                            empleado.apellidos 
                           FROM movimiento_caja_menor 
                           INNER JOIN caja_menor ON movimiento_caja_menor.idCajaMenor = caja_menor.idCajaMenor 
                           INNER JOIN empleado ON caja_menor.idEmpleado = empleado.idEmpleado 
                           WHERE movimiento_caja_menor.concepto = '$concepto' 
                            AND movimiento_caja_menor.fechaHora >= '2018-01-01 00:00:00'
                           LIMIT 1";
        if ($this->consultarBD('ModuloFinanciero_BD') > 0) {
            return array(
                'caja' => 'CAJA MENOR',
                'cajero' => strtoupper(trim($this->registros[0]['nombres']) . ' ' . trim($this->registros[0]['apellidos']))
            );
        }

        $this->consulta = "SELECT 
                            movimiento_caja_personal.idCajaPersonal, 
                            empleado.nombres, 
                            empleado.apellidos, 
                            IF(caja_personal.idTipoCaja = 1, 'CAJA PERSONAL', 'CAJA RECAUDOS') AS TIPO_CAJA 
                           FROM movimiento_caja_personal 
                           INNER JOIN caja_personal ON movimiento_caja_personal.idCajaPersonal = caja_personal.idCajaPersonal 
                           INNER JOIN empleado ON caja_personal.idEmpleado = empleado.idEmpleado 
                           WHERE movimiento_caja_personal.concepto = '$concepto' 
                            AND movimiento_caja_personal.fechaHora >= '2018-01-01 00:00:00'
                           LIMIT 1";
        if ($this->consultarBD('ModuloFinanciero_BD') > 0) {
            return array(
                'caja' => $this->registros[0]['TIPO_CAJA'],
                'cajero' => strtoupper(trim($this->registros[0]['nombres']) . ' ' . trim($this->registros[0]['apellidos']))
            );
        }

        return array(
            'caja' => 'NO ENCONTRADA',
            'cajero' => 'NO ENCONTRADO'
        );
    }

    public function getCarteraProformasRes($fechaini = '0000-00-00', $fechafin = '0000-00-00') {
        $this->consulta = "SELECT 
                          proforma.idProforma AS ID_PROFORMA,
                          CONCAT(municipio.nombreMcpo, '-', departamento.nombreDpto) AS UBICACION,
                          proforma.idResidencial AS ID_CLIENTE,
                          CONCAT(residencial.nombres, ' ', residencial.apellidos) AS CLIENTE,
                          residencial.cedula AS IDENTIFICACION,
                          residencial.celular1 AS CELULAR1,
                          residencial.celular2 AS CELULAR2,
                          residencial.telefono AS TELEFONO,
                          CONCAT(proforma.mes, '-', proforma.anio) AS PERIODO,
                          (SELECT SUM(cobro.vlrTotal) FROM cobro WHERE cobro.idProforma = proforma.idProforma AND cobro.estado != 'Eliminado') AS TOTAL_PAGO,
                          proforma.estado AS ESTADO, 
                          proforma.fechacorte AS FECHA_CORTE
                          FROM proforma 
                          INNER JOIN cobro ON proforma.idProforma = cobro.idProforma 
                          INNER JOIN servicio ON cobro.idServicio = servicio.idServicio 
                          INNER JOIN municipio ON servicio.idMcpo = municipio.idMcpo 
                          INNER JOIN departamento ON municipio.idDpto = departamento.idDpto 
                          INNER JOIN residencial ON proforma.idResidencial = residencial.idResidencial 
                          WHERE proforma.estado = 'Registrado' AND DATE(proforma.fechahorareg) >= '$fechaini' AND DATE(proforma.fechahorareg) <= '$fechafin'
                          GROUP BY proforma.idProforma";
        $this->consultarBD();
        return $this->registros;
    }

    public function getReporteCallCenter($filtro = '') {
        $this->consulta = "SELECT 
                          	llamada.idLlamada AS ID_TICKET, 
                          	CONCAT(empleado.apellidos, ' ', empleado.nombres) AS EMPLEADO_ASIGNADO, 
                          	IF(llamada.idCorporativo IS NOT NULL, (SELECT corporativo.razonSocial FROM corporativo WHERE corporativo.idCorporativo = llamada.idCorporativo LIMIT 1), IF(llamada.idResidencial IS NOT NULL, (SELECT CONCAT(residencial.apellidos, ' ', residencial.nombres) FROM residencial WHERE residencial.idResidencial = llamada.idResidencial LIMIT 1), (SELECT CONCAT(persona.apellidos, ' ', persona.nombres) FROM persona WHERE persona.idPersona = llamada.idPersona LIMIT 1))) AS CLIENTE, 
                          	IF(llamada.idCorporativo IS NOT NULL, 'CORPORATIVO', 'RESIDENCIAL') AS TIPO_CLIENTE, 
                          	CONCAT(municipio.nombreMcpo, '-', departamento.nombreDpto) AS UBICACION_CLIENTE, 
                          	tipo_llamada.tipo AS TIPO_TICKET, 
                          	llamada.registradaPor AS REGISTRADO_POR, 
                          	llamada.fechaRecibido AS FECHA_REGISTRO, 
                          	IF(llamada.fechaSolucion != '0000-00-00 00:00:00', llamada.fechaSolucion, IF(llamada.estado = 'Solucionado', (SELECT mensaje.fechaMensaje FROM mensaje WHERE mensaje.idHistorial = llamada.idHistorial AND mensaje.tipo = 'Solucion' LIMIT 1), '0000-00-00')) AS FECHA_CIERRE, 
                          	TIMESTAMPDIFF(HOUR, llamada.fechaRecibido, IF(llamada.fechaSolucion != '0000-00-00 00:00:00', llamada.fechaSolucion, IF(llamada.estado = 'Solucionado', (SELECT mensaje.fechaMensaje FROM mensaje WHERE mensaje.idHistorial = llamada.idHistorial AND mensaje.tipo = 'Solucion' LIMIT 1), '0000-00-00'))) AS DURACION, 
                          	llamada.estado AS ESTADO, 
                          	llamada.idDanioMasivo AS ID_DANIO_MASIVO, 
                          	llamada.reiteracion,
                            llamada.visitaTecnica,
                          	(SELECT CONCAT(empleado.apellidos, ' ', empleado.nombres) FROM mensaje INNER JOIN empleado ON mensaje.idEmpleado = empleado.idEmpleado WHERE mensaje.idHistorial = llamada.idHistorial AND mensaje.tipo = 'Solucion' LIMIT 1) AS SOLUCIONADA_POR 
                          FROM llamada 
                          INNER JOIN empleado ON llamada.idEmpleado = empleado.idEmpleado 
                          INNER JOIN municipio ON llamada.idMcpo = municipio.idMcpo 
                          INNER JOIN departamento ON municipio.idDpto = departamento.idDpto 
                          INNER JOIN tipo_llamada ON llamada.idTipoLlamada = tipo_llamada.idTipoLlamada
                          WHERE $filtro ORDER BY FECHA_REGISTRO ASC";
        $this->consultarBD('llamadas_BD');
        return $this->registros;
    }

    public function getReporteRetiros($filtro = '') {
        $this->consulta = "SELECT 
                            retiro.idRetiro AS ID_RETIRO, 
                            IF(retiro.tipoCliente = 'Residencial', (SELECT CONCAT(residencial.nombres, ' ', residencial.apellidos) FROM residencial INNER JOIN contrato ON residencial.idResidencial = contrato.idResidencial INNER JOIN servicio ON contrato.idContrato = servicio.idContrato WHERE servicio.idServicio = retiro.idServicio LIMIT 1), (SELECT corporativo.razonSocial FROM corporativo INNER JOIN contrato ON corporativo.idCorporativo = contrato.idCorporativo INNER JOIN servicio ON contrato.idContrato = servicio.idContrato WHERE servicio.idServicio = retiro.idServicio LIMIT 1)) AS CLIENTE,
                            IF(retiro.tipoCliente = 'Residencial', (SELECT CONCAT(residencial.telefono, '-', residencial.celular1, '-', residencial.celular2, '-', residencial.celular3) FROM residencial INNER JOIN contrato ON residencial.idResidencial = contrato.idResidencial INNER JOIN servicio ON contrato.idContrato = servicio.idContrato WHERE servicio.idServicio = retiro.idServicio LIMIT 1), (SELECT CONCAT(corporativo.telefono, '-', corporativo.celular1, '-', corporativo.celular2, '-', corporativo.celular3) FROM corporativo INNER JOIN contrato ON corporativo.idCorporativo = contrato.idCorporativo INNER JOIN servicio ON contrato.idContrato = servicio.idContrato WHERE servicio.idServicio = retiro.idServicio LIMIT 1)) AS TELEFONOS,
                            servicio.conceptoFacturacion AS SERVICIO, 
                            (SELECT CONCAT(departamento.nombreDpto, '-', municipio.nombreMcpo) FROM municipio INNER JOIN departamento ON municipio.idDpto = departamento.idDpto WHERE municipio.idMcpo = servicio.idMcpo LIMIT 1) AS UBICACION,
                             servicio.dirInstalacion AS DIR_INSTALACION,
                             retiro.registradoPor AS REGISTRADO_POR, 
                             retiro.fechaHoraReg AS FECHA_REGISTRO, 
                             retiro.estado AS ESTADO,
                             retiro.motivo AS MOTIVO,
                             retiro.observaciones AS OBSERVACIONES
                           FROM retiro
                           INNER JOIN servicio ON retiro.idServicio = servicio.idServicio
                           WHERE $filtro ORDER BY ID_RETIRO ASC";
        $this->consultarBD('swDobleClick_BD');
        return $this->registros;
    }

    public function getReporteMigraciones($fechaInicio = '0000-00-00', $fechaFin = '0000-00-00') {
        $this->consulta = "SELECT 
        asignaciones.tipoOT AS TIPO_OT, 
        asignaciones.idAsignada AS ID_OT, 
        (SELECT CONCAT(empleado.apellidos, ' ', empleado.nombres) FROM empleado WHERE empleado.idEmpleado = asignaciones.idAsignado LIMIT 1) AS EMPLEADO_ASIGNADO, 
        IF(asignaciones.idCorporativo IS NOT NULL, (SELECT corporativo.razonSocial FROM corporativo WHERE corporativo.idCorporativo = asignaciones.idCorporativo LIMIT 1),(SELECT CONCAT(residencial.apellidos, ' ', residencial.nombres) FROM residencial WHERE residencial.idResidencial = asignaciones.idResidencial LIMIT 1)) AS CLIENTE, 
        (SELECT CONCAT(empleado.apellidos, ' ', empleado.nombres) FROM empleado WHERE empleado.idEmpleado = asignaciones.idAsignador LIMIT 1) AS AUTORIZADO_POR, 
        (SELECT swDobleClick_BD.migracion_servicio.fechahorareg FROM swDobleClick_BD.migracion_servicio WHERE swDobleClick_BD.migracion_servicio.idOT = asignaciones.idAsignada LIMIT 1) AS FECHA_SOLICITUD,
        asignaciones.fechaCreacion AS FECHA_REGISTRO_OT, 
        asignaciones.fechaSolucion AS FECHA_SOLUCION_OT, 
        asignaciones.estado AS ESTADO, 
        (SELECT CONCAT(empleado.nombres, ' ', empleado.apellidos) FROM empleado INNER JOIN resultados ON resultados.supervisadoPor = empleado.idEmpleado WHERE resultados.idAsignada = asignaciones.idAsignada LIMIT 1) AS SUPERVISADO_POR 
        FROM asignaciones WHERE (DATE(asignaciones.fechaCreacion) >= '$fechaInicio' AND DATE(asignaciones.fechaCreacion) <= '$fechaFin') AND (asignaciones.tipoOT = 'Migracion')";
//        echo $this->consulta;
        $this->consultarBD('llamadas_BD');
        return $this->registros;
    }

    public function getReporteInstalaciones($fechaInicio = '0000-00-00', $fechaFin = '0000-00-00') {
        $this->consulta = "SELECT 
        instalacion.idInstalacion, 
        instalacion.idAsignacion, 
        instalacion.tipo, 
        instalacion.idContrato, 
        instalacion.idCliente, 
        instalacion.cliente, 
        instalacion.ubicacionInstalacion, 
        instalacion.direccionInstalacion, 
        instalacion.fechaHoraReg, 
        instalacion.registradoPor, 
        instalacion.estado, 
        instalacion.observacion, 
        (SELECT swDobleClick_BD.servicio.fechaActivacion FROM swDobleClick_BD.servicio WHERE swDobleClick_BD.servicio.idServicio = instalacion.idContrato LIMIT 1) AS FECHA_ACTIVACION, 
        (SELECT swDobleClick_BD.servicio.tecnologia FROM swDobleClick_BD.servicio WHERE swDobleClick_BD.servicio.idServicio = instalacion.idContrato LIMIT 1) AS tecnologia 
        FROM instalacion WHERE (DATE(instalacion.fechaHoraReg) >= '$fechaInicio' AND DATE(instalacion.fechaHoraReg) <= '$fechaFin') AND instalacion.estado != 'Eliminada'";
//        echo $this->consulta;
        $this->consultarBD('swInventario_BD');
        return $this->registros;
    }

    public function getReporteTraslados($fechaInicio = '0000-00-00', $fechaFin = '0000-00-00') {
        $this->consulta = "SELECT 
        asignaciones.tipoOT AS TIPO_OT, 
        asignaciones.idAsignada AS ID_OT, 
        (SELECT CONCAT(empleado.apellidos, ' ', empleado.nombres) FROM empleado WHERE empleado.idEmpleado = asignaciones.idAsignado LIMIT 1) AS EMPLEADO_ASIGNADO, 
        IF(asignaciones.idCorporativo IS NOT NULL, (SELECT corporativo.razonSocial FROM corporativo WHERE corporativo.idCorporativo = asignaciones.idCorporativo LIMIT 1),(SELECT CONCAT(residencial.apellidos, ' ', residencial.nombres) FROM residencial WHERE residencial.idResidencial = asignaciones.idResidencial LIMIT 1)) AS CLIENTE, 
        (SELECT CONCAT(empleado.apellidos, ' ', empleado.nombres) FROM empleado WHERE empleado.idEmpleado = asignaciones.idAsignador LIMIT 1) AS AUTORIZADO_POR, 
        (SELECT swDobleClick_BD.traslado_servicio.fechahorareg FROM swDobleClick_BD.traslado_servicio WHERE swDobleClick_BD.traslado_servicio.idOT = asignaciones.idAsignada LIMIT 1) AS FECHA_SOLICITUD,
        asignaciones.fechaCreacion AS FECHA_REGISTRO_OT, 
        asignaciones.fechaSolucion AS FECHA_SOLUCION_OT, 
        asignaciones.estado AS ESTADO, 
        (SELECT CONCAT(empleado.nombres, ' ', empleado.apellidos) FROM empleado INNER JOIN resultados ON resultados.supervisadoPor = empleado.idEmpleado WHERE resultados.idAsignada = asignaciones.idAsignada LIMIT 1) AS SUPERVISADO_POR 
        FROM asignaciones WHERE (DATE(asignaciones.fechaCreacion) >= '$fechaInicio' AND DATE(asignaciones.fechaCreacion) <= '$fechaFin') AND (asignaciones.tipoOT = 'Traslado')";
//        echo $this->consulta;
        $this->consultarBD('llamadas_BD');
        return $this->registros;
    }

    public function getReporteSoporteTecnico($fechaInicio = '0000-00-00', $fechaFin = '0000-00-00') {
        $this->consulta = "SELECT 
asignaciones.tipoOT AS TIPO_OT, 
asignaciones.idAsignada AS ID_OT, 
(SELECT CONCAT(empleado.apellidos, ' ', empleado.nombres) FROM empleado WHERE empleado.idEmpleado = asignaciones.idAsignado LIMIT 1) AS EMPLEADO_ASIGNADO, 
IF(asignaciones.idCorporativo IS NOT NULL, (SELECT corporativo.razonSocial FROM corporativo WHERE corporativo.idCorporativo = asignaciones.idCorporativo LIMIT 1),(SELECT CONCAT(residencial.apellidos, ' ', residencial.nombres) FROM residencial WHERE residencial.idResidencial = asignaciones.idResidencial LIMIT 1)) AS CLIENTE, 
asignaciones.destino AS UBICACION, 
(SELECT CONCAT(empleado.apellidos, ' ', empleado.nombres) FROM empleado WHERE empleado.idEmpleado = asignaciones.idAsignador LIMIT 1) AS AUTORIZADO_POR, 
asignaciones.fechaCreacion AS FECHA_REGISTRO_OT, 
asignaciones.fechaSolucion AS FECHA_SOLUCION_OT, 
asignaciones.estado AS ESTADO, 
(SELECT CONCAT(empleado.nombres, ' ', empleado.apellidos) FROM empleado INNER JOIN resultados ON resultados.supervisadoPor = empleado.idEmpleado WHERE resultados.idAsignada = asignaciones.idAsignada LIMIT 1) AS SUPERVISADO_POR 
FROM asignaciones WHERE (DATE(asignaciones.fechaCreacion) >= '$fechaInicio' AND DATE(asignaciones.fechaCreacion) <= '$fechaFin') AND (asignaciones.tipoOT = 'Soporte Tecnico')";
//        echo $this->consulta;
        $this->consultarBD('llamadas_BD');
        return $this->registros;
    }

    public function getFechaRecaudoProforma($idRecaudo = 0) {
        $this->consulta = "SELECT recaudo.fechaHoraRecaudo FROM recaudo WHERE recaudo.idRecaudo = $idRecaudo LIMIT 1";
        if ($this->consultarBD() > 0) {
            return $this->registros[0]['fechaHoraRecaudo'];
        } else {
            return '0000-00-00 00:00:00';
        }
    }

    public function buscarEnCajaRecaudosByFecha($fecha = '0000-00-00 00:00:00') {
        $this->consulta = "SELECT CONCAT(movimiento_caja_personal.idMovimiento, '@', caja_personal.idCaja) AS ID_MOVIMIENTO 
                           FROM movimiento_caja_personal 
                           INNER JOIN caja_personal ON movimiento_caja_personal.idCajaPersonal = caja_personal.idCajaPersonal 
                           WHERE movimiento_caja_personal.fechaHora = '$fecha' 
                               AND caja_personal.idTipoCaja = 2 
                           LIMIT 1";
//        echo $this->consulta;
        if ($this->consultarBD('ModuloFinanciero_BD') > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function getClienteRes($completar = '') {
        $this->consulta = "SELECT 
                            residencial.idResidencial, 
                            CONCAT(residencial.nombres, ' ', residencial.apellidos) AS cliente 
                           FROM residencial 
                           WHERE CONCAT(residencial.nombres, ' ', residencial.apellidos) LIKE '%$completar%' 
                           ORDER BY cliente ASC";
        if ($this->consultarBD() > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function getClienteCorp($completar = '') {
        $this->consulta = "SELECT 
                            corporativo.idCorporativo, 
                            corporativo.razonSocial AS cliente 
                           FROM corporativo 
                           WHERE corporativo.razonSocial LIKE '%$completar%' 
                           ORDER BY cliente ASC
                        ";
        if ($this->consultarBD() > 0) {
            return true;
        } else {
            return false;
        }
    }

}

?>
