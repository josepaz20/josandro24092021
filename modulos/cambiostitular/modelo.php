<?php

// ********************** MODULO CAMBIOS TITULAR **********************

require_once('../../servicios/accesoDatos.php');

date_default_timezone_set('America/Bogota');

class CambiosTitular extends AccesoDatos {

    /**
     * Obtiene la informacion de todos los EMPLEADOS (TECNICOS) registradas en el sistema. 
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     */
    public function getCambiosTitular($filtro = '') {
        $this->consulta = "SELECT 
                            cambio_titular.idCambioTitular,
                            cambio_titular.idNuevoTitular,
                            cambio_titular.idServicio,
                            cambio_titular.estado,
                            cambio_titular.registradopor,
                            cambio_titular.fechahorareg,
                            cambio_titular.formato,
                            servicio.conceptoFacturacion,
                            CONCAT(residencial.nombres, ' ', residencial.apellidos) AS clienteAntiguo, 
                            residencial.cedula AS identificacionAntiguo,
                            residencial.observacion, 
                            CONCAT(nuevo_titular.nombres, ' ', nuevo_titular.apellidos) AS clienteNuevo, 
                            nuevo_titular.identificacion AS identificacionNuevo
                           FROM cambio_titular
                           INNER JOIN servicio ON cambio_titular.idServicio = servicio.idServicio
                           INNER JOIN contrato ON servicio.idContrato = contrato.idContrato
                           INNER JOIN residencial ON contrato.idResidencial = residencial.idResidencial
                           INNER JOIN nuevo_titular ON cambio_titular.idNuevoTitular = nuevo_titular.idNuevoTitular
                           ";
        if ($filtro != '') {
            $this->consulta .= ' ' . $filtro;
        }
//        echo $this->consulta;
        $numRegistros = $this->consultarBD();
        $this->mensaje = "Registros Encontrados: <b>$numRegistros</b>";
        if ($numRegistros > 0) {
            return true;
        } else {
            return false;
        }
    }

//------------------------------------------------------------------------------    
    public function getCambioTitular($idCambioTitular = 0) {
        $this->consulta = "SELECT 
                            cambio_titular.idCambioTitular,
                            cambio_titular.idNuevoTitular,
                            cambio_titular.idServicio,
                            cambio_titular.estado,
                            cambio_titular.registradopor,
                            cambio_titular.fechahorareg,
                            servicio.conceptoFacturacion,
                            CONCAT(residencial.nombres, ' ', residencial.apellidos) AS clienteAntiguo, 
                            residencial.cedula AS identificacionAntiguo,
                            CONCAT(nuevo_titular.nombres, ' ', nuevo_titular.apellidos) AS clienteNuevo, 
                            nuevo_titular.identificacion AS identificacionNuevo
                           FROM cambio_titular
                           INNER JOIN servicio ON cambio_titular.idServicio = servicio.idServicio
                           INNER JOIN contrato ON servicio.idContrato = contrato.idContrato
                           INNER JOIN residencial ON contrato.idResidencial = residencial.idResidencial
                           INNER JOIN nuevo_titular ON cambio_titular.idNuevoTitular = nuevo_titular.idNuevoTitular WHERE cambio_titular.idCambioTitular = $idCambioTitular";
//        echo $this->consulta;   
//        echo $this->consulta;
        $this->consultarBD();
        return $this->registros;
    }

//------------------------------------------------------------------------------
    public function getEliminarTitular($idCambioTitular = 0) {
        $this->consulta = "SELECT 
                            cambio_titular.idCambioTitular,
                            cambio_titular.idNuevoTitular,
                            cambio_titular.idServicio,
                            cambio_titular.estado,
                            cambio_titular.registradopor,
                            cambio_titular.fechahorareg,
                            servicio.conceptoFacturacion,
                            CONCAT(residencial.nombres, ' ', residencial.apellidos) AS clienteAntiguo, 
                            residencial.cedula AS identificacionAntiguo,
                            CONCAT(nuevo_titular.nombres, ' ', nuevo_titular.apellidos) AS clienteNuevo, 
                            nuevo_titular.identificacion AS identificacionNuevo
                            FROM cambio_titular
                            INNER JOIN servicio ON cambio_titular.idServicio = servicio.idServicio
                            INNER JOIN contrato ON servicio.idContrato = contrato.idContrato
                            INNER JOIN residencial ON contrato.idResidencial = residencial.idResidencial
                            INNER JOIN nuevo_titular ON cambio_titular.idNuevoTitular = nuevo_titular.idNuevoTitular WHERE cambio_titular.idCambioTitular = $idCambioTitular";
//        echo $this->consulta;   
//        echo $this->consulta;
        $this->consultarBD();
        return $this->registros;
    }

//------------------------------------------------------------------------------

