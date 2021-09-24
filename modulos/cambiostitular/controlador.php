<?php

// ********************** MODULO CAMBIOS TITULAR **********************

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

    $peticiones = array(vINDEX, vREGISTRAR, vDETALLE, vELIMINAR, vAPROBAR,
        GET_CLIENTE, SELECCIONAR_CLIENTE, GET_INFO_SERVICIO, VALIDAR, DELETE, INSERTAR,
        VER_FORMATO, EXISTE_IDENTIFICACION, GET_MUNICIPIOS);

    foreach ($peticiones as $peticion) {
        $url_peticion = MODULO . $peticion;
        if (strpos($url, $url_peticion) == true) {
            $evento = $peticion;
        }
    }

    $CambiosTitularOBJ = new CambiosTitular();
    $datos = getDatos();
    $permisoRegistrar = array(1,);

    switch ($evento) {
        case vINDEX:
            $filtro = "WHERE cambio_titular.estado != 'Registrado'";
            $CambiosTitularOBJ->getCambiosTitular($filtro);
            setTablaCambiosTitular($CambiosTitularOBJ->registros);
            if (array_key_exists('msg', $datos)) {
                $datos['mensaje'] = getMensaje($datos['msg']);
            } else {
                $datos['mensaje'] = $CambiosTitularOBJ->mensaje;
            }
            $datos['ordenar'] = 0;
            $datos['btnRegistrar'] = '';
            if (in_array($_SESSION['ID_USUARIO'], $permisoRegistrar)) {
                $datos['btnRegistrar'] = '<button type="button" onclick="verRegistrar()" class="btn btn-success"><i class="fa fa-plus"></i> Registrar Solicitud</button>';
            }
            verVista($evento, $datos);
            break;
        case vREGISTRAR:
            $datos['listaDptos'] = setListaDepartamentos($CambiosTitularOBJ->getDepartamentos());
            echo verVistaAjax($evento, $datos);
            break;
        case vDETALLE:
            if (array_key_exists('idCambioTitular', $datos)) {
                $CambiosTitularOBJ->getCambioTitular($datos['idCambioTitular']);
                $datos = $CambiosTitularOBJ->registros[0];
            }
            echo verVistaAjax($evento, $datos);
            break;
        case vELIMINAR:
            if (array_key_exists('idCambioTitular', $datos)) {
                $CambiosTitularOBJ->getEliminarTitular($datos['idCambioTitular']);
                $datos = $CambiosTitularOBJ->registros[0];
            }
            echo verVistaAjax($evento, $datos);
            break;
        case vAPROBAR:
            if (array_key_exists('idCambioTitular', $datos)) {
                $CambiosTitularOBJ->getAprobarTitular($datos['idCambioTitular']);
                $datos = $CambiosTitularOBJ->registros[0];
            }
            echo verVistaAjax($evento, $datos);
            break;
        case GET_CLIENTE:
            if (array_key_exists('tipoClienteBusq', $datos) && array_key_exists('buscarPor', $datos) && array_key_exists('busqueda', $datos)) {
                $buscarPor = intval($datos['buscarPor']);
                $busqueda = trim($datos['busqueda']);
                switch ($buscarPor) {
                    case 1: // BUSQUEDA POR NOMBRES
                        $filtro = "WHERE residencial.nombres LIKE '%$busqueda%'";
                        break;
                    case 2: // APELLIDOS
                        $filtro = "WHERE residencial.apellidos LIKE '%$busqueda%'";
                        break;
                    case 3: // IDENTIFICACION
                        $filtro = "WHERE residencial.cedula LIKE '%$busqueda%'";
                        break;
                }
                $CambiosTitularOBJ->getClienteRES($filtro);
                $datos['tablaClientes'] = setTablaClientes($CambiosTitularOBJ->registros);
            }
            echo verVistaAjax($evento, $datos);
            break;
        case SELECCIONAR_CLIENTE:
            $infoCliente = array();
            if (array_key_exists('idCliente', $datos)) {
                $idCliente = $datos['idCliente'];
                $filtro = "WHERE residencial.idResidencial = $idCliente LIMIT 1";
                $CambiosTitularOBJ->getClienteRES($filtro);
                $infoCliente = $CambiosTitularOBJ->registros[0];
                $CambiosTitularOBJ->getServiciosRES($idCliente);
                $infoCliente['listaServicios'] = setListaServicios($CambiosTitularOBJ->registros);
            }
            echo verVistaAjax($evento, $infoCliente);
            break;
        case GET_INFO_SERVICIO:
            $info = array(
                'html' => '',
                'idServicio' => 0,
            );
            if (array_key_exists('idServicio', $datos)) {
                $CambiosTitularOBJ->getInfoServicio($datos['idServicio']);
                $infoServicio = $CambiosTitularOBJ->registros[0];
                $info['html'] = verVistaAjax($evento, $infoServicio);
                $info['idServicio'] = $datos['idServicio'];
            }
            echo json_encode($info);
            break;
        case VALIDAR:
            $msg = 0;
            if (array_key_exists('idCambioTitular', $datos) && array_key_exists('idNuevoTitular', $datos) && array_key_exists('estado', $datos)) {
                if ($CambiosTitularOBJ->getNuevoTitularById($datos['idNuevoTitular'])) {
                    $infoNuevoTitular = $CambiosTitularOBJ->registros[0];
                    if ($CambiosTitularOBJ->getAntiguoTitularById($datos['idCambioTitular'])) {
                        $infoAntiguoTitular = $CambiosTitularOBJ->registros[0];
                        $antiguoTitular = $infoAntiguoTitular['idClienteAntiguo'] . ';' . $infoAntiguoTitular['clienteAntiguo'] . ';' . $infoAntiguoTitular['identificacionAntiguo'];
                        if ($CambiosTitularOBJ->setValidar($datos['idCambioTitular'], $datos['estado'], $infoNuevoTitular, $antiguoTitular, $infoAntiguoTitular['idContrato'])) {
                            $msg = 1;
                        }
                    }
                }
            }
            header("location: /sw2click/modulos/cambiostitular/index?msg=$msg");
            break;
        case DELETE:
            $msg = 0;
            // echo 4;
            if (array_key_exists('idCambioTitular', $datos)) {
                echo 5;
                if ($CambiosTitularOBJ->setDelete($datos['idCambioTitular'], $datos['estado'])) {
                    $msg = 1;
                }
            }
            header("location: /sw2click/modulos/cambiostitular/index?msg=$msg");
            break;
        case INSERTAR:
            $msg = 0;
            if (array_key_exists('idServicio', $datos)) {
                if ($CambiosTitularOBJ->getInfoCliente($datos['idServicio'])) {
                    $infoCliente = $CambiosTitularOBJ->registros[0];
                    $cargado = cargarArchivo('formato', $infoCliente['cliente']);
                    if ($cargado == 1) {
                        $datos['formato'] = $respaldo;
                        if ($CambiosTitularOBJ->registrar($datos)) {
                            $msg = 1;
                        }
                    }
                }
            }
            header("location: /sw2click/modulos/cambiostitular/index?msg=$msg");
            break;
        case VER_FORMATO:
            $msgError = "<center>
                            <div style='font-family: sans-serif; padding: 50px'>
                                <span style='color: #F00; font-weight: bold'>SE HA PRESENTADO UN INCONVENIENTE !!!.</span> <br><br><br>
                                EL ARCHIVO ADJUNTO NO HA SIDO ENCONTRADO O NO HA PODIDO SER CARGADO POR SISTEMA.<br>
                                Comuniquese con el Administrador.<br><br>
                                <input type='button' name='cerrar' value='<< Cerrar >>' onClick='javascript:self.close();'>
                            <div>
                         </center>";
            if (array_key_exists('idCambioTitular', $datos)) {
                $idCambioTitular = $datos['idCambioTitular'];
                if ($CambiosTitularOBJ->getFormato($idCambioTitular)) {
                    if ($CambiosTitularOBJ->registros[0]['formato'] != '') {
                        $ruta = DIRECTORIO_CAMBIO_TITULAR . $CambiosTitularOBJ->registros[0]['formato'];
                        if (file_exists($ruta)) {
                            $extension = strtolower(pathinfo($ruta, PATHINFO_EXTENSION));
                            if ($extension == 'jpg' || $extension == 'jpeg' || $extension == 'png') {
                                header('Content-Type: image/jpeg');
                            } elseif ($extension == 'pdf') {
//                            header("location: /swInventario/modulos/recurso/administracion");
                                header('Content-Type: application/pdf');
                            } else {
                                $nombreArchivo = basename($ruta);
                                $tipo = '';
                                if (file_exists($ruta)) {
                                    $size = filesize($ruta);
                                    if (function_exists('mime_content_type')) {
                                        $tipo = mime_content_type($ruta);
                                    } else if (function_exists('finfo_file')) {
                                        $info = finfo_open(FILEINFO_MIME);
                                        $tipo = finfo_file($info, $ruta);
                                        finfo_close($info);
                                    }
                                    if ($tipo == '') {
                                        $tipo = "application/force-download";
                                    }
                                    header('Content-Type: ' . $tipo);
                                    header('Content-Disposition: attachment; filename=' . $nombreArchivo . ';');
                                    header("Content-Transfer-Encoding: binary");
                                    header('Content-Length: ' . $size);
                                    readfile($ruta);
                                } else {
                                    echo $msgError;
                                    return;
                                }
                            }
                            ob_clean();
                            flush();
                            readfile($ruta);
                        } else {
                            echo $msgError;
                            return;
                        }
                    } else {
                        echo $msgError;
                        return;
                    }
                }
            }
            break;
        case EXISTE_IDENTIFICACION:
            $info = array('error' => 1, 'existe' => 1, 'identificacion' => '');
            if (array_key_exists('identificacion', $datos)) {
                $info['error'] = 0;
                $info['identificacion'] = $datos['identificacion'];
                if (!$CambiosTitularOBJ->existeIdentificacion($datos['identificacion']) && !$CambiosTitularOBJ->existeIdentificacionNuevoTitular($datos['identificacion'])) {
                    $info['existe'] = 0;
                }
            }
            echo json_encode($info);
            break;
        case GET_MUNICIPIOS:
            $info = array('error' => 1, 'listaMunicipios' => '');
            if (array_key_exists('idDpto', $datos)) {
                $info['listaMunicipios'] = setListaMunicipios($CambiosTitularOBJ->getMunicipios($datos['idDpto']));
                $info['error'] = 0;
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
            $mensaje .= '<div class="mensajes error">
                            <b>[ ERROR ]</b> -- El contrato NO pudo ser vinculado al nuevo titular.
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
    }
    return $mensaje;
}

