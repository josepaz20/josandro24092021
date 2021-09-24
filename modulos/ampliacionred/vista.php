<?php

// ********************** MODULO AMPLICION DE RED **********************
//require_once('../permisos/modelo.php');

$diccionario = array(
    'subtitulo' => array(
        vINDEX => 'Listado de Ampliaciones',
    ),
    'form_actions' => array(
    )
);

function render_dinamico_datos($html, $data) {
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
    global $titulo;
    global $tablaAmpliciones;

    $html = getPlantilla('plantilla');

    $html = str_replace('{user_name}', $_SESSION['NOMBRES_APELLIDO_USUARIO'], $html);
    $html = str_replace('{user_charge}', $_SESSION['CARGO_USUARIO'], $html);
    $html = str_replace('{titulo}', $titulo, $html);
    $html = str_replace('{subtitulo}', $diccionario['subtitulo'][$vista], $html);
    $html = str_replace('{contenido}', getPlantilla($vista), $html);

    $html = str_replace('{tablaAmpliaciones}', $tablaAmpliciones, $html);

    $html = render_dinamico_datos($html, $diccionario['form_actions']);
    $html = render_dinamico_datos($html, $datos);

    print $html;
}

function verVistaAjax($vista = '', $datos = array()) {
    return render_dinamico_datos(getPlantilla($vista), $datos);
}

function setTablaAmpliaciones($datos = array()) {
    global $tablaAmpliciones;
    global $titulo;
    $permisoEliminar = array(1,);
    $permisoAprobar = array(1,);
    foreach ($datos as $registro) {
        $tablaAmpliciones .= '<tr>';
        $tablaAmpliciones .= '<td>' . $registro['idAmpliacion'] . '</td>';
        $tablaAmpliciones .= '<td>';
        $tablaAmpliciones .= '<a href="javascript:verDetalle(' . $registro['idAmpliacion'] . ')" title="VER DETALLE"><i class="fa fa-eye"></i></a>';
        $tablaAmpliciones .= '&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:verActualizar(' . $registro['idAmpliacion'] . ')" title="VER EDITAR"><i class="fa fa-edit"></i></a>';
        $tablaAmpliciones .= '&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:verAvance(' . $registro['idAmpliacion'] . ')" title="REGISTRAR AVANCE"><i class="fa fa-check"></i></a>';
        $tablaAmpliciones .= '&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:verViabilidad(' . $registro['idAmpliacion'] . ')" title="REGISTRAR VIABILIDAD"><i class="fa fa-area-chart "></i></a>';
        $tablaAmpliciones .= '</td>';
        $tablaAmpliciones .= '<td>' . strtoupper($registro['ubicacion']) . '</td>';
        $tablaAmpliciones .= '<td>' . strtoupper($registro['direccion']) . '</td>';
        $tablaAmpliciones .= '<td>' . $registro['contusuariosbenficio'] . '</td>';
        $tablaAmpliciones .= '<td>' . number_format($registro['beneficioeconomico']) . '</td>';
        $tablaAmpliciones .= '<td>' . $registro['estado'] . '</td>';
        $tablaAmpliciones .= '<td>' . $registro['registradopor'] . '</td>';
        $tablaAmpliciones .= '<td>' . $registro['fechahorareg'] . '</td>';
        $tablaAmpliciones .= '</tr>';
    }
    $titulo = 'AMPLIACIONES DE RED';
}

function setListaAvances($datos = array()) {
    $tablaAmpliciones = '';
    foreach ($datos as $registro) {
        $tablaAmpliciones .= '<tr>';
        $tablaAmpliciones .= '<td>' . $registro['idAvance'] . '</td>';
        $tablaAmpliciones .= '<td> <a href="javascript:verDetalle(' . $registro['idAvance'] . ')" title="VER DETALLE"><i class="fa fa-eye"></i></a> </td>';
        $tablaAmpliciones .= '<td>' . $registro['avance'] . '</td>';
        $tablaAmpliciones .= '<td>' . $registro['estado'] . '</td>';
        $tablaAmpliciones .= '<td>' . $registro['registradopor'] . '</td>';
        $tablaAmpliciones .= '<td>' . $registro['fechahorareg'] . '</td>';

        $tablaAmpliciones .= '</tr>';
    }
    return $tablaAmpliciones;
}



function setListaDepartamentos($datos = array(), $idDepartamento = 0) {
    $lista = '<option value="">Seleccione...</option>';
    foreach ($datos as $registro) {
        if ($idDepartamento == $registro['idDpto']) {
            $lista .= '<option value="' . $registro['idDpto'] . '" selected>' . $registro['nombreDpto'] . '</option>';
        } else {
            $lista .= '<option value="' . $registro['idDpto'] . '">' . $registro['nombreDpto'] . '</option>';
        }
    }
    return $lista;
}

function setListaMunicipios($datos = array(), $idMunicipio = 0) {
    $lista = '<option value="">Seleccione...</option>';
    foreach ($datos as $registro) {
        if ($idMunicipio == $registro['idMcpo']) {
            $lista .= '<option value="' . $registro['idMcpo'] . '" selected>' . $registro['nombreMcpo'] . '</option>';
        } else {
            $lista .= '<option value="' . $registro['idMcpo'] . '">' . $registro['nombreMcpo'] . '</option>';
        }
    }
    return $lista;
}

?>
