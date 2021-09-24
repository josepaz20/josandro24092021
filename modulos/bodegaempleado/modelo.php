<?php

// ********************** MODULO RECURSO **********************

require_once('../../servicios/accesoDatos.php');

date_default_timezone_set('America/Bogota');

class BodegaEmpleado extends AccesoDatos {

    /**
     * Obtiene la informacion de todos los EMPLEADOS (TECNICOS) registradas en el sistema. 
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     */
    public function getBodegas($filtro = '') {
        $this->consulta = "SELECT 
                            bodega_empleado.idBodegaEmpleado, 
                            bodega_empleado.estado, 
                            (SELECT CONCAT(swDobleClick_BD.empleado.primerNombre, ' ', swDobleClick_BD.empleado.segundoNombre, ' ', swDobleClick_BD.empleado.primerApellido, ' ', swDobleClick_BD.empleado.segundoApellido) FROM swDobleClick_BD.empleado WHERE swDobleClick_BD.empleado.idEmpleado = bodega_empleado.idEmpleado LIMIT 1) as empleado
                           FROM bodega_empleado";
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

    public function getRecursosByIdBodega($idBodegaEmpleado = 0) {
        $this->consulta = "SELECT 
                            recurso.idRecurso, 
                            tipo_recurso.nombre, 
                            recurso.serial, 
                            recurso.estado,
                            recurso.usado,
                            entrega.fechaHoraReg AS fechaentrega,
                            (SELECT entrega.idOrden FROM entrega WHERE entrega.idEntrega = recurso.idEntrega ORDER BY entrega.idEntrega DESC LIMIT 1) AS idOT
                           FROM recurso 
                           INNER JOIN tipo_recurso ON recurso.idTipoRecurso = tipo_recurso.idTipoRecurso
                           LEFT JOIN entrega ON recurso.idEntrega = entrega.idEntrega
                           WHERE recurso.idBodegaEmpleado = $idBodegaEmpleado";
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

    public function getRecursoByIdRecurso($idRecurso = 0) {
        $this->consulta = "SELECT
                            recurso.idRecurso,
                            recurso.idBodegaEmpleado,
                            tipo_recurso.nombre AS tipo,
                            recurso.serial,
                            recurso.nombre AS recurso,
                            recurso.estado,
                            entrega.idOrden AS idOT, 
                            entrega.fechaHoraReg AS fechaHoraEntrega
                           FROM recurso
                           INNER JOIN tipo_recurso ON recurso.idTipoRecurso = tipo_recurso.idTipoRecurso
                           LEFT JOIN entrega ON recurso.idEntrega = entrega.idEntrega
                           WHERE recurso.idRecurso = $idRecurso LIMIT 1";
//        echo $this->consulta;
        if ($this->consultarBD() > 0) {
            return true;
        } else {
            return false;
        }
    }

//------------------------------------------------------------------------------    

    public function registrarDevolucion($idBodegaEmpleado = 0, $idRecurso = 0) {
        $registradopor = $_SESSION['NOMBRES_APELLIDO_USUARIO'];
        $fechahorareg = date('Y-m-d H:i:s');
        $consultas[] = "INSERT INTO salida_recurso_bodega(idBodegaEmpleado, idRecurso, idDevolucion, registradopor, fechahorareg) 
                        VALUES($idBodegaEmpleado, $idRecurso, 0, '$registradopor', '$fechahorareg')";
        if ($this->ejecutarTransaccion($consultas)) {
            return true;
        } else {
            return false;
        }
    }

//------------------------------------------------------------------------------    

    public function marcarRecursoUsado($idRecurso = 0) {
        $marcadoUsadoPor = $_SESSION['NOMBRES_APELLIDO_USUARIO'];
        $fechaHoraMarcadoUsado = date('Y-m-d H:i:s');
        $consultas[] = "UPDATE recurso SET 
                         usado = 1,
                         marcadoUsadoPor = '$marcadoUsadoPor',
                         fechaHoraMarcadoUsado = '$fechaHoraMarcadoUsado'
                        WHERE idRecurso = $idRecurso LIMIT 1";
        if ($this->ejecutarTransaccion($consultas)) {
            return true;
        } else {
            return false;
        }
    }

//------------------------------------------------------------------------------    

    public function getMaterialesByIdBodega($idBodegaEmpleado = 0) {
        $this->consulta = "SELECT
                            bodega_material.idBodegaEmpleado,
                            bodega_material.idMaterial,
                            bodega_material.existencias,
                            material.material,
                            material.cantminima,
                            tipo_material.nombre AS tipo
                           FROM bodega_material
                           INNER JOIN material ON bodega_material.idMaterial = material.idMaterial
                           INNER JOIN tipo_material ON material.idTipoMaterial = tipo_material.idTipoMaterial
                           WHERE bodega_material.idBodegaEmpleado = $idBodegaEmpleado AND material.idMaterial >= 272";
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

    public function getMaterialByIdMaterial($idMaterial = 0, $idBodegaEmpleado = 0) {
        $this->consulta = "SELECT
                            bodega_material.idMaterial,
                            bodega_material.idBodegaEmpleado,
                            tipo_material.nombre AS tipo,
                            material.material,
                            material.existencias AS totalExistencias,
                            bodega_material.existencias,
                            (SELECT SUM(entrada_material_bodega.cantidad) FROM entrada_material_bodega WHERE entrada_material_bodega.idBodegaEmpleado = bodega_material.idBodegaEmpleado AND entrada_material_bodega.idMaterial = bodega_material.idMaterial) as cantIngreso,
                            (SELECT SUM(salida_material_bodega.cantidad) FROM salida_material_bodega WHERE salida_material_bodega.idBodegaEmpleado = bodega_material.idBodegaEmpleado AND salida_material_bodega.idMaterial = bodega_material.idMaterial) as cantGasto
                           FROM bodega_material
                           INNER JOIN material ON bodega_material.idMaterial = material.idMaterial
                           INNER JOIN tipo_material ON material.idTipoMaterial = tipo_material.idTipoMaterial
                           WHERE bodega_material.idMaterial = $idMaterial AND bodega_material.idBodegaEmpleado = $idBodegaEmpleado LIMIT 1";
//        echo $this->consulta;
        if ($this->consultarBD() > 0) {
            return true;
        } else {
            return false;
        }
    }

//------------------------------------------------------------------------------    

    public function asignarMaterial($actualizarInventario = 0, $idMaterial = 0, $idBodegaEmpleado = 0, $cantidad = 0) {
        $registradopor = $_SESSION['NOMBRES_APELLIDO_USUARIO'];
        $fechahorareg = date('Y-m-d H:i:s');
        $consultas[] = "INSERT INTO entrada_material_bodega(idBodegaEmpleado, idMaterial, idOT, cantidad, registradopor, fechahorareg) 
                        VALUES($idBodegaEmpleado, $idMaterial, 0, $cantidad, '$registradopor', '$fechahorareg')";
        if ($actualizarInventario == 1) {
            $consultas[] = "UPDATE material SET
                             existencias = existencias - $cantidad
                            WHERE material.idMaterial = $idMaterial LIMIT 1";
        }
//        print_r($consultas);
//        return false;
        if ($this->ejecutarTransaccion($consultas)) {
            return true;
        } else {
            return false;
        }
    }

//------------------------------------------------------------------------------    

    public function sacarMaterial($actualizarInventario = 0, $idMaterial = 0, $idBodegaEmpleado = 0, $cantidad = 0) {
        $registradopor = $_SESSION['NOMBRES_APELLIDO_USUARIO'];
        $fechahorareg = date('Y-m-d H:i:s');
        $consultas[] = "INSERT INTO salida_material_bodega(idBodegaEmpleado, idMaterial, idOT, cantidad, registradopor, fechahorareg) 
                        VALUES($idBodegaEmpleado, $idMaterial, 0, $cantidad, '$registradopor', '$fechahorareg')";
        if ($actualizarInventario == 1) {
            $consultas[] = "UPDATE material SET
                             existencias = existencias + $cantidad
                            WHERE material.idMaterial = $idMaterial LIMIT 1";
        }
//        print_r($consultas);
//        return false;
        if ($this->ejecutarTransaccion($consultas)) {
            return true;
        } else {
            return false;
        }
    }

//------------------------------------------------------------------------------

    public function getInfoBodegaEmpleado($idBodegaEmpleado = 0) {
        $this->consulta = "SELECT 
                            bodega_empleado.idBodegaEmpleado, 
                            bodega_empleado.idEmpleado, 
                            (SELECT CONCAT(swDobleClick_BD.empleado.primerNombre, ' ', swDobleClick_BD.empleado.segundoNombre, ' ', swDobleClick_BD.empleado.primerApellido, ' ', swDobleClick_BD.empleado.segundoApellido) FROM swDobleClick_BD.empleado WHERE swDobleClick_BD.empleado.idEmpleado = bodega_empleado.idEmpleado LIMIT 1) AS empleado
                           FROM bodega_empleado
                           WHERE bodega_empleado.idBodegaEmpleado = $idBodegaEmpleado LIMIT 1";
//        echo $this->consulta;
        if ($this->consultarBD() > 0) {
            return true;
        } else {
            return false;
        }
    }

//------------------------------------------------------------------------------

    public function getMaterialesAlmacenNoBogEmpl($idBodegaEmpleado = 0) {
        $this->consulta = "SELECT 
                            material.idMaterial,
                            material.material,  
                            tipo_material.nombre AS tipomaterial
                           FROM material 
                           INNER JOIN tipo_material ON material.idTipoMaterial = tipo_material.idTipoMaterial 
                           WHERE (SELECT COUNT(bodega_material.idBodegaEmpleado) FROM bodega_material WHERE bodega_material.idMaterial = material.idMaterial AND bodega_material.idBodegaEmpleado = $idBodegaEmpleado) = 0 AND material.idMaterial >= 272
                           ORDER BY material.material ASC";
//        echo $this->consulta;
        if ($this->consultarBD() > 0) {
            return true;
        } else {
            return false;
        }
    }

//------------------------------------------------------------------------------    

    public function registrarMaterialBodega($idBodegaEmpleado = 0, $idMaterial = 0) {
        $registradopor = $_SESSION['NOMBRES_APELLIDO_USUARIO'];
        $fechahorareg = date('Y-m-d H:i:s');
        $consultas[] = "INSERT INTO bodega_material(idBodegaEmpleado, idMaterial, existencias, estado, registradopor, fechahorareg) 
                        VALUES($idBodegaEmpleado, $idMaterial, 0, 'Registrado', '$registradopor', '$fechahorareg')";
//        print_r($consultas);
//        return false;
        if ($this->ejecutarTransaccion($consultas)) {
            return true;
        } else {
            return false;
        }
    }

//------------------------------------------------------------------------------    

    public function getEmpleados() {
        $this->consulta = "SELECT
                            empleado.idEmpleado,
                            empleado.primerNombre,
                            empleado.segundoNombre,
                            empleado.primerApellido,
                            empleado.segundoApellido
                           FROM empleado
                           INNER JOIN contrato_laboral ON empleado.idEmpleado = contrato_laboral.idEmpleado
                           WHERE (SELECT COUNT(swInventario_BD.bodega_empleado.idBodegaEmpleado) FROM swInventario_BD.bodega_empleado WHERE swInventario_BD.bodega_empleado.idEmpleado = empleado.idEmpleado) = 0
                            AND (contrato_laboral.tipoContrato = 'Laboral Tecnico'
                            OR contrato_laboral.tipoContrato = 'Laboral Tecnico con Bonificacion'
                            OR contrato_laboral.tipoContrato = 'Aprendizaje'
                            OR contrato_laboral.cargo = 'Tecnico Planta Externa'
                            OR contrato_laboral.cargo = 'Tecnico de Instalacion y Mantenimiento'
                            OR contrato_laboral.cargo = 'Contratista (Tipo 3)'
                            OR contrato_laboral.cargo = 'Contratista (Tipo 2)'
                            OR contrato_laboral.cargo = 'Contratista (Radioenlace)'
                            OR contrato_laboral.cargo = 'Contratista')
                            GROUP BY empleado.idEmpleado";
//        echo $this->consulta;
        $this->consultarBD('swDobleClick_BD');
        return $this->registros;
    }

//------------------------------------------------------------------------------

    public function registrarBodegas($idsEmpleados = array()) {
        $consultas = array();
        foreach ($idsEmpleados as $idEmpleado) {
            $consultas[] = "INSERT INTO bodega_empleado(idEmpleado, estado) VALUES($idEmpleado, 'Registrado')";
        }
        if ($this->ejecutarTransaccion($consultas)) {
            return true;
        } else {
            return false;
        }
    }

//------------------------------------------------------------------------------

    public function tieneBodega($idEmpleado = 0) {
        $this->consulta = "SELECT COUNT(bodega_empleado.idBodegaEmpleado) AS tiene
                           FROM bodega_empleado
                           WHERE bodega_empleado.idEmpleado = $idEmpleado";
//        echo $this->consulta;
        if ($this->consultarBD() > 0) {
            if (intval($this->registros[0]['tiene']) == 0) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

//------------------------------------------------------------------------------    

    public function getInfoOT($idOT = 0) {
        $this->consulta = "SELECT 
                            asignaciones.idAsignada,
                            asignaciones.estado
                           FROM asignaciones 
                           WHERE asignaciones.idAsignada = $idOT LIMIT 1";
//        echo $this->consulta;
        $numRegistros = $this->consultarBD('llamadas_BD');
        $this->mensaje = "Registros Encontrados: <b>$numRegistros</b>";
        if ($numRegistros > 0) {
            return true;
        } else {
            return false;
        }
    }

//------------------------------------------------------------------------------    
}

?>
