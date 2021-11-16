<?php

// *****************  MODULO CONTRATOS  *****************

$diccionario = array(
    'subtitulo' => array(
        vINSTALACIONES => 'Instalaciones',
        vENCUESTAS => 'encuestas',
        vINCIDENTES => 'Incidentes',
        vVISITASTECNICAS => 'Visitas Tecnicas',
        vESTADISTICAS => 'Estadisticas',
        'formulario' => 'Administracion',
    ),
    'form_actions' => array()
);

function render_dinamico_datos($html, $data) {
    foreach ($data as $clave => $valor) {
        $html = str_replace('{' . $clave . '}', $valor, $html);
    }
    return $html;
}

function getPlantilla($form = 'obtener') {
    $archivo = '../../' . PUBLICO . $form . '.html';
    $template = file_get_contents($archivo);
    return $template;
}

function verVista($vista, $datos = array()) {
    global $diccionario;
    global $tablainstalaciones;
    global $tablaincidentes;
    global $tablavisitastecnicas;
    global $tablaclientes;
    global $tablaEncuestas;
    global $tablaRespuestas;

    $html = getPlantilla('plantilla');

    $html = str_replace('{titulo}', 'CUIDADO AL CLIENTE', $html);
    $html = str_replace('{subtitulo}', $diccionario['subtitulo'][$vista], $html);
    $html = str_replace('{contenido}', getPlantilla($vista), $html);

    $html = str_replace('{nombreUsuario}', $_SESSION['NOMBRES_APELLIDO_USUARIO'], $html);
    $html = str_replace('{cargoEmpleado}', $_SESSION['CARGO_USUARIO'], $html);
    $html = str_replace('{tablainstalaciones}', $tablainstalaciones, $html);
    $html = str_replace('{tablaincidentes}', $tablaincidentes, $html);
    $html = str_replace('{tablavisitastecnicas}', $tablavisitastecnicas, $html);
    $html = str_replace('{tablaclientes}', $tablaclientes, $html);
    $html = str_replace('{tablaEncuestas}', $tablaEncuestas, $html);
    $html = str_replace('{tablaRespuestas}', $tablaRespuestas, $html);
    $html = str_replace('{mensaje}', $datos['mensaje'], $html);

    $html = render_dinamico_datos($html, $datos);
    $html = render_dinamico_datos($html, $diccionario['form_actions']);

    print $html;
}

function verVistaAjax($vista = '', $datos = array()) {
    return render_dinamico_datos(getPlantilla($vista), $datos);
}

function setTablaInstalaciones($registros = array()) {
    global $tablainstalaciones;
    foreach ($registros as $registro) {
        $tablainstalaciones .= '<tr>';
        $tablainstalaciones .= '<td>' . $registro['idOT'] . '</td>';
        $tablainstalaciones .= '<td>';
        $tablainstalaciones .= '<a href="javascript:verEncuestaInstalacion(' . $registro['idOT'] . ', \'{fechaBusq}\')" title="REGISTRAR ENCUESTA"><i class="fa fa-calendar-check-o"></i></a>';
        $tablainstalaciones .= '</td>';
        $tablainstalaciones .= '<td>' . $registro['ubicacion'] . '</td>';
        $tablainstalaciones .= '<td>' . $registro['cliente'] . '</td>';
        $tablainstalaciones .= '<td>' . $registro['telefonos'] . '</td>';
        $tablainstalaciones .= '<td>' . $registro['identificacion'] . '</td>';
        $tablainstalaciones .= '<td>' . $registro['servicio'] . '</td>';
        $tablainstalaciones .= '<td>' . $registro['fechaVenta'] . '</td>';
        $tablainstalaciones .= '<td>' . $registro['fechaRegInstall'] . '</td>';
        $tablainstalaciones .= '<td>' . $registro['fechaRegOT'] . '</td>';
        $tablainstalaciones .= '</tr>';
    }
}

function setTablaIncidentes($registros = array()) {
    global $tablaincidentes;
    foreach ($registros as $registro) {
        $tablaincidentes .= '<tr>';
        $tablaincidentes .= '<td>' . $registro['idIncidente'] . '</td>';
        $tablaincidentes .= '<td>';
        $tablaincidentes .= '<a href="javascript:verEncuestaIncidente(' . $registro['idIncidente'] . ', \'{fechaBusq}\', \'{solucionadoBusq}\')" title="REGISTRAR ENCUESTA"><i class="fa fa-calendar-check-o"></i></a>';
        $tablaincidentes .= '</td>';
        $tablaincidentes .= '<td>' . $registro['ubicacion'] . '</td>';
        $tablaincidentes .= '<td>' . $registro['cliente'] . '</td>';
        $tablaincidentes .= '<td>' . $registro['telefonos'] . '</td>';
        $tablaincidentes .= '<td>' . $registro['identificacion'] . '</td>';
        $tablaincidentes .= '<td>' . $registro['servicio'] . '</td>';
        $tablaincidentes .= '<td>' . $registro['tipoincidente'] . '</td>';
        $tablaincidentes .= '<td>' . $registro['estadoincidente'] . '</td>';
        $tablaincidentes .= '<td>' . $registro['fecharegincidente'] . '</td>';
        $tablaincidentes .= '</tr>';
    }
}

