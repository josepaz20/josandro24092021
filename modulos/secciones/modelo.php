<?php

// ********************** MODULO SECCIONES **********************

require_once('../../servicios/accesoDatos.php');

date_default_timezone_set('America/Bogota');

class Seccion extends AccesoDatos {

    public function getContMsgNew($cedula = '') {
//        if ($_SESSION['PRIVILEGIO_USUARIO'] == 1 || $_SESSION['PRIVILEGIO_USUARIO'] == 3) {
            $this->consulta = "SELECT COUNT( mensaje_ticket.idMensaje ) AS numMsgNew 
                               FROM mensaje_ticket 
                               INNER JOIN ticket ON mensaje_ticket.idTicket = ticket.idTicket 
                               WHERE mensaje_ticket.estado = 'No Leido' AND ticket.estado != 'Cerrado'";
//        } else {
//            $this->consulta = "SELECT COUNT( mensaje_ticket.idMensaje ) AS numMsgNew 
//                               FROM mensaje_ticket 
//                               INNER JOIN ticket ON mensaje_ticket.idTicket = ticket.idTicket 
//                               INNER JOIN empleado_tipoticket ON ticket.idTipo = empleado_tipoticket.idTipo 
//                               INNER JOIN empleado ON empleado_tipoticket.idEmpleado = empleado.idEmpleado 
//                               WHERE mensaje_ticket.estado = 'No Leido' AND ticket.estado != 'Cerrado' 
//                               AND empleado.cedula = '$cedula'";
//        }

        if ($this->consultarBD('swSoporte_BD') > 0) {
            return $this->registros[0]['numMsgNew'];
        } else {
            return 100000; // 10000 --> esta cifra es solo para indicar que es un error
        }
    }

    public function getContTicketOpen($cedula = '') {
//        if ($_SESSION['PRIVILEGIO_USUARIO'] == 1 || $_SESSION['PRIVILEGIO_USUARIO'] == 3) {
            $this->consulta = "SELECT COUNT( ticket.idTicket ) AS numTicketOpen 
                               FROM ticket 
                               WHERE ticket.estado != 'Cerrado'";
//        } else {
//            $this->consulta = "SELECT COUNT( ticket.idTicket ) AS numTicketOpen 
//                               FROM ticket 
//                               INNER JOIN empleado_tipoticket ON ticket.idTipo = empleado_tipoticket.idTipo 
//                               INNER JOIN empleado ON empleado_tipoticket.idEmpleado = empleado.idEmpleado 
//                               WHERE ticket.estado != 'Cerrado' 
//                               AND empleado.cedula = '$cedula'";
//        }
//        echo $this->consulta;
//        $this->consultarBD('swSoporte_BD');
        if ($this->consultarBD('swSoporte_BD') > 0) {
            return $this->registros[0]['numTicketOpen'];
        } else {
            return 10000; // 10000 --> esta cifra es solo para indicar que es un error
        }
    }

    public function getContInstallCorp() {
        $this->consulta = "SELECT COUNT(idInstalacion) AS numInstallCorp 
                           FROM instalacion 
                           WHERE tipo = 'Corporativa' AND estado = 'Registrada'";
        if ($this->consultarBD('swInventario_BD') > 0) {
            return $this->registros[0]['numInstallCorp'];
        } else {
            return 100000; // 100000 --> esta cifra es solo para indicar que es un error
        }
    }

    public function getContInstallRes() {
        $this->consulta = "SELECT COUNT(idInstalacion) AS numInstallRes 
                           FROM instalacion 
                           WHERE tipo = 'Residencial' AND estado = 'Registrada'";
        if ($this->consultarBD('swInventario_BD') > 0) {
            return $this->registros[0]['numInstallRes'];
        } else {
            return 100000; // 100000 --> esta cifra es solo para indicar que es un error
        }
    }

    public function getContRevisados() {
        $cont = 0;
        $this->consulta = "SELECT COUNT(recaudo.idRecaudo) AS cont 
                           FROM recaudo 
                           LEFT JOIN activacion_recaudo ON recaudo.idRecaudo = activacion_recaudo.idRecaudo 
                           WHERE MONTH(fechaHoraRecaudo) = MONTH(CURDATE()) 
                            AND YEAR(fechaHoraRecaudo) = YEAR(CURDATE()) 
                            AND activacion_recaudo.idActivacion IS NULL";
        if ($this->consultarBD('swDobleClick_BD') > 0) {
            $cont += $this->registros[0]['cont'];
            $this->consulta = "SELECT COUNT(activacion_recaudo.idActivacion) AS cont 
                               FROM recaudo 
                               INNER JOIN activacion_recaudo ON recaudo.idRecaudo = activacion_recaudo.idRecaudo 
                               WHERE MONTH(fechaHoraRecaudo) = MONTH(CURDATE()) 
                               	AND YEAR(fechaHoraRecaudo) = YEAR(CURDATE()) 
                               	AND activacion_recaudo.estado = 'Sin Revisar'";
            if ($this->consultarBD('swDobleClick_BD') > 0) {
                $cont += $this->registros[0]['cont'];
            } else {
                return 999999; // 100000 --> esta cifra es solo para indicar que es un error
            }
        } else {
            return 999999; // 100000 --> esta cifra es solo para indicar que es un error
        }
        return $cont;
    }

