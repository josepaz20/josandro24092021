function ocultarAux() {
    var href = location.href;
    if (href.indexOf('#') !== -1) {
        var partes = href.split('#');
        location.href = partes[0] + '#close';
    } else {
        location.href = '#close';
    }
}

function verAux(evento) {
    evento.stopPropagation();
}
//------------------------------------------------------------------------------
function activarBloqueoAjax() {
//    $.blockUI.defaults.baseZ = 100000;
    $.blockUI(
            {
                message: $('#msgBloqueo'),
                baseZ: 100000,
                css: {
                    border: 'none',
                    padding: '15px',
                    backgroundColor: '#000', '-webkit-border-radius': '10px', '-moz-border-radius': '10px',
                    opacity: .85,
                    color: '#fff'
                }
            }
    );
}
//------------------------------------------------------------------------------
function formatoMoneda(cnt, cents) {
    cnt = cnt.toString().replace(/\$|\u20AC|\,/g, '');
    if (isNaN(cnt))
        return 0;
    var sgn = (cnt == (cnt = Math.abs(cnt)));
    cnt = Math.floor(cnt * 100 + 0.5);
    cvs = cnt % 100;
    cnt = Math.floor(cnt / 100).toString();
    if (cvs < 10)
        cvs = '0' + cvs;
    for (var i = 0; i < Math.floor((cnt.length - (1 + i)) / 3); i++)
        cnt = cnt.substring(0, cnt.length - (4 * i + 3)) + ','
                + cnt.substring(cnt.length - (4 * i + 3));

    return (((sgn) ? '' : '-') + cnt) + (cents ? '.' + cvs : '');
}

//------------------------------------------------------------------------------

function setRegistrarNovedad(html) {
    $("#divContenido").html(html);
    var href = location.href;
    if (href.indexOf('#') !== -1) {
        var partes = href.split('#');
        location.href = partes[0] + '#modalNuevo';
    } else {
        location.href = '#modalNuevo';
    }
}

function setTipoNovedad(tipoNovedad, verDetalle) {
    if (!verDetalle) {
        quitarCamposRequeridos(verDetalle);
    }
    ocultarInfoNovedades();
    switch (tipoNovedad) {
        case 'Anticipo':
            setCamposRequeridos('infoNovedadGeneral');
            $("#infoNovedadGeneral").show('slow');
            break;
        case 'Bonificacion':
            setCamposRequeridos('infoNovedadGeneral');
            $("#infoNovedadGeneral").show('slow');
            break;
        case 'Celular Corporativo':
            setCamposRequeridos('infoNovedadGeneral');
            $("#infoNovedadGeneral").show('slow');
            break;
        case 'Devolucion':
            setCamposRequeridos('infoNovedadGeneral');
            $("#infoNovedadGeneral").show('slow');
            break;
        case 'Dia NO Laborado':
            setCamposRequeridos('infoDiaNolaborado');
            $("#infoDiaNolaborado").show('slow');
            break;
        case 'Dominical':
            setCamposRequeridos('infoNovedadGeneral');
            $("#infoNovedadGeneral").show('slow');
            break;
        case 'Festivo':
            setCamposRequeridos('infoNovedadGeneral');
            $("#infoNovedadGeneral").show('slow');
            break;
        case 'Horas Extra':
            setCamposRequeridos('infoHorasExtra');
            $("#infoHorasExtra").show('slow');
            break;
        case 'Incapacidad':
            setCamposRequeridos('infoIncapacidad');
            $("#infoIncapacidad").show('slow');
            break;
        case 'Internet':
            setCamposRequeridos('infoNovedadGeneral');
            $("#infoNovedadGeneral").show('slow');
            break;
        case 'Libranza':
            setCamposRequeridos('infoNovedadGeneral');
            $("#infoNovedadGeneral").show('slow');
            break;
        case 'Liquidacion':
            setCamposRequeridos('infoNovedadGeneral');
            $("#infoNovedadGeneral").show('slow');
            break;
        case 'Prima':
            setCamposRequeridos('infoNovedadGeneral');
            $("#infoNovedadGeneral").show('slow');
            break;
        case 'Rodamiento':
            setCamposRequeridos('infoNovedadGeneral');
            $("#infoNovedadGeneral").show('slow');
            break;
        case 'Saldo Caja':
            setCamposRequeridos('infoNovedadGeneral');
            $("#infoNovedadGeneral").show('slow');
            break;
        case 'Otras Deducciones':
            setCamposRequeridos('infoNovedadGeneral');
            $("#infoNovedadGeneral").show('slow');
            break;
        case 'Otros Devengados':
            setCamposRequeridos('infoNovedadGeneral');
            $("#infoNovedadGeneral").show('slow');
            break;
    }
}

function quitarCamposRequeridos(borrar) {
    $("#camposRequeridos input").each(function () {
        $(this).removeAttr('required');
        if (borrar) {
            $(this).val('');
        }
    });
    $("#camposRequeridos select").each(function () {
        $(this).removeAttr('required');
        if (borrar) {
            $(this).val('');
        }
    });
    $("#camposRequeridos textarea").each(function () {
        $(this).removeAttr('required');
        if (borrar) {
            $(this).val('');
        }
    });
}

function setCamposRequeridos(div) {
    $("#" + div + " input").each(function () {
        $(this).attr('required', true);
    });
    $("#" + div + " input").each(function () {
        $(this).attr('required', true);
    });
    $("#" + div + " input").each(function () {
        $(this).attr('required', true);
    });
}

function ocultarInfoNovedades() {
    $("#camposRequeridos fieldset").each(function () {
        $(this).hide();
    });
}

function agregarDiaDominical() {
    var fecha = $("#fechaNovedad").val(), partes, dia, dias;
    if (fecha.trim().length > 0) {
        partes = fecha.split('-');
        dia = partes[2];
        if ($("#diasDominical").val().indexOf(dia) !== -1) {
            alert('EL DIA <<' + dia + '>> YA SE ENCUENTRA AGREGADO');
            $("#fechaNovedad").val('');
            return false;
        }
        if (confirm(" ¿ DESEA AGREGAR ESTE DIA DOMINICAL ? ")) {
            dias = $("#diasDominical").val();
            if (dias === '') {
                dias = dia;
            } else {
                dias = dias + ',' + dia;
            }
            $("#diasDominical").val(dias);
            $("#contDiasDominical").val(parseInt($("#contDiasDominical").val()) + 1);
            $("#fechaNovedad").val('');
            $("#detalleNovedad").val("DIAS DOMINICALES LABORADOS EN EL MES DE " + $("#mesNovedad").val().toUpperCase() + " " + $("#anioNovedad").val() + ": " + dias);
        }
    } else {
        alert("POR FAVOR, SELECCIONE UNA FECHA");
        $("#fechaNovedad").focus();
    }
}

function limpiarDiasDominical() {
    $("#diasDominical").val('');
    $("#contDiasDominical").val(0);
}

