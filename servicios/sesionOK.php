<?php

//echo '--'.$_SESSION['PRIVILEGIO_USUARIO'].'--'.$_SESSION['NOMBRES_APELLIDO_USUARIO'];
if (!isset($_SESSION['PRIVILEGIO_USUARIO']) && !isset($_SESSION['NOMBRES_APELLIDO_USUARIO'])) {
    header('location:/sw2click/modulos/usuarios/iniciarSesion');
} else {
    $_SESSION['ACTIVACION_D'] = 0; //getActivacionD();
}

if ($_SESSION['PRIVILEGIO_USUARIO'] == 6) {
    header('location:/soporte/modulos/secciones/seccionGeneral');
}

function getActivacionD() {
//    $nombreArchivo = "D:\\xampp\htdocs\sw2click\servicios\activacionD.txt";
    $nombreArchivo = "/opt/lampp/htdocs/sw2click/servicios/activacionD.txt";
    $fichero = fopen($nombreArchivo, 'rb');
    $activacionD = 0;
    while (($linea = fgets($fichero)) !== false) {
        $activacionD = $linea;
    }
    fclose($fichero);
    return $activacionD;
}

?>