    public function getContLlamadasAbiertas($idEmpleado = 0) {
//        if ($_SESSION['PRIVILEGIO_USUARIO'] == 1 || $_SESSION['PRIVILEGIO_USUARIO'] == 3) {
            $this->consulta = "SELECT 
                               COUNT(llamada.idLlamada) AS numLlamadas 
                               FROM llamada 
                               WHERE llamada.estado = 'En Proceso'";
//        } else {
//            $this->consulta = "SELECT 
//                               COUNT(llamada.idLlamada) AS numLlamadas 
//                               FROM llamada 
//                               INNER JOIN tipo_llamada ON tipo_llamada.idTipoLlamada = llamada.idTipoLlamada 
//                               INNER JOIN empleado_tipollamada ON empleado_tipollamada.idTipoLlamada = tipo_llamada.idTipoLlamada 
//                               WHERE llamada.estado != 'Solucionado' 
//                                AND llamada.estado != 'Cerrada' 
//                                AND llamada.estado != 'D. Masivo' 
//                                AND llamada.estado != 'Cerrado Ok' 
//                                AND llamada.estado != 'Cerrado Vencido' 
//                                AND llamada.fechaRecibido > '2017-01-01' 
//                                AND empleado_tipollamada.idEmpleado = (SELECT idEmpleado FROM empleado WHERE idEmpleado2C = $idEmpleado)";
//        }
//        echo $this->consulta;
        if ($this->consultarBD('llamadas_BD') > 0) {
            return $this->registros[0]['numLlamadas'];
        } else {
            return 100000; // 100000 --> esta cifra es solo para indicar que es un error
        }
    }

    public function getContVisitasTecnicas($idEmpleado = 0) {
        $this->consulta = "SELECT 
                           COUNT(llamada.idLlamada) AS numLlamadas 
                           FROM llamada 
                           WHERE llamada.estado = 'En Proceso' AND llamada.visitaTecnica = 1";
//        echo $this->consulta;
        if ($this->consultarBD('llamadas_BD') > 0) {
            return $this->registros[0]['numLlamadas'];
        } else {
            return 100000; // 100000 --> esta cifra es solo para indicar que es un error
        }
    }

    public function getContLlamadasReiteradas($idEmpleado = 0) {
//        if ($_SESSION['PRIVILEGIO_USUARIO'] == 1 || $_SESSION['PRIVILEGIO_USUARIO'] == 3) {
            $this->consulta = "SELECT 
                               COUNT(llamada.idLlamada) AS numLlamadas 
                               FROM llamada 
                               WHERE llamada.estado != 'Solucionada' 
                                AND llamada.estado != 'Cerrada' 
                                AND llamada.reiteracion != 0 
                                AND llamada.fechaRecibido > '2018-06-01'";
//        } else {
//            $this->consulta = "SELECT 
//                               COUNT(llamada.idLlamada) AS numLlamadas 
//                               FROM llamada 
//                               WHERE llamada.estado != 'Solucionada' 
//                               INNER JOIN tipo_llamada ON tipo_llamada.idTipoLlamada = llamada.idTipoLlamada 
//                               INNER JOIN empleado_tipollamada ON empleado_tipollamada.idTipoLlamada = tipo_llamada.idTipoLlamada 
//                                AND llamada.estado != 'Cerrada' 
//                                AND llamada.reiteracion != 0 
//                                AND llamada.fechaRecibido > '2013-07-31' 
//                                AND empleado_tipollamada.idEmpleado = (SELECT idEmpleado FROM empleado WHERE idEmpleado2C = $idEmpleado)";
//        }

        if ($this->consultarBD('llamadas_BD') > 0) {
            return $this->registros[0]['numLlamadas'];
        } else {
            return 100000; // 100000 --> esta cifra es solo para indicar que es un error
        }
    }