    public function getAprobarTitular($idCambioTitular = 0) {
        $this->consulta = "SELECT 
                            cambio_titular.idCambioTitular,
                            cambio_titular.idNuevoTitular,
                            cambio_titular.idServicio,
                            cambio_titular.estado,
                            cambio_titular.registradopor,
                            cambio_titular.fechahorareg,
                            servicio.conceptoFacturacion,
                            CONCAT(residencial.nombres, ' ', residencial.apellidos) AS clienteAntiguo, 
                            residencial.cedula AS identificacionAntiguo,
                            CONCAT(nuevo_titular.nombres, ' ', nuevo_titular.apellidos) AS clienteNuevo, 
                            nuevo_titular.identificacion AS identificacionNuevo
                            FROM cambio_titular
                            INNER JOIN servicio ON cambio_titular.idServicio = servicio.idServicio
                            INNER JOIN contrato ON servicio.idContrato = contrato.idContrato
                            INNER JOIN residencial ON contrato.idResidencial = residencial.idResidencial
                            INNER JOIN nuevo_titular ON cambio_titular.idNuevoTitular = nuevo_titular.idNuevoTitular WHERE cambio_titular.idCambioTitular = $idCambioTitular";
//        echo $this->consulta;   
//        echo $this->consulta;
        $this->consultarBD();
        return $this->registros;
    }

    //------------------------------------------------------------------------------

    public function getClienteRES($filtro = '') {
        $this->consulta = "SELECT 
                            residencial.idResidencial AS idCliente,
                            CONCAT(residencial.nombres, ' ', residencial.apellidos) AS cliente,
                            residencial.nombres,
                            residencial.apellidos,
                            residencial.cedula AS identificacion
                           FROM residencial";
        if ($filtro != '') {
            $this->consulta .= ' ' . $filtro;
        }
//        echo $this->consulta;
        $numRegistros = $this->consultarBD();
        if ($numRegistros > 0) {
            return true;
        } else {
            return false;
        }
    }

//------------------------------------------------------------------------------    

    public function getServiciosRES($idResidencial = 0) {
        $this->consulta = "SELECT 
                            servicio.idServicio,
                            servicio.conceptoFacturacion
                           FROM servicio
                           INNER JOIN contrato ON servicio.idContrato = contrato.idContrato
                           INNER JOIN residencial ON contrato.idResidencial = residencial.idResidencial
                           WHERE servicio.estado != 'Eliminado' AND residencial.idResidencial = $idResidencial";
//        echo $this->consulta;
        $numRegistros = $this->consultarBD();
        if ($numRegistros > 0) {
            return true;
        } else {
            return false;
        }
    }

//------------------------------------------------------------------------------    

