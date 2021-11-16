<?php

// *****************  MODULO NOVEDADES NOMINA  *****************

session_name('SW2CLICK');
session_start();
require_once('../../servicios/sesionOK.php');
require_once('../../servicios/evitarInyeccionSQL.php');
require_once('constantes.php');
require_once('modelo.php');
require_once('vista.php');

date_default_timezone_set('America/Bogota');

controlador();

function controlador() {
    $evento = '';
    $url = $_SERVER['REQUEST_URI'];

    $peticiones = array(vINSTALACIONES, vINCIDENTES, vVISITASTECNICAS, VER_ENCUESTA_INSTALACION, VER_ENCUESTA_INCIDENTE, VER_ENCUESTA_VISITATECNICA, REGISTRAR_ENCUESTA, vESTADISTICAS, GENERAR_GRAFICO, vCLIENTES, MARCAR_LLAMADO, vENCUESTAS, vDETALLE);

    foreach ($peticiones as $peticion) {
        $url_peticion = MODULO . $peticion;
        if (strpos($url, $url_peticion) == true) {
            $evento = $peticion;
        }
    }

    $cuidadoClienteOBJ = new Cuidadoalcliente();
    $datos = getDatos();

    $datos['opcInicio'] = '<a href="/sw2click/modulos/secciones/seccionGeneral" title="Seccion general">Inicio</a>';
    $datos['opcCerrarSesion'] = '<a href="/sw2click/modulos/usuarios/cerrarSesion" title="Cerrar Sesion">Cerrar Sesion</a>';

    $datos['bandaOpciones'] = '';
    $datos['bandaOpciones'] .= '<button class="btn btn-primary" onclick="location.href = \'instalaciones\'" title="IR A INSTALACIONES"><i class="fa fa-flash"></i> Instalaciones</button>';
    $datos['bandaOpciones'] .= '<button class="btn btn-primary" onclick="location.href = \'incidentes\'" title="IR A INCIDENTES"><i class="fa fa-phone"></i> Incidentes</button>';
    $datos['bandaOpciones'] .= '<button class="btn btn-primary" onclick="location.href = \'visitastecnicas\'" title="IR A VISITAS TECNICAS"><i class="fa fa-wrench"></i> Visitas Tecnicas</button>';
    $accesoEstadisticas = array(1, 2, 681, 682);
    if (in_array($_SESSION['ID_USUARIO'], $accesoEstadisticas)) {
        $datos['bandaOpciones'] .= '<button class="btn btn-success" onclick="location.href = \'estadisticas\'" title="IR A ESTADISTICAS"><i class="fa fa-bar-chart"></i> Estadisticas</button>';
    }
    $accesoClientes_1 = array(1, 682, 315);
    $accesoClientes_2 = array(1, 682, 738, 772, 793, 798);
    if (in_array($_SESSION['ID_USUARIO'], $accesoClientes_1)) {
        $datos['bandaOpciones'] .= ' -- <button class="btn btn-success" onclick="location.href = \'clientes?idFiltroCliente=1\'" title="IR AL PRIMER LISTADO DE CLIENTES"><i class="fa fa-list"></i> Clientes 1</button>';
    }
    if (in_array($_SESSION['ID_USUARIO'], $accesoClientes_2)) {
        $datos['bandaOpciones'] .= ' -- <button class="btn btn-success" onclick="location.href = \'clientes?idFiltroCliente=2\'" title="IR AL SEGUNDO LISTADO DE CLIENTES"><i class="fa fa-list"></i> Clientes 2</button>';
    }
    $datos['bandaOpciones'] .= '<button class="btn btn-primary" onclick="location.href = \'encuestas\'" title="IR A INSTALACIONES"><i class="fa fa-flash"></i> Encuestas</button>';

    switch ($evento) {
        case vINSTALACIONES:
            $fechaBusq = '';
            $registros = array();
            if (array_key_exists('fechaBusq', $datos)) {
                $fechaBusq = $datos['fechaBusq'];
                $registros = $cuidadoClienteOBJ->getOTsInstallSolucionadasByFecha($fechaBusq);
            }
            setTablaInstalaciones($registros);

            if (array_key_exists('msg', $datos)) {
                $datos['mensaje'] = getMensaje($datos['msg']);
            } else {
                $datos['mensaje'] = '';
            }
            $datos['fechahoy'] = date('Y-m-d');
            if ($fechaBusq != '') {
                $datos['fechahoy'] = $fechaBusq;
            }
            verVista($evento, $datos);
            break;
        case vENCUESTAS:

            $cuidadoClienteOBJ->getEncuestas();

            setTablaEncuestas($cuidadoClienteOBJ->registros);
            if (array_key_exists('msg', $datos)) {
                $datos['mensaje'] = getMensaje($datos['msg']);
            } else {
                $datos['mensaje'] = $cuidadoClienteOBJ->mensaje;
            }
            $datos['ordenar'] = 0;
            verVista($evento, $datos);
            break;

        case vDETALLE:
            $infoCorporativo = array();
            if (array_key_exists('idFormulario', $datos)) {
                $cuidadoClienteOBJ->getEncuesta($datos['idFormulario']);
                $infoCorporativo = $cuidadoClienteOBJ->registros[0];
                $cuidadoClienteOBJ->getRespuestas($datos['idFormulario']);
                $infoCorporativo['tablaRespuestas'] = setTablaRespuestas($cuidadoClienteOBJ->registros);
            }

            echo verVistaAjax($evento, $infoCorporativo);
            break;
        case vINCIDENTES:
            $fechaBusq = '';
            $estadoBusq = '';
            $registros = array();
            if (array_key_exists('fechaBusq', $datos)) {
                $fechaBusq = $datos['fechaBusq'];
                $estadoBusq = '';
                if (array_key_exists('solucionadoBusq', $datos)) {
                    $estadoBusq = $datos['solucionadoBusq'];
                }
                $registros = $cuidadoClienteOBJ->getIncidentesByFechaEstado($fechaBusq, $estadoBusq);
            }
            setTablaIncidentes($registros);

            if (array_key_exists('msg', $datos)) {
                $datos['mensaje'] = getMensaje($datos['msg']);
            } else {
                $datos['mensaje'] = '';
            }
            $datos['fechahoy'] = date('Y-m-d');
            if ($fechaBusq != '') {
                $datos['fechahoy'] = $fechaBusq;
            }
            $datos['checkedSolucionadoBusq'] = '';
            if ($estadoBusq != '') {
                $datos['checkedSolucionadoBusq'] = 'checked';
            }
            verVista($evento, $datos);
            break;
        case vVISITASTECNICAS:
            $fechaBusq = '';
            $registros = array();
            if (array_key_exists('fechaBusq', $datos)) {
                $fechaBusq = $datos['fechaBusq'];
                $registros = $cuidadoClienteOBJ->getOTsSolucionadasByFecha($fechaBusq);
            }
            setTablaVisitastecnicas($registros);

            if (array_key_exists('msg', $datos)) {
                $datos['mensaje'] = getMensaje($datos['msg']);
            } else {
                $datos['mensaje'] = '';
            }
            $datos['fechahoy'] = date('Y-m-d');
            if ($fechaBusq != '') {
                $datos['fechahoy'] = $fechaBusq;
            }
            verVista($evento, $datos);
            break;
        case VER_ENCUESTA_INSTALACION:
            echo verVistaAjax($evento, $datos);
            break;
        case VER_ENCUESTA_INCIDENTE:
            echo verVistaAjax($evento, $datos);
            break;
        case VER_ENCUESTA_VISITATECNICA:
            echo verVistaAjax($evento, $datos);
            break;
        case REGISTRAR_ENCUESTA:
            $desde = 'instalaciones';
            if (!array_key_exists('idOT', $datos)) {
                $datos['idOT'] = 'NULL';
            }
            if (!array_key_exists('idIncidente', $datos)) {
                $datos['idIncidente'] = 'NULL';
            }
            if (array_key_exists('desde', $datos)) {
                $desde = $datos['desde'];
            }
            $datos['registradopor'] = $_SESSION['NOMBRES_APELLIDO_USUARIO'];
            $datos['fechahorareg'] = date('Y-m-d H:i:s');
            if ($cuidadoClienteOBJ->registrarEncuesta($datos)) {
                $msg = 1;
            } else {
                $msg = 0;
            }
            $filtro = '';
            if (array_key_exists('fechaBusq', $datos)) {
                $filtro = 'fechaBusq=' . $datos['fechaBusq'];
            }
            if (array_key_exists('solucionadoBusq', $datos)) {
                if ($datos['solucionadoBusq'] != '{solucionadoBusq}') {
                    $filtro .= '&solucionadoBusq=' . $datos['solucionadoBusq'];
                }
            }
            header("location: /sw2click/modulos/cuidadoalcliente/$desde?msg=$msg&$filtro");
            break;
        case vESTADISTICAS:
            verVista($evento, $datos);
            break;
        case GENERAR_GRAFICO:
            $preguntasSINO = array(1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 19);
            if (in_array($datos['idPregunta'], $preguntasSINO)) {
                $contSI = $cuidadoClienteOBJ->getInfoGrafico($datos['idPregunta'], 1);
                $contNO = $cuidadoClienteOBJ->getInfoGrafico($datos['idPregunta'], 0);
                $datos['series'] = "
                  {
                    name: 'SI',
                    y: $contSI
                  },
                  {
                    name: 'NO',
                    y: $contNO
                  }
                ";
            } else {
                if ($datos['idPregunta'] == 15) {
                    $cont1 = $cuidadoClienteOBJ->getInfoGrafico($datos['idPregunta'], 1);
                    $cont2 = $cuidadoClienteOBJ->getInfoGrafico($datos['idPregunta'], 2);
                    $cont3 = $cuidadoClienteOBJ->getInfoGrafico($datos['idPregunta'], 3);
                    $cont4 = $cuidadoClienteOBJ->getInfoGrafico($datos['idPregunta'], 4);
                    $cont5 = $cuidadoClienteOBJ->getInfoGrafico($datos['idPregunta'], 5);
                    $cont6 = $cuidadoClienteOBJ->getInfoGrafico($datos['idPregunta'], 6);
                    $cont7 = $cuidadoClienteOBJ->getInfoGrafico($datos['idPregunta'], 7);
                    $datos['series'] = "
                      {
                        name: 'Llamada a PBX',
                        y: $cont1
                      },
                      {
                        name: 'App Dobleclick',
                        y: $cont2
                      },
                      {
                        name: 'Whatsapp',
                        y: $cont3
                      },
                      {
                        name: 'Facebook',
                        y: $cont4
                      },
                      {
                        name: 'Chat Pagina Web',
                        y: $cont5
                      },
                      {
                        name: 'Oficinas Dobleclick',
                        y: $cont6
                      },
                      {
                        name: 'Tickets Web',
                        y: $cont7
                      },
                    ";
                } else {
                    $cont1 = $cuidadoClienteOBJ->getInfoGrafico($datos['idPregunta'], 1);
                    $cont2 = $cuidadoClienteOBJ->getInfoGrafico($datos['idPregunta'], 2);
                    $cont3 = $cuidadoClienteOBJ->getInfoGrafico($datos['idPregunta'], 3);
                    $cont4 = $cuidadoClienteOBJ->getInfoGrafico($datos['idPregunta'], 4);
                    $cont5 = $cuidadoClienteOBJ->getInfoGrafico($datos['idPregunta'], 5);
                    $datos['series'] = "
                      {
                        name: 'Respueta 1',
                        y: $cont1
                      },
                      {
                        name: 'Respueta 2',
                        y: $cont2
                      },
                      {
                        name: 'Respueta 3',
                        y: $cont3
                      },
                      {
                        name: 'Respueta 4',
                        y: $cont4
                      },
                      {
                        name: 'Respueta 5',
                        y: $cont5
                      },
                    ";
                }
            }
            echo verVistaAjax($evento, $datos);
            break;
        case vCLIENTES:
            $filtro = "";
            if (array_key_exists('idFiltroCliente', $datos)) {
                switch (intval($datos['idFiltroCliente'])) {
                    case 1:
                        $filtro = "AND residencial.idResidencial <= 10000";
                        break;
                    case 2:
                        $filtro = "AND residencial.idResidencial > 10000";
                        break;
                    default:
                        $filtro = "";
                        break;
                }
            }
            setTablaClientes($cuidadoClienteOBJ->getClientes($filtro));
            verVista($evento, $datos);
            break;
        case MARCAR_LLAMADO:
            $info = array('ok' => 1, 'idCliente' => 0);
            if (array_key_exists('idCliente', $datos)) {
                if ($cuidadoClienteOBJ->setMarcadoLlamado($datos['idCliente'])) {
                    $info['idCliente'] = $datos['idCliente'];
                    $info['ok'] = 1;
                }
            }
            echo json_encode($info);
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
            $mensaje .= '<div class="mensajes error">
                            <b>[ ERROR ]</b> -- LA OPERACION SOLICITADA <b>NO</b> FUE REALIZADA. <br>
                            COMUNIQUESE CON EL ADMINISTRADOR DEL SISTEMA.
                        </div>';
            break;
        case 1:
            $mensaje .= '<div class="mensajes exito">
                            <b>[ OK ]</b> -- NOVEDAD DE NOMINA <b>REGISTRADA</b> EN EL SISTEMA.
                         </div>';
            break;
    }
    return $mensaje;
}

