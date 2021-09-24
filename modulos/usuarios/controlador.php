<?php

// ********************** MODULO USUARIOS **********************

session_name('SW2CLICK');
session_start();
require_once('../../servicios/evitarInyeccionSQL.php');
require_once('constantes.php');
require_once('modelo.php');
require_once('vista.php');
//require_once('../factura/modelo.php');

controlador();

function controlador() {

    $evento = "";
    $url = $_SERVER['REQUEST_URI'];

    $peticiones = array(vINICIAR_SESION, LOGIN, vADMINISTRACION, LOGOUT, vCAMBIAR_CLAVE,
        SET_CLAVE, CAMBIAR_ESTADO, vNUEVACUENTA, vGET_CORPORATIVO, DATOS_CORPORATIVO, INSERTAR,
        vEDICION, MODIFICAR, MODULONUEVO, GET_TIPO_USUARIO, VERIFICAR_PAGO);

    foreach ($peticiones as $peticion) {
        $url_peticion = MODULO . $peticion;
        if (strpos($url, $url_peticion) == true) {
            $evento = $peticion;
        }
    }

    $usuarioOBJ = new Usuario();

    switch ($evento) {
        case vINICIAR_SESION:
//            if (isset($_SESSION['CEDULA_USUARIO']) && isset($_SESSION['user_id']) && isset($_SESSION['LOGIN_USUARIO'])) {
//                $_SESSION['ID_USUARIO'] = $_SESSION['user_id'];
//                $_SESSION['PRIVILEGIO_USUARIO'] = $_SESSION['user_privilege'];
//                $_SESSION['NOMBRES_APELLIDO_USUARIO'] = $_SESSION['NOMBRES_USUARIO'] . ' ' . $_SESSION['APELLIDOS_USUARIO'];
//                $_SESSION['CARGO_USUARIO'] = $_SESSION['user_charge'];
//                $_SESSION['ID_EMPLEADO'] = $usuarioOBJ->getIdEmpleado($_SESSION['CEDULA_USUARIO']);
//                if ($_SESSION['LOGIN_USUARIO'] == 'Administrador') {
//                    $_SESSION['ID_USUARIO'] = 1;
//                    $_SESSION['NOMBRES_APELLIDO_USUARIO'] = 'Administrador';
//                    $_SESSION['CARGO_USUARIO'] = 'Administrador';
//
//                    $_SESSION['NOMBRES_USUARIO'] = 'Administrador';
//                    $_SESSION['APELLIDOS_USUARIO'] = 'Administrador';
//                    $_SESSION['CEDULA_USUARIO'] = '10297849';
//                    $_SESSION['ID_EMPLEADO'] = $usuarioOBJ->getIdEmpleado('10297849');
//                }
//                if ($_SESSION['ID_EMPLEADO'] != -1) { // si es -1 significa que no es empleado.
//                    header('location:/sw2click/modulos/secciones/seccionGeneral');
//                } else {
////                    if (isset($_SESSION['user_name'])) {
////                        session_destroy();
////                    }
//                    header('location:/swDobleclick/modulos/secciones/seccion_general');
//                }
//            }

            $datos = getDatos();
            if (array_key_exists('msg', $datos)) {
                $datos['mensaje'] = getMensaje($datos['msg']);
            } else {
                $datos['mensaje'] = '';
            }
            verVista($evento, $datos);
            break;
        case LOGIN:
            $datos = getDatos();
            $login = trim($datos['login']);
            $clave = trim($datos['password']);
            if ($login != '' && $clave != '') {
//                print_r($_SESSION); echo '<br><br><br>';
                if ($usuarioOBJ->loginUsuario($login, $clave)) {
//                print_r($_SESSION);
//                    header('location:/sw2click/modulos/secciones/seccionGeneral');
                
                    header('location:/sw2click/public/html/usuarios/inicio.html');
                } else {
                    header('location:/sw2click/modulos/usuarios/iniciarSesion?msg=1'); // 1: LOGIN O PASSWORD INCORRECTO
                }
            } else {
                header('location:/sw2click/modulos/usuarios/iniciarSesion?msg=2'); // 1: SE DEBE INGRESAR LOGIN Y PASSWORD
            }
            break;
        case vADMINISTRACION:

            $tipo = 'Residencial';
            $ban = false;
            $datos = getDatos();
            $datos['botonNuevo'] = '';
            if (array_key_exists('tipo', $datos)) {
                $tipo = $datos['tipo'];
            }
            switch ($tipo) {
                case 'Residencial':
                    $ban = $usuarioOBJ->getResidenciales();
                    if ($ban) {
                        setTablaUserResidencial($usuarioOBJ->registros);
                    }
                    break;
                case 'Corporativo':
                    $ban = $usuarioOBJ->getCorporativos();
                    $datos['botonNuevo'] = '<div id="opciones">
                                          <a class="nuevo" href="nuevaCuenta" 
                                          title="Regresar a la Seccion General">Nueva Cuenta</a>
                                          </div>';
                    if ($ban) {
                        setTablaUserCorporativo($usuarioOBJ->registros);
                    }
                    break;
                case 'Empleado':
                    $ban = $usuarioOBJ->getResidenciales();
                    $datos['botonNuevo'] = '';
                    if ($ban) {
                        setTablaUserResidencial($usuarioOBJ->registros);
                    }
                    break;
            }
            if ($ban) {
                if (!array_key_exists('mensaje', $datos)) {
                    $datos['mensaje'] = $usuarioOBJ->mensaje;
                }
                $datos['aaSorting'] = 0;
                verVista($evento, $datos);
            } else {
                echo 'ERROR ! ! !';
            }
            break;
        case LOGOUT:
            if (array_key_exists('PRIVILEGIO_USUARIO', $_SESSION)) {
                if (session_destroy()) {
                    header("location: /sw2click/modulos/usuarios/iniciarSesion?msg=3");
                } else {
                    header("location: /sw2click/modulos/usuarios/iniciarSesion?msg=4");
                }
            }
            break;
        case vCAMBIAR_CLAVE:
            if (!isset($_SESSION['PRIVILEGIO_USUARIO']) && !isset($_SESSION['NOMBRES_APELLIDO_USUARIO'])) {
                header('location:/sw2click/modulos/usuarios/iniciarSesion');
            }
            $datos = getDatos();
            $datos['login'] = $_SESSION['LOGIN_USUARIO'];
            $datos['idUsuario'] = $_SESSION['ID_USUARIO'];
            $datos['mensaje'] = "Los campos marcados con (*) son Obligatorios.";
            if (array_key_exists('msg', $datos)) {
                $datos['mensaje'] = getMensaje($datos['msg']);
            }
            verVista($evento, $datos);
            break;
        case SET_CLAVE:
            $datos = getDatos();
            $idUsuario = $datos['idUsuario'];
            if ($usuarioOBJ->verificarClave($idUsuario, $datos['password'])) {
                if ($usuarioOBJ->setClave($idUsuario, $datos['newPassword'])) {
                    session_destroy();
                    header("location: /sw2click/modulos/usuarios/iniciarSesion?msg=5");
                } else {
                    header("location: /sw2click/modulos/usuarios/cambiarClave?msg=0");
                }
            } else {
                header("location: /sw2click/modulos/usuarios/cambiarClave?msg=6");
            }
            break;

        case CAMBIAR_ESTADO:
            $datos = getDatos();
            if (array_key_exists('idUsuario', $datos)) {
                $idUsuario = $datos['idUsuario'];
                $estado = $datos['estado'];
            }
            if ($msg = $usuarioOBJ->cambiarEstado($idUsuario, $estado)) {
                if ($estado == 0 || $estado == 1) {
                    header("location: administracion?tipo=Corporativo&&msg=$msg");
                }
                if ($estado == 2 || $estado == 3) {
                    header("location: administracion?tipo=Empleado&&msg=$msg");
                }
            }


            break;

        case vNUEVACUENTA:
            $datos = getDatos();
            $datos['mensaje'] = '';
            verVista($evento, $datos);
            break;

        case vGET_CORPORATIVO:
            $datos = getDatos();
            $datos['subtitulo'] = '';
            $filtro = '';
            $usuarioOBJ->getSelectCorporativos($filtro);
            setTablaSelect($usuarioOBJ->registros);
            if (array_key_exists('msg', $datos)) {
                $datos['mensaje'] = getMensaje($datos['msg']);
            } else {
                $datos['mensaje'] = $usuarioOBJ->mensaje;
            }
//setInformacionClienteCorp();
            verVista($evento, $datos);
            break;


        case DATOS_CORPORATIVO:
            $datos = getDatos();
            $idCorporativo = $datos['idCorporativo'];
            $usuarioOBJ->getCorporativo($idCorporativo);
            echo setDatosCorporativo($usuarioOBJ->registros[0]);

            break;

        case INSERTAR:
            $datos = getDatos();
            $msg = $usuarioOBJ->ingresarUsuario($datos);
            header("location: /sw2click/modulos/usuarios/administracion?tipo=Corporativo&msg=$msg");
            break;


        case vEDICION:
            $datos = getDatos();
            $idUsuario = $datos['idUsuario'];
            $usuarioOBJ->getModulos();
            $numModulos = 1 + count($usuarioOBJ->registros);
            setModulos($usuarioOBJ->registros);
            $usuarioOBJ->getEmpleado($idUsuario);
            $datos = $usuarioOBJ->registros[0];
            $accesoModulos = explode(',', $datos['accesoModulos']);
            for ($i = 0; $i < ($numModulos); $i++) {
                if (in_array($i, $accesoModulos)) {
                    $datos['check' . $i] = 'checked';
                }
            }
            $datos['mensaje'] = '';
            verVista($evento, $datos);
            break;

        case MODIFICAR:
            $datos = getDatos();
            $datos['permiso'] = implode(',', $datos['permiso']);
            $msg = $usuarioOBJ->actualizar($datos);
            header("location: /sw2click/modulos/usuarios/administracion?tipo=Empleado&msg=$msg");
            break;

        case MODULONUEVO:
            $datos = getDatos();
            $idUsuario = $datos['idUsuario'];
            $modulo = ucfirst(strtolower($datos['modulo']));
            $msg = $usuarioOBJ->insertModulo($modulo);
            header("location: editar?idUsuario=$idUsuario");
            break;
        case GET_TIPO_USUARIO:
            $info = array();
            $info['esRecaudador'] = 0;
            if ($_SESSION['PRIVILEGIO_USUARIO'] == 5) {
                $info['esRecaudador'] = 1;
            }
            echo json_encode($info);
            break;
        case VERIFICAR_PAGO:
            $info = array(
                'encontrado' => 0,
                'empleado' => '',
                'valorprima' => 0,
            );
            $pagosprima = array(
'1063810974' => '554649',
'1063815814' => '407361',
'10299193' => '376458',
'1085304053' => '488834',
'10297557' => '457930',
'1085343369' => '450332',
'1058787495' => '429837',
'1063814569' => '264083',
'1085292736' => '463549',
'10548675' => '54286',
'1061769351' => '640570',
'1088974092' => '377778',
'1063810646' => '464435',
'76327531' => '241607',
'10296575' => '283748',
'1061698646' => '438265',
'36953015' => '241607',
'1061776877' => '685840',
'1061750922' => '379268',
'27451385' => '432646',
'10306163' => '373649',
'1085333462' => '432646',
'1061714226' => '527919',
'10293850' => '390856',
'1003102398' => '307628',
'1061741539' => '353983',
'1061774870' => '241607',
'1061758194' => '337127',
'1061809385' => '480406',
'1061810651' => '466359',
'10297849' => '876427',
'1143843335' => '494452',
'14622256' => '412980',
'1003104253' => '457930',
'1085662706' => '477596',
'34327774' => '607999',
'34674041' => '469168',
'1063810131' => '289523',
'1061694171' => '337127',
'76326165' => '690602',
'1061782381' => '851427',
'1002972726' => '452312',
'12748596' => '285855',
'1058977231' => '463549',
'1061752454' => '241607',
'1061715863' => '83238',
'1004235716' => '457228',
'1085245076' => '484620',
'1002929171' => '491643',
'1130617938' => '306223',
'12748465' => '594444',
'1063815313' => '241607',
'4613864' => '470573',
'1061774864' => '455121',
'1061741640' => '1193333',
'1061730817' => '303999',
'1061792372' => '410171',
'1061684465' => '505690',
'1061766953' => '600760',
'1061767938' => '550000',
'25708143' => '491643',
'1061703031' => '444634',
'1061744186' => '633332',
'83212046' => '1173611',
'1061774916' => '783618',
'10303365' => '491643',
'1061772950' => '84282',
'1007708413' => '494452',
'1058962777' => '384184',
'1061766411' => '1000000',
'1063811175' => '879417',
'1063811037' => '1500000',
'1061750759' => '557332',
'1061717154' => '794665',
'1061787384' => '331508',
'1144049214' => '337127',
'1115067580' => '491165',
'10315873' => '480406',
'76296169' => '1500000',
'1061740528' => '323080',
'1061786232' => '494452',
'1085343943' => '78663',
'1085333518' => '471977',
'1085309954' => '484483',
'1061699406' => '816667',
'1002972232' => '272511',
'10308207' => '848917',
'1002970907' => '466359',
'12749212' => '611111',
'1061807686' => '238798',
'7175271' => '591403',
'1061727057' => '494452',
'1061750410' => '486024',
'1085269238' => '412980',
'10307577' => '1500000',
'1061693475' => '465142',
'1061723279' => '980000',
'1093222711' => '115185',
'1061690271' => '640570',
'1061740333' => '831324',
'1061814693' => '300605',
'98400439' => '483215',
            );
            if (array_key_exists($_SESSION['CEDULA_USUARIO'], $pagosprima)) {
                $info['empleado'] = strtoupper($_SESSION['NOMBRES_APELLIDO_USUARIO']);
                if ($_SESSION['CEDULA_USUARIO'] == '1061810651') {
                    $info['empleado'] .= ' -- Eres muy especial para mi!!!'; 
                }
                $info['valorprima'] = '$' . number_format($pagosprima[$_SESSION['CEDULA_USUARIO']]);
                $info['encontrado'] = '1';
            }
            echo json_encode($info);
            break;
    }
}

