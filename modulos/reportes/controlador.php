<?php

// ********************** MODULO REPORTES **********************

session_name('SW2CLICK');
session_start();
require_once('../../servicios/evitarInyeccionSQL.php');
require_once('../../servicios/sesionOK.php');
require_once('../../servicios/PHPExcel/PHPExcel.php');
require_once('constantes.php');
require_once('modelo.php');
require_once('vista.php');

date_default_timezone_set('America/Bogota');

controlador();

function controlador() {
    $evento = "";
    $url = $_SERVER['REQUEST_URI'];

    $peticiones = array(vLLAMADAS, vRESIDENCIAL, vORDENES, vFACTURAS, vRECAUDOS, vGENERAR_REPORTE,
        GENERAR_INFORME, DESCARGAR, VER_RESPALDO, vCOMERCIAL, vCALLCENTER, vNOC, BUSCARRESIDENCIAL,
        vCORPORATIVOS, GET_BUSCAR_CLIENTE_RES, GET_BUSCAR_CLIENTE_CORP);

    foreach ($peticiones as $peticion) {
        $url_peticion = MODULO . $peticion;
        if (strpos($url, $url_peticion) == true) {
            $evento = $peticion;
        }
    }

    $reporteOBJ = new Reporte();
    $datos = getDatos();
    $datos['ordenar'] = '[[0, "desc"]]';

    switch ($evento) {
        case vLLAMADAS:
            if (array_key_exists('idCorporativo', $datos)) {
                if ($datos['idCorporativo'] != 0) {
                    $idContrato = 0;
                    if (array_key_exists('idContrato', $datos)) {
                        $idContrato = $datos['idContrato'];
                    }
                    $idCorporativo = $datos['idCorporativo'];
                    $filtro = " WHERE corporativo.idCorporativo2C = $idCorporativo";
                    if ($idContrato != 0) {
                        $filtro .= " AND llamada.idContrato = $idContrato";
                    }
                    $reporteOBJ->getLlamadasCorp($filtro);
                    setTablaLlamadas($reporteOBJ->registros);
                    $filtro = " WHERE corporativo.idCorporativo = $idCorporativo LIMIT 1";
                    $reporteOBJ->getCorporativo($filtro);
                    $datos = array_merge($datos, $reporteOBJ->registros[0]);
                    $datos['tipoCliente'] = 'Corporativo';
                    $datos['desde'] = 'corporativo';
                }
            }
            if (array_key_exists('idResidencial', $datos)) {
                if ($datos['idResidencial'] != 0) {
                    $idContrato = 0;
                    if (array_key_exists('idContrato', $datos)) {
                        $idContrato = $datos['idContrato'];
                    }
                    $idResidencial = $datos['idResidencial'];
                    $filtro = " WHERE residencial.idResidencial2C = $idResidencial";
                    if ($idContrato != 0) {
                        $filtro .= " AND llamada.idContrato = $idContrato";
                    }
                    $reporteOBJ->getLlamadasRes($filtro);
                    setTablaLlamadas($reporteOBJ->registros);
                    $filtro = " WHERE residencial.idResidencial = $idResidencial LIMIT 1";
                    $reporteOBJ->getResidencial($filtro);
                    $datos = array_merge($datos, $reporteOBJ->registros[0]);
                    $datos['tipoCliente'] = 'Residencial';
                    $datos['desde'] = 'residencial';
                }
            }
            $datos['ordenar'] = '[[0, "desc"]]';
            $datos['mensaje'] = "A continuación se listan todas las Llamadas realizadas por el Cliente.";
            verVista($evento, $datos);
            break;

        case GET_BUSCAR_CLIENTE_RES:
            $info = array();
            $reporteOBJ->getClienteRes($datos['completar']);
            foreach ($reporteOBJ->registros as $registro) {
                $info[] = $registro['idResidencial'] . ' -- ' . $registro['cliente'];
            }
            echo json_encode($info);
            break;
        case GET_BUSCAR_CLIENTE_CORP:
            $info = array();
            $reporteOBJ->getClienteCorp($datos['completar']);
            foreach ($reporteOBJ->registros as $registro) {
                $info[] = $registro['idCorporativo'] . ' -- ' . $registro['cliente'];
            }
            echo json_encode($info);
            break;
        case vRESIDENCIAL:
            $buscarresidencial = array();
            $buscarresidencial = array(
                    'idResidencial' => '',
                    'idCuenta' => '',
                    'cliente' => '',
                    'identificacion' => '',
                );
            if (array_key_exists('cedula', $datos) && array_key_exists('clientesBusq', $datos)) {
                $buscarresidencial = array(
                    'idResidencial' => '',
                    'idCuenta' => '',
                    'cliente' => '',
                    'identificacion' => '',
                );
                if (trim($datos['cedula']) !== '') {
                    $filtro = "residencial.cedula = '" . trim($datos['cedula']) . "'";
                    if ($reporteOBJ->buscarResidencial($filtro) > 0) {
                        $buscarresidencial = $reporteOBJ->registros[0];
                    }
                } else {
                    if (trim($datos['clientesBusq']) !== '') {
                        $partes = explode('--', $datos['clientesBusq']);
                        $idResidencial = intval(trim($partes[0]));
                        $filtro = "residencial.idResidencial = $idResidencial";
                        if ($reporteOBJ->buscarResidencial($filtro) > 0) {
                            $buscarresidencial = $reporteOBJ->registros[0];
                        }
                    }
                }
            }            
            verVista($evento, $buscarresidencial);
            break;

         case vCORPORATIVOS:
            $buscarcorporativo = array();
             $buscarcorporativo = array(
                    'idResidencial' => '',
                    'idCuenta' => '',
                    'cliente' => '',
                    'identificacion' => '',
                );
            if (array_key_exists('nit', $datos) && array_key_exists('clientesCorpBusq', $datos)) {
                $buscarcorporativo = array(
                    'idResidencial' => '',
                    'idCuenta' => '',
                    'cliente' => '',
                    'identificacion' => '',
                );
                if (trim($datos['nit']) !== '') {
                    $filtro = "corporativo.nit = '" . trim($datos['nit']) . "'";
                    if ($reporteOBJ->buscarCorporativo($filtro) > 0) {
                        $buscarcorporativo = $reporteOBJ->registros[0];
                    }
                } else {
                    if (trim($datos['clientesCorpBusq']) !== '') {
                        $partes = explode('--', $datos['clientesCorpBusq']);
                        $idCorporativo = intval(trim($partes[0]));
                        $filtro = "corporativo.idCorporativo = $idCorporativo";
                        if ($reporteOBJ->buscarCorporativo($filtro) > 0) {
                            $buscarcorporativo = $reporteOBJ->registros[0];
                        }
                    }
                }
            }            
            verVista($evento, $buscarcorporativo);
            break;
        case vORDENES:
            if (array_key_exists('idCorporativo', $datos)) {
                if ($datos['idCorporativo'] != 0) {
                    $idCorporativo = $datos['idCorporativo'];
                    $filtro = " WHERE corporativo.idCorporativo2C = $idCorporativo";
                    $reporteOBJ->getOrdenesCorp($filtro);
                    setTablaOrdenes($reporteOBJ->registros);
                    $filtro = " WHERE corporativo.idCorporativo = $idCorporativo LIMIT 1";
                    $reporteOBJ->getCorporativo($filtro);
                    $datos = array_merge($datos, $reporteOBJ->registros[0]);
                    $datos['tipoCliente'] = 'Corporativo';
                    $datos['desde'] = 'corporativo';
                }
            }
            if (array_key_exists('idResidencial', $datos)) {
                if ($datos['idResidencial'] != 0) {
                    $idResidencial = $datos['idResidencial'];
                    $filtro = " WHERE residencial.idResidencial2C = $idResidencial";
                    $reporteOBJ->getOrdenesRes($filtro);
                    setTablaOrdenes($reporteOBJ->registros);
                    $filtro = " WHERE residencial.idResidencial = $idResidencial LIMIT 1";
                    $reporteOBJ->getResidencial($filtro);
                    $datos = array_merge($datos, $reporteOBJ->registros[0]);
                    $datos['tipoCliente'] = 'Residencial';
                    $datos['desde'] = 'residencial';
                }
            }
            $datos['ordenar'] = '[[0, "desc"]]';
            $datos['mensaje'] = "A continuaci�n se listan todas las Ordenes de Trabajo asignadas al Cliente.";
            verVista($evento, $datos);
            break;
        case vFACTURAS:
            if (array_key_exists('idCorporativo', $datos)) {
                if ($datos['idCorporativo'] != 0) {
                    $idContrato = 0;
                    if (array_key_exists('idContrato', $datos)) {
                        $idContrato = $datos['idContrato'];
                    }
                    $idCorporativo = $datos['idCorporativo'];
                    $filtro = " WHERE corporativo.idCorporativo = $idCorporativo AND factura.estado != 'Anulada'";
                    if ($idContrato != 0) {
                        $filtro = " INNER JOIN contrato_factura ON factura.idFactura = contrato_factura.idFactura 
                                WHERE factura.estado != 'Anulada' 
                                 AND factura.idCorporativo = $idCorporativo 
                                 AND contrato_factura.idContrato = $idContrato";
                    }
                    $reporteOBJ->getFacturasCorp($filtro);
                    setTablaFacturas($reporteOBJ->registros);
                    $filtro = " WHERE corporativo.idCorporativo = $idCorporativo LIMIT 1";
                    $reporteOBJ->getCorporativo($filtro);
                    $datos = array_merge($datos, $reporteOBJ->registros[0]);
                    $datos['idCorporativo'] = $idCorporativo;
                    $datos['idResidencial'] = 0;
                    $datos['tipoCliente'] = 'Corporativo';
                    $datos['desde'] = 'corporativo';
                }
            }
            if (array_key_exists('idResidencial', $datos)) {
                if ($datos['idResidencial'] != 0) {
                    $idContrato = 0;
                    if (array_key_exists('idContrato', $datos)) {
                        $idContrato = $datos['idContrato'];
                    }
                    $idResidencial = $datos['idResidencial'];
                    $filtro = " WHERE residencial.idResidencial = $idResidencial AND factura.estado != 'Anulada'";
                    if ($idContrato != 0) {
                        $filtro = " INNER JOIN contrato_factura ON factura.idFactura = contrato_factura.idFactura 
                                WHERE factura.estado != 'Anulada' 
                                 AND factura.idResidencial = $idResidencial 
                                 AND contrato_factura.idContrato = $idContrato";
                    }
                    $reporteOBJ->getFacturasRes($filtro);
                    setTablaFacturas($reporteOBJ->registros);
                    $filtro = " WHERE residencial.idResidencial = $idResidencial LIMIT 1";
                    $reporteOBJ->getResidencial($filtro);
                    $datos = array_merge($datos, $reporteOBJ->registros[0]);
                    $datos['idCorporativo'] = 0;
                    $datos['idResidencial'] = $idResidencial;
                    $datos['tipoCliente'] = 'Residencial';
                    $datos['desde'] = 'residencial';
                }
            }
            $datos['ordenar'] = '[[0, "desc"]]';
            $datos['mensaje'] = "A continuaci�n se listan todas las Facturas generadas al Cliente.";
            verVista($evento, $datos);
            break;
        case vRECAUDOS:
            if (array_key_exists('idCorporativo', $datos)) {
                if ($datos['idCorporativo'] != 0) {
                    $idCorporativo = $datos['idCorporativo'];
                    $filtro = " WHERE recaudo.idCorporativo = $idCorporativo";
                    $reporteOBJ->getRecaudosCorp($filtro);
                    setTablaRecaudos($reporteOBJ->registros);
                    $filtro = " WHERE corporativo.idCorporativo = $idCorporativo LIMIT 1";
                    $reporteOBJ->getCorporativo($filtro);
                    $datos = array_merge($datos, $reporteOBJ->registros[0]);
                    $datos['tipoCliente'] = 'Corporativo';
                    $datos['desde'] = 'corporativo';
                }
            }
            if (array_key_exists('idResidencial', $datos)) {
                if ($datos['idResidencial'] != 0) {
                    $idResidencial = $datos['idResidencial'];
                    $filtro = " WHERE recaudo.idResidencial = $idResidencial";
                    $reporteOBJ->getRecaudosRes($filtro);
                    setTablaRecaudos($reporteOBJ->registros);
                    $filtro = " WHERE residencial.idResidencial = $idResidencial LIMIT 1";
                    $reporteOBJ->getResidencial($filtro);
                    $datos = array_merge($datos, $reporteOBJ->registros[0]);
                    $datos['tipoCliente'] = 'Residencial';
                    $datos['desde'] = 'residencial';
                }
            }
            $datos['ordenar'] = '[[0, "desc"]]';
            $datos['mensaje'] = "A continuaci�n se listan todos los Recaudos realizados por el Cliente.";
            verVista($evento, $datos);
            break;
        case vGENERAR_REPORTE:
            $accesoGenerarReporte = array(1, 2, 121, 283, 405, 427, 489, 503, 553, 589, 627, 649, 671, 682, 685, 717, 735, 761, 805, 926);
            if (in_array($_SESSION['ID_USUARIO'], $accesoGenerarReporte)) {
                $datos['mensaje'] = '';
                verVista($evento, $datos);
            } else {
                header("location: /sw2click/modulos/secciones/seccionReportes");
            }
            break;
        case vCOMERCIAL:
            $accesoReportesComercial = array(1, 2, 121, 212, 283, 372, 405, 489, 503, 553, 589, 627, 671, 682, 685, 702, 717, 735, 761, 805, 926);
            if (in_array($_SESSION['ID_USUARIO'], $accesoReportesComercial)) {
                $datos['mensaje'] = '';
                verVista($evento, $datos);
            } else {
                header("location: /sw2click/modulos/secciones/seccionReportes");
            }
            break;
        case vCALLCENTER:
            $accesoReportesCallcenter = array(1, 283, 685, 735, 761, 805, 926);
            if (in_array($_SESSION['ID_USUARIO'], $accesoReportesCallcenter)) {
                $datos['mensaje'] = '';
                verVista($evento, $datos);
            } else {
                header("location: /sw2click/modulos/secciones/seccionReportes");
            }
            break;
        case vNOC:
            $accesoReportesNOC = array(1, 283, 685, 735, 761, 805, 926);
            if (in_array($_SESSION['ID_USUARIO'], $accesoReportesNOC)) {
                $datos['mensaje'] = '';
                verVista($evento, $datos);
            } else {
                header("location: /sw2click/modulos/secciones/seccionReportes");
            }
            break;
        case GENERAR_INFORME:
            $accesoGenerarReporte = array(1, 2, 121, 212, 283, 372, 405, 427, 489, 503, 553, 589, 627, 649, 671, 682, 685, 702, 717, 735, 761, 805, 926);
            if (in_array($_SESSION['ID_USUARIO'], $accesoGenerarReporte)) {
                $meses = array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
                $objReader = new \PHPExcel_Reader_Excel2007();
                switch ($datos['tipoReporte']) {
                    case 2:
//                        var_dump(is_readable('../../public/html/reportes/plantilla_reporte_ingresos.xlsx'));
                        $objExcel = $objReader->load('../../public/html/reportes/plantilla_reporte_ingresos_delta.xlsx');
                        $objExcel->setActiveSheetIndex(0);
                        $objActSheet = $objExcel->getActiveSheet();
                        $titulo = 'REPORTE DE INGRESOS ' . strtoupper($datos['segmento']) . ' - de ' . $datos['fechaInicio'] . ' a ' . $datos['fechaFin'] . ' _ ' . date('Y-m-d His');
//                        if (array_key_exists('mes', $datos)) {
//                            $titulo .= ' ' . strtoupper($meses[$datos['mes'] - 1]);
//                        }
//                        $objActSheet->setTitle(strtoupper($meses[$datos['mes'] - 1]) . ' ' . $datos['anio']);
                        $fila = 2;
                        $limBorder = 0;
                        $objStyle = $objActSheet->getStyle('A' . $fila);
//                        $ingresos = $reporteOBJ->getInfoReporteIngresos($datos['anio'], $datos['mes'], $datos['segmento']);
                        $ingresos = $reporteOBJ->getInfoReporteIngresos($datos['fechaInicio'], $datos['fechaFin'], $datos['segmento']);
                        if ($datos['segmento'] == 'Empresarial') {
                            foreach ($ingresos as $ingreso) {
                                $objActSheet->setCellValue('A' . $fila, '4145.70.02');
                                $objActSheet->setCellValue('B' . $fila, 'Gravadas');
                                $objActSheet->setCellValue('C' . $fila, $ingreso['IDENTIFICACION']);
                                $objActSheet->setCellValue('D' . $fila, $ingreso['CLIENTE']);
                                $objActSheet->setCellValue('E' . $fila, $ingreso['VLR_BASE']);
                                $objActSheet->setCellValue('F' . $fila, '0');
                                $objActSheet->setCellValue('G' . $fila, 'C');
                                $objActSheet->setCellValue('H' . $fila, '');
                                $objActSheet->setCellValue('I' . $fila, '1');
                                $objActSheet->setCellValue('J' . $fila, $ingreso['NUM_FACTURA'] . ' ' . $ingreso['PERIODO_FACTURADO'] . ' ' . $ingreso['MUNICIPIO'] . '-' . $ingreso['DEPARTAMENTO']);
                                $objActSheet->setCellValue('K' . $fila, $ingreso['RECAUDADO_POR']);
                                $fila ++;

                                $objActSheet->setCellValue('A' . $fila, '2408.02.01');
                                $objActSheet->setCellValue('B' . $fila, 'IVA generado 19 %');
                                $objActSheet->setCellValue('C' . $fila, $ingreso['IDENTIFICACION']);
                                $objActSheet->setCellValue('D' . $fila, $ingreso['CLIENTE']);
                                $objActSheet->setCellValue('E' . $fila, $ingreso['VLR_IVA']);
                                $objActSheet->setCellValue('F' . $fila, $ingreso['VLR_BASE']);
                                $objActSheet->setCellValue('G' . $fila, 'C');
                                $objActSheet->setCellValue('H' . $fila, '');
                                $objActSheet->setCellValue('I' . $fila, '1');
                                $objActSheet->setCellValue('J' . $fila, $ingreso['NUM_FACTURA'] . ' ' . $ingreso['PERIODO_FACTURADO'] . ' ' . $ingreso['MUNICIPIO'] . '-' . $ingreso['DEPARTAMENTO']);
                                $objActSheet->setCellValue('K' . $fila, $ingreso['RECAUDADO_POR']);
                                $fila ++;

                                if ($ingreso['VLR_RETE_IVA'] != 0) {
                                    $objActSheet->setCellValue('A' . $fila, '2367.05');
                                    $objActSheet->setCellValue('B' . $fila, 'Reteiva');
                                    $objActSheet->setCellValue('C' . $fila, $ingreso['IDENTIFICACION']);
                                    $objActSheet->setCellValue('D' . $fila, $ingreso['CLIENTE']);
                                    $objActSheet->setCellValue('E' . $fila, $ingreso['VLR_RETE_IVA']);
                                    $objActSheet->setCellValue('F' . $fila, $ingreso['VLR_IVA']);
                                    $objActSheet->setCellValue('G' . $fila, 'D');
                                    $objActSheet->setCellValue('H' . $fila, '');
                                    $objActSheet->setCellValue('I' . $fila, '1');
                                    $objActSheet->setCellValue('J' . $fila, $ingreso['NUM_FACTURA'] . ' ' . $ingreso['PERIODO_FACTURADO'] . ' ' . $ingreso['MUNICIPIO'] . '-' . $ingreso['DEPARTAMENTO']);
                                    $objActSheet->setCellValue('K' . $fila, $ingreso['RECAUDADO_POR']);
                                    $fila ++;
                                }

                                if ($ingreso['VLR_RETE_FUENTE'] != 0) {
                                    $objActSheet->setCellValue('A' . $fila, '2365.25.01');
                                    $objActSheet->setCellValue('B' . $fila, 'Servicios 4%');
                                    $objActSheet->setCellValue('C' . $fila, $ingreso['IDENTIFICACION']);
                                    $objActSheet->setCellValue('D' . $fila, $ingreso['CLIENTE']);
                                    $objActSheet->setCellValue('E' . $fila, $ingreso['VLR_RETE_FUENTE']);
                                    $objActSheet->setCellValue('F' . $fila, $ingreso['VLR_BASE']);
                                    $objActSheet->setCellValue('G' . $fila, 'D');
                                    $objActSheet->setCellValue('H' . $fila, '');
                                    $objActSheet->setCellValue('I' . $fila, '1');
                                    $objActSheet->setCellValue('J' . $fila, $ingreso['NUM_FACTURA'] . ' ' . $ingreso['PERIODO_FACTURADO'] . ' ' . $ingreso['MUNICIPIO'] . '-' . $ingreso['DEPARTAMENTO']);
                                    $objActSheet->setCellValue('K' . $fila, $ingreso['RECAUDADO_POR']);
                                    $fila ++;
                                }

                                if ($ingreso['VLR_RETE_ICA'] != 0) {
                                    $objActSheet->setCellValue('A' . $fila, '2368.01');
                                    $objActSheet->setCellValue('B' . $fila, 'Reteica');
                                    $objActSheet->setCellValue('C' . $fila, $ingreso['IDENTIFICACION']);
                                    $objActSheet->setCellValue('D' . $fila, $ingreso['CLIENTE']);
                                    $objActSheet->setCellValue('E' . $fila, $ingreso['VLR_RETE_ICA']);
                                    $objActSheet->setCellValue('F' . $fila, $ingreso['VLR_BASE']);
                                    $objActSheet->setCellValue('G' . $fila, 'D');
                                    $objActSheet->setCellValue('H' . $fila, '');
                                    $objActSheet->setCellValue('I' . $fila, '1');
                                    $objActSheet->setCellValue('J' . $fila, $ingreso['NUM_FACTURA'] . ' ' . $ingreso['PERIODO_FACTURADO'] . ' ' . $ingreso['MUNICIPIO'] . '-' . $ingreso['DEPARTAMENTO']);
                                    $objActSheet->setCellValue('K' . $fila, $ingreso['RECAUDADO_POR']);
                                    $fila ++;
                                }

                                if ($ingreso['VLR_ESTAMPILLAS'] != 0) {
                                    $objActSheet->setCellValue('A' . $fila, '5295.50');
                                    $objActSheet->setCellValue('B' . $fila, 'ESTAMPILLAS');
                                    $objActSheet->setCellValue('C' . $fila, $ingreso['IDENTIFICACION']);
                                    $objActSheet->setCellValue('D' . $fila, $ingreso['CLIENTE']);
                                    $objActSheet->setCellValue('E' . $fila, $ingreso['VLR_ESTAMPILLAS']);
                                    $objActSheet->setCellValue('F' . $fila, '0');
                                    $objActSheet->setCellValue('G' . $fila, 'D');
                                    $objActSheet->setCellValue('H' . $fila, '');
                                    $objActSheet->setCellValue('I' . $fila, '1');
                                    $objActSheet->setCellValue('J' . $fila, $ingreso['NUM_FACTURA'] . ' ' . $ingreso['PERIODO_FACTURADO'] . ' ' . $ingreso['MUNICIPIO'] . '-' . $ingreso['DEPARTAMENTO']);
                                    $objActSheet->setCellValue('K' . $fila, $ingreso['RECAUDADO_POR']);
                                    $fila ++;
                                }

                                $objActSheet->setCellValue('A' . $fila, '1305.05.01');
                                $objActSheet->setCellValue('B' . $fila, 'Nacionales ');
                                $objActSheet->setCellValue('C' . $fila, $ingreso['IDENTIFICACION']);
                                $objActSheet->setCellValue('D' . $fila, $ingreso['CLIENTE']);
                                $objActSheet->setCellValue('E' . $fila, $ingreso['VLR_RECAUDO']);
                                $objActSheet->setCellValue('F' . $fila, '0');
                                $objActSheet->setCellValue('G' . $fila, 'D');
                                $objActSheet->setCellValue('H' . $fila, '');
                                $objActSheet->setCellValue('I' . $fila, '1');
                                $objActSheet->setCellValue('J' . $fila, $ingreso['NUM_FACTURA'] . ' ' . $ingreso['PERIODO_FACTURADO'] . ' ' . $ingreso['MUNICIPIO'] . '-' . $ingreso['DEPARTAMENTO']);
                                $objActSheet->setCellValue('K' . $fila, $ingreso['RECAUDADO_POR']);
                                $fila ++;
                            }
                        } else if ($datos['segmento'] == 'Masivo Hogar') {
                            foreach ($ingresos as $ingreso) {
                                $objActSheet->setCellValue('A' . $fila, '1305.05.01');
                                $objActSheet->setCellValue('B' . $fila, 'Nacionales');
                                $objActSheet->setCellValue('C' . $fila, $ingreso['IDENTIFICACION']);
                                $objActSheet->setCellValue('D' . $fila, $ingreso['CLIENTE']);
                                $objActSheet->setCellValue('E' . $fila, $ingreso['VLR_RECAUDO']);
                                $objActSheet->setCellValue('F' . $fila, '');
                                $objActSheet->setCellValue('G' . $fila, 'D');
                                $objActSheet->setCellValue('H' . $fila, '');
                                $objActSheet->setCellValue('I' . $fila, '1');
                                $objActSheet->setCellValue('J' . $fila, $ingreso['NUM_FACTURA'] . ' ' . $ingreso['PERIODO_FACTURADO'] . ' ' . $ingreso['MUNICIPIO'] . '-' . $ingreso['DEPARTAMENTO']);
                                $objActSheet->setCellValue('K' . $fila, $ingreso['RECAUDADO_POR']);
                                $fila ++;

                                if (intval($ingreso['POR_INSTALACION']) == 0) {
                                    $porservicio = true;
                                    $conceptos = explode('||', $ingreso['CONCEPTOS_FACTURA']);
                                    foreach ($conceptos as $concepto) {
                                        if (strpos($concepto, 'TRASLADO') !== FALSE || strpos($concepto, 'MIGRACION') !== FALSE) {
                                            $objActSheet->setCellValue('A' . $fila, '4135.01');
                                            $objActSheet->setCellValue('B' . $fila, 'Servicios Adicionales');
                                            $objActSheet->setCellValue('C' . $fila, $ingreso['IDENTIFICACION']);
                                            $objActSheet->setCellValue('D' . $fila, $ingreso['CLIENTE']);
                                            $objActSheet->setCellValue('E' . $fila, $ingreso['VLR_BASE']);
                                            $objActSheet->setCellValue('F' . $fila, '');
                                            $objActSheet->setCellValue('G' . $fila, 'C');
                                            $objActSheet->setCellValue('H' . $fila, '');
                                            $objActSheet->setCellValue('I' . $fila, '1');
                                            $objActSheet->setCellValue('J' . $fila, $ingreso['NUM_FACTURA'] . ' ' . $ingreso['PERIODO_FACTURADO'] . ' ' . $ingreso['MUNICIPIO'] . '-' . $ingreso['DEPARTAMENTO']);
                                            $objActSheet->setCellValue('K' . $fila, $ingreso['RECAUDADO_POR']);
                                            $fila ++;
                                            $porservicio = false;
                                        } elseif (strpos($concepto, 'EQUIPO') !== FALSE || strpos($concepto, 'ROUTER') !== FALSE || strpos($concepto, 'DECO') !== FALSE) {
                                            $objActSheet->setCellValue('A' . $fila, '4135.04');
                                            $objActSheet->setCellValue('B' . $fila, 'Equipo Comunicacion');
                                            $objActSheet->setCellValue('C' . $fila, $ingreso['IDENTIFICACION']);
                                            $objActSheet->setCellValue('D' . $fila, $ingreso['CLIENTE']);
                                            $objActSheet->setCellValue('E' . $fila, $ingreso['VLR_BASE']);
                                            $objActSheet->setCellValue('F' . $fila, '');
                                            $objActSheet->setCellValue('G' . $fila, 'C');
                                            $objActSheet->setCellValue('H' . $fila, '');
                                            $objActSheet->setCellValue('I' . $fila, '1');
                                            $objActSheet->setCellValue('J' . $fila, $ingreso['NUM_FACTURA'] . ' ' . $ingreso['PERIODO_FACTURADO'] . ' ' . $ingreso['MUNICIPIO'] . '-' . $ingreso['DEPARTAMENTO']);
                                            $objActSheet->setCellValue('K' . $fila, $ingreso['RECAUDADO_POR']);
                                            $fila ++;
                                            $porservicio = false;
                                        }
                                    }
                                    if ($porservicio) {
                                        $objActSheet->setCellValue('A' . $fila, '4145.70.01');
                                        $objActSheet->setCellValue('B' . $fila, 'Excluidas');
                                        $objActSheet->setCellValue('C' . $fila, $ingreso['IDENTIFICACION']);
                                        $objActSheet->setCellValue('D' . $fila, $ingreso['CLIENTE']);
                                        $objActSheet->setCellValue('E' . $fila, $ingreso['VLR_BASE']);
                                        $objActSheet->setCellValue('F' . $fila, '');
                                        $objActSheet->setCellValue('G' . $fila, 'C');
                                        $objActSheet->setCellValue('H' . $fila, '');
                                        $objActSheet->setCellValue('I' . $fila, '1');
                                        $objActSheet->setCellValue('J' . $fila, $ingreso['NUM_FACTURA'] . ' ' . $ingreso['PERIODO_FACTURADO'] . ' ' . $ingreso['MUNICIPIO'] . '-' . $ingreso['DEPARTAMENTO']);
                                        $objActSheet->setCellValue('K' . $fila, $ingreso['RECAUDADO_POR']);
                                        $fila ++;
                                    }
                                } else {
                                    $objActSheet->setCellValue('A' . $fila, '4145.70.03');
                                    $objActSheet->setCellValue('B' . $fila, 'Instalaciones');
                                    $objActSheet->setCellValue('C' . $fila, $ingreso['IDENTIFICACION']);
                                    $objActSheet->setCellValue('D' . $fila, $ingreso['CLIENTE']);
                                    $objActSheet->setCellValue('E' . $fila, $ingreso['VLR_BASE']);
                                    $objActSheet->setCellValue('F' . $fila, '');
                                    $objActSheet->setCellValue('G' . $fila, 'C');
                                    $objActSheet->setCellValue('H' . $fila, '');
                                    $objActSheet->setCellValue('I' . $fila, '1');
                                    $objActSheet->setCellValue('J' . $fila, $ingreso['NUM_FACTURA'] . ' ' . $ingreso['PERIODO_FACTURADO'] . ' ' . $ingreso['MUNICIPIO'] . '-' . $ingreso['DEPARTAMENTO']);
                                    $objActSheet->setCellValue('K' . $fila, $ingreso['RECAUDADO_POR']);
                                    $fila ++;
                                }

                                if ($ingreso['VLR_OTROS_DESCUENTOS'] != 0 || $ingreso['VLR_DESCUENTO_POR_FALLAS'] != 0) {
                                    $objActSheet->setCellValue('A' . $fila, '5295.95');
                                    $objActSheet->setCellValue('B' . $fila, 'Otros');
                                    $objActSheet->setCellValue('C' . $fila, $ingreso['IDENTIFICACION']);
                                    $objActSheet->setCellValue('D' . $fila, $ingreso['CLIENTE']);
                                    $objActSheet->setCellValue('E' . $fila, intval(trim($ingreso['VLR_OTROS_DESCUENTOS'])) + intval(trim($ingreso['VLR_DESCUENTO_POR_FALLAS'])));
                                    $objActSheet->setCellValue('F' . $fila, '');
                                    $objActSheet->setCellValue('G' . $fila, 'D');
                                    $objActSheet->setCellValue('H' . $fila, '');
                                    $objActSheet->setCellValue('I' . $fila, '1');
                                    $objActSheet->setCellValue('J' . $fila, $ingreso['NUM_FACTURA'] . ' ' . $ingreso['PERIODO_FACTURADO'] . ' ' . $ingreso['MUNICIPIO'] . '-' . $ingreso['DEPARTAMENTO']);
                                    $objActSheet->setCellValue('K' . $fila, $ingreso['RECAUDADO_POR']);
                                    $fila ++;
                                }
                            }
                        } else if ($datos['segmento'] == 'Masivo Negocios') {
                            foreach ($ingresos as $ingreso) {
                                $objActSheet->setCellValue('A' . $fila, '1305.05.01');
                                $objActSheet->setCellValue('B' . $fila, 'Nacionales');
                                $objActSheet->setCellValue('C' . $fila, $ingreso['IDENTIFICACION']);
                                $objActSheet->setCellValue('D' . $fila, $ingreso['CLIENTE']);
                                $objActSheet->setCellValue('E' . $fila, $ingreso['VLR_RECAUDO']);
                                $objActSheet->setCellValue('F' . $fila, '');
                                $objActSheet->setCellValue('G' . $fila, 'D');
                                $objActSheet->setCellValue('H' . $fila, '');
                                $objActSheet->setCellValue('I' . $fila, '1');
                                $objActSheet->setCellValue('J' . $fila, $ingreso['NUM_FACTURA'] . ' ' . $ingreso['PERIODO_FACTURADO'] . ' ' . $ingreso['MUNICIPIO'] . '-' . $ingreso['DEPARTAMENTO']);
                                $objActSheet->setCellValue('K' . $fila, $ingreso['RECAUDADO_POR']);
                                $fila ++;

                                if (intval($ingreso['POR_INSTALACION']) == 0) {
                                    $porservicio = true;
                                    $conceptos = explode('||', $ingreso['CONCEPTOS_FACTURA']);
                                    foreach ($conceptos as $concepto) {
                                        if (strpos($concepto, 'TRASLADO') !== FALSE || strpos($concepto, 'MIGRACION') !== FALSE) {
                                            $objActSheet->setCellValue('A' . $fila, '4135.01');
                                            $objActSheet->setCellValue('B' . $fila, 'Servicios Adicionales');
                                            $objActSheet->setCellValue('C' . $fila, $ingreso['IDENTIFICACION']);
                                            $objActSheet->setCellValue('D' . $fila, $ingreso['CLIENTE']);
                                            $objActSheet->setCellValue('E' . $fila, $ingreso['VLR_BASE']);
                                            $objActSheet->setCellValue('F' . $fila, '');
                                            $objActSheet->setCellValue('G' . $fila, 'C');
                                            $objActSheet->setCellValue('H' . $fila, '');
                                            $objActSheet->setCellValue('I' . $fila, '1');
                                            $objActSheet->setCellValue('J' . $fila, $ingreso['NUM_FACTURA'] . ' ' . $ingreso['PERIODO_FACTURADO'] . ' ' . $ingreso['MUNICIPIO'] . '-' . $ingreso['DEPARTAMENTO']);
                                            $objActSheet->setCellValue('K' . $fila, $ingreso['RECAUDADO_POR']);
                                            $fila ++;
                                            $porservicio = false;
                                        } elseif (strpos($concepto, 'EQUIPO') !== FALSE || strpos($concepto, 'ROUTER') !== FALSE || strpos($concepto, 'DECO') !== FALSE) {
                                            $objActSheet->setCellValue('A' . $fila, '4135.04');
                                            $objActSheet->setCellValue('B' . $fila, 'Equipo Comunicacion');
                                            $objActSheet->setCellValue('C' . $fila, $ingreso['IDENTIFICACION']);
                                            $objActSheet->setCellValue('D' . $fila, $ingreso['CLIENTE']);
                                            $objActSheet->setCellValue('E' . $fila, $ingreso['VLR_BASE']);
                                            $objActSheet->setCellValue('F' . $fila, '');
                                            $objActSheet->setCellValue('G' . $fila, 'C');
                                            $objActSheet->setCellValue('H' . $fila, '');
                                            $objActSheet->setCellValue('I' . $fila, '1');
                                            $objActSheet->setCellValue('J' . $fila, $ingreso['NUM_FACTURA'] . ' ' . $ingreso['PERIODO_FACTURADO'] . ' ' . $ingreso['MUNICIPIO'] . '-' . $ingreso['DEPARTAMENTO']);
                                            $objActSheet->setCellValue('K' . $fila, $ingreso['RECAUDADO_POR']);
                                            $fila ++;
                                            $porservicio = false;
                                        }
                                    }
                                    if ($porservicio) {
                                        $objActSheet->setCellValue('A' . $fila, '4145.70.01');
                                        $objActSheet->setCellValue('B' . $fila, 'Excluidas');
                                        $objActSheet->setCellValue('C' . $fila, $ingreso['IDENTIFICACION']);
                                        $objActSheet->setCellValue('D' . $fila, $ingreso['CLIENTE']);
                                        $objActSheet->setCellValue('E' . $fila, $ingreso['VLR_BASE']);
                                        $objActSheet->setCellValue('F' . $fila, '');
                                        $objActSheet->setCellValue('G' . $fila, 'C');
                                        $objActSheet->setCellValue('H' . $fila, '');
                                        $objActSheet->setCellValue('I' . $fila, '1');
                                        $objActSheet->setCellValue('J' . $fila, $ingreso['NUM_FACTURA'] . ' ' . $ingreso['PERIODO_FACTURADO'] . ' ' . $ingreso['MUNICIPIO'] . '-' . $ingreso['DEPARTAMENTO']);
                                        $objActSheet->setCellValue('K' . $fila, $ingreso['RECAUDADO_POR']);
                                        $fila ++;
                                    }
                                } else {
                                    $objActSheet->setCellValue('A' . $fila, '4145.70.03');
                                    $objActSheet->setCellValue('B' . $fila, 'Instalaciones');
                                    $objActSheet->setCellValue('C' . $fila, $ingreso['IDENTIFICACION']);
                                    $objActSheet->setCellValue('D' . $fila, $ingreso['CLIENTE']);
                                    $objActSheet->setCellValue('E' . $fila, $ingreso['VLR_BASE']);
                                    $objActSheet->setCellValue('F' . $fila, '');
                                    $objActSheet->setCellValue('G' . $fila, 'C');
                                    $objActSheet->setCellValue('H' . $fila, '');
                                    $objActSheet->setCellValue('I' . $fila, '1');
                                    $objActSheet->setCellValue('J' . $fila, $ingreso['NUM_FACTURA'] . ' ' . $ingreso['PERIODO_FACTURADO'] . ' ' . $ingreso['MUNICIPIO'] . '-' . $ingreso['DEPARTAMENTO']);
                                    $objActSheet->setCellValue('K' . $fila, $ingreso['RECAUDADO_POR']);
                                    $fila ++;
                                }

                                $descProntoPago = 0;
                                if ($ingreso['APLICA_PRONTO_PAGO'] == 1) {
                                    $netoRecaudo = intval($ingreso['VLR_RECAUDO']) + intval($ingreso['VLR_RETE_IVA']) + intval($ingreso['VLR_RETE_FUENTE']) + intval($ingreso['VLR_RETE_ICA']) + intval($ingreso['VLR_ESTAMPILLAS']) + intval($ingreso['VLR_OTROS_DESCUENTOS']) + intval($ingreso['VLR_DESCUENTO_POR_FALLAS']);
                                    if (intval($ingreso['VLR_PRONTO_PAGO']) == $netoRecaudo) {
                                        $descProntoPago = intval($ingreso['VLR_TOTAL']) - intval($ingreso['VLR_PRONTO_PAGO']);
                                    }
                                }

                                if ($ingreso['VLR_OTROS_DESCUENTOS'] != 0 || $ingreso['VLR_DESCUENTO_POR_FALLAS'] != 0 || $descProntoPago != 0) {
                                    $objActSheet->setCellValue('A' . $fila, '5295.95');
                                    $objActSheet->setCellValue('B' . $fila, 'Otros');
                                    $objActSheet->setCellValue('C' . $fila, $ingreso['IDENTIFICACION']);
                                    $objActSheet->setCellValue('D' . $fila, $ingreso['CLIENTE']);
                                    $objActSheet->setCellValue('E' . $fila, intval(trim($ingreso['VLR_OTROS_DESCUENTOS'])) + intval(trim($ingreso['VLR_DESCUENTO_POR_FALLAS'])) + $descProntoPago);
                                    $objActSheet->setCellValue('F' . $fila, '');
                                    $objActSheet->setCellValue('G' . $fila, 'C');
                                    $objActSheet->setCellValue('H' . $fila, '');
                                    $objActSheet->setCellValue('I' . $fila, '1');
                                    $objActSheet->setCellValue('J' . $fila, $ingreso['NUM_FACTURA'] . ' ' . $ingreso['PERIODO_FACTURADO'] . ' ' . $ingreso['MUNICIPIO'] . '-' . $ingreso['DEPARTAMENTO']);
                                    $objActSheet->setCellValue('K' . $fila, $ingreso['RECAUDADO_POR']);
                                    $fila ++;
                                }

//                            $infoCaja = $reporteOBJ->getInfoCajaRecaudadora($ingreso['CONCEPTO_RECAUDO']);
//                            $objActSheet->setCellValue('V' . $fila, $infoCaja['caja']);
//                            $objActSheet->setCellValue('W' . $fila, $infoCaja['cajero']);
//                                $fila ++;
//                                $limBorder = $fila - 1;
                            }
                        } else if ($datos['segmento'] == 'Proyectos') {
                            foreach ($ingresos as $ingreso) {
                                if ($ingreso['VLR_RECAUDO'] != 0) {
                                    $objActSheet->setCellValue('A' . $fila, '4145.70.02');
                                    $objActSheet->setCellValue('B' . $fila, 'Gravadas');
                                    $objActSheet->setCellValue('C' . $fila, $ingreso['IDENTIFICACION']);
                                    $objActSheet->setCellValue('D' . $fila, $ingreso['CLIENTE']);
                                    $objActSheet->setCellValue('E' . $fila, $ingreso['VLR_RECAUDO']);
                                    $objActSheet->setCellValue('F' . $fila, '0');
                                    $objActSheet->setCellValue('G' . $fila, 'C');
                                    $objActSheet->setCellValue('H' . $fila, '');
                                    $objActSheet->setCellValue('I' . $fila, '1');
                                    $objActSheet->setCellValue('J' . $fila, $ingreso['NUM_FACTURA'] . ' ' . $ingreso['PERIODO_FACTURADO'] . ' ' . $ingreso['MUNICIPIO'] . '-' . $ingreso['DEPARTAMENTO']);
                                    $objActSheet->setCellValue('K' . $fila, $ingreso['RECAUDADO_POR']);
                                    $fila ++;
                                }

                                $objActSheet->setCellValue('A' . $fila, '2408.02.01');
                                $objActSheet->setCellValue('B' . $fila, 'IVA generado 19 %');
                                $objActSheet->setCellValue('C' . $fila, $ingreso['IDENTIFICACION']);
                                $objActSheet->setCellValue('D' . $fila, $ingreso['CLIENTE']);
                                $objActSheet->setCellValue('E' . $fila, $ingreso['VLR_IVA']);
                                $objActSheet->setCellValue('F' . $fila, $ingreso['VLR_BASE']);
                                $objActSheet->setCellValue('G' . $fila, 'C');
                                $objActSheet->setCellValue('H' . $fila, '');
                                $objActSheet->setCellValue('I' . $fila, '1');
                                $objActSheet->setCellValue('J' . $fila, $ingreso['NUM_FACTURA'] . ' ' . $ingreso['PERIODO_FACTURADO'] . ' ' . $ingreso['MUNICIPIO'] . '-' . $ingreso['DEPARTAMENTO']);
                                $objActSheet->setCellValue('K' . $fila, $ingreso['RECAUDADO_POR']);
                                $fila ++;

                                if ($ingreso['VLR_RETE_IVA'] != 0) {
                                    $objActSheet->setCellValue('A' . $fila, '2367.05');
                                    $objActSheet->setCellValue('B' . $fila, 'Reteiva');
                                    $objActSheet->setCellValue('C' . $fila, $ingreso['IDENTIFICACION']);
                                    $objActSheet->setCellValue('D' . $fila, $ingreso['CLIENTE']);
                                    $objActSheet->setCellValue('E' . $fila, $ingreso['VLR_RETE_IVA']);
                                    $objActSheet->setCellValue('F' . $fila, $ingreso['VLR_IVA']);
                                    $objActSheet->setCellValue('G' . $fila, 'D');
                                    $objActSheet->setCellValue('H' . $fila, '');
                                    $objActSheet->setCellValue('I' . $fila, '1');
                                    $objActSheet->setCellValue('J' . $fila, $ingreso['NUM_FACTURA'] . ' ' . $ingreso['PERIODO_FACTURADO'] . ' ' . $ingreso['MUNICIPIO'] . '-' . $ingreso['DEPARTAMENTO']);
                                    $objActSheet->setCellValue('K' . $fila, $ingreso['RECAUDADO_POR']);
                                    $fila ++;
                                }

                                if ($ingreso['VLR_RETE_FUENTE'] != 0) {
                                    $objActSheet->setCellValue('A' . $fila, '2365.25.01');
                                    $objActSheet->setCellValue('B' . $fila, 'Servicios 4%');
                                    $objActSheet->setCellValue('C' . $fila, $ingreso['IDENTIFICACION']);
                                    $objActSheet->setCellValue('D' . $fila, $ingreso['CLIENTE']);
                                    $objActSheet->setCellValue('E' . $fila, $ingreso['VLR_RETE_FUENTE']);
                                    $objActSheet->setCellValue('F' . $fila, $ingreso['VLR_BASE']);
                                    $objActSheet->setCellValue('G' . $fila, 'D');
                                    $objActSheet->setCellValue('H' . $fila, '');
                                    $objActSheet->setCellValue('I' . $fila, '1');
                                    $objActSheet->setCellValue('J' . $fila, $ingreso['NUM_FACTURA'] . ' ' . $ingreso['PERIODO_FACTURADO'] . ' ' . $ingreso['MUNICIPIO'] . '-' . $ingreso['DEPARTAMENTO']);
                                    $objActSheet->setCellValue('K' . $fila, $ingreso['RECAUDADO_POR']);
                                    $fila ++;
                                }

                                if ($ingreso['VLR_RETE_ICA'] != 0) {
                                    $objActSheet->setCellValue('A' . $fila, '2368.01');
                                    $objActSheet->setCellValue('B' . $fila, 'Reteica');
                                    $objActSheet->setCellValue('C' . $fila, $ingreso['IDENTIFICACION']);
                                    $objActSheet->setCellValue('D' . $fila, $ingreso['CLIENTE']);
                                    $objActSheet->setCellValue('E' . $fila, $ingreso['VLR_RETE_ICA']);
                                    $objActSheet->setCellValue('F' . $fila, '0');
                                    $objActSheet->setCellValue('G' . $fila, 'D');
                                    $objActSheet->setCellValue('H' . $fila, '');
                                    $objActSheet->setCellValue('I' . $fila, '1');
                                    $objActSheet->setCellValue('J' . $fila, $ingreso['NUM_FACTURA'] . ' ' . $ingreso['PERIODO_FACTURADO'] . ' ' . $ingreso['MUNICIPIO'] . '-' . $ingreso['DEPARTAMENTO']);
                                    $objActSheet->setCellValue('K' . $fila, $ingreso['RECAUDADO_POR']);
                                    $fila ++;
                                }

                                if ($ingreso['VLR_ESTAMPILLAS'] != 0) {
                                    $objActSheet->setCellValue('A' . $fila, '5295.5');
                                    $objActSheet->setCellValue('B' . $fila, 'ESTAMPILLAS');
                                    $objActSheet->setCellValue('C' . $fila, $ingreso['IDENTIFICACION']);
                                    $objActSheet->setCellValue('D' . $fila, $ingreso['CLIENTE']);
                                    $objActSheet->setCellValue('E' . $fila, $ingreso['VLR_ESTAMPILLAS']);
                                    $objActSheet->setCellValue('F' . $fila, '0');
                                    $objActSheet->setCellValue('G' . $fila, 'D');
                                    $objActSheet->setCellValue('H' . $fila, '');
                                    $objActSheet->setCellValue('I' . $fila, '1');
                                    $objActSheet->setCellValue('J' . $fila, $ingreso['NUM_FACTURA'] . ' ' . $ingreso['PERIODO_FACTURADO'] . ' ' . $ingreso['MUNICIPIO'] . '-' . $ingreso['DEPARTAMENTO']);
                                    $objActSheet->setCellValue('K' . $fila, $ingreso['RECAUDADO_POR']);
                                    $fila ++;
                                }

                                $objActSheet->setCellValue('A' . $fila, '1305.05.01');
                                $objActSheet->setCellValue('B' . $fila, 'Nacionales');
                                $objActSheet->setCellValue('C' . $fila, $ingreso['IDENTIFICACION']);
                                $objActSheet->setCellValue('D' . $fila, $ingreso['CLIENTE']);
                                $objActSheet->setCellValue('E' . $fila, $ingreso['VLR_BASE']);
                                $objActSheet->setCellValue('F' . $fila, '0');
                                $objActSheet->setCellValue('G' . $fila, 'D');
                                $objActSheet->setCellValue('H' . $fila, '');
                                $objActSheet->setCellValue('I' . $fila, '1');
                                $objActSheet->setCellValue('J' . $fila, $ingreso['NUM_FACTURA'] . ' ' . $ingreso['PERIODO_FACTURADO'] . ' ' . $ingreso['MUNICIPIO'] . '-' . $ingreso['DEPARTAMENTO']);
                                $objActSheet->setCellValue('K' . $fila, $ingreso['RECAUDADO_POR']);
                                $fila ++;
                            }
                        }

                        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        header('Content-Disposition: attachment;filename="' . $titulo . '.xlsx"');
                        header('Cache-Control: max-age=1');
                        header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
                        header('Cache-Control: cache, must-revalidate');
                        header('Pragma: public');

                        $objWriter = \PHPExcel_IOFactory::createWriter($objExcel, 'Excel2007');
                        $objWriter->save('php://output');
                        break;
                    case 3:
                        $fechaHoy = $datos['fechaHoy'];
                        $datos['mes'] = 0;
                        $datos['anio'] = 0;
                        $objExcel = $objReader->load('../../public/html/reportes/plantilla_reporte_ventas_mensuales.xlsx');
                        $objExcel->setActiveSheetIndex(0);
                        $objActSheet = $objExcel->getActiveSheet();
                        $titulo = 'DOBLECLICK SOFTWARE E INGENIERIA S.A.S. - REPORTE DE VENTAS ';
                        if (array_key_exists('mes', $datos)) {
                            $titulo .= ' ' . strtoupper($meses[$datos['mes'] - 1]);
                        }
                        $titulo .= ' ' . $datos['anio'] . ' _ ' . date('Y-m-d H:i:s');
                        $fila = 9;
                        $limBorder = 0;
                        $objStyle = $objActSheet->getStyle('A' . $fila);
                        $ventasCorp = $reporteOBJ->getReporteVentasCorp($fechaHoy, $datos['mes'], $datos['anio']);
                        foreach ($ventasCorp as $venta) {
                            $objActSheet->setCellValue('A' . $fila, $venta['ID_CLIENTE']);
                            $objActSheet->setCellValue('B' . $fila, $venta['IDENTIFICACION']);
                            $objActSheet->setCellValue('C' . $fila, $venta['CLIENTE']);
                            $objActSheet->setCellValue('D' . $fila, $venta['SERVICIO']);
                            $objActSheet->setCellValue('E' . $fila, $venta['VEL_BAJADA']);
                            $objActSheet->setCellValue('F' . $fila, $venta['VEL_BAJADA']);
                            $objActSheet->setCellValue('G' . $fila, $venta['UBICACION']);
                            $objActSheet->setCellValue('H' . $fila, $venta['DIR_INSTALACION']);
                            $objActSheet->setCellValue('I' . $fila, $venta['FECHA_INICIO']);
                            $objActSheet->setCellValue('J' . $fila, $venta['DURACION']);
                            $objActSheet->setCellValue('K' . $fila, $venta['FECHA_ACTIVACION']);
                            $objActSheet->setCellValue('L' . $fila, $venta['VALOR_MENSUAL']);
                            $objActSheet->setCellValue('M' . $fila, $venta['VALOR_INSTALACION']);
                            $objActSheet->setCellValue('N' . $fila, $venta['VLR_TOTAL_CONTRATO']);
                            $objActSheet->setCellValue('O' . $fila, $venta['REGISTRADO_POR']);
                            $objActSheet->setCellValue('P' . $fila, $venta['FECHA_HORA_REG']);
                            $objActSheet->setCellValue('Q' . $fila, $venta['ESTADO']);
                            $fila ++;
                            $limBorder = $fila - 1;
                        }
                        $objActSheet->duplicateStyle($objStyle, 'A9:Q' . $limBorder);

                        $objActSheet->setCellValue('B3', $datos['anio']);
                        $objActSheet->setCellValue('B4', strtoupper($meses[$datos['mes'] - 1]));
                        $objActSheet->setCellValue('B5', count($ventasCorp));

                        $objExcel->setActiveSheetIndex(1);
                        $objActSheet = $objExcel->getActiveSheet();
                        $fila = 9;
                        $limBorder = 0;
                        $objStyle = $objActSheet->getStyle('A' . $fila);
                        $ventasRes = $reporteOBJ->getReporteVentasRes($fechaHoy, $datos['mes'], $datos['anio']);
                        foreach ($ventasRes as $venta) {
                            $objActSheet->setCellValue('A' . $fila, $venta['ID_CLIENTE']);
                            $objActSheet->setCellValue('B' . $fila, $venta['IDENTIFICACION']);
                            $objActSheet->setCellValue('C' . $fila, $venta['CLIENTE']);
                            $objActSheet->setCellValue('D' . $fila, $venta['SERVICIO']);
                            $objActSheet->setCellValue('E' . $fila, $venta['VEL_BAJADA']);
                            $objActSheet->setCellValue('F' . $fila, $venta['VEL_BAJADA']);
                            $objActSheet->setCellValue('G' . $fila, $venta['UBICACION']);
                            $objActSheet->setCellValue('H' . $fila, $venta['DIR_INSTALACION']);
                            $objActSheet->setCellValue('I' . $fila, $venta['FECHA_INICIO']);
                            $objActSheet->setCellValue('J' . $fila, $venta['DURACION']);
                            $objActSheet->setCellValue('K' . $fila, $venta['FECHA_ACTIVACION']);
                            $objActSheet->setCellValue('L' . $fila, $venta['VALOR_MENSUAL']);
                            $objActSheet->setCellValue('M' . $fila, $venta['VALOR_INSTALACION']);
                            $objActSheet->setCellValue('N' . $fila, $venta['VLR_TOTAL_CONTRATO']);
                            $objActSheet->setCellValue('O' . $fila, $venta['REGISTRADO_POR']);
                            $objActSheet->setCellValue('P' . $fila, $venta['FECHA_HORA_REG']);
                            $objActSheet->setCellValue('Q' . $fila, $venta['ESTADO']);
                            $fila ++;
                            $limBorder = $fila - 1;
                        }
                        $objActSheet->duplicateStyle($objStyle, 'A9:Q' . $limBorder);

                        $objActSheet->setCellValue('B3', $datos['anio']);
                        $objActSheet->setCellValue('B4', strtoupper($meses[$datos['mes'] - 1]));
                        $objActSheet->setCellValue('B5', count($ventasRes));

//                        $archivo = "REPORTE DE ABONADOS SUCURSAL  _ generado_" . date('Y-m-d H:i:s');
                        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        header('Content-Disposition: attachment;filename="' . $titulo . '.xlsx"');
                        header('Cache-Control: max-age=1');
                        header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
                        header('Cache-Control: cache, must-revalidate');
                        header('Pragma: public');

                        $objWriter = \PHPExcel_IOFactory::createWriter($objExcel, 'Excel2007');
                        $objWriter->save('php://output');
                        break;
                    case 4:
                        $fechaHoy = '';
                        $objExcel = $objReader->load('../../public/html/reportes/plantilla_reporte_ventas_mensuales.xlsx');
                        $objExcel->setActiveSheetIndex(0);
                        $objActSheet = $objExcel->getActiveSheet();
                        $titulo = 'DOBLECLICK SOFTWARE E INGENIERIA S.A.S. - REPORTE DE VENTAS ';
                        if (array_key_exists('mes', $datos)) {
                            $titulo .= ' ' . strtoupper($meses[$datos['mes'] - 1]);
                        }
                        $titulo .= ' ' . $datos['anio'] . ' _ ' . date('Y-m-d H:i:s');
                        $fila = 9;
                        $limBorder = 0;
                        $objStyle = $objActSheet->getStyle('A' . $fila);
                        $ventasCorp = $reporteOBJ->getReporteVentasCorp($fechaHoy, $datos['mes'], $datos['anio']);
                        foreach ($ventasCorp as $venta) {
                            $objActSheet->setCellValue('A' . $fila, $venta['ID_CLIENTE']);
                            $objActSheet->setCellValue('B' . $fila, $venta['IDENTIFICACION']);
                            $objActSheet->setCellValue('C' . $fila, $venta['CLIENTE']);
                            $objActSheet->setCellValue('D' . $fila, $venta['SERVICIO']);
                            $objActSheet->setCellValue('E' . $fila, $venta['VEL_BAJADA']);
                            $objActSheet->setCellValue('F' . $fila, $venta['VEL_BAJADA']);
                            $objActSheet->setCellValue('G' . $fila, $venta['UBICACION']);
                            $objActSheet->setCellValue('H' . $fila, $venta['DIR_INSTALACION']);
                            $objActSheet->setCellValue('I' . $fila, $venta['FECHA_INICIO']);
                            $objActSheet->setCellValue('J' . $fila, $venta['DURACION']);
                            $objActSheet->setCellValue('K' . $fila, $venta['FECHA_ACTIVACION']);
                            $objActSheet->setCellValue('L' . $fila, $venta['VALOR_MENSUAL']);
                            $objActSheet->setCellValue('M' . $fila, $venta['VALOR_INSTALACION']);
                            $objActSheet->setCellValue('N' . $fila, $venta['VLR_TOTAL_CONTRATO']);
                            if ($venta['REGISTRADO_POR'] == 'FREELANCE ZONA') {
                                $objActSheet->setCellValue('O' . $fila, $venta['REGISTRADO_POR_CONTRATO']);
                            } else {
                                $objActSheet->setCellValue('O' . $fila, $venta['REGISTRADO_POR']);
                            }
                            $objActSheet->setCellValue('P' . $fila, $venta['FECHA_HORA_REG']);
                            $objActSheet->setCellValue('Q' . $fila, $venta['ESTADO_SERVICIO']);
                            $objActSheet->setCellValue('R' . $fila, $venta['ESTADO_CONTRATO']);
                            $objActSheet->setCellValue('S' . $fila, $venta['TELEVISION']);
                            $objActSheet->setCellValue('T' . $fila, $venta['OBSERVACION']);
                            $objActSheet->setCellValue('U' . $fila, $venta['MOTIVO_ELIMINA']);
                            $objActSheet->setCellValue('V' . $fila, $venta['OBSERVACION_ELIMINA']);
                            $objActSheet->setCellValue('W' . $fila, $venta['CELULAR1']);
                            $objActSheet->setCellValue('X' . $fila, $venta['CELULAR2']);
                            $objActSheet->setCellValue('Y' . $fila, $venta['TELEFONO']);
                            $objActSheet->setCellValue('Z' . $fila, $venta['LEGALIZADO_POR']);
                            $objActSheet->setCellValue('AA' . $fila, $venta['FECHA_LEGAL']);
                            $fila ++;
                            $limBorder = $fila - 1;
                        }
                        $objActSheet->duplicateStyle($objStyle, 'A9:AA' . $limBorder);

                        $objActSheet->setCellValue('B3', $datos['anio']);
                        $objActSheet->setCellValue('B4', strtoupper($meses[$datos['mes'] - 1]));
                        $objActSheet->setCellValue('B5', count($ventasCorp));

                        $objExcel->setActiveSheetIndex(1);
                        $objActSheet = $objExcel->getActiveSheet();
                        $fila = 9;
                        $limBorder = 0;
                        $objStyle = $objActSheet->getStyle('A' . $fila);
                        $ventasRes = $reporteOBJ->getReporteVentasRes($fechaHoy, $datos['mes'], $datos['anio']);
                        foreach ($ventasRes as $venta) {
                            $objActSheet->setCellValue('A' . $fila, $venta['ID_CLIENTE']);
                            $objActSheet->setCellValue('B' . $fila, $venta['IDENTIFICACION']);
                            $objActSheet->setCellValue('C' . $fila, $venta['CLIENTE']);
                            $objActSheet->setCellValue('D' . $fila, $venta['SERVICIO']);
                            $objActSheet->setCellValue('E' . $fila, $venta['VEL_BAJADA']);
                            $objActSheet->setCellValue('F' . $fila, $venta['VEL_BAJADA']);
                            $objActSheet->setCellValue('G' . $fila, $venta['UBICACION']);
                            $objActSheet->setCellValue('H' . $fila, $venta['DIR_INSTALACION']);
                            $objActSheet->setCellValue('I' . $fila, $venta['FECHA_INICIO']);
                            $objActSheet->setCellValue('J' . $fila, $venta['DURACION']);
                            $objActSheet->setCellValue('K' . $fila, $venta['FECHA_ACTIVACION']);
                            $objActSheet->setCellValue('L' . $fila, $venta['VALOR_MENSUAL']);
                            $objActSheet->setCellValue('M' . $fila, $venta['VALOR_INSTALACION']);
                            $objActSheet->setCellValue('N' . $fila, $venta['VLR_TOTAL_CONTRATO']);
                            if ($venta['REGISTRADO_POR'] == 'FREELANCE ZONA') {
                                $objActSheet->setCellValue('O' . $fila, $venta['REGISTRADO_POR_CONTRATO']);
                            } else {
                                $objActSheet->setCellValue('O' . $fila, $venta['REGISTRADO_POR']);
                            }
                            $objActSheet->setCellValue('P' . $fila, $venta['FECHA_HORA_REG']);
                            $objActSheet->setCellValue('Q' . $fila, $venta['ESTADO_SERVICIO']);
                            $objActSheet->setCellValue('R' . $fila, $venta['ESTADO_CONTRATO']);
                            $objActSheet->setCellValue('S' . $fila, $venta['TELEVISION']);
                            $objActSheet->setCellValue('T' . $fila, $venta['OBSERVACION']);
                            $objActSheet->setCellValue('U' . $fila, $venta['MOTIVO_ELIMINA']);
                            $objActSheet->setCellValue('V' . $fila, $venta['OBSERVACION_ELIMINA']);
                            $objActSheet->setCellValue('W' . $fila, $venta['CELULAR1']);
                            $objActSheet->setCellValue('X' . $fila, $venta['CELULAR2']);
                            $objActSheet->setCellValue('Y' . $fila, $venta['TELEFONO']);
                            $objActSheet->setCellValue('Z' . $fila, $venta['LEGALIZADO_POR']);
                            $objActSheet->setCellValue('AA' . $fila, $venta['FECHA_LEGAL']);
                            $fila ++;
                            $limBorder = $fila - 1;
                        }
                        $objActSheet->duplicateStyle($objStyle, 'A9:AA' . $limBorder);

                        $objActSheet->setCellValue('B3', $datos['anio']);
                        $objActSheet->setCellValue('B4', strtoupper($meses[$datos['mes'] - 1]));
                        $objActSheet->setCellValue('B5', count($ventasRes));

//                        $archivo = "REPORTE DE ABONADOS SUCURSAL  _ generado_" . date('Y-m-d H:i:s');
                        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        header('Content-Disposition: attachment;filename="' . $titulo . '.xlsx"');
                        header('Cache-Control: max-age=1');
                        header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
                        header('Cache-Control: cache, must-revalidate');
                        header('Pragma: public');

                        $objWriter = \PHPExcel_IOFactory::createWriter($objExcel, 'Excel2007');
                        $objWriter->save('php://output');
                        break;
                    case 5:
                        $fechaini = $datos['fechaInicio'];
                        $fechafin = $datos['fechaFin'];
                        $objExcel = $objReader->load('../../public/html/reportes/plantilla_reporte_cartera_proformas.xlsx');
                        $objExcel->setActiveSheetIndex(0);
                        $objActSheet = $objExcel->getActiveSheet();
                        $titulo = "REPORTE DE CARTERA PROFORMAS desde $fechaini hasta $fechafin _ " . date('Y-m-d H:i:s');
                        $fila = 9;
                        $limBorder = 0;
                        $objStyle = $objActSheet->getStyle('A' . $fila);
                        $registros = $reporteOBJ->getCarteraProformasRes($fechaini, $fechafin);
                        foreach ($registros as $registro) {
                            $objActSheet->setCellValue('A' . $fila, $registro['ID_PROFORMA']);
                            $objActSheet->setCellValue('B' . $fila, $registro['UBICACION']);
                            $objActSheet->setCellValue('C' . $fila, $registro['ID_CLIENTE']);
                            $objActSheet->setCellValue('D' . $fila, $registro['CLIENTE']);
                            $objActSheet->setCellValue('E' . $fila, $registro['IDENTIFICACION']);
                            $objActSheet->setCellValue('F' . $fila, $registro['CELULAR1']);
                            $objActSheet->setCellValue('G' . $fila, $registro['CELULAR2']);
                            $objActSheet->setCellValue('H' . $fila, $registro['TELEFONO']);
                            $objActSheet->setCellValue('I' . $fila, $registro['PERIODO']);
                            $objActSheet->setCellValue('J' . $fila, $registro['TOTAL_PAGO']);
                            $objActSheet->setCellValue('K' . $fila, $registro['ESTADO']);
                            $fila ++;
                            $limBorder = $fila - 1;
                        }
                        $objActSheet->duplicateStyle($objStyle, 'A9:K' . $limBorder);

                        $objActSheet->setCellValue('B3', $fechaini);
                        $objActSheet->setCellValue('B4', $fechafin);
                        $objActSheet->setCellValue('B5', count($registros));

                        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        header('Content-Disposition: attachment;filename="' . $titulo . '.xlsx"');
                        header('Cache-Control: max-age=1');
                        header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
                        header('Cache-Control: cache, must-revalidate');
                        header('Pragma: public');

                        $objWriter = \PHPExcel_IOFactory::createWriter($objExcel, 'Excel2007');
                        $objWriter->save('php://output');
                        break;
                    case 6:
                        $fechaHoy = '';
                        $objExcel = $objReader->load('../../public/html/reportes/plantilla_call_center.xlsx');
                        $objExcel->setActiveSheetIndex(0);
                        $objActSheet = $objExcel->getActiveSheet();
                        $titulo = 'DOBLECLICK SOFTWARE E INGENIERIA S.A.S. - REPORTE DE CALL CENTER ';
                        if ($datos['fechaHoy'] == '') {
                            if ($datos['mes'] == '' || $datos['anio'] == '') {
                                header("location: /sw2click/modulos/reportes/callcenter?msg=0");
                            } else {
                                $filtro = 'MONTH(llamada.fechaRecibido) = ' . $datos['mes'] . ' AND YEAR(llamada.fechaRecibido) = ' . $datos['anio'];
                                $objActSheet->setCellValue('A3', 'MES');
                                $objActSheet->setCellValue('B3', strtoupper($meses[$datos['mes'] - 1]));
                                $objActSheet->setCellValue('A4', 'ANIO');
                                $objActSheet->setCellValue('B4', $datos['anio']);
                                $titulo .= ' ' . strtoupper($meses[$datos['mes'] - 1]) . ' ' . $datos['anio'] . ' _ ' . date('Y-m-d H:i:s');
                            }
                        } else {
                            $filtro = "DATE(llamada.fechaRecibido) = '" . $datos['fechaHoy'] . "'";
                            $objActSheet->setCellValue('A4', 'FECHA');
                            $objActSheet->setCellValue('B4', $datos['fechaHoy']);
                            $titulo .= ' ' . $datos['fechaHoy'] . ' _ ' . date('Y-m-d H:i:s');
                        }
                        $fila = 9;
                        $limBorder = 0;
                        $objStyle = $objActSheet->getStyle('A' . $fila);
                        $registros = $reporteOBJ->getReporteCallCenter($filtro);
                        foreach ($registros as $registro) {
                            $objActSheet->setCellValue('A' . $fila, $registro['ID_TICKET']);
                            $objActSheet->setCellValue('B' . $fila, $registro['EMPLEADO_ASIGNADO']);
                            $objActSheet->setCellValue('C' . $fila, $registro['TIPO_CLIENTE']);
                            $objActSheet->setCellValue('D' . $fila, $registro['CLIENTE']);
                            $objActSheet->setCellValue('E' . $fila, $registro['UBICACION_CLIENTE']);
                            $objActSheet->setCellValue('F' . $fila, $registro['TIPO_TICKET']);
                            $objActSheet->setCellValue('G' . $fila, $registro['REGISTRADO_POR']);
                            $objActSheet->setCellValue('H' . $fila, $registro['FECHA_REGISTRO']);
                            $objActSheet->setCellValue('I' . $fila, $registro['FECHA_CIERRE']);
                            $objActSheet->setCellValue('J' . $fila, $registro['DURACION']);
                            $objActSheet->setCellValue('K' . $fila, $registro['ESTADO']);
                            $objActSheet->setCellValue('L' . $fila, $registro['ID_DANIO_MASIVO']);
                            $objActSheet->setCellValue('M' . $fila, $registro['reiteracion']);
                            $objActSheet->setCellValue('N' . $fila, $registro['SOLUCIONADA_POR']);
                            if ($registro['visitaTecnica'] == 1) {
                                $objActSheet->setCellValue('O' . $fila, 'SI');
                            } else {
                                $objActSheet->setCellValue('O' . $fila, 'NO');
                            }
                            $fila ++;
                            $limBorder = $fila - 1;
                        }
                        $objActSheet->duplicateStyle($objStyle, 'A9:O' . $limBorder);
                        $objActSheet->setCellValue('B5', count($registros));

                        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        header('Content-Disposition: attachment;filename="' . $titulo . '.xlsx"');
                        header('Cache-Control: max-age=1');
                        header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
                        header('Cache-Control: cache, must-revalidate');
                        header('Pragma: public');

                        $objWriter = \PHPExcel_IOFactory::createWriter($objExcel, 'Excel2007');
                        $objWriter->save('php://output');
                        break;
                    case 7:
                        $fechaHoy = '';
                        $objExcel = $objReader->load('../../public/html/reportes/plantilla_reporte_retiros.xlsx');
                        $objExcel->setActiveSheetIndex(0);
                        $objActSheet = $objExcel->getActiveSheet();
                        $titulo = 'DOBLECLICK SOFTWARE E INGENIERIA S.A.S. - REPORTE DE RETIROS ';
//                        if ($datos['fechaHoy'] == '') {
                        if ($datos['mes'] == '' || $datos['anio'] == '') {
                            header("location: /sw2click/modulos/reportes/comercial?msg=0");
                        } else {
                            $filtro = 'MONTH(retiro.fechaHoraReg) = ' . $datos['mes'] . ' AND YEAR(retiro.fechaHoraReg) = ' . $datos['anio'];
                            $objActSheet->setCellValue('A2', 'PERIODO DE BUSQUEDA: ' . strtoupper($meses[$datos['mes'] - 1]) . '-' . $datos['anio']);
                            $titulo .= ' ' . strtoupper($meses[$datos['mes'] - 1]) . '-' . $datos['anio'] . '  __' . date('Y-m-d H:i:s');
                        }
//                        } else {
//                            $filtro = "DATE(retiro.fechaHoraReg) = '" . $datos['fechaHoy'] . "'";
//                            $objActSheet->setCellValue('A2', 'PERIODO DE BUSQUEDA: ' . $datos['fechaHoy']);
//                            $titulo .= ' ' . $datos['fechaHoy'] . '  __' . date('Y-m-d H:i:s');
//                        }                        
                        $fila = 6;
                        $limBorder = 0;
                        $objStyle = $objActSheet->getStyle('A' . $fila);
                        $registros = $reporteOBJ->getReporteRetiros($filtro);
                        foreach ($registros as $registro) {
                            $objActSheet->setCellValue('A' . $fila, $registro['ID_RETIRO']);
                            $objActSheet->setCellValue('B' . $fila, $registro['CLIENTE']);
                            $objActSheet->setCellValue('C' . $fila, $registro['TELEFONOS']);
                            $objActSheet->setCellValue('D' . $fila, $registro['SERVICIO']);
                            $objActSheet->setCellValue('E' . $fila, $registro['UBICACION']);
                            $objActSheet->setCellValue('F' . $fila, $registro['DIR_INSTALACION']);
                            $objActSheet->setCellValue('G' . $fila, $registro['REGISTRADO_POR']);
                            $objActSheet->setCellValue('H' . $fila, $registro['FECHA_REGISTRO']);
                            $objActSheet->setCellValue('I' . $fila, $registro['ESTADO']);
                            $objActSheet->setCellValue('J' . $fila, $registro['MOTIVO']);
                            $objActSheet->setCellValue('K' . $fila, $registro['OBSERVACIONES']);
                            $fila ++;
                            $limBorder = $fila - 1;
                        }
                        $objActSheet->duplicateStyle($objStyle, 'A9:K' . $limBorder);
                        $objActSheet->setCellValue('A3', 'REGISTROS ENCONTRADOS: ' . count($registros));

                        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        header('Content-Disposition: attachment;filename="' . $titulo . '.xlsx"');
                        header('Cache-Control: max-age=1');
                        header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
                        header('Cache-Control: cache, must-revalidate');
                        header('Pragma: public');

                        $objWriter = \PHPExcel_IOFactory::createWriter($objExcel, 'Excel2007');
                        $objWriter->save('php://output');
                        break;
                    case 8:
                        $objExcel = $objReader->load('../../public/html/reportes/plantilla_reporte_migraciones.xlsx');
                        $objExcel->setActiveSheetIndex(0);
                        $objActSheet = $objExcel->getActiveSheet();
                        $fechaInicio = $datos['fechaInicio'];
                        $fechaFin = $datos['fechaFin'];
                        $titulo = "REPORTE DE MIGRACIONES DESDE $fechaInicio HASTA $fechaFin __ " . date('Y-m-d_His');
                        $fila = 9;
                        $limBorder = 0;
                        $objStyle = $objActSheet->getStyle('A' . $fila);
                        $migraciones = $reporteOBJ->getReporteMigraciones($fechaInicio, $fechaFin);
                        foreach ($migraciones as $migracion) {
                            $objActSheet->setCellValue('A' . $fila, $migracion['ID_OT']);
                            $objActSheet->setCellValue('B' . $fila, $migracion['TIPO_OT']);
                            $objActSheet->setCellValue('C' . $fila, $migracion['EMPLEADO_ASIGNADO']);
                            $objActSheet->setCellValue('D' . $fila, $migracion['CLIENTE']);
                            $objActSheet->setCellValue('E' . $fila, $migracion['AUTORIZADO_POR']);
                            $objActSheet->setCellValue('F' . $fila, $migracion['FECHA_SOLICITUD']);
                            $objActSheet->setCellValue('G' . $fila, $migracion['FECHA_REGISTRO_OT']);
                            $objActSheet->setCellValue('H' . $fila, $migracion['FECHA_SOLUCION_OT']);
                            $objActSheet->setCellValue('I' . $fila, $migracion['ESTADO']);
                            $objActSheet->setCellValue('J' . $fila, $migracion['SUPERVISADO_POR']);
                            $fila ++;
                            $limBorder = $fila - 1;
                        }
                        $objActSheet->duplicateStyle($objStyle, 'A9:J' . $limBorder);
                        $objActSheet->setCellValue('B3', $fechaInicio);
                        $objActSheet->setCellValue('B4', $fechaFin);
                        $objActSheet->setCellValue('B5', count($migraciones));

                        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        header('Content-Disposition: attachment;filename="' . $titulo . '.xlsx"');
                        header('Cache-Control: max-age=1');
                        header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
                        header('Cache-Control: cache, must-revalidate');
                        header('Pragma: public');

                        $objWriter = \PHPExcel_IOFactory::createWriter($objExcel, 'Excel2007');
                        $objWriter->save('php://output');
                        break;
                    case 9:
                        $objExcel = $objReader->load('../../public/html/reportes/plantilla_reporte_instalaciones.xlsx');
                        $objExcel->setActiveSheetIndex(0);
                        $objActSheet = $objExcel->getActiveSheet();
                        $fechaInicio = $datos['fechaInicio'];
                        $fechaFin = $datos['fechaFin'];
                        $titulo = "REPORTE DE INSTALACIONES DESDE $fechaInicio HASTA $fechaFin __ " . date('Y-m-d_His');
                        $fila = 9;
                        $limBorder = 0;
                        $objStyle = $objActSheet->getStyle('A' . $fila);
                        $instalaciones = $reporteOBJ->getReporteInstalaciones($fechaInicio, $fechaFin);
                        foreach ($instalaciones as $instalacion) {
                            $objActSheet->setCellValue('A' . $fila, $instalacion['idInstalacion']);
                            $objActSheet->setCellValue('B' . $fila, $instalacion['idAsignacion']);
                            $objActSheet->setCellValue('C' . $fila, $instalacion['tipo']);
                            $objActSheet->setCellValue('D' . $fila, $instalacion['idContrato']);
                            $objActSheet->setCellValue('E' . $fila, $instalacion['idCliente']);
                            $objActSheet->setCellValue('F' . $fila, $instalacion['cliente']);
                            $objActSheet->setCellValue('G' . $fila, $instalacion['ubicacionInstalacion']);
                            $objActSheet->setCellValue('H' . $fila, $instalacion['direccionInstalacion']);
                            $objActSheet->setCellValue('I' . $fila, $instalacion['fechaHoraReg']);
                            $objActSheet->setCellValue('J' . $fila, $instalacion['registradoPor']);
                            $objActSheet->setCellValue('K' . $fila, $instalacion['estado']);
                            $objActSheet->setCellValue('L' . $fila, $instalacion['observacion']);
                            $objActSheet->setCellValue('M' . $fila, $instalacion['FECHA_ACTIVACION']);
                            $objActSheet->setCellValue('N' . $fila, $instalacion['tecnologia']);
                            $fila ++;
                            $limBorder = $fila - 1;
                        }
                        $objActSheet->duplicateStyle($objStyle, 'A9:N' . $limBorder);
                        $objActSheet->setCellValue('B3', $fechaInicio);
                        $objActSheet->setCellValue('B4', $fechaFin);
                        $objActSheet->setCellValue('B5', count($instalaciones));

                        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        header('Content-Disposition: attachment;filename="' . $titulo . '.xlsx"');
                        header('Cache-Control: max-age=1');
                        header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
                        header('Cache-Control: cache, must-revalidate');
                        header('Pragma: public');

                        $objWriter = \PHPExcel_IOFactory::createWriter($objExcel, 'Excel2007');
                        $objWriter->save('php://output');
                        break;
                    case 10:
                        $objExcel = $objReader->load('../../public/html/reportes/plantilla_reporte_traslados.xlsx');
                        $objExcel->setActiveSheetIndex(0);
                        $objActSheet = $objExcel->getActiveSheet();
                        $fechaInicio = $datos['fechaInicio'];
                        $fechaFin = $datos['fechaFin'];
                        $titulo = "REPORTE DE TRASLADOS DESDE $fechaInicio HASTA $fechaFin __ " . date('Y-m-d_His');
                        $fila = 9;
                        $limBorder = 0;
                        $objStyle = $objActSheet->getStyle('A' . $fila);
                        $traslados = $reporteOBJ->getReporteTraslados($fechaInicio, $fechaFin);
                        foreach ($traslados as $traslado) {
                            $objActSheet->setCellValue('A' . $fila, $traslado['TIPO_OT']);
                            $objActSheet->setCellValue('B' . $fila, $traslado['ID_OT']);
                            $objActSheet->setCellValue('C' . $fila, $traslado['EMPLEADO_ASIGNADO']);
                            $objActSheet->setCellValue('D' . $fila, $traslado['CLIENTE']);
                            $objActSheet->setCellValue('E' . $fila, $traslado['AUTORIZADO_POR']);
                            $objActSheet->setCellValue('F' . $fila, $traslado['FECHA_SOLICITUD']);
                            $objActSheet->setCellValue('G' . $fila, $traslado['FECHA_REGISTRO_OT']);
                            $objActSheet->setCellValue('H' . $fila, $traslado['FECHA_SOLUCION_OT']);
                            $objActSheet->setCellValue('I' . $fila, $traslado['ESTADO']);
                            $objActSheet->setCellValue('J' . $fila, $traslado['SUPERVISADO_POR']);
                            $fila ++;
                            $limBorder = $fila - 1;
                        }
                        $objActSheet->duplicateStyle($objStyle, 'A9:J' . $limBorder);
                        $objActSheet->setCellValue('B3', $fechaInicio);
                        $objActSheet->setCellValue('B4', $fechaFin);
                        $objActSheet->setCellValue('B5', count($traslados));

                        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        header('Content-Disposition: attachment;filename="' . $titulo . '.xlsx"');
                        header('Cache-Control: max-age=1');
                        header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
                        header('Cache-Control: cache, must-revalidate');
                        header('Pragma: public');

                        $objWriter = \PHPExcel_IOFactory::createWriter($objExcel, 'Excel2007');
                        $objWriter->save('php://output');
                        break;
                    case 11:
                        $objExcel = $objReader->load('../../public/html/reportes/plantilla_reporte_soportetecnico.xlsx');
                        $objExcel->setActiveSheetIndex(0);
                        $objActSheet = $objExcel->getActiveSheet();
                        $fechaInicio = $datos['fechaInicio'];
                        $fechaFin = $datos['fechaFin'];
                        $titulo = "REPORTE DE SOPORTE TECNICO DESDE $fechaInicio HASTA $fechaFin __ " . date('Y-m-d_His');
                        $fila = 9;
                        $limBorder = 0;
                        $objStyle = $objActSheet->getStyle('A' . $fila);
                        $soportes = $reporteOBJ->getReporteSoporteTecnico($fechaInicio, $fechaFin);
                        foreach ($soportes as $soporte) {
                            $objActSheet->setCellValue('A' . $fila, $soporte['TIPO_OT']);
                            $objActSheet->setCellValue('B' . $fila, $soporte['ID_OT']);
                            $objActSheet->setCellValue('C' . $fila, $soporte['EMPLEADO_ASIGNADO']);
                            $objActSheet->setCellValue('D' . $fila, $soporte['CLIENTE']);
                            $objActSheet->setCellValue('E' . $fila, $soporte['UBICACION']);
                            $objActSheet->setCellValue('F' . $fila, $soporte['AUTORIZADO_POR']);
                            $objActSheet->setCellValue('G' . $fila, $soporte['FECHA_REGISTRO_OT']);
                            $objActSheet->setCellValue('H' . $fila, $soporte['FECHA_SOLUCION_OT']);
                            $objActSheet->setCellValue('I' . $fila, $soporte['ESTADO']);
                            $objActSheet->setCellValue('J' . $fila, $soporte['SUPERVISADO_POR']);
                            $fila ++;
                            $limBorder = $fila - 1;
                        }
                        $objActSheet->duplicateStyle($objStyle, 'A9:J' . $limBorder);
                        $objActSheet->setCellValue('B3', $fechaInicio);
                        $objActSheet->setCellValue('B4', $fechaFin);
                        $objActSheet->setCellValue('B5', count($soportes));

                        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        header('Content-Disposition: attachment;filename="' . $titulo . '.xlsx"');
                        header('Cache-Control: max-age=1');
                        header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
                        header('Cache-Control: cache, must-revalidate');
                        header('Pragma: public');

                        $objWriter = \PHPExcel_IOFactory::createWriter($objExcel, 'Excel2007');
                        $objWriter->save('php://output');
                        break;
                    case 12:
                        $objExcel = $objReader->load('../../public/html/reportes/plantilla_reporte_soportetecnico.xlsx');
                        $objExcel->setActiveSheetIndex(0);
                        $objActSheet = $objExcel->getActiveSheet();
                        $fechaInicio = $datos['fechaInicio'];
                        $fechaFin = $datos['fechaFin'];
                        $titulo = "REPORTE DE SOPORTE TECNICO DESDE $fechaInicio HASTA $fechaFin __ " . date('Y-m-d_His');
                        $fila = 9;
                        $limBorder = 0;
                        $objStyle = $objActSheet->getStyle('A' . $fila);
                        $soportes = $reporteOBJ->getReporteSoporteTecnico($fechaInicio, $fechaFin);
                        foreach ($soportes as $soporte) {
                            $objActSheet->setCellValue('A' . $fila, $soporte['TIPO_OT']);
                            $objActSheet->setCellValue('B' . $fila, $soporte['ID_OT']);
                            $objActSheet->setCellValue('C' . $fila, $soporte['EMPLEADO_ASIGNADO']);
                            $objActSheet->setCellValue('D' . $fila, $soporte['CLIENTE']);
                            $objActSheet->setCellValue('E' . $fila, $soporte['UBICACION']);
                            $objActSheet->setCellValue('F' . $fila, $soporte['AUTORIZADO_POR']);
                            $objActSheet->setCellValue('G' . $fila, $soporte['FECHA_REGISTRO_OT']);
                            $objActSheet->setCellValue('H' . $fila, $soporte['FECHA_SOLUCION_OT']);
                            $objActSheet->setCellValue('I' . $fila, $soporte['ESTADO']);
                            $objActSheet->setCellValue('J' . $fila, $soporte['SUPERVISADO_POR']);
                            $fila ++;
                            $limBorder = $fila - 1;
                        }
                        $objActSheet->duplicateStyle($objStyle, 'A9:J' . $limBorder);
                        $objActSheet->setCellValue('B3', $fechaInicio);
                        $objActSheet->setCellValue('B4', $fechaFin);
                        $objActSheet->setCellValue('B5', count($soportes));

                        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        header('Content-Disposition: attachment;filename="' . $titulo . '.xlsx"');
                        header('Cache-Control: max-age=1');
                        header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
                        header('Cache-Control: cache, must-revalidate');
                        header('Pragma: public');

                        $objWriter = \PHPExcel_IOFactory::createWriter($objExcel, 'Excel2007');
                        $objWriter->save('php://output');
                        break;
                }
                return;
            } else {
                header("location: /sw2click/modulos/secciones/seccionReportes");
            }
            break;
        case DESCARGAR:
            if (!isset($datos['nombreArchivo']) || empty($datos['nombreArchivo'])) {
                exit();
            }
            $archivo = basename($datos['nombreArchivo']);
            $ruta = DIRECTORIO . $archivo;
            if (is_file($ruta)) {
                header('Content-Type: application/force-download');
                header('Content-Disposition: attachment; filename=' . $archivo);
                header('Content-Transfer-Encoding: binary');
                header('Content-Length: ' . filesize($ruta));
                readfile($ruta);
            } else {
                exit();
            }
            break;
        case VER_RESPALDO:
            if (array_key_exists('idRecaudo', $datos)) {
                $numFactura = $reporteOBJ->getNumFactura($datos['idRecaudo']);
                $info = array();
                $idMovimiento = 0;
                $idCaja = 0;
                if ($reporteOBJ->buscarEnCajaBancos($numFactura)) {
                    $info = explode('@', $reporteOBJ->registros[0]['ID_MOVIMIENTO']);
                    $idMovimiento = $info[0];
                    $idCaja = $info[1];
                } elseif ($reporteOBJ->buscarEnCajaRecaudos($numFactura)) {
                    $info = explode('@', $reporteOBJ->registros[0]['ID_MOVIMIENTO']);
                    $idMovimiento = $info[0];
                    $idCaja = $info[1];
                    //echo $idMovimiento . '--' . $idCaja;
                } else {
                    $fechaHoraRecaudo = $reporteOBJ->getFechaRecaudoProforma($datos['idRecaudo']);
                    if ($reporteOBJ->buscarEnCajaRecaudosByFecha($fechaHoraRecaudo)) {
                        $info = explode('@', $reporteOBJ->registros[0]['ID_MOVIMIENTO']);
                        $idMovimiento = $info[0];
                        $idCaja = $info[1];
                    }
                }
                if ($idMovimiento != 0) {
                    $ruta = utf8_decode($reporteOBJ->getRutaRespaldo($idMovimiento, $idCaja));
                    $partesRuta = explode('/', $ruta);
                    //            print_r($partesRuta);
                    if ($partesRuta[2] != 'josandro') {
                        $ruta = '/' . $partesRuta[1] . '/josandro/' . $partesRuta[2] . '/' . $partesRuta[3];
                    }
                    if (is_file($ruta)) {
                        $extension = substr($ruta, -3, 3);
                        if (strtolower($extension) == 'pdf') {
                            header('Content-Type: application/pdf');
                        } else {
                            header('Content-Type: image/jpeg');
//                        echo '...'.$ruta;
                        }
                        readfile($ruta);
                    } else {
                        echo "<center>
                                <div style='font-family: sans-serif; padding: 50px'>
                                    <span style='color: #F00; font-weight: bold'>ERROR . . . NO se ha podido encontrar el Respaldo de este Movimiento de Caja.</span> <br><br><br>
                                    Esto puede ser debido a que <b>NO SE HA ADJUNTADO EL RESPALDO</b> o a un error en el Sistema.<br><br>
                                    Verifique los Respaldos anexados a este movimiento de caja dando click en la opcion <b>Ver Respaldos</b><br>
                                    ubicada en la parte superior de la tabla de movimientos de la caja personal.<br><br>
                                    Tambien puede comunicarse con el Administrador del Sistema (<span style='color: #00F'>software@dobleclick.net.co</span>).<br><br>
                                    <input type='button' name='cerrar' value='Cerrar' onClick='javascript:self.close();'>
                                <div>
                              </center>";
                        return;
                    }
                } else {
                    echo "<center>
                            <div style='font-family: sans-serif; padding: 50px'>
                                <span style='color: #F00; font-weight: bold'>ERROR . . . NO se ha podido encontrar el Respaldo de este Recaudo.</span> <br><br><br>
                                Esto puede ser debido a que <b>NO SE HA ADJUNTADO EL RESPALDO</b> o a un error en el Sistema.<br><br>
                                Verifique los Respaldos anexados a este movimiento de caja dando click en la opcion <b>Ver Respaldos</b><br>
                                ubicada en la parte superior de la tabla de movimientos de la caja personal.<br><br>
                                Tambien puede comunicarse con el Administrador del Sistema (<span style='color: #00F'>software@dobleclick.net.co</span>).<br><br>
                                <input type='button' name='cerrar' value='Cerrar' onClick='javascript:self.close();'>
                            <div>
                          </center>";
                    return;
                }
            } else {
                header("location: administracion?msg=0");
            }
            break;
    }
}