function getDatos() {
    $datos = array();
    if ($_POST) {
        if (array_key_exists('idCambioTitular', $_POST))
            $datos['idCambioTitular'] = $_POST['idCambioTitular'];
        if (array_key_exists('idNuevoTitular', $_POST))
            $datos['idNuevoTitular'] = $_POST['idNuevoTitular'];
        if (array_key_exists('estado', $_POST))
            $datos['estado'] = $_POST['estado'];
        if (array_key_exists('tipopersona', $_POST))
            $datos['tipopersona'] = $_POST['tipopersona'];
        if (array_key_exists('identificacion', $_POST))
            $datos['identificacion'] = $_POST['identificacion'];
        if (array_key_exists('nombres', $_POST))
            $datos['nombres'] = $_POST['nombres'];
        if (array_key_exists('apellidos', $_POST))
            $datos['apellidos'] = $_POST['apellidos'];
        if (array_key_exists('direccion', $_POST))
            $datos['direccion'] = $_POST['direccion'];
        if (array_key_exists('barrio', $_POST))
            $datos['barrio'] = $_POST['barrio'];
        if (array_key_exists('celular', $_POST))
            $datos['celular'] = $_POST['celular'];
        if (array_key_exists('email', $_POST))
            $datos['email'] = $_POST['email'];
        if (array_key_exists('idServicio', $_POST))
            $datos['idServicio'] = $_POST['idServicio'];
        if (array_key_exists('idDpto', $_POST))
            $datos['idDpto'] = $_POST['idDpto'];
        if (array_key_exists('idMcpo', $_POST))
            $datos['idMcpo'] = $_POST['idMcpo'];
        if (array_key_exists('estrato', $_POST))
            $datos['estrato'] = $_POST['estrato'];
    } else if ($_GET) {
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
        if (array_key_exists('identificacion', $_GET))
            $datos['identificacion'] = $_GET['identificacion'];
        if (array_key_exists('idCambioTitular', $_GET))
            $datos['idCambioTitular'] = $_GET['idCambioTitular'];
        if (array_key_exists('identificacionNuevo', $_GET))
            $datos['identificacionNuevo'] = $_GET['identificacionNuevo'];
        if (array_key_exists('idDpto', $_GET))
            $datos['idDpto'] = $_GET['idDpto'];
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
