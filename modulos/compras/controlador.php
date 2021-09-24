<?php

// *****************  MODULO COMPRAS  *****************

session_name('SW2CLICK');
session_start();
require_once('../../servicios/sesionOK.php');
require_once('../../servicios/evitarInyeccionSQL.php');
require_once('constantes.php');
require_once('modelo.php');
require_once('vista.php');
//require_once('../mikrotik/ApiMikroTik.php');

controlador();

function controlador() {
    global $respaldo;
    $evento = '';
    $url = $_SERVER['REQUEST_URI'];

    $peticiones = array(vADMINISTRACION, vREGISTRAR, ADD_COMPRA, vDETALLE_COMPRA, vGESTION_ITEMS,
        vGESTION_APROBACIONES, ADD_APROBACION, vGESTION_COTIZACIONES, ADD_COTIZACION, vGESTION_PAGOS,
        vAPROBACION_PAGO, APROBAR_PAGO, vPAGO_COMPRA, vAPROBAR_ITEM, vRECHAZAR_ITEM, APROBAR_ITEM,
        RECHAZAR_ITEM);

    foreach ($peticiones as $peticion) {
        $url_peticion = MODULO . $peticion;
        if (strpos($url, $url_peticion) == true) {
            $evento = $peticion;
        }
    }

    $accesoAdmin = array(1, 2, 23, 121);

    $compraOBJ = new Compra();
    $datos = getDatos();

    $datos['opcInicio'] = '<a href="/sw2click/modulos/secciones/seccionGeneral" title="Seccion general">Inicio</a>';
    $datos['opcCerrarSesion'] = '<a href="/sw2click/modulos/usuarios/cerrarSesion" title="Cerrar Sesion">Cerrar Sesion</a>';

    $datos['bandaOpciones'] = '';

    $accesoRegistrar = array(1, 121, 682, 717);
    if (in_array($_SESSION['ID_USUARIO'], $accesoRegistrar)) {
        $datos['bandaOpciones'] .= '<button class="btn btn-success" onclick="javascript:verRegistrar()" title="REGISTRAR SOLICITUD DE COMPRA"><i class="fa fa-plus"></i> Registrar</button>';
    }

    switch ($evento) {
        case vADMINISTRACION:
            setTablaCompras($compraOBJ->getCompras());
            if (array_key_exists('msg', $datos)) {
                $datos['mensaje'] = getMensaje($datos['msg']);
            } else {
                $datos['mensaje'] = '';
            }
            $datos['scriptOpenCompra'] = '';
            if (array_key_exists('idCompraOpen', $datos)) {
                $datos['scriptOpenCompra'] = '<script>verGestionitems(' . $datos['idCompraOpen'] . ')</script>';
            }
            verVista($evento, $datos);
            break;
        case vREGISTRAR:
            $datos['listaTipositem'] = listaTipoitems($compraOBJ->getTipositems());
            $datos['fechalimiteINI'] = date('Y-m-d', strtotime(date('Y-m-d') . "+ 2 days"));
            echo verVistaAjax($evento, $datos);
            break;
        case ADD_COMPRA:
            $infoItems = array();
            for ($i = 0; $i < $_POST['numItems']; $i++) {
                if (trim($_POST['vlrunitario_' . $i]) == '') {
                    $vlrunitario = 0;
                }
                $infoItems[] = array(
                    'idTipoItem' => $_POST['idTipoItem_' . $i],
                    'descripcion' => strtoupper(trim($_POST['descripcion_' . $i])),
                    'cantidad' => $_POST['cantidad_' . $i],
                    'vlrunitario' => $vlrunitario,
                    'justificacion' => trim($_POST['justificacion_' . $i]),
                    'fechalimite' => $_POST['fechalimite_' . $i],
                );
            }
            if ($compraOBJ->registrar($infoItems, $_SESSION['NOMBRES_APELLIDO_USUARIO'])) {
                $msg = 1;
            } else {
                $msg = 0;
            }
//            echo "<br> --$msg--";
            header("location: /sw2click/modulos/compras/administracion?msg=$msg");
            break;
        case vDETALLE_COMPRA:
            if (array_key_exists('idCompra', $datos)) {
                $datos['tablaitems'] = getTablaItems($compraOBJ->getItemsByIdCompra($datos['idCompra']));
            } else {
                $datos['tablaitems'] = "";
            }
            echo verVistaAjax($evento, $datos);
            break;
        case vGESTION_ITEMS:
            if (array_key_exists('idCompra', $datos)) {
                $datos['tablaitems'] = getTablaItems($compraOBJ->getItemsByIdCompra($datos['idCompra']), true);
            } else {
                $datos['tablaitems'] = "";
            }
            echo verVistaAjax($evento, $datos);
            break;
        case vGESTION_APROBACIONES:
            $infoitem = array(
                'idItem' => 0,
                'tablaaprobaciones' => '',
            );
            if (array_key_exists('idCompra', $datos)) {
                $infoitem = $compraOBJ->getCompraByIdCompra($datos['idCompra']);
                $infoitem['tablaaprobaciones'] = getTablaAprobaciones($compraOBJ->getAprobacionesByIdCompra($datos['idCompra']));
            }
            $infoitem['aprobadopor'] = strtoupper($_SESSION['NOMBRES_USUARIO'] . ' ' . $_SESSION['APELLIDOS_USUARIO']);
            echo verVistaAjax($evento, $infoitem);
            break;
        case ADD_APROBACION:
            $msg = 0;
            if (array_key_exists('idCompra', $datos) && array_key_exists('aprobadopor', $datos)) {
                if ($compraOBJ->addaprobacion($datos['idCompra'], strtoupper($_SESSION['NOMBRES_USUARIO'] . ' ' . $_SESSION['APELLIDOS_USUARIO']))) {
                    $msg = 2;
                }
            }
            header("location: /sw2click/modulos/compras/administracion?msg=$msg");
            break;
        case vGESTION_COTIZACIONES:
            $infoitem = array(
                'idItem' => 0,
                'tablacotizaciones' => '',
            );
            if (array_key_exists('idCompra', $datos)) {
                $infoitem = $compraOBJ->getCompraByIdCompra($datos['idCompra']);
                $infoitem['tablacotizaciones'] = getTablaCotizaciones($compraOBJ->getCotizacionesByIdCompra($datos['idCompra']));
            }
            $infoitem['listaProveedores'] = listaProveedores($compraOBJ->getProveedores());
            $infoitem['fechahoy'] = date('Y-m-d');
            echo verVistaAjax($evento, $infoitem);
            break;
        case ADD_COTIZACION:
            $msg = 0;
            $datos['registradopor'] = $_SESSION['NOMBRES_APELLIDO_USUARIO'];
            if ($compraOBJ->addcotizacion($datos)) {
                $msg = 3;
            }
            header("location: /sw2click/modulos/compras/administracion?msg=$msg");
            break;
        case vGESTION_PAGOS:
            if (array_key_exists('idCompra', $datos)) {
                $datos['tablaitems'] = getTablaItems($compraOBJ->getItemsByIdCompra($datos['idCompra']), true);
            } else {
                $datos['tablaitems'] = "";
            }
            echo verVistaAjax($evento, $datos);
            break;
        case vAPROBACION_PAGO:
            $infoitem = array(
                'idItem' => 0,
                'tablacotizaciones' => '',
                'tablaaprobaciones' => '',
            );
            if (array_key_exists('idItem', $datos)) {
                $infoitem = $compraOBJ->getItemByIdItem($datos['idItem']);
                $infoitem['tablaaprobaciones'] = getTablaAprobaciones($compraOBJ->getAprobacionesByIdItem($datos['idItem']));
                $infoitem['tablacotizaciones'] = getTablaCotizaciones($compraOBJ->getCotizacionesByIdCompra($datos['idItem']));
            }
            $infoitem['aprobadopor'] = strtoupper($_SESSION['NOMBRES_USUARIO'] . ' ' . $_SESSION['APELLIDOS_USUARIO']);
            echo verVistaAjax($evento, $infoitem);
            break;
        case APROBAR_PAGO:
            $msg = 0;
            if (array_key_exists('idCompra', $datos) && array_key_exists('aprobadopor', $datos)) {
                if ($compraOBJ->aprobarpago($datos['idCompra'], strtoupper($_SESSION['NOMBRES_USUARIO'] . ' ' . $_SESSION['APELLIDOS_USUARIO']))) {
                    $msg = 4;
                }
            }
            header("location: /sw2click/modulos/compras/administracion?msg=$msg");
            break;
        case vPAGO_COMPRA:
            $infoitem = array(
                'idCompra' => 0,
                'tablacotizaciones' => '',
                'tablaaprobaciones' => '',
            );
            if (array_key_exists('idCompra', $datos)) {
                $infoitem = $compraOBJ->getCompraByIdCompra($datos['idCompra']);
                $infoitem['tablaaprobaciones'] = getTablaAprobaciones($compraOBJ->getAprobacionesByIdCompra($datos['idCompra']));
                $infoitem['tablacotizaciones'] = getTablaCotizaciones($compraOBJ->getCotizacionesByIdCompra($datos['idCompra']));
            }
            $infoitem['aprobadopor'] = strtoupper($_SESSION['NOMBRES_USUARIO'] . ' ' . $_SESSION['APELLIDOS_USUARIO']);
            $infoitem['fechahoy'] = date('Y-m-d');
            echo verVistaAjax($evento, $infoitem);
            break;
        case vAPROBAR_ITEM:
            if (array_key_exists('idItem', $datos)) {
                $infoitem = $compraOBJ->getItemByIdItem($datos['idItem']);
                $infoitem['vlrunitario'] = number_format($infoitem['vlrunitario']);
            }
            echo verVistaAjax($evento, $infoitem);
            break;
        case vRECHAZAR_ITEM:
            if (array_key_exists('idItem', $datos)) {
                $infoitem = $compraOBJ->getItemByIdItem($datos['idItem']);
                $infoitem['vlrunitario'] = number_format($infoitem['vlrunitario']);
            }
            echo verVistaAjax($evento, $infoitem);
            break;
        case APROBAR_ITEM:
            $msg = 0;
            if (array_key_exists('idItem', $datos)) {
                if ($compraOBJ->aprobarItem($datos['idItem'], strtoupper($_SESSION['NOMBRES_APELLIDO_USUARIO']))) {
                    $msg = 5;
                }
            }
            if (array_key_exists('idCompra', $datos)) {
                header("location: /sw2click/modulos/compras/administracion?msg=$msg&idCompraOpen=" . $datos['idCompra']);
            } else {
                header("location: /sw2click/modulos/compras/administracion?msg=$msg");
            }
            break;
        case RECHAZAR_ITEM:
            $msg = 0;
            if (array_key_exists('idItem', $datos)) {
                if ($compraOBJ->rechazarItem($datos['idItem'], strtoupper($_SESSION['NOMBRES_APELLIDO_USUARIO']))) {
                    $msg = 6;
                }
            }
            if (array_key_exists('idCompra', $datos)) {
                header("location: /sw2click/modulos/compras/administracion?msg=$msg&idCompraOpen=" . $datos['idCompra']);
            } else {
                header("location: /sw2click/modulos/compras/administracion?msg=$msg");
            }
            break;
        default :
            header("location: /sw2click/modulos/secciones/seccionGeneral");
            break;
    }
}