function getReporteContratacion($tipoContrato = '', $anio = '', $clasificacion = 0) {
    $objPHPExcel = new PHPExcel();
    $objPHPExcel->getProperties()->setCreator("Informe Contratacion $tipoContrato $anio")
            ->setLastModifiedBy($_SESSION['NOMBRES_APELLIDO_USUARIO'])
            ->setTitle("Informe Contratacion $tipoContrato $anio")
            ->setSubject("Informe Contratacion $tipoContrato $anio")
            ->setDescription("Informe Contratacion $tipoContrato $anio")
            ->setKeywords("Informe Contratacion $tipoContrato $anio")
            ->setCategory("Informe Contratacion $tipoContrato $anio");

    $reporteOBJ = new Reporte();
    $filtro = " WHERE contrato.clasificacion = $clasificacion 
                 AND contrato.estado != 'Cancelado'";
    if ($tipoContrato == 'Corporativo') {
        if ($reporteOBJ->getContratosCorpRptContratacion($filtro)) {
            $registros = $reporteOBJ->registros;
        } else {
            $registros = array();
        }
    } else {
        if ($reporteOBJ->getContratosResRptContratacion($filtro)) {
            $registros = $reporteOBJ->registros;
        } else {
            $registros = array();
        }
    }

    $estiloBorde = array(
        'borders' => array(
            'outline' => array(
                'style' => PHPExcel_Style_Border::BORDER_THIN,
                'color' => array('argb' => 'FF000000'),
            ),
        ),
    );

    $i = 1;
    foreach ($registros as $fila) {
        $inicio = $i;
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A' . $i, 'NUMERO CONTRATO');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('B' . $i, $fila['idContrato']);
        $i++;
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A' . $i, 'CLIENTE');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('B' . $i, $fila['cliente']);
        $i++;
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A' . $i, 'ESTADO');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('B' . $i, $fila['estado']);

        $objPHPExcel->getActiveSheet()->getStyle("A$inicio:A$i")->applyFromArray($estiloBorde);
        $objPHPExcel->getActiveSheet()->getStyle("B$inicio:B$i")->applyFromArray($estiloBorde);
        $objPHPExcel->getActiveSheet()->getStyle('A' . $inicio . ':A' . $i)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('A' . $inicio . ':A' . $i)->getFill()->getStartColor()->setARGB('DDDDDD');

        $idContrato = $fila['idContrato'];
        if ($tipoContrato == 'Corporativo') {
            $idCliente = $fila['idCorporativo'];
        } else {
            $idCliente = $fila['idResidencial'];
        }

        $filtro = " WHERE servicio.idContrato = $idContrato 
                     AND servicio.estado != 'Eliminado'";
        if ($reporteOBJ->getServiciosRptContratacion($filtro)) {
            $registros_1 = $reporteOBJ->registros;
        } else {
            $registros_1 = array();
        }

        $i++;
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A' . $i, 'ID SERVICIO');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('B' . $i, 'SERVICIO');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('C' . $i, 'UBICACION');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('D' . $i, 'FECHA INICIO');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('E' . $i, 'FECHA FIN');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('F' . $i, 'DURACION');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('G' . $i, 'PAGO MENSUAL');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('H' . $i, 'ESTADO');

        $objPHPExcel->getActiveSheet()->getStyle("A$i:H$i")->applyFromArray($estiloBorde);
        $objPHPExcel->getActiveSheet()->getStyle('A' . $i . ':H' . $i)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('A' . $i . ':H' . $i)->getFill()->getStartColor()->setARGB('DDDDDD');

        $i++;
        $inicio = $i;
        $fin = $inicio;
        foreach ($registros_1 as $fila_1) {
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A' . $i, $fila_1['idServicio']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('B' . $i, $fila_1['conceptoFacturacion']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('C' . $i, $fila_1['ubicacion']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('D' . $i, $fila_1['fechaInicio']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('E' . $i, $fila_1['fechaFin']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('F' . $i, $fila_1['duracion']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('G' . $i, $fila_1['totalPago']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('H' . $i, $fila_1['estado']);
            $fin = $i;
            $i++;
        }
        $objPHPExcel->getActiveSheet()->getStyle("G$inicio:G$fin")->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_CURRENCY_USD);
        $objPHPExcel->getActiveSheet()->getStyle("A$inicio:H$fin")->applyFromArray($estiloBorde);

//            echo "G$i _ =SUM(G$inicio:G$fin) <br>";
//            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('G' . $i, '=SUMA(G' . $inicio . ':G' . $fin . ')');
//            $objPHPExcel->getActiveSheet()->getStyle("A$i:H$i")->applyFromArray($estiloBorde);
//            $i++;

        if ($tipoContrato == 'Corporativo') {
            $filtro = " WHERE factura.idCorporativo = $idCliente 
                         AND factura.estado != 'Anulada' 
                         AND factura.anioFacturado = $anio";
        } else {
            $filtro = " WHERE factura.idResidencial = $idCliente 
                         AND factura.estado != 'Anulada' 
                         AND factura.anioFacturado = $anio";
        }
        if ($reporteOBJ->getFacturasRptContratacion($filtro)) {
            $registros_2 = $reporteOBJ->registros;
        } else {
            $registros_2 = array();
        }

        $i++;
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A' . $i, 'ID FACTURA');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('B' . $i, 'NUMERO FACTURA');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('C' . $i, 'PERIODO');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('D' . $i, 'A�O');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('E' . $i, 'TOTAL FACTURA');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('F' . $i, 'ESTADO');

        $objPHPExcel->getActiveSheet()->getStyle("A$i:F$i")->applyFromArray($estiloBorde);
        $objPHPExcel->getActiveSheet()->getStyle('A' . $i . ':F' . $i)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('A' . $i . ':F' . $i)->getFill()->getStartColor()->setARGB('DDDDDD');

        $i++;
        $inicio = $i;
        $fin = $inicio;
        foreach ($registros_2 as $fila_1) {
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A' . $i, $fila_1['idFactura']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('B' . $i, $fila_1['NUM_FACTURA']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('C' . $i, $fila_1['periodoFacturado']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('D' . $i, $fila_1['anioFacturado']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('E' . $i, $fila_1['totalFactura']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('F' . $i, $fila_1['estado']);
            $fin = $i;
            $i++;
        }
        $objPHPExcel->getActiveSheet()->getStyle("E$inicio:E$fin")->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_CURRENCY_USD);
        $objPHPExcel->getActiveSheet()->getStyle("A$inicio:F$fin")->applyFromArray($estiloBorde);

        $i++;
        $objPHPExcel->getActiveSheet()->getStyle('A' . $i . ':H' . $i)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('A' . $i . ':H' . $i)->getFill()->getStartColor()->setARGB('333333');
        $i = $i + 2;
    }

    $cont = 1;
    $rutaArchivo = DIRECTORIO . "Informe Contratacion $tipoContrato $anio.xlsx";
    $nombreArchivo = "Informe Contratacion $tipoContrato $anio.xlsx";
    while (file_exists($rutaArchivo)) {
        $rutaArchivo = DIRECTORIO . "Informe Contratacion $tipoContrato $anio ($cont).xlsx";
        $nombreArchivo = "Informe Contratacion $tipoContrato $anio ($cont).xlsx";
        $cont++;
    }

    try {
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        $objWriter->save($rutaArchivo);
        return $nombreArchivo;
    } catch (Exception $exc) {
        echo $exc->getTraceAsString();
        return 'ERROR';
    }

