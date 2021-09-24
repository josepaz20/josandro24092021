<?php

// ********************** MODULO AMPLICION DE RED **********************

require_once('../../servicios/accesoDatos.php');

date_default_timezone_set('America/Bogota');

class AmpliacionRed extends AccesoDatos {

    /**
     * Obtiene la informacion de todos los EMPLEADOS (TECNICOS) registradas en el sistema. 
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     */
    public function getAmpliacionesRed($filtro = '') {
        $this->consulta = "SELECT 
                            ampliacion_red.idAmpliacion,
                            CONCAT(departamento.nombreDpto, '-', municipio.nombreMcpo) AS ubicacion,
                            ampliacion_red.direccion,
                            ampliacion_red.contusuariosbenficio,
                            ampliacion_red.beneficioeconomico,
                            ampliacion_red.estado,
                            ampliacion_red.registradopor,
                            ampliacion_red.fechahorareg
                           FROM ampliacion_red
                           INNER JOIN municipio ON ampliacion_red.idMcpo = municipio.idMcpo
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

    public function getAmpliacionRed($idAmpliacion = '') {
        $this->consulta = "SELECT 
                            ampliacion_red.idAmpliacion,
                            CONCAT(departamento.nombreDpto, '-', municipio.nombreMcpo) AS ubicacion,
                            ampliacion_red.direccion,
                            departamento.nombreDpto,
                            municipio.nombreMcpo,
                            municipio.idMcpo,
                            ampliacion_red.contusuariosbenficio,
                            ampliacion_red.beneficioeconomico,
                            ampliacion_red.estado,
                            ampliacion_red.coordenadas,
                            ampliacion_red.justificacion,
                            ampliacion_red.registradopor,
                            ampliacion_red.fechahorareg,
                            ampliacion_red.modificadopor,
                            ampliacion_red.confirmadopor,
                            ampliacion_red.fechahoramod,
                            ampliacion_red.fechahoraconfirm,
                            departamento.idDpto                            
                           FROM ampliacion_red
                           INNER JOIN municipio ON ampliacion_red.idMcpo = municipio.idMcpo
                           INNER JOIN departamento ON municipio.idDpto = departamento.idDpto
                           WHERE ampliacion_red.idAmpliacion = $idAmpliacion LIMIT 1";
//        echo $this->consulta;
        return $this->consultarBD();
    }

//------------------------------------------------------------------------------ 

    public function getAvances($idAmpliacion = 0) {
        $this->consulta = "SELECT 
                            avance_ampliacionred.idAvance,
                            avance_ampliacionred.idAmpliacion,
                            avance_ampliacionred.avance,
                            avance_ampliacionred.estado,
                            avance_ampliacionred.registradopor,
                            avance_ampliacionred.fechahorareg,
                            avance_ampliacionred.modificadopor,
                            avance_ampliacionred.fechahorareg,
                            avance_ampliacionred.fechahoramod                                                   
                            FROM avance_ampliacionred
                            INNER JOIN ampliacion_red ON avance_ampliacionred.idAmpliacion = ampliacion_red.idAmpliacion
                           
                           WHERE avance_ampliacionred.idAmpliacion = $idAmpliacion";
        //print_r($this->consulta);
        return $this->consultarBD();
    }

//------------------------------------------------------------------------------   

    public function registrar($datos = array()) {
        foreach ($datos as $campo => $vlr) {
            $$campo = $vlr;
        }
        $consultas = array();
        $registradopor = $_SESSION['NOMBRES_APELLIDO_USUARIO'];
        $fechahorareg = date('Y-m-d H:i:s');
        $consultas[] = "INSERT INTO ampliacion_red(idMcpo, direccion, coordenadas, justificacion, contusuariosbenficio, beneficioeconomico, estado, registradopor, modificadopor, confirmadopor, fechahorareg, fechahoramod, fechahoraconfirm)
                        VALUES($idMcpo, '$direccion', '$coordenadas', '$justificacion', $contusuariosbenficio, $beneficioeconomico, 'Registrado', '$registradopor', '', '', '$fechahorareg', '0000-00-00 00:00:00', '0000-00-00 00:00:00')";

        return $this->ejecutarTransaccion($consultas);
    }

//------------------------------------------------------------------------------
    public function registraravance($datos = array()) {
        foreach ($datos as $campo => $vlr) {
            $$campo = $vlr;
        }
        $consultas = array();
        $registradopor = $_SESSION['NOMBRES_APELLIDO_USUARIO'];
        $fechahorareg = date('Y-m-d H:i:s');
        $consultas[] = "INSERT INTO avance_ampliacionred(idAvance,idAmpliacion, avance,  estado, registradopor, modificadopor,  fechahorareg, fechahoramod)
                        VALUES(NULL,$idAmpliacion, '$avance',  'Registrado', '$registradopor','',  '$fechahorareg', '0000-00-00 00:00:00')";
       // print_r($consultas);
        return $this->ejecutarTransaccion($consultas);
    }

//------------------------------------------------------------------------------  

    public function actualizar($datos = array()) {
        foreach ($datos as $campo => $vlr) {
            $$campo = $vlr;
        }
        $consultas = array();
        $registradopor = $_SESSION['NOMBRES_APELLIDO_USUARIO'];
        $fechahorareg = date('Y-m-d H:i:s');
        $consultas[] = "UPDATE ampliacion_red VALUES(NULL, '$idMcpo', '$direccion', '$coordenadas', '$justificacion','$contusuariosbenficio','$beneficioeconomico', '$estado',    '$registradopor', '$modificadopor', '$confirmadopor', '$fechahorareg',  '$fechahoramod', '$fechahoraconfirm')";
        // print_r($consultas);
        return $this->ejecutarTransaccion($consultas);
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
    public function setUpdate($datos = array(), $idAmpliacion) {
        foreach ($datos as $campo => $vlr) {
            $$campo = $vlr;
        }
        $modificadopor = $_SESSION['NOMBRES_APELLIDO_USUARIO'];
        $confirmadopor = '';
        $fechahoramod = date('Y-m-d H:i:s');
        $fechahoraconfirm = date('0000-00-00 00:00:00');
        $estado = 'Registrado';

        $consultas = array();

        $consultas[] = "UPDATE ampliacion_red SET idMcpo =$idMcpo, direccion='$direccion', coordenadas= '$coordenadas', justificacion='$justificacion', contusuariosbenficio='$contusuariosbenficio',beneficioeconomico='$beneficioeconomico', estado= '$estado', modificadopor='$modificadopor', confirmadopor='$confirmadopor',   fechahoramod='$fechahoramod', fechahoraconfirm='$fechahoraconfirm' WHERE idAmpliacion=$idAmpliacion";

        // print_r($consultas);
        return $this->ejecutarTransaccion($consultas);
    }

}

?>
