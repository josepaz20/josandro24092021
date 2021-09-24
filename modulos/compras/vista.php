<?php

// *****************  MODULO PROMOCIONES  *****************

$diccionario = array(
    'subtitulo' => array(
        vADMINISTRACION => 'Administracion',
        'formulario' => 'Administracion',
    ),
    'form_actions' => array()
);

$permisoConfirmar = array(1, 2, 121, 671, 682, 717);
$permisoRegistrar = array(1, 455);
//$permisoRegistrar = array(1, 2, 121, 409, 415, 416, 431, 455, 479, 525, 528, 531, 589, 593, 601, 613, 659, 660, 682, 686, 711, 717, 718, 719, 747, 769, 771);
$permisoRechazar = array(1, 2, 121, 671, 682, 717);

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
    global $tablaCompras;

    $html = getPlantilla('plantilla');

    $html = str_replace('{titulo}', 'GESTION DE COMPRAS', $html);
    $html = str_replace('{subtitulo}', $diccionario['subtitulo'][$vista], $html);
    $html = str_replace('{contenido}', getPlantilla($vista), $html);

    $html = str_replace('{nombreUsuario}', $_SESSION['NOMBRES_APELLIDO_USUARIO'], $html);
    $html = str_replace('{cargoEmpleado}', $_SESSION['CARGO_USUARIO'], $html);
    $html = str_replace('{tablacompras}', $tablaCompras, $html);

    $html = render_dinamico_datos($html, $datos);
    $html = render_dinamico_datos($html, $diccionario['form_actions']);

    print $html;
}

//-------------------------------------------------------------------------------------------------------

function verVistaAjax($vista = '', $datos = array()) {
    return render_dinamico_datos(getPlantilla($vista), $datos);
}

//-------------------------------------------------------------------------------------------------------

function setTablaCompras($datos = array()) {
    global $tablaCompras;
    foreach ($datos as $registro) {
        $contItems = intval($registro['contItems']);
        $contAprobaciones = intval($registro['contAprobaciones']);
        $contCotizaciones = intval($registro['contCotizaciones']);
        $tablaCompras .= '<tr>';
        $tablaCompras .= '<td>' . $registro['idCompra'] . '</td>';
        $tablaCompras .= '<td>';
        $tablaCompras .= '<a href="javascript:verDetallecompra(' . $registro['idCompra'] . ')" title="VER DETALLE DE ESTA COMPRA"><i class="fa fa-eye"></i></a>';
        $tablaCompras .= '&nbsp;&nbsp;<a href="javascript:verGestionitems(' . $registro['idCompra'] . ')" title="GESTIONAR ITEMS DE ESTA COMPRA"><i class="fa fa-list"></i></a>';
        if ($contItems == 0) {
            $tablaCompras .= '&nbsp;&nbsp;<a href="javascript:verGestionaraprobaciones(' . $registro['idCompra'] . ')" title="GESTIONAR VISTOS BUENOS DE ESTA COMPRA"><i class="fa fa-thumbs-up"></i></a>';
        }
        if ($contItems == 0 && $contAprobaciones > 0) {
            $tablaCompras .= '&nbsp;&nbsp;<a href="javascript:verGestionCotizaciones(' . $registro['idCompra'] . ')" title="GESTIONAR COTIZACIONES DE ESTA COMPRA"><i class="fa fa-list-alt"></i></a>';
        }
        if ($contItems == 0 && $contAprobaciones > 0 && $contCotizaciones > 0) {
            $tablaCompras .= '&nbsp;&nbsp;<a href="javascript:verPagarCompra(' . $registro['idCompra'] . ')" title="REGISTRAR PAGO DE ESTA COMPRA"><i class="fa fa-dollar"></i></a>';
        }
        $tablaCompras .= '</td>';
        $tablaCompras .= '<td>' . $registro['estado'] . '</td>';
        $tablaCompras .= '<td>' . $registro['registradopor'] . '</td>';
        $tablaCompras .= '<td>' . $registro['fechahorareg'] . '</td>';
        $tablaCompras .= '<td>' . $contItems . '</td>';
        $tablaCompras .= '<td>' . $contAprobaciones . '</td>';
        $tablaCompras .= '<td>' . $contCotizaciones . '</td>';
        $tablaCompras .= '</tr>';
    }
}

//-------------------------------------------------------------------------------------------------------

function listaTipoitems($registros = array()) {
    $lista = '<option>Seleccione...</option>';
    foreach ($registros as $registro) {
        $lista .= '<option value="' . $registro['idTipoItem'] . '">' . $registro['item'] . '</option>';
    }
    return $lista;
}

//-------------------------------------------------------------------------------------------------------

function listaProveedores($registros = array()) {
    $lista = '<option>Seleccione...</option>';
    foreach ($registros as $registro) {
        $lista .= '<option value="' . $registro['idProveedor'] . '">' . $registro['proveedor'] . '</option>';
    }
    return $lista;
}

//-------------------------------------------------------------------------------------------------------

function getTablaItems($datos = array()) {
    $tabla = '';
    foreach ($datos as $registro) {
        $tabla .= '<tr>';
        $tabla .= '<td>' . $registro['idItem'] . '</td>';
        $tabla .= '<td>';
        if ($registro['estado'] == 'Registrado') {
            $tabla .= '<a href="javascript:verAprobarItem(' . $registro['idItem'] . ')" title="APROBAR ESTE ITEM"><i class="fa fa-check"></i></a>';
            $tabla .= '&nbsp;&nbsp;<a href="javascript:verRechazarItem(' . $registro['idItem'] . ')" title="RECHAZAR ESTE ITEM"><i class="fa fa-times"></i></a>';
        }
        $tabla .= '</td>';
        $tabla .= '<td>' . $registro['estado'] . '</td>';
        $tabla .= '<td>' . $registro['fechalimite'] . '</td>';
        $tabla .= '<td>' . $registro['item'] . '</td>';
        $tabla .= '<td>' . $registro['descripcion'] . '</td>';
        $tabla .= '<td>' . $registro['cantidad'] . '</td>';
        $tabla .= '<td>' . number_format($registro['vlrunitario']) . '</td>';
        $tabla .= '<td>' . $registro['justificacion'] . '</td>';
        $tabla .= '</tr>';
    }
    return $tabla;
}

//-------------------------------------------------------------------------------------------------------

function getTablaAprobaciones($datos = array()) {
    $tabla = '';
    foreach ($datos as $registro) {
        $tabla .= '<tr>';
        $tabla .= '<td>' . $registro['idAprobacion'] . '</td>';
        $tabla .= '<td>' . $registro['aprobadopor'] . '</td>';
        $tabla .= '<td>' . $registro['fechaaprobado'] . '</td>';
        $tabla .= '</tr>';
    }
    return $tabla;
}

//-------------------------------------------------------------------------------------------------------

function getTablaCotizaciones($datos = array()) {
    $tabla = '';
    foreach ($datos as $registro) {
        $tabla .= '<tr>';
        $tabla .= '<td>' . $registro['idCotizacion'] . '</td>';
        $tabla .= '<td>' . $registro['proveedor'] . '</td>';
        $tabla .= '<td>' . number_format($registro['valor']) . '</td>';
        $tabla .= '<td>' . $registro['fechacotizacion'] . '</td>';
        $tabla .= '<td>' . $registro['registradopor'] . '</td>';
        $tabla .= '<td>' . $registro['fechahorareg'] . '</td>';
        $tabla .= '</tr>';
    }
    return $tabla;
}

//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------
?>