//    $objWriter->save('php://output');
}

function getReporteNovedades($mes = '', $anio = '') {
    $meses = array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
    $nombreMes = $meses[$mes - 1];
    $objPHPExcel = new PHPExcel();
    $objPHPExcel->getProperties()->setCreator("Informe Novedades Asistencia Empleados $mes $anio")
            ->setLastModifiedBy($_SESSION['NOMBRES_APELLIDO_USUARIO'])
            ->setTitle("Informe Novedades Asistencia Empleados $nombreMes $anio")
            ->setSubject("Informe Novedades Asistencia Empleados $nombreMes $anio")
            ->setDescription("Informe Novedades Asistencia Empleados $nombreMes $anio")
            ->setKeywords("Informe Novedades Asistencia Empleados $nombreMes $anio")
            ->setCategory("Informe Novedades Asistencia Empleados $nombreMes $anio");

    $objPHPExcel->createSheet(1);

    $objPHPExcel->setActiveSheetIndex(0);
    $objPHPExcel->getActiveSheet()->setTitle('CONSOLIDADO');

    $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('H')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('I')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('J')->setAutoSize(true);

    $objPHPExcel->getDefaultStyle()->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);

    $reporteOBJ = new Reporte();
    if ($reporteOBJ->getEmpleadosNovedades($mes)) {
        $empleados = $reporteOBJ->registros;
        $estiloBorde = array(
            'borders' => array(
                'allborders' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN
                )
            )
        );
        $estiloNegrita = array(
            'borders' => array(
                'allborders' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN
                )
            ),
            'font' => array(
                'bold' => true
            )
        );

        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A1', 'ID EMPLEADO');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('C1', 'DIAS NO LABORADOS');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('G1', 'DIAS ADICIONALES');

        $objPHPExcel->setActiveSheetIndex(0)->mergeCells('A1:B1');
        $objPHPExcel->setActiveSheetIndex(0)->mergeCells('C1:F1');
        $objPHPExcel->setActiveSheetIndex(0)->mergeCells('G1:J1');

        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A2', 'ID EMPLEADO');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('B2', 'EMPLEADO');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('C2', 'COMPLETO');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('D2', 'MEDIO DIA');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('E2', '1/4 DE DIA');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('F2', 'TOTAL');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('G2', 'COMPLETO');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('H2', 'MEDIO DIA');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('I2', '1/4 DE DIA');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('J2', 'TOTAL');

        $objPHPExcel->getActiveSheet()->getStyle('A1:J1')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('A1:J1')->getFill()->getStartColor()->setARGB('DDDDDD');

        $objPHPExcel->getActiveSheet()->getStyle('A2:J2')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('A2:J2')->getFill()->getStartColor()->setARGB('DDDDDD');

        $i = 3;
        foreach ($empleados as $fila) {
            $idEmpleado = $fila['idEmpleado'];
            $empleado = $fila['empleado'];
            $diasNOlaborados = $reporteOBJ->getNovedades($idEmpleado, 1, $mes, $anio, 0);
            $medioDiasNOlaborados = $reporteOBJ->getNovedades($idEmpleado, 2, $mes, $anio, 0);
            $cuartoDiasNOlaborados = $reporteOBJ->getNovedades($idEmpleado, 3, $mes, $anio, 0);

            $diasAdicionales = $reporteOBJ->getNovedades($idEmpleado, 1, $mes, $anio, 1);
            $medioDiasAdicionales = $reporteOBJ->getNovedades($idEmpleado, 2, $mes, $anio, 1);
            $cuartoDiasAdicionales = $reporteOBJ->getNovedades($idEmpleado, 3, $mes, $anio, 1);

            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A' . $i, $idEmpleado);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('B' . $i, $empleado);

            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('C' . $i, $diasNOlaborados);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('D' . $i, $medioDiasNOlaborados);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('E' . $i, $cuartoDiasNOlaborados);
            $formulaNOlaborados = '=C' . $i . '+(D' . $i . '*0.5)+(E' . $i . '*0.25)';
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('F' . $i, $formulaNOlaborados);

            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('G' . $i, $diasAdicionales);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('H' . $i, $medioDiasAdicionales);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('I' . $i, $cuartoDiasAdicionales);
            $formulaAdicionales = '=G' . $i . '+(H' . $i . '*0.5)+(I' . $i . '*0.25)';
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('J' . $i, $formulaAdicionales);
            $i++;
        }

        $hasta = $i - 1;
        $objPHPExcel->getActiveSheet()
                ->getStyle('B3:B' . $hasta)
                ->getAlignment()
                ->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);

        $objPHPExcel->getActiveSheet()->getStyle('F3:F' . $hasta)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('F3:F' . $hasta)->getFill()->getStartColor()->setARGB('FFFFAA');

        $objPHPExcel->getActiveSheet()->getStyle('J3:J' . $hasta)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('J3:J' . $hasta)->getFill()->getStartColor()->setARGB('FFFFAA');

        $objPHPExcel->getActiveSheet()->getStyle($objPHPExcel->getActiveSheet()->calculateWorksheetDimension())->applyFromArray($estiloBorde);

        $objPHPExcel->getActiveSheet()->getStyle('A1:J1')->applyFromArray($estiloNegrita);
        $objPHPExcel->getActiveSheet()->getStyle('A2:J2')->applyFromArray($estiloNegrita);

