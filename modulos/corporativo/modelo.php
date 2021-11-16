<?php

// ********************** MODULO AMPLICION DE RED **********************

require_once('../../servicios/accesoDatos.php');

date_default_timezone_set('America/Bogota');

class Corporativo extends AccesoDatos {

    /**
     * Obtiene la informacion de todos los EMPLEADOS (TECNICOS) registradas en el sistema. 
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     */
    public function getCorporativos($filtro = '') {
        $this->consulta = "SELECT 
                            corporativo.idCorporativo,
                            corporativo.idPrefijo,
                            CONCAT(departamento.nombreDpto, '-', municipio.nombreMcpo) AS ubicacion,
                            corporativo.direccion,
                            corporativo.razonSocial,
                            corporativo.celular1,
                            corporativo.email1,
                            corporativo.estado,
                            corporativo.nit
                            FROM corporativo
                            INNER JOIN municipio ON corporativo.idMcpo = municipio.idMcpo
                           INNER JOIN departamento ON municipio.idDpto = departamento.idDpto
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
    public function getCorporativo($idCorporativo = '') {
        $this->consulta = "SELECT 
                            corporativo.idCorporativo,
                            corporativo.idPrefijo,
                            corporativo.nit, 
                            corporativo.direccion,
                            corporativo.telefono,
                            corporativo.razonSocial,
                            corporativo.celular1,
                            corporativo.celular2,
                            corporativo.email1,
                            corporativo.email2,
                            corporativo.observacion,
                            corporativo.referenciado,
                            corporativo.representanteLegal,
                            corporativo.estado,
                            corporativo.registradopor,
                            municipio.nombreMcpo,
                            departamento.nombreDpto,
                            corporativo.referenciadoPor,
                            municipio.idMcpo,
                            departamento.idDpto,
                            corporativo.cedulaRepresentante
                            FROM corporativo                           
                           INNER JOIN municipio ON corporativo.idMcpo = municipio.idMcpo
                           INNER JOIN departamento ON municipio.idDpto = departamento.idDpto
                           
                           WHERE corporativo.idCorporativo = $idCorporativo LIMIT 1";
//        echo $this->consulta;
        return $this->consultarBD();
    }

//------------------------------------------------------------------------------ 

    public function registrar($datos = array()) {
        //print_r($datos);
        foreach ($datos as $campo => $vlr) {
            $$campo = $vlr;
        }
        $consultas = array();
        $registradopor = $_SESSION['ID_EMPLEADO'];
        $consultas[] = "INSERT INTO corporativo (idMcpo, idPrefijo, registradopor, nit, razonSocial, representanteLegal, cedulaRepresentante, direccion, telefono, email1, email2, observacion, estado, tipoFacturacion, formaFacturacion, retirar, clasificacion, referenciado, referenciadoPor, celular1, celular2, celular3, fix)
                        VALUES($idMcpo, 1, $registradopor, '$nit','$razonSocial', '$representanteLegal', '$cedulaRepresentante', '$direccion' , '$telefono', '$email1', '$email2', '$observacion', 'en_sistema', 'Multiples Facturas', 'Anticipada', 0, 1, $referenciado, '', '$celular1', '$celular2', '', 0)";
        //print_r($consultas);
        return $this->ejecutarTransaccion($consultas);
    }

//------------------------------------------------------------------------------

    public function actualizar($datos = array()) {
        foreach ($datos as $campo => $vlr) {
            $$campo = $vlr;
        }
        $consultas = array();
        $consultas[] = "UPDATE corporativo SET
                         idMcpo = $idMcpo,
                         razonSocial = '$razonSocial',
                         nit = '$nit',
                         direccion = '$direccion',
                         telefono = '$telefono',
                         email1 = '$email1',
                         email2 = '$email2',
                         observacion = '$observacion',
                         celular1 = '$celular1',
                         celular2 = '$celular2',
                         representanteLegal = '$representanteLegal',
                         cedulaRepresentante = '$cedulaRepresentante'
                        WHERE corporativo.idCorporativo = $idCorporativo LIMIT 1";
        //print_r($consultas);
        //exit();
        return $this->ejecutarTransaccion($consultas);
    }

//------------------------------------------------------------------------------   
    public function getMunicipios($idDpto = 0) {
        $this->consulta = "SELECT 
                            municipio.idMcpo,
                            municipio.nombreMcpo
                           FROM municipio
                           WHERE municipio.idDpto = $idDpto
                           ORDER BY municipio.nombreMcpo ASC";
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
    public function existeNit($nit = 0) {
        $this->consulta = "SELECT COUNT(corporativo.idCorporativo) AS existe
                           FROM corporativo
                           WHERE corporativo.nit = '$nit'";
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
    public function getDepartamentos($filtro = '') {
        $this->consulta = "SELECT 
                            departamento.idDpto,
                            departamento.nombreDpto
                           FROM departamento
                           ORDER BY departamento.nombreDpto ASC
                           ";
        if ($filtro != '') {
            $this->consulta .= ' ' . $filtro;
        }
        //echo $this->consulta;
        $numRegistros = $this->consultarBD();
        if ($numRegistros > 0) {
            return true;
        } else {
            return false;
        }
    }

//------------------------------------------------------------------------------

    public function setDelete($idCorporativo = 0, $estado = '') {
        $confirmadopor = $_SESSION['NOMBRES_APELLIDO_USUARIO'];
        $fechahoraconfirm = date('Y-m-d H:i:s');
        $consultas = array();
        $consultas[] = "UPDATE corporativo SET estado = 'eliminado' WHERE idCorporativo = $idCorporativo LIMIT 1";
        return $this->ejecutarTransaccion($consultas);
    }

}

?>
