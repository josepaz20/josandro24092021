<?php

// ********************** MODULO SECCIONES **********************

$diccionario = array(
    'titulo' => array(
        vSECCION_GENERAL => 'SECCION GENERAL',
        vSECCION_REGISTRO => 'SECCION REGISTRO',
        vSECCION_PLANES => 'SECCION PLANES',
        vSECCION_CONTRATOS => 'SECCION CONTRATOS',
        vSECCION_FACTURACION => 'SECCION FACTURACION',
        vSECCION_ADMIN_FACTURAS => 'SECCION FACTURACION',
        vSECCION_MARKETING => 'SECCION MARKETING',
        vSECCION_RECAUDOS => 'SECCION RECAUDOS',
        vSECCION_VENTAS => 'SECCION VENTAS',
        vSECCION_JURIDICO => 'SECCION COBRO JURIDICO',
        vSECCION_DEUDAS => 'SECCION DEUDAS',
        vSECCION_TALENTO_HUMANO => 'SECCION TALENTO HUMANO',
        vSECCION_HOJA_VIDA => 'SECCION HOJA DE VIDA',
        vSECCION_REPORTES => 'SECCION REPORTES',
        vSECCION_USUARIOS => 'SECCION USUARIOS',
        vSECCION_CONTABILIDAD => 'SECCION CONTABILIDAD',
        vSECCION_NOVEDADES_NOMINA => 'SECCION NOVEDADES NOMINA',
        vSECCION_MIKROTIK_CAUCA => '<span style="font-size: 40px; color: blue; letter-spacing: 15px;">CAUCA</span>',
        vSECCION_MIKROTIK_NARINO => '<span style="font-size: 40px; color: blue; letter-spacing: 15px;">NARINO</span>',
    ),
    'subtitulo' => array(
        vSECCION_GENERAL => 'Modulos Principales',
        vSECCION_REGISTRO => 'Módulos de la Sección Registro',
        vSECCION_PLANES => 'Módulos de la Sección Planes',
        vSECCION_CONTRATOS => 'Módulos de la Sección Contratos',
        vSECCION_FACTURACION => 'Módulos de la Sección Facturación',
        vSECCION_ADMIN_FACTURAS => 'Módulos de la Sección Facturación',
        vSECCION_MARKETING => 'Módulos de la Sección Marketing',
        vSECCION_RECAUDOS => 'Módulos de la Sección Recaudos',
        vSECCION_VENTAS => 'Módulos de la Sección Ventas',
        vSECCION_JURIDICO => 'Módulos de la Sección Cobro Juridico',
        vSECCION_DEUDAS => 'Módulos de la Sección Deudas',
        vSECCION_TALENTO_HUMANO => 'Módulos de la Sección Talento Humano',
        vSECCION_HOJA_VIDA => 'Módulos de la Sección Hoja de Vida',
        vSECCION_REPORTES => 'Módulos de la Sección Reportes',
        vSECCION_USUARIOS => 'Módulos de la Sección Usuarios',
        vSECCION_CONTABILIDAD => 'Modulos de la Seccion Contabilidad',
        vSECCION_NOVEDADES_NOMINA => 'Modulos de la Seccion Novedades de Nomina',
        vSECCION_MIKROTIK_CAUCA => 'Gestion de Servicios - Zona CAUCA',
        vSECCION_MIKROTIK_NARINO => 'Gestion de Servicios - Zona NARINO',
    )
);

function getPlantilla($form = '') {
    $archivo = '../../' . PUBLICO . $form . '.html';
    $template = file_get_contents($archivo);
    return $template;
}

function render_dinamico_datos($html, $data) {
    foreach ($data as $clave => $valor) {
        $html = str_replace('{' . $clave . '}', $valor, $html);
    }
    return $html;
}