//******************************************************************************

        $objPHPExcel->setActiveSheetIndex(1);
        $objPHPExcel->getActiveSheet()->setTitle('DETALLES');

        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setAutoSize(true);

        $i = 1;
        foreach ($empleados as $fila_1) {
            $inicio = $i;
            $objPHPExcel->setActiveSheetIndex(1)->setCellValue('A' . $i, 'ID EMPLEADO');
            $objPHPExcel->setActiveSheetIndex(1)->setCellValue('B' . $i, $fila_1['idEmpleado']);
            $i++;
            $objPHPExcel->setActiveSheetIndex(1)->setCellValue('A' . $i, 'CEDULA');
            $objPHPExcel->setActiveSheetIndex(1)->setCellValue('B' . $i, $fila_1['cedula']);
            $i++;
            $objPHPExcel->setActiveSheetIndex(1)->setCellValue('A' . $i, 'NOMBRES');
            $objPHPExcel->setActiveSheetIndex(1)->setCellValue('B' . $i, $fila_1['nombres']);
            $i++;
            $objPHPExcel->setActiveSheetIndex(1)->setCellValue('A' . $i, 'APELLIDOS');
            $objPHPExcel->setActiveSheetIndex(1)->setCellValue('B' . $i, $fila_1['apellidos']);

            $objPHPExcel->getActiveSheet()->getStyle("A$inicio:A$i")->applyFromArray($estiloBorde);
            $objPHPExcel->getActiveSheet()->getStyle("B$inicio:B$i")->applyFromArray($estiloBorde);
            $objPHPExcel->getActiveSheet()->getStyle('A' . $inicio . ':A' . $i)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
            $objPHPExcel->getActiveSheet()->getStyle('A' . $inicio . ':A' . $i)->getFill()->getStartColor()->setARGB('DDDDDD');

            $idEmpleado = $fila_1['idEmpleado'];

            $filtro = " WHERE asistencia.idEmpleado = $idEmpleado 
                         AND MONTH(asistencia.fechaAsistencia) = $mes 
                         AND YEAR(asistencia.fechaAsistencia) = $anio";
            if ($reporteOBJ->getAsistenciaRptNovedades($filtro)) {
                $registros_1 = $reporteOBJ->registros;
            } else {
                $registros_1 = array();
            }

            $i++;
            $objPHPExcel->setActiveSheetIndex(1)->setCellValue('A' . $i, 'FECHA');
            $objPHPExcel->setActiveSheetIndex(1)->setCellValue('B' . $i, 'EMPLEADO');
            $objPHPExcel->setActiveSheetIndex(1)->setCellValue('C' . $i, 'ASISTE');
            $objPHPExcel->setActiveSheetIndex(1)->setCellValue('D' . $i, 'LABORA');
            $objPHPExcel->setActiveSheetIndex(1)->setCellValue('E' . $i, 'OBSERVACION');
            $objPHPExcel->setActiveSheetIndex(1)->setCellValue('F' . $i, 'FECHA REGISTRO');
            $objPHPExcel->setActiveSheetIndex(1)->setCellValue('G' . $i, 'REGISTRADO POR');

            $objPHPExcel->getActiveSheet()->getStyle("A$i:G$i")->applyFromArray($estiloBorde);
            $objPHPExcel->getActiveSheet()->getStyle('A' . $i . ':G' . $i)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
            $objPHPExcel->getActiveSheet()->getStyle('A' . $i . ':G' . $i)->getFill()->getStartColor()->setARGB('DDDDDD');

            $i++;
            $inicio = $i;
            $fin = $inicio;
            foreach ($registros_1 as $fila_2) {
                $objPHPExcel->setActiveSheetIndex(1)->setCellValue('A' . $i, $fila_2['fechaAsistencia']);
                $objPHPExcel->setActiveSheetIndex(1)->setCellValue('B' . $i, $fila_2['empleado']);
                $objPHPExcel->setActiveSheetIndex(1)->setCellValue('C' . $i, $fila_2['asiste']);
                $objPHPExcel->setActiveSheetIndex(1)->setCellValue('D' . $i, $fila_2['labora']);
                $objPHPExcel->setActiveSheetIndex(1)->setCellValue('E' . $i, $fila_2['observacion']);
                $objPHPExcel->setActiveSheetIndex(1)->setCellValue('F' . $i, $fila_2['fechaHoraReg']);
                $objPHPExcel->setActiveSheetIndex(1)->setCellValue('G' . $i, $fila_2['registradoPor']);
                $fin = $i;
                $i++;
            }
            $i++;
            $objPHPExcel->getActiveSheet()->getStyle('A' . $i . ':G' . $i)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
            $objPHPExcel->getActiveSheet()->getStyle('A' . $i . ':G' . $i)->getFill()->getStartColor()->setARGB('333333');
            $i = $i + 2;
        }

        $objPHPExcel->setActiveSheetIndex(0);
