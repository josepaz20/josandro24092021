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

function verRegistrarTraslado() {
    $("#infoClienteServicio").html('');
    $("#infoClienteServicio").hide();
    $("#idDpto").val('');
    $("#idMcpoTraslado").html("<option value=''>Seleccione...</option>");
    $("#dirtraslado").val('');
    $("#costo").val('30000');
    $("#observacion").val('');
    $("#respaldo").val('');
    var partesHref = document.location.href.split('#');
    if (partesHref.length > 1) {
        document.location.href = partesHref[0] + '#modalRegistrar';
    } else {
        document.location.href += '#modalRegistrar';
    }
    return false;
}

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
    }
    if ($("#respaldo").val() === '' && $("#observacion").val() === '') {
        alert("ES NECESARIO INGRESAR LA OBSERVACION DEL CLIENTE O CARGAR LA EVIDENCIA CORRESPONDIENTE.");
        $("#observacion").focus();
        return false;
    }
    return confirm("¿ DESEA REGISTRAR ESTA SOLICITUD DE TRASLADO ?");
}

function verEliminar(idTraslado) {
    $.get('eliminar', {idTraslado: idTraslado}, setFormulario, 'json');
    activarBloqueoAjax();
}
function verConfirmar(idTraslado) {
    $.get('confirmar', {idTraslado: idTraslado}, setFormulario, 'json');
    activarBloqueoAjax();
}
function verDetalle(idTraslado) {
    $.get('detalle', {idTraslado: idTraslado}, setFormulario, 'json');
    activarBloqueoAjax();
}
function setFormulario(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divFormAction").html(datos['html']);
        if ($("#vlrDescConfirm").length > 0) {
            $("#vlrDescConfirm").val($("#vlrDescConfirm").val().replace(/\,/g, ''));
        }
        var partesHref = document.location.href.split('#');
        if (partesHref.length > 1) {
            document.location.href = partesHref[0] + '#modalDetalle';
        } else {
            document.location.href += '#modalDetalle';
        }
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function setObsConfirm(estado) {
    if (estado === 'No Viable') {
        $("#obsconfirm").attr('required', true);
        $("#btnConfimarRechazar").val('No Viable');
        $("#formConfirmar").attr('onsubmit', 'return confirm("¿ DESEA INDICAR QUE ESTA SOLICITUD DE TRASLADO FUE:  <<NO VIABLE>> ?")');
    } else {
        $("#obsconfirm").removeAttr('required');
        $("#btnConfimarRechazar").val('Exitosa');
        $("#formConfirmar").attr('onsubmit', 'return confirm("¿ DESEA INDICAR QUE ESTA SOLICITUD DE TRASLADO FUE:  <<EXITOSA>> ?")');
    }
}

function getMunicipios(idDpto) {
    if (idDpto !== '') {
        $.get("getMcpos", {idDpto: idDpto}, mostrarMcpos);
        activarBloqueoAjax();
    } else {
        $('#idMcpoTraslado').html("<option value=''>Seleccione...</option>");
    }
}

function mostrarMcpos(mcpos) {
    $("#idMcpoTraslado").html(mcpos);
}

