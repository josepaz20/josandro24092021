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
        GET_MUNICIPIOS, UPDATE, EXISTE_IDENTIFICACION, EXISTE_NITACTUALIZADO);

    foreach ($peticiones as $peticion) {
        $url_peticion = MODULO . $peticion;
        if (strpos($url, $url_peticion) == true) {
            $evento = $peticion;
        }
    }
    $directorioOBJ = new Directorio();
    $datos = getDatos();

    switch ($evento) {
        case vINDEX:
            //$filtro = "WHERE corporativo.estado = 'en_sistema'";
            $directorioOBJ->getDirectorios();
            setTablaDirectorios($directorioOBJ->registros);
            if (array_key_exists('msg', $datos)) {
                $datos['mensaje'] = getMensaje($datos['msg']);
            } else {
                $datos['mensaje'] = $directorioOBJ->mensaje;
            }
            $datos['ordenar'] = 0;
            verVista($evento, $datos);
            break;
        case vREGISTRAR:
            $directorioOBJ->getDepartamentos();
            $datos['listaDptos'] = setListaDepartamentos($directorioOBJ->registros);
            echo verVistaAjax($evento, $datos);
            break;
        case INSERTAR:
            $msg = 0;
            
            if ($directorioOBJ->registrar($datos)) {
                $msg = 1;
                
            }
            header("location: /sw2click/modulos/directorio/index?msg=$msg");
            break;
        case vDETALLE:
            if (array_key_exists('idDirectorio', $datos)) {
                $directorioOBJ->getDirectorio($datos['idDirectorio']);
                $datos = $directorioOBJ->registros[0];
            }
            echo verVistaAjax($evento, $datos);
            break;
        case vACTUALIZAR:
            if (array_key_exists('idDirectorio', $datos)) {
                $directorioOBJ->getDirectorio($datos['idDirectorio']);
                $datos = $directorioOBJ->registros[0];
                $directorioOBJ->getDepartamentos();
                $departamentos = $directorioOBJ->registros;
                $datos['listaDptos'] = setListaDepartamentos($departamentos, $datos['idDpto']);
                $directorioOBJ->getMunicipios($datos['idDpto']);
                $municipios = $directorioOBJ->registros;
                $datos['listaMunicipios'] = setListaMunicipios($municipios, $datos['idMcpo']);
            }
            echo verVistaAjax($evento, $datos);
            break;
        case vELIMINAR:
            if (array_key_exists('idDirectorio', $datos)) {
                $directorioOBJ->getDirectorio($datos['idDirectorio']);
                $datos = $directorioOBJ->registros[0];
                $directorioOBJ->getDepartamentos();
                $departamentos = $directorioOBJ->registros;
                $datos['listaDptos'] = setListaDepartamentos($departamentos, $datos['idDpto']);
                $directorioOBJ->getMunicipios($datos['idDpto']);
                $municipios = $directorioOBJ->registros;
                $datos['listaMunicipios'] = setListaMunicipios($municipios, $datos['idMcpo']);
            }
            echo verVistaAjax($evento, $datos);
            break;
        case GET_MUNICIPIOS:
            if (array_key_exists('idDpto', $datos)) {
                $directorioOBJ->getMunicipios($datos['idDpto']);
            }
            echo setListaMunicipios($directorioOBJ->registros);
            break;
        case UPDATE:
            echo 1;
            $msg = 0;
            if ($directorioOBJ->actualizar($datos)) {
                $msg = 2;
                echo 3;
            }
            header("location: /sw2click/modulos/directorio/index?msg=$msg");
            break;
        case DELETE:
            echo 1;
            $msg = 0;
            $idDirectorio = $datos['idDirectorio'];
            if ($directorioOBJ->setDelete($idDirectorio)) {
                $msg = 3;
                echo 3;
            }
            header("location: /sw2click/modulos/directorio/index?msg=$msg");
            break;
        case EXISTE_IDENTIFICACION:
            $info = array(
                'error' => 0,
                'existe' => 0,
                'identificacion' => 0
            );
            if (array_key_exists('identificacion', $datos)) {
                if ($directorioOBJ->existeIdentificacion($datos['identificacion'])) {
                    $info['existe'] = 1;
                    $info['identificacion'] = $datos['identificacion'];
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
                            <b>[ OK ]</b> --  Persona registrada en el directorio.
                         </div>';
            break;
        case 2:
            $mensaje .= '<div class="mensajes exito">
                            <b>[ OK ]</b> --  Persona actualizada en el directorio.
                         </div>';
            break;
        case 3:
            $mensaje .= '<div class="mensajes exito">
                            <b>[ OK ]</b> --  Persona eliminada del directorio.
                         </div>';
            break;
    }
    return $mensaje;
}

function getDatos() {
    $datos = array();
    if ($_POST) {
        if (array_key_exists('idMcpo', $_POST))
            $datos['idMcpo'] = $_POST['idMcpo'];
        if (array_key_exists('idDpto', $_POST))
            $datos['idDpto'] = $_POST['idDpto'];
        if (array_key_exists('idDirectorio', $_POST))
            $datos['idDirectorio'] = $_POST['idDirectorio'];
        if (array_key_exists('identificacion', $_POST))
            $datos['identificacion'] = $_POST['identificacion'];
        if (array_key_exists('nombres', $_POST))
            $datos['nombres'] = $_POST['nombres'];
        if (array_key_exists('apellidos', $_POST))
            $datos['apellidos'] = $_POST['apellidos'];
        if (array_key_exists('telefono', $_POST))
            $datos['telefono'] = $_POST['telefono'];
        if (array_key_exists('extension', $_POST))
            $datos['extension'] = $_POST['extension'];
        if (array_key_exists('direccion', $_POST))
            $datos['direccion'] = $_POST['direccion'];
        if (array_key_exists('email1', $_POST))
            $datos['email1'] = $_POST['email1'];
        if (array_key_exists('email2', $_POST))
            $datos['email2'] = $_POST['email2'];
        if (array_key_exists('observaciones', $_POST))
            $datos['observaciones'] = $_POST['observaciones'];
        if (array_key_exists('tipoDirectorio', $_POST))
            $datos['tipoDirectorio'] = $_POST['tipoDirectorio'];
    }else if ($_GET) {
        if (array_key_exists('msg', $_GET))
            $datos['msg'] = $_GET['msg'];
        if (array_key_exists('idDpto', $_GET))
            $datos['idDpto'] = $_GET['idDpto'];
        if (array_key_exists('idMcpo', $_GET))
            $datos['idMcpo'] = $_GET['idMcpo'];
        if (array_key_exists('idDirectorio', $_GET))
            $datos['idDirectorio'] = $_GET['idDirectorio'];
        if (array_key_exists('tipoDirectorio', $_GET))
            $datos['tipoDirectorio'] = $_GET['tipoDirectorio'];
        if (array_key_exists('identificacion', $_GET))
            $datos['identificacion'] = $_GET['identificacion'];
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
