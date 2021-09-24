<?php

// ********************** MODULO AMPLICION DE RED **********************

require_once('../../servicios/accesoDatos.php');

date_default_timezone_set('America/Bogota');

class ViabilidadRed extends AccesoDatos {

    /**
     * Obtiene la informacion de todos los EMPLEADOS (TECNICOS) registradas en el sistema. 
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     */
    public function getViabilidadesdeRed($filtro = '') {
        $this->consulta = "SELECT 
                            viabilidad_ampliacion.idAmpliacion,
                            viabilidad_ampliacion.idViabilidad,
                            viabilidad_ampliacion.costototal,
                            viabilidad_ampliacion.observaciones,
                            viabilidad_ampliacion.estado,
                            viabilidad_ampliacion.registradopor,
                            viabilidad_ampliacion.modificadopor,
                            viabilidad_ampliacion.fechahorareg,
                            viabilidad_ampliacion.fechahoramod
                            FROM viabilidad_ampliacion
                           
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

    public function getViabilidadRed($idViabilidad = '') {
        $this->consulta = "SELECT 
                            viabilidad_ampliacion.idAmpliacion,
                            viabilidad_ampliacion.idViabilidad,
                            viabilidad_ampliacion.costototal,
                            viabilidad_ampliacion.observaciones,
                            viabilidad_ampliacion.estado,
                            viabilidad_ampliacion.registradopor,
                            viabilidad_ampliacion.modificadopor,
                            viabilidad_ampliacion.fechahorareg,
                            viabilidad_ampliacion.fechahoramod
                            FROM viabilidad_ampliacion
                           
                           WHERE viabilidad_ampliacion.idViabilidad = $idViabilidad LIMIT 1";
//        echo $this->consulta;
        return $this->consultarBD();
    }

//------------------------------------------------------------------------------ 
    public function getactualizarViabilidadRed($idAmpliacion = '') {
        $this->consulta = "
                            SELECT 
                            viabilidad_ampliacion.idAmpliacion,
                            viabilidad_ampliacion.idViabilidad,
                            viabilidad_ampliacion.costototal,
                            viabilidad_ampliacion.observaciones,
                            viabilidad_ampliacion.estado,
                            viabilidad_ampliacion.registradopor,
                            viabilidad_ampliacion.modificadopor,
                            viabilidad_ampliacion.fechahorareg,
                            viabilidad_ampliacion.fechahoramod
                            FROM viabilidad_ampliacion
                           
                           WHERE viabilidad_ampliacion.idViabilidad = $idAmpliacion LIMIT 1";
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
        $consultas[] = "INSERT INTO viabilidad_ampliacion (idAmpliacion, costototal, observaciones, estado, registradopor, modificadopor,  fechahorareg, fechahoramod)
                        VALUES($idAmpliacion, $costototal, '$observaciones',  'Registrado', '$registradopor', '', '$fechahorareg', '0000-00-00 00:00:00')";
        // print_r($consultas);
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
            $modificadopor = $_SESSION['NOMBRES_APELLIDO_USUARIO'];
            $registradopor = $_SESSION['NOMBRES_APELLIDO_USUARIO'];
            $confirmadopor = '';
            $fechahoramod = date('Y-m-d H:i:s');
            $fechahorareg = date('0000-00-00 00:00:00');
            $fechahoraconfirm = date('0000-00-00 00:00:00');
            $estado = 'Registrado';

            $consultas = array();

            $consultas[] = "UPDATE viabilidad_ampliacion SET idAmpliacion =$idAmpliacion, costototal='$costototal', observaciones= '$observaciones',  estado= '$estado',registradopor='$registradopor',  modificadopor='$modificadopor',    fechahorareg='$fechahorareg', fechahoramod'$fechahoramod' WHERE idViabilidad=$idViabilidad";

            //print_r($consultas);
            return $this->ejecutarTransaccion($consultas);
        }
    }

//------------------------------------------------------------------------------
    public function getRecursos($filtro = '') {
        $this->consulta = " SELECT idTipoRecurso, nombre FROM tipo_recurso"
                . " WHERE estado = 'Registrado' "
                . "ORDER BY nombre DESC";
        if ($filtro != '') {
            $this->consulta .= ' ' . $filtro;
        }

        //echo $this->consulta;
        $numRegistros = $this->consultarBD('swInventario_BD');
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
    public function setUpdate($datos = array(), $idViabilidad) {
        foreach ($datos as $campo => $vlr) {
            $$campo = $vlr;
        }
        $modificadopor = $_SESSION['NOMBRES_APELLIDO_USUARIO'];
        $registradopor = $_SESSION['NOMBRES_APELLIDO_USUARIO'];
        $confirmadopor = '';
        $fechahoramod = date('Y-m-d H:i:s');
        $fechahorareg = date('0000-00-00 00:00:00');
        $fechahoraconfirm = date('0000-00-00 00:00:00');
        $estado = 'Registrado';

        $consultas = array();

        $consultas[] = "UPDATE viabilidad_ampliacion SET idAmpliacion=$idAmpliacion, costototal=$costototal, observaciones='$observaciones', estado='$estado', registradopor='$registradopor', modificadopor='$modificadopor', fechahorareg='$fechahorareg', fechahoramod='$fechahoramod' WHERE idViabilidad=$idViabilidad";

        //print_r($consultas);
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

    public function setInsertarRecurso($datos = array(), $idViabilidad = 0) {
//        foreach ($datos as $campo => $vlr) {
//            $$campo = $vlr;
//        }
        $registradopor = $_SESSION['NOMBRES_APELLIDO_USUARIO'];
        $fechahorareg = date('Y-m-d H:i:s');
        $consultas = array();
        foreach ($datos as $dato) {
            $idTipoRecurso = $dato['idTipoRecurso'];
            $cantidad = $dato['cantidad'];
            $valor = $dato['valor'];

            $consultas[] = "INSERT INTO viabilidad_recurso "
                    . "VALUES($idViabilidad,$idTipoRecurso, $cantidad, $valor, 'Registrado', '$registradopor', '', '$fechahorareg', '0000-00-00 00:00:00')";
        }
        //print_r($consultas);
        return $this->ejecutarTransaccion($consultas);
    }

    public function getRecursosInventario($idViabilidad = 0) {
        $this->consulta = "
                            SELECT 
                            viabilidad_recurso.idViabilidad,
                            viabilidad_recurso.idTipoRecurso,
                            viabilidad_recurso.cantidad,                           
                            viabilidad_recurso.valor,
                            viabilidad_recurso.estado,
                            viabilidad_recurso.registradopor,
                            viabilidad_recurso.modificadopor,
                            viabilidad_recurso.fechahorareg,
                            viabilidad_recurso.fechahoramod,
                            swInventario_BD.tipo_recurso.nombre
                            FROM viabilidad_recurso
                            INNER JOIN swInventario_BD.tipo_recurso ON swInventario_BD.tipo_recurso.idTipoRecurso = viabilidad_recurso.idTipoRecurso
                            WHERE viabilidad_recurso.idViabilidad = $idViabilidad";
        //echo $this->consulta;
        return $this->consultarBD();
    }

    public function getEliminarInventario($idViabilidad = 0, $idTipoRecurso = 0) {
        $this->consulta = " SELECT 
                            viabilidad_recurso.idViabilidad,
                            viabilidad_recurso.idTipoRecurso,
                            viabilidad_recurso.cantidad,                           
                            viabilidad_recurso.valor,
                            viabilidad_recurso.estado,
                            viabilidad_recurso.registradopor,
                            viabilidad_recurso.modificadopor,
                            viabilidad_recurso.fechahorareg,
                            viabilidad_recurso.fechahoramod,
                            swInventario_BD.tipo_recurso.nombre
                            FROM viabilidad_recurso
                            INNER JOIN swInventario_BD.tipo_recurso ON swInventario_BD.tipo_recurso.idTipoRecurso = viabilidad_recurso.idTipoRecurso
                            WHERE viabilidad_recurso.idViabilidad = $idViabilidad AND viabilidad_recurso.idTipoRecurso = $idTipoRecurso ";
        //echo $this->consulta;
        return $this->consultarBD();
    }

    public function setUpdateRecurso($idViabilidad = 0, $idTipoRecurso = 0) {
        $confirmadopor = $_SESSION['NOMBRES_APELLIDO_USUARIO'];
        $fechahoraconfirm = date('Y-m-d H:i:s');
        $consultas = array();
        $consultas[] = "UPDATE viabilidad_recurso SET estado = 'Eliminado' WHERE idViabilidad = $idViabilidad AND idTipoRecurso = $idTipoRecurso LIMIT 1";
        //print_r($consultas);
        return $this->ejecutarTransaccion($consultas);
    }

}

?>
