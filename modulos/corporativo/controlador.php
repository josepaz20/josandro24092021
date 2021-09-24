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

    $peticiones = array(vINDEX, vREGISTRAR, vDETALLE, vACTUALIZAR, vAVANCE,
        INSERTAR, INSAVAN, GET_MUNICIPIO, UPDATE, INSERTARRECURSO, vVIABILIDAD, vELIMINARRECURSO, DELETERECURSO, EXISTE_NIT,EXISTE_NITACTUALIZADO);

    foreach ($peticiones as $peticion) {
        $url_peticion = MODULO . $peticion;
        if (strpos($url, $url_peticion) == true) {
            $evento = $peticion;
        }
    }

    $coorporativoOBJ = new Coorporativo();
    $datos = getDatos();

    switch ($evento) {
        case vINDEX:
            $filtro = "WHERE corporativo.estado != 'eliminado'";

            $coorporativoOBJ->getCoorporativos($filtro);

            setTablaCorporativos($coorporativoOBJ->registros);

            if (array_key_exists('msg', $datos)) {
                $datos['mensaje'] = getMensaje($datos['msg']);
            } else {
                $datos['mensaje'] = $coorporativoOBJ->mensaje;
            }
            $datos['ordenar'] = 0;
            verVista($evento, $datos);
            break;
        case vREGISTRAR:
            $coorporativoOBJ->getDepartamentos();
            $datos['listaDptos'] = setListaDepartamentos($coorporativoOBJ->registros);
            echo verVistaAjax($evento, $datos);
            break;
        case INSERTAR:
            $msg = 0;
            if ($coorporativoOBJ->registrar($datos)) {
                $msg = 6;
            }
            header("location: /sw2click/modulos/corporativo/index?msg=$msg");
            break;
        case INSAVAN:
            $datos['idMcpo'] = 1;
            echo 1;
            $msg = 0;
            if ($coorporativoOBJ->registraravance($datos)) {
                $msg = 1;
            }
//            header("location: /sw2click/modulos/ampliacionred/index?msg=$msg");
            break;
        case vDETALLE:
            $infoViabilidad = array();
            if (array_key_exists('idCorporativo', $datos)) {
                $coorporativoOBJ->getCoorporativo($datos['idCorporativo']);
                $infoViabilidad = $coorporativoOBJ->registros[0];
                if ($infoViabilidad['referenciado'] == 1) {
                    $infoViabilidad['referenciado'] = 'Si';
                } else {
                    $infoViabilidad['referenciado'] = 'No';
                }
            }
            echo verVistaAjax($evento, $infoViabilidad);
            break;
        case vACTUALIZAR:


            if (array_key_exists('idCorporativo', $datos)) {

                $coorporativoOBJ->getCoorporativo($datos['idCorporativo']);
                $datos = $coorporativoOBJ->registros[0];
                $coorporativoOBJ->getDepartamentos();
                $departamentos = $coorporativoOBJ->registros;
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
                $coorporativoOBJ->getMunicipios($datos['idDpto']);
                $municipios = $coorporativoOBJ->registros;
                $datos['listaMunicipios'] = setListaMunicipios($municipios, $datos['idMcpo']);

                //$infoViabilidad['costototal'] = number_format($infoViabilidad['costototal']);
            }

            echo verVistaAjax($evento, $datos);
            break;
        case vAVANCE:
            $infoAmpliacion = array();
            if (array_key_exists('idAmpliacion', $datos)) {
                $coorporativoOBJ->getAvances($datos['idAmpliacion']);
                $datos['tablaAvances'] = setListaAvances($coorporativoOBJ->registros);
            }
            echo verVistaAjax($evento, $datos);

            break;

        case GET_MUNICIPIO:
            if (array_key_exists('idDpto', $datos)) {
                $coorporativoOBJ->getMunicipios($datos['idDpto']);
            }
            echo setListaMunicipios($coorporativoOBJ->registros);
            break;

            header("location: /sw2click/modulos/ampliacionred/index");
            break;
        case vVIABILIDAD:
            $infoAmpliacion = array();
            $idViabilidad = $datos['idViabilidad'];
            if (array_key_exists('idViabilidad', $datos)) {
                //d$coorporativoOBJ->getAmpliacionRed($datos['idViabilidad']);
                //$infoAmpliacion = $coorporativoOBJ->registros[0];
                $coorporativoOBJ->getRecursos();
                $departamentos = $coorporativoOBJ->registros;
//                $departamentos['idViabilidad'] = $datos['idViabilidad'];
                $infoAmpliacion['listaRecursos'] = setListaRecursos($departamentos);
                $infoAmpliacion['idViabilidad'] = $datos['idViabilidad'];
                $coorporativoOBJ->getRecursosInventario($idViabilidad);
                $recursos = $coorporativoOBJ->registros;
                $infoAmpliacion['listaRecursosInventario'] = setListaRecursosInventario($recursos);
            }

            echo verVistaAjax($evento, $infoAmpliacion);
            break;

        case vELIMINARRECURSO:
            $infoViabilidad = array();
            if (array_key_exists('idViabilidad', $datos)) {
                //print_r($datos);
                $coorporativoOBJ->getEliminarInventario($datos['idViabilidad'], $datos['idTipoRecurso']);
                $infoViabilidad = $coorporativoOBJ->registros[0];
                //print_r($infoViabilidad);
                //$infoViabilidad['costototal'] = number_format($infoViabilidad['costototal']);
            }
            echo verVistaAjax($evento, $infoViabilidad);
            break;

        case DELETERECURSO:
            $msg = 0;
            // echo 4;
            if (array_key_exists('idViabilidad', $datos) && array_key_exists('idTipoRecurso', $datos)) {
                //print_r($datos['idViabilidad'] . " - " . $datos['idTipoRecurso']);
                // exit();
                if ($coorporativoOBJ->setUpdateRecurso($datos['idViabilidad'], $datos['idTipoRecurso'])) {
                    $msg = 5;
                }
            }
            header("location: /sw2click/modulos/viabilidadampliacion/index?msg=$msg");
            break;

        case UPDATE:
            $msg = 0;
            echo 1;
            if (array_key_exists('idCorporativo', $datos)) {
                echo 2;
                if ($coorporativoOBJ->setUpdate($datos, $datos['idCorporativo'])) {
                    $msg = 7;
                    echo 3;
                }
            }

            header("location: /sw2click/modulos/corporativo/index?msg=$msg");
            break;

        case EXISTE_NIT:
            $info = array('error' => 1, 'existe' => 0, 'nit' => 0);
            if (array_key_exists('nit', $datos)) {
                $info['error'] = 0;
                $info['nit'] = $datos['nit'];
                if (!$coorporativoOBJ->existeNit($datos['nit'])) {
                    $info['existe'] = 1;
                }
            }
            echo json_encode($info);
            break;
            
        case EXISTE_NITACTUALIZADO:
            $info = array('error' => 1, 'existe' => 0, 'nit' => 0);
            if (array_key_exists('nit', $datos)) {
                $info['error'] = 0;
                $info['nit'] = $datos['nit'];
                if (!$coorporativoOBJ->existeNitActualizado($datos['nit'])) {
                    $info['existe'] = 1;
                }
            }
            echo json_encode($info);
            break;
        case INSERTARRECURSO:
            $msg = 0;
            $ids = $datos['ids'];
            //print_r($ids);
            $arrayIds = explode(",", trim($ids, ','));
            $infoArray = array();
            foreach ($arrayIds as $id) {
                //echo 1;
                $cantidad = $_POST['cantidad_' . $id];
                $valor = $_POST['valor_' . $id];
                $infoArray[] = array(
                    'idViabilidad' => $_POST['idViabilidad'],
                    'idTipoRecurso' => $id,
                    'cantidad' => $_POST['cantidad_' . $id],
                    'valor' => $_POST['valor_' . $id],
                );
                //echo 2;
            }

//            print_r($infoArray);
            if (array_key_exists('idViabilidad', $_POST)) {
                //echo 3;
                if ($coorporativoOBJ->setInsertarRecurso($infoArray, $datos['idViabilidad'])) {
                    $msg = 2;
                    //echo 4;
                }
            }



            //echo 'idViabilidad' . $datos['idViabilidad'] . '<BR>';
            //print_r($infoArray);
            header("location: /sw2click/modulos/viabilidadampliacion/index?msg=$msg");
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
    }
    return $mensaje;
}