    public function getInfoServicio($idServicio = 0) {
        $this->consulta = "SELECT 
                            servicio.idServicio,
                            servicio.conceptoFacturacion,
                            servicio.dirInstalacion,
                            servicio.estado,
                            CONCAT(departamento.nombreDpto, '-', municipio.nombreMcpo) AS ubicacion,
                            plan_internet.totalPago AS tarifa
                           FROM servicio
                           INNER JOIN internet ON servicio.idServicio = internet.idServicio
                           INNER JOIN plan_internet ON internet.idPlanInternet = plan_internet.idPlanInternet
                           INNER JOIN municipio ON servicio.idMcpo = municipio.idMcpo
                           INNER JOIN departamento ON municipio.idDpto = departamento.idDpto
                           WHERE servicio.idServicio = $idServicio LIMIT 1";
//        echo $this->consulta;
        $numRegistros = $this->consultarBD();
        if ($numRegistros > 0) {
            return true;
        } else {
            return false;
        }
    }

//------------------------------------------------------------------------------    

    public function setValidar($idCambioTitular = 0, $estado = '', $infoNuevoTitular = array(), $antiguoTitular = '', $idContrato = 0) {
        $confirmadopor = $_SESSION['NOMBRES_APELLIDO_USUARIO'];
        $fechahoraconfirm = date('Y-m-d H:i:s');
        $consultas = array();
        $consultas[] = "UPDATE cambio_titular SET estado = '$estado', confirmadopor = '$confirmadopor', fechahoraconfirm = '$fechahoraconfirm' WHERE idCambioTitular = $idCambioTitular LIMIT 1";
        if ($estado == 'Confirmado') {
            foreach ($infoNuevoTitular as $campo => $vlr) {
                $$campo = $vlr;
            }
            $registradoPor = $_SESSION['ID_EMPLEADO'];
            $tipoFacturacion = 'Multiples Facturas';
            $formaFacturacion = 'Anticipada';
            switch ($idDpto) {
                case 1:
                    $clasificacion = 2;
                    break;
                case 2:
                    $clasificacion = 3;
                    break;
                case 3:
                    $clasificacion = 4;
                    break;
                case 4:
                    $clasificacion = 5;
                    break;
                default:
                    $clasificacion = 2;
                    break;
            }
            $idMcpoCRM = $this->getIdMcpoCRM($idMcpo);
            $observacion = $idCambioTitular . ";CAMBIO TITULAR;" . $antiguoTitular . ";" . $fechahoraconfirm;
            $consultas[] = "INSERT INTO residencial(idMcpo, idPrefijo, registradoPor, cedula, nombres, 
                            apellidos, direccion, celular1, celular2, celular3, telefono, email1, email2, observacion, 
                            estrato, tipoFacturacion, formaFacturacion, clasificacion, referenciado, referenciadoPor, fix, login, password, modificadopor)
                            VALUES($idMcpo, 6, $registradoPor, '$identificacion', '$nombres', 
                            '$apellidos', '$direccion', '$celular', '', '', '$celular', '$email', '', '$observacion',
                            $estrato, '$tipoFacturacion', '$formaFacturacion', $clasificacion,
                            0, '', 1, '', '', '')";
            $consultas[] = "UPDATE contrato SET contrato.idResidencial = {ultimoID} WHERE contrato.idContrato = $idContrato LIMIT 1";
            $consultas[] = "INSERT INTO cuenta(idResidencial, tipoCliente) VALUES({ultimoID}, 'Residencial')";
            $consultas[] = "INSERT INTO llamadas_BD.residencial(cedula, idMcpo, nombres, apellidos, direccion, telefono, email, idResidencial2C)
                            VALUES('$identificacion', $idMcpoCRM, '$nombres', '$apellidos', '$direccion', '$celular', '$email', {ultimoID})";
        }
//        print_r($consultas);
        return $this->ejecutarTransaccion($consultas);
    }

//------------------------------------------------------------------------------

    public function getUltimoIdResidencial() {
        $this->consulta = "SELECT MAX(idResidencial) AS ultimo FROM residencial";
        if ($this->consultarBD() > 0) {
            return $this->registros[0]['ultimo'];
        } else {
            return 0;
        }
    }

