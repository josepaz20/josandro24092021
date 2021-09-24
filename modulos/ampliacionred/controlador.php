<?php

// ********************** MODULO AMPLICION DE RED **********************

session_name('SW2CLICK');
session_start();
require_once('../../servicios/sesionOK.php');
require_once('../../servicios/evitarInyeccionSQL.php');
require_once('constantes.php');
require_once('vista.php');
require_once('modelo.php');

//if ($_SESSION['PRIVILEGIO_USUARIO'] != 1 && $_SESSION['PRIVILEGIO_USUARIO'] != 3 && $_SESSION['ID_USUARIO'] != 152 && $_SESSION['ID_USUARIO'] != 166 && $_SESSION['ID_USUARIO'] != 270 && $_SESSION['ID_USUARIO'] != 553) {
//    header('location:/swInventario/modulos/secciones/seccionGeneral');
//}

controlador();

function controlador() {
    global $respaldo;
    $evento = '';
    $url = $_SERVER['REQUEST_URI'];

    $peticiones = array(vINDEX, vREGISTRAR, vDETALLE, vACTUALIZAR, vAVANCE, INSERTAR, INSAVAN, GET_MUNICIPIO, UPDATE, vVIABILIDAD);

    foreach ($peticiones as $peticion) {
        $url_peticion = MODULO . $peticion;
        if (strpos($url, $url_peticion) == true) {
            $evento = $peticion;
        }
    }

    $ampliacionRedOBJ = new AmpliacionRed();
    $datos = getDatos();

    switch ($evento) {
        case vINDEX:
            $filtro = "WHERE ampliacion_red.estado != 'Eliminado'";
            $ampliacionRedOBJ->getAmpliacionesRed();
            setTablaAmpliaciones($ampliacionRedOBJ->registros);

            if (array_key_exists('msg', $datos)) {
                $datos['mensaje'] = getMensaje($datos['msg']);
            } else {
                $datos['mensaje'] = $ampliacionRedOBJ->mensaje;
            }
            $datos['ordenar'] = 0;
            verVista($evento, $datos);
            break;
        case vREGISTRAR:
            $ampliacionRedOBJ->getDepartamentos();
            $datos['listaDepartamentos'] = setListaDepartamentos($ampliacionRedOBJ->registros);
            echo verVistaAjax($evento, $datos);
            break;
        case INSERTAR:

            $msg = 0;
            if ($ampliacionRedOBJ->registrar($datos)) {
                $msg = 1;
            }
            header("location: /sw2click/modulos/ampliacionred/index?msg=$msg");
            break;
        case INSAVAN:
            $datos['idMcpo'] = 1;
            echo 1;
            $msg = 0;
            if ($ampliacionRedOBJ->registraravance($datos)) {
                $msg = 3;
            }
            header("location: /sw2click/modulos/ampliacionred/index?msg=$msg");
            break;
        case vDETALLE:
            $infoAmpliacion = array();
            if (array_key_exists('idAmpliacion', $datos)) {
                $ampliacionRedOBJ->getAmpliacionRed($datos['idAmpliacion']);
                $infoAmpliacion = $ampliacionRedOBJ->registros[0];
                $infoAmpliacion['beneficioeconomico'] = number_format($infoAmpliacion['beneficioeconomico']);
            }
            echo verVistaAjax($evento, $infoAmpliacion);
            break;
        case vACTUALIZAR:
            if (array_key_exists('idAmpliacion', $datos)) {
                $ampliacionRedOBJ->getAmpliacionRed($datos['idAmpliacion']);
                $datos = $ampliacionRedOBJ->registros[0];
                // $datos['beneficioeconomico'] = number_format($datos['beneficioeconomico']);
                $ampliacionRedOBJ->getDepartamentos();
                $departamentos = $ampliacionRedOBJ->registros;
                $datos['listaDepartamentos'] = setListaDepartamentos($departamentos, $datos['idDpto']);

                $ampliacionRedOBJ->getMunicipios($datos['idDpto']);
                $municipios = $ampliacionRedOBJ->registros;
                $datos['listaMunicipios'] = setListaMunicipios($municipios, $datos['idMcpo']);
            }
            echo verVistaAjax($evento, $datos);
            break;
        case vAVANCE:
            $infoAmpliacion = array();
            if (array_key_exists('idAmpliacion', $datos)) {
                $ampliacionRedOBJ->getAvances($datos['idAmpliacion']);
                $datos['tablaAvances'] = setListaAvances($ampliacionRedOBJ->registros);
            }

            echo verVistaAjax($evento, $datos);

            break;
        case GET_MUNICIPIO:
            if (array_key_exists('idDpto', $datos)) {
                $ampliacionRedOBJ->getMunicipios($datos['idDpto']);
            }
            echo setListaMunicipios($ampliacionRedOBJ->registros);
            break;

            header("location: /sw2click/modulos/ampliacionred/index");
            break;
        case vVIABILIDAD:
            $infoAmpliacion = array();
            if (array_key_exists('idAmpliacion', $datos)) {
                $ampliacionRedOBJ->getAmpliacionRed($datos['idAmpliacion']);
                $infoAmpliacion = $ampliacionRedOBJ->registros[0];
            }
            echo verVistaAjax($evento, $infoAmpliacion);
            break;
        case UPDATE:
            $msg = 0;
            // echo 4;

            if ($ampliacionRedOBJ->setUpdate($datos, $datos['idAmpliacion'])) {
                $msg = 2;
            }

            header("location: /sw2click/modulos/ampliacionred/index?msg=$msg");
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
                            <b>[ OK ]</b> -- Ampliación de red registrada en el Sistema.
                         </div>';
            break;
        case 2:
            $mensaje .= '<div class="mensajes exito">
                            <b>[ OK ]</b> -- Ampliación de red actualizada en el Sistema.
                         </div>';
            break;
        case 3:
            $mensaje .= '<div class="mensajes exito">
                            <b>[ OK ]</b> -- Avance de red actualizada en el Sistema.
                         </div>';
            break;
        case 4:
            $mensaje .= '<div class="mensajes error">
                            <b>[ ERROR ]</b> -- NO se encontro el ID del nuevo titular.
                         </div>';
            break;
    }
    return $mensaje;
}

