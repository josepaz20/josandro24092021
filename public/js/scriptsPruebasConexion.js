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
        $("#concepto").focus();
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function getInfoDane() {
    var idDane = $('#idDane').val();
    if (idDane.length !== 0) {
        $.get('getInfoDane', {idDane: idDane}, setInfoDane, 'json');
    } else {

    }
}

function setInfoDane(datos) {
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

function verPrueba(idPrueba) {
    
}