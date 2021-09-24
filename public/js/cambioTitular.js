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
                    'z-index': 2000
                }
            }
    );
    $('.blockOverlay').attr('style', $('.blockOverlay').attr('style') + 'z-index: 1100 !important');
}

//------------------------------------------------------------------------------

function verRegistrar() {
    $.get('registrar', {}, setFormulario);
    bloqueoAjax();
}
function verRegistrarMaterialBodega(idBodegaEmpleado) {
    $.get('registroMaterial', {idBodegaEmpleado: idBodegaEmpleado}, setFormulario);
    bloqueoAjax();
}
function verDetalle(idCambioTitular) {
    $.get('detalle', {idCambioTitular: idCambioTitular}, setFormulario);
    bloqueoAjax();
}
function verEliminar(idCambioTitular) {
    $.get('eliminar', {idCambioTitular: idCambioTitular}, setFormulario);
    bloqueoAjax();
}
function verAprobar(idCambioTitular) {
    $.get('aprobar', {idCambioTitular: idCambioTitular}, setFormulario);
    bloqueoAjax();
}
function setFormulario(respuesta) {
    $("#divContenido").html(respuesta);
    $('#modalFormulario').modal('show');
}

//---------------------------------------------------------------------------
//---------------------------------------------------------------------------

function setBuscarPor(idBuscarPor) {
    if (idBuscarPor !== '') {
        switch (parseInt($('#buscarPor').val())) {
            case 1:
                break;
            case 0:
                break;
            default :
                $("#buscarPor").val('');
                break;
        }
        $('#buscarPor').removeAttr('disabled');
    } else {
        $("#buscarPor").val('');
    }
}

function getCliente() {
    if ($("#tipoClienteBusq").val() === '') {
        alert("   POR FAVOR SELECCIONE EL TIPO DE CLIENTE ");
        $("#tipoClienteBusq").focus();
        return false;
    }
    if ($("#buscarPor").val() === '') {
        alert("   POR FAVOR SELECCIONE EL BUSCAR POR ");
        $("#buscarPor").focus();
        return false;
    }
    if ($.trim($("#busqueda").val()) === '') {
        alert("   POR FAVOR INGRESE LA BUSQUEDA ");
        $("#busqueda").focus();
        return false;
    }
    $.get('getCliente', {tipoClienteBusq: 1, buscarPor: $("#buscarPor").val(), busqueda: $.trim($("#busqueda").val())}, setCliente);
    bloqueoAjax();
}

function setCliente(datos) {
    $("#idServicio").val('');
    $("#divSeleccionarCliente").html(datos);
    $(document).ajaxStop($.unblockUI);
    $(document).ready(function () {
        oTable = $('#tablaClientes').dataTable({
            "scrollX": true,
            "iDisplayLength": 25,
            "sPaginationType": "full_numbers",
            "oLanguage": {
                "sLengthMenu": "MOSTRAR: _MENU_ REGISTROS POR PAGINA",
                "sZeroRecords": "NO SE HA ENCONTRADO INFORMACION",
                "sInfo": "MOSTRANDO <b>_START_</b> A <b>_END_</b> REGISTROS <br>TOTAL REGISTROS: <b>_TOTAL_</b> REGISTROS</b>",
                "sInfoEmpty": "MOSTRANDO 0 A 0 REGISTROS",
                "sInfoFiltered": "(FILTRADOS DE UN TOTAL DE <b>_MAX_</b> REGISTROS)",
                "sSearch": "BUSCAR:",
                "sEmptyTable": "NO HAY INFORMACION DISPONIBLE PARA LA TABLA",
                "oPaginate": {
                    "sFirst": "<i class='fa fa-fast-backward' aria-hidden='true' title='Inicio'></i>",
                    "sPrevious": "<i class='fa fa-step-backward' aria-hidden='true' title='Anterior'></i>",
                    "sNext": "<i class='fa fa-step-forward' aria-hidden='true' title='Siguiente'></i>",
                    "sLast": "<i class='fa fa-fast-forward' aria-hidden='true' title='Fin'></i>",
                }
            },
            "aaSorting": [[0, "desc"]],
        });
    });
    $('#modalSeleccionarCliente').modal('show');
}

function seleccionarCliente(idCliente) {
    $.get('seleccionarCliente', {idCliente: idCliente}, setSeleccionarCliente);
    bloqueoAjax();
}
function setSeleccionarCliente(datos) {
    $('#modalSeleccionarCliente').modal('hide');
    $("#divInfoCliente").html(datos);
}

function getInfoServicio() {
    $("#idServicio").val('');
    $("#divInfoServicio").html('');
    var idServicio = $("#idServicioBusq").val();
    $.get('getInfoServicio', {idServicio: idServicio}, setInfoServicio, 'json');
    bloqueoAjax();
}
function setInfoServicio(datos) {
    $("#divInfoServicio").html(datos['html']);
    $("#idServicio").val(datos['idServicio']);
}

//---------------------------------------------------------------------------

function validarAprobado() {
    if (confirm("  DESEA VALIDAR ESTE CAMBIO DE TITULAR ? ")) {
        bloqueoAjax();
        return true;
    } else {
        return false;
    }
}
function validarEliminado() {
    if (confirm("  DESEA ELIMINAR ESTE CAMBIO DE TITULAR ? ")) {
        bloqueoAjax();
        return true;
    } else {
        return false;
    }
}
function validarRegistrar() {
    if ($.trim($("#idServicio").val()) === '') {
        alert("  POR FAVOR SELECCIONE UN SERVICIO");
        $("#idServicio").focus();
        return false;
    }
    if (confirm("  DESEA REGISTRAR ESTE CAMBIO DE TITULAR ? ")) {
        bloqueoAjax();
        return true;
    } else {
        return false;
    }
}

//---------------------------------------------------------------------------

function existeIdentificacion() {
    var identificacion = $.trim($("#identificacion").val());
    if (identificacion !== '') {
        $.get('existeIdentificacion', {identificacion: identificacion}, setExisteIdentificacion, 'json');
        bloqueoAjax();
    }
}

function setExisteIdentificacion(datos) {
    if (parseInt(datos['error']) === 0) {
        if (parseInt(datos['existe']) === 1) {
            alert("   LA IDENTIFICACION << " + datos['identificacion'] + " >> \n   YA SE ENCUENTRA REGISTRADA EN EL SISTEMA. \n   NO ES POSIBLE REALIZAR ESTE CAMBIO DE TITULAR.");
            $("#identificacion").val('');
        }
    } else {
        alert("   SE HA PRESENTADO UN INCONVENIENTE EN EL SISTEMA. \n   NO ES POSIBLE REALIZAR ESTE CAMBIO DE TITULAR.");
        $("#identificacion").val('');
    }
}

function getMunicipios(idDpto) {
    $("#idMcpo").html('<option value="">Seleccione...</option>');
    if (idDpto !== '') {
        $.get('getMunicipios', {idDpto: idDpto}, setMunicipios, 'json');
        bloqueoAjax();
    }
}
function setMunicipios(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#idMcpo").html(datos['listaMunicipios']);
    } else {
        alert("   SE HA PRESENTADO UN INCONVENIENTE EN EL SISTEMA. \n   NO ES POSIBLE REALIZAR ESTE CAMBIO DE TITULAR.");
    }
}




