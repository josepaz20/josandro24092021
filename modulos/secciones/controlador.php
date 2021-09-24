<?php

// ********************** MODULO SECCIONES **********************

session_name('SW2CLICK');
session_start();
require_once('../../servicios/sesionOK.php');
require_once('constantes.php');
require_once('modelo.php');
require_once('vista.php');

controlador();

function controlador() {

    $evento = vSECCION_GENERAL;
    $url = $_SERVER['REQUEST_URI'];

    $peticiones = array(vSECCION_GENERAL, vSECCION_REGISTRO, vSECCION_PLANES,
        vSECCION_CONTRATOS, vSECCION_FACTURACION, vSECCION_ADMIN_FACTURAS,
        vSECCION_MARKETING, vSECCION_RECAUDOS, vSECCION_VENTAS, vSECCION_JURIDICO,
        vSECCION_DEUDAS, vSECCION_TALENTO_HUMANO, vSECCION_HOJA_VIDA, vSECCION_REPORTES,
        ACTIVACION_D, DESACTIVACION_D, vSECCION_USUARIOS, vSECCION_CONTABILIDAD, 
        vSECCION_NOVEDADES_NOMINA, vSECCION_MIKROTIK_CAUCA, vSECCION_MIKROTIK_NARINO, 
        vSECCION_MIKROTIK_HUILA, vSECCION_MIKROTIK_SANTAROSA, vSECCION_CX_TOTAL, vSECCION_MIKROTIK_GESTION);

    foreach ($peticiones as $peticion) {
        $url_peticion = MODULO . $peticion;
        if (strpos($url, $url_peticion) == true) {
            $evento = $peticion;
        }
    }

    menuAdministrador();
    modulosAdministrador();
    activacionD($_SESSION['PRIVILEGIO_USUARIO']);
    $accesoPreFactEmpresarial = array(1, 682, 121, 372, 129, 526);
    $accesoGestionCartera = array(1, 682, 2, 121, 372, 406, 415, 416, 426, 493, 455, 526, 830, 531, 534, 561, 649, 671, 686, 717, 718, 773, 830, 837, 840, 847, 873, 876);

    switch ($evento) {
        case vSECCION_GENERAL:
            $seccionOBJ = new Seccion();
            $datos = array('mensaje' => 'Secci?n general, desde aqu? puedes ver los diferentes m?dulos que existe en
					la aplicaci?n.');
            $alertas = false;
            $datos['validacionOTs'] = '<div class="modulos_principales">
                                    <a href="/sw2click/modulos/cambiostitular/index">
                                        <img src="/sw2click/public/img/validacionOTs.png" alt="Validacion de OTs" title="Validacion de recursos y materiales utilizados por OT.">
                                    </a>
                                    <h3>Cambios de Titulares</h3>
                                 </div>';
            $datos['ampliacionesred'] = '<div class="modulos_principales">
                                    <a href="/sw2click/modulos/ampliacionred/index">
                                        <img src="/sw2click/public/img/validacionOTs.png" alt="Validacion de OTs" title="Validacion de recursos y materiales utilizados por OT.">
                                    </a>
                                    <h3>Ampliaciones de Red</h3>
                                 </div>';
            $datos['viabilidadampliacion'] = '<div class="modulos_principales">
                                    <a href="/sw2click/modulos/viabilidadampliacion/index">
                                        <img src="/sw2click/public/img/validacionOTs.png" alt="Validacion de OTs" title="Viabilidad de ampliación de red.">
                                    </a>
                                    <h3>Viabilidades de Ampliación</h3>
                                 </div>';
            $datos['corporativo'] = '<div class="modulos_principales">
                                    <a href="/sw2click/modulos/corporativo/index">
                                        <img src="/sw2click/public/img/validacionOTs.png" alt="Validacion de OTs" title="Viabilidad de ampliación de red.">
                                    </a>
                                    <h3>Corporativo</h3>
                                 </div>';
            setScriptAlertas($alertas);
            verVista($evento, $datos);
            break;
    }
}

function getPermisos($idUsuario = 0) {
    $seccionesOBJ = new Seccion();
    return $seccionesOBJ->getPermisos($idUsuario);
}

function getTipoContrato($idEmpleado = 0) {
    $seccionesOBJ = new Seccion();
    return $seccionesOBJ->getTipoContrato($idEmpleado);
}

function obtener_datos_servicio() {
    $datos_servicio = array();
    if ($_POST) {
        if (array_key_exists('cedulaNIT', $_POST)) {
            $datos_servicio['cedulaNIT'] = $_POST['cedulaNIT'];
        }
        if (array_key_exists('NIT', $_POST)) {
            $datos_servicio['NIT'] = $_POST['NIT'];
        }
    } else if ($_GET) {
        if (array_key_exists('cedulaNIT', $_GET)) {
            $datos_servicio['cedulaNIT'] = $_GET['cedulaNIT'];
        }
        if (array_key_exists('NIT', $_GET)) {
            $datos_servicio['NIT'] = $_GET['NIT'];
        }
    }

    return $datos_servicio;
}

?>