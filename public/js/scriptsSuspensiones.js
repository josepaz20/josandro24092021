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

function verRegistrar() {
    $.get('registrar', {}, setFormulario, 'json');
    activarBloqueoAjax();
}

function verModificar(idSuspension) {
    $.get('modificar', {idSuspension: idSuspension}, setFormulario, 'json');
    activarBloqueoAjax();
}

function verDetalle(idSuspension) {
    $.get('detalle', {idSuspension: idSuspension}, setFormulario, 'json');
    activarBloqueoAjax();
}

function eliminar(idSuspension) {
    if (confirm("¿ DESEA ELIMINAR ESTA SUSPENSION ?")) {
        $.get('delete', {idSuspension: idSuspension}, setEliminar, 'json');
        activarBloqueoAjax();
    } else {
        return false;
    }
}
function setEliminar(datos) {
    location.href = "/sw2click/modulos/suspensiones/administracion?msg=" + datos;
}

function confirmar(idSuspension) {
    $.get('confirm', {idSuspension: idSuspension}, setFormulario, 'json');
    activarBloqueoAjax();
}

function terminar(idSuspension) {
    $.get('terminar', {idSuspension: idSuspension}, setFormulario, 'json');
    activarBloqueoAjax();
}

function verSeleccionarCliente(tipo) {
    $.get('getTablaClientes', {tipo: tipo}, setTablaClientes, 'json');
    activarBloqueoAjax();
}
function setTablaClientes(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divAnexar").html(datos['html']);
        $("#modalAnexar").modal('show');
        $(document).ready(function () {
            oTable1 = $('#tblClientes').dataTable({
//                "scrollX": true,
                "iDisplayLength": 25,
                "sPaginationType": "full_numbers",
                "oLanguage": {
                    "sLengthMenu": "MOSTRAR: _MENU_ REGISTROS POR PAGINA",
                    "sZeroRecords": "NO SE HA ENCONTRADO INFORMACION",
                    "sInfo": "MOSTRANDO <b>_START_</b> A <b>_END_</b> REGISTROS <br>TOTAL REGISTROS: <b>_TOTAL_</b> REGISTROS</b>",
                    "sInfoEmpty": "MOSTRANDO 0 A 0 REGISTROS",
                    "sInfoFiltered": "(FILTRADOS DE UN TOTAL DE <b>_MAX_</b> REGISTROS)",
                    "sSearch": "BUSCAR: ",
                    "sEmptyTable": "NO HAY INFORMACION DISPONIBLE PARA LA TABLA",
                    "oPaginate": {
                        "sFirst": "Inicio",
                        "sLast": "Fin",
                        "sNext": "Siguiente",
                        "sPrevious": "Anterior"
                    }
                },
                "aaSorting": [[0, "desc"]]
            });
            $('#tblClientes tbody').on('click', 'tr', function () {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                } else {
                    oTable1.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                }
            });
        });
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function seleccionarCliente(idCliente, tipo) {
    $.get('getCliente', {idCliente: idCliente, tipo: tipo}, setCliente, 'json');
    activarBloqueoAjax();
}
function setCliente(datos) {
    ocultarAux();
    if (parseInt(datos['error']) === 0) {
        $("#modalAnexar").modal('hide');
        $("#infoClienteServicio").html(datos['html']);
        $("#infoClienteServicio").show('slow');
        $("#idServicio").focus();
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function getServicio(idServicio) {
    if (idServicio !== '') {
        $.get('getServicio', {idServicio: idServicio}, setServicio, 'json');
        activarBloqueoAjax();
    } else {
        $("#divInfoServicio").html('');
        $("#divInfoServicio").hide('slow');
    }
}
function setServicio(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divInfoServicio").html(datos['html']);
        $("#divInfoServicio").show('slow');
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function validarRegistro() {
    if ($("#idCliente").length === 0) {
        alert("POR FAVOR, SELECCIONE UN CLIENTE.");
        $("#seleccionarResidencial").focus();
        return false;
    } else {
        return confirm("¿ DESEA REGISTRAR ESTA SUSPENSION ?");
    }
}

function fechafinmin(fechaini) {
    $("#fechafin").val('');
    $("#fechafin").attr('min', fechaini);
}

function setFormulario(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divContenido").html(datos['html']);
        $("#modalFormulario").modal('show');
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}