<?php

// ********************** MODULO AMPLICION DE RED **********************
//require_once('../permisos/modelo.php');

$diccionario = array(
    'subtitulo' => array(
        vADMINISTRACION => 'Mensajes de Texto',
        vCORPORATIVOS => 'Listado de Usuarios Corporativos',
        vCAMBIARCLAVE => 'Cambio de Contraseña',
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

function setTablaUsuarios($datos = array()) {
    global $tablaAmpliciones;
    global $titulo;

    foreach ($datos as $registro) {
        $tablaAmpliciones .= '<tr>';
        $tablaAmpliciones .= '<td>' . $registro['idUsuario'] . '</td>';
        $tablaAmpliciones .= '<td>';
        if ($registro['estado'] == 'Eliminado') {
            $tablaAmpliciones .= '<a href="javascript:verDetalle(' . $registro['idUsuario'] . ')" title="VER DETALLE DE ESTE USUARIO"><i class="fa fa-eye"></i></a>';
            $tablaAmpliciones .= '&nbsp;&nbsp;<a href="javascript:verActivar(' . $registro['idUsuario'] . ')" title="VER ACTIVAR DE ESTE USUARIO"><i class="fa fa-check"></i></a>';
        } else if ($registro['estado'] == 'Activo') {
            $tablaAmpliciones .= '<a href="javascript:verDetalle(' . $registro['idUsuario'] . ')" title="VER DETALLE DE ESTE USUARIO"><i class="fa fa-eye"></i></a>';
            $tablaAmpliciones .= '&nbsp;&nbsp;<a href="javascript:verEliminar(' . $registro['idUsuario'] . ')" title="VER ELIMINAR DE ESTE USUARIO"><i class="fa fa-close"></i></a>';
            $tablaAmpliciones .= '&nbsp;&nbsp;<a href="javascript:vercambiarContrasena(' . $registro['idUsuario'] . ')" title="CAMBIAR CLAVE DE ESTE USUARIO"><i class="fa fa-key "></i></a>';
        }//$tablaAmpliciones .= '&nbsp;&nbsp;<a href="javascript:verActualizar(' . $registro['idUsuario'] . ')" title="VER ACTUALIZAR DE ESTE USUARIO"><i class="fa fa-edit"></i></a>';
        $tablaAmpliciones .= '</td>';
        $tablaAmpliciones .= '<td>' . $registro['usuario'] . '</td>';
        $tablaAmpliciones .= '<td>' . $registro['login'] . '</td>';
        if ($registro['estado']=='Eliminado'){
        $tablaAmpliciones .= '<td style="color:red">' . $registro['estado'] . '</td>';
        }else if ($registro['estado']=='Activo'){
           $tablaAmpliciones .= '<td style="color:green">' . $registro['estado'] . '</td>'; 
        }       
        $tablaAmpliciones .= '<td>' . $registro['fechaHoraUltIN'] . '</td>';
        $tablaAmpliciones .= '</tr>';
    }
    

    $titulo = 'PBX MENSAJES';
}
function setTablaUsuariosCorporativos($datos = array()) {
    
    global $tablaAmpliciones;
    global $titulo;

    foreach ($datos as $registro) {
        $tablaAmpliciones .= '<tr>';
        $tablaAmpliciones .= '<td>' . $registro['idUsuario'] . '</td>';
        $tablaAmpliciones .= '<td>';
        if ($registro['estado'] == 'Eliminado') {
            $tablaAmpliciones .= '<a href="javascript:verDetalle(' . $registro['idUsuario'] . ')" title="VER DETALLE DE ESTE USUARIO"><i class="fa fa-eye"></i></a>';
            $tablaAmpliciones .= '&nbsp;&nbsp;<a href="javascript:verActivar(' . $registro['idUsuario'] . ')" title="VER ACTIVAR DE ESTE USUARIO"><i class="fa fa-check"></i></a>';
        } else if ($registro['estado'] == 'Activo') {
            $tablaAmpliciones .= '<a href="javascript:verDetalle(' . $registro['idUsuario'] . ')" title="VER DETALLE DE ESTE USUARIO"><i class="fa fa-eye"></i></a>';
            $tablaAmpliciones .= '&nbsp;&nbsp;<a href="javascript:verEliminar(' . $registro['idUsuario'] . ')" title="VER ELIMINAR DE ESTE USUARIO"><i class="fa fa-close"></i></a>';
        }//$tablaAmpliciones .= '&nbsp;&nbsp;<a href="javascript:verActualizar(' . $registro['idUsuario'] . ')" title="VER ACTUALIZAR DE ESTE USUARIO"><i class="fa fa-edit"></i></a>';
        $tablaAmpliciones .= '</td>';
        $tablaAmpliciones .= '<td>' . $registro['usuario'] . '</td>';
        $tablaAmpliciones .= '<td>' . $registro['login'] . '</td>';
        if ($registro['estado']=='Eliminado'){
        $tablaAmpliciones .= '<td style="color:red">' . $registro['estado'] . '</td>';
        }else if ($registro['estado']=='Activo'){
           $tablaAmpliciones .= '<td style="color:green">' . $registro['estado'] . '</td>'; 
        }       
        $tablaAmpliciones .= '<td>' . $registro['fechaHoraUltIN'] . '</td>';
        $tablaAmpliciones .= '</tr>';
    }
    

    $titulo = 'LISTADO DE USUARIOS CORPORATIVOS';
}
function setTablaUsuariosCambiarClave($datos = array()) {
    
    global $tablaAmpliciones;
    global $titulo;

    foreach ($datos as $registro) {
        $tablaAmpliciones .= '<tr>';
        $tablaAmpliciones .= '<td>' . $registro['idUsuario'] . '</td>';
        $tablaAmpliciones .= '<td>';
        if ($registro['estado'] == 'Eliminado') {
            $tablaAmpliciones .= '<a href="javascript:verDetalle(' . $registro['idUsuario'] . ')" title="VER DETALLE DE ESTE USUARIO"><i class="fa fa-eye"></i></a>';
            $tablaAmpliciones .= '&nbsp;&nbsp;<a href="javascript:verActivar(' . $registro['idUsuario'] . ')" title="VER ACTIVAR DE ESTE USUARIO"><i class="fa fa-check"></i></a>';
        } else if ($registro['estado'] == 'Activo') {
            $tablaAmpliciones .= '<a href="javascript:verDetalle(' . $registro['idUsuario'] . ')" title="VER DETALLE DE ESTE USUARIO"><i class="fa fa-eye"></i></a>';
            $tablaAmpliciones .= '&nbsp;&nbsp;<a href="javascript:verEliminar(' . $registro['idUsuario'] . ')" title="VER ELIMINAR DE ESTE USUARIO"><i class="fa fa-close"></i></a>';
        }//$tablaAmpliciones .= '&nbsp;&nbsp;<a href="javascript:verActualizar(' . $registro['idUsuario'] . ')" title="VER ACTUALIZAR DE ESTE USUARIO"><i class="fa fa-edit"></i></a>';
        $tablaAmpliciones .= '</td>';
        $tablaAmpliciones .= '<td>' . $registro['usuario'] . '</td>';
        $tablaAmpliciones .= '<td>' . $registro['login'] . '</td>';
        if ($registro['estado']=='Eliminado'){
        $tablaAmpliciones .= '<td style="color:red">' . $registro['estado'] . '</td>';
        }else if ($registro['estado']=='Activo'){
           $tablaAmpliciones .= '<td style="color:green">' . $registro['estado'] . '</td>'; 
        }       
        $tablaAmpliciones .= '<td>' . $registro['fechaHoraUltIN'] . '</td>';
        $tablaAmpliciones .= '</tr>';
    }
    

    $titulo = 'LISTADO DE USUARIOS ';
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
