<?php

// *****************  MODULO NOVEDADES NOMINA  *****************

require_once('../../servicios/accesoDatos.php');

date_default_timezone_set('America/Bogota');

class Cuidadoalcliente extends AccesoDatos {

    public function imprimirConsultas($consultas = array()) {
        $cont = 0;
        foreach ($consultas as $consulta) {
            echo $consulta . '<br>';
            $cont++;
        }
        echo '<br>TOTAL: ' . $cont . '<br>';
        return false;
    }

    public function getOTsInstallSolucionadasByFecha($fecha = '0000-00-00') {
        $this->consulta = "SELECT 
                            asignaciones.idAsignada AS idOT, 
                            IF(asignaciones.idResidencial IS NOT NULL, 
                              (SELECT CONCAT(residencial.nombres, ' ', residencial.apellidos) FROM residencial WHERE residencial.idResidencial = asignaciones.idResidencial LIMIT 1),
                              (SELECT corporativo.razonSocial FROM corporativo WHERE corporativo.idCorporativo = asignaciones.idCorporativo LIMIT 1)
                            ) AS cliente,
                            IF(asignaciones.idResidencial IS NOT NULL, 
                              (SELECT residencial.cedula FROM residencial WHERE residencial.idResidencial = asignaciones.idResidencial LIMIT 1),
                              (SELECT corporativo.nit FROM corporativo WHERE corporativo.idCorporativo = asignaciones.idCorporativo LIMIT 1)
                            ) AS identificacion,
                            IF(asignaciones.idResidencial IS NOT NULL, 
                              (SELECT CONCAT(swDobleClick_BD.residencial.telefono, '-', swDobleClick_BD.residencial.celular1, '-', swDobleClick_BD.residencial.celular2, '-', swDobleClick_BD.residencial.celular3) FROM swDobleClick_BD.residencial WHERE swDobleClick_BD.residencial.idResidencial = (SELECT residencial.idResidencial2C FROM residencial WHERE residencial.idResidencial = asignaciones.idResidencial LIMIT 1) LIMIT 1),
                              (SELECT CONCAT(swDobleClick_BD.corporativo.telefono, '-', swDobleClick_BD.corporativo.celular1, '-', swDobleClick_BD.corporativo.celular2, '-', swDobleClick_BD.corporativo.celular3) FROM swDobleClick_BD.corporativo WHERE swDobleClick_BD.corporativo.idCorporativo =(SELECT corporativo.idCorporativo2C FROM corporativo WHERE corporativo.idCorporativo = asignaciones.idCorporativo LIMIT 1) LIMIT 1)
                            ) AS telefonos,
                            (SELECT swDobleClick_BD.servicio.conceptoFacturacion 
                              FROM swDobleClick_BD.servicio 
                              INNER JOIN swInventario_BD.instalacion ON swDobleClick_BD.servicio.idServicio = swInventario_BD.instalacion.idContrato 
                              WHERE swInventario_BD.instalacion.idInstalacion = asignaciones.idInstalacion LIMIT 1
                            ) AS servicio,
                            (SELECT CONCAT(swDobleClick_BD.municipio.nombreMcpo, '-', swDobleClick_BD.departamento.nombreDpto) 
                              FROM swDobleClick_BD.servicio 
                              INNER JOIN swInventario_BD.instalacion ON swDobleClick_BD.servicio.idServicio = swInventario_BD.instalacion.idContrato 
                              INNER JOIN swDobleClick_BD.municipio ON swDobleClick_BD.servicio.idMcpo = swDobleClick_BD.municipio.idMcpo 
                              INNER JOIN swDobleClick_BD.departamento ON swDobleClick_BD.municipio.idDpto = swDobleClick_BD.departamento.idDpto 
                              WHERE swInventario_BD.instalacion.idInstalacion = asignaciones.idInstalacion LIMIT 1
                            ) AS ubicacion,
                            (SELECT DATE(swDobleClick_BD.servicio.fechaHoraReg)
                              FROM swDobleClick_BD.servicio
                              INNER JOIN swInventario_BD.instalacion ON swDobleClick_BD.servicio.idServicio = swInventario_BD.instalacion.idContrato
                              WHERE swInventario_BD.instalacion.idInstalacion = asignaciones.idInstalacion LIMIT 1
                            ) AS fechaVenta,
                            (SELECT DATE(swInventario_BD.instalacion.fechaHoraReg) 
                              FROM swInventario_BD.instalacion 
                              WHERE swInventario_BD.instalacion.idInstalacion = asignaciones.idInstalacion LIMIT 1
                            ) AS fechaRegInstall,
                            DATE(asignaciones.fechaCreacion) AS fechaRegOT
                           FROM asignaciones
                           WHERE (SELECT COUNT(formulario_encuesta.idFormulario) FROM formulario_encuesta WHERE formulario_encuesta.idOT = asignaciones.idAsignada) = 0 AND DATE(asignaciones.fechaSolucion) = '$fecha' AND asignaciones.estado = 'Solucionada' AND asignaciones.tipoOT = 'Instalacion' AND asignaciones.idCambiosTv = 0";
//        echo $this->consulta;
        $this->consultarBD('llamadas_BD');
        return $this->registros;
    }

