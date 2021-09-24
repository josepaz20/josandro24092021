function ocultarAux() {
    var href = location.href;
    if (href.indexOf('#') !== -1) {
        var partes = href.split('#');
        if ($("#padre").val() === '') {
            location.href = partes[0] + '#close';
        } else {
            location.href = partes[0] + '#' + $("#padre").val();
        }
    } else {
        if ($("#padre").val() === '') {
            location.href = '#close';
        } else {
            location.href = '#' + $("#padre").val();
        }
    }
    $("#padre").val('');
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

function getNuevo() {
    $.get('nuevo', {}, setFormulario, 'json');
}

function getActualizacion(idContrato) {
    $.get('actualizar', {idContrato: idContrato}, setFormulario, 'json');
}
function verDetalle(idContrato) {
    $.get('verDetalle', {idContrato: idContrato}, setFormulario, 'json');
}
function setFormulario(datos) {
    if (datos !== '') {
        $("#divContenido").html(datos['html']);
        $('#modalFormulario').modal('show');
        if (datos['tipoContratoAjax'] !== '') {
            $("#tipoContratoHTML").show('fast');
            $("#tipoContratoHTML").html(datos['tipoContratoAjax']);
        } else {
            $("#tipoContratoHTML").html('ERROR NO SE OBTUVO DATOS DE TIPO COTRATO');
        }
    } else {
        alart('PARECE QUE NO SE HA PODIDO CONSEGUIR DATOS');
    }
}

function validarNuevo() {
    if (confirm("¿ Desea REGISTRAR este Contrato ?")) {
        $("#formNuevo").attr('action', 'insertar');
        return true;
    } else {
        $("#formNuevo").removeAttr('action');
        return false;
    }
}

function validarActualizacion() {
    if (confirm("¿ Desea ACTUALIZAR la Informacion de este Contrato ?")) {
        $("#formNuevo").attr('action', 'editar');
        return true;
    } else {
        $("#formNuevo").removeAttr('action');
        return false;
    }
}

function setAccion(accion) {
    switch (accion) {
        case 1:
            $("#formNuevo").attr('onsubmit', 'return validarNuevo();');
            break;
        case 2:
            $("#formNuevo").attr('onsubmit', 'return validarActualizacion();');
            break;
    }
}

function imprimirContrato(idContrato) {
    window.open('imprimirContrato?idContrato=' + idContrato, '_blank');
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

function setRenovacion(checked) {
    if (checked) {
        $("#btnEnviar").attr('onclick', 'setAccion(1)');
        $("#btnEnviar").val('Renovar');
    } else {
        $("#btnEnviar").attr('onclick', 'setAccion(2)');
        $("#btnEnviar").val('Actualizar');
    }
}

