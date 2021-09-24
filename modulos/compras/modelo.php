<?php

// *****************  MODULO NOVEDADES NOMINA  *****************

require_once('../../servicios/accesoDatos.php');

class Compra extends AccesoDatos {

    public function getCompras($filtro = '') {
        $this->consulta = "SELECT 
                            compras.*, 
                            (SELECT COUNT(item_compra.idItem) FROM item_compra WHERE item_compra.idCompra = compras.idCompra AND item_compra.estado = 'Registrado') AS contItems,
                            (SELECT COUNT(aprobacion.idCompra) FROM aprobacion WHERE aprobacion.idCompra = compras.idCompra) AS contAprobaciones,
                            (SELECT COUNT(cotizacion.idCompra) FROM cotizacion WHERE cotizacion.idCompra = compras.idCompra AND cotizacion.estado != 'Eliminado') AS contCotizaciones
                           FROM compras";
        if ($filtro != '') {
            $this->consulta .= " $filtro";
        } else {
            $this->consulta .= " LIMIT 25";
        }
//        echo $this->consulta;
        $this->consultarBD('compras_bd');
        return $this->registros;
    }

//--------------------------------------------------------------------

    public function getTipositems($filtro = '') {
        $this->consulta = "SELECT tipo_item.*
                           FROM tipo_item
                           ";
        if ($filtro != '') {
            $this->consulta .= " $filtro";
        } else {
            $this->consulta .= " LIMIT 25";
        }
//        echo $this->consulta;
        $this->consultarBD('compras_bd');
        return $this->registros;
    }

//--------------------------------------------------------------------

