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
    $.blockUI(
            {
                message: $('#msgBloqueo'),
                css: {
                    border: 'none',
                    padding: '15px',
                    backgroundColor: '#000', '-webkit-border-radius': '10px', '-moz-border-radius': '10px',
                    opacity: .85,
                    color: '#fff'
                }
            }
    );
    $('.blockOverlay').attr('style', $('.blockOverlay').attr('style') + 'z-index: 1100 !important');
}
//------------------------------------------------------------------------------

function verRegistrarDescuento() {
    $.get('registro', {}, setFormulario, 'json');
    activarBloqueoAjax();
}
function verEliminar(idDescuento) {
    $.get('eliminar', {idDescuento: idDescuento}, setFormulario, 'json');
    activarBloqueoAjax();
}
function verConfirmar(idDescuento) {
    $.get('confirmar', {idDescuento: idDescuento}, setFormulario, 'json');
    activarBloqueoAjax();
}
function verDetalle(idDescuento) {
    $.get('detalle', {idDescuento: idDescuento}, setFormulario, 'json');
    activarBloqueoAjax();
}

//------------------------------------------------------------------------------

function setFormulario(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divContenido").html(datos['html']);
        $("#modalFormulario").modal('show');
    } else {
        alert("SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

//------------------------------------------------------------------------------

function verSeleccionarCliente(tipo) {
    $.get('getTablaClientes', {tipo: tipo}, setTablaClientes, 'json');
    activarBloqueoAjax();
}
function setTablaClientes(datos) {
    if (parseInt(datos['error']) === 0) {
        var href = location.href;
        if (href.indexOf('#') !== -1) {
            var partes = href.split('#');
            location.href = partes[0] + '#modalClientes';
        } else {
            location.href = '#modalClientes';
        }
        $("#infoTabla").html(datos['html']);
        $('#tblClientes').dataTable({
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
            "aaSorting": [[0, "desc"]]
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
        var partesHref = document.location.href.split('#');
        if (partesHref.length > 1) {
            document.location.href = partesHref[0] + '#modalRegistrar';
        } else {
            document.location.href += '#modalRegistrar';
        }
        $("#infoClienteServicio").html(datos['html']);
        $("#infoClienteServicio").show('slow');
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
    calcularVlrDescuento();
}

function getServicio(idServicio) {
    if (idServicio !== '') {
        $.get('getServicio', {idServicio: idServicio}, setServicio, 'json');
        activarBloqueoAjax();
    } else {
        $("#divInfoServicio").html('');
        $("#divInfoServicio").hide('slow');
        calcularVlrDescuento();
    }
}
function setServicio(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divInfoServicio").html(datos['html']);
        $("#divInfoServicio").show('slow');
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
    calcularVlrDescuento();
}

function calcularVlrDescuento() {
    var vlrDescuento = 0;
    if ($("#cfm").length !== 0) {
        vlrDescuento = Math.round((parseFloat($("#cfm").val().replace(/\,/g, '')) / 30) * $("#diasDescuento").val());
    }
    $("#vlrDescuento").val(vlrDescuento);
    if ($("#vlrDescConfirm").length !== 0) {
        $("#vlrDescConfirm").val(vlrDescuento);
    }
}

function calcularVlrDescuentoConfirm() {
    $("#vlrDescConfirm").val(Math.round((parseFloat($("#cfm").val().replace(/\,/g, '')) / 30) * $("#diasDescConfirm").val()));
}

function validarRegistro() {
    if ($("#idServicio").val().length === 0) {
        alert("   POR FAVOR SELECCIONE UN SERVICIO");
        $("#idServicio").focus();
        return false;
    }
    if (parseFloat($("#vlrDescuento").val()) === 0) {
        alert("   EL VALOR A DESCONTAR NO PUEDE SER CERO");
        $("#vlrDescuento").focus();
        return false;
    }
    if (confirm("   DESEA REGISTRAR ESTA SOLICITUD DE DESCUENTO ?")) {
        activarBloqueoAjax();
        return true;
    } else {
        return false;
    }
}

function setObsConfirm(estado) {
    if (estado === 'Rechazado') {
        $("#obsconfirm").attr('required', true);
        $("#btnConfimarRechazar").val('Rechazar');
        $("#formConfirmar").attr('onsubmit', 'return confirm("¿ DESEA RECHAZAR ESTA SOLICITUD DE DESCUENTO ?")');
    } else {
        $("#obsconfirm").removeAttr('required');
        $("#btnConfimarRechazar").val('Confirmar');
        $("#formConfirmar").attr('onsubmit', 'return confirm("¿ DESEA CONFIRMAR ESTA SOLICITUD DE DESCUENTO ?")');
    }
}

//------------------------------------------------------------------------------

function validarBusqueda() {
    var tipoclienteBusq = $.trim($("#tipoclienteBusq").val());
    var identificacion = $.trim($("#identificacionBusq").val());
    var fechainiBusq = $.trim($("#fechainiBusq").val());
    var fechafinBusq = $.trim($("#fechafinBusq").val());
    if (tipoclienteBusq.length === 0) {
        alert("  POR FAVOR SELECCIONE EL TIPO DE CLIENTE");
        $("#tipoclienteBusq").focus();
        return false;
    }
    if (identificacion.length === 0 && fechainiBusq.length === 0 && fechafinBusq.length === 0) {
        alert("  POR FAVOR INDIQUE LA IDENTIFICACION o LAS FECHAS DE INICIO Y FIN");
        $("#identificacionBusq").focus();
        return false;
    }
    if ((fechainiBusq.length !== 0 && fechafinBusq.length === 0) || (fechainiBusq.length === 0 && fechafinBusq.length !== 0)) {
        alert("  POR FAVOR INDIQUE LAS FECHAS DE INICIO Y FIN");
        return false;
    }
    return true;
}

//------------------------------------------------------------------------------

function setLimpiar() {
    $("#frmFiltroBusq input").each(function () {
        $(this).val('');
    });
    $("#frmFiltroBusq select").each(function () {
        $(this).val('');
    });
}

//------------------------------------------------------------------------------

function setTipoCliente() {
    $("#divBusqResidencial").hide();
    $("#divBusqCorporativo").hide();
    if ($("#tipoClienteBusq").val() !== '') {
        if (parseInt($("#tipoClienteBusq").val()) === 1) {
            $("#divBusqResidencial").show('slow');
        } else {
            $("#divBusqCorporativo").show('slow');
        }
    }
}

//------------------------------------------------------------------------------

function buscarCliente() {
    if ($("#tipoClienteBusq").val() === '') {
        alert("   POR FAVOR SELECCIONE EL TIPO DE CLIENTE");
        $("#tipoClienteBusq").focus();
        return;
    }
    if (parseInt($("#tipoClienteBusq").val()) === 1) {
        if ($.trim($("#identificacionResBusq").val()).length > 0) {
            $("#divInfoClienteServicios").html('');
            $.get('getinfoclienteservicios', {tipoBusq: 'identificacionRes', identificacion: $.trim($("#identificacionResBusq").val())}, setInfoClienteServicios, 'json');
            activarBloqueoAjax();
            return;
        } else {
            if ($("#clienteResBusq").val().indexOf('--') !== -1) {
                var idCliente = $.trim($("#clienteResBusq").val().substring(0, $("#clienteResBusq").val().indexOf('--')));
                $("#divInfoClienteServicios").html('');
                $.get('getinfoclienteservicios', {tipoBusq: 'idClienteRes', idCliente: idCliente}, setInfoClienteServicios, 'json');
                activarBloqueoAjax();
                return;
            } else {
                alert("POR FAVOR SELECCIONE UN CLIENTE DEL AUTOCOMPLETAR.");
                $("#clienteResBusq").focus();
                return;
            }
        }
    } else {
        if ($.trim($("#identificacionCorpBusq").val()).length > 0) {
            $("#divInfoClienteServicios").html('');
            $.get('getinfoclienteservicios', {tipoBusq: 'identificacionCorp', identificacion: $.trim($("#identificacionCorpBusq").val())}, setInfoClienteServicios, 'json');
            activarBloqueoAjax();
            return;
        } else {
            if ($("#clienteCorpBusq").val().indexOf('--') !== -1) {
                var idCliente = $.trim($("#clienteCorpBusq").val().substring(0, $("#clienteCorpBusq").val().indexOf('--')));
                $("#divInfoClienteServicios").html('');
                $.get('getinfoclienteservicios', {tipoBusq: 'idClienteCorp', idCliente: idCliente}, setInfoClienteServicios, 'json');
                activarBloqueoAjax();
                return;
            } else {
                alert("POR FAVOR SELECCIONE UN CLIENTE DEL AUTOCOMPLETAR.");
                $("#clienteCorpBusq").focus();
                return;
            }
        }
    }
}

function setInfoClienteServicios(datos) {
    $("#idServicio").val('');
    $("#servicio").val('');
    $("#estado").val('');
    $("#dirInstalacion").val('');
    $("#ubicacion").val('');
    $("#cfm").val('');
    $("#divInfoClienteServicios").html('');
    if (parseInt(datos['error']) === 0) {
        $("#divInfoClienteServicios").html(datos['html']);
    } else {
        alert("   SE HA PRESENTADO UN INCONVENIENTE, POR FAVOR CONTACTE CON EL ADMINISTRADOR DEL SISTEMA.");
    }
}

//------------------------------------------------------------------------------

function seleccionarServicio(idServicio, padre) {
    var fila = $(padre).closest('tr');
    $("#idServicio").val(idServicio);
    $("#servicio").val(fila.find("td").eq(3).html());
    $("#estado").val(fila.find("td").eq(5).html());
    $("#dirInstalacion").val(fila.find("td").eq(6).html());
    $("#ubicacion").val(fila.find("td").eq(2).html());
    $("#cfm").val(fila.find("td").eq(4).html());
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
