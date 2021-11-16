<?php

// ********************** MODULO AMPLICION DE RED **********************

session_name('SW2CLICK');
session_start();
require_once('../../servicios/sesionOK.php');
require_once('../../servicios/evitarInyeccionSQL.php');
require_once('constantes.php');
require_once('vista.php');
require_once('modelo.php');


controlador();

function controlador() {
    $evento = '';
    $url = $_SERVER['REQUEST_URI'];
    $idUsuario = $_SESSION['ID_USUARIO'];

    $peticiones = array(vADMINISTRACION, vCORPORATIVOS, vCAMBIARCLAVE, vCAMBIARCONTRASENA, vREGISTRAR, vDETALLE, vACTUALIZAR, vELIMINAR, vACTIVAR, INSERTAR, DELETE,
        GET_MUNICIPIOS, UPDATE, UPDATEPASSWORD, EXISTE_NIT, EXISTE_NITACTUALIZADO, CHECKOUT);

    foreach ($peticiones as $peticion) {
        $url_peticion = MODULO . $peticion;
        if (strpos($url, $url_peticion) == true) {
            $evento = $peticion;
        }
    }

    $usuarioOBJ = new Usuario();
    $datos = getDatos();

    switch ($evento) {
        case vADMINISTRACION:
            $usuarioOBJ->getUsuarios();
            setTablaUsuarios($usuarioOBJ->registros);
            $datos['mensaje'] = 'Sección de Envio de Mensajes de Texto';            
            verVista($evento, $datos);
            break;
        case vCORPORATIVOS:
//            echo 1;
            $usuarioOBJ->getUsuariosCorporativos();
            setTablaUsuariosCorporativos($usuarioOBJ->registros);
//            //echo 2;
            if (array_key_exists('msg', $datos)) {
                $datos['mensaje'] = getMensaje($datos['msg']);
            } else {
                $datos['mensaje'] = $usuarioOBJ->mensaje;
            }
            $datos['ordenar'] = 0;
            verVista($evento, $datos);
            break;
        case vCAMBIARCLAVE:
            //echo 1;
            $listamarcadores = array();
            $usuarioOBJ->getUsuarioClave($idUsuario);
            $listamarcadores = $usuarioOBJ->registros[0];
//            //echo 2;            
            $listamarcadores['mensaje'] = 'Los campos marcados con (*) son obligatorios';

            verVista($evento, $listamarcadores);
            break;
        case vCAMBIARCONTRASENA:
            $listamarcadores = array();
            $usuarioOBJ->getUsuarioClave($datos['idUsuarios']);
            $listamarcadores = $usuarioOBJ->registros[0];
            //$listamarcadores['mensaje'] = 'Los campos marcados con (*) son obligatorios';

            echo verVistaAjax($evento, $listamarcadores);
            break;
        case vREGISTRAR:
            echo verVistaAjax($evento);
            break;
        case INSERTAR:
            $msg = 0;
            echo 1;
            if ($usuarioOBJ->registrar($datos)) {
                $msg = 6;
                echo 2;
            }
            header("location: /sw2click/modulos/usuario/index?msg=$msg");
            break;
        case vDETALLE:
            $infoCorporativo = array();
            //echo 1;
            if (array_key_exists('idUsuario', $datos)) {
                $usuarioOBJ->getUsuario($datos['idUsuario']);
                $infoCorporativo = $usuarioOBJ->registros[0];
                $fecha = array();
                $fecha = explode(' ', $infoCorporativo['fechaHoraUltIN']);
                $infoCorporativo['fechaHoraUltIN'] = $fecha[0];
                //$infoCorporativo['login'] = trim($infoCorporativo['login']);
                //echo 2;
            }
            echo verVistaAjax($evento, $infoCorporativo);
            break;
        case vACTUALIZAR:
            if (array_key_exists('idUsuario', $datos)) {
                $usuarioOBJ->getUsuario($datos['idUsuario']);
                $datos = $usuarioOBJ->registros[0];
                $datos['fechaHoraUltIN'] = date("Y-m-d");
            }
            echo verVistaAjax($evento, $datos);
            break;
        case vELIMINAR:
            if (array_key_exists('idUsuario', $datos)) {
                $usuarioOBJ->getUsuario($datos['idUsuario']);
                $datos = $usuarioOBJ->registros[0];
                $fecha = array();
                $fecha = explode(' ', $datos['fechaHoraUltIN']);
                $datos['fechaHoraUltIN'] = $fecha[0];
            }
            echo verVistaAjax($evento, $datos);
            break;
        case GET_MUNICIPIOS:
            if (array_key_exists('idDpto', $datos)) {
                $corporativoOBJ->getMunicipios($datos['idDpto']);
            }
            echo setListaMunicipios($corporativoOBJ->registros);
            break;
        case vACTIVAR:
            if (array_key_exists('idUsuario', $datos)) {
                $usuarioOBJ->getUsuario($datos['idUsuario']);
                $datos = $usuarioOBJ->registros[0];
                $fecha = array();
                $fecha = explode(' ', $datos['fechaHoraUltIN']);
                $datos['fechaHoraUltIN'] = $fecha[0];
            }
            echo verVistaAjax($evento, $datos);
            break;
        case GET_MUNICIPIOS:
            if (array_key_exists('idDpto', $datos)) {
                $corporativoOBJ->getMunicipios($datos['idDpto']);
            }
            echo setListaMunicipios($corporativoOBJ->registros);
            break;
        case UPDATE:
            echo 1;
            $msg = 0;
            echo 2;
            if ($usuarioOBJ->actualizar($datos)) {
                $msg = 7;
                echo 3;
            }
            header("location: /sw2click/modulos/usuario/index?msg=$msg");
            break;
        case UPDATEPASSWORD:
            $msg = 0;
            echo 2;
            if ($usuarioOBJ->actualizarcontrasena($datos)) {
                $msg = 11;
                echo 3;
            }
            header("location: /sw2click/modulos/usuario/index?msg=$msg");
            break;
        case DELETE:
            $msg = 0;
            if (array_key_exists('idUsuario', $datos)) {
                if ($usuarioOBJ->setDelete($datos['idUsuario'])) {
                    $msg = 8;
                }
            }
            header("location: /sw2click/modulos/usuario/index?msg=$msg");
            break;
        case CHECKOUT:
            $msg = 0;
            if (array_key_exists('idUsuario', $datos)) {
                if ($usuarioOBJ->setCheckout($datos['idUsuario'])) {
                    $msg = 10;
                }
            }
            header("location: /sw2click/modulos/usuario/index?msg=$msg");
            break;
        case EXISTE_NIT:
            $info = array(
                'error' => 1,
                'existe' => 0,
                'nit' => 0
            );
            if (array_key_exists('nit', $datos)) {
                $info['error'] = 0;
                $info['nit'] = $datos['nit'];
                if ($corporativoOBJ->existeNit($datos['nit'])) {
                    $info['existe'] = 1;
                }
            }
            echo json_encode($info);
            break;
    }
}
function getMensaje($msg = 0) {
    $mensaje = "<script>
                    $(document).ready(function(){
                      setTimeout(function(){ $('.mensajes').fadeOut(1000).fadeIn(1000).fadeOut(700).fadeIn(700).fadeOut(1000);}, 5000); 
                    });
                </script>";
    switch ($msg) {
        case 0:
            $mensaje .= '<div class="mensajes error">
                            <b>[ ERROR ]</b> -- La operacion solicitada <b>NO</b> fue realizada.<br>
                            Comuniquese con el Administrador del Sistema.
                        </div>';
            break;
        case 1:
            $mensaje .= '<div class="mensajes exito">
                            <b>[ OK ]</b> -- Solicitud de Cambio de Titular REGISTRADA en el Sistema.
                         </div>';
            break;

        case 2:
            $mensaje .= '<div class="mensajes exito">
                            <b>[ OK ]</b> -- Solicitud de Viabilidad actualizada  en el Sistema.
                         </div>';
            break;

        case 3:
            $mensaje .= '<div class="mensajes error">
                            <b>[ ERROR ]</b> -- El nuevo titular NO fue registrado en plataforma de Incidentes.
                         </div>';
            break;
        case 4:
            $mensaje .= '<div class="mensajes error">
                            <b>[ ERROR ]</b> -- NO se encontro el ID del nuevo titular.
                         </div>';
            break;

        case 5:
            $mensaje .= '<div class="mensajes exito">
                            <b>[ OK ]</b> --  Recurso Eliminado en el Sistema.
                         </div>';
            break;
        case 6:
            $mensaje .= '<div class="mensajes exito">
                            <b>[ OK ]</b> --  Usuario Registrado en el Sistema.
                         </div>';
            break;
        case 7:
            $mensaje .= '<div class="mensajes exito">
                            <b>[ OK ]</b> --  Usuario Actualizado en el Sistema.
                         </div>';
            break;
        case 8:
            $mensaje .= '<div class="mensajes exito">
                            <b>[ OK ]</b> --  Usuario Eliminado del Sistema.
                         </div>';
            break;
        case 10:
            $mensaje .= '<div class="mensajes exito">
                            <b>[ OK ]</b> --  Usuario Activado del Sistema.
                         </div>';
            break;
        case 11:
            $mensaje .= '<div class="mensajes exito">
                            <b>[ OK ]</b> -- Contraseña actualizada del usuario.
                         </div>';
            break;
    }
    return $mensaje;
}
function getDatos() {
    $datos = array();
    if ($_POST) {
        if (array_key_exists('idUsuario', $_POST))
            $datos['idUsuario'] = $_POST['idUsuario'];
        if (array_key_exists('login', $_POST))
            $datos['login'] = $_POST['login'];
        if (array_key_exists('password', $_POST))
            $datos['password'] = $_POST['password'];
        if (array_key_exists('fechaHoraUltIN', $_POST))
            $datos['fechaHoraUltIN'] = $_POST['fechaHoraUltIN'];
    }
    else if ($_GET) {
        if (array_key_exists('msg', $_GET))
            $datos['msg'] = $_GET['msg'];
        if (array_key_exists('idUsuario', $_GET))
            $datos['idUsuario'] = $_GET['idUsuario'];
        if (array_key_exists('login', $_GET))
            $datos['login'] = $_GET['login'];
        if (array_key_exists('password', $_GET))
            $datos['password'] = $_GET['password'];
        if (array_key_exists('fechaHoraUltIN', $_GET))
            $datos['fechaHoraUltIN'] = $_GET['fechaHoraUltIN'];
        if (array_key_exists('idUsuarios', $_GET))
            $datos['idUsuarios'] = $_GET['idUsuarios'];
    }
    return $datos;
}

