
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

function verRegistrarMigracion() {
    $("#infoClienteServicio").html('');
    $("#infoClienteServicio").hide();
    $("#idDpto").val('');
    $("#idMcpoTraslado").html("<option value=''>Seleccione...</option>");
    $("#costo").val('');
    $("#observacion").val('');
    $("#respaldo").val('');

    $('#modalRegistrar').modal('show');
}

function verSeleccionarCliente(tipo) {
    $.get('getTablaClientes', {tipo: tipo}, setTablaClientes, 'json');
    activarBloqueoAjax();
}
function setTablaClientes(datos) {
    if (parseInt(datos['error']) === 0) {
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
        $("#modalClientes").modal('show');
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function seleccionarCliente(idCliente, tipo) {
    $.get('getCliente', {idCliente: idCliente, tipo: tipo}, setCliente, 'json');
    activarBloqueoAjax();
}
function setCliente(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#infoClienteServicio").html(datos['html']);
        $("#infoClienteServicio").show();
        $("#modalClientes").modal('hide');
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function getServicio(idServicio) {
    if (idServicio !== '') {
        $.get('getServicio', {idServicio: idServicio}, setServicio, 'json');
        activarBloqueoAjax();
    } else {
        $("#infoClienteServicio").html('');
        $("#infoClienteServicio").modal('hide');
    }
}
function setServicio(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divInfoServicio").html(datos['html']);
        $("#divInfoServicio").modal('show');
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
    return confirm("¿ DESEA REGISTRAR ESTA SOLICITUD DE MIGRACION ?");
}

function verEliminar(idMigracion) {
    $.get('eliminar', {idMigracion: idMigracion}, setFormulario, 'json');
    activarBloqueoAjax();
}
function verConfirmar(idMigracion) {
    $.get('confirmar', {idMigracion: idMigracion}, setFormulario, 'json');
    activarBloqueoAjax();
}
function verDetalle(idMigracion) {
    $.get('detalle', {idMigracion: idMigracion}, setFormulario, 'json');
    activarBloqueoAjax();
}
function setFormulario(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divFormAction").html(datos['html']);
        if ($("#vlrDescConfirm").length > 0) {
            $("#vlrDescConfirm").val($("#vlrDescConfirm").val().replace(/\,/g, ''));
        }
        $("#modalDetalle").modal('show');
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function setObsConfirm(estado) {
    if (estado === 'No Viable') {
        $("#obsconfirm").attr('required', true);
        $("#btnConfimarRechazar").val('No Viable');
        $("#formConfirmar").attr('onsubmit', 'return confirm("¿ DESEA INDICAR QUE ESTA SOLICITUD DE MIGRACION FUE:  <<NO VIABLE>> ?")');
    } else {
        $("#obsconfirm").removeAttr('required');
        $("#btnConfimarRechazar").val('Exitosa');
        $("#formConfirmar").attr('onsubmit', 'return confirm("¿ DESEA INDICAR QUE ESTA SOLICITUD DE MIGRACION FUE:  <<EXITOSA>> ?")');
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

//
//                                 IMPLEMENTACION FILTRO
//==============================================================================
function validarTipoCliente() {
    if ($('#tipo').val() !== '') {
        switch (parseInt($('#tipo').val())) {
            case 1:
                document.getElementById("urlBusq").options[1].innerHTML = "Nombre y Apellido";
                document.getElementById("urlBusq").options[1].value = "filtronombreapellido";
                document.getElementById("urlBusq").options[2].innerHTML = "Cedula";
                document.getElementById("urlBusq").options[2].value = "filtrocedula";
                break;
            case 0:
                document.getElementById("urlBusq").options[1].innerHTML = "Razon Social";
                document.getElementById("urlBusq").options[1].value = "filtrorazonsocial";
                document.getElementById("urlBusq").options[2].innerHTML = "Nit";
                document.getElementById("urlBusq").options[2].value = "filtronit";
                break;
            default :
                $('#urlBusq').val('');
                break;
        }
        $('#urlBusq').removeAttr('disabled');
    } else {
        $("#urlBusq").val('');
    }
    if ($("#urlBusq").val() === '') {
        $('#busqueda').val('');
        $('#busqueda').attr('readonly', true);
    } else {
        $('#busqueda').val('');
        $('#busqueda').removeAttr('readonly');
        $('#busqueda').focus();
    }
}
function getCliente(tipo) {
    if ($("#busqueda").val() === '') {
        alert("DEBES INGRESAR UN PARAMETRO DE BUSQUEDA");
        $("#busqueda").focus();
        return;
    }
    var string = $("#busqueda").val().trim();
    if ($("#urlBusq").val() === 'filtronombreapellido' && string.indexOf(" ") === -1) {
        alert("ERROR EN LA BUSQUEDA DEBES INGRESAR NOMBRE, ESPACIO Y APELLIDO. \n Ejemplo: \n Administrador Admin");
        $("#busqueda").focus();
        return;
    }
    if (parseInt(tipo) === 1) {
        $.get('getTablaClientes', {tipo: 'Residencial', tipoBusq: $("#urlBusq").val(), busqueda: string}, setTablaClientes, 'json');
    } else if (parseInt(tipo) === 0) {
        $.get('getTablaClientes', {tipo: 'Corporativo', tipoBusq: $("#urlBusq").val(), busqueda: string}, setTablaClientes, 'json');
    }
    activarBloqueoAjax();
}
//                          CAMBIAR PLAN
//==============================================================================
function getPlanes(tipo, idMcpo) {
    $.get('getPlanes', {tipo: tipo, idMcpo: idMcpo}, setPlanes, 'json');
    bloqueoAjax();
}
function setPlanes(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divFormAction").html(datos['tablaPlanes']);//pone los datos
        $("#tblPlanes").DataTable({
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
        $('#modalDetalle').modal('show');
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}
function seleccionarPlan(idPlan) {
    $.get('getInfoPlan', {idPlan: idPlan}, setInfoPlan, 'json');
    bloqueoAjax();
}
function setInfoPlan(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divInfoPlan").html(datos['html']);
        $("#modalDetalle").modal('hide');
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

//==============================================================================
//                       cambio de ip

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
            alert(" LA DIRECCION IP DIGITADA: " + ip + " \n NO PERTENECE A UN RANGO.\n Ejemplo: 192.168.15");
            $("#ipRadio").focus();
        }
    } else {
        alert("DEBE DIGITAR UNA DIRRECION IP");
        $("#ipRadio").focus();
    }
}
function setTablaIPs(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#infoTabla").html(datos['html']);
        $('#tblIPs').dataTable({
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
        $('#modalClientes').modal('show');
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}
function seleccionarIP(ip) {
    $("#ipRadioNew").val(ip);
    $('#modalClientes').modal('hide');
}