function agregarDiaFestivo() {
    var fecha = $("#fechaNovedad").val(), partes, dia, dias;
    if (fecha.trim().length > 0) {
        partes = fecha.split('-');
        dia = partes[2];
        if ($("#diasFestivo").val().indexOf(dia) !== -1) {
            alert('EL DIA <<' + dia + '>> YA SE ENCUENTRA AGREGADO');
            $("#fechaNovedad").val('');
            return false;
        }
        if (confirm(" ¿ DESEA AGREGAR ESTE DIA FESTIVO ? ")) {
            dias = $("#diasFestivo").val();
            if (dias === '') {
                dias = dia;
            } else {
                dias = dias + ',' + dia;
            }
            $("#diasFestivo").val(dias);
            $("#contDiasFestivo").val(parseInt($("#contDiasFestivo").val()) + 1);
            $("#fechaNovedad").val('');
            $("#detalleNovedad").val("DIAS FESTIVOS LABORADOS EN EL MES DE " + $("#mesNovedad").val().toUpperCase() + " " + $("#anioNovedad").val() + ": " + dias);
        }
    } else {
        alert("POR FAVOR, SELECCIONE UNA FECHA");
        $("#fechaNovedad").focus();
    }
}

function limpiarDiasFestivo() {
    $("#diasFestivo").val('');
    $("#contDiasFestivo").val(0);
}

function validarRegistroNovedad() {
    if ($("#tipoNovedad").val() === 'Dominical') {
        if (parseInt($("#contDiasDominical").val()) === 0) {
            alert("POR FAVOR, AGREGUE LOS DIAS DOMINICALES A LA NOVEDAD");
            $("#agregarDia").focus();
            return false;
        }
    }
    if ($("#tipoNovedad").val() === 'Festivo') {
        if (parseInt($("#contDiasFestivo").val()) === 0) {
            alert("POR FAVOR, AGREGUE LOS DIAS FESTIVOS A LA NOVEDAD");
            $("#agregarDia").focus();
            return false;
        }
    }
    return confirm(' ¿ DESEA REGISTRAR ESTA NOVEDAD ? ');
}

//------------------------------------------------------------------------------

function guardarIncapacidad() {
    if (confirm("¿ DESEA GUARDAR ESTA INCAPACIDAD ?")) {
        $.get('guardarIncapacidad', {
            'pk_novedad_nomina_id': $("#pk_novedad_nomina_id").val(),
            'pk_incapacidad_id': $("#pk_incapacidad_id").val(),
            'idEmpleado': $("#idEmpleado").val(),
            'tipoNovedad': $("#tipoNovedad").val(),
            'mes': $("#mesNovedad").val(),
            'anio': $("#anioNovedad").val(),
            'tipoIncapacidad': $("#tipoIncapacidad").val(),
            'epsIncapacidad': $("#epsIncapacidad").val(),
            'fechaIniIncapacidad': $("#fechaIniIncapacidad").val(),
            'fechaFinIncapacidad': $("#fechaFinIncapacidad").val(),
            'detalle': $("#detalleIncapacidad").val()
        }, setGuardarNovedad);
        activarBloqueoAjax();
    }
}

function guardarDiaNoLaborado() {
    if (confirm("¿ DESEA GUARDAR ESTA INASISTENCIA ?")) {
        $.get('guardarDiaNoLaborado', {
            'pk_novedad_nomina_id': $("#pk_novedad_nomina_id").val(),
            'pk_inasistencia_id': $("#pk_inasistencia_id").val(),
            'idEmpleado': $("#idEmpleado").val(),
            'tipoNovedad': $("#tipoNovedad").val(),
            'mes': $("#mesNovedad").val(),
            'anio': $("#anioNovedad").val(),
            'fechaDiaNoLaborado': $("#fechaDiaNoLaborado").val(),
            'noLabora': $("#noLabora").val(),
            'detalle': $("#detalleDiaNoLaborado").val()
        }, setGuardarNovedad);
        activarBloqueoAjax();
    }
}

function guardarHorasExtra() {
    if (confirm("¿ DESEA GUARDAR ESTAS HORAS EXTRA ?")) {
        $.get('guardarHorasExtra', {
            'pk_novedad_nomina_id': $("#pk_novedad_nomina_id").val(),
            'pk_horas_extra_id': $("#pk_horas_extra_id").val(),
            'idEmpleado': $("#idEmpleado").val(),
            'tipoNovedad': $("#tipoNovedad").val(),
            'mes': $("#mesNovedad").val(),
            'anio': $("#anioNovedad").val(),
            'fechaHorasExtra': $("#fechaHorasExtra").val(),
            'horas': $("#horas").val(),
            'tipoHorasExtra': $("#tipoHorasExtra").val(),
            'jornadaHorasExtra': $("#jornadaHorasExtra").val(),
            'detalle': $("#detalleHorasExtra").val()
        }, setGuardarNovedad);
        activarBloqueoAjax();
    }
}

function guardarNovedadGeneral() {
    if (confirm("¿ DESEA GUARDAR ESTA NOVEDAD ?")) {
        $.get('guardarNovedadGeneral', {
            'pk_novedad_nomina_id': $("#pk_novedad_nomina_id").val(),
            'pk_novedad_general_id': $("#pk_novedad_general_id").val(),
            'idEmpleado': $("#idEmpleado").val(),
            'tipoNovedad': $("#tipoNovedad").val(),
            'mes': $("#mesNovedad").val(),
            'anio': $("#anioNovedad").val(),
            'conceptoNovedad': $("#conceptoNovedad").val(),
            'vlrNovedad': $("#vlrNovedad").val(),
            'detalle': $("#detalleNovedadGeneral").val()
        }, setGuardarNovedad);
        activarBloqueoAjax();
    }
}

//-------------------------------------
function setGuardarNovedad(ok) {
    if (parseInt(ok) === 1) {
        alert("NOVEDAD GUARDADA EN EL SISTEMA -- [ OK ]");
    } else {
        alert("SE HA PRESENTADO UN ERROR EN EL SISTEMA -- [ ERROR ]");
    }
    ocultarAux();
    location.reload();
}
//----------------------------------------------
function verNovedadesEmpleado() {
    location.href = "novedadesEmpleado?idEmpleado=" + $("#idEmpleadoBusq").val() + "&mes=" + $("#mesBusq").val() + "&anio=" + $("#anioBusq").val();
}

function verNovedades() {
    location.href = "gestion?mes=" + $("#mesBusq").val() + "&anio=" + $("#anioBusq").val();
}

//-----------------------------------------------------------------------
function eliminarNovedad(idNovedadNomina) {
    if (confirm("¿ DESEA ELIMINAR ESTA NOVEDAD ?")) {
        $.get('eliminarNovedad', {idNovedadNomina: idNovedadNomina}, setEliminarNovedad);
        activarBloqueoAjax();
    }
}
function setEliminarNovedad(ok) {
    if (parseInt(ok) === 1) {
        alert("NOVEDAD ELIMINADA DEL SISTEMA -- [ OK ]");
    } else {
        alert("SE HA PRESENTADO UN ERROR EN EL SISTEMA -- [ ERROR ]");
    }
    location.reload();
}

//******************************************************************************

