<?php

// ********************** MODULO REPORTES **********************

$diccionario = array(
    'subtitulo' => array(
        vLLAMADAS => 'Reporte de Llamadas',
        vCORPORATIVOS => 'Reporte de Corporativos',
        vRESIDENCIAL => 'Reporte de Residenciales',
        vORDENES => 'Reporte de Ordenes de Trabajo',
        vFACTURAS => 'Reporte de Facturacion',
        vRECAUDOS => 'Reporte de Recaudos',
        vGENERAR_REPORTE => 'Generar Reporte',
        vCOMERCIAL => 'Generar Reporte',
    ),
    'form_actions' => array(
//        'INSERTAR' => '/sw2click/' . MODULO . INSERTAR,
//        'EDITAR' => '/sw2click/' . MODULO . EDITAR,
    )
);

function render_dinamico_datos($html = '', $data = '') {
    foreach ($data as $clave => $valor) {
        $html = str_replace('{' . $clave . '}', $valor, $html);
    }
    return $html;
}

function getPlantilla($form = '') {
    $archivo = '../../' . PUBLICO . $form . '.html';
    $template = file_get_contents($archivo);
    return $template;
}

function verVista($vista = '', $datos = array()) {
    global $diccionario;
    global $tablaLlamadas;
    global $tablaOrdenes;
    global $tablaFacturas;
    global $tablaRecaudos;

    $html = getPlantilla('plantilla');

    $html = str_replace('{titulo}', "REPORTES", $html);
    $html = str_replace('{subtitulo}', $diccionario['subtitulo'][$vista], $html);
    $html = str_replace('{nombreUsuario}', $_SESSION['NOMBRES_APELLIDO_USUARIO'], $html);
    $html = str_replace('{cargoEmpleado}', $_SESSION['CARGO_USUARIO'], $html);
    $html = str_replace('{contenido}', getPlantilla($vista), $html);
    $html = str_replace('{tablaLlamadas}', $tablaLlamadas, $html);
    $html = str_replace('{tablaOrdenes}', $tablaOrdenes, $html);
    $html = str_replace('{tablaFacturas}', $tablaFacturas, $html);
    $html = str_replace('{tablaRecaudos}', $tablaRecaudos, $html);
    $html = render_dinamico_datos($html, $datos);
    $html = render_dinamico_datos($html, $diccionario['form_actions']);

    print $html;
}

function setTablaLlamadas($datos = array(array())) {
    global $tablaLlamadas;
    $idLlamada = 0;
    $idHistorial = 0;
    $fechaCierre = '';
    foreach ($datos as $registro) {
        $tablaLlamadas .= '<tr>';
        foreach ($registro as $campo => $valor) {
            if ($campo != 'idHistorial' && $campo != 'idCorporativo' && $campo != 'idResidencial' && $campo != 'fechaSolucion' && $campo != 'fechaCierre')
                $tablaLlamadas .= '<td>' . $valor . '</td>';
            switch ($campo) {
                case 'idLlamada':
                    $idLlamada = $valor;
                    break;
                case 'idHistorial':
                    $idHistorial = $valor;
                    break;
                case 'fechaCierre':
                    $fechaCierre = $valor;
                    break;
                case 'fechaSolucion':
                    if ($fechaCierre != NULL) {
                        $tablaLlamadas .= '<td>' . $fechaCierre . '</td>';
                    } elseif ($valor != '') {
                        $tablaLlamadas .= '<td>' . $valor . '</td>';
                    } else {
                        $tablaLlamadas .= '<td>0000-00-00 00:00:00</td>';
                    }
                    break;
            }
        }
        if ($_SESSION['PRIVILEGIO_USUARIO'] == 1 || $_SESSION['ID_USUARIO'] == 183 || $_SESSION['ID_USUARIO'] == 131 || $_SESSION['ID_USUARIO'] == 243 || $_SESSION['ID_USUARIO'] == 121 || $_SESSION['ID_USUARIO'] == 307 || $_SESSION['ID_USUARIO'] == 209 || $_SESSION['ID_USUARIO'] == 219 || $_SESSION['ID_USUARIO'] == 212 || $_SESSION['ID_USUARIO'] == 218 || $_SESSION['ID_USUARIO'] == 373 || $_SESSION['ID_USUARIO'] == 372 || $_SESSION['ID_USUARIO'] == 426 || $_SESSION['ID_USUARIO'] == 553 || $_SESSION['ID_USUARIO'] == 531 || $_SESSION['ID_USUARIO'] == 526 || $_SESSION['ID_USUARIO'] == 589 || $_SESSION['ID_USUARIO'] == 711 || $_SESSION['ID_USUARIO'] == 685) {
            $tablaLlamadas .= '<td class="icono">
                            <a href="/crm/modulos/mensaje/administracion?idHistorial=' . $idHistorial . '&idLlamada=' . $idLlamada . '&tipoMensaje=0" target="_blank">
                                <img src="/sw2click/public/img/lupa.png" title="Ver toda la informacion de esta Llamada">
                            </a>
                           </td>';
        } else {
            $tablaLlamadas .= '<td class="icono"> -- </td>';
        }

        $tablaLlamadas .= '</tr>';
    }
}

