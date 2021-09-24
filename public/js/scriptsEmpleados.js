function filtrarMunicipios() {
    var nuevo = document.getElementById('formNuevo');
    nuevo.setAttribute('action', 'nuevo');
    nuevo.submit();
}
function filtrarMunicipiosUpd() {
    var nuevo = document.getElementById('formNuevo');
    nuevo.setAttribute('action', 'actualizar');
    nuevo.submit();
}

function enviarForm() {
    if (confirm('¿ Desea Registrar este Empleado ?')) {

        var sub = document.getElementById('formNuevo');
        sub.setAttribute('action', 'insertar');
        sub.submit();
    }
}
function validarUpd() {
    if (confirm('¿ Desea Actualizar este Empleado ?')) {
        var sub = document.getElementById('formNuevo');
        sub.setAttribute('action', 'editar');
        sub.submit();
    }
}

function cambiarEstado(idEmpleado, estado) {
    if (estado == 0) {
        if (confirm("¿ Esta seguro que desea DESACTIVAR este Empleado ?")) {
            window.location = "/sw2click/modulos/empleado/desactivar?idEmpleado=" + idEmpleado;
        }
    } else {
        if (confirm("¿ Esta seguro que desea ACTIVAR este Empleado ?")) {
            window.location = "/sw2click/modulos/empleado/activar?idEmpleado=" + idEmpleado;
        }
    }
}

function setNombreMcpo() {
    var cbxIdMcpo = document.getElementById('idMcpo');
    var txtMunicipio = document.getElementById('municipio');
    txtMunicipio.value = cbxIdMcpo.options[cbxIdMcpo.selectedIndex].text;
}

function getMcpos() {
    var idDpto = $("#idDpto").val();
    if (idDpto !== '') {
        $.get("getMcpos", {idDpto: idDpto}, setMcpos, 'json');
    } else {
        $('#idMcpo').html("<option value=''>Seleccione...</option>");
    }
}

function setMcpos(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#idMcpo").html(datos['html']);
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n COMUNIQUESE CON EL ADMINISTRADOR");
    }
}

function calcularEdad() {
    var fechaActual = $("#fechaActual").val();
    var fechaNacimiento = $("#fechaNacimiento").val();
    var partesActual = fechaActual.split('-');
    var partesCumple = fechaNacimiento.split('-');
//    alert(parseInt(partesActual[0]) + '-' + parseInt(partesCumple[0]))
    var edad = parseInt(partesActual[0]) - parseInt(partesCumple[0]);
    $("#edad").val(edad);
}

function calcularDuracion() {
    if ($("#fechaContratacion").val() !== '' && $("#fechaTerminacion").val() !== '') {
        var fechaInicio = new Date($("#fechaContratacion").val());
        var fechaTerminacion = new Date($("#fechaTerminacion").val());
        var diferencia = (fechaTerminacion - fechaInicio);
        var dias = Math.round((diferencia / (1000 * 60 * 60 * 24))) + 1;
        $("#duracion").val(dias);
    } else {
        $("#duracion").val(0);
    }
}

function setLimiteTerminacion() {
    if ($("#fechaContratacion").val() !== '') {
        $("#fechaTerminacion").attr('min', $("#fechaContratacion").val());
    } else {
        $("#fechaTerminacion").removeAttr('min');
    }
}

function validarCedula() {
    var cedula = $("#cedula").val();
    if ($("#cedulaOLD").length !== 0) {
        if (cedula !== $("#cedulaOLD").val()) {
            $.get('validarCedula', {cedula: cedula}, mostrarValidacionCedula, 'json');
        } else {
            $("#divValidaCedula").hide('slow');
        }
    } else {
        $.get('validarCedula', {cedula: cedula}, mostrarValidacionCedula, 'json');
    }
}

function mostrarValidacionCedula(datos) {
    if (datos['error'] === 0 && datos['html']) {
        $("#divValidaCedula").show('slow');
    } else {
        $("#divValidaCedula").hide('slow');
    }
}

function validarNumCuenta() {
    var numCuenta = $("#numCuenta").val();
    if ($("#numCuentaOLD").length !== 0) {
        if (numCuenta !== $("#numCuentaOLD").val()) {
            $.get('validarNumCuenta', {numCuenta: numCuenta}, mostrarValidacionNumCuenta, 'json');
        } else {
            $("#divValidaNumCuenta").hide('slow');
        }
    } else {
        $.get('validarNumCuenta', {numCuenta: numCuenta}, mostrarValidacionNumCuenta, 'json');
    }
}

function mostrarValidacionNumCuenta(datos) {
    if (datos['error'] === 0 && datos['html']) {
        $("#divValidaNumCuenta").show('slow');
    } else {
        $("#divValidaNumCuenta").hide('slow');
    }
}