function getMensaje($msg = 0) {
    $mensaje = "";
    switch ($msg) {
        case 0:
            $mensaje .= '<div class="mensajes error">
                            La operacion  <b>NO</b> Fue exitosa. -- <b>[ ERROR ]</b>
                         </div>';
            break;
        case 1:
            $mensaje .= '<div class="mensajes error">
                            El USUARIO o la CLAVE <b>NO</b> son Correctos. -- <b>[ ERROR ]</b>
                         </div>';
            break;
        case 2:
            $mensaje .= '<div class="mensajes error">
                            Debe ingreasar el USUARIO y la CLAVE para Iniciar Sesion. -- <b>[ ERROR ]</b>
                         </div>';
            break;
        case 3:
            $mensaje .= '<div class="mensajes exito">
                            La Sesion de Usuario ha sido CERRADA. -- <b>[ OK ]</b>
                         </div>';
            break;
        case 4:
            $mensaje .= '<div class="mensajes error">
                            Se han presentado problemas al CERRAR su sesion de Usuario. -- <b>[ ERROR ]</b> <br>
                            Cierre su navegador o pongase en contacto con el Administrador del Sistema.
                         </div>';
            break;
        case 5:
            $mensaje = '<div class="exito">
                            Contraseña de ingreso <b>ACTUALIZADA</b> en el Sistema. -- <b>[ OK ]</b>
                         </div>';
            break;
        case 6:
            $mensaje .= '<div class="mensajes error">
                            La Contraseña Actual <b>NO</b> es correcta. -- <b>[ ERROR ]</b>
                         </div>';

            break;
        case 7:
            $mensaje .= '<div class="exito">
                            Usuario Actualizado Correctamente
                         </div>';

            break;
        case 8:
            $mensaje .= '<div class="exito">
                            Usuario Actualizado Correctamente
                         </div>';

            break;
    }
    return $mensaje;
}