//******************************************************************************

        $cont = 1;
        $rutaArchivo = DIRECTORIO . "Informe Novedades Asistencia Empleados $nombreMes $anio.xlsx";
        $nombreArchivo = "Informe Novedades Asistencia Empleados $nombreMes $anio.xlsx";
        while (file_exists($rutaArchivo)) {
            $rutaArchivo = DIRECTORIO . "Informe Novedades Asistencia Empleados $nombreMes $anio ($cont).xlsx";
            $nombreArchivo = "Informe Novedades Asistencia Empleados $nombreMes $anio ($cont).xlsx";
            $cont++;
        }

        try {
            $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
            $objWriter->save($rutaArchivo);
            return $nombreArchivo;
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
            return 'ERROR';
        }
    } else {
        return 'SIN_DATOS';
    }

//    $objWriter->save('php://output');
}

function getReporteRecaudos($mes = '', $anio = '', $tipo = 0, $tipoFecha = 0) {
    $meses = array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
    $nombreMes = $meses[$mes - 1];

    $fechaSQL = 'fechaHoraRecaudo';
    $fechaTitulo = 'FECHA REGISTRO';

    $tipoRecaudo = 'CLIENTES';
    $filtro = '';

    switch ($tipoFecha) {
        case 1:
            $fechaSQL = 'fechaCobro';
            $fechaTitulo = 'FECHA COBRO';
            break;
        case 2:
            $fechaSQL = 'fechaPago';
            $fechaTitulo = 'FECHA PAGO';
            break;
        case 3:
            $fechaSQL = 'fechaHoraRecaudo';
            $fechaTitulo = 'FECHA REGISTRO';
            break;
    }

    $reporteOBJ = new Reporte();
    $recaudos = array();
    switch ($tipo) {// 1-->CORPORATIVOS GRANDES, 2-->CORPORATIVOS PEQUE�OS, 3-->RESIDENCIALES
        case 1:
            $tipoRecaudo = 'CORPORATIVOS GRANDES';
            $filtro = "WHERE corporativo.clasificacion = 1 
                        AND MONTH(recaudo.$fechaSQL) = $mes 
                        AND YEAR(recaudo.$fechaSQL) = $anio";
            if ($reporteOBJ->getInformeRecaudosCorp($filtro)) {
                $recaudos = $reporteOBJ->registros;
            }
            break;
        case 2:
            $tipoRecaudo = 'CORPORATIVOS PEQUENOS';
            $filtro = "WHERE corporativo.clasificacion != 1 
                        AND MONTH(recaudo.$fechaSQL) = $mes 
                        AND YEAR(recaudo.$fechaSQL) = $anio";
            if ($reporteOBJ->getInformeRecaudosCorp($filtro)) {
                $recaudos = $reporteOBJ->registros;
            }
            break;
        case 3:
            $tipoRecaudo = 'RESIDENCIALES';
            $filtro = "WHERE MONTH(recaudo.$fechaSQL) = $mes 
                        AND YEAR(recaudo.$fechaSQL) = $anio";
            if ($reporteOBJ->getInformeRecaudosRes($filtro)) {
                $recaudos = $reporteOBJ->registros;
            }
            break;
    }

    $objPHPExcel = new PHPExcel();
    $objPHPExcel->getProperties()->setCreator("INFORME RECAUDOS $tipoRecaudo _ $nombreMes $anio ($fechaTitulo)")
            ->setLastModifiedBy($_SESSION['NOMBRES_APELLIDO_USUARIO'])
            ->setTitle("INFORME RECAUDOS $tipoRecaudo _ $nombreMes $anio ($fechaTitulo)")
            ->setSubject("INFORME RECAUDOS $tipoRecaudo _ $nombreMes $anio ($fechaTitulo)")
            ->setDescription("INFORME RECAUDOS $tipoRecaudo _ $nombreMes $anio ($fechaTitulo)")
            ->setKeywords("INFORME RECAUDOS $tipoRecaudo _ $nombreMes $anio ($fechaTitulo)")
            ->setCategory("INFORME RECAUDOS $tipoRecaudo _ $nombreMes $anio ($fechaTitulo)");

    $objPHPExcel->setActiveSheetIndex(0);
    $objPHPExcel->getActiveSheet()->setTitle("$nombreMes $anio");

    $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('H')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('I')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('J')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('K')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('L')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('M')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('N')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('O')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('P')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('Q')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('R')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('S')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('T')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('U')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('V')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('W')->setAutoSize(true);
//    $objPHPExcel->getActiveSheet()->getColumnDimension('X')->setAutoSize(true);
//    $objPHPExcel->getActiveSheet()->getColumnDimension('T')->setAutoSize(true);
//    $objPHPExcel->getActiveSheet()->getColumnDimension('U')->setAutoSize(true);

    $objPHPExcel->getDefaultStyle()->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);

    if (!empty($recaudos)) {
        $estiloBorde = array(
            'borders' => array(
                'allborders' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN
                )
            )
        );
        $estiloNegrita = array(
            'borders' => array(
                'allborders' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN
                )
            ),
            'font' => array(
                'bold' => true
            )
        );

        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A1', 'ID RECAUDO');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('B1', 'EMPLEADO');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('C1', 'CLIENTE');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('D1', 'TIPO CLIENTE');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('E1', 'ID FACTURA');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('F1', 'NUMERO FACTURA');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('G1', 'FECHA RECAUDO');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('H1', 'FECHA PAGO');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('I1', 'FECHA COBRO');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('J1', 'CONCEPTO');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('K1', 'VALOR BASE');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('L1', 'VALOR IVA');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('M1', 'DEUDA');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('N1', 'DESCUENTO');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('O1', 'DESCUENTO PRONTO PAGO');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('P1', 'VALOR RECAUDO');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('Q1', 'RETEIVA');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('R1', 'RETEFUENTE');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('S1', 'RETEICA');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('T1', 'ESTAMPILLAS');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('U1', 'OTROS DESCUENTOS');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('V1', 'TIPO RECAUDO');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('W1', 'CAJA RECAUDO');