function getDatos() {
    $datos = array();
    if ($_POST) {
        if (array_key_exists('idAmpliacion', $_POST))
            $datos['idAmpliacion'] = $_POST['idAmpliacion'];
        if (array_key_exists('idMcpo', $_POST))
            $datos['idMcpo'] = $_POST['idMcpo'];
        if (array_key_exists('idDpto', $_POST))
            $datos['idDpto'] = $_POST['idDpto'];
        if (array_key_exists('direccion', $_POST))
            $datos['direccion'] = $_POST['direccion'];
        if (array_key_exists('coordenadas', $_POST))
            $datos['coordenadas'] = $_POST['coordenadas'];
        if (array_key_exists('justificacion', $_POST))
            $datos['justificacion'] = $_POST['justificacion'];
        if (array_key_exists('contusuariosbenficio', $_POST))
            $datos['contusuariosbenficio'] = $_POST['contusuariosbenficio'];
        if (array_key_exists('beneficioeconomico', $_POST))
            $datos['beneficioeconomico'] = $_POST['beneficioeconomico'];
        if (array_key_exists('estado', $_POST))
            $datos['estado'] = $_POST['estado'];
        if (array_key_exists('registradopor', $_POST))
            $datos['registradopor'] = $_POST['registradopor'];
        if (array_key_exists('modificadopor', $_POST))
            $datos['modificadopor'] = $_POST['modificadopor'];
        if (array_key_exists('confirmadopor', $_POST))
            $datos['confirmadopor'] = $_POST['confirmadopor'];
        if (array_key_exists('fechahorareg', $_POST))
            $datos['fechahorareg'] = $_POST['fechahorareg'];
        if (array_key_exists('fechahoramod', $_POST))
            $datos['fechahoramod'] = $_POST['fechahoramod'];
        if (array_key_exists('fechahoraconfirm', $_POST))
            $datos['fechahoraconfirm'] = $_POST['fechahoraconfirm'];
        if (array_key_exists('avance', $_POST))
            $datos['avance'] = $_POST['avance'];
    }else if ($_GET) {
        if (array_key_exists('idAmpliacion', $_GET))
            $datos['idAmpliacion'] = $_GET['idAmpliacion'];
        if (array_key_exists('msg', $_GET))
            $datos['msg'] = $_GET['msg'];
        if (array_key_exists('tipoClienteBusq', $_GET))
            $datos['tipoClienteBusq'] = $_GET['tipoClienteBusq'];
        if (array_key_exists('buscarPor', $_GET))
            $datos['buscarPor'] = $_GET['buscarPor'];
        if (array_key_exists('busqueda', $_GET))
            $datos['busqueda'] = $_GET['busqueda'];
        if (array_key_exists('idCliente', $_GET))
            $datos['idCliente'] = $_GET['idCliente'];
        if (array_key_exists('idServicio', $_GET))
            $datos['idServicio'] = $_GET['idServicio'];
        if (array_key_exists('justificacion', $_GET))
            $datos['justificacion'] = $_GET['justificacion'];
        if (array_key_exists('fechahorareg', $_GET))
            $datos['fechahorareg'] = $_GET['fechahorareg'];
        if (array_key_exists('justificacionNuevo', $_GET))
            $datos['justificacionNuevo'] = $_GET['justificacionNuevo'];
        if (array_key_exists('idDpto', $_GET))
            $datos['idDpto'] = $_GET['idDpto'];
        if (array_key_exists('idMcpo', $_GET))
            $datos['idMcpo'] = $_GET['idMcpo'];
        if (array_key_exists('direccion', $_GET))
            $datos['direccion'] = $_GET['direccion'];

        if (array_key_exists('coordenadas', $_GET))
            $datos['coordenadas'] = $_GET['coordenadas'];
        if (array_key_exists('justificacion', $_GET))
            $datos['justificacion'] = $_GET['justificacion'];
        if (array_key_exists('contusuariosbenficio', $_GET))
            $datos['contusuariosbenficio'] = $_GET['contusuariosbenficio'];
        if (array_key_exists('beneficioeconomico', $_GET))
            $datos['beneficioeconomico'] = $_GET['beneficioeconomico'];
        if (array_key_exists('estado', $_GET))
            $datos['estado'] = $_GET['estado'];
        if (array_key_exists('registradopor', $_GET))
            $datos['registradopor'] = $_GET['registradopor'];
        if (array_key_exists('modificadopor', $_GET))
            $datos['modificadopor'] = $_GET['modificadopor'];
        if (array_key_exists('confirmadopor', $_POST))
            $datos['confirmadopor'] = $_GET['confirmadopor'];
        if (array_key_exists('fechahorareg', $_GET))
            $datos['fechahorareg'] = $_GET['fechahorareg'];
        if (array_key_exists('fechahoramod', $_GET))
            $datos['fechahoramod'] = $_GET['fechahoramod'];
        if (array_key_exists('fechahoraconfirm', $_GET))
            $datos['fechahoraconfirm'] = $_GET['fechahoraconfirm'];
        if (array_key_exists('avance', $_GET))
            $datos['avance'] = $_GET['avance'];
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