function getDatos() {
    $datos = array();
    if ($_POST) {
        for ($i = 1; $i <= 22; $i++) {
            if (array_key_exists("respuesta_$i", $_POST)) {
                $datos["respuesta_$i"] = $_POST["respuesta_$i"];
            }
        }
        if (array_key_exists('idFormulario', $_POST))
            $datos['idFormulario'] = $_POST['idFormulario'];
        if (array_key_exists('idOT', $_POST))
            $datos['idOT'] = $_POST['idOT'];
        if (array_key_exists('idIncidente', $_POST))
            $datos['idIncidente'] = $_POST['idIncidente'];
        if (array_key_exists('asesorventa', $_POST))
            $datos['asesorventa'] = strtoupper($_POST['asesorventa']);
        if (array_key_exists('email', $_POST))
            $datos['email'] = strtolower($_POST['email']);
        if (array_key_exists('observacionventa', $_POST))
            $datos['observacionventa'] = $_POST['observacionventa'];
        if (array_key_exists('observacionincidente', $_POST))
            $datos['observacionincidente'] = $_POST['observacionincidente'];
        if (array_key_exists('desde', $_POST))
            $datos['desde'] = $_POST['desde'];
        if (array_key_exists('fechaBusq', $_POST))
            $datos['fechaBusq'] = $_POST['fechaBusq'];
        if (array_key_exists('solucionadoBusq', $_POST))
            $datos['solucionadoBusq'] = $_POST['solucionadoBusq'];
        if (array_key_exists('observacionincidente', $_POST))
            $datos['observacionincidente'] = $_POST['observacionincidente'];
    }
    if ($_GET) {
        if (array_key_exists('idFormulario', $_GET))
            $datos['idFormulario'] = $_GET['idFormulario'];
        if (array_key_exists('observacionventa', $_GET))
            $datos['observacionventa'] = $_GET['observacionventa'];
        if (array_key_exists('observacionincidente', $_GET))
            $datos['observacionincidente'] = $_GET['observacionincidente'];
        if (array_key_exists('msg', $_GET))
            $datos['msg'] = $_GET['msg'];
        if (array_key_exists('fechaBusq', $_GET))
            $datos['fechaBusq'] = $_GET['fechaBusq'];
        if (array_key_exists('solucionadoBusq', $_GET))
            $datos['solucionadoBusq'] = $_GET['solucionadoBusq'];
        if (array_key_exists('idOT', $_GET))
            $datos['idOT'] = $_GET['idOT'];
        if (array_key_exists('idIncidente', $_GET))
            $datos['idIncidente'] = $_GET['idIncidente'];
        if (array_key_exists('idPregunta', $_GET))
            $datos['idPregunta'] = $_GET['idPregunta'];
        if (array_key_exists('pregunta', $_GET))
            $datos['pregunta'] = $_GET['pregunta'];
        if (array_key_exists('idFiltroCliente', $_GET))
            $datos['idFiltroCliente'] = $_GET['idFiltroCliente'];
        if (array_key_exists('idCliente', $_GET))
            $datos['idCliente'] = $_GET['idCliente'];
    }
    return $datos;
}

?>