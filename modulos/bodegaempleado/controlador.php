<?php

// ********************** MODULO RECURSO **********************

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
    $evento = '';
    $url = $_SERVER['REQUEST_URI'];

    $peticiones = array(vADMINISTRACION, vGESTION, vDETALLE_RECURSO, vDEVOLUCION_RECURSO,
        DEVOLVER_RECURSO, vMARCACION_RECURSO_USADO, MARCAR_RECURSO_USADO, vGESTION_MATERIALES,
        vDETALLE_MATERIAL, vASIGNACION_MATERIAL, ASIGNAR_MATERIAL, vSALIDA_MATERIAL,
        SACAR_MATERIAL, vREGISTRO_MATERIAL, REGISTRAR_MATERIAL, vREGISTRO_BODEGA,
        REGISTRAR_BODEGAS, vMI_BODEGA);

    foreach ($peticiones as $peticion) {
        $url_peticion = MODULO . $peticion;
        if (strpos($url, $url_peticion) == true) {
            $evento = $peticion;
        }
    }

    $bodegaTecnicosOBJ = new BodegaEmpleado();
    $adminsAlmacen = array(1, 761, 827);
    $datos = getDatos();
    
    $datos['opcGestionMateriales'] = '';
    $opcGestionMateriales = array(1, 761, 827);

    switch ($evento) {
        case vADMINISTRACION:
            $bodegaTecnicosOBJ->getBodegas();
            setTablaBodegasEmpleados($bodegaTecnicosOBJ->registros);

            if (array_key_exists('msg', $datos)) {
                $datos['mensaje'] = getMensaje($datos['msg']);
            } else {
                $datos['mensaje'] = $bodegaTecnicosOBJ->mensaje;
            }
            $datos['ordenar'] = 0;
            verVista($evento, $datos);
            break;
        case vMI_BODEGA:
            if (array_key_exists('idEmpleado', $datos)) {
                $filtro = 'WHERE bodega_empleado.idEmpleado = ' . $datos['idEmpleado'];
                $bodegaTecnicosOBJ->getBodegas($filtro);
                setTablaBodegasEmpleados($bodegaTecnicosOBJ->registros);
                if (array_key_exists('msg', $datos)) {
                    $datos['mensaje'] = getMensaje($datos['msg']);
                } else {
                    $datos['mensaje'] = $bodegaTecnicosOBJ->mensaje;
                }
                $datos['ordenar'] = 0;
                verVista($evento, $datos);
            } else {
                header("location: /swInventario/modulos/secciones/seccionGeneral");
            }
            break;
        case vGESTION:
            if (array_key_exists('idBodegaEmpleado', $datos)) {
                $bodegaTecnicosOBJ->getRecursosByIdBodega($datos['idBodegaEmpleado']);
                $recursos = $bodegaTecnicosOBJ->registros;
                $admin = false;
                if (in_array($_SESSION['ID_USUARIO'], $adminsAlmacen)) {
                    $admin = true;
                }
                $recursosinfoOT = array();
                foreach ($recursos as $recurso) {
                    $recurso['estadoOT'] = 'N/A';
                    if ($recurso['idOT'] != NULL) {
                        if ($bodegaTecnicosOBJ->getInfoOT($recurso['idOT'])) {
                            $infoOT = $bodegaTecnicosOBJ->registros[0];
                            $recurso['estadoOT'] = $infoOT['estado'];
                        }
                    }
                    $recursosinfoOT[] = $recurso;
                }
                setTablaRecursosBodega($recursosinfoOT, $admin);
                if (array_key_exists('msg', $datos)) {
                    $datos['mensaje'] = getMensaje($datos['msg']);
                } else {
                    $datos['mensaje'] = $bodegaTecnicosOBJ->mensaje;
                }
                $datos['ordenar'] = 0;
                verVista($evento, $datos);
            } else {
                header("location: /swInventario/modulos/bodegaempleado/administracion?msg=0");
            }
            break;
        case vDETALLE_RECURSO:
            $infoitem = array();
            if (array_key_exists('idRecurso', $datos)) {
                if ($bodegaTecnicosOBJ->getRecursoByIdRecurso($datos['idRecurso'])) {
                    $infoitem = $bodegaTecnicosOBJ->registros[0];
                } else {
                    $evento = 'nofound';
                }
            } else {
                $evento = 'error';
            }
            echo verVistaAjax($evento, $infoitem);
            break;
        case vDEVOLUCION_RECURSO:
            $infoitem = array();
            if (array_key_exists('idRecurso', $datos)) {
                if ($bodegaTecnicosOBJ->getRecursoByIdRecurso($datos['idRecurso'])) {
                    $infoitem = $bodegaTecnicosOBJ->registros[0];
                } else {
                    $evento = 'nofound';
                }
            } else {
                $evento = 'error';
            }
            echo verVistaAjax($evento, $infoitem);
            break;
        case DEVOLVER_RECURSO:
            $msg = 0;
            $idBodegaEmpleado = 0;
            if (array_key_exists('idRecurso', $datos) && array_key_exists('idBodegaEmpleado', $datos)) {
                $idBodegaEmpleado = $datos['idBodegaEmpleado'];
                if ($bodegaTecnicosOBJ->registrarDevolucion($idBodegaEmpleado, $datos['idRecurso'])) {
                    $msg = 1;
                }
            }
            if ($idBodegaEmpleado != 0) {
                header("location: /swInventario/modulos/bodegaempleado/gestion?idBodegaEmpleado=$idBodegaEmpleado&msg=$msg");
            } else {
                header("location: /swInventario/modulos/bodegaempleado/administracion?msg=$msg");
            }
            break;
        case vMARCACION_RECURSO_USADO:
            $infoitem = array();
            if (array_key_exists('idRecurso', $datos)) {
                if ($bodegaTecnicosOBJ->getRecursoByIdRecurso($datos['idRecurso'])) {
                    $infoitem = $bodegaTecnicosOBJ->registros[0];
                } else {
                    $evento = 'nofound';
                }
            } else {
                $evento = 'error';
            }
            echo verVistaAjax($evento, $infoitem);
            break;
        case MARCAR_RECURSO_USADO:
            $msg = 0;
            $idBodegaEmpleado = 0;
            if (array_key_exists('idRecurso', $datos) && array_key_exists('idBodegaEmpleado', $datos)) {
                $idBodegaEmpleado = $datos['idBodegaEmpleado'];
                if ($bodegaTecnicosOBJ->marcarRecursoUsado($datos['idRecurso'])) {
                    $msg = 2;
                }
            }
            if ($idBodegaEmpleado != 0) {
                header("location: /swInventario/modulos/bodegaempleado/gestion?idBodegaEmpleado=$idBodegaEmpleado&msg=$msg");
            } else {
                header("location: /swInventario/modulos/bodegaempleado/administracion?msg=$msg");
            }
            break;
        case vGESTION_MATERIALES:
            if (array_key_exists('idBodegaEmpleado', $datos)) {
                $datos['empleadoBodega'] = 'EMPLEADO NO ENCONTRADO';
                if ($bodegaTecnicosOBJ->getInfoBodegaEmpleado($datos['idBodegaEmpleado'])) {
                    $datos['empleadoBodega'] = strtoupper($bodegaTecnicosOBJ->registros[0]['empleado']);
                }
                $bodegaTecnicosOBJ->getMaterialesByIdBodega($datos['idBodegaEmpleado']);
                $admin = false;
                if (in_array($_SESSION['ID_USUARIO'], $adminsAlmacen)) {
                    $admin = true;
                }
                setTablaMaterialesBodega($bodegaTecnicosOBJ->registros, $admin);
                if (array_key_exists('msg', $datos)) {
                    $datos['mensaje'] = getMensaje($datos['msg']);
                } else {
                    $datos['mensaje'] = $bodegaTecnicosOBJ->mensaje;
                }
                $datos['ordenar'] = 0;
                if (in_array($_SESSION['ID_USUARIO'], $opcGestionMateriales)) {
                    $datos['opcGestionMateriales'] = '<div class="bandaOpciones">'; 
                    $datos['opcGestionMateriales'] .= '<button type="button" onclick="verRegistrarMaterialBodega(' . $datos['idBodegaEmpleado'] . ')" class="btn btn-primary"><i class="fa fa-plus"></i> Registrar Material</button>'; 
                    $datos['opcGestionMateriales'] .= '</div>'; 
                }
                verVista($evento, $datos);
            } else {
                header("location: /swInventario/modulos/bodegaempleado/administracion?msg=0");
            }
            break;
        case vDETALLE_MATERIAL:
            $infoitem = array();
            if (array_key_exists('idMaterial', $datos) && array_key_exists('idBodegaEmpleado', $datos)) {
                if ($bodegaTecnicosOBJ->getMaterialByIdMaterial($datos['idMaterial'], $datos['idBodegaEmpleado'])) {
                    $infoitem = $bodegaTecnicosOBJ->registros[0];
                    if ($infoitem['cantIngreso'] == NULL) {
                        $infoitem['cantIngreso'] = 0;
                    }
                    if ($infoitem['cantGasto'] == NULL) {
                        $infoitem['cantGasto'] = 0;
                    }
                    $infoitem['cantDisponible'] = intval($infoitem['cantIngreso']) - intval($infoitem['cantGasto']);
                } else {
                    $evento = 'nofound';
                }
            } else {
                $evento = 'error';
            }
            echo verVistaAjax($evento, $infoitem);
            break;
        case vASIGNACION_MATERIAL:
            $infoitem = array();
            if (array_key_exists('idMaterial', $datos) && array_key_exists('idBodegaEmpleado', $datos)) {
                if ($bodegaTecnicosOBJ->getMaterialByIdMaterial($datos['idMaterial'], $datos['idBodegaEmpleado'])) {
                    $infoitem = $bodegaTecnicosOBJ->registros[0];
                    if ($infoitem['cantIngreso'] == NULL) {
                        $infoitem['cantIngreso'] = 0;
                    }
                    if ($infoitem['cantGasto'] == NULL) {
                        $infoitem['cantGasto'] = 0;
                    }
                    $infoitem['cantDisponible'] = intval($infoitem['cantIngreso']) - intval($infoitem['cantGasto']);
                    if (in_array($_SESSION['ID_USUARIO'], $adminsAlmacen)) {
                        $infoitem['opcionesActualizarAlmacen'] = setListaActulizarAlmacen(true);
                    } else {
                        $infoitem['opcionesActualizarAlmacen'] = setListaActulizarAlmacen(false);
                    }
                } else {
                    $evento = 'nofound';
                }
            } else {
                $evento = 'error';
            }
            echo verVistaAjax($evento, $infoitem);
            break;
        case ASIGNAR_MATERIAL:
            $msg = 0;
            $idBodegaEmpleado = 0;
            if (array_key_exists('idMaterial', $datos) && array_key_exists('idBodegaEmpleado', $datos) && array_key_exists('cantAsignar', $datos) && array_key_exists('actualizarAlmacen', $datos)) {
                $idBodegaEmpleado = $datos['idBodegaEmpleado'];
                if ($bodegaTecnicosOBJ->asignarMaterial($datos['actualizarAlmacen'], $datos['idMaterial'], $idBodegaEmpleado, $datos['cantAsignar'])) {
                    $msg = 3;
                }
            }
            if ($idBodegaEmpleado != 0) {
                header("location: /swInventario/modulos/bodegaempleado/gestionMateriales?idBodegaEmpleado=$idBodegaEmpleado&msg=$msg");
            } else {
                header("location: /swInventario/modulos/bodegaempleado/gestionMateriales?msg=$msg");
            }
            break;
        case vSALIDA_MATERIAL:
            $infoitem = array();
            if (array_key_exists('idMaterial', $datos) && array_key_exists('idBodegaEmpleado', $datos)) {
                if ($bodegaTecnicosOBJ->getMaterialByIdMaterial($datos['idMaterial'], $datos['idBodegaEmpleado'])) {
                    $infoitem = $bodegaTecnicosOBJ->registros[0];
                    if ($infoitem['cantIngreso'] == NULL) {
                        $infoitem['cantIngreso'] = 0;
                    }
                    if ($infoitem['cantGasto'] == NULL) {
                        $infoitem['cantGasto'] = 0;
                    }
                    $infoitem['cantDisponible'] = intval($infoitem['cantIngreso']) - intval($infoitem['cantGasto']);
                    if (in_array($_SESSION['ID_USUARIO'], $adminsAlmacen)) {
                        $infoitem['opcionesActualizarAlmacen'] = setListaActulizarAlmacen(true);
                    } else {
                        $infoitem['opcionesActualizarAlmacen'] = setListaActulizarAlmacen(false);
                    }
                } else {
                    $evento = 'nofound';
                }
            } else {
                $evento = 'error';
            }
            echo verVistaAjax($evento, $infoitem);
            break;
        case SACAR_MATERIAL:
            $msg = 0;
            $idBodegaEmpleado = 0;
            if (array_key_exists('idMaterial', $datos) && array_key_exists('idBodegaEmpleado', $datos) && array_key_exists('cantSalida', $datos) && array_key_exists('actualizarAlmacen', $datos)) {
                $idBodegaEmpleado = $datos['idBodegaEmpleado'];
                if ($bodegaTecnicosOBJ->sacarMaterial($datos['actualizarAlmacen'], $datos['idMaterial'], $idBodegaEmpleado, $datos['cantSalida'])) {
                    $msg = 4;
                }
            }
            if ($idBodegaEmpleado != 0) {
                header("location: /swInventario/modulos/bodegaempleado/gestionMateriales?idBodegaEmpleado=$idBodegaEmpleado&msg=$msg");
            } else {
                header("location: /swInventario/modulos/bodegaempleado/gestionMateriales?msg=$msg");
            }
            break;
        case vREGISTRO_MATERIAL:
            $info = array();
            if (array_key_exists('idBodegaEmpleado', $datos)) {
                if ($bodegaTecnicosOBJ->getInfoBodegaEmpleado($datos['idBodegaEmpleado'])) {
                    $info = $bodegaTecnicosOBJ->registros[0];
                    if ($bodegaTecnicosOBJ->getMaterialesAlmacenNoBogEmpl($datos['idBodegaEmpleado'])) {
                        $infomateriales = $bodegaTecnicosOBJ->registros;
                    } else {
                        $infomateriales = array();
                    }
                    $info['listaMateriales'] = setListaMateriales($infomateriales);
                } else {
                    $evento = 'nofound';
                }
            } else {
                $evento = 'error';
            }
            echo verVistaAjax($evento, $info);
            break;
        case REGISTRAR_MATERIAL:
            $msg = 0;
            $idBodegaEmpleado = 0;
            if (array_key_exists('idMaterial', $datos) && array_key_exists('idBodegaEmpleado', $datos)) {
                $idBodegaEmpleado = $datos['idBodegaEmpleado'];
                if ($bodegaTecnicosOBJ->registrarMaterialBodega($idBodegaEmpleado, $datos['idMaterial'])) {
                    $msg = 5;
                }
            }
            if ($idBodegaEmpleado != 0) {
                header("location: /swInventario/modulos/bodegaempleado/gestionMateriales?idBodegaEmpleado=$idBodegaEmpleado&msg=$msg");
            } else {
                header("location: /swInventario/modulos/bodegaempleado/gestionMateriales?msg=$msg");
            }
            break;
        case vREGISTRO_BODEGA:
            $info = array();
            $info['tablaEmpleados'] = setTablaEmpleados($bodegaTecnicosOBJ->getEmpleados());
            echo verVistaAjax($evento, $info);
            break;
        case REGISTRAR_BODEGAS:
            $msg = 0;
            if (array_key_exists('checkes', $datos)) {
                $idsEmpleados = array();
                foreach ($datos['checkes'] as $idEmpleado) {
                    if (!$bodegaTecnicosOBJ->tieneBodega($idEmpleado)) {
                        $idsEmpleados[] = $idEmpleado;
                    }
                }
                if (count($idsEmpleados) > 0) {
                    if ($bodegaTecnicosOBJ->registrarBodegas($idsEmpleados)) {
                        $msg = 6;
                    }
                }
            }
            header("location: /swInventario/modulos/bodegaempleado/administracion?msg=$msg");
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
                            <b>[ OK ]</b> -- Devolucion REGISTRADA en el Sistema.
                         </div>';
            break;
        case 2:
            $mensaje .= '<div class="mensajes exito">
                            <b>[ OK ]</b> -- Recurso MARCADO USADO en el Sistema.
                         </div>';
            break;
        case 3:
            $mensaje .= '<div class="mensajes exito">
                            <b>[ OK ]</b> -- Material ASIGNADO a bodega de Empleado en el Sistema.
                         </div>';
            break;
        case 4:
            $mensaje .= '<div class="mensajes exito">
                            <b>[ OK ]</b> -- Material SACADO de bodega de Empleado en el Sistema.
                         </div>';
            break;
        case 5:
            $mensaje .= '<div class="mensajes exito">
                            <b>[ OK ]</b> -- Material REGISTRADO en bodega de Empleado en el Sistema.
                         </div>';
            break;
        case 6:
            $mensaje .= '<div class="mensajes exito">
                            <b>[ OK ]</b> -- Bodegas REGISTRADAS en el Sistema.
                         </div>';
            break;
    }
    return $mensaje;
}

