<?php

// ********************** MODULO RECURSO **********************
//require_once('../permisos/modelo.php');

$diccionario = array(
    'subtitulo' => array(
        vADMINISTRACION => 'Listado de Empleados',
        vGESTION => 'Listado de Recursos Asignados',
        vGESTION_MATERIALES => 'Listado de Materiales Asignados <br><b>EMPLEADO: <u>{empleadoBodega}</u></b>',
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

//    verificarPermisos($vista);

    global $diccionario;
    global $tablaBodegas;
    global $tablaRecursos;
    global $tablaMateriales;
    global $titulo;

    $html = getPlantilla('plantilla');

    $html = str_replace('{user_name}', $_SESSION['NOMBRES_APELLIDO_USUARIO'], $html);
    $html = str_replace('{user_charge}', $_SESSION['CARGO_USUARIO'], $html);
    $html = str_replace('{titulo}', $titulo, $html);
    $html = str_replace('{subtitulo}', $diccionario['subtitulo'][$vista], $html);
    $html = str_replace('{contenido}', getPlantilla($vista), $html);
    $html = str_replace('{tablaBodegas}', $tablaBodegas, $html);
    $html = str_replace('{tablaRecursos}', $tablaRecursos, $html);
    $html = str_replace('{tablaMateriales}', $tablaMateriales, $html);

    $html = render_dinamico_datos($html, $diccionario['form_actions']);
    $html = render_dinamico_datos($html, $datos);

    print $html;
}

function verVistaAjax($vista = '', $datos = array()) {
    return render_dinamico_datos(getPlantilla($vista), $datos);
}

function setTablaBodegasEmpleados($datos = array()) {
    global $tablaBodegas;
    global $titulo;
    foreach ($datos as $registro) {
        $tablaBodegas .= '<tr>';
        $tablaBodegas .= '<td>' . $registro['idBodegaEmpleado'] . '</td>';
        $tablaBodegas .= '<td>';
        $tablaBodegas .= '<a href="gestion?idBodegaEmpleado=' . $registro['idBodegaEmpleado'] . '" target="_blank" title="IR A ESTA BODEGA DE RECURSOS"><i class="fa fa-briefcase"></i></a>';
        $tablaBodegas .= '&nbsp;&nbsp;-&nbsp;&nbsp;<a href="gestionMateriales?idBodegaEmpleado=' . $registro['idBodegaEmpleado'] . '" target="_blank" title="IR A ESTA BODEGA MATERIALES"><i class="fa fa-server"></i></a>';
        $tablaBodegas .= '</td>';
        $tablaBodegas .= '<td>' . strtoupper(trim($registro['empleado'])) . '</td>';
        $tablaBodegas .= '<td>' . $registro['estado'] . '</td>';
        $tablaBodegas .= '</tr>';
    }
    $titulo = 'BODEGAS EMPLEADOS';
}

function setTablaRecursosBodega($datos = array(), $admin = false) {
    global $tablaRecursos;
    global $titulo;
    foreach ($datos as $registro) {
        $tablaRecursos .= '<tr>';
        $tablaRecursos .= '<td>' . $registro['idRecurso'] . '</td>';
        $tablaRecursos .= '<td>';
        if ($admin) {
            $tablaRecursos .= '<a href="javascript:verDetalleRecurso(' . $registro['idRecurso'] . ')" title="VER DETALLE"><i class="fa fa-eye"></i></a>';
            $tablaRecursos .= '&nbsp;&nbsp;<a href="javascript:verDevolucionRecurso(' . $registro['idRecurso'] . ')" title="REGISTRAR DEVOLUCION DE ESTE RECURSO"><i class="fa fa-reply"></i></a>';
            $tablaRecursos .= '&nbsp;&nbsp;<a href="javascript:verMarcacionRecursoUsado(' . $registro['idRecurso'] . ')" title="REGISTRAR ESTE RECURSO COMO USADO"><i class="fa fa-check"></i></a>';
        }
        $tablaRecursos .= '</td>';
        $tablaRecursos .= '<td>' . $registro['idOT'] . '</td>';
        if ($registro['estadoOT'] == 'Activa') {
            $tablaRecursos .= '<td style="color: blue">' . $registro['estadoOT'] . '</td>';
        } else {
            $tablaRecursos .= '<td>' . $registro['estadoOT'] . '</td>';
        }
        $tablaRecursos .= '<td>' . strtoupper(trim($registro['nombre'])) . '</td>';
        $tablaRecursos .= '<td>' . $registro['serial'] . '</td>';
        if (intval($registro['usado']) == 1) {
            $tablaRecursos .= '<td>SI</td>';
        } else {
            $tablaRecursos .= '<td style="color: red">NO</td>';
        }
        $tablaRecursos .= '<td>' . $registro['fechaentrega'] . '</td>';
        $tablaRecursos .= '<td>' . $registro['estado'] . '</td>';
        
        $tablaRecursos .= '</tr>';
    }
    $titulo = 'BODEGAS DE RECURSOS';
}

function setTablaMaterialesBodega($datos = array(), $admin = false) {
    global $tablaMateriales;
    global $titulo;
    foreach ($datos as $registro) {
        $cantminima = intval($registro['cantminima']);
        $styleCantMinima = '';
        if (intval($registro['existencias']) <= $cantminima) {
            $styleCantMinima = 'style="color: red"';
        }
        $tablaMateriales .= '<tr>';
        $tablaMateriales .= '<td>' . $registro['idBodegaEmpleado'] . '</td>';
        $tablaMateriales .= '<td>';
        if ($admin) {
            $tablaMateriales .= '<a href="javascript:verDetalleMaterial(' . $registro['idMaterial'] . ', ' . $registro['idBodegaEmpleado'] . ')" title="VER DETALLE"><i class="fa fa-eye"></i></a>';
            $tablaMateriales .= '&nbsp;&nbsp;<a href="javascript:verAsignacionMaterial(' . $registro['idMaterial'] . ', ' . $registro['idBodegaEmpleado'] . ')" title="AGREGAR EXISTENCIAS A ESTE MATERIAL"><i class="fa fa-plus-circle"></i></a>';
            $tablaMateriales .= '&nbsp;&nbsp;<a href="javascript:verSalidaMaterial(' . $registro['idMaterial'] . ', ' . $registro['idBodegaEmpleado'] . ')" title="SACAR EXISTENCIAS DE ESTE MATERIAL"><i class="fa fa-minus-circle"></i></a>';
        }
        $tablaMateriales .= '</td>';
        $tablaMateriales .= '<td>' . $registro['idMaterial'] . '</td>';
        $tablaMateriales .= '<td>' . strtoupper(trim($registro['material'])) . '</td>';
        $tablaMateriales .= '<td ' . $styleCantMinima . '><b>' . number_format($registro['existencias']) . '</b></td>';
        $tablaMateriales .= '</tr>';
    }
    $titulo = 'BODEGAS DE MATERIALES';
}

function setListaMateriales($materiales = array()) {
    $lista = '<option value="">Seleccione...</option>';
    foreach ($materiales as $material) {
        $lista .= '<option value="' . $material['idMaterial'] . '">' . strtoupper($material['material']) . '</option>';
    }
    return $lista;
}

function setListaActulizarAlmacen($admin = false) {
    $lista = '<option value="">Seleccione...</option>';
    $lista .= '<option value="1">SI</option>';
    if ($admin) {
        $lista .= '<option value="0">NO</option>';
    }
    return $lista;
}

function setTablaEmpleados($empleados = array()) {
    $tabla = '';
    foreach ($empleados as $empleado) {
        $nombres = trim($empleado['primerNombre']) . ' ' . trim($empleado['segundoNombre']);
        $apellidos = trim($empleado['primerApellido']) . ' ' . trim($empleado['segundoApellido']);
        $tabla .= '<tr>';
        $tabla .= '<td>' . $empleado['idEmpleado'] . '</td>';
        $tabla .= '<td>' . strtoupper(trim($nombres)) . '</td>';
        $tabla .= '<td>' . strtoupper(trim($apellidos)) . '</td>';
        $tabla .= '<td>';
        $tabla .= '<input type="checkbox" name="checkes[]" id="' . $empleado['idEmpleado'] . '" class="checkes" value="' . $empleado['idEmpleado'] . '" title="GENERAR BODEGA PARA ESTE EMPLEADO">';
        $tabla .= '</td>';
        $tabla .= '</tr>';
    }
    return $tabla;
}

?>