function getInfoNovedad(novedad) {
    var idEmpleado = 0;
    if (novedad !== '') {
        switch (novedad) {
            case 'Anticipo':
                $("#formNovedad").attr('action', 'guardarNovedadGeneral');
                break;
            case 'Bonificacion':
                $("#formNovedad").attr('action', 'guardarNovedadGeneral');
                break;
            case 'Celular Corporativo':
                $("#formNovedad").attr('action', 'guardarNovedadGeneral');
                break;
            case 'Devolucion':
                $("#formNovedad").attr('action', 'guardarNovedadGeneral');
                break;
            case 'Dia NO Laborado':
                $("#formNovedad").attr('action', 'guardarDiaNoLaborado');
                break;
            case 'Dominical':
                $("#formNovedad").attr('action', 'guardarNovedadGeneral');
                break;
            case 'Festivo':
                $("#formNovedad").attr('action', 'guardarNovedadGeneral');
                break;
            case 'Horas Extra':
                $("#formNovedad").attr('action', 'guardarHorasExtra');
                break;
            case 'Incapacidad':
                $("#formNovedad").attr('action', 'guardarIncapacidad');
                idEmpleado = $("#idEmpleado").val();
                $("#infoIncapacidad").show('slow');
                break;
            case 'Internet':
                $("#formNovedad").attr('action', 'guardarNovedadGeneral');
                break;
            case 'Libranza':
                $("#formNovedad").attr('action', 'guardarNovedadGeneral');
                break;
            case 'Liquidacion':
                $("#formNovedad").attr('action', 'guardarNovedadGeneral');
                break;
            case 'Prima':
                $("#formNovedad").attr('action', 'guardarNovedadGeneral');
                break;
            case 'Rodamiento':
                $("#formNovedad").attr('action', 'guardarNovedadGeneral');
                idEmpleado = $("#idEmpleado").val();
                break;
            case 'Saldo Caja':
                $("#formNovedad").attr('action', 'guardarNovedadGeneral');
                break;
            case 'Otras Deducciones':
                $("#formNovedad").attr('action', 'guardarNovedadGeneral');
                break;
            case 'Otros Devengados':
                $("#formNovedad").attr('action', 'guardarNovedadGeneral');
                break;
        }
        $.get('getInfoNovedad', {novedad: novedad, idEmpleado: idEmpleado, mes: $("#mesNovedad").val(), anio: $("#anioNovedad").val()}, setInfoNovedad);
        activarBloqueoAjax();
    } else {
        $("#divInfoNovedad").hide('slow');
        $("#divInfoNovedad").html('');
    }
}
function setInfoNovedad(html) {
    $("#divInfoNovedad").html(html);
    $("#divInfoNovedad").show('slow');
}

//---------------------------------

function seleccionarDia(dia) {
    if (parseInt($("#borrado").val()) === 0) {
        $("#diasnorodamiento").val('');
        $("#totalnorodamiento").val(0);
        $("#borrado").val(1);
    }
    var dias = $("#diasnorodamiento").val();
    if ($(dia).attr('class') === 'diaSeleccionado') {
        $(dia).removeAttr('class');
        dias = dias.replace($(dia).html() + ',', '');
        $("#totalnorodamiento").val(parseInt($("#totalnorodamiento").val()) - 1);
    } else {
        $(dia).attr('class', 'diaSeleccionado');
        dias = dias + $(dia).html() + ',';
        $("#totalnorodamiento").val(parseInt($("#totalnorodamiento").val()) + 1);
    }
    $("#diasnorodamiento").val(dias);
    var calculoVlrNovedad = (parseFloat($("#vlrRodamiento").val()) / 25) * (25 - parseInt($("#totalnorodamiento").val()));
    $("#vlrNovedad").val(Math.round(calculoVlrNovedad));
    $("#detalleNovedad").val("DIAS DEL MES DE " + $("#mesNovedad").val().toUpperCase() + " " + $("#anioNovedad").val() + " QUE NO APLICA RODAMIENTO: " + dias);
}

function setTipoEmpleadoRodamiento(tipo) {
    if (tipo === 'Tecnico') {
        $("#infoRodamientoTecnico").show('slow');
    } else {
        $("#infoRodamientoTecnico").hide('slow');
    }
    $("#vlrNovedad").val(0);
    $("#detalleNovedad").val('');
    $("#diasnorodamiento").val('');
    $("#totalnorodamiento").val(0);
    setDiasSeleccionados(true);
}

function setDiasSeleccionados(ban) {
    if (ban) {
        $("#calendario tr").find('td').each(function () {
            $(this).removeAttr('class');
        });
    }
}

function marcarPago(celda, idEmpleado, vlrPago) {
    var nominas = $("#nominasPagar").val();
    var idsEmpleadosSelect = $("#idsEmpleadosSelect").val();
    var vlrapagar = $("#vlrapagar").val().replace(/[\$,]/g, '') * 1;
    if ($(celda).attr('class') === 'selectPago') {
        $(celda).attr('class', 'seleccionarNomina');
        nominas = nominas.replace($(celda).html() + ',', '');
        idsEmpleadosSelect = idsEmpleadosSelect.replace(idEmpleado + ',', '');
        $("#vlrapagar").val('$' + formatoMoneda(vlrapagar - vlrPago));
        $("#contNominasPagar").val(parseInt($("#contNominasPagar").val()) - 1);
    } else {
        $(celda).attr('class', 'selectPago');
        nominas = nominas + $(celda).html() + ',';
        idsEmpleadosSelect = idsEmpleadosSelect + idEmpleado + ',';
        $("#vlrapagar").val('$' + formatoMoneda(vlrapagar + vlrPago));
        $("#contNominasPagar").val(parseInt($("#contNominasPagar").val()) + 1);
    }
    $("#nominasPagar").val(nominas);
    $("#idsEmpleadosSelect").val(idsEmpleadosSelect);
}

function validarPagarNominas() {
    var cont = parseInt($("#contNominasPagar").val());
    var nominasPagar = $("#nominasPagar").val();
    var vlrapagar = $("#vlrapagar").val();
    if (cont > 0 && nominasPagar !== '') {
        return confirm("\nCANTIDAD: " + cont + " \nIDS: " + nominasPagar + " \nVALOR A PAGAR: " + vlrapagar + " \n\n   ¿ DESEA PAGAR LAS NOMINAS SELECCIONADAS ?");
    } else {
        alert("DEBE SELECCIONAR AL MENOS UNA NOMINA");
        return false;
    }
}

function verNominas() {
    location.href = "nominas?estadoNominas=" + $("#estadoNominas").val() + "&mes=" + $("#mesBusq").val() + "&anio=" + $("#anioBusq").val();
}

function verNominasEmpleado() {
    location.href = "nominaEmpleado?mes=" + $("#mesBusq").val() + "&anio=" + $("#anioBusq").val();
}

function verNovedadesEmpl() {
    location.href = "verNovedadesEmpl?&mes=" + $("#mesBusq").val() + "&anio=" + $("#anioBusq").val();
}

//------------------------------------------------------------------------
//LIQUIDACIONES
function verDetalleLiquidacion(idLiquidacion) {
    $.get('verDetalleLiquidacion', {idLiquidacion: idLiquidacion}, setFormulario, 'json');
    activarBloqueoAjax();
}

