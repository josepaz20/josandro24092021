<?php

// ********************** MODULO AMPLICION DE RED **********************

require_once('../../servicios/accesoDatos.php');

date_default_timezone_set('America/Bogota');

class CargoEmpleado extends AccesoDatos {

    /**
     * Obtiene la informacion de todos los EMPLEADOS (TECNICOS) registradas en el sistema. 
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     */
    public function getCargos($filtro = '') {
        $this->consulta = "SELECT 
                            cargo_empleado.idCargo,
                            cargo_empleado.cargo,                            
                            cargo_empleado.estado,
                            cargo_empleado.registradopor,
                            cargo_empleado.modificadopor,
                            cargo_empleado.fechahorareg,
                            cargo_empleado.fechahoramod
                            FROM cargo_empleado";
        if ($filtro != '') {
            $this->consulta .= ' ' . $filtro;
        }
       // echo $this->consulta;
        $numRegistros = $this->consultarBD();
        $this->mensaje = "Registros Encontrados: <b>$numRegistros</b>";
        if ($numRegistros > 0) {
            return true;
        } else {
            return false;
        }
    }

//------------------------------------------------------------------------------ 
    public function getCargo($idCargo = 0) {
        
        $this->consulta = "SELECT 
                            cargo_empleado.idCargo,
                            cargo_empleado.cargo,                            
                            cargo_empleado.estado,
                            cargo_empleado.registradopor,
                            cargo_empleado.modificadopor,
                            cargo_empleado.fechahorareg,
                            cargo_empleado.fechahoramod                            
                            FROM cargo_empleado                      
                           WHERE cargo_empleado.idCargo = $idCargo LIMIT 1";
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
        $registradopor = $_SESSION['NOMBRES_APELLIDO_USUARIO'];
        $fechahorareg = date('Y-m-d H:i:s');
        $consultas[] = "INSERT INTO cargo_empleado (cargo, estado, registradopor, modificadopor, fechahorareg, fechahoramod)
                        VALUES('$cargo', 'Registrado', '$registradopor', '', '$fechahorareg', '0000-00-00 00:00:00')";
        //print_r($consultas);
        return $this->ejecutarTransaccion($consultas);
    }

//------------------------------------------------------------------------------

    public function actualizar($datos = array()) {
        foreach ($datos as $campo => $vlr) {
            $$campo = $vlr;
        }
        $consultas = array();
        $consultas[] = "UPDATE cargo_empleado SET
                         cargo = '$cargo'
                        WHERE cargo_empleado.idCargo = $idCargo LIMIT 1";
        //print_r($datos);
        return $this->ejecutarTransaccion($consultas);
    }

//------------------------------------------------------------------------------
    
    public function setDelete($datos = array()) {
        foreach ($datos as $campo => $vlr) {
            $$campo = $vlr;
        }
        $fechahoramod = date('Y-m-d H:i:s');
        $consultas = array();
        $consultas[] = "UPDATE cargo_empleado SET
                        estado = 'Eliminado',
                        fechahoramod= '$fechahoramod'
                        WHERE cargo_empleado.idCargo = $idCargo LIMIT 1";
        //print_r($datos);
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

   

}

?>