    public function getIncidentesByFechaEstado($fecha = '0000-00-00', $estado = '') {
        $this->consulta = "SELECT 
                            llamada.idLlamada AS idIncidente,
                            IF(llamada.idResidencial IS NOT NULL, 
                              (SELECT CONCAT(residencial.nombres, ' ', residencial.apellidos) FROM residencial WHERE residencial.idResidencial = llamada.idResidencial LIMIT 1),
                              (SELECT corporativo.razonSocial FROM corporativo WHERE corporativo.idCorporativo = llamada.idCorporativo LIMIT 1)
                            ) AS cliente,
                            IF(llamada.idResidencial IS NOT NULL, 
                              (SELECT CONCAT(swDobleClick_BD.residencial.telefono, '-', swDobleClick_BD.residencial.celular1, '-', swDobleClick_BD.residencial.celular2, '-', swDobleClick_BD.residencial.celular3) FROM swDobleClick_BD.residencial WHERE swDobleClick_BD.residencial.idResidencial = (SELECT residencial.idResidencial2C FROM residencial WHERE residencial.idResidencial = llamada.idResidencial LIMIT 1) LIMIT 1),
                              (SELECT CONCAT(swDobleClick_BD.corporativo.telefono, '-', swDobleClick_BD.corporativo.celular1, '-', swDobleClick_BD.corporativo.celular2, '-', swDobleClick_BD.corporativo.celular3) FROM swDobleClick_BD.corporativo WHERE swDobleClick_BD.corporativo.idCorporativo =(SELECT corporativo.idCorporativo2C FROM corporativo WHERE corporativo.idCorporativo = llamada.idCorporativo LIMIT 1) LIMIT 1)
                            ) AS telefonos,
                            (SELECT CONCAT(swDobleClick_BD.municipio.nombreMcpo, '-', swDobleClick_BD.departamento.nombreDpto) 
                              FROM swDobleClick_BD.servicio 
                              INNER JOIN swDobleClick_BD.municipio ON swDobleClick_BD.servicio.idMcpo = swDobleClick_BD.municipio.idMcpo 
                              INNER JOIN swDobleClick_BD.departamento ON swDobleClick_BD.municipio.idDpto = swDobleClick_BD.departamento.idDpto 
                              WHERE swDobleClick_BD.servicio.idServicio = llamada.idContrato LIMIT 1
                            ) AS ubicacion,
                            IF(idResidencial IS NOT NULL, 
                              (SELECT residencial.cedula FROM residencial WHERE residencial.idResidencial = llamada.idResidencial LIMIT 1),
                              (SELECT corporativo.nit FROM corporativo WHERE corporativo.idCorporativo = llamada.idCorporativo LIMIT 1)
                            ) AS identificacion,
                            (SELECT swDobleClick_BD.servicio.conceptoFacturacion 
                              FROM swDobleClick_BD.servicio 
                              WHERE swDobleClick_BD.servicio.idServicio = llamada.idContrato LIMIT 1
                            ) AS servicio,
                            tipo_llamada.tipo AS tipoincidente,
                            llamada.estado AS estadoincidente,
                            llamada.fechaRecibido AS fecharegincidente
                           FROM llamada
                           INNER JOIN tipo_llamada ON llamada.idTipoLlamada = tipo_llamada.idTipoLlamada";
        if ($estado == 'Solucionado') {
            $this->consulta .= " WHERE DATE(llamada.fechaSolucion) = '$fecha' AND llamada.estado = 'Solucionado'";
        } else {
            $this->consulta .= " WHERE DATE(llamada.fechaRecibido) = '$fecha'";
        }
        $this->consulta .= " AND (SELECT COUNT(formulario_encuesta.idFormulario) FROM formulario_encuesta WHERE formulario_encuesta.idIncidente = llamada.idLlamada) = 0";
//        echo $this->consulta;
        $this->consultarBD('llamadas_BD');
        return $this->registros;
    }

