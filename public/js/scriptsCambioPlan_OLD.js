//------------------------------------------------------------------------------
function bloqueoAjax() {
    $.blockUI(
            {
                message: $('#msgBloqueo'),
                css: {
                    border: 'none',
                    padding: '15px',
                    backgroundColor: '#000',
                    '-webkit-border-radius': '10px',
                    '-moz-border-radius': '10px',
                    opacity: .85,
                    color: '#fff',
                    'z-index': 10000000
                }
            }
    );
    $('.blockOverlay').attr('style', $('.blockOverlay').attr('style') + 'z-index: 1100 !important');
}

//------------------------------------------------------------------------------

function verRegistrar() {
    $.get('nuevo', {}, setFormulario, 'json');
    bloqueoAjax();
}
function verSolicitud(idCambioPlan) {
    $.get('verSolicitud', {idCambioPlan: idCambioPlan}, setFormulario, 'json');
    bloqueoAjax();
}
function verEditar(idSucursal) {
    $.get('edit', {idSucursal: idSucursal}, setFormulario);
    bloqueoAjax();
}
function verEliminar(idServicio) {
    $.get('delete', {idServicio: idServicio}, setFormulario);
    bloqueoAjax();
}

function setFormulario(datos) {
//    console.log(datos)
    $("#divContenido").html(datos['html']);
    $('#modalFormulario').modal('show');
}
//------------------------------------------------------------------------------

function getSueldo(id) {
    $.get('procesar', {idEmpleado: id}, setSueldo);
}

function setSueldo(datos) {
    document.getElementById('sueldo').value = datos;
}

function validarCambio() {
    if ($("#idPlan").val() === '') {
        alert("POR FAVOR SELECCIONE EL NUEVO PLAN");
        $("#idPlan").focus();
        return false;
    }
    return confirm("¿ DESEA REGISTRAR ESTE CAMBIO DE PLAN ?");
}

function getConceptoFactura() {
    if ($("#nombrePlan").length !== 0) {
        if ($.trim($("#concepto").val()).length === 0) {
            $("#concepto").val($("#nombrePlan").val());
        }
    }
}

function validarCambioPlan() {
//    var idCambioPlan = $("#idCambioPlan").val();
    if (confirm("¿ DESEA CONFIRMAR ESTE CAMBIO DE PLAN ?")) {
//        $.get('', {idCambioPlan: idCambioPlan}, setActualizado, 'json');
        bloqueoAjax();
        return true;
    } else {
        return false;
    }
}

//function setActualizado(datos) {
//    var tipoCliente = $("#tipoCliente").val();
//    parent.opener.location.href = "administracion?tipo=" + tipoCliente + "&msg=" + datos['error'];
//    self.close();
//}

//------------------------------------------------------------------------------

function seleccionarCorporativo() {
    $.get('seleccionarCorporativo', {}, setSeleccionarCliente, 'json');
    bloqueoAjax();
}
function seleccionarResidencial() {
    $.get('seleccionarResidencial', {}, setSeleccionarCliente, 'json');
    bloqueoAjax();
}
function setSeleccionarCliente(datos) {
    $("#divAnexar").html(datos['infoTabla']);//pone los datos
    $("#tblSeleccionar").DataTable({
        responsive: true,
        "iDisplayLength": 25,
        "sPaginationType": "full_numbers",
        "oLanguage": {
            "sLengthMenu": "Mostrar: _MENU_ registros por pagina",
            "sZeroRecords": "NO SE HA ENCONTRADO INFORMACION",
            "sInfo": "Mostrando <b>_START_</b> a <b>_END_</b> registros <br>TOTAL REGISTROS: <b>_TOTAL_</b> Registros</b>",
            "sInfoEmpty": "Mostrando 0 A 0 registros",
            "sInfoFiltered": "(Filtrados de un total de <b>_MAX_</b> registros)",
            "sLoadingRecords": "CARGANDO...",
            "sProcessing": "EN PROCESO...",
            "sSearch": "Buscar:",
            "sEmptyTable": "NO HAY INFORMACION DISPONIBLE PARA LA TABLA",
            "oPaginate": {
                "sFirst": "<i class='fa fa-fast-backward' aria-hidden='true' title='Inicio'></i>",
                "sPrevious": "<i class='fa fa-step-backward' aria-hidden='true' title='Anterior'></i>",
                "sNext": "<i class='fa fa-step-forward' aria-hidden='true' title='Siguiente'></i>",
                "sLast": "<i class='fa fa-fast-forward' aria-hidden='true' title='Fin'></i>",
            }
        },
        "aaSorting": [[0, "desc"]]
    });
    $('#modalAnexar').modal('show');
}
function seleccionarCliente(id, tipo) {
    if (tipo === 1) {
        $.get('getClienteCorp', {idCorporativo: id}, setCliente, 'json');
    } else {
        $.get('getClienteRes', {idResidencial: id}, setCliente, 'json');
    }
    bloqueoAjax();
}
function setCliente(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divInfoServicio").html('');
        $("#divInfoPlan").html('');
        $("#idPlan").val('');
        $("#concepto").val('');
        $("#divInfoCliente").html(datos['html']);
        $("#idServicio").html(datos['servicios']);
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
    $("#modalAnexar").modal('hide');
}

