function getInfoServicio(idServicio) {
    if (idServicio !== '') {
        $.get('getInfoServicio', {idServicio: idServicio}, setInfoServicio, 'json');
    } else {
        $("#divInfoServicio").html('');
        $("#divYaRegistrado").hide('slow');
    }
}

function setInfoServicio(datos) {
    $("#divInfoServicio").html(datos['html']);
    if (parseInt(datos['registrado']) !== 0) {
        $("#divYaRegistrado").show('slow');
    } else {
        $("#divYaRegistrado").hide('slow');
    }
}

function seleccionar(id, tipo) {
    if (tipo === 1) {
        $.get('getClienteCorp', {idCorporativo: id}, setClienteCorp, 'json');
    } else {
        $.get('getClienteRes', {idResidencial: id}, setClienteRes, 'json');
    }
}

function setClienteCorp(datos) {
    $("#divYaRegistrado", parent.opener.document).hide();
    $("#divInfoServicio", parent.opener.document).html('');
    $("#divInfoCliente", parent.opener.document).html(datos['html']);
    $("#idServicio", parent.opener.document).html(datos['servicios']);
    self.close();
}

function setClienteRes(datos) {
    $("#divYaRegistrado", parent.opener.document).hide('');
    $("#divInfoServicio", parent.opener.document).html('');
    $("#divInfoCliente", parent.opener.document).html(datos['html']);
    $("#idServicio", parent.opener.document).html(datos['servicios']);
    self.close();
}

function validarSolicitud() {
    if (confirm("¿ Desea REGISTRAR esta Solicitud de Retiro ?")) {
        $("#frmRetiro").attr('action', 'insertar');
        return true;
    } else {
        $("#frmRetiro").removeAttr('action');
        return false;
    }
}

function validarRetiro() {
    if (confirm("¿ Desea CONFIRMAR este Retiro ?")) {
        var idRetiro = $("#idRetiro").val();
        var idServicio = $("#idServicio").val();
        var idContrato = $("#idContrato").val();
        $.get('confirmarSolicitud', {idRetiro: idRetiro, idServicio: idServicio, idContrato: idContrato}, recargarPadre, 'json');
    }
}

function recargarPadre(datos) {
    var tipoCliente = $("#tipoCliente").val();
    parent.opener.location.href = "administracion?tipo=" + tipoCliente + "&msg=" + datos['html'];
    self.close();
}