function getDatos() {
    $datos = array();
    if ($_POST) {
        if (array_key_exists('ids', $_POST))
            $datos['ids'] = $_POST['ids'];
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
        if (array_key_exists('costototal', $_POST))
            $datos['costototal'] = $_POST['costototal'];
        if (array_key_exists('observaciones', $_POST))
            $datos['observaciones'] = $_POST['observaciones'];
        if (array_key_exists('idViabilidad', $_POST))
            $datos['idViabilidad'] = $_POST['idViabilidad'];
        if (array_key_exists('idTipoRecurso', $_POST))
            $datos['idTipoRecurso'] = $_POST['idTipoRecurso'];
        if (array_key_exists('cantidad', $_POST))
            $datos['cantidad'] = $_POST['cantidad'];
        if (array_key_exists('valor', $_POST))
            $datos['valor'] = $_POST['valor'];
        if (array_key_exists('idCorporativo', $_POST))
            $datos['idCorporativo'] = $_POST['idCorporativo'];
        if (array_key_exists('idPrefijo', $_POST))
            $datos['idPrefijo'] = $_POST['idPrefijo'];
        if (array_key_exists('nit', $_POST))
            $datos['nit'] = $_POST['nit'];
        if (array_key_exists('razonSocial', $_POST))
            $datos['razonSocial'] = $_POST['razonSocial'];
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
        if (array_key_exists('retirar', $_POST))
            $datos['retirar'] = $_POST['retirar'];
        if (array_key_exists('clasificacion', $_POST))
            $datos['clasificacion'] = $_POST['clasificacion'];
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
        if (array_key_exists('fix', $_POST))
            $datos['fix'] = $_POST['fix'];
    }else if ($_GET) {
        if (array_key_exists('ids', $_GET))
            $datos['ids'] = $_GET['ids'];
        if (array_key_exists('idAmpliacion', $_GET))
            $datos['idAmpliacion'] = $_GET['idAmpliacion'];
        if (array_key_exists('idViabilidad', $_GET))
            $datos['idViabilidad'] = $_GET['idViabilidad'];
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
        if (array_key_exists('cantidad', $_POST))
            $datos['cantidad'] = $_POST['cantidad'];
        if (array_key_exists('valor', $_POST))
            $datos['valor'] = $_POST['valor'];
        if (array_key_exists('idTipoRecurso', $_GET))
            $datos['idTipoRecurso'] = $_GET['idTipoRecurso'];
        if (array_key_exists('idCorporativo', $_GET))
            $datos['idCorporativo'] = $_GET['idCorporativo'];
        if (array_key_exists('idPrefijo', $_GET))
            $datos['idPrefijo'] = $_GET['idPrefijo'];
        if (array_key_exists('nit', $_GET))
            $datos['nit'] = $_GET['nit'];
        if (array_key_exists('razonSocial', $_GET))
            $datos['razonSocial'] = $_GET['razonSocial'];
        if (array_key_exists('representanteLegal ', $_GET))
            $datos['representanteLegal '] = $_GET['representanteLegal '];
        if (array_key_exists('cedulaRepresentante', $_GET))
            $datos['cedulaRepresentante'] = $_GET['cedulaRepresentante'];
        if (array_key_exists('telefono', $_GET))
            $datos['telefono'] = $_GET['telefono'];
        if (array_key_exists('email1  ', $_GET))
            $datos['email1'] = $_GET['email1'];
        if (array_key_exists('email2  ', $_GET))
            $datos['email2  '] = $_GET['email2  '];
        if (array_key_exists('observacion', $_GET))
            $datos['observacion '] = $_GET['observacion'];
        if (array_key_exists('retirar', $_GET))
            $datos['retirar'] = $_GET['retirar'];
        if (array_key_exists('clasificacion', $_GET))
            $datos['clasificacion'] = $_GET['clasificacion'];
        if (array_key_exists('referenciado', $_GET))
            $datos['referenciado'] = $_GET['referenciado'];
        if (array_key_exists('referenciadoPor', $_GET))
            $datos['referenciadoPor'] = $_GET['referenciadoPor'];
        if (array_key_exists('celular1', $_GET))
            $datos['celular1'] = $_GET['celular1'];
        if (array_key_exists('celular2', $_GET))
            $datos['celular2'] = $_GET['celular2'];
        if (array_key_exists('celular3', $_GET))
            $datos['celular3'] = $_GET['celular3'];
        if (array_key_exists('fix', $_GET))
            $datos['fix'] = $_GET['fix'];
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
