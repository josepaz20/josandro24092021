<?php

// ********************** MODULO USUARIOS **********************

require_once('../../servicios/accesoDatos.php');

date_default_timezone_set('America/Bogota');

class Usuario extends AccesoDatos {

    public function getIdUsuarioOLD($idEmpleado = '') {
        $this->consulta = "SELECT cedula 
                           FROM empleado 
                           WHERE idEmpleado = $idEmpleado";
        if ($this->consultarBD() > 0) {
            $identificacion = $this->registros[0]['cedula'];
            $this->consulta = "SELECT id_usuario 
                           FROM usuario 
                           WHERE identificacion = '$identificacion'";
            if ($this->consultarBD('BD_swDobleClick') > 0) {
                return $this->registros[0]['id_usuario'];
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    public function getPrivilegioUsuarioOLD($idEmpleado = '') {
        $this->consulta = "SELECT cedula 
                           FROM empleado 
                           WHERE idEmpleado = $idEmpleado";
        if ($this->consultarBD() > 0) {
            $identificacion = $this->registros[0]['cedula'];
            $this->consulta = "SELECT privilegio 
                           FROM usuario 
                           WHERE identificacion = '$identificacion'";
            if ($this->consultarBD('BD_swDobleClick') > 0) {
                return $this->registros[0]['privilegio'];
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    /**
     * Obtiene la informacion de todos los nodos registrados en el sistema, 
     * vincula el nodo con departamento y el municipio.
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     * @param string $limirInf limite inferior de la consulta SQL.
     * @param string $limirSup limite superior de la consulta SQL.
     */
    public function loginUsuario($login = '', $clave = '') {
        $password = md5($clave);
        $this->consulta = "SELECT * 
                           FROM usuario 
                           WHERE login = '$login' 
                           AND password = '$password' 
                           AND estado = 'Activo' 
                           LIMIT 1";

        if ($this->consultarBD() > 0) {
            $_SESSION['LOGIN_USUARIO'] = $this->registros[0]['login'];
            $_SESSION['ID_USUARIO'] = $this->registros[0]['idUsuario'];
            $_SESSION['PRIVILEGIO_USUARIO'] = $this->registros[0]['privilegio'];
            $_SESSION['ACTIVACION_D'] = 0;
//            $_SESSION['ACCESOMODULOS'] = $this->registros[0]['accesoModulos'];

            $tipoUsuario = $this->registros[0]['tipoUsuario'];

            switch ($tipoUsuario) {
                case 'Empleado':
                    $idEmpleado = $this->registros[0]['idEmpleado'];
                    $this->consulta = "SELECT primerNombre, segundoNombre, primerApellido, segundoApellido, cargo, cedula, tipoContrato 
                                       FROM empleado 
                                       WHERE idEmpleado = $idEmpleado 
                                       LIMIT 1";
                    $this->consultarBD();
//                    $apellidos = explode(' ', $this->registros[0]['apellidos']);
                    $_SESSION['ID_EMPLEADO'] = $idEmpleado;
                    $_SESSION['NOMBRES_APELLIDO_USUARIO'] = $this->registros[0]['primerNombre'] . ' ' . $this->registros[0]['primerApellido'];
                    $_SESSION['CARGO_USUARIO'] = $this->registros[0]['cargo'];
                    $_SESSION['TIPO_CONTRATO'] = $this->registros[0]['tipoContrato'];

                    $_SESSION['NOMBRES_USUARIO'] = $this->registros[0]['primerNombre'] . ' ' . $this->registros[0]['segundoNombre'];
                    $_SESSION['APELLIDOS_USUARIO'] = $this->registros[0]['primerApellido'] . ' ' . $this->registros[0]['segundoApellido'];
                    $_SESSION['CEDULA_USUARIO'] = $this->registros[0]['cedula'];
                    break;
                case 'Cliente Residencial':
                    $idResidencial = $this->registros[0]['idResidencial'];
                    $this->consulta = "SELECT nombres, apellidos, cedula 
                                       FROM residencial 
                                       WHERE idResidencial = $idResidencial 
                                       LIMIT 1";
                    $this->consultarBD();
                    $apellidos = explode(' ', $this->registros[0]['apellidos']);
                    $_SESSION['NOMBRES_APELLIDO_USUARIO'] = $this->registros[0]['nombres'] . ' ' . $apellidos[0];
                    $_SESSION['CARGO_USUARIO'] = 'Cliente Residencial';

                    $_SESSION['NOMBRES_USUARIO'] = $this->registros[0]['nombres'];
                    $_SESSION['APELLIDOS_USUARIO'] = $this->registros[0]['apellidos'];
                    $_SESSION['CEDULA_USUARIO'] = $this->registros[0]['cedula'];
                    break;
                case 'Cliente Corporativo':
                    $idCorporativo = $this->registros[0]['idCorporativo'];
                    $this->consulta = "SELECT razonSocial, nit 
                                       FROM corporativo 
                                       WHERE idCorporativo = $idCorporativo 
                                       LIMIT 1";

                    $this->consultarBD();
                    $_SESSION['NOMBRES_APELLIDO_USUARIO'] = $this->registros[0]['razonSocial'];
                    $_SESSION['CARGO_USUARIO'] = 'Cliente Corporativo';

                    $_SESSION['NOMBRES_USUARIO'] = $this->registros[0]['razonSocial'];
                    $_SESSION['APELLIDOS_USUARIO'] = $this->registros[0]['razonSocial'];
                    $_SESSION['CEDULA_USUARIO'] = $this->registros[0]['nit'];
                    break;
                case 'Administrador':
                    $_SESSION['NOMBRES_APELLIDO_USUARIO'] = 'Administrador';
                    $_SESSION['CARGO_USUARIO'] = 'Administrador';
                    $_SESSION['TIPO_CONTRATO'] = 'Laboral Administrativo';

                    $_SESSION['NOMBRES_USUARIO'] = 'Administrador';
                    $_SESSION['APELLIDOS_USUARIO'] = 'Administrador';
                    $_SESSION['CEDULA_USUARIO'] = '10297849';
                    $_SESSION['ID_EMPLEADO'] = '12';
                    $_SESSION['ID_CAJA_MAYOR_FNZAS'] = 2;
                    $idEmpleado = 12;
                    break;
                default:
                    break;
            }

            //******************************************************************
            // VARIABLES DE SESSION PARA EL ACCESO AL MODULO RECAUDOS Y FACTURACION DE swDobleclick

            $_SESSION['user_name'] = $_SESSION['NOMBRES_APELLIDO_USUARIO'];
            $_SESSION['user_charge'] = $_SESSION['CARGO_USUARIO'];

            $_SESSION['user_id'] = 0; //$this->getIdUsuarioOLD($idEmpleado);
            $_SESSION['user_privilege'] = 0; //$this->getPrivilegioUsuarioOLD($idEmpleado);

            //******************************************************************

            $fechaHora = date('Y-m-d H:i:s');
            $idUsuario = $_SESSION['ID_USUARIO'];
            $consultas = array();
            $consultas[] = "UPDATE usuario 
                            SET fechaHoraUltIN = '$fechaHora' 
                            WHERE idUsuario = $idUsuario";
            $this->ejecutarTransaccion($consultas);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Obtiene la informacion de todos los nodos registrados en el sistema, 
     * vincula el nodo con departamento y el municipio.
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     * @param string $limirInf limite inferior de la consulta SQL.
     * @param string $limirSup limite superior de la consulta SQL.
     */
    public function getIdEmpleado($cedulaEmpl = '') {
        $this->consulta = "SELECT idEmpleado 
                           FROM empleado 
                           WHERE cedula = '$cedulaEmpl'";
        if ($this->consultarBD() > 0) {
            return $this->registros[0]['idEmpleado'];
        } else {
            return -1;
        }
    }

    /**
     * Obtiene la informacion de todos los nodos registrados en el sistema, 
     * vincula el nodo con departamento y el municipio.
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     * @param string $limirInf limite inferior de la consulta SQL.
     * @param string $limirSup limite superior de la consulta SQL.
     */
    public function getResidenciales() {
        $this->consulta = "SELECT
                            `usuario`.`idUsuario`,
                            CONCAT(`empleado`.`primerNombre`, ' ', `empleado`.`segundoNombre`) AS nombres, 
                            CONCAT(`empleado`.`primerApellido`, ' ', `empleado`.`segundoApellido`) AS apellidos, 
                            `usuario`.`idResidencial`,
                            `usuario`.`login`,
                            `usuario`.`fechaHoraUltIN`,
                            `usuario`.`estado`

                          FROM
                            `usuario`
                            INNER JOIN `empleado` ON `usuario`.`idEmpleado` = `empleado`.`idEmpleado`
                          WHERE
                            `usuario`.`tipoUsuario` = 'Empleado'";
        if ($this->consultarBD() > 0) {
            $this->mensaje = 'Seccion Usuarios Residenciales <br> Registros Encontrados: <b>' . count($this->registros) . '</b>';
            return true;
        } else {
            return false;
        }
    }

    /**
     * Obtiene la informacion de todos los nodos registrados en el sistema, 
     * vincula el nodo con departamento y el municipio.
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     * @param string $limirInf limite inferior de la consulta SQL.
     * @param string $limirSup limite superior de la consulta SQL.
     */
    public function getCorporativos() {
        $this->consulta = "SELECT usuario.idUsuario, usuario.idCorporativo, 
                            corporativo.razonSocial, usuario.login, 
                            usuario.fechaHoraUltIN, usuario.estado 
                           FROM usuario 
                           INNER JOIN corporativo ON usuario.idCorporativo = corporativo.idCorporativo 
                           WHERE usuario.tipoUsuario = 'Cliente Corporativo'";
        if ($this->consultarBD() > 0) {
            $this->mensaje = 'Seccion Usuarios Corporativos <br> Registros Encontrados: <b>' . count($this->registros) . '</b>';
            return true;
        } else {
            return false;
        }
    }

    /**
     * Obtiene la informacion de todos los nodos registrados en el sistema, 
     * vincula el nodo con departamento y el municipio.
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     * @param string $limirInf limite inferior de la consulta SQL.
     * @param string $limirSup limite superior de la consulta SQL.
     */
    public function getEmpleados() {
        $this->consulta = "SELECT * 
                           FROM usuarios 
                           WHERE tipoUsuario = 'Empleado'";
        if ($this->consultarBD() > 0) {
            $this->mensaje = 'Seccion Usuarios Empleados <br> Registros Encontrados: <b>' . count($this->registros) . '</b>';
            return true;
        } else {
            return false;
        }
    }

    /**
     * Obtiene la informacion de todos los nodos registrados en el sistema, 
     * vincula el nodo con departamento y el municipio.
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     * @param string $limirInf limite inferior de la consulta SQL.
     * @param string $limirSup limite superior de la consulta SQL.
     */
    public function setClave($idUsuario, $clave) {
        $consultas = array();
        $consultas[] = "UPDATE usuario SET password = MD5('$clave') WHERE idUsuario = $idUsuario";
        return $this->ejecutarTransaccion($consultas);
    }

    /**
     * Obtiene la informacion de todos los nodos registrados en el sistema, 
     * vincula el nodo con departamento y el municipio.
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     * @param string $limirInf limite inferior de la consulta SQL.
     * @param string $limirSup limite superior de la consulta SQL.
     */
    public function verificarClave($idUsuario, $clave) {
        $this->consulta = "SELECT COUNT(idUsuario) AS claveOK FROM usuario WHERE idUsuario = $idUsuario AND password = MD5('$clave')";
        if ($this->consultarBD() > 0) {
            if ($this->registros[0]['claveOK'] > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public function cambiarEstado($idUsuario = 0, $estado = 0) {
        $consultas = array();
        if ($estado == 0 || $estado == 2) {
            $mod = 'Eliminado';
        }
        if ($estado == 1 || $estado == 3) {
            $mod = 'Activo';
        }
        $consultas[] = "UPDATE usuario SET estado = '$mod' WHERE idUsuario = $idUsuario";
        echo $consultas[0];

        if ($this->ejecutarTransaccion($consultas)) {
            return 7;
        } else {
            return 0;
        }
    }

    public function getSelectCorporativos($filtro = '') {
        $this->consulta = "SELECT 
                            corporativo.idCorporativo, 
                            corporativo.nit, 
                            municipio.nombreMcpo, 
                            corporativo.razonSocial, 
                            corporativo.telefono, 
                            corporativo.email1 
                           FROM corporativo 
                           INNER JOIN municipio ON corporativo.idMcpo = municipio.idMcpo ";
        if ($filtro != '') {
            $this->consulta .= $filtro . " AND corporativo.estado = 'en_sistema'";
        } else {
            $this->consulta .= "WHERE corporativo.estado = 'en_sistema' AND idCorporativo NOT IN(SELECT
                                                                                        corporativo.idCorporativo
                                                                                      FROM
                                                                                        `corporativo`
                                                                                        INNER JOIN `usuario` ON `corporativo`.`idCorporativo` =
                                                                                          `usuario`.`idCorporativo`)";
        }
        $numRegistros = $this->consultarBD();
        $this->mensaje = "REGISTROS ENCONTRADOS: <b>$numRegistros</b>";
        if ($numRegistros > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function getCorporativo($idCorporativo = 0) {
        $this->consulta = "SELECT
                            `corporativo`.`idCorporativo`,
                            `corporativo`.`razonSocial`,
                            `corporativo`.`nit`
                          FROM
                            `corporativo`
                          WHERE
                            `corporativo`.`idCorporativo` = $idCorporativo LIMIT 1";
        if ($this->consultarBD() > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function ingresarUsuario($datos = array()) {
        foreach ($datos as $campo => $valor) {
            $$campo = $valor;
        }

        $consultas = array();
        $consultas[] = "INSERT INTO usuario
                        (idCorporativo, login, password, estado, privilegio, fechaHoraUltIN , tipoUsuario) 
                        VALUES($idCorporativo, '$login', MD5($nit), 'Activo', 6, '0000-00-00 00:00:00', 'Cliente Corporativo')";
        echo $consultas[0];
        if ($this->ejecutarTransaccion($consultas)) {
            return true;
        } else {
            return false;
        }
    }

    public function getEmpleado($idUsuario = 0) {
        $this->consulta = "SELECT * 
                           FROM usuario 
                           WHERE tipoUsuario = 'Empleado' AND idUsuario = $idUsuario";
        if ($this->consultarBD() > 0) {
            $this->mensaje = 'Seccion Usuarios Empleados <br> Registros Encontrados: <b>' . count($this->registros) . '</b>';
            return true;
        } else {
            return false;
        }
    }

    public function actualizar($datos = array()) {
        foreach ($datos as $campo => $valor) {
            $$campo = $valor;
        }

        $consultas = array();
        if ($password == '') {
            $consultas[] = "UPDATE  usuario SET  
                            `accesoModulos` =  '$permiso' 
                            WHERE  `usuario`.`idUsuario` =$idUsuario";
        } else {
            $consultas[] = "UPDATE usuario SET  
                            `password` = MD5(  '$password' ) ,
                            `accesoModulos` =  '$permiso' 
                            WHERE  `usuario`.`idUsuario` =$idUsuario";
        }
//        echo $consultas[0];return;
        if ($this->ejecutarTransaccion($consultas)) {
            return 7;
        } else {
            return 0;
        }
    }

    public function getModulos() {
        $this->consulta = "SELECT idModulo, modulo 
                           FROM modulos";
        if ($this->consultarBD() > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function insertModulo($modulo = 0) {

        $consultas = array();
        $consultas[] = "INSERT INTO modulos
                        (modulo) 
                        VALUES('$modulo')";
        echo $consultas[0];
        if ($this->ejecutarTransaccion($consultas)) {
            return true;
        } else {
            return false;
        }
    }

    public function verificarPago($idEmpleado = 0) {
        $this->consulta = "SELECT 
                            nomina_legal.idNomina, 
                            nomina_legal.idEmpleado,  
                            nomina_legal.identificacion, 
                            nomina_legal.empleado, 
                            nomina_legal.mes, 
                            nomina_legal.anio, 
                            nomina_legal.sueldoBasico, 
                            nomina_legal.diasTrabajados, 
                            nomina_legal.salario, 
                            nomina_legal.bonificacion, 
                            nomina_legal.rodamiento, 
                            nomina_legal.totalDevengado, 
                            nomina_legal.cargoFijoCelular, 
                            nomina_legal.cargoFijoInternet, 
                            nomina_legal.legalizacionCaja, 
                            nomina_legal.anticipos, 
                            nomina_legal.totalDeducciones,
                            nomina_legal.pagoNeto, 
                            nomina_legal.prima, 
                            nomina_legal.ctaCobro, 
                            nomina_legal.liquidacion, 
                            nomina_legal.totalPago 
                           FROM nomina_legal 
                           INNER JOIN empleado ON nomina_legal.idEmpleado = empleado.idEmpleado 
                           WHERE nomina_legal.idEmpleado = $idEmpleado 
                                 AND nomina_legal.anio = 2015 
                                 AND nomina_legal.mes = 11
                           LIMIT 1";
        if ($this->consultarBD('ModuloFinanciero_BD') > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function verificarPrima($idEmpleado = 0) {
        $this->consulta = "SELECT 
                            pago.idEmpleado, 
                            pago.empleado, 
                            pago.identificacion, 
                            pago.salario, 
                            pago.fechaIni, 
                            pago.fechaFin, 
                            pago.dias, 
                            pago.prima, 
                            pago.mediopago 
                           FROM pago 
                           WHERE pago.idEmpleado = $idEmpleado 
                           LIMIT 1";
        if ($this->consultarBD('pago_prima_bd') > 0) {
            return true;
        } else {
            return false;
        }
    }
    
    public function getInfoPrima($identificacionBusq = '') {
        $continuar = true;
        $nombreArchivo = "/home/josandro/LIQUIDACIONES/PRIMA_QUINCENA_DICIEMBRE_2017.csv";
        $fichero = fopen($nombreArchivo, 'rb');
        while (($dato = fgets($fichero)) !== false && $continuar == true) {
            $registro = explode(';', $dato);
            $identificacion = trim($registro[0]);
            if ($identificacionBusq == $identificacion) {
                $this->registros = $registro;
                $continuar = false;
            }
        }
        fclose($fichero);
        return !$continuar;
    }

}

?>
