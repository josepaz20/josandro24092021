<?php

// ********************** MODULO AMPLICION DE RED **********************
//require_once('../permisos/modelo.php');

$diccionario = array(
    'subtitulo' => array(
        vINDEX => 'Listado de Corporativos',
    ),
    'form_actions' => array()
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

function setTablaCorporativos($datos = array()) {
    global $tablaAmpliciones;
    global $titulo;
    $permisoEliminar = array(1,);
    $permisoActualizar = array(1,);
    foreach ($datos as $registro) {
        $tablaAmpliciones .= '<tr>';
        $tablaAmpliciones .= '<td>' . $registro['idCorporativo'] . '</td>';
        $tablaAmpliciones .= '<td>';

        if ($registro['estado'] == 'eliminado') {
            $tablaAmpliciones .= '<a href="javascript:verDetalle(' . $registro['idCorporativo'] . ')" title="VER DETALLE DE ESTE CORPORATIVO"><i class="fa fa-eye"></i></a>';
        } else if ($registro['estado'] == 'en_sistema'){
            $tablaAmpliciones .= '<a href="javascript:verDetalle(' . $registro['idCorporativo'] . ')" title="VER DETALLE DE ESTE CORPORATIVO"><i class="fa fa-eye"></i></a>';
            $tablaAmpliciones .= '&nbsp;&nbsp;<a href="javascript:verActualizar(' . $registro['idCorporativo'] . ')" title="VER ACTUALIZAR DE ESTE CORPORATIVO"><i class="fa fa-edit"></i></a>';
            $tablaAmpliciones .= '&nbsp;&nbsp;<a href="javascript:verEliminar(' . $registro['idCorporativo'] . ')" title="VER ELIMINAR DE ESTOS CORPORATIVOS"><i class="fa fa-times"></i></a>';
        }
        $tablaAmpliciones .= '</td>';
        $tablaAmpliciones .= '<td>' . $registro['nit'] . '</td>';
        $tablaAmpliciones .= '<td>' . $registro['ubicacion'] . '</td>';
        $tablaAmpliciones .= '<td>' . $registro['razonSocial'] . '</td>';
        $tablaAmpliciones .= '<td>' . $registro['celular1'] . '</td>';
        $tablaAmpliciones .= '<td>' . $registro['email1'] . '</td>';
        $tablaAmpliciones .= '</tr>';
    }
    $titulo = 'LISTADO DE COORPORATIVOS';
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
            $lista .= '<option value="' . $registro ['idMcpo'] . '" selected>' . $registro['nombreMcpo'] . '</option>';
        } else {
            $lista .= '<option value="' . $registro['idMcpo'] . '">' . $registro['nombreMcpo'] . '</option>';
        }
    }
    return $lista;
}

function setListaReferenciados($datos = array(), $referenciado = 0) {
    $lista = '<option value="">Seleccione...</option>';
    foreach ($datos as $registro) {
        if ($referenciado == $registro['id']) {
            $lista .= '<option value="' . $registro['id'] . '" selected>' . $registro['valor'] . '</option>';
        } else {
            $lista .= '<option value="' . $registro['id'] . '">' . $registro['valor'] . '</option>';
        }
    }
    return $lista;
}

?>