function verVista($vista = '', $datos = array()) {

    global $diccionario;
    global $modulosAdministrador;
    global $menuAdministrador;
    global $scriptAlertas;
    global $descuentos;
    global $facturarVenta;
    global $cuentaCobro;
    global $cuentas;
    global $activacionD;
    global $desactivacionD;
    global $reiniciarFacturacion;

    $plantilla = $vista;
    if (isset($_SESSION['ACTIVACION_D'])) {
        if ($_SESSION['ACTIVACION_D'] == 1) {
            switch ($vista) {
                case vSECCION_GENERAL:
                    $plantilla .= 'D';
                    break;
                case vSECCION_CONTRATOS:
                    $plantilla .= 'D';
                    break;
                case vSECCION_DEUDAS:
                    $plantilla .= 'D';
                    break;
                case vSECCION_FACTURACION:
                    $plantilla .= 'D';
                    break;
                case vSECCION_RECAUDOS:
                    $plantilla .= 'D';
                    break;
                case vSECCION_REGISTRO:
                    $plantilla .= 'D';
                    break;
                case vSECCION_REPORTES:
                    $plantilla .= 'D';
                    break;
            }
        }
    }

    $html = getPlantilla('plantilla');
    $html = str_replace('{user_name}', $_SESSION['NOMBRES_APELLIDO_USUARIO'], $html);
    $html = str_replace('{user_charge}', $_SESSION['CARGO_USUARIO'], $html);
    $html = str_replace('{titulo}', $diccionario['titulo'][$vista], $html);
    $html = str_replace('{subtitulo}', $diccionario['subtitulo'][$vista], $html);
    $html = str_replace('{contenido}', getPlantilla($plantilla), $html);
    $html = str_replace('{modulosAdministrador}', $modulosAdministrador, $html);
    $html = str_replace('{menuAdministrador}', $menuAdministrador, $html);
    $html = str_replace('{descuentos}', $descuentos, $html);
    $html = str_replace('{facturarVenta}', $facturarVenta, $html);
    $html = str_replace('{cuentas}', $cuentas, $html);
    $html = str_replace('{cuentaCobro}', $cuentaCobro, $html);
    $html = str_replace('{reiniciarFacturacion}', $reiniciarFacturacion, $html);
    $html = str_replace('{scriptAlertas}', $scriptAlertas, $html);
    $html = str_replace('{mensaje}', $datos['mensaje'], $html);

    $html = str_replace('{activacionD}', $activacionD, $html);
    $html = str_replace('{desactivacionD}', $desactivacionD, $html);
    $html = render_dinamico_datos($html, $datos);

    print $html;
}

function modulosAdministrador() {
    global $modulosAdministrador;
    
    if ($_SESSION['ID_USUARIO'] == 458) {
        return;
    }

    $modulosAdministrador = '';
    $modulosAdministrador .=
            '<div class="modulos_principales">
              <a href="/sw2click/modulos/usuarios/cambiarClave">
                  <img src="/sw2click/public/img/miCuenta.png" title="CAMBIAR PASSWORD DE ACCESO">
              </a>
              <h3>Mi Cuenta</h3>
             </div>';
}


function menuAdministrador() {
    global $menuAdministrador;
    if ($_SESSION['PRIVILEGIO_USUARIO'] == 1 || $_SESSION['PRIVILEGIO_USUARIO'] == 2) {
        $menuAdministrador = '
<a href = "/sw2click/modulos/secciones/seccionRegistro" title = "Gestion de Clientes">Registro</a>
<a href = "/sw2click/modulos/secciones/seccionContratos" title = "Gestion de Contratos">Contratos</a>';
        if ($_SESSION['CEDULA_USUARIO'] == 0) {
            $menuAdministrador.= '
<a href = "/sw2click/modulos/secciones/seccionPlanes" title = "Gestion de Planes de Servicio">Planes</a>
<!--
<a href = "/sw2click/modulos/secciones/seccion_facturacion" title = "Gestion de Facturacion">Facturacion</a>
<a href = "/sw2click/modulos/secciones/seccion_recaudos" title = "Gestion de Recaudos">Recaudos</a>
-->
';
        }
    } elseif ($_SESSION['PRIVILEGIO_USUARIO'] == 3) {
        $menuAdministrador = '
<a href = "/sw2click/modulos/secciones/seccionRegistro" title = "Gestion de Clientes">Registro</a>
<a href = "/sw2click/modulos/secciones/seccionContratos" title = "Gestion de Contratos">Contratos</a>';
    } elseif ($_SESSION['PRIVILEGIO_USUARIO'] == 4) {
        $menuAdministrador = '
<a href = "/sw2click/modulos/secciones/seccionRegistro" title = "Gestion de Clientes">Registro</a>
<a href = "/sw2click/modulos/secciones/seccionContratos" title = "Gestion de Contratos">Contratos</a>';
        if ($_SESSION['CEDULA_USUARIO'] == 0) {
            $menuAdministrador.= '
<a href = "/sw2click/modulos/secciones/seccionPlanes" title = "Gestion de Planes de Servicio">Planes</a>
<!--
<a href = "/sw2click/modulos/secciones/seccion_recaudos" title = "Gestion de Recaudos">Recaudos</a>
-->
';
        }
    }
}