//------------------------------------------------------------------------------

    public function insertarResidencialCRM($infoNuevoTitular) {
        $consultas = array();
        foreach ($infoNuevoTitular as $campo => $vlr) {
            $$campo = $vlr;
        }
        $idMcpoCRM = $this->getIdMcpoCRM($idMcpo);
        $consultas[] = "INSERT INTO llamadas_BD.residencial(cedula, idMcpo, nombres, apellidos, direccion, telefono, email, idResidencial2C)
                        VALUES('$identificacion', $idMcpoCRM, '$nombres', '$apellidos', '$direccion', '$celular', '$email', $idResidencial)";
//        print_r($consultas);
        return $this->ejecutarTransaccion($consultas);
    }

//------------------------------------------------------------------------------

    public function vincularNuevoContrato($idResidencial = 0, $idContrato = 0) {
        $consultas = array();
        $consultas[] = "UPDATE contrato SET contrato.idResidencial = $idResidencial WHERE contrato.idContrato = $idContrato LIMIT 1";
//        print_r($consultas);
        return $this->ejecutarTransaccion($consultas);
    }

//------------------------------------------------------------------------------

    public function getIdMcpoCRM($idMcpo2C = 0) {
        $this->consulta = "SELECT idMcpo FROM municipio WHERE idMcpo2C = $idMcpo2C LIMIT 1";
//        echo $this->consulta;
        $this->consultarBD('llamadas_BD');
        if (count($this->registros) > 0) {
            return $this->registros[0]['idMcpo'];
        } else {
            return 0;
        }
    }

//------------------------------------------------------------------------------

    public function setDelete($idCambioTitular = 0, $estado = '') {
        $confirmadopor = $_SESSION['NOMBRES_APELLIDO_USUARIO'];
        $fechahoraconfirm = date('Y-m-d H:i:s');
        $consultas = array();
        $consultas[] = "UPDATE cambio_titular SET estado = 'Eliminado', confirmadopor = '$confirmadopor', fechahoraconfirm = '$fechahoraconfirm' WHERE idCambioTitular = $idCambioTitular LIMIT 1";
        print_r($consultas);
        return $this->ejecutarTransaccion($consultas);
    }

//------------------------------------------------------------------------------

    public function registrar($datos = array()) {
        foreach ($datos as $campo => $vlr) {
            $$campo = $vlr;
        }
        $registradopor = $_SESSION['NOMBRES_APELLIDO_USUARIO'];
        $fechahorareg = date('Y-m-d H:i:s');
        $consultas = array();
        $consultas[] = "INSERT INTO nuevo_titular VALUES(NULL, $idDpto, $idMcpo, '$tipopersona', '$identificacion', '$nombres', '$apellidos', '', '', '', '$direccion', $estrato, '$barrio', '$celular', '$email', '$registradopor', '', '$fechahorareg', '0000-00-00 00:00:00')";
        $consultas[] = "INSERT INTO cambio_titular VALUES(NULL, {ultimoID}, $idServicio, 'Registrado', '$formato', '$registradopor', '', '', '$fechahorareg', '0000-00-00 00:00:00', '0000-00-00 00:00:00')";
        //print_r($consultas);
        return $this->ejecutarTransaccion($consultas);
    }

//------------------------------------------------------------------------------

    public function getInfoCliente($idServicio = 0) {
        $this->consulta = "SELECT 
                            IF(contrato.idResidencial IS NOT NULL, (SELECT CONCAT(residencial.nombres, ' ', residencial.apellidos) FROM residencial WHERE residencial.idResidencial = contrato.idResidencial LIMIT 1), (SELECT corporativo.razonSocial FROM corporativo WHERE corporativo.idCorporativo = contrato. idCorporativo LIMIT 1)) AS cliente
                           FROM contrato
                           INNER JOIN servicio ON contrato.idContrato = servicio.idContrato
                           WHERE servicio.idServicio = $idServicio LIMIT 1";
//        echo $this->consulta;
        $numRegistros = $this->consultarBD();
        if ($numRegistros > 0) {
            return true;
        } else {
            return false;
        }
    }

