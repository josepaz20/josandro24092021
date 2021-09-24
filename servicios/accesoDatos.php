<?php

abstract class AccesoDatos {

    private static $bd_host = '190.90.224.252';
    private static $bd_usuario = 'josandroDev';
    private static $bd_clave = 'j0s4ndr0.DEV';
//    private static $bd_host = 'localhost';
//    private static $bd_usuario = 'root';
//    private static $bd_clave = '';
    private static $bd_nombre = 'swDobleClick_BD';
    private $conn;
    protected $consulta;
    public $registros = array();
    public $ultimo_id = '000';
    public $idRecaudoInsert = 0;
    public $mensaje = '';

    /**
     * Obtiene la informacion de todos los nodos registrados en el sistema, 
     * vincula el nodo con departamento y el municipio.
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     * @param string $limirInf limite inferior de la consulta SQL.
     * @param string $limirSup limite superior de la consulta SQL.
     */
    private function conectar($nombreBD = '') {
        if ($nombreBD == '')
            $this->conn = new mysqli(self::$bd_host, self::$bd_usuario, self::$bd_clave, self::$bd_nombre, 6303);
        else
            $this->conn = new mysqli(self::$bd_host, self::$bd_usuario, self::$bd_clave, $nombreBD, 6303);
    }

    /**
     * Obtiene la informacion de todos los nodos registrados en el sistema, 
     * vincula el nodo con departamento y el municipio.
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     * @param string $limirInf limite inferior de la consulta SQL.
     * @param string $limirSup limite superior de la consulta SQL.
     */
    private function desconectar() {
        $this->conn->close();
    }

    /**
     * Obtiene la informacion de todos los nodos registrados en el sistema, 
     * vincula el nodo con departamento y el municipio.
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     * @param string $limirInf limite inferior de la consulta SQL.
     * @param string $limirSup limite superior de la consulta SQL.
     */
    protected function ejecutarBD() {
        $this->conectar();
        $this->conn->query("SET NAMES 'utf8'");
        $OK = $this->conn->query($this->consulta);
        if (strpos($this->consulta, 'INSERT') !== false) {
            $this->ultimo_id = $this->conn->insert_id;
        }
        $this->desconectar();
        return $OK;
    }

    /**
     * Obtiene la informacion de todos los nodos registrados en el sistema, 
     * vincula el nodo con departamento y el municipio.
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     * @param string $limirInf limite inferior de la consulta SQL.
     * @param string $limirSup limite superior de la consulta SQL.
     */
    protected function consultarBD($nombreBD = '') {
        $this->conectar($nombreBD);
        $this->conn->query("SET NAMES 'utf8'");
        $this->registros = array();
        $resultado = $this->conn->query($this->consulta);
        while ($this->registros[] = $resultado->fetch_assoc());
        $resultado->close();
        $this->desconectar();
        array_pop($this->registros);
        return count($this->registros);
    }

    /**
     * Obtiene la informacion de todos los nodos registrados en el sistema, 
     * vincula el nodo con departamento y el municipio.
     *
     * @return boolean true: si encuentra registros, en caso contrario false.
     * @param string $limirInf limite inferior de la consulta SQL.
     * @param string $limirSup limite superior de la consulta SQL.
     */
    protected function ejecutarTransaccion($consultas = array(), $nombreBD = '') {
       // print_r($consultas);
//        if ($_SESSION['ID_USUARIO'] == 159) {
//            return true;
//        }
        $error = 0;
        $this->idRecaudoInsert = 0;
        $this->conectar($nombreBD);
        $acentos = $this->conn->query("SET NAMES 'utf8'");
        $this->conn->autocommit(false);
        foreach ($consultas as $consult) {
            $consult = str_replace('{ultimoID}', $this->ultimo_id, $consult);
            if ($this->conn->query($consult)) {
               // echo 'CONSULTA: ' . $consult . '<br>';
                if (strpos($consult, 'INSERT') !== false) {
                    if (strpos($consult, 'INSERT INTO internet') === false &&
                            strpos($consult, 'INSERT INTO lantolan') === false &&
                            strpos($consult, 'INSERT INTO observacion') === false &&
                            strpos($consult, 'INSERT INTO contrato_factura') === false &&
                            strpos($consult, 'INSERT INTO concepto_factura') === false &&
                            strpos($consult, 'INSERT INTO viatico_actividad') === false &&
                            strpos($consult, 'INSERT INTO usuario') === false &&
                            strpos($consult, 'INSERT INTO clausula_tipo') === false &&
                            strpos($consult, 'INSERT INTO clausulas_contrato') === false &&
                            strpos($consult, 'INSERT INTO encuesta_cuidadocliente') === false &&
                            strpos($consult, 'INSERT INTO cobro') === false &&
                            strpos($consult, 'INSERT INTO item_compra') === false && 
                            strpos($consult, 'INSERT INTO viabilidad_recurso') === false && 
                            strpos($consult, 'INSERT INTO cuenta') === false) {
                        $this->ultimo_id = $this->conn->insert_id;
                    }
                    if (strpos($consult, 'INSERT INTO viabilidad_recurso') !== false) {
                        $this->idRecaudoInsert = $this->conn->insert_id;
                    }
                }
            } else {
                $error = 1;
            }
            $this->mensaje .= $consult . '<br><br>';
        }

//        echo $this->mensaje;
//        return;

        if ($error == 0) {
            $this->conn->commit();
            return true;
        } else {
            $this->conn->rollback();
            return false;
        }
    }

    public function ejecutarPL_calcularNomina($idNomina = 0) {
        $this->conectar('novedades_nomina_bd');
        $this->conn->query("CALL calcularNomina($idNomina, 0)");
        $this->desconectar();
    }

}

?>