function setDescuentos() {
    global $descuentos;
    $descuentos = '
<div class = "modulos_principales">
    <a href = "/sw2click/modulos/descuentos/administracion">
        <img src = "/sw2click/public/img/descuentos.png" title = "Administrar los Descuentos que se deben realizar a los Clientes de la empresa." />
    </a>
    <h3>Descuentos</h3>
</div>';
}

function setFacturarVenta() {
    global $facturarVenta;
    $facturarVenta = '<div class = "modulos_principales">
    <a href = "/sw2click/modulos/factura/nuevaVenta">
        <img src = "/sw2click/public/img/facturaVenta.png" title = "Crear una Factura de Venta" />
    </a>
    <h3>Facturar Venta</h3>
</div>';
}

function setCuentas() {
    global $cuentas;
    $cuentas = '<div class = "modulos_principales">
    <a href = "/sw2click/modulos/cuenta/administracion">
        <img src = "/sw2click/public/img/cuentas.png" title = "Gestionar las Cuentas de los Clientes" />
    </a>
    <h3>Cuentas</h3>
</div>';
}

function setCuentaCobro() {
    global $cuentaCobro;
    $cuentaCobro = '<div class = "modulos_principales">
    <a href = "/sw2click/modulos/cuentaCobro/administracion">
        <img src = "/sw2click/public/img/cuentaCobro.png" title = "Gestionar las Cuentas de Cobro" />
    </a>
    <h3>Cuenta de Cobro</h3>
</div>';
}

function setReiniciarFacturacion() {
    global $reiniciarFacturacion;
    $reiniciarFacturacion = '<div class = "modulos_principales">
    <a href = "/sw2click/modulos/factura/reiniciar">
        <img src = "/sw2click/public/img/reiniciarFacturacion.png" title = "Administrar la información relacionada con los Recaudos de la empresa." />
    </a>
    <h3>Reiniciar Facturacion</h3>
</div>';
}