function setTablaOrdenes($datos = array(array())) {
    global $tablaOrdenes;
    $idAsignada = 0;
    foreach ($datos as $registro) {
        $tablaOrdenes .= '<tr>';
        foreach ($registro as $campo => $valor) {
            $tablaOrdenes .= '<td>' . $valor . '</td>';
            switch ($campo) {
                case 'idAsignada':
                    $idAsignada = $valor;
                    break;
            }
        }
        if ($_SESSION['PRIVILEGIO_USUARIO'] == 1 || $_SESSION['ID_USUARIO'] == 183 || $_SESSION['ID_USUARIO'] == 131 || $_SESSION['ID_USUARIO'] == 243 || $_SESSION['ID_USUARIO'] == 121 || $_SESSION['ID_USUARIO'] == 307 || $_SESSION['ID_USUARIO'] == 426 || $_SESSION['ID_USUARIO'] == 553 || $_SESSION['ID_USUARIO'] == 531 || $_SESSION['ID_USUARIO'] == 526 || $_SESSION['ID_USUARIO'] == 589 || $_SESSION['ID_USUARIO'] == 711 || $_SESSION['ID_USUARIO'] == 685) {
            $tablaOrdenes .= '<td class="icono">
                            <a href="/crm/modulos/asignacion/verOpciones?orden=Generales&idAsignacion=' . $idAsignada . '" target="_blank">
                                <img src="/sw2click/public/img/lupa.png" title="Ver toda la informacion de esta Orden de Trabajo">
                            </a>
                           </td>';
        } else {
            $tablaOrdenes .= '<td class="icono"> -- </td>';
        }

        $tablaOrdenes .= '</tr>';
    }
}

function setTablaFacturas($datos = array(array())) {
    global $tablaFacturas;
    foreach ($datos as $registro) {
        if (array_key_exists('idCorporativo', $datos)) {
            if ($_SESSION['PRIVILEGIO_USUARIO'] != 1 && ($registro['idCorporativo'] == 490 || $registro['idCorporativo'] == 553 || $registro['idCorporativo'] == 334 || $registro['idCorporativo'] == 266)) {
                return;
            }
        }
        $tablaFacturas .= '<tr>';
        $tablaFacturas .= '<td>' . $registro['idFactura'] . '</td>';
        $tablaFacturas .= '<td>' . $registro['codigo'] . '</td>';
        $tablaFacturas .= '<td>' . $registro['razonSocial'] . '</td>';
        $tablaFacturas .= '<td>' . $registro['nombreMcpo'] . '</td>';
        $tablaFacturas .= '<td>' . number_format($registro['totalFactura']) . '</td>';
        $tablaFacturas .= '<td>' . number_format($registro['baseImponible']) . '</td>';
        $tablaFacturas .= '<td>' . number_format($registro['deuda']) . '</td>';
        $tablaFacturas .= '<td>' . number_format($registro['abono']) . '</td>';
        $tablaFacturas .= '<td>' . number_format($registro['saldoAbonos']) . '</td>';
        $tablaFacturas .= '<td>' . $registro['periodoFacturado'] . '</td>';
        $tablaFacturas .= '<td>' . $registro['anioFacturado'] . '</td>';
        $tablaFacturas .= '<td>' . $registro['estado'] . '</td>';

        if ($registro['tipoCliente'] == 'Corporativo') {
            $tipoCliente = 1;
        } else {
            $tipoCliente = 2;
        }

//        foreach ($registro as $campo => $valor) {
//            if ($campo != 'idFactura' && $campo != 'totalFactura' && $campo != 'baseImponible' && $campo != 'deuda' && $campo != 'abono' && $campo != 'saldoAbonos' && $campo != 'tipoCliente' && $campo != 'enviada') {
//                $tablaFacturas .= '<td>' . $valor . '</td>';
//            }
//            switch ($campo) {
//                case 'idFactura':
//                    $idFactura = $valor;
//                    $revisar = buscarFactura($idFactura);
//                    if ($revisar != 'NO') {
//                        $revision = explode(';', $revisar);
//                        if ($revision[0] == 0) {
//                            $color = "rgb(180, 255, 180)";
//                        } else {
//                            $color = "rgb(255, 180, 180)";
//                        }
//                        $title = "CONTIENE: \n$revision[1]";
//                        if ($revision[1] == '0') {
//                            $title = "ANULAR";
//                        }
//                        $tablaFacturas .= "<td style='background-color: $color' title='$title'>" . $idFactura . "</td>";
//                    } else {
//                        $tablaFacturas .= '<td>' . $idFactura . '</td>';
//                    }
//                    break;
//                case 'totalFactura':
//                    $tablaFacturas .= '<td>' . number_format($valor, 0, '.', ',') . '</td>';
//                    break;
//                case 'baseImponible':
//                    $tablaFacturas .= '<td>' . number_format($valor, 0, '.', ',') . '</td>';
//                    break;
//                case 'deuda':
//                    $tablaFacturas .= '<td>' . number_format($valor, 0, '.', ',') . '</td>';
//                    break;
//                case 'abono':
//                    $tablaFacturas .= '<td>' . number_format($valor, 0, '.', ',') . '</td>';
//                    break;
//                case 'saldoAbonos':
//                    $tablaFacturas .= '<td>' . number_format($valor, 0, '.', ',') . '</td>';
//                    break;
//                case 'enviada':
//                    $enviada = $valor;
//                    break;
//                case 'tipoCliente':
//                    if ($valor == 'Corporativo') {
//                        $tipoCliente = 1;
//                    } else {
//                        $tipoCliente = 2;
//                    }
//                    break;
//            }
//        }
//        $style = '';
//        if ($enviada != 0) {
//            $style = "style='background: rgb(150, 250, 150)'";
//        }
        $style = '';
        $tablaFacturas .= '<td class="icono" ' . $style . '>
                            <a href="#" onclick="dlgImprimirFactura(' . $registro['idFactura'] . ', ' . $tipoCliente . ')">
                                <img src="/sw2click/public/img/imprimir.png" title="Imprimir esta Factura">
                            </a>
                           </td>';

        $tablaFacturas .= '</tr>';
    }
}

