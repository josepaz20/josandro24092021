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

function verRegistrarGestionCartera() {
    $("#infoClienteServicio").html('');
    $("#infoClienteServicio").hide();
    $("#obs").val('');
    $("#obscliente").val('');
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
        $("#idServicio").removeAttr('required');
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
    if ($("#obs").val() === '') {
        alert("ES NECESARIO INGRESAR EL CAMPO OBSERVACION.");
        $("#obs").focus();
        return false;
    }
    return confirm("¿ DESEA REALIZAR EL REGISTRO ?");
}

function verModificar(idGestionCartera) {
    $.get('modificar', {idGestionCartera: idGestionCartera}, setFormulario, 'json');
    activarBloqueoAjax();
}
function verDetalle(idGestionCartera) {
    $.get('detalle', {idGestionCartera: idGestionCartera}, setFormulario, 'json');
    activarBloqueoAjax();
}

function eliminar(idGestionCartera) {
    if(confirm("¿ DESEA ELIMINAR ESTE REGISTRO ?")){
        $.get('delete', {idGestionCartera: idGestionCartera}, setEliminar, 'json');
        activarBloqueoAjax();
    } else {
        return false;
    }
}
function setEliminar(datos){
    location.href = "/sw2click/modulos/gestioncartera/administracion?msg=" + datos;
}
function setFormulario(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divFormAction").html(datos['html']);
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