    public function getContServiciosCompletados() {
        $this->consulta = "SELECT
                            COUNT( `resultados`.`idResultado`) AS solucionadas
                           FROM
                             `resultados`
                             INNER JOIN `asignaciones` ON `resultados`.`idAsignada` =
                               `asignaciones`.`idAsignada`
                           WHERE
                             `resultados`.`estado` = 'Registrado'";

        if ($this->consultarBD('llamadas_BD') > 0) {
            return $this->registros[0]['solucionadas'];
        } else {
            return 100000; // 100000 --> esta cifra es solo para indicar que es un error
        }
    }

    public function getPermisos($idUsuario = 0) {
        $this->consulta = "SELECT 
                            accesoModulos 
                           FROM usuario 
                           WHERE usuario.idUsuario = $idUsuario 
                           LIMIT 1";
        if ($this->consultarBD() > 0) {
            return $this->registros[0]['accesoModulos'];
        } else {
            return array();
        }
    }

    public function getCambiosPlan($tipoCliente = 'Corporativo') {
        $this->consulta = "SELECT 
                            COUNT(idCambioPlan) AS cambios 
                           FROM cambio_plan 
                           WHERE tipoCliente = '$tipoCliente'
                            AND estado = 'Registrada'";
        if ($this->consultarBD()) {
            return $this->registros[0]['cambios'];
        } else {
            return -1;
        }
    }

    public function getContRetirosRes() {
        $this->consulta = "SELECT COUNT(retiro.idRetiro) AS numRetirosRes 
                           FROM retiro 
                           WHERE retiro.tipoCliente = 'Residencial' AND retiro.estado = 'Registrado' 
                           AND retiro.fechaHoraReg >= '2019-05-01 00:00:00'";
//                           AND retiro.fechaHoraReg >= '2018-03-01 00:00:00'";
        if ($this->consultarBD() > 0) {
            return $this->registros[0]['numRetirosRes'];
        } else {
            return 100000; // 100000 --> esta cifra es solo para indicar que es un error
        }
    }

    public function getContRetirosCorp() {
        $this->consulta = "SELECT COUNT(retiro.idRetiro) AS numRetirosCorp 
                           FROM retiro 
                           WHERE retiro.tipoCliente = 'Corporativo' AND retiro.estado = 'Registrado' 
                           AND retiro.fechaHoraReg >= '2019-05-01 00:00:00'";
        if ($this->consultarBD() > 0) {
            return $this->registros[0]['numRetirosCorp'];
        } else {
            return 100000; // 100000 --> esta cifra es solo para indicar que es un error
        }
    }

    public function getDaniosMasivos() {
        $this->consulta = "SELECT COUNT(llamada.idLlamada) AS contDanios 
                           FROM llamada 
                           WHERE llamada.idTipoLlamada = 6 AND llamada.idLlamada > 26461 AND llamada.estado != 'Solucionado' AND llamada.estado != 'Cerrado Ok' AND llamada.estado != 'Cerrado Vencido'";
        if ($this->consultarBD('llamadas_BD') > 0) {
            return $this->registros[0]['contDanios'];
        } else {
            return 100000; // 100000 --> esta cifra es solo para indicar que es un error
        }
    }

    public function getTipoContrato($idEmpleado = 0) {
        $this->consulta = "SELECT idContratoLaboral, tipoContrato FROM contrato_laboral WHERE idEmpleado = $idEmpleado ORDER BY idContratoLaboral DESC LIMIT 1";
        if ($this->consultarBD() > 0) {
            return $this->registros[0]['tipoContrato'];
        } else {
            return 'Servicios';
        }
    }