//        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('T1', 'CONCEPTO EN CAJA');
//        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('U1', 'VALOR EN CAJA');


        $objPHPExcel->getActiveSheet()->getStyle('A1:W1')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('A1:W1')->getFill()->getStartColor()->setARGB('DDDDDD');

        $i = 2;
        foreach ($recaudos as $fila) {
            if ($reporteOBJ->buscarRecaudoEnCajaMenor($fila['fechaHoraRecaudo'])) {
                $tipoCaja = 'Caja Menor';
                $conceptoCaja = $reporteOBJ->registros[0]['concepto'];
                $valorCaja = $reporteOBJ->registros[0]['valor'];
            } elseif ($reporteOBJ->buscarRecaudoEnCajaRecaudos($fila['fechaHoraRecaudo'])) {
                if ($reporteOBJ->registros[0]['idCajaPersonal'] == 34 || $reporteOBJ->registros[0]['idCajaPersonal'] == 105 || $reporteOBJ->registros[0]['idCajaPersonal'] == 24 || $reporteOBJ->registros[0]['idCajaPersonal'] == 33 || $reporteOBJ->registros[0]['idCajaPersonal'] == 110 || $reporteOBJ->registros[0]['idCajaPersonal'] == 56 || $reporteOBJ->registros[0]['idCajaPersonal'] == 79 || $reporteOBJ->registros[0]['idCajaPersonal'] == 19 || $reporteOBJ->registros[0]['idCajaPersonal'] == 18 || $reporteOBJ->registros[0]['idCajaPersonal'] == 43 || $reporteOBJ->registros[0]['idCajaPersonal'] == 108 || $reporteOBJ->registros[0]['idCajaPersonal'] == 20 || $reporteOBJ->registros[0]['idCajaPersonal'] == 80 || $reporteOBJ->registros[0]['idCajaPersonal'] == 172) {
                    $tipoCaja = 'Caja Recaudos';
                } elseif ($reporteOBJ->registros[0]['idCajaPersonal'] == 84) {
                    $tipoCaja = 'Caja Bancos';
                } else {
                    $tipoCaja = 'Caja Personal';
                }
                $conceptoCaja = $reporteOBJ->registros[0]['concepto'];
                $valorCaja = $reporteOBJ->registros[0]['valor'];
            } else {
                $tipoCaja = 'NO REPORTA';
                $conceptoCaja = 'NO REPORTA';
                $valorCaja = 'NO REPORTA';
            }

            if ($fila['DESCUENTO'] != 0) {
                $descuento = $fila['DESCUENTO'];
            } else if ($fila['DESCUENTO_1'] != NULL) {
                $descuento = $fila['DESCUENTO_1'];
            } else {
                $descuento = 0;
            }

            if (strpos($fila['concepto'], 'PRONTO PAGO') != false) {
                $descProntoPago = $fila['VLR_TOTAL'] - $fila['VLR_PRONTO_PAGO'];
            } else {
                $descProntoPago = 0;
            }

//            $vlrTotal = $fila['VLR_BASE'] + $fila['VLR_IVA'] + $fila['DEUDA'] - $descuento;
//            if ($fila['valorRecaudo'] != $vlrTotal) {
//                $vlrTotal = $fila['valorRecaudo']
//                $fila['valorRecaudo'] = $vlrTotal;
//            }

            $deuda = $fila['valorRecaudo'] - ($fila['VLR_BASE'] + $fila['VLR_IVA'] + $fila['DEUDA'] - $descuento - $descProntoPago);
            if ($deuda > 0 && $fila['DEUDA'] == 0) {
                $fila['DEUDA'] = $deuda;
            }
            $recaudoNeto = $fila['valorRecaudo'] - $fila['vlrReteIVA'] - $fila['vlrReteFuente'] - $fila['vlrReteICA'] - $fila['vlrEstampillas'] - $fila['vlrOtrosDescuentos'];

            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A' . $i, $fila['idRecaudo']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('B' . $i, $fila['empleado']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('C' . $i, $fila['cliente']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('D' . $i, $fila['tipoCliente']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('E' . $i, $fila['idFactura']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('F' . $i, $fila['numeroFactura']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('G' . $i, $fila['fechaHoraRecaudo']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('H' . $i, $fila['fechaPago']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('I' . $i, $fila['fechaCobro']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('J' . $i, $fila['concepto']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('K' . $i, $fila['VLR_BASE']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('L' . $i, $fila['VLR_IVA']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('M' . $i, $fila['DEUDA']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('N' . $i, $descuento);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('O' . $i, $descProntoPago);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('P' . $i, $fila['valorRecaudo']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('Q' . $i, $fila['vlrReteIVA']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('R' . $i, $fila['vlrReteFuente']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('S' . $i, $fila['vlrReteICA']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('T' . $i, $fila['vlrEstampillas']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('U' . $i, $fila['vlrOtrosDescuentos']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('V' . $i, $fila['tipoRecaudo']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('W' . $i, $tipoCaja);
            $i++;
        }
