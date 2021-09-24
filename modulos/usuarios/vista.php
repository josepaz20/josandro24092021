<?php

// ********************** MODULO USUARIOS **********************
//require_once('../permisos/modelo.php');

$diccionario = array(
    'subtitulo' => array(
        vADMINISTRACION => 'Usuarios Registrados',
        vCAMBIAR_CLAVE => 'Cambio de Contraseña',
        vNUEVACUENTA => 'Crear cuenta de Usuario',
        vGET_CORPORATIVO => 'Seleccionar un Cliente',
        vEDICION => 'Edicion un Cliente'
    ),
    'form_actions' => array(
        'LOGIN' => '/sw2click/' . MODULO . LOGIN,
        'SET_CLAVE' => '/sw2click/' . MODULO . SET_CLAVE
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
    global $tablaUsuarios;
    global $tablaCorporativos;
    global $listaModulos;
    if ($vista == vINICIAR_SESION) {
        $html = getPlantilla('plantillaLogin');
    } else {
        if ($vista == vGET_CORPORATIVO) {
            $html = getPlantilla('plantillaVer');
        } else {
            $html = getPlantilla('plantilla');
        }
        $html = str_replace('{titulo}', 'USUARIOS', $html);
        $html = str_replace('{subtitulo}', $diccionario['subtitulo'][$vista], $html);
    }
    $html = str_replace('{user_name}', $_SESSION['NOMBRES_APELLIDO_USUARIO'], $html);
    $html = str_replace('{user_charge}', $_SESSION['CARGO_USUARIO'], $html);
    $html = str_replace('{contenido}', getPlantilla($vista), $html);

    $html = str_replace('{tablaUsuarios}', $tablaUsuarios, $html);
    $html = str_replace('{tablaCorporativos}', $tablaCorporativos, $html);
    $html = str_replace('{listaModulos}', $listaModulos, $html);

    $html = str_replace('{mensaje}', $datos['mensaje'], $html);
    $html = render_dinamico_datos($html, $datos);
    $html = render_dinamico_datos($html, $diccionario['form_actions']);
    print $html;
}

function setTablaUserResidencial($datos = array(array())) {
    global $tablaUsuarios;
    $estado = '';
    $idUsuario = '';
    $nombres = '';
    foreach ($datos as $registro) {
        $tablaUsuarios .= '<tr>';
        foreach ($registro as $campo => $valor) {
            if ($campo != 'estado' && $campo != 'idResidencial' && $campo != 'nombres' && $campo != 'apellidos') {
                $tablaUsuarios .= '<td>' . $valor . '</td>';
            }
            if ($campo == 'idUsuario') {
                $idUsuario = $valor;
            }
            if ($campo == 'estado') {
                $estado = $valor;
            }
            if ($campo == 'nombres') {
                $nombres = $valor;
            }
            if ($campo == 'apellidos') {
                $tablaUsuarios .= '<td>' . $nombres . ' ' . $valor . '</td>';
            }
        }
        if ($estado == 'Activo') {
            $tablaUsuarios .= '<td class="icono">
                                    <img src="/sw2click/public/img/estado_on.png" title="Usuario Activo" alt="" onclick="cambiarEstado(' . $idUsuario . ',2)">
                               </td>';
        } else {
            $tablaUsuarios .= '<td class="icono">
                                    <img src="/sw2click/public/img/estado_off.png" title="Usuario Bloqueado" alt="" onclick="cambiarEstado(' . $idUsuario . ',3)">
                               </td>';
        }
        $tablaUsuarios .= '<td class="icono">
                            <a href="/sw2click/modulos/usuarios/editar?idUsuario=' . $idUsuario . '">
                                <img src="/sw2click/public/img/lupa.png" title="consultar" alt="">
                            </a>
                           </td>';
        $tablaUsuarios .= '</tr>';
    }
}

function setTablaUserCorporativo($datos = array(array())) {
    global $tablaUsuarios;
    $estado = '';
    $idUsuario = '';
    foreach ($datos as $registro) {
        $tablaUsuarios .= '<tr>';
        foreach ($registro as $campo => $valor) {
            if ($campo != 'estado' && $campo != 'idCorporativo' && $campo != 'razonSocial') {
                $tablaUsuarios .= '<td>' . $valor . '</td>';
            }
            if ($campo == 'idUsuario') {
                $idUsuario = $valor;
            }
            if ($campo == 'estado') {
                $estado = $valor;
            }
            if ($campo == 'razonSocial') {
                $tablaUsuarios .= '<td>' . $valor . '</td>';
            }
        }
        if ($estado == 'Activo') {
            $tablaUsuarios .= '<td class="icono">
                                    <img src="/sw2click/public/img/estado_on.png" title="Usuario Activo" alt="" onclick="cambiarEstado(' . $idUsuario . ',0)">
                               </td>';
        } else {
            $tablaUsuarios .= '<td class="icono">
                                    <img src="/sw2click/public/img/estado_off.png" title="Usuario Bloqueado" alt="" onclick="cambiarEstado(' . $idUsuario . ',1)">
                               </td>';
        }
        $tablaUsuarios .= '<td class="icono">
                            <a href="/sw2click/modulos/usuarios/editar?id_usuario=' . $idUsuario . '">
                                <img src="/sw2click/public/img/lupa.png" title="consultar" alt="">
                            </a>
                           </td>';
        $tablaUsuarios .= '</tr>';
    }
}

function llenar_tabla_buscarFacturas($datos_facturas = array(array())) {
    global $datos_tabla_facturas;
    foreach ($datos_facturas as $registro) {
        $datos_tabla_facturas .= '<tr>';
        foreach ($registro as $campo => $valor) {
            if ($campo != 'abono' && $campo != 'descuento' && $campo != 'baseImponible' && $campo != 'ivaPago' && $campo != 'formaPago' && $campo != 'estado' && $campo != 'retefuentePago') {
                if ($campo == 'cliente_cedulaNIT' || $campo == 'empresa_NIT') {
                    if ($valor != '') {
                        $datos_tabla_facturas .= '<td>' . $valor . '</td>';
                    }
                } else {
                    $datos_tabla_facturas .= '<td>' . $valor . '</td>';
                }
            }
            if ($campo == 'id_factura') {
                $id = $valor;
            }
        }
        $datos_tabla_facturas .= '<td class="icono">
				<a target="_blank" href="/sw2click/modulos/factura/imprimir_factura?id_factura=' . $id . '" >
						<img src="/sw2click/public/img/icono_impresora.png" title="Imprimir Factura" alt="">
						</a>
						</td>';
        $datos_tabla_facturas .= '</tr>';
    }
}

function setTablaSelect($datos = array(array())) {
    global $tablaCorporativos;
    $idCorporativo = '';
    foreach ($datos as $registro) {
        $tablaCorporativos .= '<tr>';
        foreach ($registro as $campo => $valor) {
            if ($campo != 'estado') {
                $tablaCorporativos .= '<td>' . $valor . '</td>';
            }

            if ($campo == 'idCorporativo') {
                $idCorporativo = $valor;
            }
        }

        $tablaCorporativos .= '<td class="icono">
                                   <a href="#" onclick="selectClienteCorp(' . $idCorporativo . ')">
                                       <img src="/sw2click/public/img/ok.png" title="Seleccionar este Cliente.">
                                   </a>
                               </td>';
        $tablaCorporativos .= '</tr>';
    }
}

function setDatosCorporativo($datos = array()) {
    $html = "<label>ID Usuario</label>
        <input name='idCorporativo' id='idCorporativo' value='{idCorporativo}' readonly> <br>
        <label>Usuario</label>
        <input name='user' id='user' value='{razonSocial}' readonly> <br>
        <label> Login </label>
        <input name='login' id='login' onblur='validarEspacios()' onkeypress='return validarn(event)' required> <br>
        <label>NIT</label>
        <input name='nit' id='nit' value='{nit}' readonly> <br>
         <input type='submit' value='Registrar Como Usuario' class='boton'>
             ";

    return render_dinamico_datos($html, $datos);
}

function setModulos($datos = array()) {
    global $listaModulos;
    $listaModulos = '';
    foreach ($datos AS $modulos) {
       
            $listaModulos.=' <label style="width:250px">'.$modulos['idModulo'].'.- '.$modulos['modulo'].'</label>
            <input  id="'.$modulos['idModulo'].'" type="checkbox" name="permiso[]" value="'.$modulos['idModulo'].'" {check'.$modulos['idModulo'].'}>
            <label for="'.$modulos['idModulo'].'"><span></span></label><br> ';
        
    }
}

function verificarPermisos($vista) {
    $permisosObj = new Permisos();

    switch ($vista) {
        case VIEW_MAIN_USER:
            if (!$permisosObj->tienePermisoUsuario($_SESSION['user_id'], 'Usuarios', 'Consultar')) {
                header('location:/sw2click/modulos/secciones/seccion_sin_permiso');
            }
            break;
        case VIEW_EDIT_USER:
            if (!$permisosObj->tienePermisoUsuario($_SESSION['user_id'], 'Usuarios', 'Modificar')) {
                header('location:/sw2click/modulos/secciones/seccion_sin_permiso');
            }
            break;
        case VIEW_DELETE_USER:
            if (!$permisosObj->tienePermisoUsuario($_SESSION['user_id'], 'Usuarios', 'Eliminar')) {
                header('location:/sw2click/modulos/secciones/seccion_sin_permiso');
            }
            break;
        case VIEW_CHANGE_PASSWORD_USER:
            if (!$permisosObj->tienePermisoUsuario($_SESSION['user_id'], 'Usuarios', 'Cambiar Clave')) {
                header('location:/sw2click/modulos/secciones/seccion_sin_permiso');
            }
            break;

        case VIEW_LOGIN_USER: break;
        case VIEW_GET_FACTURA: break;
        default:
            header('location:/sw2click/modulos/secciones/seccion_sin_permiso');
            break;
    }
}

?>