function getMensaje($msg = 0) {
    $mensaje = "<script>
                    $(document).ready(function(){
                      setTimeout(function(){ $('.mensajes').fadeOut(1000).fadeIn(1000).fadeOut(700).fadeIn(700).fadeOut(1000);}, 10000); 
                    });
                </script>";
    switch ($msg) {
        case 0:
            $mensaje .= '<div class = "mensajes error">
                            <b>[ERROR]</b> --LA OPERACION SOLICITADA <b>NO</b> FUE REALIZADA. <br>
                            POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR DEL SISTEMA.
                            </div>';
            break;
        case 1:
            $mensaje .= '<div class = "mensajes exito">
                           <b>[OK]</b> -- <u>COMPRA</u> SOLICITADA CON EXITO.
                         </div>';
            break;
        case 2:
            $mensaje .= '<div class = "mensajes exito">
                           <b>[OK]</b> -- <u>APROBACION</u> REGISTRADA CON EXITO.
                         </div>';
            break;
        case 3:
            $mensaje .= '<div class = "mensajes exito">
                           <b>[OK]</b> -- <u>COTIZACION</u> REGISTRADA CON EXITO.
                         </div>';
            break;
        case 4:
            $mensaje .= '<div class = "mensajes exito">
                           <b>[OK]</b> -- <u>APROBACION DE PAGO</u> REGISTRADA CON EXITO.
                         </div>';
            break;
        case 5:
            $mensaje .= '<div class = "mensajes exito">
                           <b>[OK]</b> -- <u>APROBACION DE ITEM</u> REGISTRADA CON EXITO.
                         </div>';
            break;
        case 6:
            $mensaje .= '<div class = "mensajes exito">
                           <b>[OK]</b> -- <u>RECHAZO DE ITEM</u> REGISTRADO CON EXITO.
                         </div>';
            break;
    }
    return $mensaje;
}