//------------------------------------------------------------------------------

    public function getFormato($idCambioTitular = 0) {
        $this->consulta = "SELECT 
                            cambio_titular.formato
                           FROM cambio_titular
                           WHERE cambio_titular.idCambioTitular = $idCambioTitular LIMIT 1";
//        echo $this->consulta;   
        $numRegistros = $this->consultarBD();
        if ($numRegistros > 0) {
            return true;
        } else {
            return false;
        }
    }

//------------------------------------------------------------------------------

    public function existeIdentificacion($identificacion = '') {
        $this->consulta = "SELECT COUNT(residencial.idResidencial) AS existe
                           FROM residencial
                           WHERE residencial.cedula = '$identificacion'";
//        echo $this->consulta;   
        if ($this->consultarBD() > 0) {
            if (intval($this->registros[0]['existe']) > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

//------------------------------------------------------------------------------

    public function existeIdentificacionNuevoTitular($identificacion = '') {
        $this->consulta = "SELECT COUNT(nuevo_titular.identificacion) AS existe
                           FROM nuevo_titular
                           WHERE nuevo_titular.identificacion = '$identificacion'";
//        echo $this->consulta;   
        if ($this->consultarBD() > 0) {
            if (intval($this->registros[0]['existe']) > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

//------------------------------------------------------------------------------

    public function getDepartamentos() {
        $this->consulta = "SELECT departamento.idDpto, departamento.nombreDpto FROM departamento ORDER BY departamento.nombreDpto ASC";
        $this->consultarBD();
        return $this->registros;
    }

//------------------------------------------------------------------------------

    public function getMunicipios($idDpto = 0) {
        $this->consulta = "SELECT municipio.idMcpo, municipio.nombreMcpo FROM municipio WHERE municipio.idDpto = $idDpto ORDER BY municipio.nombreMcpo ASC";
        $this->consultarBD();
        return $this->registros;
    }

//------------------------------------------------------------------------------

    public function getNuevoTitularById($idNuevoTitular = 0) {
        $this->consulta = "SELECT 
                            nuevo_titular.idDpto,
                            nuevo_titular.idMcpo,
                            nuevo_titular.tipopersona,
                            nuevo_titular.identificacion,
                            nuevo_titular.nombres,
                            nuevo_titular.apellidos,
                            nuevo_titular.razonsocial,
                            nuevo_titular.representantelegal,
                            nuevo_titular.identificarepresentante,
                            nuevo_titular.direccion,
                            nuevo_titular.estrato,
                            nuevo_titular.barrio,
                            nuevo_titular.celular,
                            nuevo_titular.email
                           FROM nuevo_titular 
                           WHERE nuevo_titular.idNuevoTitular = $idNuevoTitular LIMIT 1";
        if ($this->consultarBD() > 0) {
            return true;
        } else {
            return false;
        }
    }

//------------------------------------------------------------------------------

    public function getAntiguoTitularById($idCambioTitular = 0) {
        $this->consulta = "SELECT
                            residencial.idResidencial AS idClienteAntiguo,
                            CONCAT(residencial.nombres, ' ', residencial.apellidos) AS clienteAntiguo,
                            residencial.cedula AS identificacionAntiguo,
                            servicio.idContrato
                           FROM cambio_titular
                           INNER JOIN servicio ON cambio_titular.idServicio = servicio.idServicio
                           INNER JOIN contrato ON servicio.idContrato = contrato.idContrato
                           INNER JOIN residencial ON contrato.idResidencial = residencial.idResidencial
                           WHERE cambio_titular.idCambioTitular = $idCambioTitular LIMIT 1";
        if ($this->consultarBD() > 0) {
            return true;
        } else {
            return false;
        }
    }

}

?>
