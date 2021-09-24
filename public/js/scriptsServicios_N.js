//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

function ocultarAux() {
    var href = location.href;
    if (href.indexOf('#') !== -1) {
        var partes = href.split('#');
        if ($("#padre").val() === '') {
            location.href = partes[0] + '#close';
        } else {
            location.href = partes[0] + '#' + $("#padre").val();
        }
    } else {
        if ($("#padre").val() === '') {
            location.href = '#close';
        } else {
            location.href = '#' + $("#padre").val();
        }
    }
    $("#padre").val('');
}

function verAux(evento) {
    evento.stopPropagation();
}
//------------------------------------------------------------------------------
function activarBloqueoAjax() {
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

//------------------------------------------------------------------------------

function verSeleccionarCliente(tipo) {
    $.get('tablaclientes', {tipo: tipo}, setTablaClientes, 'json');
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
        $('div.dataTables_filter input').focus();
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
        $("#divInfoCliente").html(datos['infoCliente']);
        $("#divTablaServicios").html(datos['tablaServicios']);
        $('#tblServicios').dataTable({
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
        $("#divInfoCliente").show('slow');
        $("#divTablaServicios").show('slow');
        $('div.dataTables_filter input').focus();
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function verActivacion(idServicio) {
    $.get('activacion', {idServicio: idServicio}, setFormulario, 'json');
    activarBloqueoAjax();
}
function verSincronizacion(idServicio) {
    $.get('sincronizacion', {idServicio: idServicio}, setFormulario, 'json');
    activarBloqueoAjax();
}
function verCambioIP(idServicio) {
    $.get('cambioIP', {idServicio: idServicio}, setFormulario, 'json');
    activarBloqueoAjax();
}
function setFormulario(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#contenidoForm").html(datos['html']);
        var href = location.href;
        if (href.indexOf('#') !== -1) {
            var partes = href.split('#');
            location.href = partes[0] + '#modalFormulario';
        } else {
            location.href = '#modalFormulario';
        }
        $("#ipRadio").focus();
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function verificarIP() {
    var ip = $.trim($("#ipRadio").val());
    if (ip !== '') {
        if (ip.match(/((^|\.)((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]?\d))){4}$/)) {
            var partesIP = ip.split('.');
            if (partesIP.length === 4) {
                if (parseInt(partesIP[3]) > 2 && parseInt(partesIP[3]) !== 255) {
                    $.get('verificarIP', {dirIP: ip}, setVerificarIP, 'json');
                    activarBloqueoAjax();
                } else {
                    alert(" LA DIRECCION IP DIGITADA: " + ip + " \n NO PUEDE SER UTILIZADA EN UN RADIO. ");
                    $("#ipRadio").focus();
                }
            } else {
                alert(" LA DIRECCION IP DIGITADA: " + ip + " \n NO ES UNA DIRECCION IP BIEN FORMADA. ");
                $("#ipRadio").focus();
            }
        } else {
            alert(" LA DIRECCION IP DIGITADA: " + ip + " \n NO ES UNA DIRECCION IP BIEN FORMADA. ");
            $("#ipRadio").focus();
        }
    } else {
        alert("DEBE DIGITAR UNA DIRRECION IP");
        $("#ipRadio").focus();
    }
}
function setVerificarIP(datos) {
    if (parseInt(datos['error']) === 0) {
        if (parseInt(datos['existeIP']) === 0) {
            $("#iconBAD").hide();
            $("#iconOK").show('slow');
        } else {
            $("#iconOK").hide();
            $("#iconBAD").show('slow');
        }
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function buscarIP() {
    var ip = $.trim($("#ipRadio").val());
    if (ip !== '') {
        var partesIP = ip.split('.');
        if (partesIP.length === 3) {
            var i = 0;
            for (i = 0; i < 3; i++) {
                if (isNaN(partesIP[i])) {
                    i = 999;
                } else {
                    if (parseInt(partesIP[i]) < 0 && parseInt(partesIP[i]) > 255) {
                        i = 999;
                    }
                }
            }
            if (i !== 999) {
                $.get('buscarIP', {dirIP: ip}, setTablaIPs, 'json');
                activarBloqueoAjax();
            } else {
                alert(" LA DIRECCION IP DIGITADA: " + ip + " \n NO PERTENECE A UN RANGO. ");
                $("#ipRadio").focus();
            }
        } else {
            alert(" LA DIRECCION IP DIGITADA: " + ip + " \n NO PERTENECE A UN RANGO. ");
            $("#ipRadio").focus();
        }
    } else {
        alert("DEBE DIGITAR UNA DIRRECION IP");
        $("#ipRadio").focus();
    }
}
function setTablaIPs(datos) {
    if (parseInt(datos['error']) === 0) {
        var href = location.href;
        if (href.indexOf('#') !== -1) {
            var partes = href.split('#');
            location.href = partes[0] + '#modalIPs';
        } else {
            location.href = '#modalIPs';
        }
        $("#infoIPs").html(datos['html']);
        $('#tblIPs').dataTable({
            "iDisplayLength": 50,
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
        $('div.dataTables_filter input').focus();
        $("#padre").val('modalFormulario');
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}
function seleccionarIP(ip) {
    $("#ipRadio").val(ip);
    var href = location.href;
    if (href.indexOf('#') !== -1) {
        var partes = href.split('#');
        location.href = partes[0] + '#modalFormulario';
    } else {
        location.href = '#modalFormulario';
    }
}

function validarActivacion() {
    return confirm(" ¿ DESEA ACTIVAR ESTE SERVICIO ? ");
}

function validarSincronizacion() {
    return confirm(" ¿ DESEA SINCRONIZAR ESTE SERVICIO ? ");
}

function validarCambioIP() {
    return confirm(" ¿ DESEA CAMBIAR LA DIRECCION IP DE ESTE SERVICIO ? ");
}