function verGenerarLiquidacion() {
    $.get('verGenerarLiquidacion', {}, setFormulario, 'json');
    activarBloqueoAjax();
}
function setFormulario(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divContenido").html(datos['html']);
        $('#modalFormulario').modal('show');
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function verSubirRespaldo(idLiquidacion) {
    $.get('verSubirRespaldo', {idLiquidacion: idLiquidacion}, setFormularioSubirRespaldo, 'json');
    activarBloqueoAjax();
}
function setFormularioSubirRespaldo(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divContenido").html(datos['html']);
        $('#modalFormulario').modal('show');
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function empleadoGenerarLiquidacion(idEmpleado) {
    if (idEmpleado !== '') {
        $.get('empleadoGenerarLiquidacion', {fk_empleado_id: idEmpleado}, setEmpleadoGenerarLiquidacion, 'json');
        activarBloqueoAjax();
    } else {
        //Info Empleado
        $("#fk_empleado_id").val('');
        $("#identificacion").val('');
        $("#apellidos").val('');
        $("#nombres").val('');
        $("#cargoEmpleado").val('');
        $("#divInfoEmplContr").hide('slow');
        $("#listaContratosEmpleado").html('<option value="">Seleccione...</option>');

        //Periodo de liquidacion
        $("#fk_contrato_id").val('');
        $("#fechaInicioContrato").val('');
        $("#fechaTerminacionContrato").val('');
        $("#tiempoTotalLab").val('');
        $("#fechaInicioLiqPrestSoc").val('');
        $("#diasNoLab").val('');
        $("#diasALiquidar").val('');
        //Salario Base de Liquidacion
        $("#sueldoBasico").val('');
        $("#auxilioTransporte").val('');
        $("#promedioSalarioVariable").val('');
        $("#totalBaseLiquidacion").val('');
        $("#diasSancion").val('');
        //Prima
        $("#fechaLiquidacionPrima").val('');
        $("#fechaCortePrima").val('');
        $("#diasPrima").val('');
        //Cesantias
        $("#fechaLiquidacionCesantias").val('');
        $("#fechaCorteCesantias").val('');
        $("#diasCesantias").val('');
        //Intereses a las Cesantias
        $("#fechaLiquidacionIntereses").val('');
        $("#fechaCorteIntereses").val('');
        $("#diasIntereses").val('');
        //Vacaciones
        $("#fechaLiquidacionVacaciones").val('');
        $("#fechaCorteVacaciones").val('');
        $("#totalDiasVacaciones").val('');
        $("#diasTomadosVacaciones").val('');
        $("#diasPendientes").val('');

        $("#divInfo").hide('slow');
    }
}
function setEmpleadoGenerarLiquidacion(datos) {
    if (datos['error'] === 0) {
        $("#divInfoEmplContr").show('slow');
        $("#fk_empleado_id").val(datos['html']['fk_empleado_id']);
        $("#identificacion").val(datos['html']['cedula']);
        $("#apellidos").val(datos['html']['apellidos']);
        $("#nombres").val(datos['html']['nombres']);
        $("#cargoEmpleado").val(datos['html']['cargo']);
        //-------------------------------------------------------------------------------
        $("#listaContratosEmpleado").html(datos['html']['listaContratosEmpleado']);

        //Causa liquidacion
        $("#causaLiquidacion").val('');
        //Periodo de liquidacion
        $("#fk_contrato_id").val('');
        $("#fechaInicioContrato").val('');
        $("#fechaTerminacionContrato").val('');
        $("#tiempoTotalLab").val('');
        $("#fechaInicioLiqPrestSoc").val('');
        $("#diasNoLab").val('');
        $("#diasALiquidar").val('');
        //Salario Base de Liquidacion
        $("#sueldoBasico").val('');
        $("#auxilioTransporte").val('');
        $("#promedioSalarioVariable").val('');
        $("#totalBaseLiquidacion").val('');
        $("#diasSancion").val('');
        //Prima
        $("#fechaLiquidacionPrima").val('');
        $("#fechaCortePrima").val('');
        $("#diasPrima").val('');
        //Cesantias
        $("#fechaLiquidacionCesantias").val('');
        $("#fechaCorteCesantias").val('');
        $("#diasCesantias").val('');
        //Intereses a las Cesantias
        $("#fechaLiquidacionIntereses").val('');
        $("#fechaCorteIntereses").val('');
        $("#diasIntereses").val('');
        //Vacaciones
        $("#fechaLiquidacionVacaciones").val('');
        $("#fechaCorteVacaciones").val('');
        $("#totalDiasVacaciones").val('');
        $("#diasTomadosVacaciones").val('');
        $("#diasPendientes").val('');

        $("#divInfo").hide('slow');
        //-------------------------------------------------------------------------------
    } else if (datos['error'] === 2) {
        alert(" EL EMPELADO SELECCIONADO NO TIENE CONTRATOS. ");
        //Info Empleado
        $("#fk_empleado_id").val('');
        $("#identificacion").val('');
        $("#apellidos").val('');
        $("#nombres").val('');
        $("#cargoEmpleado").val('');
        $("#divInfoEmplContr").hide('slow');
        $("#listaContratosEmpleado").html('<option value="">Seleccione...</option>');
        //Causa liquidacion
        $("#causaLiquidacion").val('');
        //Periodo de liquidacion
        $("#fk_contrato_id").val('');
        $("#fechaInicioContrato").val('');
        $("#fechaTerminacionContrato").val('');
        $("#tiempoTotalLab").val('');
        $("#fechaInicioLiqPrestSoc").val('');
        $("#diasNoLab").val('');
        $("#diasALiquidar").val('');
        //Salario Base de Liquidacion
        $("#sueldoBasico").val('');
        $("#auxilioTransporte").val('');
        $("#promedioSalarioVariable").val('');
        $("#totalBaseLiquidacion").val('');
        $("#diasSancion").val('');
        //Prima
        $("#fechaLiquidacionPrima").val('');
        $("#fechaCortePrima").val('');
        $("#diasPrima").val('');
        //Cesantias
        $("#fechaLiquidacionCesantias").val('');
        $("#fechaCorteCesantias").val('');
        $("#diasCesantias").val('');
        //Intereses a las Cesantias
        $("#fechaLiquidacionIntereses").val('');
        $("#fechaCorteIntereses").val('');
        $("#diasIntereses").val('');
        //Vacaciones
        $("#fechaLiquidacionVacaciones").val('');
        $("#fechaCorteVacaciones").val('');
        $("#totalDiasVacaciones").val('');
        $("#diasTomadosVacaciones").val('');
        $("#diasPendientes").val('');

        $("#divInfo").hide('slow');
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR. ");
    }
}

function calcularDiasPendientesVacaciones(diasTomadosVacaciones) {
    var diasPendientesVacaciones = 0;
    var totalDiasVacaciones = $("#totalDiasVacaciones").val();
    if (parseInt(diasTomadosVacaciones) <= parseInt(totalDiasVacaciones)) {
        diasPendientesVacaciones = totalDiasVacaciones - diasTomadosVacaciones;
        $("#diasPendientes").val(Math.round(diasPendientesVacaciones * 100) / 100);
    } else {
        alert("LOS DIAS DE VACACIONES TOMADOS NO PUEDEN SER MAYORES AL TOTAL DE DIAS DE VACACIONES.");
        $("#diasTomadosVacaciones").val('');
        $("#diasPendientes").val('');
        $("#diasTomadosVacaciones").focus();
        return false;
    }
}

function infoPeridoLiqSueloBaseLiq(idContrato) {
    if (idContrato !== '') {
        $.get('infoPeridoLiqSueloBaseLiq', {fk_contrato_id: idContrato}, setInfo, 'json');
        activarBloqueoAjax();
    } else {
        $("#divInfo").hide('slow')
        //Causa liquidacion
        $("#causaLiquidacion").val('');
        //Periodo de liquidacion
        $("#fk_contrato_id").val('');
        $("#fechaInicioContrato").val('');
        $("#fechaTerminacionContrato").val('');
        $("#tiempoTotalLab").val('');
        $("#fechaInicioLiqPrestSoc").val('');
        $("#diasNoLab").val('');
        $("#diasALiquidar").val('');
        //Salario Base de Liquidacion
        $("#sueldoBasico").val('');
        $("#auxilioTransporte").val('');
        $("#promedioSalarioVariable").val('');
        $("#totalBaseLiquidacion").val('');
        $("#diasSancion").val('');
        //Prima
        $("#fechaLiquidacionPrima").val('');
        $("#fechaCortePrima").val('');
        $("#diasPrima").val('');
        //Cesantias
        $("#fechaLiquidacionCesantias").val('');
        $("#fechaCorteCesantias").val('');
        $("#diasCesantias").val('');
        //Intereses a las Cesantias
        $("#fechaLiquidacionIntereses").val('');
        $("#fechaCorteIntereses").val('');
        $("#diasIntereses").val('');
        //Vacaciones
        $("#fechaLiquidacionVacaciones").val('');
        $("#fechaCorteVacaciones").val('');
        $("#totalDiasVacaciones").val('');
        $("#diasTomadosVacaciones").val('');
        $("#diasPendientes").val('');
    }
}
function setInfo(datos) {
    if (datos['error'] !== 1) {
        $("#divInfo").show('slow');
        //Establecer fecha minima de seleccion
        $("#fechaTerminacionContrato").attr('min', datos['datos']['fechaInicioContrato']);
        $("#fechaLiquidacionPrima").attr('min', datos['datos']['fechaInicioContrato']);
        $("#fechaLiquidacionCesantias").attr('min', datos['datos']['fechaInicioContrato']);
        $("#fechaLiquidacionIntereses").attr('min', datos['datos']['fechaInicioContrato']);
        $("#fechaLiquidacionVacaciones").attr('min', datos['datos']['fechaInicioContrato']);
        $("#fechaCortePrima").attr('min', datos['datos']['fechaLiquidacionPrima']);
        $("#fechaCorteCesantias").attr('min', datos['datos']['fechaLiquidacionCesantias']);
        $("#fechaCorteIntereses").attr('min', datos['datos']['fechaLiquidacionIntereses']);
        $("#fechaCorteVacaciones").attr('min', datos['datos']['fechaLiquidacionVacaciones']);

        //Establecer fecha maxima de seleccion
        $("#fechaLiquidacionPrima").attr('max', datos['datos']['fechaTerminacionContrato']);
        $("#fechaLiquidacionCesantias").attr('max', datos['datos']['fechaTerminacionContrato']);
        $("#fechaLiquidacionIntereses").attr('max', datos['datos']['fechaTerminacionContrato']);
        $("#fechaLiquidacionVacaciones").attr('max', datos['datos']['fechaTerminacionContrato']);
        $("#fechaCortePrima").attr('max', datos['datos']['fechaTerminacionContrato']);
        $("#fechaCorteCesantias").attr('max', datos['datos']['fechaTerminacionContrato']);
        $("#fechaCorteIntereses").attr('max', datos['datos']['fechaTerminacionContrato']);
        $("#fechaCorteVacaciones").attr('max', datos['datos']['fechaTerminacionContrato']);

        //Causa liquidacion
        $("#causaLiquidacion").val('');
        //Periodo de liquidacion
        $("#fk_contrato_id").val(datos['datos']['fk_contrato_id']);
        $("#fechaInicioContrato").val(datos['datos']['fechaInicioContrato']);
        if (datos['datos']['estado'] === 'Activo' || datos['datos']['estado'] === 'Registrado') {
            $("#fechaTerminacionContrato").removeAttr('readonly');
            $("#fechaTerminacionContrato").val(datos['datos']['fechaTerminacionContrato']);
        } else {
            $("#fechaTerminacionContrato").attr('readonly', 'true');
            $("#fechaTerminacionContrato").val(datos['datos']['fechaTerminacionContrato']);
        }
        $("#tiempoTotalLab").val(datos['datos']['tiempoTotalLab']);
        $("#fechaInicioLiqPrestSoc").val(datos['datos']['fechaInicioLiqPrestSoc']);
        $("#diasNoLab").val(datos['datos']['diasNoLab']);
        $("#diasALiquidar").val(datos['datos']['diasALiquidar']);
        //Salario Base de Liquidacion
        $("#sueldoBasico").val(datos['datos']['sueldoBasico']);
        $("#auxilioTransporte").val(datos['datos']['auxilioTransporte']);
        $("#promedioSalarioVariable").val(datos['datos']['promedioSalarioVariable']);
        $("#totalBaseLiquidacion").val(datos['datos']['totalBaseLiquidacion']);
        $("#diasSancion").val(datos['datos']['diasSancion']);
        //Prima
        $("#fechaLiquidacionPrima").val(datos['datos']['fechaLiquidacionPrima']);
        $("#fechaCortePrima").val(datos['datos']['fechaCortePrima']);
        $("#diasPrima").val(datos['datos']['diasPrima']);
        //Cesantias
        $("#fechaLiquidacionCesantias").val(datos['datos']['fechaLiquidacionCesantias']);
        $("#fechaCorteCesantias").val(datos['datos']['fechaCorteCesantias']);
        $("#diasCesantias").val(datos['datos']['diasCesantias']);
        //Intereses a las Cesantias
        $("#fechaLiquidacionIntereses").val(datos['datos']['fechaLiquidacionIntereses']);
        $("#fechaCorteIntereses").val(datos['datos']['fechaCorteIntereses']);
        $("#diasIntereses").val(datos['datos']['diasIntereses']);
        //Vacaciones
        $("#fechaLiquidacionVacaciones").val(datos['datos']['fechaLiquidacionVacaciones']);
        if (datos['datos']['estado'] === 'Activo' || datos['datos']['estado'] === 'Registrado') {//      
            $("#fechaCorteVacaciones").val(datos['datos']['fechaCorteVacaciones']);
            $("#totalDiasVacaciones").val(datos['datos']['totalDiasVacaciones']);
        } else {
            $("#fechaCorteVacaciones").val(datos['datos']['fechaCorteVacaciones']);
            $("#totalDiasVacaciones").val(datos['datos']['totalDiasVacaciones']);
        }
        $("#diasTomadosVacaciones").val('');
        $("#diasPendientes").val('');
    } else {
        alert("SE HA PRESENTADO UN ERROR!.\nPOR FAVOR COMUNIQUESE CON EL ADMINISTRADOR DEL SISTEMA.")
    }
}

//Funcion para calcular el tiempo total laborado (meses en base a 30 dias)
function days_360() {
    var fecha1 = $("#fechaInicioContrato").val();
    var fecha2 = $("#fechaTerminacionContrato").val();
    var diasNoLab = parseFloat($("#diasNoLab").val());

    //try switch dates: min to max 
    if (fecha1 > fecha2) {
        var temf = fecha1;
        fecha1 = fecha2;
        fecha2 = temf;
    }

    // get day month year... 
    var fechaInicio = fecha1.split('-');
    var fechaTerminacion = fecha2.split('-');

    var yy1 = parseInt(fechaInicio[0]);
    var mm1 = parseInt(fechaInicio[1]);
    var dd1 = parseInt(fechaInicio[2]);

    var yy2 = parseInt(fechaTerminacion[0]);
    var mm2 = parseInt(fechaTerminacion[1]);
    var dd2 = parseInt(fechaTerminacion[2]);

    if (dd1 === 31) {
        dd1 = 30;
    }
    if (dd2 === 31) {
        dd2 = 30;
    }
    if (dd1 === 28 && mm1 === 2) {
        dd1 = 30;
    }
    if (dd2 === 28 && mm2 === 2) {
        dd2 = 30;
    }

    //Calcular
    var yy = yy2 - yy1;
    var mm = mm2 - mm1;
    var dd = dd2 - dd1;

    var totalDias = ((yy * 360) + (mm * 30) + dd + 1);
    var tiempoTotalLab = totalDias - diasNoLab;
    $("#tiempoTotalLab").val(totalDias);
    $("#diasALiquidar").val(tiempoTotalLab);
    //Prima
    $("#fechaLiquidacionPrima").val(fecha1);
    $("#fechaCortePrima").val(fecha2);
    $("#fechaLiquidacionPrima").attr('max', fecha2);
    $("#fechaCortePrima").attr('max', fecha2);
    $("#diasPrima").val(tiempoTotalLab);
    //Cesantias
    $("#fechaLiquidacionCesantias").val(fecha1);
    $("#fechaCorteCesantias").val(fecha2);
    $("#fechaLiquidacionCesantias").attr('max', fecha2);
    $("#fechaCorteCesantias").attr('max', fecha2);
    $("#diasCesantias").val(tiempoTotalLab);
    //Intereses a las Cesantias
    $("#fechaLiquidacionIntereses").val(fecha1);
    $("#fechaCorteIntereses").val(fecha2);
    $("#fechaLiquidacionIntereses").attr('max', fecha2);
    $("#fechaCorteIntereses").attr('max', fecha2);
    $("#diasIntereses").val(tiempoTotalLab);
    //Vacaciones
    $("#fechaLiquidacionVacaciones").val(fecha1);
    $("#fechaCorteVacaciones").val(fecha2);
    $("#fechaLiquidacionVacaciones").attr('max', fecha2);
    $("#fechaCorteVacaciones").attr('max', fecha2);
    $("#diasTomadosVacaciones").val('');
    $("#diasPendientes").val('');

    var totalDiasVacaciones = 0;
    if (tiempoTotalLab === 360) {
        var totalDiasVacaciones = Math.round(((tiempoTotalLab * 15) / 360) * 100) / 100;
        $("#totalDiasVacaciones").val(totalDiasVacaciones);
    } else if (tiempoTotalLab < 360) {
        var totalDiasMult = ((tiempoTotalLab) * 15) / 360;
        var totalDiasVacaciones = Math.round(((tiempoTotalLab * totalDiasMult) / 360) * 100) / 100;
        $("#totalDiasVacaciones").val(totalDiasVacaciones);
    } else {
        var totalDiasVacacionesDiv = (Math.round(((tiempoTotalLab) / 360) * 100) / 100).toString();
        var diasLaborados = (tiempoTotalLab);

        var totalDiasVacacionesDivArray = totalDiasVacacionesDiv.split('.');
        var numYearsLab = parseInt(totalDiasVacacionesDivArray[0]);
        var diasYearsLab = numYearsLab * 360;
        var diasrestantes = (diasLaborados - diasYearsLab);

        var totalDiasVacacionesYears = (numYearsLab) * 15;

        var totalDiasMult = ((diasrestantes) * 15) / 360;
        var totalVacacionesDiasRestantes = Math.round(((diasrestantes * totalDiasMult) / 360) * 100) / 100;

        var totalDiasVacaciones = totalVacacionesDiasRestantes + totalDiasVacacionesYears;
        $("#totalDiasVacaciones").val(totalDiasVacaciones);
    }
}

function dias360Prima() {
    var fecha1 = $("#fechaLiquidacionPrima").val();
    var fecha2 = $("#fechaCortePrima").val();
    var diasNoLab = parseFloat($("#diasNoLab").val());

    //Validar que la fecha inicio no sea mayor que la fecha fin
    if (fecha1 > fecha2) {
        alert("LA FECHA DE LIQUIDACION PRIMA NO PUEDE SER MAYOR A LA FECHA DE CORTE PRIMA!");
        $("#fechaLiquidacionPrima").val('');
        $("#diasPrima").val('');
        return false;
    } else {

        // get day month year... 
        var fechaInicio = fecha1.split('-');
        var fechaTerminacion = fecha2.split('-');

        var yy1 = parseInt(fechaInicio[0]);
        var mm1 = parseInt(fechaInicio[1]);
        var dd1 = parseInt(fechaInicio[2]);

        var yy2 = parseInt(fechaTerminacion[0]);
        var mm2 = parseInt(fechaTerminacion[1]);
        var dd2 = parseInt(fechaTerminacion[2]);

        //Validacion para los meses de 31 dias y 28 dias (Febrero)
        if (dd1 === 31) {
            dd1 = 30;
        }
        if (dd2 === 31) {
            dd2 = 30;
        }
        if (dd1 === 28 && mm1 === 2) {
            dd1 = 30;
        }
        if (dd2 === 28 && mm2 === 2) {
            dd2 = 30;
        }

        //Calcular
        var yy = yy2 - yy1;
        var mm = mm2 - mm1;
        var dd = dd2 - dd1;

        var totalDias = ((yy * 360) + (mm * 30) + dd + 1);
        $("#diasPrima").val(totalDias - diasNoLab);
        $("#fechaCortePrima").attr('min', fecha1);
    }
}

function dias360Cesantias() {
    var fecha1 = $("#fechaLiquidacionCesantias").val();
    var fecha2 = $("#fechaCorteCesantias").val();
    var diasNoLab = parseFloat($("#diasNoLab").val());

    //Validar que la fecha inicio no sea mayor que la fecha fin
    if (fecha1 > fecha2) {
        alert("LA FECHA DE LIQUIDACION DE CESANTIAS NO PUEDE SER MAYOR A LA FECHA DE CORTE DE CESANTIAS!");
        $("#fechaLiquidacionCesantias").val('');
        $("#diasCesantias").val('');
        return false;
    } else {

        // get day month year... 
        var fechaInicio = fecha1.split('-');
        var fechaTerminacion = fecha2.split('-');

        var yy1 = parseInt(fechaInicio[0]);
        var mm1 = parseInt(fechaInicio[1]);
        var dd1 = parseInt(fechaInicio[2]);

        var yy2 = parseInt(fechaTerminacion[0]);
        var mm2 = parseInt(fechaTerminacion[1]);
        var dd2 = parseInt(fechaTerminacion[2]);

        //Validacion para los meses de 31 dias y 28 dias (Febrero)
        if (dd1 === 31) {
            dd1 = 30;
        }
        if (dd2 === 31) {
            dd2 = 30;
        }
        if (dd1 === 28 && mm1 === 2) {
            dd1 = 30;
        }
        if (dd2 === 28 && mm2 === 2) {
            dd2 = 30;
        }

        //Calcular
        var yy = yy2 - yy1;
        var mm = mm2 - mm1;
        var dd = dd2 - dd1;

        var totalDias = ((yy * 360) + (mm * 30) + dd + 1);
        $("#diasCesantias").val(totalDias - diasNoLab);
        $("#fechaCorteCesantias").attr('min', fecha1);
    }
}

function dias360InteresesCesantias() {
    var fecha1 = $("#fechaLiquidacionIntereses").val();
    var fecha2 = $("#fechaCorteIntereses").val();
    var diasNoLab = parseFloat($("#diasNoLab").val());

    //Validar que la fecha inicio no sea mayor que la fecha fin
    if (fecha1 > fecha2) {
        alert("LA FECHA DE LIQUIDACION DE INTERESES DE CESANTIAS NO PUEDE SER MAYOR A LA FECHA DE CORTE DE INTERESES DE CESANTIAS!");
        $("#fechaLiquidacionIntereses").val('');
        $("#diasIntereses").val('');
        return false;
    } else {

        // get day month year... 
        var fechaInicio = fecha1.split('-');
        var fechaTerminacion = fecha2.split('-');

        var yy1 = parseInt(fechaInicio[0]);
        var mm1 = parseInt(fechaInicio[1]);
        var dd1 = parseInt(fechaInicio[2]);

        var yy2 = parseInt(fechaTerminacion[0]);
        var mm2 = parseInt(fechaTerminacion[1]);
        var dd2 = parseInt(fechaTerminacion[2]);

        //Validacion para los meses de 31 dias y 28 dias (Febrero)
        if (dd1 === 31) {
            dd1 = 30;
        }
        if (dd2 === 31) {
            dd2 = 30;
        }
        if (dd1 === 28 && mm1 === 2) {
            dd1 = 30;
        }
        if (dd2 === 28 && mm2 === 2) {
            dd2 = 30;
        }

        //Calcular
        var yy = yy2 - yy1;
        var mm = mm2 - mm1;
        var dd = dd2 - dd1;

        var totalDias = ((yy * 360) + (mm * 30) + dd + 1);
        $("#diasIntereses").val(totalDias - diasNoLab);

        $("#fechaCorteIntereses").attr('min', fecha1);
    }
}

function calcularTotalDiasVacaciones() {
    var fecha1 = $("#fechaLiquidacionVacaciones").val();
    var fecha2 = $("#fechaCorteVacaciones").val();
    var diasNoLab = parseFloat($("#diasNoLab").val());
    var totalDiasVacaciones = 0;
    var totalDiasMult = 0;
    var totalDiasVacacionesDiv = 0;

    //Validar que la fecha inicio no sea mayor que la fecha fin
    if (fecha1 > fecha2) {
        alert("LA FECHA DE LIQUIDACION DE VACACIONES NO PUEDE SER MAYOR A LA FECHA DE CORTE DE VACACIONES!");
        $("#fechaLiquidacionVacaciones").val('');
//        $("#fechaCorteVacaciones").val('');
        $("#totalDiasVacaciones").val('');
        $("#diasTomadosVacaciones").val('');
        $("#diasPendientes").val('');
        return false;
    } else {

        // get day month year... 
        var fechaInicio = fecha1.split('-');
        var fechaTerminacion = fecha2.split('-');

        var yy1 = parseInt(fechaInicio[0]);
        var mm1 = parseInt(fechaInicio[1]);
        var dd1 = parseInt(fechaInicio[2]);

        var yy2 = parseInt(fechaTerminacion[0]);
        var mm2 = parseInt(fechaTerminacion[1]);
        var dd2 = parseInt(fechaTerminacion[2]);

        //Validacion para los meses de 31 dias y 28 dias (Febrero)
        if (dd1 === 31) {
            dd1 = 30;
        }
        if (dd2 === 31) {
            dd2 = 30;
        }
        if (dd1 === 28 && mm1 === 2) {
            dd1 = 30;
        }
        if (dd2 === 28 && mm2 === 2) {
            dd2 = 30;
        }

        //Calcular
        var yy = yy2 - yy1;
        var mm = mm2 - mm1;
        var dd = dd2 - dd1;

        var totalDias = ((yy * 360) + (mm * 30) + dd + 1);

        var tiempoTotalLabDiasNoLab = totalDias - diasNoLab;
        if (tiempoTotalLabDiasNoLab === 360) {
            totalDiasVacaciones = (((tiempoTotalLabDiasNoLab) * 15) / 360).toFixed(2);
        } else if (tiempoTotalLabDiasNoLab < 360) {
            totalDiasMult = (((tiempoTotalLabDiasNoLab) * 15) / 360);
            totalDiasVacaciones = (((tiempoTotalLabDiasNoLab) * totalDiasMult) / 360).toFixed(2);
        } else {
            totalDiasVacacionesDiv = ((tiempoTotalLabDiasNoLab) / 360).toFixed(2);

            var totalDiasVacacionesDivArray = totalDiasVacacionesDiv.split('.');

            var numYearsLab = parseInt(totalDiasVacacionesDivArray[0]);
            var diasYearsLab = numYearsLab * 360;
            var diasrestantes = (tiempoTotalLabDiasNoLab - diasYearsLab);

            var totalDiasVacacionesYears = (numYearsLab) * 15;

            totalDiasMult = ((diasrestantes) * 15) / 360;
            var totalVacacionesDiasRestantes = (((diasrestantes) * totalDiasMult) / 360).toFixed(2);

            totalDiasVacaciones = totalVacacionesDiasRestantes + totalDiasVacacionesYears;
        }
        $("#totalDiasVacaciones").val(totalDiasVacaciones);
        $("#diasTomadosVacaciones").val('');
        $("#diasPendientes").val('');
    }
}

function imprimirLiquidacion(idLiquidacion) {
    $.get('imprimirLiquidacion', {idLiquidacion: idLiquidacion}, 'json');
    activarBloqueoAjax();
}

function verRespaldo(idLiquidacion) {
    $.get('verRespaldo', {idLiquidacion: idLiquidacion});
    activarBloqueoAjax();
}

//------------------------------------------------------------------------

function calcularVlrIncapacidad() {
    var dias = parseInt($("#diasIncapacidad").val());
    var vlrDia = Math.round(parseInt($("#sueldoBasico").val()) / 30);
    var vlrIncapacidad = 0;
    if (dias > 2) {
        var diasRestantes = dias - 2;
        vlrIncapacidad = (vlrDia * 2) + ((vlrDia * 0.6667) * diasRestantes);
    } else {
        vlrIncapacidad = (vlrDia * dias);
    }
    $("#vlrNovedad").val(Math.round(vlrIncapacidad));
}

//------------------------------------------------------------------------

//******************************************************************************
//******************************************************************************

function verGenerarNominas() {
    $.get('verGenerarNominas', {}, setVerGenerarNominas);
}
function setVerGenerarNominas(html) {
    $("#infoGenerar").html(html);
    $('#tablaGenerar').dataTable({
        "iDisplayLength": 25,
        "sPaginationType": "full_numbers",
        "oLanguage": {
            "sLengthMenu": "MOSTRAR: _MENU_ REGISTROS POR PAGINA",
            "sZeroRecords": "NO SE HA ENCONTRADO INFORMACION",
            "sInfo": "MOSTRANDO <b>_START_</b> A <b>_END_</b> REGISTROS <br>TOTAL REGISTROS: <b>_TOTAL_</b> REGISTROS</b>",
            "sInfoEmpty": "MOSTRANDO 0 A 0 REGISTROS",
            "sInfoFiltered": "(FILTRADOS DE UN TOTAL DE <b>_MAX_</b> REGISTROS)",
            "sLoadingRecords": "CARGANDO...",
            "sProcessing": "EN PROCESO...",
            "sSearch": "BUSCAR:",
            "sEmptyTable": "NO HAY INFORMACION DISPONIBLE PARA LA TABLA",
            "oPaginate": {
                "sFirst": "Inicio",
                "sLast": "Fin",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            }
        },
        "aaSorting": [[0, "desc"]],
    });
    $('#modalGenerar').modal('show');
}
//------------------------------------------------------------------------------
function verCrearNomina() {
    $.get('verCrearNomina', {}, setFormularioBootstrap);
    activarBloqueoAjax();
}
function verRegistrarNovedad(idEmpleado, desde) {
    $.get('verRegistrarNovedad', {idEmpleado: idEmpleado, mes: $("#mesBusq").val(), anio: $("#anioBusq").val(), desde: desde}, setFormularioBootstrap);
    activarBloqueoAjax();
}
function setFormularioBootstrap(html) {
    $("#divContenido").html(html);
    $('#modalFormulario').modal('show');
}
//------------------------------------------------------------------------------

function verEditarNovedad(idNovedadNomina) {
    $.get('verEditarNovedad', {idNovedadNomina: idNovedadNomina}, setVerEditarNovedad, 'json');
    activarBloqueoAjax();
}
function setVerEditarNovedad(datos) {
//console.log('aqui');
    $("#divContenido").html(datos['html']);
    $("#tipoNovedad").val(datos['tipoNovedad']);
    setTipoNovedad(datos['tipoNovedad'], false);
    $('#modalFormulario').modal('show');
}

//------------------------------------------------------------------------------

function verDetalleNovedad(idNovedadNomina) {
    $.get('verDetalleNovedad', {idNovedadNomina: idNovedadNomina}, setDetalleNovedad, 'json');
    activarBloqueoAjax();
}
function verEliminarNovedad(idNovedadNomina) {
    $.get('verEliminarNovedad', {idNovedadNomina: idNovedadNomina}, setDetalleNovedad, 'json');
    activarBloqueoAjax();
}
function setDetalleNovedad(datos) {
//console.log('aqui');
    $("#divContenido").html(datos['html']);
    $("#tipoNovedad").val(datos['tipoNovedad']);
    setTipoNovedad(datos['tipoNovedad'], true);
    $('#modalFormulario').modal('show');
}

//------------------------------------------------------------------------------
function validarGenerar() {
    var cont = $("input:checkbox:checked").length;
    if (cont === 0) {
        alert("DEBE SELECCIONAR AL MENOS UN EMPLEADO");
        return false;
    }
    return confirm("\n PERIODO: " + $("#mesGenerar").val() + " \n ANIO: " + $("#anioGenerar").val() + "\n EMPLEADOS SELECCIONADOS: " + cont + "\n\n ¿ DESEA GENERAR LA NOMINA A LOS EMPLEADOS SELECCIONADOS ?");
}

//------------------------------------------------------------------------

function getVlrHorasExtra(diasNomina, horasDia) {
    var horas = $("#horas").val();
    var tipo = $("#tipoHorasExtra").val();
    var jornada = $("#jornadaHorasExtra").val();
    var vlrHorasExtra = 0;
    var sueldoBasico = $("#vlrSueldoBasico").val();
    var vlrHora = sueldoBasico / (diasNomina * horasDia);
    if (jornada === 'Diurna') {
        switch (tipo) {
            case 'Dominical':
                vlrHorasExtra = Math.round((vlrHora * 2) * horas);
                break;
            case 'Festivo':
                vlrHorasExtra = Math.round((vlrHora * 2) * horas);
                break;
            case 'Ordinario':
                vlrHorasExtra = Math.round((vlrHora * 1.25) * horas);
                break;
            default:
                vlrHorasExtra = 0;
                break;
        }
    } else {
        switch (tipo) {
            case 'Dominical':
                vlrHorasExtra = Math.round((vlrHora * 2.5) * horas);
                break;
            case 'Festivo':
                vlrHorasExtra = Math.round((vlrHora * 2.5) * horas);
                break;
            case 'Ordinario':
                vlrHorasExtra = Math.round((vlrHora * 1.75) * horas);
                break;
            default:
                vlrHorasExtra = 0;
                break;
        }
    }
    $("#vlrNovedad").val(vlrHorasExtra);
}

//------------------------------------------------------------------------

function getSueldoBasicoNomina(idNomina) {
    $("#vlrSueldoBasico").val(0);
    if (idNomina !== '') {
        $.get('getSueldoBasicoNomina', {idNomina: idNomina}, setSueldoBasicoNomina, 'json');
        activarBloqueoAjax();
    }
}
function setSueldoBasicoNomina(respuesta) {
    if (parseInt(respuesta['error']) === 0) {
        $("#vlrSueldoBasico").val(respuesta['vlrSueldoBasico']);
    } else {
        alert("SE HA PRESENTADO UN ERROR, POR FAVOR ACTUALICE LA PAGINA E INTENTE DE NUEVO");
    }
}

//------------------------------------------------------------------------

function getNominasByMes() {
    $("#idNominaNovedad").html('<option value="">Seleccione...</option>');
    var mes = $("#mesNovedad").val()
    var anio = $("#anioNovedad").val()
    if (mes !== '' && anio !== '') {
        $.get('getNominasByMes', {mes: mes, anio: anio, idEmpleado: $("#idEmpleado").val()}, setNominasByMes, 'json');
        activarBloqueoAjax();
    }
}
function setNominasByMes(respuesta) {
    if (parseInt(respuesta['error']) === 0) {
        $("#idNominaNovedad").html(respuesta['listaNominas']);
    } else {
        $("#idNominaNovedad").html('<option value="">Seleccione...</option>');
        alert("SE HA PRESENTADO UN ERROR, POR FAVOR ACTUALICE LA PAGINA E INTENTE DE NUEVO");
    }
}

function calcularDiasLiquidacion() {
    if ($("#diasNoLab").val() !== '') {
        var totaldias = parseFloat($("#tiempoTotalLab").val()) - parseFloat($("#diasNoLab").val());
        $("#diasALiquidar").val(totaldias);
        $("#diasPrima").val(totaldias);
        $("#diasCesantias").val(totaldias);
        $("#diasIntereses").val(totaldias);
    }
}

function validarEliminarNomina(idNomina) {
    if (confirm(" DESEA ELIMINAR ESTA NOMINA ? ")) {
        location.href = 'deleteNomina?idNomina=' + idNomina;
    }
    return false;
}

function vercambiardias(idNomina, empleado){
    $('#idNominaAux').val(idNomina);
    $('#empleadoAux').val(empleado);
    $('#numdiasAux').val('');
    $('#modalCambioDias').modal('show');
}

function vercambiarsueldo(idNomina, empleado){
    $('#idNominaAux1').val(idNomina);
    $('#empleadoAux1').val(empleado);
    $('#sueldobasicoAux').val('');
    $('#modalCambioSueldo').modal('show');
}

function vercambiartipocontrato(idNomina, empleado){
    $('#idNominaAux2').val(idNomina);
    $('#empleadoAux2').val(empleado);
    $('#tipoContratoAux').val('');
    $('#modalCambioTipoContrato').modal('show');
}

function verDesprendibles() {
    location.href = "desprendibles?estadoNominas=" + $("#estadoNominas").val() + "&mes=" + $("#mesBusq").val() + "&anio=" + $("#anioBusq").val();
}