    public function getTraslados($estado = '') {
        $this->consulta = "SELECT COUNT(traslado_servicio.pk_traslado_id) AS contTraslado 
                           FROM traslado_servicio 
                           WHERE traslado_servicio.fechaHoraReg >= '2019-01-01 00:00:00' AND (traslado_servicio.estado = '$estado'";
        if ($estado == 'Factura Pagada') {
            $this->consulta .= " OR (costo = 0 AND estado = 'Registrado'))";
        } else {
            $this->consulta .= ")";
        }
        if ($this->consultarBD('swDobleClick_BD') > 0) {
            return $this->registros[0]['contTraslado'];
        } else {
            return 100000; // 100000 --> esta cifra es solo para indicar que es un error
        }
    }

    //CAMBIOS TV
    public function getCambiosTv($estado = '') {
    	$this->consulta = "SELECT COUNT(cambios_tv.idCambiosTv) AS contCambiosTv 
    					   FROM cambios_tv 
    					   WHERE cambios_tv.estado = '$estado'";
    	if ($this->consultarBD('swDobleClick_BD') > 0) {
    		return $this->registros[0]['contCambiosTv'];
    	} else {
    		return 100000; // 100000 --> esta cifra es solo para indicar que es un error
    	}
    }
    
    public function getCambiosTvByTipo($tipoCambio = '') {
    	$this->consulta = "SELECT COUNT(cambios_tv.idCambiosTv) AS contCambiosTv 
                           FROM cambios_tv WHERE cambios_tv.tipoCambio = '$tipoCambio'
                           WHERE cambios_tv.estado != 'Teminado'";
    	if ($this->consultarBD('swDobleClick_BD') > 0) {
    		return $this->registros[0]['contCambiosTv'];
    	} else {
    		return 100000; // 100000 --> esta cifra es solo para indicar que es un error
    	}
    }
    public function getCambiosTvByEstado($estado = '', $tipo = '') {
    	$this->consulta = "SELECT COUNT(cambios_tv.idCambiosTv) AS contCambiosTv 
                           FROM cambios_tv WHERE cambios_tv.estado = '$estado' AND cambios_tv.tipoCambio = '$tipo'";
    	if ($this->consultarBD('swDobleClick_BD') > 0) {
    		return $this->registros[0]['contCambiosTv'];
    	} else {
    		return 100000; // 100000 --> esta cifra es solo para indicar que es un error
    	}
    }
    
    //MIGRACIONES
    public function getMigraciones($estado = '') {
    	$this->consulta = "SELECT COUNT(migracion_servicio.idMigracion) AS contMigraciones 
    					   FROM migracion_servicio 
    					   WHERE migracion_servicio.estado = '$estado'";
//      if ($estado == 'Registrado') {
//          $this->consulta .= " AND costo = 0";
//      }
      if ($estado == 'Factura Pagada') {
          $this->consulta .= " OR (costo = 0 AND estado = 'Registrado')";
      }
    	if ($this->consultarBD('swDobleClick_BD') > 0) {
    		return $this->registros[0]['contMigraciones'];
    	} else {
    		return 100000; // 100000 --> esta cifra es solo para indicar que es un error
    	}
    }    

    //DEVOLUCIONES DE CAMBIO DE EQUIPO
    public function getOTsCambioEquipo() {
    	$this->consulta = "SELECT COUNT(asignaciones.idAsignada) AS contOTs FROM asignaciones WHERE asignaciones.estado = 'Solucionada' AND asignaciones.tipoOT = 'Cambio de Equipo' AND asignaciones.fechaCreacion >= '2021-02-22 00:00:00'";
    	if ($this->consultarBD('llamadas_BD') > 0) {
    		return $this->registros[0]['contOTs'];
    	} else {
    		return 999999; // 100000 --> esta cifra es solo para indicar que es un error
    	}
    }    

    public function getOTsDevoluciones() {
    	$this->consulta = "SELECT COUNT(asignaciones.idAsignada) AS contDevoluciones FROM asignaciones WHERE asignaciones.estado = 'Solucionada' AND asignaciones.tipoOT = 'Cambio de Equipo' AND asignaciones.fechaCreacion >= '2021-02-22 00:00:00' AND (SELECT swInventario_BD.devolucion.idDevolucion FROM swInventario_BD.devolucion WHERE swInventario_BD.devolucion.idOT = asignaciones.idAsignada) IS NOT NULL";
    	if ($this->consultarBD('llamadas_BD') > 0) {
    		return $this->registros[0]['contDevoluciones'];
    	} else {
    		return 999999; // 100000 --> esta cifra es solo para indicar que es un error
    	}
    }
    
    public function getVentas($filtro = '') {
    	$this->consulta = "SELECT COUNT(contrato.idContrato) AS contVentas FROM contrato";
      if ($filtro != '') {
          $this->consulta .= " $filtro";
      }
    	if ($this->consultarBD('swDobleClick_BD') > 0) {
    		return $this->registros[0]['contVentas'];
    	} else {
    		return 999999; // 100000 --> esta cifra es solo para indicar que es un error
    	}
    }
    
    public function getIdEmpleadoBodegas() {
        $idsEmpleados = array();
        $this->consulta = "SELECT bodega_empleado.idEmpleado FROM bodega_empleado WHERE bodega_empleado.estado = 'Registrado'";
        if ($this->consultarBD('swInventario_BD') > 0) {
            foreach ($this->registros as $registro) {
                $idsEmpleados[] = $registro['idEmpleado'];
            }
        }
        return $idsEmpleados;
    }
        
}

?>