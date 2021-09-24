<?php

foreach ($_GET as $variable => $valor) {
    if (!is_array($_GET[$variable])) {
        $_GET [$variable] = str_replace("'", "", trim($_GET[$variable]));
    }
}
// Modificamos las variables de formularios 
foreach ($_POST as $variable => $valor) {
//    if ($variable != 'checkes' && $variable != 'idFacturasDeudas' && $variable != 'ValorF' && $variable != 'permiso') {
    if (!is_array($_POST[$variable])) {
        $_POST [$variable] = str_replace("'", "", trim($_POST [$variable]));
    }
}
?>