// ------------------------------------------------------------------------------------------------------------
        $cont = 1;
        $rutaArchivo = DIRECTORIO . "INFORME RECAUDOS $tipoRecaudo _ $nombreMes $anio ($fechaTitulo).xlsx";
        $nombreArchivo = "INFORME RECAUDOS $tipoRecaudo _ $nombreMes $anio ($fechaTitulo).xlsx";
        while (file_exists($rutaArchivo)) {
            $rutaArchivo = DIRECTORIO . "INFORME RECAUDOS $tipoRecaudo _ $nombreMes $anio ($fechaTitulo) ($cont).xlsx";
            $nombreArchivo = "INFORME RECAUDOS $tipoRecaudo _ $nombreMes $anio ($fechaTitulo) ($cont).xlsx";
            $cont++;
        }

        try {
            $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
            $objWriter->save($rutaArchivo);
            return $nombreArchivo;
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
            return 'ERROR';
        }
    } else {
        return 'SIN_DATOS';
    }
}

function getReporteFacturado($mes = '', $anio = '', $tipo = 0, $estado = '') {
    $meses = array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
    $nombreMes = $meses[$mes - 1];

    $clasificacion = 'CLIENTES';
    $estadoTitulo = strtoupper($estado);

    if ($_SESSION['PRIVILEGIO_USUARIO'] == 1 || $_SESSION['ID_USUARIO'] == 159) {
        $admin = true;
    } else {
        $admin = false;
    }

    $reporteOBJ = new Reporte();
    $facturas = array();
    switch ($tipo) {// 1-->CORPORATIVOS GRANDES, 2-->CORPORATIVOS PEQUE�OS, 3-->RESIDENCIALES
        case 1:
            $clasificacion = 'CORPORATIVOS GRANDES';
            if ($reporteOBJ->getInformeFacturadoCorp($mes, $anio, $estado, '', $admin)) {
                $facturas = $reporteOBJ->registros;
            }
            break;
        case 2:
            $clasificacion = 'CORPORATIVOS PEQUENOS';
            if ($reporteOBJ->getInformeFacturadoCorp($mes, $anio, $estado, '!', $admin)) {
                $facturas = $reporteOBJ->registros;
            }
            break;
        case 3:
            $clasificacion = 'RESIDENCIALES';
            if ($reporteOBJ->getInformeFacturadoRes($mes, $anio, $estado, '!')) {
                $facturas = $reporteOBJ->registros;
            }
            break;
    }

    $objPHPExcel = new PHPExcel();
    $objPHPExcel->getProperties()->setCreator("INFORME FACTURACION $clasificacion _ $nombreMes $anio ($estadoTitulo)")
            ->setLastModifiedBy($_SESSION['NOMBRES_APELLIDO_USUARIO'])
            ->setTitle("INFORME FACTURACION $clasificacion _ $nombreMes $anio ($estadoTitulo)")
            ->setSubject("INFORME FACTURACION $clasificacion _ $nombreMes $anio ($estadoTitulo)")
            ->setDescription("INFORME FACTURACION $clasificacion _ $nombreMes $anio ($estadoTitulo)")
            ->setKeywords("INFORME FACTURACION $clasificacion _ $nombreMes $anio ($estadoTitulo)")
            ->setCategory("INFORME FACTURACION $clasificacion _ $nombreMes $anio ($estadoTitulo)");

    $objPHPExcel->setActiveSheetIndex(0);
    $objPHPExcel->getActiveSheet()->setTitle("$nombreMes $anio");

    $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('H')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('I')->setAutoSize(true);
    $objPHPExcel->getActiveSheet()->getColumnDimension('J')->setAutoSize(true);

    $objPHPExcel->getDefaultStyle()->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);

    if (!empty($facturas)) {

        $estiloBorde = array(
            'borders' => array(
                'allborders' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN
                )
            )
        );
        $estiloNegrita = array(
            'borders' => array(
                'allborders' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN
                )
            ),
            'font' => array(
                'bold' => true
            )
        );

        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A1', 'NUMERO FACTURA');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('B1', 'FECHA EXPEDICION');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('C1', 'VALOR BASE');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('D1', 'VALOR IVA');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('E1', 'VALOR DESCUENTO');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('F1', 'VALOR TOTAL');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('G1', 'PERIODO FACTURADO');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('H1', 'CLIENTE');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('I1', 'IDENTIFICACION');
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('J1', 'ESTADO FACTURA');

        $objPHPExcel->getActiveSheet()->getStyle('A1:J1')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('A1:J1')->getFill()->getStartColor()->setARGB('DDDDDD');

        $i = 2;
        foreach ($facturas as $fila) {
            if ($fila['DEUDA'] != 0) {
                $fila['VLR_TOTAL'] = $fila['VLR_BASE'] + $fila['VLR_IVA'];
            }
            if ($fila['DESCUENTO'] != 0) {
                $descuento = $fila['DESCUENTO'];
                $fila['VLR_TOTAL'] = $fila['VLR_BASE'] + $fila['VLR_IVA'] - $descuento;
            } else if ($fila['DESCUENTO_1'] != NULL) {
                $descuento = $fila['DESCUENTO_1'];
                $fila['VLR_TOTAL'] = $fila['VLR_TOTAL'] - $descuento;
            } else {
                $descuento = 0;
            }

            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A' . $i, $fila['NUM_FACTURA']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('B' . $i, $fila['FECHA_EXPEDICION']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('C' . $i, $fila['VLR_BASE']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('D' . $i, $fila['VLR_IVA']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('E' . $i, $descuento);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('F' . $i, $fila['VLR_TOTAL']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('G' . $i, $fila['PERIODO_FACTURADO']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('H' . $i, $fila['CLIENTE']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('I' . $i, $fila['IDENTIFICACION']);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('J' . $i, $fila['ESTADO_FACTURA']);
            $i++;
        }