function setTablaRecaudos($datos = array(array())) {
    global $tablaRecaudos;
    foreach ($datos as $registro) {
        if (array_key_exists('idCorporativo', $datos)) {
            if ($_SESSION['PRIVILEGIO_USUARIO'] != 1 && ($registro['idCorporativo'] == 490 || $registro['idCorporativo'] == 553 || $registro['idCorporativo'] == 334 || $registro['idCorporativo'] == 266 || $_SESSION['ID_USUARIO'] == 121)) {
                return;
            }
        }
        $tablaRecaudos .= '<tr>';
        $tablaRecaudos .= '<td>' . $registro['idRecaudo'] . '</td>';
        $tablaRecaudos .= '<td>' . $registro['cliente'] . '</td>';
        $tablaRecaudos .= '<td>' . $registro['empleado'] . '</td>';
        $tablaRecaudos .= '<td>' . $registro['periodo'] . '</td>';
        $tablaRecaudos .= '<td>' . $registro['fechaHoraRecaudo'] . '</td>';
        $tablaRecaudos .= '<td>' . $registro['concepto'] . '</td>';
        $tablaRecaudos .= '<td>' . number_format($registro['valorRecaudo']) . '</td>';
        $tablaRecaudos .= '<td>' . $registro['tipoRecaudo'] . '</td>';
//        foreach ($registro as $campo => $valor) {
//            if ($campo != 'valorRecaudo') {
//                $tablaRecaudos .= '<td>' . $valor . '</td>';
//            }
//            switch ($campo) {
//                case 'idRecaudo':
//                    $idRecaudo = $valor;
//                    break;
//                    break;
//                case 'valorRecaudo':
//                    $tablaRecaudos .= '<td>' . number_format($valor, 0, '.', ',') . '</td>';
//                    break;
//            }
//        }
        if ($_SESSION['PRIVILEGIO_USUARIO'] == 1 || $_SESSION['ID_USUARIO'] == 159 || $_SESSION['ID_USUARIO'] == 168 || $_SESSION['ID_USUARIO'] == 121 || $_SESSION['ID_USUARIO'] == 526 || $_SESSION['ID_USUARIO'] == 427) {
            $tablaRecaudos .= '<td class="icono">
                                <a href="verRespaldo?idRecaudo=' . $registro['idRecaudo'] . '" target="_blank">
                                    <img src="/sw2click/public/img/lupa.png" title="Ver toda la informacion de este Recaudo">
                                </a>
                               </td>';
        } else {
            $tablaRecaudos .= '<td class="icono"> -- </td>';
        }

        $tablaRecaudos .= '</tr>';
    }
}

?>