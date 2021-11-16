<?php

// ********************** MODULO AMPLICION DE RED **********************

require_once('../../servicios/accesoDatos.php');

date_default_timezone_set('America/Bogota');

class Usuario extends AccesoDatos {

    /**
     * Obtiene la informacion de todos los EMPLEADOS (TECNICOS) registradas en el sistema. 
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     */
    public function getUsuarios($filtro = ''){
        $this->consulta = "SELECT idUsuario, 
            CONCAT(empleado.primerNombre, ' ', segundoNombre, ' ', primerApellido, ' ',
            segundoApellido) AS 
            usuario, usuario.login, usuario.estado, usuario.fechaHoraUltIN 
            FROM usuario INNER JOIN empleado ON usuario.idEmpleado = empleado.idEmpleado";
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
    public function getUsuariosCorporativos($filtro = ''){
        $this->consulta = "SELECT idUsuario, "
                . "corporativo.razonSocial AS usuario,"
                . " usuario.login, usuario.estado, usuario.fechaHoraUltIN "
                . "FROM usuario INNER JOIN corporativo ON usuario.idCorporativo = corporativo.idCorporativo";
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
 public function getUsuarioClave($idUsuario = 0){
        $this->consulta = "SELECT 
                            usuario.idUsuario,                          
                            usuario.login,
                            usuario.idEmpleado,
                            usuario.password,
                            usuario.estado,
                            usuario.fechaHoraUltIN
                            FROM usuario                         
                            WHERE usuario.idUsuario = $idUsuario LIMIT 1";
        //echo $this->consulta;
        return $this->consultarBD();
    }
//------------------------------------------------------------------------------ 
    public function getUsuario($idUsuario = '') {
        $this->consulta = "SELECT 
                            usuario.idUsuario,                          
                            usuario.login,
                            usuario.idEmpleado,
                            usuario.password,
                            usuario.estado,
                            usuario.fechaHoraUltIN
                            FROM usuario                         
                            WHERE usuario.idUsuario = $idUsuario LIMIT 1";
        //echo $this->consulta;
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
        $consultas[] = "INSERT INTO usuario (login, password, estado,privilegio,fechaHoraUltIN,tipoUsuario,accesoModulos)
                        VALUES('$login','$password','Activo',1,'$fechaHoraUltIN', '', '')";
        //print_r($consultas);
        return $this->ejecutarTransaccion($consultas);
    }
//------------------------------------------------------------------------------
    public function actualizar($datos = array()){
        print_r($datos);
        foreach ($datos as $campo => $vlr) {
            $$campo = $vlr;
        }
        $consultas = array();
        $consultas[] = "UPDATE usuario SET
                         login = '$login',
                         password = '$password',
                         fechaHoraUltIN = '$fechaHoraUltIN'                        
                         WHERE usuario.idUsuario = $idUsuario LIMIT 1";
        print_r($consultas);
        //exit();
        return $this->ejecutarTransaccion($consultas);
    }
//------------------------------------------------------------------------------
    public function actualizarcontrasena($datos = array()){        
        foreach ($datos as $campo => $vlr) {
            $$campo = $vlr;
        }
        //print_r($datos);
        $consultas = array();
        $consultas[] = "UPDATE usuario SET                         
                         password = '$password'
                         WHERE usuario.idUsuario = $idUsuario LIMIT 1";
        //print_r($consultas);       
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
    public function setDelete($idUsuario = 0) {
        $confirmadopor = $_SESSION['NOMBRES_APELLIDO_USUARIO'];
        $fechahoraconfirm = date('Y-m-d H:i:s');
        $consultas = array();
        $consultas[] = "UPDATE usuario SET estado = 'Eliminado' WHERE idUsuario = $idUsuario LIMIT 1";
        return $this->ejecutarTransaccion($consultas);
    }
//------------------------------------------------------------------------------
    public function setCheckout($idUsuario = 0) {
        $confirmadopor = $_SESSION['NOMBRES_APELLIDO_USUARIO'];
        $fechahoraconfirm = date('Y-m-d H:i:s');
        $consultas = array();
        $consultas[] = "UPDATE usuario SET estado = 'Activo' WHERE idUsuario = $idUsuario LIMIT 1";
        return $this->ejecutarTransaccion($consultas);
    }
//------------------------------------------------------------------------------
}

?>