function getDatos() {
    $datos = array();
    if ($_POST) {
        if (array_key_exists('idCompra', $_POST))
            $datos['idCompra'] = $_POST['idCompra'];
        if (array_key_exists('idItem', $_POST))
            $datos['idItem'] = $_POST['idItem'];
        if (array_key_exists('aprobadopor', $_POST))
            $datos['aprobadopor'] = $_POST['aprobadopor'];
        if (array_key_exists('idProveedor', $_POST))
            $datos['idProveedor'] = $_POST['idProveedor'];
        if (array_key_exists('fechacotizacion', $_POST))
            $datos['fechacotizacion'] = $_POST['fechacotizacion'];
        if (array_key_exists('valor', $_POST))
            $datos['valor'] = $_POST['valor'];
        if (array_key_exists('aprobadopor', $_POST))
            $datos['aprobadopor'] = $_POST['aprobadopor'];
        if (array_key_exists('aprobadopor', $_POST))
            $datos['aprobadopor'] = $_POST['aprobadopor'];
    }
    if ($_GET) {
        if (array_key_exists('msg', $_GET))
            $datos['msg'] = $_GET['msg'];
        if (array_key_exists('idCompraOpen', $_GET))
            $datos['idCompraOpen'] = $_GET['idCompraOpen'];
        if (array_key_exists('idCompra', $_GET))
            $datos['idCompra'] = $_GET['idCompra'];
        if (array_key_exists('idItem', $_GET))
            $datos['idItem'] = $_GET['idItem'];
        if (array_key_exists('aprobadopor', $_GET))
            $datos['aprobadopor'] = $_GET['aprobadopor'];
    }
    return $datos;
}

?>