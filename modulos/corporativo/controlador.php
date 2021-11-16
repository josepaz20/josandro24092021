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

    $corporativoOBJ = new Corporativo();
    $datos = getDatos();

    switch ($evento) {
        case vINDEX:
            $filtro = "WHERE corporativo.estado = 'en_sistema'";
            $corporativoOBJ->getCorporativos($filtro);
            setTablaCorporativos($corporativoOBJ->registros);
            if (array_key_exists('msg', $datos)) {
                $datos['mensaje'] = getMensaje($datos['msg']);
            } else {
                $datos['mensaje'] = $corporativoOBJ->mensaje;
            }
            $datos['ordenar'] = 0;
            verVista($evento, $datos);
            break;
        case vREGISTRAR:
            $corporativoOBJ->getDepartamentos();
            $datos['listaDptos'] = setListaDepartamentos($corporativoOBJ->registros);
            echo verVistaAjax($evento, $datos);
            break;
        case INSERTAR:
            $msg = 0;
            
                if ($corporativoOBJ->registrar($datos)) {
                    $msg = 6;
                }
            
            //header("location: /sw2click/modulos/corporativo/index?msg=$msg");
            break;
        case vDETALLE:
            $infoCorporativo = array();
            if (array_key_exists('idCorporativo', $datos)) {
                $corporativoOBJ->getCorporativo($datos['idCorporativo']);
                $infoCorporativo = $corporativoOBJ->registros[0];
                if ($infoCorporativo['referenciado'] == 1) {
                    $infoCorporativo['referenciado'] = 'Si';
                } else {
                    $infoCorporativo['referenciado'] = 'No';
                }
            }
            echo verVistaAjax($evento, $infoCorporativo);
            break;
        case vACTUALIZAR:
            if (array_key_exists('idCorporativo', $datos)) {
                $corporativoOBJ->getCorporativo($datos['idCorporativo']);
                $datos = $corporativoOBJ->registros[0];
                $corporativoOBJ->getDepartamentos();
                $departamentos = $corporativoOBJ->registros;
                $datos['listaDptos'] = setListaDepartamentos($departamentos, $datos['idDpto']);
                $listaReferenciados = array(
                    array(
                        'id' => 1,
                        'valor' => 'SI'
                    ),
                    array(
                        'id' => 0,
                        'valor' => 'NO'
                    )
                );
                $datos['listaReferenciados'] = setListaReferenciados($listaReferenciados, $datos['referenciado']);
                $corporativoOBJ->getMunicipios($datos['idDpto']);
                $municipios = $corporativoOBJ->registros;
                $datos['listaMunicipios'] = setListaMunicipios($municipios, $datos['idMcpo']);
            }
            echo verVistaAjax($evento, $datos);
            break;
        case vELIMINAR:
            if (array_key_exists('idCorporativo', $datos)) {
                $corporativoOBJ->getCorporativo($datos['idCorporativo']);
                $datos = $corporativoOBJ->registros[0];
                $corporativoOBJ->getDepartamentos();
                $departamentos = $corporativoOBJ->registros;
                $datos['listaDptos'] = setListaDepartamentos($departamentos, $datos['idDpto']);
                $listaReferenciados = array(
                    array(
                        'id' => 1,
                        'valor' => 'SI'
                    ),
                    array(
                        'id' => 0,
                        'valor' => 'NO'
                    )
                );
                $datos['listaReferenciados'] = setListaReferenciados($listaReferenciados, $datos['referenciado']);
                $corporativoOBJ->getMunicipios($datos['idDpto']);
                $municipios = $corporativoOBJ->registros;
                $datos['listaMunicipios'] = setListaMunicipios($municipios, $datos['idMcpo']);
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
            echo "nit: " . $datos['nit'];
            $msg = 0;
            if ($corporativoOBJ->existeNit($datos['nit'])) {
                echo 2;
                if ($corporativoOBJ->actualizar($datos)) {
                    $msg = 7;
                    echo 3;
                }
            }
            header("location: /sw2click/modulos/corporativo/index?msg=$msg");
            break;
        case DELETE:
            $msg = 0;
            if (array_key_exists('idCorporativo', $datos)) {
                if ($corporativoOBJ->setDelete($datos['idCorporativo'], $datos['estado'])) {
                    $msg = 8;
                }
            }
            header("location: /sw2click/modulos/corporativo/index?msg=$msg");
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
                            <b>[ OK ]</b> --  Corporativo Registrado en el Sistema.
                         </div>';
            break;
        case 7:
            $mensaje .= '<div class="mensajes exito">
                            <b>[ OK ]</b> --  Corporativo Actualizado en el Sistema.
                         </div>';
            break;
        case 8:
            $mensaje .= '<div class="mensajes exito">
                            <b>[ OK ]</b> --  Corporativo Eliminado del Sistema.
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
        if (array_key_exists('idCorporativo', $_POST))
            $datos['idCorporativo'] = $_POST['idCorporativo'];
        if (array_key_exists('idPrefijo', $_POST))
            $datos['idPrefijo'] = $_POST['idPrefijo'];
        if (array_key_exists('nit', $_POST))
            $datos['nit'] = $_POST['nit'];
        if (array_key_exists('razonSocial', $_POST))
            $datos['razonSocial'] = strtoupper($_POST['razonSocial']);
        if (array_key_exists('representanteLegal', $_POST))
            $datos['representanteLegal'] = $_POST['representanteLegal'];
        if (array_key_exists('cedulaRepresentante', $_POST))
            $datos['cedulaRepresentante'] = $_POST['cedulaRepresentante'];
        if (array_key_exists('telefono', $_POST))
            $datos['telefono'] = $_POST['telefono'];
        if (array_key_exists('email1', $_POST))
            $datos['email1'] = $_POST['email1'];
        if (array_key_exists('email2', $_POST))
            $datos['email2'] = $_POST['email2'];
        if (array_key_exists('observacion', $_POST))
            $datos['observacion'] = $_POST['observacion'];
        if (array_key_exists('referenciado', $_POST))
            $datos['referenciado'] = $_POST['referenciado'];
        if (array_key_exists('referenciadoPor', $_POST))
            $datos['referenciadoPor'] = $_POST['referenciadoPor'];
        if (array_key_exists('celular1', $_POST))
            $datos['celular1'] = $_POST['celular1'];
        if (array_key_exists('celular2', $_POST))
            $datos['celular2'] = $_POST['celular2'];
        if (array_key_exists('celular3', $_POST))
            $datos['celular3'] = $_POST['celular3'];
        if (array_key_exists('estado', $_POST))
            $datos['estado'] = $_POST['estado'];
        if (array_key_exists('direccion', $_POST))
            $datos['direccion'] = $_POST['direccion'];
    }else if ($_GET) {
        if (array_key_exists('msg', $_GET))
            $datos['msg'] = $_GET['msg'];
        if (array_key_exists('idDpto', $_GET))
            $datos['idDpto'] = $_GET['idDpto'];
        if (array_key_exists('idMcpo', $_GET))
            $datos['idMcpo'] = $_GET['idMcpo'];
        if (array_key_exists('idCorporativo', $_GET))
            $datos['idCorporativo'] = $_GET['idCorporativo'];
        if (array_key_exists('nit', $_GET))
            $datos['nit'] = $_GET['nit'];
        if (array_key_exists('estado', $_GET))
            $datos['estado'] = $_GET['estado'];
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
