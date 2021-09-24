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
    $.get('getNuevo', '', setNuevo, 'json');
}

function setNuevo(datos) {
    if (datos['error'] === 0) {
        var href = location.href;
        $("#formNuevo").html(datos['html']);
        if (href.indexOf('#') !== -1) {
            var partes = href.split('#');
            location.href = partes[0] + '#openModal';
        } else {
            location.href = '#openModal';
        }
        $("#formNuevo").attr('onsubmit', 'return validarNuevo()');
        $("#concepto").focus();
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function getInfoDane() {
    var idInstitucion = $('#idInstitucion').val();
    if (idInstitucion.length !== 0) {
        $.get('getInfoDane', {idInstitucion: idInstitucion}, setInfoDane, 'json');
    } else {

    }
}

function setInfoDane(datos) {
    if (datos['yaRegistrada'] === 1) {
        $("#divYaRegistrada").show('slow');
        return;
    } else {
        $("#divYaRegistrada").hide('slow');
    }
    if (datos['error'] === 0) {
        $("#divInfoDANE").html(datos['html']);
        $("#divInfoDANE").show('slow');
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function getInfoEmpleado() {
    var idEmpleado = $('#idEmpleado').val();
    if (idEmpleado.length !== 0) {
        $.get('getInfoEmpleado', {idEmpleado: idEmpleado}, setInfoEmpleado, 'json');
    } else {

    }
}

function setInfoEmpleado(datos) {
    if (datos['error'] === 0) {
        $("#divInfoEmpleado").html(datos['html']);
        $("#divInfoEmpleado").show('slow');
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function validarNuevo() {
    if (confirm("¿ Desea REGISTRAR la Informacion de esta Prueba ?")) {
        $("#formNuevo").attr('action', 'setNuevo');
        return true;
    } else {
        $("#formNuevo").removeAttr('action');
        return false;
    }
}

function validarCambio() {
    if (confirm("¿ Desea CAMBIAR el Estado de esta Prueba ?")) {
        $("#formNuevo").attr('action', 'setEstado');
        return true;
    } else {
        $("#formNuevo").removeAttr('action');
        return false;
    }
}

function verCambiarEstado(idPrueba) {
    $.get('cambiarEstado', {idPrueba: idPrueba}, cambiarEstado, 'json');
}

function cambiarEstado(datos) {
    if (datos['error'] === 0) {
        var href = location.href;
        $("#formNuevo").html(datos['html']);
        if (href.indexOf('#') !== -1) {
            var partes = href.split('#');
            location.href = partes[0] + '#openModal';
        } else {
            location.href = '#openModal';
        }
        $("#formNuevo").attr('onsubmit', 'return validarCambio()');
        $("#concepto").focus();
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function verPrueba(idPrueba) {

}