// ------------------------------------------------------------------------------------------------------------
        $cont = 1;
        $rutaArchivo = DIRECTORIO . "INFORME FACTURACION $clasificacion _ $nombreMes $anio ($estadoTitulo).xlsx";
        $nombreArchivo = "INFORME FACTURACION $clasificacion _ $nombreMes $anio ($estadoTitulo).xlsx";
        while (file_exists($rutaArchivo)) {
            $rutaArchivo = DIRECTORIO . "INFORME FACTURACION $clasificacion _ $nombreMes $anio ($estadoTitulo) ($cont).xlsx";
            $nombreArchivo = "INFORME FACTURACION $clasificacion _ $nombreMes $anio ($estadoTitulo) ($cont).xlsx";
            $cont++;
        }

        try {
            $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
            $objWriter->save($rutaArchivo);
            return $nombreArchivo;
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
            return 'ERROR';
        }
    } else {
        return 'SIN_DATOS';
    }
}

function getReporteVentas($fechaHoy = '', $mes = 0, $anio = 0) {
    $meses = array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');

    $reporteOBJ = new Reporte();
    $ventasCorp = array();
    $ventasRes = array();
    if ($reporteOBJ->getReporteVentasCorp($fechaHoy, $mes, $anio)) {
        $ventasCorp = $reporteOBJ->registros;
    }
    if ($reporteOBJ->getReporteVentasRes($fechaHoy, $mes, $anio)) {
        $ventasRes = $reporteOBJ->registros;
    }

    if (!empty($ventasCorp) || !empty($ventasRes)) {
        if ($fechaHoy != '' && $mes == 0 && $anio == 0) {
            $nombreExcel = "INFORME VENTAS DIARIO $fechaHoy";
        } else {
            $nombreMes = $meses[$mes - 1];
            $nombreExcel = "INFORME VENTAS MENSUAL $nombreMes $anio";
        }
        $objPHPExcel = new PHPExcel();
        $objPHPExcel->getProperties()->setCreator($nombreExcel)
                ->setLastModifiedBy($_SESSION['NOMBRES_APELLIDO_USUARIO'])
                ->setTitle($nombreExcel)
                ->setSubject($nombreExcel)
                ->setDescription($nombreExcel)
                ->setKeywords($nombreExcel)
                ->setCategory($nombreExcel);
    } else {
        return 'SIN_DATOS';
    }

    $numPage = 0;
    if (!empty($ventasCorp)) {
        $objPHPExcel->setActiveSheetIndex($numPage);
        $objPHPExcel->getActiveSheet()->setTitle("CORPORATIVO $fechaHoy");

        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('H')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('I')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('J')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('K')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('L')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('M')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('N')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('O')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('P')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('Q')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('R')->setAutoSize(true);

        $objPHPExcel->getDefaultStyle()->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);

        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('A1', 'ID CLIENTE');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('B1', 'CLIENTE');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('C1', 'SERVICIO');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('D1', 'VEL. BAJADA (K)');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('E1', 'VEL. SUBIDA (K)');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('F1', 'UBICACION');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('G1', 'DIR. INSTALACION');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('H1', 'FECHA INICIO');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('I1', 'DURACION');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('J1', 'FECHA ACTIVACION');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('K1', 'VALOR MENSUAL');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('L1', 'VALOR INSTALACION');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('M1', 'VALOR TOTAL CONTRATO');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('N1', 'REGISTRADO POR');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('O1', 'FECHA REGISTRO');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('P1', 'ESTADO');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('Q1', 'MOTIVO ELIMINACION');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('R1', 'OBSERVACION ELIMINACION');

        $objPHPExcel->getActiveSheet()->getStyle('A1:R1')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('A1:R1')->getFill()->getStartColor()->setARGB('DDDDDD');

        $i = 2;
        foreach ($ventasCorp as $fila) {
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('A' . $i, $fila['ID_CLIENTE']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('B' . $i, $fila['CLIENTE']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('C' . $i, $fila['SERVICIO']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('D' . $i, $fila['VEL_BAJADA']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('E' . $i, $fila['VEL_SUBIDA']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('F' . $i, $fila['UBICACION']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('G' . $i, $fila['DIR_INSTALACION']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('H' . $i, $fila['FECHA_INICIO']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('I' . $i, $fila['DURACION']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('J' . $i, $fila['FECHA_ACTIVACION']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('K' . $i, $fila['VALOR_MENSUAL']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('L' . $i, $fila['VALOR_INSTALACION']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('M' . $i, $fila['VLR_TOTAL_CONTRATO']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('N' . $i, $fila['REGISTRADO_POR']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('O' . $i, $fila['FECHA_HORA_REG']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('P' . $i, $fila['ESTADO']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('Q' . $i, $fila['MOTIVO_ELIMINA']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('R' . $i, $fila['OBSERVACION_ELIMINA']);
            $i++;
        }
        $numPage++;
    }

    if (!empty($ventasRes)) {
        $objPHPExcel->createSheet($numPage);
        $objPHPExcel->setActiveSheetIndex($numPage);
        $objPHPExcel->getActiveSheet()->setTitle("RESIDENCIAL $fechaHoy");

        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('H')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('I')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('J')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('K')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('L')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('M')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('N')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('O')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('P')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('Q')->setAutoSize(true);
        $objPHPExcel->getActiveSheet()->getColumnDimension('R')->setAutoSize(true);

        $objPHPExcel->getDefaultStyle()->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);

        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('A1', 'ID_CLIENTE');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('B1', 'CLIENTE');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('C1', 'SERVICIO');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('D1', 'VEL. BAJADA (K)');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('E1', 'VEL. SUBIDA (K)');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('F1', 'UBICACION');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('G1', 'DIR. INSTALACION');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('H1', 'FECHA INICIO');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('I1', 'DURACION');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('J1', 'FECHA ACTIVACION');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('K1', 'VALOR MENSUAL');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('L1', 'VALOR INSTALACION');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('M1', 'VALOR TOTAL CONTRATO');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('N1', 'REGISTRADO POR');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('O1', 'FECHA REGISTRO');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('P1', 'ESTADO');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('Q1', 'MOTIVO ELIMINACION');
        $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('R1', 'OBSERVACION ELIMINACION');

        $objPHPExcel->getActiveSheet()->getStyle('A1:R1')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('A1:R1')->getFill()->getStartColor()->setARGB('DDDDDD');

        $i = 2;
        foreach ($ventasRes as $fila) {
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('A' . $i, $fila['ID_CLIENTE']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('B' . $i, $fila['CLIENTE']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('C' . $i, $fila['SERVICIO']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('D' . $i, $fila['VEL_BAJADA']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('E' . $i, $fila['VEL_SUBIDA']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('F' . $i, $fila['UBICACION']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('G' . $i, $fila['DIR_INSTALACION']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('H' . $i, $fila['FECHA_INICIO']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('I' . $i, $fila['DURACION']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('J' . $i, $fila['FECHA_ACTIVACION']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('K' . $i, $fila['VALOR_MENSUAL']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('L' . $i, $fila['VALOR_INSTALACION']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('M' . $i, $fila['VLR_TOTAL_CONTRATO']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('N' . $i, $fila['REGISTRADO_POR']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('O' . $i, $fila['FECHA_HORA_REG']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('P' . $i, $fila['ESTADO']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('Q' . $i, $fila['MOTIVO_ELIMINA']);
            $objPHPExcel->setActiveSheetIndex($numPage)->setCellValue('R' . $i, $fila['OBSERVACION_ELIMINA']);
            $i++;
        }
        $numPage++;
    }
// ------------------------------------------------------------------------------------------------------------
    $objPHPExcel->setActiveSheetIndex(0);
    $cont = 1;
    $rutaArchivo = DIRECTORIO . "$nombreExcel.xlsx";
    $nombreArchivo = "$nombreExcel.xlsx";
    while (file_exists($rutaArchivo)) {
        $rutaArchivo = DIRECTORIO . "$nombreExcel ($cont).xlsx";
        $nombreArchivo = "$nombreExcel ($cont).xlsx";
        $cont++;
    }

    try {
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        $objWriter->save($rutaArchivo);
        return $nombreArchivo;
    } catch (Exception $exc) {
        echo $exc->getTraceAsString();
        return 'ERROR';
    }
}

function getMensaje($msg = 0) {
    $mensaje = "<script>
                    $(document).ready(function(){
                      setTimeout(function(){ $('.mensajes').fadeOut(1000).fadeIn(1000).fadeOut(700).fadeIn(700).fadeOut(1000);}, 8000); 
                    });
                </script>";
    switch ($msg) {
        case 0:
            $mensaje .= '<div class="mensajes error">
                            La operacion solicitada <b>NO</b> fue Ejecutada. -- <b>[ ERROR ]</b><br>
                            Comuniquese con el Administrador del Sistema.
                        </div>';
            break;
        case 1:
            $mensaje .= '<div class="mensajes exito">
                            Area <b>REGISTRADA</b> en el Sistema. -- <b>[ OK ]</b>
                        </div>';
            break;
        case 2:
            $mensaje .= '<div class="mensajes exito">
                            Area <b>ACTUALIZADA</b> en el Sistema. -- <b>[ OK ]</b>
                         </div>';
            break;
        case 3:
            $mensaje .= '<div class="mensajes exito">
                            Area <b>ELIMINADA</b> del Sistema. -- <b>[ OK ]</b>
                        </div>';
            break;
        case 4:
            $mensaje .= '<div class="mensajes alerta">
                            El Area <b>NO PUEDE SER ELIMINADA</b> del Sistema.<br>
                            Esta Area esta siendo usada en algun Estudio o Experiencia Laboral.
                        </div>';
            break;
    }
    return $mensaje;
}

function buscarFactura($idFactura = 0) {
//    $nombreArchivo = "D:\\fixFacturacionCP.txt";
    $nombreArchivo = "/home/fixFacturacionCP.txt";
    $fichero = fopen($nombreArchivo, 'rb');
    while (($linea = fgets($fichero)) !== false) {
        $datos = explode(';', $linea);
        if (count($datos) > 1) {
            if ($datos[1] == $idFactura) {
                fclose($fichero);
                return $datos[3] . ';' . $datos[2];
            }
        }
    }
    fclose($fichero);
    return 'NO';
}

function getDatos() {
    $datos = array();
    if ($_POST) {
        if (array_key_exists('idCorporativo', $_POST))
            $datos['idCorporativo'] = $_POST['idCorporativo'];
        if (array_key_exists('cedula', $_POST))
            $datos['cedula'] = $_POST['cedula'];
        if (array_key_exists('nit', $_POST))
            $datos['nit'] = $_POST['nit'];
        if (array_key_exists('idResidencial', $_POST))
            $datos['idResidencial'] = $_POST['idResidencial'];
        if (array_key_exists('idContrato', $_POST))
            $datos['idContrato'] = $_POST['idContrato'];
        if (array_key_exists('desdeSec', $_POST))
            $datos['desdeSec'] = $_POST['desdeSec'];
        if (array_key_exists('tipoReporte', $_POST))
            $datos['tipoReporte'] = $_POST['tipoReporte'];
        if (array_key_exists('fechaInicio', $_POST))
            $datos['fechaInicio'] = $_POST['fechaInicio'];
        if (array_key_exists('fechaFin', $_POST))
            $datos['fechaFin'] = $_POST['fechaFin'];
        if (array_key_exists('anio', $_POST))
            $datos['anio'] = $_POST['anio'];
        if (array_key_exists('tipoContrato', $_POST))
            $datos['tipoContrato'] = $_POST['tipoContrato'];
        if (array_key_exists('clasificacion', $_POST))
            $datos['clasificacion'] = $_POST['clasificacion'];
        if (array_key_exists('anio', $_POST))
            $datos['anio'] = $_POST['anio'];
        if (array_key_exists('mes', $_POST))
            $datos['mes'] = $_POST['mes'];
        if (array_key_exists('segmento', $_POST))
            $datos['segmento'] = $_POST['segmento'];
        if (array_key_exists('tipoFecha', $_POST))
            $datos['tipoFecha'] = $_POST['tipoFecha'];
        if (array_key_exists('estado', $_POST))
            $datos['estado'] = $_POST['estado'];
        if (array_key_exists('desde', $_POST))
            $datos['desde'] = $_POST['desde'];
        if (array_key_exists('fechaHoy', $_POST))
            $datos['fechaHoy'] = $_POST['fechaHoy'];
        if (array_key_exists('clientesBusq', $_POST))
            $datos['clientesBusq'] = $_POST['clientesBusq'];
        if (array_key_exists('clientesCorpBusq', $_POST))
            $datos['clientesCorpBusq'] = $_POST['clientesCorpBusq'];
    } elseif ($_GET) {
        if (array_key_exists('idResidencial', $_GET))
            $datos['idResidencial'] = $_GET['idResidencial'];
        if (array_key_exists('cedula', $_GET))
            $datos['cedula'] = $_GET['cedula'];
        if (array_key_exists('nit', $_GET))
            $datos['nit'] = $_GET['nit'];
        if (array_key_exists('idCorporativo', $_GET))
            $datos['idCorporativo'] = $_GET['idCorporativo'];
        if (array_key_exists('idRecaudo', $_GET))
            $datos['idRecaudo'] = $_GET['idRecaudo'];

        if (array_key_exists('nombreArchivo', $_GET))
            $datos['nombreArchivo'] = $_GET['nombreArchivo'];
        if (array_key_exists('msg', $_GET))
            $datos['msg'] = $_GET['msg'];

        if (array_key_exists('anioNovedades', $_GET))
            $datos['anioNovedades'] = $_GET['anioNovedades'];
        if (array_key_exists('mesNovedades', $_GET))
            $datos['mesNovedades'] = $_GET['mesNovedades'];
        if (array_key_exists('term', $_GET))
            $datos['completar'] = $_GET['term'];
    }
    return $datos;
}

?>