function cargarArchivo($nombreArchivo = '', $cliente = '') {
    global $respaldo;
    $ext = pathinfo($_FILES[$nombreArchivo]['name'], PATHINFO_EXTENSION);
//    $respaldo = strtoupper(md5(rand() . $_FILES[$nombreArchivo]['name'])) . '.' . $ext;
    $respaldo = strtoupper($cliente . '_' . date('YmdHis')) . '.' . $ext;
    $archivo = utf8_decode($_FILES[$nombreArchivo]['tmp_name']);
    if ($_FILES[$nombreArchivo]['type'] == 'application/pdf' || $_FILES[$nombreArchivo]['type'] == 'image/png' || $_FILES[$nombreArchivo]['type'] == 'image/jpg' || $_FILES[$nombreArchivo]['type'] == 'image/jpeg') {
        if ($_FILES[$nombreArchivo]['size'] <= 1048576 * 2) { // 2 MB
//            var_dump($_FILES[$nombreArchivo]);
//            echo "<br>ARCHIVO: $archivo<br>";
//            echo "<br>RUTA: " . DIRECTORIO_LEGALIZAR . $respaldo . "<br>";
//            if (!is_writeable(DIRECTORIO_LEGALIZAR)) {
//               echo "Cannot write to destination file";
//            }
            if (move_uploaded_file($archivo, DIRECTORIO_CAMBIO_TITULAR . $respaldo)) {
                return 1; //'<label style="color: red">ARCHIVO SUBIDO CON EXITO</label>';
            } else {
                return 0; //'<label style="color: red">ERROR AL SUBIR EL ARCHIVO</label>';
            }
        } else {
            return 2; //'<label style="color: red">EL ARCHIVO SUPERA EL TAMAÑO PERMITIDO: 1 Mb</label>';
        }
    } else {
        return 3; //'<label style="color: red">SOLO SE PERMITEN ARCHIVOS: rar, txt, pdf, jpeg y png</label>';
    }
}

?>
