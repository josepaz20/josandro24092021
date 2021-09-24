function ocultarAux() {
    var href = location.href;
    if (href.indexOf('#') !== -1) {
        var partes = href.split('#');
        location.href = partes[0] + '#close';
    } else {
        location.href = '#close';
    }
//    location.reload();
}

function verAux(evento) {
    evento.stopPropagation();
}

function buscarCorporativo() {
    href = 'buscarCorporativo';
    window.open(href, '_blank', 'width=1100, height=650, scrollbars=YES');
}

function buscarResidencial() {
    href = 'buscarResidencial';
    window.open(href, '_blank', 'width=1100, height=650, scrollbars=YES');
}

function setCorporativo(idCorporativo) {
    $.get('getCorporativo', {idCorporativo: idCorporativo}, cargarInfoCorporativo, 'json');
}

function cargarInfoCorporativo(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#formulario_tabla", parent.opener.document).show();
        $("#divInfoCliente", parent.opener.document).html(datos['htmlCliente']);
        if (datos['htmlServicios'] !== "") {
            $("#tablaServicios tbody", parent.opener.document).html(datos['htmlServicios']);
        }
    }
    self.close();
}

function setResidencial(idResidencial) {
    $.get('getResidencial', {idResidencial: idResidencial}, cargarInfoResidencial, 'json');
}

function cargarInfoResidencial(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#formulario_tabla", parent.opener.document).show();
        $("#divInfoCliente", parent.opener.document).html(datos['htmlCliente']);
        if (datos['htmlServicios'] !== "") {
            $("#tablaServicios tbody", parent.opener.document).html(datos['htmlServicios']);
        }
    }
    self.close();
}

function cambiarIP(idServicio, ipRadio, ipAntena) {
    $("#idServicio").val(idServicio);
    $("#ipRadio").val(ipRadio);
    $("#ipAntena").val(ipAntena);
    $("#ipAntenaNueva").val('');
    $("#ipRadioNueva").val('');
    $("#ipRadioNueva").focus();
    $("#enviar").removeAttr('disabled');
    $("#divExisteIP").hide();
    var partesHref = document.location.href.split('#');
    if (partesHref.length > 1) {
        document.location.href = partesHref[0] + '#openModal';
    } else {
        document.location.href += '#openModal';
    }
    return false;
}

function verificarIP() {
    if ($("#nuevaIP").val() !== '') {
        $.get('verificarIP', {dirIP: $("#nuevaIP").val()}, existeIP, 'json');
    }
}

function existeIP(datos) {
    if (parseInt(datos['existe']) === 1) {
        $("#enviar").attr('disabled', true);
        $("#divExisteIP").show('1000', 'swing');
    } else {
        $("#enviar").removeAttr('disabled');
        $("#divExisteIP").hide('1000', 'swing');
    }
}

function validarActualizacion() {
    if($("#ipRadioNueva").val() === '' && $("#ipAntenaNueva").val() === ''){
        alert("NO SE HAN HECHO CAMBIOS A LAS IPs");
        return false;
    }
    if (confirm("¿ Esta seguro que desea ACTUALIZAR este Servicio ?")) {
        $("#formServicio").attr('action', 'cambiarIP');
        return true;
    } else {
        return false;
    }
}

function validarActivacion() {
    if (confirm('¿ Desea ACTIVAR este Servicio ?')) {
        $("#formServicio").attr('action', 'activarServicio');
        return true;
    } else {
        $("#formServicio").removeAttr('action');
        return false;
    }
}

function setIdServicio(idServicio, tipo, estado) {
    $("#idServicio").val(idServicio);
    $("#tipoServicio").val(tipo);
    $("#estado").val(estado);
}

function verRegistrar() {
    $("#lista").val('');
    $("#dirIP").val('');
    $("#comentario").val('');
    $("#deshabilitado").val('');
    var partesHref = document.location.href.split('#');
    if (partesHref.length > 1) {
        document.location.href = partesHref[0] + '#modalAdd';
    } else {
        document.location.href += '#modalAdd';
    }
    return false;
}