    public function getOTsSolucionadasByFecha($fecha = '0000-00-00') {
        $this->consulta = "SELECT 
                            asignaciones.idAsignada AS idOT,
                            asignaciones.idResidencial,
                            asignaciones.idCorporativo,
                            IF(asignaciones.idResidencial IS NOT NULL, 
                              (SELECT CONCAT(residencial.nombres, ' ', residencial.apellidos) FROM residencial WHERE residencial.idResidencial = asignaciones.idResidencial LIMIT 1),
                              (SELECT corporativo.razonSocial FROM corporativo WHERE corporativo.idCorporativo = asignaciones.idCorporativo LIMIT 1)
                            ) AS cliente,
                            IF(asignaciones.idResidencial IS NOT NULL, 
                              (SELECT residencial.cedula FROM residencial WHERE residencial.idResidencial = asignaciones.idResidencial LIMIT 1),
                              (SELECT corporativo.nit FROM corporativo WHERE corporativo.idCorporativo = asignaciones.idCorporativo LIMIT 1)
                            ) AS identificacion,
                            IF(asignaciones.idResidencial IS NOT NULL, 
                              (SELECT CONCAT(swDobleClick_BD.residencial.telefono, '-', swDobleClick_BD.residencial.celular1, '-', swDobleClick_BD.residencial.celular2, '-', swDobleClick_BD.residencial.celular3) FROM swDobleClick_BD.residencial WHERE swDobleClick_BD.residencial.idResidencial = (SELECT residencial.idResidencial2C FROM residencial WHERE residencial.idResidencial = asignaciones.idResidencial LIMIT 1) LIMIT 1),
                              (SELECT CONCAT(swDobleClick_BD.corporativo.telefono, '-', swDobleClick_BD.corporativo.celular1, '-', swDobleClick_BD.corporativo.celular2, '-', swDobleClick_BD.corporativo.celular3) FROM swDobleClick_BD.corporativo WHERE swDobleClick_BD.corporativo.idCorporativo =(SELECT corporativo.idCorporativo2C FROM corporativo WHERE corporativo.idCorporativo = asignaciones.idCorporativo LIMIT 1) LIMIT 1)
                            ) AS telefonos,
                            DATE(asignaciones.fechaCreacion) AS fechaRegOT,
                            asignaciones.motivo,
                            asignaciones.destino
                           FROM asignaciones
                           WHERE (SELECT COUNT(formulario_encuesta.idFormulario) FROM formulario_encuesta WHERE formulario_encuesta.idOT = asignaciones.idAsignada) = 0 AND DATE(asignaciones.fechaSolucion) = '$fecha' AND asignaciones.estado = 'Solucionada' AND asignaciones.tipoOT != 'Instalacion'";
//        echo $this->consulta;
        $this->consultarBD('llamadas_BD');
        return $this->registros;
    }