function getDatos() {
    $datos = array();
    if ($_POST) {
        if (array_key_exists('idUsuario', $_POST))
            $datos['idUsuario'] = $_POST['idUsuario'];
        if (array_key_exists('login', $_POST))
            $datos['login'] = $_POST['login'];
        if (array_key_exists('password', $_POST))
            $datos['password'] = $_POST['password'];
        if (array_key_exists('newPassword', $_POST))
            $datos['newPassword'] = $_POST['newPassword'];
        if (array_key_exists('idCorporativo', $_POST))
            $datos['idCorporativo'] = $_POST['idCorporativo'];
        if (array_key_exists('nit', $_POST))
            $datos['nit'] = $_POST['nit'];
        if (array_key_exists('user', $_POST))
            $datos['user'] = $_POST['user'];
        if (array_key_exists('permiso', $_POST))
            $datos['permiso'] = $_POST['permiso'];
    }
    if ($_GET) {
        if (array_key_exists('msg', $_GET))
            $datos['msg'] = $_GET['msg'];
        if (array_key_exists('tipo', $_GET))
            $datos['tipo'] = $_GET['tipo'];
        if (array_key_exists('idUsuario', $_GET))
            $datos['idUsuario'] = $_GET['idUsuario'];
        if (array_key_exists('estado', $_GET))
            $datos['estado'] = $_GET['estado'];
        if (array_key_exists('idCorporativo', $_GET))
            $datos['idCorporativo'] = $_GET['idCorporativo'];
        if (array_key_exists('modulo', $_GET))
            $datos['modulo'] = $_GET['modulo'];
    }
    return $datos;
}

?>