    public function registrar($infoItems = array(), $registradopor = '') {
        $fechahorareg = date('Y-m-d H:i:s');
        $consultas = array();
        $consultas[] = "INSERT INTO compras(estado, registradopor, apruebapago, pagadopor, fechahorareg, fechaapruebapago, fechapago)
                        VALUES('Registrado', '$registradopor', '', '', '$fechahorareg', '0000-00-00 00:00:00', '0000-00-00 00:00:00')";
        foreach ($infoItems as $item) {
            $consultas[] = "INSERT INTO item_compra(idTipoItem, idCompra, descripcion, cantidad, vlrunitario, justificacion, fechalimite, estado, observacion, apruebapago, pagadopor, fechaapruebapago, fechapago) 
                            VALUES(" . $item['idTipoItem'] . ", {ultimoID}, '" . $item['descripcion'] . "', " . $item['cantidad'] . ", " . $item['vlrunitario'] . ", '" . $item['justificacion'] . "', '" . $item['fechalimite'] . "', 'Registrado', '', '', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00')";
        }
//        print_r($consultas);
        return $this->ejecutarTransaccion($consultas, 'compras_bd');
    }

//--------------------------------------------------------------------

    public function getItemsByIdCompra($idCompra = 0) {
        $this->consulta = "SELECT item_compra.*, tipo_item.item, (SELECT COUNT(aprobacion.idAprobacion) FROM aprobacion WHERE aprobacion.idItem = item_compra.idItem) AS contaprobaciones, (SELECT COUNT(cotizacion.idCotizacion) FROM cotizacion WHERE cotizacion.idItem = item_compra.idItem) AS contcotizaciones FROM item_compra INNER JOIN tipo_item ON item_compra.idTipoItem = tipo_item.idTipoItem WHERE item_compra.idCompra = $idCompra";
//        echo $this->consulta;
        $this->consultarBD('compras_bd');
        return $this->registros;
    }

//--------------------------------------------------------------------

    public function getItemByIdItem($idItem = 0) {
        $this->consulta = "SELECT item_compra.*, tipo_item.item FROM item_compra INNER JOIN tipo_item ON item_compra.idTipoItem = tipo_item.idTipoItem WHERE item_compra.idItem = $idItem LIMIT 1";
//        echo $this->consulta;
        $this->consultarBD('compras_bd');
        if (count($this->registros) > 0) {
            return $this->registros[0];
        } else {
            return array();
        }
    }

//--------------------------------------------------------------------

    public function getCompraByIdCompra($idCompra = 0) {
        $this->consulta = "SELECT compras.* FROM compras WHERE compras.idCompra = $idCompra LIMIT 1";
//        echo $this->consulta;
        $this->consultarBD('compras_bd');
        if (count($this->registros) > 0) {
            return $this->registros[0];
        } else {
            return array();
        }
    }

//--------------------------------------------------------------------

    public function getAprobacionesByIdCompra($idCompra = 0) {
        $this->consulta = "SELECT aprobacion.* FROM aprobacion WHERE aprobacion.idCompra = $idCompra";
//        echo $this->consulta;
        $this->consultarBD('compras_bd');
        return $this->registros;
    }

//--------------------------------------------------------------------

    public function addaprobacion($idCompra = 0, $aprobadopor = '') {
        $fechahorareg = date('Y-m-d H:i:s');
        $consultas = array();
        $consultas[] = "INSERT INTO aprobacion(idCompra, tipoAprobacion, aprobadopor, fechaaprobado) VALUES($idCompra, 'Financiera', '$aprobadopor', '$fechahorareg')";
//        print_r($consultas);
        return $this->ejecutarTransaccion($consultas, 'compras_bd');
    }

//--------------------------------------------------------------------

    public function getCotizacionesByIdCompra($idCompra = 0) {
        $this->consulta = "SELECT cotizacion.*, proveedor.proveedor FROM cotizacion INNER JOIN proveedor ON cotizacion.idProveedor = proveedor.idProveedor WHERE cotizacion.idCompra = $idCompra";
//        echo $this->consulta;
        $this->consultarBD('compras_bd');
        return $this->registros;
    }

//--------------------------------------------------------------------

    public function getProveedores() {
        $this->consulta = "SELECT proveedor.idProveedor, proveedor.proveedor FROM proveedor WHERE proveedor.estado = 'Registrado'";
//        echo $this->consulta;
        $this->consultarBD('compras_bd');
        return $this->registros;
    }

//--------------------------------------------------------------------

    public function addcotizacion($datos = array()) {
        foreach ($datos as $campo => $vlr) {
            $$campo = $vlr;
        }
        $fechahorareg = date('Y-m-d H:i:s');
        $consultas = array();
        $consultas[] = "INSERT INTO cotizacion(idCompra, idProveedor, valor, fechacotizacion, estado, registradopor, modificadopor, fechahorareg, fechahoramod)
                        VALUES($idCompra, $idProveedor, $valor, '$fechacotizacion', 'Registrado', '$registradopor', '', '$fechahorareg', '0000-00-00 00:00:00')";
//        print_r($consultas);
        return $this->ejecutarTransaccion($consultas, 'compras_bd');
    }

//--------------------------------------------------------------------

    public function aprobarpago($idCompra = 0, $aprobadopor = '') {
        $fechahorareg = date('Y-m-d H:i:s');
        $consultas = array();
        $consultas[] = "UPDATE compras SET pagadopor = '$aprobadopor', fechapago = '$fechahorareg' WHERE idCompra = $idCompra LIMIT 1";
//        print_r($consultas);
        return $this->ejecutarTransaccion($consultas, 'compras_bd');
    }

//--------------------------------------------------------------------

    public function aprobarItem($idItem = 0, $aprobadopor = '') {
        $fechahorareg = date('Y-m-d H:i:s');
        $consultas = array();
        $consultas[] = "UPDATE item_compra SET estado = 'Aprobado' WHERE idItem = $idItem LIMIT 1";
//        print_r($consultas);
        return $this->ejecutarTransaccion($consultas, 'compras_bd');
    }

//--------------------------------------------------------------------

    public function rechazarItem($idItem = 0, $aprobadopor = '') {
        $fechahorareg = date('Y-m-d H:i:s');
        $consultas = array();
        $consultas[] = "UPDATE item_compra SET estado = 'Rechazado' WHERE idItem = $idItem LIMIT 1";
//        print_r($consultas);
        return $this->ejecutarTransaccion($consultas, 'compras_bd');
    }

//--------------------------------------------------------------------
//--------------------------------------------------------------------
}

?>