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

    $peticiones = array(vINDEX, vREGISTRAR, vDETALLE, vACTUALIZAR, vELIMINAR, INSERTAR, DELETE,
        GET_MUNICIPIOS, UPDATE, EXISTE_NIT, EXISTE_NITACTUALIZADO);

    foreach ($peticiones as $peticion) {
        $url_peticion = MODULO . $peticion;
        if (strpos($url, $url_peticion) == true) {
            $evento = $peticion;
        }
    }

    $cargoempleadoOBJ = new CargoEmpleado();
    $datos = getDatos();

    switch ($evento) {
        case vINDEX:
            
            //$filtro = "WHERE corporativo.estado = 'en_sistema'";
            $cargoempleadoOBJ->getCargos();
            setTablaCargos($cargoempleadoOBJ->registros);
            if (array_key_exists('msg', $datos)) {
                
                $datos['mensaje'] = getMensaje($datos['msg']);
            } else {
                $datos['mensaje'] = $cargoempleadoOBJ->mensaje;
            }
            //print_r($datos);
            verVista($evento, $datos);
            break;
        case vREGISTRAR:
            echo verVistaAjax($evento);
            break;
        case INSERTAR:
            $msg = 0;
            if ($cargoempleadoOBJ->registrar($datos)) {
                $msg = 6;
            }
            header("location: /sw2click/modulos/cargoempleado/index?msg=$msg");
            break;
        case vDETALLE:
            $infoCorporativo = array();
            if (array_key_exists('idCargo', $datos)) {
                $cargoempleadoOBJ->getCargo($datos['idCargo']);
                $infoCorporativo = $cargoempleadoOBJ->registros[0];
            }
            echo verVistaAjax($evento, $infoCorporativo);
            break;
        case vACTUALIZAR:
            if (array_key_exists('idCargo', $datos)) {
                $cargoempleadoOBJ->getCargo($datos['idCargo']);
                $datos = $cargoempleadoOBJ->registros[0];
                
            }
            echo verVistaAjax($evento, $datos);
            break;
        case vELIMINAR:
            if (array_key_exists('idCargo', $datos)) {
                $cargoempleadoOBJ->getCargo($datos['idCargo']);
                $datos = $cargoempleadoOBJ->registros[0];
                
            }
            echo verVistaAjax($evento, $datos);
            break;
        case GET_MUNICIPIOS:
            if (array_key_exists('idDpto', $datos)) {
                $cargoempleadoOBJ->getMunicipios($datos['idDpto']);
            }
            echo setListaMunicipios($cargoempleadoOBJ->registros);
            break;
        case UPDATE:
            $msg = 0;
            if ($cargoempleadoOBJ->actualizar($datos)) {
                $msg = 7;
            }
            header("location: /sw2click/modulos/cargoempleado/index?msg=$msg");
            break;
        case DELETE:
            $msg = 0;
            if ($cargoempleadoOBJ->setDelete($datos)) {
                $msg = 8;
            }
            header("location: /sw2click/modulos/cargoempleado/index?msg=$msg");
            break;
            
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
                if ($cargoempleadoOBJ->existeNit($datos['nit'])) {
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
                            <b>[ OK ]</b> --  Cargo Registrado en el Sistema.
                         </div>';
            break;
        case 7:
            $mensaje .= '<div class="mensajes exito">
                            <b>[ OK ]</b> --  Cargo Actualizado en el Sistema.
                         </div>';
            break;
        case 8:
            $mensaje .= '<div class="mensajes exito">
                            <b>[ OK ]</b> --  Cargo Eliminado del Sistema.
                         </div>';
            break;
    }
    return $mensaje;
}

function getDatos() {
    $datos = array();
    if ($_POST) {
        if (array_key_exists('idCargo', $_POST))
            $datos['idCargo'] = $_POST['idCargo'];
        if (array_key_exists('cargo', $_POST))
            $datos['cargo'] = $_POST['cargo'];
        if (array_key_exists('estado', $_POST))
            $datos['estado'] = $_POST['estado'];
        if (array_key_exists('registradopor', $_POST))
            $datos['registradopor'] = $_POST['registradopor'];
        if (array_key_exists('modificadopor', $_POST))
            $datos['modificadopor'] = $_POST['modificadopor'];
        if (array_key_exists('fechahorareg', $_POST))
            $datos['fechahorareg'] = $_POST['fechahorareg'];
        if (array_key_exists('fechahoramod', $_POST))
            $datos['fechahoramod'] = $_POST['fechahoramod'];
    }else if ($_GET) {
        if (array_key_exists('msg', $_GET))
            $datos['msg'] = $_GET['msg'];      
        if (array_key_exists('idCargo', $_GET))
            $datos['idCargo'] = $_GET['idCargo'];
        if (array_key_exists('cargo', $_GET))
            $datos['cargo'] = $_GET['cargo'];
        if (array_key_exists('estado', $_GET))
            $datos['estado'] = $_GET['estado'];
        if (array_key_exists('registradopor', $_GET))
            $datos['registradopor'] = $_GET['registradopor'];
        if (array_key_exists('modificadopor', $_GET))
            $datos['modificadopor'] = $_GET['modificadopor'];
        if (array_key_exists('fechahorareg', $_GET))
            $datos['fechahorareg'] = $_GET['fechahorareg'];
        if (array_key_exists('fechahoramod', $_GET))
            $datos['fechahoramod'] = $_GET['fechahoramod'];
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