function setTablaVisitastecnicas($registros = array()) {
    global $tablavisitastecnicas;
    foreach ($registros as $registro) {
        if ($registro['idResidencial'] != 1062 && $registro['idCorporativo'] != 419) {
            $tablavisitastecnicas .= '<tr>';
            $tablavisitastecnicas .= '<td>' . $registro['idOT'] . '</td>';
            $tablavisitastecnicas .= '<td>';
            $tablavisitastecnicas .= '<a href="javascript:verEncuestaVisitatecnica(' . $registro['idOT'] . ', \'{fechaBusq}\')" title="REGISTRAR ENCUESTA"><i class="fa fa-calendar-check-o"></i></a>';
            $tablavisitastecnicas .= '</td>';
            $tablavisitastecnicas .= '<td>' . $registro['destino'] . '</td>';
            $tablavisitastecnicas .= '<td>' . $registro['cliente'] . '</td>';
            $tablavisitastecnicas .= '<td>' . $registro['telefonos'] . '</td>';
            $tablavisitastecnicas .= '<td>' . $registro['identificacion'] . '</td>';
            $tablavisitastecnicas .= '<td>' . $registro['motivo'] . '</td>';
            $tablavisitastecnicas .= '<td>' . $registro['fechaRegOT'] . '</td>';
            $tablavisitastecnicas .= '</tr>';
        }
    }
}

function setTablaClientes($registros = array()) {
    global $tablaclientes;
    foreach ($registros as $registro) {
        $tablaclientes .= '<tr>';
        $tablaclientes .= '<td>' . $registro['idCliente'] . '</td>';
        if (intval($registro['llamado']) == 1) {
            $tablaclientes .= '<td><i class="fa fa-thumbs-o-up"></i></td>';
        } else {
            $tablaclientes .= '<td id="td_' . $registro['idCliente'] . '"><a href="javascript:marcarllamado(' . $registro['idCliente'] . ')" title="MARCAR COMO YA LLAMADO"><i class="fa fa-check"></i></a></td>';
        }
        $tablaclientes .= '<td>' . $registro['nombreDpto'] . '</td>';
        $tablaclientes .= '<td>' . $registro['nombreMcpo'] . '</td>';
        $tablaclientes .= '<td>' . $registro['cliente'] . '</td>';
        $tablaclientes .= '<td>' . $registro['identificacion'] . '</td>';
        $tablaclientes .= '<td>' . $registro['celular1'] . '</td>';
        $tablaclientes .= '<td>' . $registro['celular2'] . '</td>';
        $tablaclientes .= '<td>' . $registro['celular3'] . '</td>';
        $tablaclientes .= '<td>' . $registro['telefono'] . '</td>';
        $tablaclientes .= '<td>' . date('Y-m-') . $registro['diaCorte'] . '</td>';
        $tablaclientes .= '</tr>';
    }
}

function setTablaEncuestas($datos = array()) {
    global $tablaEncuestas;
    global $titulo;

    foreach ($datos as $registro) {
        $tablaEncuestas .= '<tr>';
        $tablaEncuestas .= '<td>' . $registro['idFormulario'] . '</td>';
        $tablaEncuestas .= '<td>';


        $tablaEncuestas .= '<a href="javascript:verDetalle(' . $registro['idFormulario'] . ')" title="VER DETALLE DE ESTA ENCUESTA"><i class="fa fa-eye"></i></a>';



        $tablaEncuestas .= '</td>';
        $tablaEncuestas .= '<td>' . $registro['idOT'] . '</td>';
        $tablaEncuestas .= '<td>' . $registro['idIncidente'] . '</td>';
        $tablaEncuestas .= '<td>' . $registro['asesorventa'] . '</td>';
        $tablaEncuestas .= '<td>' . $registro['email'] . '</td>';
        $tablaEncuestas .= '<td>' . $registro['observacionventa'] . '</td>';
        $tablaEncuestas .= '<td>' . $registro['observacionincidente'] . '</td>';
        $tablaEncuestas .= '<td>' . $registro['registradopor'] . '</td>';
        $tablaEncuestas .= '<td>' . $registro['fechahorareg'] . '</td>';
        $tablaEncuestas .= '</tr>';
    }
}

$titulo = 'LISTADO DE ENCUESTAS';

function setTablaRespuestas($datos = array()) {
    $tablaRespuestas = '';
    foreach ($datos as $registro){
    $tablaRespuestas .= '<tr>';
    $tablaRespuestas .= '<td>' . $registro['idFormulario'] . '</td>';
    $tablaRespuestas .= '<td>' . $registro['idPregunta'] . '</td>';
    $tablaRespuestas .= '<td>' . $registro['respuesta'] . '</td>';
    $tablaRespuestas .= '</tr>';
    }
    return $tablaRespuestas;
}

?>