    public function registrarEncuesta($datos = array()) {
        $consultas = array();
        $consultas[] = "INSERT INTO formulario_encuesta(idOT, idIncidente, asesorventa, email, observacionventa, observacionincidente, registradopor, fechahorareg) 
                        VALUES(" . $datos['idOT'] . "," . $datos['idIncidente'] . ",'" . $datos['asesorventa'] . "','" . $datos['email'] . "','" . $datos['observacionventa'] . "','" . $datos['observacionincidente'] . "','" . $datos['registradopor'] . "','" . $datos['fechahorareg'] . "')";
        for ($i = 1; $i <= 22; $i++) {
            if (array_key_exists("respuesta_$i", $datos)) {
                $consultas[] = "INSERT INTO encuesta_cuidadocliente(idFormulario, idPregunta, respuesta) 
                                VALUES({ultimoID}, $i, " . $datos["respuesta_$i"] . ")";
            }
        }
//        print_r($consultas);
        return $this->ejecutarTransaccion($consultas, 'llamadas_BD');
    }

    public function getInfoGrafico($idPregunta = 0, $idRespuesta = 0) {
        $this->consulta = "select count(idFormulario) as cont from encuesta_cuidadocliente where idPregunta = $idPregunta and respuesta = $idRespuesta";
//        echo $this->consulta;
        $this->consultarBD('llamadas_BD');
        return $this->registros[0]['cont'];
    }

    public function getClientes($filtro = '') {
        $this->consulta = "SELECT
                            residencial.idResidencial AS idCliente,
                            CONCAT(residencial.nombres, ' ', residencial.apellidos) AS cliente,
                            residencial.cedula AS identificacion,
                            residencial.celular1,
                            residencial.celular2,
                            residencial.celular3,
                            residencial.telefono,
                            residencial.llamado,
                            servicio.diaCorte,
                            departamento.nombreDpto,
                            municipio.nombreMcpo
                           FROM residencial
                           INNER JOIN contrato ON residencial.idResidencial = contrato.idResidencial
                           INNER JOIN servicio ON contrato.idContrato = servicio.idContrato
                           INNER JOIN municipio ON servicio.idMcpo = municipio.idMcpo
                           INNER JOIN departamento ON municipio.idDpto = departamento.idDpto
                           WHERE servicio.estado = 'Activo'";
        if ($filtro != '') {
            $this->consulta .= " $filtro";
            $this->consulta .= " GROUP BY residencial.idResidencial";
        } else {
            $this->consulta .= " GROUP BY residencial.idResidencial LIMIT 25";
        }

//        echo $this->consulta;
        $this->consultarBD('swDobleClick_BD');
        return $this->registros;
    }

    public function setMarcadoLlamado($idCliente = 0) {
        $consultas = array();
        $consultas[] = "UPDATE residencial SET llamado = 1 WHERE idResidencial = $idCliente LIMIT 1";
        return $this->ejecutarTransaccion($consultas, 'swDobleClick_BD');
    }

    public function getEncuestas() {
        $this->consulta = "SELECT 
                               formulario_encuesta.idFormulario,
                               formulario_encuesta.idOT,
                               formulario_encuesta.idIncidente,
                               formulario_encuesta.asesorventa,
                               formulario_encuesta.email,
                               formulario_encuesta.observacionventa,
                               formulario_encuesta.observacionincidente,
                               formulario_encuesta.registradopor,
                               formulario_encuesta.fechahorareg
                            
                             FROM formulario_encuesta
                             LIMIT 25";
        //print_r($this->consulta);
        return $this->consultarBD('llamadas_BD');
    }

    public function getEncuesta($idFormulario = 0) {
        $this->consulta = "SELECT *
                               FROM formulario_encuesta
                               INNER JOIN encuesta_cuidadocliente ON formulario_encuesta.idFormulario = encuesta_cuidadocliente.idFormulario
                               WHERE formulario_encuesta.idFormulario = $idFormulario LIMIT 1";
        //print_r($this->consulta);
        return $this->consultarBD('llamadas_BD');
    }

    public function getRespuestas($idFormulario = 0) {
        $this->consulta = "SELECT *
                               FROM formulario_encuesta
                               INNER JOIN encuesta_cuidadocliente ON formulario_encuesta.idFormulario = encuesta_cuidadocliente.idFormulario
                               WHERE formulario_encuesta.idFormulario = $idFormulario";
        return $this->consultarBD('llamadas_BD');
    }

}

?>