function setScriptAlertas($mostrar = false) {
    global $scriptAlertas;
    if ($mostrar) {
        $usuariosNOC = array(13, 274, 283, 651);
        if (in_array($_SESSION['ID_USUARIO'], $usuariosNOC)) {
            $scriptAlertas = "<br><div>
                                <table style='border-spacing: 15px'>
                                    <tr>
                                        <td class='tdTablaAlertas'>
                                            <div style='border-right: 1px solid #000; padding: 5px 10px 0px 5px; float: left'>
                                                <i class='fa fa-comments' style='font-size: 50px'></i>
                                            </div>
                                            <div style='padding: 5px 5px 0px 10px; float: right'>
                                                <a href = '/noc/modulos/secciones/seccionGeneral' style = 'color: #00F; letter-spacing: 2px; font-weight: bolder'>TICKETS WEB</a><br>
                                                Tickets: <b>{numTickets}</b><br>
                                                Mensajes: <b>{numMensajes}</b><br>
                                            </div>
                                        </td>
                                        <td class='tdTablaAlertas'>
                                            <div style='border-right: 1px solid #000; padding: 5px 10px 0px 5px; float: left'>
                                                <i class='fa fa-phone' style='font-size: 50px'></i>
                                            </div>
                                            <div style='padding: 5px 5px 0px 10px; float: right'>
                                                <span style='letter-spacing: 2px; font-weight: bolder'>LLAMADAS</span><br>
                                                <a href = '/crm/modulos/llamada/administracion?g=1' style='color: #00F; font-weight: bolder'>En Proceso: <b>{numLlamadasAbiertas}</b></a><br><br>
                                                <a href = '/crm/modulos/llamada/administracion?g=1&visitaTecnica=1' style = 'color: #00F; font-weight: bolder'>Visitas Tecnicas: <b>{numVisitasTecnicas}</b></a><br>
                                            </div>
                                        </td>
                                        <td class='tdTablaAlertas'>
                                            <div style='border-right: 1px solid #000; padding-right: 10px; float: left'>
                                                <i class='fa fa-user' style='font-size: 35px'></i>
                                            </div>
                                            <div style='padding-left: 10px; float: right'>
                                                <a href = '/swInventario/modulos/secciones/seccionInstalaciones' style = 'color: #00F; letter-spacing: 2px; font-weight: bolder'>INSTALACIONES</a><br>
                                                Corporativas: <b>{numInstallCorp}</b><br>
                                                Residenciales: <b>{numInstallRes}</b><br>
                                            </div>
                                        </td>
                                        <td class='tdTablaAlertas'>
                                            <div style='border-right: 1px solid #000; padding-right: 10px; float: left'>
                                                <i class='fa fa-check-square-o' style='font-size: 35px'></i>
                                            </div>
                                            <div style='padding-left: 10px; float: right'>
                                                <a href = '/crm/modulos/resultados/completos' style = 'color: #00F; letter-spacing: 2px; font-weight: bolder'>OT'S</a><br>
                                                Sin Supervision: <b>{ServiciosCompletados}</b><br><br>
                                            </div>
                                        </td>
                                        <td class='tdTablaAlertas'>
                                            <div style='border-right: 1px solid #000; padding-right: 10px; float: left'>
                                                <i class='fa fa-puzzle-piece' style='font-size: 35px'></i>
                                            </div>
                                            <div style='padding-left: 10px; float: right'>
                                                <a href = '/sw2click/modulos/cambiostv/instalaciones' style = 'color: #00F; letter-spacing: 2px; font-weight: bolder'>AUMENTO DECOS</a> <br>
                                                Registrados: <b>{contCambiosTvAumento}</b><br>
                                                Listos para OT: <b>{contCambiosTvAumentoOT}</b>
                                            </div>
                                        </td>
                                        <td class='tdTablaAlertas'>
                                            <div style='border-right: 1px solid #000; padding-right: 10px; float: left'>
                                                <i class='fa fa-eraser' style='font-size: 35px'></i>
                                            </div>
                                            <div style='padding-left: 10px; float: right'>
                                                <a href = '/sw2click/modulos/cambiostv/retiros' style = 'color: #00F; letter-spacing: 2px; font-weight: bolder'>RETIRO DECOS</a> <br>
                                                Registrados: <b>{contCambiosTvRetiro}</b><br>
                                                Listos para OT: <b>{contCambiosTvRetiroOT}</b>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class='tdTablaAlertas'>
                                            <div style='border-right: 1px solid #000; padding-right: 10px; float: left'>
                                                <i class='fa fa-refresh' style='font-size: 35px'></i>
                                            </div>
                                            <div style='padding-left: 10px; float: right'>
                                                <a href = '/sw2click/modulos/cambioPlan/administracion' style = 'color: #00F; letter-spacing: 2px; font-weight: bolder'>CAMBIOS DE PLAN</a><br>
                                                Corporativos: <b>{cambiosPlanCorp}</b><br>
                                                Residenciales: <b>{cambiosPlanRes}</b>
                                            </div>
                                        </td>
                                        <td class='tdTablaAlertas'>
                                            <div style='border-right: 1px solid #000; padding-right: 10px; float: left'>
                                                <i class='fa fa-times' style='font-size: 35px'></i>
                                            </div>
                                            <div style='padding-left: 10px; float: right'>
                                                <a href = '/sw2click/modulos/retiros/administracion' style = 'color: #00F; letter-spacing: 2px; font-weight: bolder'>RETIROS</a><br>
                                                Corporativos: <b>{numRetirosCorp}</b><br>
                                                Residenciales: <b>{numRetirosRes}</b>
                                            </div>
                                        </td>
                                        <td class='tdTablaAlertas'>
                                            <div style='border-right: 1px solid #000; padding-right: 10px; float: left'>
                                                <i class='fa fa-truck' style='font-size: 35px'></i>
                                            </div>
                                            <div style='padding-left: 10px; float: right'>
                                                <a href = '/sw2click/modulos/traslados/administracion' style = 'color: #00F; letter-spacing: 2px; font-weight: bolder'>TRASLADOS</a> <br>
                                                Registrados: <b>{contTrasladosReg}</b><br>
                                                Listos para OT: <b>{contTrasladosOT}</b>
                                            </div>
                                        </td>
                                        <td class='tdTablaAlertas'>
                                            <div style='border-right: 1px solid #000; padding-right: 10px; float: left'>
                                                <i class='fa fa-exchange' style='font-size: 35px'></i>
                                            </div>
                                            <div style='padding-left: 10px; float: right'>
                                                <a href = '/sw2click/modulos/migraciones/administracion' style = 'color: #00F; letter-spacing: 2px; font-weight: bolder'>MIGRACIONES</a> <br>
                                                Registrados: <b>{contMigracionesReg}</b><br>
                                                Listos para OT: <b>{contMigracionesOT}</b>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </div>";
        } else {
            $scriptAlertas = "<br><div>
                                <table style='border-spacing: 10px; margin-left: -10px'>
                                    <tr>
                                        <td class='tdTablaAlertas'>
                                            <div style='border-right: 1px solid #000; padding-right: 10px; float: left'>
                                                <i class='fa fa-comments' style='font-size: 35px'></i>
                                            </div>
                                            <div style='padding-left: 10px; float: right'>
                                                <a href = '/noc/modulos/secciones/seccionGeneral' style = 'color: #00F; letter-spacing: 2px; font-weight: bolder'>TICKETS WEB</a><br>
                                                Tickets: <b>{numTickets}</b><br>
                                                Mensajes: <b>{numMensajes}</b><br>
                                            </div>
                                        </td>
                                        <td class='tdTablaAlertas'>
                                            <div style='border-right: 1px solid #000; padding: 5px 10px 0px 5px; float: left'>
                                                <i class='fa fa-phone' style='font-size: 50px'></i>
                                            </div>
                                            <div style='padding: 5px 5px 0px 10px; float: right'>
                                                <span style='letter-spacing: 2px; font-weight: bolder'>LLAMADAS</span><br>
                                                <a href = '/crm/modulos/llamada/administracion?g=1' style='color: #00F; font-weight: bolder'>En Proceso: <b>{numLlamadasAbiertas}</b></a><br><br>
                                                <a href = '/crm/modulos/llamada/administracion?g=1&visitaTecnica=1' style = 'color: #00F; font-weight: bolder'>Visitas Tecnicas: <b>{numVisitasTecnicas}</b></a><br>
                                            </div>
                                        </td>
                                        <td class='tdTablaAlertas'>
                                            <div style='border-right: 1px solid #000; padding-right: 10px; float: left'>
                                                <i class='fa fa-user' style='font-size: 35px'></i>
                                            </div>
                                            <div style='padding-left: 10px; float: right'>
                                                <a href = '/swInventario/modulos/secciones/seccionInstalaciones' style = 'color: #00F; letter-spacing: 2px; font-weight: bolder'>INSTALACIONES</a><br>
                                                Corporativas: <b>{numInstallCorp}</b><br>
                                                Residenciales: <b>{numInstallRes}</b><br>
                                            </div>
                                        </td>
                                        <!-- <td class='tdTablaAlertas'>
                                            <div style='border-right: 1px solid #000; padding-right: 10px; float: left'>
                                                <i class='fa fa-power-off' style='font-size: 35px'></i>
                                            </div>
                                            <div style='padding-left: 10px; float: right'>
                                                <a href = '/sw2click/modulos/activacionRecaudo/administracion' style = 'color: #00F; letter-spacing: 2px; font-weight: bolder'>ACTIVACIONES</a><br>
                                                Pendientes: <b>{revisados}</b><br><br>
                                            </div>
                                        </td> -->
                                        <td class='tdTablaAlertas'>
                                            <div style='border-right: 1px solid #000; padding-right: 10px; float: left'>
                                                <i class='fa fa-check-square-o' style='font-size: 35px'></i>
                                            </div>
                                            <div style='padding-left: 10px; float: right'>
                                                <a href = '/crm/modulos/resultados/completos' style = 'color: #00F; letter-spacing: 2px; font-weight: bolder'>OT'S</a><br>
                                                Sin Supervision: <b>{ServiciosCompletados}</b><br><br>
                                            </div>
                                        </td>
                                        <td class='tdTablaAlertas'>
                                            <div style='border-right: 1px solid #000; padding-right: 10px; float: left'>
                                                <i class='fa fa-puzzle-piece' style='font-size: 35px'></i>
                                            </div>
                                            <div style='padding-left: 10px; float: right'>
                                                <a href = '/sw2click/modulos/cambiostv/instalaciones' style = 'color: #00F; letter-spacing: 2px; font-weight: bolder'>AUMENTO DECOS</a> <br>
                                                Registrados: <b>{contCambiosTvAumento}</b><br>
                                                Listos para OT: <b>{contCambiosTvAumentoOT}</b>
                                            </div>
                                        </td>
                                        <td class='tdTablaAlertas'>
                                            <div style='border-right: 1px solid #000; padding-right: 10px; float: left'>
                                                <i class='fa fa-eraser' style='font-size: 35px'></i>
                                            </div>
                                            <div style='padding-left: 10px; float: right'>
                                                <a href = '/sw2click/modulos/cambiostv/retiros' style = 'color: #00F; letter-spacing: 2px; font-weight: bolder'>RETIRO DECOS</a> <br>
                                                Registrados: <b>{contCambiosTvRetiro}</b><br>
                                                Listos para OT: <b>{contCambiosTvRetiroOT}</b>
                                            </div>
                                        </td>
                                        </tr>
                                        <tr>
                                        <td class='tdTablaAlertas'>
                                            <div style='border-right: 1px solid #000; padding-right: 10px; float: left'>
                                                <i class='fa fa-refresh' style='font-size: 35px'></i>
                                            </div>
                                            <div style='padding-left: 10px; float: right'>
                                                <a href = '/sw2click/modulos/cambioPlan/administracion' style = 'color: #00F; letter-spacing: 2px; font-weight: bolder'>CAMBIOS DE PLAN</a><br>
                                                Corporativos: <b>{cambiosPlanCorp}</b><br>
                                                Residenciales: <b>{cambiosPlanRes}</b>
                                            </div>
                                        </td>
                                        <td class='tdTablaAlertas'>
                                            <div style='border-right: 1px solid #000; padding-right: 10px; float: left'>
                                                <i class='fa fa-times' style='font-size: 35px'></i>
                                            </div>
                                            <div style='padding-left: 10px; float: right'>
                                                <a href = '/sw2click/modulos/retiros/administracion' style = 'color: #00F; letter-spacing: 2px; font-weight: bolder'>RETIROS</a><br>
                                                Corporativos: <b>{numRetirosCorp}</b><br>
                                                Residenciales: <b>{numRetirosRes}</b>
                                            </div>
                                        </td>
                                        <td class='tdTablaAlertas'>
                                            <div style='border-right: 1px solid #000; padding-right: 10px; float: left'>
                                                <i class='fa fa-warning' style='font-size: 35px'></i>
                                            </div>
                                            <div style='padding-left: 10px; float: right'>
                                        ";
            if ($_SESSION['PRIVILEGIO_USUARIO'] == 1 || $_SESSION['ID_USUARIO'] == 23 || $_SESSION['ID_USUARIO'] == 364 || $_SESSION['ID_USUARIO'] == 182 || $_SESSION['ID_USUARIO'] == 613 || $_SESSION['ID_USUARIO'] == 60 || $_SESSION['ID_USUARIO'] == 502 || $_SESSION['ID_USUARIO'] == 527) {
//                $scriptAlertas .= "<a href = '/crm/modulos/llamada/administracion?g=1&danio=1' style = 'color: #00F; letter-spacing: 2px; font-weight: bolder'>" . utf8_encode('DA?OS MASIVOS') . "</a><br>";
                $scriptAlertas .= "<a href = '/crm/modulos/llamada/daniosmasivos?g=1&danio=1' style = 'color: #00F; letter-spacing: 2px; font-weight: bolder'>" . utf8_encode('DA?OS MASIVOS') . "</a><br>";
            } else {
                $scriptAlertas .= "<a href = '#' style = 'color: #00F; letter-spacing: 2px; font-weight: bolder'>" . utf8_encode('DA?OS MASIVOS') . "</a><br>";
            }

            $fechaHoy = date('Y-m-d');
            $scriptAlertas .= "Activos: <b>{contDaniosMasivos}</b><br>
                                            </div>
                                        </td>
                                        <td class='tdTablaAlertas'>
                                            <div style='border-right: 1px solid #000; padding-right: 10px; float: left'>
                                                <i class='fa fa-truck' style='font-size: 35px'></i>
                                            </div>
                                            <div style='padding-left: 10px; float: right'>
                                                <a href = '/sw2click/modulos/traslados/administracion' style = 'color: #00F; letter-spacing: 2px; font-weight: bolder'>TRASLADOS</a> <br>
                                                Registrados: <b>{contTrasladosReg}</b><br>
                                                Listos para OT: <b>{contTrasladosOT}</b>
                                            </div>
                                        </td>
                                        <td class='tdTablaAlertas'>
                                            <div style='border-right: 1px solid #000; padding-right: 10px; float: left'>
                                                <i class='fa fa-exchange' style='font-size: 35px'></i>
                                            </div>
                                            <div style='padding-left: 10px; float: right'>
                                                <a href = '/sw2click/modulos/migraciones/administracion' style = 'color: #00F; letter-spacing: 2px; font-weight: bolder'>MIGRACIONES</a> <br>
                                                Registrados: <b>{contMigracionesReg}</b><br>
                                                Listos para OT: <b>{contMigracionesOT}</b>
                                            </div>
                                        </td>
                                        <td class='tdTablaAlertas'>
                                            <div style='border-right: 1px solid #000; padding-right: 10px; float: left'>
                                                <i class='fa fa-reply' style='font-size: 35px'></i>
                                            </div>
                                            <div style='padding-left: 10px; float: right'>
                                                <a href = '/swInventario/modulos/recurso/entregaRecursos?fechaOrden=2021-02-22&fechaOrden_1=$fechaHoy&estadoOT=Solucionada&tipoOT=Cambio%20de%20Equipo' style = 'color: #00F; letter-spacing: 2px; font-weight: bolder'>DEVOLUCION<br>DE EQUIPOS</a> <br>
                                                OTs de Devolucion: <b>{contOTcambioequipo}</b><br>
                                                Devoluciones: <b>{contDevoluciones}</b><br>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class='tdTablaAlertas'>
                                            <div style='border-right: 1px solid #000; padding-right: 10px; float: left'>
                                                <i class='fa fa-legal' style='font-size: 35px'></i>
                                            </div>
                                            <div style='padding-left: 10px; float: right'>
                                                <a href = '#' style = 'color: #00F; letter-spacing: 2px; font-weight: bolder'>CONTRATOS<br>SIN LEGALIZAR</a> <br>
                                                <u>2020:</u> <b>{contSinLegalizar2020}</b><br>
                                                <u>2021:</u> <b>{contSinLegalizar2021}</b><br>
                                            </div>
                                        </td>
                                        <td class='tdTablaAlertas'>
                                            <div style='border-right: 1px solid #000; padding-right: 10px; float: left'>
                                                <i class='fa fa-dollar' style='font-size: 35px'></i>
                                            </div>
                                            <div style='padding-left: 10px; float: right'>
                                                <a href = '#' style = 'color: #00F; letter-spacing: 2px; font-weight: bolder'>VENTAS MENSUALES</a> <br>
                                                Registradas: <b>{contVentasReg}</b><br>
                                            </div>
                                        </td>
                                        <td class='tdTablaAlertas'>
                                            <div style='border-right: 1px solid #000; padding-right: 10px; float: left'>
                                                <i class='fa fa-battery-quarter' style='font-size: 35px'></i>
                                            </div>
                                            <div style='padding-left: 10px; float: right'>
                                                <a href = '/sw2click/modulos/tipificacionfallas/administracion' style = 'color: #00F; letter-spacing: 2px; font-weight: bolder' title='IR A TIPIFICACION DE FALLAS'>TIPIFICACION<br>DE<br>FALLAS</a>
                                            </div>
                                        </td>
                                        <td>
                                        </td>
                                        <td>
                                        </td>
                                        <td>
                                        </td>
                                    </tr>
                                </table>
                            </div>";
        }
    } else {
        $scriptAlertas = "";
    }
}

function activacionD($privilegio = 0) {
    global $activacionD;
    global $desactivacionD;
    $activacionD = '';
    $desactivacionD = '';
    if ($privilegio == 1) {
        $activacionD = '<div style="clear: left;
                     float: right;
                     text-align: center;
                     margin-right: 3%;
                     border: 1px solid rgba(255, 255, 0, 0.3);
                     width: 9%;
                     border-radius: 6px;
                     background: rgba(255, 255, 255, 0.2)">
    <a href="#" style="font-size: 0.8em; color: #FF0; text-decoration: none" onclick="setActivacionD()">Activacion DIAN</a>
</div>';
        $desactivacionD = '<a href = "#" style = "font-size: 0.7em; color: rgba(255, 255, 0, 0.4); text-decoration: none" onclick = "setDesactivacionD()">*</a>';
    }
}

?>