//------------------------------------------------------------------------------

function ocultarAux() {
    var href = location.href;
    if (href.indexOf('#') !== -1) {
        var partes = href.split('#');
        location.href = partes[0] + '#close';
    } else {
        location.href = '#close';
    }
    if (parseInt($("#actualizar").val()) === 1) {
        location.reload();
    }
}

function verAux(evento) {
    evento.stopPropagation();
}

//                                         CODIGO MODIFICADO
//================================================================================================

function getNuevo() {
    $.get('nuevo', '', setFormularioEmpleado, 'json');
}
function getActualizacion(idEmpleado) {
    $.get('actualizar', {idEmpleado: idEmpleado}, setFormularioEmpleado, 'json');
}

function setFormularioEmpleado(datos) {
    if (datos['error'] === 0) {
        $("#divContenido").html(datos['html']);
        $('#modalFormulario').modal('show');
        $("#idDpto").focus();
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

//================================================================================================

function setAccion(accion) {
    switch (accion) {
        case 1:
            $("#formNuevo").attr('onsubmit', 'return validarNuevo();');
            break;
        case 2:
            $("#formNuevo").attr('onsubmit', 'return validarActualizacion();');
            break;
        case 3:
            $("#formNuevo").attr('onsubmit', 'return validarNuevaNovedad();');
            break;
        case 4:
            $("#formNuevo").attr('onsubmit', 'return validarActualizacionNovedad();');
            break;
    }
}

function imprimirContrato(idEmpleado) {
    window.open('imprimirContrato?idEmpleado=' + idEmpleado, '_blank')
}

function verAdicionalContrato() {
    switch ($("#tipoContrato").val()) {
        case 'Aprendizaje':
            $("#divInfoContratoAprendizaje").find('input').each(function () {
                $(this).val('');
            });
            $("#divAfiliaciones").find('input').each(function () {
                $(this).removeAttr('required');
            });
            $("#divAfiliaciones").find('span').each(function () {
                $(this).hide();
            });
            $("#eps").attr('required', true);
            $("#arl").attr('required', true);
            $("#spanEPS").show();
            $("#spanARL").show();
            $("#horarioLaboral").attr('required', true);
            $("#divInfoContratoAprendizaje").show('slow');
            break;
        case 'Pasantia':
            $("#divInfoContratoAprendizaje").find('input').each(function () {
                $(this).val('');
            });
            $("#divAfiliaciones").find('input').each(function () {
                $(this).removeAttr('required');
            });
            $("#divAfiliaciones").find('span').each(function () {
                $(this).hide();
            });
            $("#eps").attr('required', true);
            $("#arl").attr('required', true);
            $("#spanEPS").show();
            $("#spanARL").show();
            $("#horarioLaboral").attr('required', true);
            $("#divInfoContratoAprendizaje").show('slow');
            break;

        case 'Laboral Administrativo':
            $("#divAfiliaciones").find('input').each(function () {
                $(this).attr('required', true);
            });
            $("#divAfiliaciones").find('span').each(function () {
                $(this).show();
            });
            $("#horarioLaboral").attr('required', true);
            $("#divInfoContratoAprendizaje").hide('slow');
            break;

        case 'Laboral Tecnico':
            $("#divAfiliaciones").find('input').each(function () {
                $(this).attr('required', true);
            });
            $("#divAfiliaciones").find('span').each(function () {
                $(this).show();
            });
            $("#horarioLaboral").attr('required', true);
            $("#divInfoContratoAprendizaje").hide('slow');
            break;
        case 'Laboral Tecnico con Bonificacion':
            $("#divAfiliaciones").find('input').each(function () {
                $(this).attr('required', true);
            });
            $("#divAfiliaciones").find('span').each(function () {
                $(this).show();
            });
            $("#horarioLaboral").attr('required', true);
            $("#divInfoContratoAprendizaje").hide('slow');
            break;

        case 'Servicios':
            $("#divAfiliaciones").find('input').each(function () {
                $(this).removeAttr('required');
            });
            $("#divAfiliaciones").find('span').each(function () {
                $(this).hide();
            });
            $("#horarioLaboral").removeAttr('required');
            $("#divInfoContratoAprendizaje").hide('slow');
            break;
    }
}

function setAplicaRodamiento() {
    if (parseInt($("#aplicaRodamiento").val()) === 1) {
        $("#divRodamiento").show('slow');
        $("#vlrRodamiento").attr('required', true);
        $("#vlrRodamiento").val('');
        $("#vlrRodamiento").focus();
    } else {
        $("#divRodamiento").hide('slow');
        $("#vlrRodamiento").removeAttr('required');
    }
}

function setAplicaPeriodoPrueba() {
    if (parseInt($("#aplicaPeriodoPrueba").val()) === 1) {
        $("#divPeriodoPrueba").show('slow');
        $("#duracionPrueba").attr('required', true);
        $("#duracionPrueba").val('');
        $("#duracionPrueba").focus();
    } else {
        $("#divPeriodoPrueba").hide('slow');
        $("#duracionPrueba").removeAttr('required');
    }
}

function setAplicaBonificacion() {
    if (parseInt($("#aplicaBonificacion").val()) === 1) {
        $("#divBonificacion").show('slow');
        $("#vlrBonificacion").attr('required', true);
        $("#vlrBonificacion").val('');
        $("#vlrBonificacion").focus();
    } else {
        $("#divBonificacion").hide('slow');
        $("#vlrBonificacion").removeAttr('required');
    }
}


function verNuevo() {
    var idEmpleado = $("#idEmpleadoAux").val();
    $.get('nuevaNovedad', {idEmpleado: idEmpleado}, setFormulario, 'json');
}

function validarNuevaNovedad() {
    var aplicaA = $("#mesNomina option:selected").text() + ' ' + $("#anioNomina").val();
    var valor = formatoMoneda($("#vlrNovedad").val(), 0);
    var concepto = $("#observacion").val();
    if (confirm("INFORMACION DE LA NOVEDAD \n\n   APLICA A:   " + aplicaA + "\n       VALOR:   " + valor + "\nCONCEPTO:   " + concepto + "\n\n ¿ DESEA REGISTRAR ESTA NOVEDAD ?")) {
        $("#formNuevo").attr('action', 'registrarNovedad');
        return true;
    } else {
        $("#formNuevo").removeAttr('action');
        return false;
    }
}

function getAsistencia(tipo) {
    if (tipo === '') {
        $("#divNovedad").hide();
        $("#divAsistencia").hide();
        $("#divAccionesFrmPpal").show('slow');
        $("#frmNuevaAsistencia").hide();
        $("#incapacidad").val('Ninguna');
        $("#divIncapacidad").hide();
        $("#asiste").val('');
        $("#labora").val('');
        $("#observacion").val('');
        $("#fechaAsistenciaAux").val('');
        $("#fechaAsistencia").val('');
    } else if (tipo === 'Asistencia') {
        $("#divNovedad").hide();
        $("#divAccionesFrmPpal").hide();
        $("#divAsistencia").show('slow');
        $("#incapacidad").val('Ninguna');
        $("#divIncapacidad").hide();
        $("#asiste").val('');
        $("#labora").val('');
        $("#observacion").val('');
        $("#incapacidad").val('Ninguna');
        $("#frmNuevaAsistencia").show('slow');
        $("#fechaAsistenciaAux").val('');
        $("#fechaAsistencia").val('');
        $("#tblDetallesDia tbody").html('<tr><td colspan="6" style="background: #FAA">SELECCIONE UNA FECHA</td></tr>');
        $('#tablaCalendario tbody tr').each(function () {
            $(this).children('td').each(function () {
                $(this).css('background', '#d5eaf0');
                $(this).css('font-weight', 'normal');
            });
        });
    } else {
        $("#divNovedad").show('slow');
        $("#divAsistencia").hide('hide');
        $("#divAccionesFrmPpal").show('slow');
        $("#frmNuevaAsistencia").hide();
        $("#incapacidad").val('Ninguna');
        $("#divIncapacidad").hide();
        $("#asiste").val('');
        $("#labora").val('');
        $("#observacion").val('');
        $("#fechaAsistenciaAux").val('');
        $("#fechaAsistencia").val('');
    }
}

function getInfoAsistencia(fecha) {
    var idEmpleado = $("#idEmpleado").val();
    $.get('getInfoAsistencia', {idEmpleado: idEmpleado, fecha: fecha}, setInfoAsistencia, 'json');
}

function setInfoAsistencia(datos) {
    $("#incapacidad").val('Ninguna');
    $("#divIncapacidad").hide();
    $("#asiste").val('');
    $("#labora").val('');
    $("#observacion").val('');
    $("#observacion_1").val('');
    if (parseInt(datos['error']) === 0) {
        if (datos['html'] !== '') {
            $("#tblDetallesDia tbody").html(datos['html']);
        } else {
            $("#tblDetallesDia tbody").html("<tr><td colspan='6'>NO HAY INFORMACION PARA LA FECHA SELECCIONADA</td></tr>");
        }
        $("#fechaAsistenciaAux").val(datos['fecha']);
        $("#fechaAsistencia").val(datos['fecha']);
        switch (datos['accion']) {
            case 0:
                $("#msgConfirm").html('');
                $("#msgConfirm").hide();
                break;
            case 1:
                $("#msgConfirm").html("LA NOVEDAD DE ASISTENCIA SE HA REGISTRADO CORRECTAMENTE");
                $("#actualizar").val(1);
                $("#msgConfirm").show('slow');
                break;
            case 2:
                $("#msgConfirm").html("LA NOVEDAD DE ASISTENCIA SE HA ELIMINADO CORRECTAMENTE");
                $("#actualizar").val(1);
                $("#msgConfirm").show('slow');
                break;
        }
    } else {
        $("#frmNuevaAsistencia").hide();
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function setIncapacidad(tipo) {
    $("#incapacidad").val('Ninguna');
    if (tipo === '') {
        $("#").hide('slow');
        $("#divIncapacidad").hide('slow');
        return;
    }
    if (parseInt(tipo) === 0) {
        $("#divIncapacidad").show('slow');
    } else {
        $("#divIncapacidad").hide('slow');
    }
}

function validarNuevaAsistencia() {
    if (confirm("¿ DESEA REGISTRAR ESTA NOVEDAD DE ASISTENCIA ?")) {
        $.post('registrarAsistencia', $("#frmNuevaAsistencia").serialize(), setInfoAsistencia, 'json');
    }
    return false;
}

function eliminarNovedadAsistencia(idAsistencia) {
    if (confirm("¿ DESEA ELIMINAR ESTA NOVEDAD DE ASISTENCIA ?")) {
        var idEmpleado = $("#idEmpleado").val();
        var fecha = $("#fechaAsistenciaAux").val();
        $.post('eliminarAsistencia', {idAsistencia: idAsistencia, idEmpleado: idEmpleado, fechaAsistencia: fecha}, setInfoAsistencia, 'json');
    }
    return false;
}

function formatoMoneda(cnt, cents) {
    cnt = parseFloat(cnt.toString().replace(/\$|\u20AC|\,/g, ''));
    if (isNaN(cnt))
        return 0;
    var sgn = (cnt === (cnt = Math.abs(cnt)));
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

function verEliminacion() {
    var idNovedad = $("#idNovedad").val();
    if (parseInt(idNovedad) === 0) {
        alert("DEBE SELECCIONAR UNA NOVEDAD");
        return false;
    }
    if ($("#estado").val() !== 'Registrado') {
        alert("NO ES POSIBLE <<ELIMINAR>> ESTA NOVEDAD \n\nSOLO LAS NOVEDADES EN ESTADO <<REGISTRADO>> PUEDEN SER ELIMINADAS");
        return false;
    }
    if (confirm("¿ DESEA ELIMINAR ESTA NOVEDAD ?")) {
        location.href = "eliminarNovedad?idNovedad=" + idNovedad + "&idEmpleado=" + $("#idEmpleadoAux").val();
        return true;
    } else {
        return false;
    }
}

function verEdicion() {
    var idNovedad = $("#idNovedad").val();
    if (parseInt(idNovedad) === 0) {
        alert("DEBE SELECCIONAR UNA NOVEDAD");
        return false;
    }
    if ($("#estado").val() !== 'Registrado') {
        alert("NO ES POSIBLE <<EDITAR>> ESTA NOVEDAD \n\nSOLO LAS NOVEDADES EN ESTADO <<REGISTRADO>> PUEDEN SER ELIMINADAS");
        return false;
    }
    $.get('verEdicionNovedad', {idNovedad: idNovedad}, setFormulario, 'json');
}

function setFormulario(datos) {
    if (datos['error'] === 0) {
        $("#divContenido").html(datos['html']);
        $('#modalFormulario').modal('show');
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function validarActualizacionNovedad() {
    if (confirm("¿ DESEA GUARDAR LOS CAMBIOS DE LA NOVEDAD ?")) {
        $("#formNuevo").attr('action', 'editarNovedad');
        return true;
    } else {
        $("#formNuevo").removeAttr('action');
        return false;
    }
}

function verDetalles() {
    var idNovedad = $("#idNovedad").val();
    if (parseInt(idNovedad) === 0) {
        alert("DEBE SELECCIONAR UNA NOVEDAD");
        return false;
    }
    $.get('verDetallesNovedad', {idNovedad: idNovedad}, setFormulario, 'json');
}

function verCodigoBarras(idEmpleado) {
    $.get('verCodigoBarras', {idEmpleado: idEmpleado}, setFormulario1);
}
function setFormulario1(datos) {
    if (datos !== '') {
        $("#divContenido").html(datos);
        $('#modalFormulario').modal('show');
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}