function getInfoServicio(idServicio) {
    if (idServicio !== '') {
        $.get('getInfoServicio', {idServicio: idServicio}, setInfoServicio, 'json');
        bloqueoAjax();
    } else {
        $("#divInfoServicio").html('');
    }
}

function setInfoServicio(datos) {
    $("#divInfoServicio").html(datos['html']);
}

function getPlanes() {
    if ($("#tipoCliente").length === 0) {
        alert('POR FAVOR SELECCIONE UN CLIENTE');
        return false;
    }
    if ($("#idServicio").val() === '') {
        alert('POR FAVOR SELECCIONE UN SERVICIO');
        $("#idServicio").focus();
        return false;
    }
    var tipo = $("#tipoCliente").val();
    var idMcpo = $("#idMcpoServicio").val();
    $.get('seleccionarPlan', {tipo: tipo, idMcpo: idMcpo}, setSeleccionarPlan, 'json');
    bloqueoAjax();
}
function setSeleccionarPlan(datos) {
    $("#divAnexar").html(datos['infoTabla']);//pone los datos
    $("#tblSeleccionar").DataTable({
        responsive: true,
        "iDisplayLength": 25,
        "sPaginationType": "full_numbers",
        "oLanguage": {
            "sLengthMenu": "Mostrar: _MENU_ registros por pagina",
            "sZeroRecords": "NO SE HA ENCONTRADO INFORMACION",
            "sInfo": "Mostrando <b>_START_</b> a <b>_END_</b> registros <br>TOTAL REGISTROS: <b>_TOTAL_</b> Registros</b>",
            "sInfoEmpty": "Mostrando 0 A 0 registros",
            "sInfoFiltered": "(Filtrados de un total de <b>_MAX_</b> registros)",
            "sLoadingRecords": "CARGANDO...",
            "sProcessing": "EN PROCESO...",
            "sSearch": "Buscar:",
            "sEmptyTable": "NO HAY INFORMACION DISPONIBLE PARA LA TABLA",
            "oPaginate": {
                "sFirst": "<i class='fa fa-fast-backward' aria-hidden='true' title='Inicio'></i>",
                "sPrevious": "<i class='fa fa-step-backward' aria-hidden='true' title='Anterior'></i>",
                "sNext": "<i class='fa fa-step-forward' aria-hidden='true' title='Siguiente'></i>",
                "sLast": "<i class='fa fa-fast-forward' aria-hidden='true' title='Fin'></i>",
            }
        },
        "aaSorting": [[0, "desc"]]
    });
    $('#modalAnexar').modal('show');
}
function seleccionarPlan(idPlan) {
    $.get('getInfoPlan', {idPlan: idPlan}, setInfoPlan, 'json');
    bloqueoAjax();
}
function setInfoPlan(datos) {
    $("#concepto").val('');
    if (parseInt(datos['error']) === 0) {
        $("#divInfoPlan").html(datos['html']);
        $("#idPlan").val(datos['idPlan']);
        $("#concepto").focus();
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
    $("#modalAnexar").modal('hide');
}
