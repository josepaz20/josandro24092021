<?php

// ********************** MODULO AMPLICION DE RED **********************

require_once('../../servicios/accesoDatos.php');

date_default_timezone_set('America/Bogota');

class Directorio extends AccesoDatos {

    /**
     * Obtiene la informacion de todos los EMPLEADOS (TECNICOS) registradas en el sistema. 
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     */
    public function getDirectorios($filtro = '') {
        $this->consulta = "SELECT 
                            directorio.idDirectorio,
                            directorio.idMcpo,                            
                            directorio.identificacion,
                            directorio.nombres,
                            directorio.apellidos,
                            directorio.telefono,
                            directorio.direccion,
                            directorio.email1,
                            directorio.email2,
                            directorio.extension,
                            directorio.observaciones,
                            directorio.tipoDirectorio,
                            municipio.nombreMcpo,
                            departamento.nombreDpto
                            FROM directorio
                            INNER JOIN municipio ON directorio.idMcpo = municipio.idMcpo
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
    public function getDirectorio($idDirectorio = '') {
        $this->consulta = "SELECT 
                            directorio.idDirectorio,
                            directorio.idMcpo,
                            directorio.identificacion, 
                            directorio.nombres,
                            directorio.apellidos,                           
                            directorio.telefono,
                            directorio.extension,
                            directorio.direccion,
                            directorio.email1,
                            directorio.email2,
                            directorio.observaciones,
                            directorio.tipoDirectorio,                           
                            municipio.nombreMcpo,
                            departamento.nombreDpto,                           
                            municipio.idMcpo,
                            departamento.idDpto                         
                            FROM directorio                           
                           INNER JOIN municipio ON directorio.idMcpo = municipio.idMcpo
                           INNER JOIN departamento ON municipio.idDpto = departamento.idDpto                           
                           WHERE directorio.idDirectorio = $idDirectorio LIMIT 1";
        //echo $this->consulta;
        return $this->consultarBD();
    }

//------------------------------------------------------------------------------ 

    public function registrar($datos = array()) {
        print_r($datos);
        foreach ($datos as $campo => $vlr) {
            $$campo = $vlr;
        }
        $consultas = array();
        $registradopor = $_SESSION['ID_EMPLEADO'];
        $consultas[] = "INSERT INTO directorio (idMcpo,identificacion,nombres,apellidos,telefono,extension,direccion, email1, email2,observaciones,tipoDirectorio)
                        VALUES($idMcpo,'$identificacion','$nombres','$apellidos','$telefono','$extension','$direccion', '$email1', '$email2', '$observaciones', '$tipoDirectorio')";
        print_r($consultas);
        return $this->ejecutarTransaccion($consultas);
    }

//------------------------------------------------------------------------------

    public function actualizar($datos = array()) {
        foreach ($datos as $campo => $vlr) {
            $$campo = $vlr;
        }
        $consultas = array();
        $consultas[] = "UPDATE directorio SET
                         idMcpo = $idMcpo,
                         identificacion ='$identificacion',
                         nombres='$nombres',
                         apellidos='$apellidos',
                         telefono = '$telefono',
                         extension='$extension',
                         direccion='$direccion',
                         email1='$email1',
                         email2='$email2',
                         observaciones='$observaciones',
                         tipoDirectorio ='$tipoDirectorio'
                         
                         
                        WHERE directorio.idDirectorio = $idDirectorio LIMIT 1";
        //print_r($consultas);
        //exit();
        return $this->ejecutarTransaccion($consultas);
    }

//------------------------------------------------------------------------------ 
    public function setDelete($idDirectorio = 0) {

        $consultas = array();
        $consultas[] = "DELETE FROM directorio WHERE directorio.idDirectorio=$idDirectorio ";
        print_r($consultas);
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
    public function existeIdentificacion($identificacion = 0) {
        $this->consulta = "SELECT COUNT(directorio.idDirectorio) AS existe
                           FROM directorio
                           WHERE directorio.identificacion = $identificacion";
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
}

?>
