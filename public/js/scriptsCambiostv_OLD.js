
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
    $("#infoInstalacionTv").hide('slow');
    $("#infoRetiroTv").hide('slow');
    $("#numDecos").removeAttr('required');
    $("#costo").removeAttr('required');
    $("#observacion").removeAttr('required');
    if (parseInt(datos['error']) === 0) {
        $("#infoClienteServicio").html(datos['html']);
        $("#infoClienteServicio").show('slow');
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
//        $("#infoClienteServicio").html('');
//        $("#infoClienteServicio").hide('slow');
        $("#divInfoServicio").hide('slow');
        $("#infoRetiroTv").hide('slow');
        $("#infoInstalacionTv").hide('slow');

        $("#numDecos").attr('required', 'required');
        $("#costo").attr('required', 'required');
        $("#observacion").attr('required', 'required');
    }
}
function setServicio(datos) {
    $("#divInfoServicio").hide('slow');
    $("#infoInstalacionTv").hide('slow');
    $("#infoRetiroTv").hide('slow');
    if (parseInt(datos['error']) === 0) {
        $("#divInfoServicio").html(datos['html']);
        $("#divInfoServicio").show('slow');
        $("#infoInstalacionTv").show('slow');
        $("#numDecos").attr('required', 'required');
        $("#costo").attr('required', 'required');
        $("#observacion").attr('required', 'required');
        $("#btnCambiarNumDecos").removeAttr('disabled');
        var numDecos = parseInt(datos['numDecos']);
        var costoInstalacion = 45000;
        var costoDecoAdicional = 40000;
        var minNumDecos = 2;
        if (numDecos > 0) {
            if ($("#infoRetiroTv").length) {
                $("#numDecos").attr('max', numDecos);
                $("#numDecos").attr('min', 1);
                $("#costo").attr('min', 0);
                $("#costo").val(0);
                console.log('Existe')
            } else {
                console.log('No Existe')
                $("#numDecos").attr('min', 1);
                $("#costo").attr('min', costoDecoAdicional);
                $("#costo").val('');
            }
            $("#numDecos").val('');
            $("#observacion").val('');
            $("#numDecos").focus();
            $("#totalDecos").val(numDecos);
            $("#infoRetiroTv").show('slow');
        } else {
            if ($("#infoRetiroTv").length) {
                $("#numDecos").val('');
                $("#costo").val('');
                $("#observacion").val('');
                $("#infoRetiroTv").hide('slow');
                $("#btnCambiarNumDecos").attr('disabled', 'disabled');
            } else {
                $("#infoRetiroTv").show('slow');
            }
            $("#numDecos").attr('min', 1);
            $("#costo").attr('min', costoInstalacion);
            $("#numDecos").val(minNumDecos);
            $("#costo").val(costoInstalacion);
            $("#observacion").val('');
            $("#numDecos").focus();
            $("#totalDecos").val(minNumDecos);
        }
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function validarRegistro() {
    if ($("#idCliente").length === 0 && $("#idCliente")) {
        alert("POR FAVOR, SELECCIONE UN CLIENTE.");
        $("#busqueda").focus();
        return false;
    }
    if ($("#infoInstalacionTv").length) {
        if ($("#numDecosOLD").val() === $("#numDecos").val()) {
            alert('EL NUMERO DE DECOS A CAMBIAR DEBE SER DIFERENTE AL NUMERO DE DECOS ACTUAL DEL SERVICIO !');
            $("#numDecos").val('');
            $("#numDecos").focus();
            $("#totalDecos").val(parseInt($("#numDecosOLD").val()) + parseInt($("#numDecos").val()));
            return false;
        }
    }
//    if ($("#respaldo").val() === '' && $("#observacion").val() === '') {
//        alert("ES NECESARIO INGRESAR LA OBSERVACION DEL CLIENTE O CARGAR LA EVIDENCIA CORRESPONDIENTE.");
//        $("#observacion").focus();
//        return false;
//    }
    return confirm("¿ DESEA CAMBIAR EL NUMERO DE DECOS A ESTE SERVICIO ?");
}

function verCambiarNumDecos() {
    $.get('vercambiarnumdecos', {}, setFormulario, 'json');
    activarBloqueoAjax();
}
function verSolicitarInstalacion() {
    $.get('versolicitarinstalacion', {}, setFormulario, 'json');
    activarBloqueoAjax();
}
function verSolicitarRetiro() {
    $.get('versolicitarretiro', {}, setFormulario, 'json');
    activarBloqueoAjax();
}
function verEnviarArchivosTV() {
    $.get('verenviararchivostv', {}, setFormulario, 'json');
    activarBloqueoAjax();
}
function verEliminar(idCambiosTv) {
    $.get('eliminar', {idCambiosTv: idCambiosTv}, setFormulario, 'json');
    activarBloqueoAjax();
}
function verDetalle(idCambiosTv) {
    $.get('detalle', {idCambiosTv: idCambiosTv}, setFormulario, 'json');
    activarBloqueoAjax();
}
function setFormulario(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divContenido").html(datos['html']);
        $("#modalFormulario").modal('show');
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

function onChangeFechaInicio(fechaInicio) {
    $("#fechaFin").val('');
    $("#fechaFin").attr('min', fechaInicio);
}

function validarCostoNumDecosInstalacion(numDecos) {
    var costoInstalacion = 45000;
    var costoDecoAdicional = 40000;
    var minNumDecos = 2;
    if (parseInt($("#numDecosOLD").val()) !== 0) {
        //INSTALACION DECOS ADICIONALES (Servicio ya cuenta con TV)
        if (parseInt(numDecos) > 1) {
            costoInstalacion = 0;
            for (var i = 0; i < parseInt(numDecos); i++) {
                costoInstalacion = costoInstalacion + costoDecoAdicional;
            }
            $("#costo").attr('min', costoInstalacion);
            $("#costo").val(costoInstalacion);
            $("#totalDecos").val(parseInt(numDecos) + parseInt($("#numDecosOLD").val()));
        } else if (parseInt(numDecos) <= 0) {
            alert("EL NUMERO DE DECOS DEBE SER MAYOR A CERO");
            $("#numDecos").val('');
            $("#costo").val('costoInstalacion');
            $("#totalDecos").val(parseInt($("#numDecosOLD").val()));
            $("#numDecos").focus();
            return false;
        } else {
            $("#totalDecos").val(parseInt(numDecos) + parseInt($("#numDecosOLD").val()));
            $("#costo").val(costoDecoAdicional);
        }
    } else {
        //INSTALACION TV (Servicio no cuenta con TV)
        if (parseInt(numDecos) > minNumDecos) {
            for (var i = minNumDecos; i < parseInt(numDecos); i++) {
                costoInstalacion = costoInstalacion + costoDecoAdicional;
            }
            $("#costo").attr('min', costoInstalacion);
            $("#costo").val(costoInstalacion);
            $("#totalDecos").val(parseInt(numDecos) + parseInt($("#numDecosOLD").val()));
        } else if (parseInt(numDecos) <= 0) {
            alert("EL NUMERO DE DECOS DEBE SER MAYOR A CERO");
            $("#numDecos").val(minNumDecos);
            $("#costo").val(costoInstalacion);
            $("#totalDecos").val(parseInt($("#numDecosOLD").val()) + parseInt($("#numDecos").val()));
            $("#numDecos").focus();
            return false;
        } else {
            $("#totalDecos").val(parseInt(numDecos) + parseInt($("#numDecosOLD").val()));
            $("#costo").val(costoInstalacion);
        }
    }
}