function getDatos() {
    $datos = array();
    if ($_POST) {
        if (array_key_exists('idBodegaEmpleado', $_POST))
            $datos['idBodegaEmpleado'] = $_POST['idBodegaEmpleado'];
        if (array_key_exists('idRecurso', $_POST))
            $datos['idRecurso'] = $_POST['idRecurso'];
        if (array_key_exists('idMaterial', $_POST))
            $datos['idMaterial'] = $_POST['idMaterial'];
        if (array_key_exists('cantAsignar', $_POST))
            $datos['cantAsignar'] = $_POST['cantAsignar'];
        if (array_key_exists('cantSalida', $_POST))
            $datos['cantSalida'] = $_POST['cantSalida'];
        if (array_key_exists('actualizarAlmacen', $_POST))
            $datos['actualizarAlmacen'] = $_POST['actualizarAlmacen'];
        if (array_key_exists('checkes', $_POST))
            $datos['checkes'] = $_POST['checkes'];
    } else if ($_GET) {
        if (array_key_exists('msg', $_GET))
            $datos['msg'] = $_GET['msg'];
        if (array_key_exists('idBodegaEmpleado', $_GET))
            $datos['idBodegaEmpleado'] = $_GET['idBodegaEmpleado'];
        if (array_key_exists('idRecurso', $_GET))
            $datos['idRecurso'] = $_GET['idRecurso'];
        if (array_key_exists('idMaterial', $_GET))
            $datos['idMaterial'] = $_GET['idMaterial'];
        if (array_key_exists('idEmpleado', $_GET))
            $datos['idEmpleado'] = $_GET['idEmpleado'];
    }
    return $datos;
}

?>
