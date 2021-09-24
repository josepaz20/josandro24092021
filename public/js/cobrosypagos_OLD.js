var idCobro = '';
var idServicio = '';
var count = 0;
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
function activarBloqueoSubmit() {
    $.blockUI(
            {
                message: $('#msgBloqueoSubmit'),
                centerX: true,
                centerY: true,
                baseZ: 100000,
                css: {
                    border: 'none',
                    fontSize: '120%',
                    padding: '1%',
                    backgroundColor: 'rgba(250, 250, 250, 0)', '-webkit-border-radius': '10px', '-moz-border-radius': '10px',
                    color: '#fff'
                },
                overlayCSS: {
                    backgroundColor: 'rgba(225, 225, 225, 1)',
                    opacity: .85,
                    cursor: 'wait'
                },
            }
    );
}
//------------------------------------------------------------------------------
function verNuevo() {
    $.get('verNuevo', {}, setFormulario);
}
function verDetalle(idCobro) {
    $.get('verDetalle', {idCobro: idCobro}, setFormulario);
}
function verEliminar(idCobro) {
    $.get('verEliminar', {idCobro: idCobro}, setFormulario);
}
function verActualizar(idCobro) {
    $.get('verActualizar', {idCobro: idCobro}, setFormulario);
}
//------------------------------------------------------------------------------
function verNuevoTipoCobro() {
    $.get('verNuevoTipoCobro', {}, setFormulario);
}
function verDetalleTipoCobro(idTipoCobro) {
    $.get('verDetalleTipoCobro', {idTipoCobro: idTipoCobro}, setFormulario);
}
function verEliminarTipoCobro(idTipoCobro) {
    $.get('verEliminarTipoCobro', {idTipoCobro: idTipoCobro}, setFormulario);
}
//------------------------------------------------------------------------------
function setFormulario(respuestaServidor) {
    if (respuestaServidor !== 0) {
        $("#divContenido").html(respuestaServidor);
        $('#modalFormulario').modal('show');
    } else {
        swal.close();
        swal({
            title: "¡Error en el sistema!",
            text: "Se ha presentado un error en el sistema. Porfavor comunicarse con el administrador del sistema.",
            type: "error",
            timer: 3000,
            showConfirmButton: false
        });
    }
}
//                                 FILTROS TIPO CLIENTES
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

function selectMultipleTipo2() {
    if (parseInt($("#tipo2").val()) === 9999999) {
        $('.bootstrap-select.open').removeClass('open');
    }
    if ($("#tipo2").val().toString().indexOf(",") > -1) {
        var tipo = $("#tipo2").val().toString().split(',');
        if (parseInt(tipo[0]) === 9999999 || parseInt(tipo[1]) === 9999999) {
            $("#tipo2").val('default').selectpicker("refresh");
            $("#tipo2").val(9999999);
        }
        if (parseInt(tipo[0]) > 999 && parseInt(tipo[1]) > 999) {
            $("#tipo2").val('default').selectpicker("refresh");
        } else if (parseInt(tipo[0]) < 2 && parseInt(tipo[1]) < 2) {
            $("#tipo2").val('default').selectpicker("refresh");
        } else {
            $('.bootstrap-select.open').removeClass('open');
        }
    }
    validarTipoClienteAdministracion();
}


function validarTipoClienteAdministracion() {
    if ($("#tipo2").val().toString().indexOf("1") > -1) {
        document.getElementById("urlBusq2").options[1].innerHTML = "Nombre y Apellido";
        document.getElementById("urlBusq2").options[1].value = "filtronombreapellido";
        document.getElementById("urlBusq2").options[2].innerHTML = "Cedula";
        document.getElementById("urlBusq2").options[2].value = "filtrocedula";
        $("#buscarPorDIV").show('fast');
        $('#urlBusq2').removeAttr('disabled');
    } else if ($("#tipo2").val().toString().indexOf("0") > -1) {
        document.getElementById("urlBusq2").options[1].innerHTML = "Razon Social";
        document.getElementById("urlBusq2").options[1].value = "filtrorazonsocial";
        document.getElementById("urlBusq2").options[2].innerHTML = "Nit";
        document.getElementById("urlBusq2").options[2].value = "filtronit";
        $("#buscarPorDIV").show('fast');
        $('#urlBusq2').removeAttr('disabled');
    } else {
        $("#urlBusq2").val('');
        $("#buscarPorDIV").hide('fast');
    }
    if ($("#urlBusq2").val() === '') {
        $('#busqueda2').val('');
        $('#busqueda2').attr('readonly', true);
    } else {
        $('#busqueda2').val('');
        $('#busqueda2').removeAttr('readonly');
        $('#busqueda2').focus();
    }
}

//==============================================================================
function getCliente(tipoCliente) {
    var url = window.location.href;
    url = url.split('?')[0];
    url = url.split('/');
    url = url[url.length - 1];
    if (url === 'proformasCorporativas' || url === 'proformasResidenciales') {
        var ban = false;
        if (url === 'proformasCorporativas' && parseInt(tipoCliente) === 1) {
            ban = true;
        } else if (url === 'proformasResidenciales' && parseInt(tipoCliente) === 0) {
            ban = true;
        }
        if (ban) {
            swal({
                title: "¡TIPO DE FILTRO NO PERMITIDO!",
                type: "error",
                timer: 2000,
                showConfirmButton: false
            });
            return false;
        }
    }
    if ($("#busqueda").val() === '') {
        swal.close();
        swal({
            title: "¡Campo Vacío!",
            text: "Debes ingresar un parametro de busqueda",
            type: "error",
            timer: 2000,
            showConfirmButton: false
        });
        $("#busqueda").focus();
        return;
    }
    if (parseInt(tipoCliente) === 1) {
        $.get('getClienteRes', {tipoCliente: tipoCliente, busqueda: $('#busqueda').val(), urlBusq: $('#urlBusq').val()}, setFormularioCliente);
    } else if (parseInt(tipoCliente) === 0) {
        $.get('getClienteCorp', {tipoCliente: tipoCliente, busqueda: $('#busqueda').val(), urlBusq: $('#urlBusq').val()}, setFormularioCliente);
    }
    activarBloqueoAjax();
}
function getClienteAdministracion(tipo) {
    if (tipo.toString() === '') {
        swal.close();
        swal({
            title: "¡Seleccione un cliente o estado!",
            text: "Para continuar con la busqueda.",
            type: "error",
            timer: 2000,
            showConfirmButton: false
        });
        $("#busqueda2").focus();
        return false;
    }
    if ($("#busqueda2").val() === '') {
        swal.close();
        swal({
            title: "¡Campo Vacío!",
            text: "Debes ingresar un parametro de busqueda",
            type: "error",
            timer: 2000,
            showConfirmButton: false
        });
        $("#busqueda2").focus();
        return false;
    }
}
//==============================================================================
function setFormularioCliente(datos) {
    if (parseInt(datos.trim()) === 1) {
        swal.close();
        swal({
            title: "¡Busqueda Incorrecta!",
            text: "Este cliente no fue encontrado en la base de datos.\nINTENTA CON OTRO PORFAVOR.\nO si no comunicarse con el administrador del sistema.",
            type: "warning",
            confirmButtonColor: "#04B45F",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
        });
        return false;
    }
    if (datos !== '') {
        $("#divAnexar").html(datos);
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
            $('#tabla tbody').on('click', 'tr', function () {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                } else {
                    oTable.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                }
            });
        });
        $('#modalAnexar').modal('show');
    } else {
        swal.close();
        swal({
            title: "¡Error en el sistema!",
            text: "Se ha presentado un error en el sistema. Porfavor comunicarse con el administrador del sistema.",
            type: "error",
            timer: 3000,
            showConfirmButton: false
        });
    }
}
function clienteSeleccionado(idCliente, tipoCliente) {
    $.get('getClienteAjax', {idCliente: idCliente, tipoCliente: tipoCliente}, setCliente, 'json');
}
function setCliente(respuestaServidor) {
    if (parseInt(respuestaServidor['error']) === 0) {
        $("#clienteseSeleccionadoDiv").html(respuestaServidor['html']);
        $('#clienteSeleccionado').val(1);
        $('#servicioDIV').show('slow');
        $("#modalAnexar").modal('hide');
        getServicios();
    } else {
        swal.close();
        swal({
            title: "¡Error en el sistema!",
            text: "Se ha presentado un error en el sistema. Porfavor comunicarse con el administrador del sistema.",
            type: "error",
            timer: 3000,
            showConfirmButton: false
        });
    }
}
//function setLimite() {
//    var cero = '';
//    var ceroDia = '';
//    var f = new Date();
//    if (f.getMonth() < 9) {
//        cero = 0;
//    }
//    if (f.getDate() < 9) {
//        ceroDia = 0;
//    }
//    $('#desde').attr('max', f.getFullYear() + '-' + cero + (f.getMonth() + 1) + '-' + ceroDia + f.getDate());
//    if ($('#desde').val() !== '') {
//        $('#hasta').removeAttr('readonly');
//        $('#hasta').attr('min', $('#desde').val());
//        $('#hasta').attr('max', f.getFullYear() + '-' + cero + (f.getMonth() + 1) + '-' + ceroDia + f.getDate());
//        $('#hasta').val(f.getFullYear() + '-' + cero + (f.getMonth() + 1) + '-' + ceroDia + f.getDate());
//    }
//}

function getServicios() {
    if (parseInt($('#clienteSeleccionado').val()) !== 1) {
        swal.close();
        swal({
            title: "!Seleccionar cliente!",
            text: "Debes seleccionar un cliente porfavor.",
            type: "warning",
            timer: 2000,
            showConfirmButton: false
        });
        $("#busqueda").focus();
        $("#busqueda").val('');
        return;
    }
    if ($('#idCliente').val() === '' || $('#tipoCliente').val() === '') {
        swal.close();
        swal({
            title: "¡Cliente con datos incompletos!",
            text: "Se ha presentado un error en el sistema.\nSeleccionar un cliente diferente.",
            type: "error",
            timer: 2000,
            showConfirmButton: false
        });
        $("#busqueda").focus();
        $("#busqueda").val('');
        return;
    }
    $.get('getServicios', {idCliente: $('#idCliente').val(), tipoCliente: $('#tipoCliente').val()}, setServiciosSelect, 'json');
}
function setServiciosSelect(respuestaServer) {
    if (parseInt(respuestaServer['error']) === 2) {
        swal.close();
        swal({
            title: "¡Cliente sin servicios!",
            text: "Este cliente no tiene servicios registrados o activos en la base de datos.",
            type: "error",
            timer: 2000,
            showConfirmButton: false
        });
        return false;
    }
    if (parseInt(respuestaServer['error']) === 0) {
        swal.close();
        swal({
            title: "¡Seleccionado!",
            text: "Los servicios fueron recolectados para este cliente.",
            type: "success",
            timer: 1000,
            showConfirmButton: false
        });
        $('#servicioSelect').removeAttr('disabled');
        document.getElementById('servicioSelect').innerHTML = respuestaServer['html'];
    } else {
        swal.close();
        swal({
            title: "¡Error en el sistema!",
            text: "Se ha presentado un error en el sistema. Porfavor comunicarse con el administrador del sistema.",
            type: "error",
            timer: 3000,
            showConfirmButton: false
        });
    }
}
function activarTipoCobro(idTipoCobro, estado) {
    if (estado === 1) {
        confirmButtonText = "Activar";
        text = "Estás por activar un tipo cobro.";
        title = "Activado";
    } else if (estado === 0) {
        confirmButtonText = "Desactivar";
        text = "Estás por desactivar un tipo cobro.";
        title = "Desactivado";
    }
    swal.close();
    swal({
        title: "¿Estás seguro?",
        text: text,
        type: "warning",
        showCancelButton: true,
        cancelButtonColor: "#FA5858",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#04B45F",
        confirmButtonText: confirmButtonText,
        closeOnConfirm: false
    }).then(function (result) {
        if (result.value) {
            var parametro = {
                "idTipoCobro": idTipoCobro,
                "estado": estado,
            };
            $.ajax({
                data: parametro, //datos que se envian a traves de ajax
                url: 'activarTipoCobro', //constante que recibe la peticion
                type: 'get' //método de envio
            }).done(function (Error) {
                history.pushState(null, "", "/sw2click/modulos/cobrosypagos/administracionTipoCobro");
                if (parseInt(Error) === 0) {
                    swal({
                        title: title,
                        text: "Tipo cobro " + title,
                        type: "success",
                        timer: 900,
                        showConfirmButton: false
                    }).then(function () {
                        reiniciarPagina();
                    });
                } else {
                    swal({
                        title: "ERROR",
                        text: "Tipo de Cobro no Activado.",
                        type: "error",
                        timer: 1000,
                        showConfirmButton: false
                    });
                }
            });
        }

    });
}

function validarFormulario(accion, desde) {
    var text = "";
    switch (parseInt(desde)) {
        case 0:
            text = "cobro";
            break;
        case 1:
            text = "tipo cobro";
            break;
    }
    switch (parseInt(accion)) {
        case 1:
            if (!insertAlertPay(text, desde)) {
                return false;
            }
            break;
        case 2:
            if (!eliminarAlertPay(text, desde)) {
                return false;
            }
            break;
        case 3:
            if (!updateAlertPay(text, desde)) {
                return false;
            }
            break;
    }
}
function insertAlertPay(text, desde) {
    swal.close();
    swal({
        title: "¿Estás seguro?",
        text: "¿ Desea desea insertar este " + text + ' ?',
        type: "warning",
        showCancelButton: true,
        cancelButtonColor: "#FA5858",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#04B45F",
        confirmButtonText: "Guardar",
        closeOnConfirm: false
    }).then(function (result) {
        if (result.value) {
            activarBloqueoSubmit();
            if (parseInt(desde) === 0) {
                $("#formNuevo").attr('action', 'insert');
            } else if (parseInt(desde) === 1) {
                $("#formNuevo").attr('action', 'insertTipoCobro');
            }
            $('#formNuevo').removeAttr('onsubmit');
            $('#formNuevo').submit();
        } else {
            $("#formNuevo").attr('action', '');
            return;
        }
    });
}
function eliminarAlertPay(text, desde) {
    swal.close();
    swal({
        title: "¿Estás seguro?",
        text: "¿ Desea eliminar este " + text + ' ?',
        type: "warning",
        showCancelButton: true,
        cancelButtonColor: "#FA5858",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#04B45F",
        confirmButtonText: "Eliminar",
        closeOnConfirm: false
    }).then(function (result) {
        if (result.value) {
            activarBloqueoSubmit();
            if (parseInt(desde) === 0) {
                $("#formNuevo").attr('action', 'delete');
            } else if (parseInt(desde) === 1) {
                $("#formNuevo").attr('action', 'deleteTipoCobro');
            }
            $('#formNuevo').removeAttr('onsubmit');
            $('#formNuevo').submit();
        } else {
            $("#formNuevo").attr('action', '');
            return;
        }
    });
}
function updateAlertPay(text, desde) {
    swal.close();
    swal({
        title: "¿Estás seguro?",
        text: "¿ Desea actualizar este " + text + ' ?',
        type: "warning",
        showCancelButton: true,
        cancelButtonColor: "#FA5858",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#04B45F",
        confirmButtonText: "Actualizar",
        closeOnConfirm: false
    }).then(function (result) {
        if (result.value) {
            activarBloqueoSubmit();
            if (parseInt(desde) === 0) {
                $("#formNuevo").attr('action', 'update');
            } else if (parseInt(desde) === 1) {
                $("#formNuevo").attr('action', 'updateTipoCobro');
            }
            $('#formNuevo').removeAttr('onsubmit');
            $('#formNuevo').submit();
        } else {
            $("#formNuevo").attr('action', '');
            return;
        }
    });
}
function getServicioInfo(idServicio) {
    if (idServicio !== '') {
        if ($('#idServicio').length === 1 && parseInt($('#idServicio').val()) > 0) {
            if (!confirm("Si ya as cargado cobros en la tabla seran eliminados !! Desea continuar ?")) {
                return false;
            }
        }
        $.get('getServicioInfo', {idServicio: idServicio}, setServicioInfo, 'json');
    } else
        $("#DIVINFOSERVICIOHIDDEN").hide('slow');
}
function setServicioInfo(respuesta) {
    if (parseInt(respuesta['existe']) === 1) {
        $("#DIVINFOSERVICIOHIDDEN").show('slow');
        $("#idServicio").val(respuesta['idServicio']);
        if ($("#idServicio_1").length > 0) {
            $("#idServicio_1").val(respuesta['idServicio']);
        }
        $("#conceptoServicio").val(respuesta['conceptoFacturacion']);
        $("#vlrServicio").val(respuesta['totalPago']);
        $("#estado").val(respuesta['estado']);
        var numDecos = respuesta['numDecos'];
        if (numDecos === '' || numDecos === 'null') {
            numDecos = 0;
        }
        $("#numDecos").val(numDecos);
        var tvAnaloga = '';
        if (parseInt(respuesta['tvanaloga']) === 1) {
            tvAnaloga = 'SI';
        }
        if (parseInt(respuesta['tvanaloga']) === 0) {
            tvAnaloga = 'NO';
        }
        $("#tvAnaloga").val(tvAnaloga);

        //----------------------------------------------------------------------
        //Eliminar cobros cargados en la tabla
        var txtNumConceptos = document.getElementById('numConceptos');
        txtNumConceptos.value = 1;
        $("#tipoCobro_1").val('');
        $("#concepto_1").val('');
        $("#vlrbase_1").val(0);
        $("#vlriva_1").val(0);
        $("#vlrtotal_1").val(0);
        $("#vlr-total-proforma").val("$ " + 0);
        $('#tablaCobros tr:not(:first-child)').slice(0).remove();
    }
}
function conceptoCobro(value, ids) {
    var tipoCobro = value.split('_');
    var id = ids.split('_');
    if (parseInt($('#clienteSeleccionado').val()) < 1) {
        swal.close();
        swal({
            title: "¡Seleccione un cliente porfavor!",
            type: "warning",
            timer: 2000,
            showCalcelButton: false,
            showConfirmButton: false
        }).then(function () {
            $("#busqueda").focus();
        });
        $("#tipoCobro_" + id[1]).val("");
        return false;
    }
    if ($('#servicioSelect').val() === '') {
        swal.close();
        swal({
            title: "¡Seleccione un servicio porfavor!",
            type: "warning",
            timer: 2000,
            showCalcelButton: false,
            showConfirmButton: false
        }).then(function () {
            $("#servicioSelect").focus();
        });
        $("#tipoCobro_" + id[1]).val("");
        return false;
    }
    if (tipoCobro[0] !== '') {
        var servicio = $("#servicioSelect option:selected").text();
        $("#concepto_" + id[1]).val(servicio.split(" - ")[1].toString());
        if ($("#tipoCobro_" + id[1] + " option:selected").text() === 'SERVICIO TV') {
            $("#concepto_" + id[1]).val('PAGO A TERCEROS');
        }
    }
    if (tipoCobro[0] === '') {
        $("#concepto_" + id[1]).val("");
    }
}
function setNuevoConcepto() {
    var tabla = document.getElementById('tablaCobros');
    var ultFila = tabla.rows.length;
    var i = ultFila;
    if (parseInt($('#clienteSeleccionado').val()) < 1) {
        swal.close();
        swal({
            title: "¡Seleccione un cliente porfavor!",
            type: "warning",
            timer: 2000,
            showCalcelButton: false,
            showConfirmButton: false
        }).then(function () {
            $("#busqueda").focus();
        });
        $("#tipocobro_" + i).val("");
        return false;
    }
    if ($('#servicioSelect').val() === '') {
        swal.close();
        swal({
            title: "¡Seleccione un servicio porfavor!",
            type: "warning",
            timer: 2000,
            showCalcelButton: false,
            showConfirmButton: false
        }).then(function () {
            $("#servicioSelect").focus();
        });
        $("#tipocobro_" + i).val("");
        return false;
    }

    var fila = tabla.insertRow(ultFila);
//##############################################################################
//        select TIPO CONCEPTO
    var campoSelect = fila.insertCell(0);
    var inValorSelect = document.createElement('select');
    inValorSelect.name = 'tipoCobro_' + i;
    inValorSelect.id = 'tipoCobro_' + i;
    inValorSelect.required = 'true';
    inValorSelect.setAttribute('class', 'form-control');
    inValorSelect.setAttribute('style', 'width: 130px');
    inValorSelect.setAttribute('onchange', "conceptoCobro(this.value, this.id);");
    campoSelect.appendChild(inValorSelect);
    $.ajax({
        dataType: "json", // formato
        url: 'tipoCobroAjax', //constante que recibe la peticion
        type: 'post' //método de envio
    }).done(function (respuestaServidor) {
        if (parseInt(respuestaServidor["error"]) === 0) {
            $('#tipoCobro_' + i).html(respuestaServidor['html']);
        } else {
            $('#tipoCobro_' + i).html('');
            alert('SE HA PRESENTADO UN ERROR EL SISTEMA \nPOR FAVOR CUMICARSE CON EL ADMINISTRADOR DEL SISTEMA.');
        }
    });
//##############################################################################    
    var valor = fila.insertCell(1);
    var inConcepto = document.createElement('input');
    inConcepto.name = 'concepto_' + i;
    inConcepto.id = 'concepto_' + i;
    inConcepto.setAttribute('class', 'form-control');
    valor.appendChild(inConcepto);
    var valor = fila.insertCell(2);
    var inValor = document.createElement('input');
    inValor.name = 'vlrbase_' + i;
    inValor.value = '0';
    inValor.id = 'vlrbase_' + i;
    inValor.required = 'true';
    inValor.setAttribute('type', 'number');
    inValor.setAttribute('readonly', 'true');
    inValor.setAttribute('class', 'form-control');
    inValor.setAttribute('style', 'width: 100px');
    inValor.setAttribute('min', '0');
    inValor.setAttribute('onchange', 'calcularValoresInstalacion()');
    valor.appendChild(inValor);
    var valor = fila.insertCell(3);
    var inValor = document.createElement('input');
    inValor.name = 'vlriva_' + i;
    inValor.value = '0';
    inValor.id = 'vlriva_' + i;
    inValor.required = 'true';
    inValor.setAttribute('type', 'number');
    inValor.setAttribute('class', 'form-control');
    inValor.setAttribute('readonly', 'true');
    inValor.setAttribute('style', 'width: 100px');
    inValor.setAttribute('min', '0');
    inValor.setAttribute('onchange', 'calcularValoresInstalacion()');
    valor.appendChild(inValor);

    var inValor = document.createElement('input');
    inValor.name = 'aplicaiva_' + i;
    inValor.id = 'aplicaiva_' + i;
    inValor.setAttribute('type', 'checkbox');
    inValor.setAttribute('onclick', 'calcularBase(' + i + ')');
    inValor.setAttribute('onchange', 'calcularValoresInstalacion()');
    valor.appendChild(inValor);

    var inValor = document.createElement('label');
    inValor.innerHTML = ' Aplica IVA';
    inValor.setAttribute('for', 'aplicaiva_' + i);
    valor.appendChild(inValor);

    var valor = fila.insertCell(4);
    var inValor = document.createElement('input');
    inValor.name = 'vlrtotal_' + i;
    inValor.value = '0';
    inValor.id = 'vlrtotal_' + i;
    inValor.required = 'true';
    inValor.setAttribute('type', 'number');
    inValor.setAttribute('class', 'form-control');
    inValor.setAttribute('style', 'width: 100px');
    inValor.setAttribute('min', '0');
    inValor.setAttribute('onchange', 'calcularBase(' + i + ')');
    valor.appendChild(inValor);
    var txtNumConceptos = document.getElementById('numConceptos');
    txtNumConceptos.value++;
}

function calcularValoresInstalacion() {
    var total = 0;
    for (i = 1; i <= parseInt($("#numConceptos").val()); i++) {
        total = Math.floor(parseInt(total) + parseInt($("#vlr_" + i).val()));
    }
    $("#vlrTotal").val(total);
    setVLRTotales();
}


function eliminarConcepto() {
    var tabla = document.getElementById('tablaCobros');
    var ultFila = tabla.rows.length;
    if (ultFila > 2) {
        swal({
            title: "¡Estas Seguro!",
            text: "Desea eliminar este concepto de cobro...",
            type: "warning",
            showCancelButton: true,
            cancelButtonColor: "#04B45F",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#FA5858",
            confirmButtonText: "Eliminar",
            closeOnConfirm: false
        }).then(function (value) {
            if (value) {
                tabla.deleteRow(ultFila - 1);
                var txtNumConceptos = document.getElementById('numConceptos');
                txtNumConceptos.value--;
                calcularValoresInstalacion();
            } else {
                return false;
            }
        });
    } else {
        swal({
            title: "¡Imposible!",
            type: "error",
            timer: 700,
            showCancelButton: false,
            showConfirmButton: false,
            closeOnConfirm: false
        });
    }
}
function setVLRTotales() {
    var t = $("#vlrTotal").val();
    if (t !== '' && parseInt(t) < 0) {
        $("#vlrTotal").val(0);
        return false;
    }
    if ($("#tipoCliente").val() !== 'Residencial') {
        if (parseInt(t) > 0) {
            $("#vlrIva").val(Math.floor((t * 19) / 100));
        }
    }
    var i = parseInt($("#vlrIva").val());
    $("#vlrBase").val(Math.floor(t - i));
}
function reiniciarPagina() {
    location.reload();
}
//------------------------------------------------------------------------------
function checkProformas() {
    $("#checkbox-select-all").attr('onclick', 'notCheckProformas();');
    $("input[type=checkbox]").each(function () {
        $(this).prop("checked", true);
    });
}
function notCheckProformas() {
    $("#checkbox-select-all").attr('onclick', 'checkProformas();');
    $("input[type=checkbox]").each(function () {
        $(this).prop("checked", false);
    });
}
function enviarMails(desde) {
    var cont = 0;
    $("input[type=checkbox]").each(function () {
        if ($(this).prop('checked')) {
            cont++;
        }
    });
    if (cont === 0) {
        alert('¡SELECCIONE ALMENOS UNA PROFORMA!');
        return false;
    }
    if (desde === 'corporativo') {
        $("#formMails").attr('action', 'enviarEmailCorporativo');
    } else if (desde === 'residencial') {
        $("#formMails").attr('action', 'enviarEmailResidencial');
    } else {
        return false;
    }
    if (confirm('¿ DESEA ENVIAR POR EMAIL ESTAS PROFORMAS ?')) {
        $("#formMails").submit();
    }
}
//------------------------------------------------------------------------------
function eliminarProformaRes(idProforma) {
    if (confirm('¿ DESEA ELIMINAR ESTA PROFORMA RESIDENCIAL ?')) {
        activarBloqueoAjax();
        $(location).attr('href', "eliminarProformaRes?idProforma=" + idProforma);
    }
}
function eliminarProformaCorp(idProforma) {
    if (confirm('¿ DESEA ELIMINAR ESTA PROFORMA CORPORATIVA ?')) {
        activarBloqueoAjax();
        $(location).attr('href', "eliminarProformaCorp?idProforma=" + idProforma);
    }
}
//------------------------------------------------------------------------------
function verRegistrarProforma() {
    var ban = true;
    var idC = 0;
    $("input[type=checkbox]").each(function () {
        if ($(this).prop('checked')) {
            var v = $(this).val().split('_');
            idCobro += v[0] + ', ';
            if (count === 0) {
                idC = v[0];
                idServicio = v[1];
            }
            if (count > 0 && idServicio !== v[1]) {
                alert('¡ NO ES POSIBLE USTED ESTA INTENTANDO REGISTRAR COBROS DE DIFERENTE SERVICIO !');
                ban = false;
                return false;
            }
            count++;
        }
    });
    if (ban) {
        if (count > 0) {
            idCobro = idCobro.trim().slice(0, -1);
            $.get('verRegistrarProforma', {idCobro: idC}, setFormularioProforma);
        } else {
            alert('¡ SELECIONE UN COBRO !');
        }
    }
}
//------------------------------------------------------------------------------
function verActualizarProforma(idProforma) {
    $.get('verActualizarProforma', {idProforma: idProforma}, setFormularioProforma);
}
//------------------------------------------------------------------------------
function setFormularioProforma(respuestaServidor) {
    if (respuestaServidor !== 0) {
        $("#divContenido").html(respuestaServidor);
        $("#idsCobro").val(idCobro);
        $("#cantCobros").val(count);
        $("#idsServicio").val(idServicio);
        $('#modalFormulario').modal('show');
        idCobro = '';
        count = 0;
        idServicio = '';
    } else {
        swal.close();
        swal({
            title: "¡Error en el sistema!",
            text: "Se ha presentado un error en el sistema. Porfavor comunicarse con el administrador del sistema.",
            type: "error",
            timer: 3000,
            showConfirmButton: false
        });
    }
}
function validarTableProforma() {
    if (confirm('¿ DESEA GENERAR ESTA PROFORMA CON ESTOS COBROS ?')) {
        $("#form-tables-cobros").attr('action', 'insertProforma');
        $("#form-tables-cobros").submit();
    }
}
function validarFormularioProforma(desde) {
    if ($("#fechalimitepago").val() === '' || $("#fechacorte").val() === '' || $("#mes").val() === '' || $("#anio").val() === '') {
        alert('¡ CAMPOS VACIOS EN EL FORMULARIO !');
        return false;
    }
    if (desde === 'insert') {
        if (confirm('¿ DESEA GENERAR UNA PROFORMA PARA ESTOS COBROS ?')) {
            $("#form-proforma").removeAttr('onsubmit');
            $("#form-proforma").attr('action', 'insertProforma');
            $("#form-proforma").submit();
            bloqueoAjax();
        }
    }
    if (desde === 'update') {
        var url = window.location.href;
        url = url.split('?')[0];
        url = url.split('/');
        if (confirm('¿ DESEA ACTUALIZAR ESTA PROFORMA ?')) {
            $("#form-proforma").removeAttr('onsubmit');
            $("#desde-desde").val(url[url.length - 1]);
            $("#form-proforma").attr('action', 'updateProforma');
            $("#form-proforma").submit();
            bloqueoAjax();
        }
        return false;
    }
    if (desde === 'insert-cobro-proforma') {
        var url = window.location.href;
        url = url.split('?')[0];
        url = url.split('/');
        if (confirm('¿ DESEA GENERAR ESTA PROFORMA CON ESTOS COBROS ?')) {
            $("#formNuevo").removeAttr('onsubmit');
            $("#desde-desde").val(url[url.length - 1]);
            $("#formNuevo").attr('action', 'insertCobroProforma');
            $("#formNuevo").submit();
            bloqueoAjax();
        }
        return false;
    }
}

//------------------------------------------------------------------------------

function setActualizarCobro(idCobro) {
    $("#concepto_" + idCobro).removeAttr('readonly');
    $("#concepto_" + idCobro).attr('required', true);
    $("#vlrtotal_" + idCobro).removeAttr('readonly');
    $("#vlrtotal_" + idCobro).attr('required', true);
//    $("#vlrbase_" + idCobro).removeAttr('readonly');
//    $("#vlrbase_" + idCobro).attr('required', true);
//    $("#vlriva_" + idCobro).removeAttr('readonly');
//    $("#vlriva_" + idCobro).attr('required', true);
    $("#guardarCobro_" + idCobro).show('slow');
    $("#resetActualizarCobro_" + idCobro).show('slow');
    $("#actualizarCobro_" + idCobro).hide();
    $("#eliminarCobro_" + idCobro).hide();
}
//------------------------------------------------------------------------------

function guardarCobro(idCobro) {
    var concepto = $.trim($("#concepto_" + idCobro).val());
    var vlrtotal = parseInt($("#vlrtotal_" + idCobro).val());
    var vlrBase = $("#vlrbase_" + idCobro).val();
    var vlrIva = $("#vlriva_" + idCobro).val();
    if (concepto.length === 0) {
        alert("POR FAVOR DIGITE EL CONCEPTO DEL COBRO");
        $("#concepto_" + idCobro).focus();
        return false;
    }
    if (vlrtotal === 0) {
        alert("POR FAVOR DIGITE EL VALOR DEL COBRO, RECUERDE QUE DEBE SER MAYOR QUE CERO");
        $("#vlrtotal_" + idCobro).focus();
        return false;
    }
    if (confirm("¿ DESEA ACTUALIZAR ESTE COBRO ?")) {
        $.ajax({
            data: {
                "concepto": concepto,
                "vlrTotal": vlrtotal,
                "vlrBase": vlrBase,
                "vlrIva": vlrIva,
                "idCobro": idCobro
            }, //datos que se envian a traves de ajax
            url: 'guardarCobro', //constante que recibe la peticion
            type: 'post' //método de envio
        }).done(function (tipoError) {
            if (parseInt(tipoError) !== 1) {
                $("#tablaCobros tbody").html(tipoError);
            } else
                alert('Se ha presentado un error en el sistema. Porfavor comunicarse con el administrador del sistema.');
        });
    }
//    $.get('guardarCobro', {idCobro: idCobro, concepto: concepto, vlrtotal: vlrtotal}, setTablaCobros, 'json');
}
function eliminarCobro(idCobro) {
    if (confirm("¿ DESEA ELIMINAR ESTE COBRO ?")) {
        $.ajax({
            data: {"idCobro": idCobro}, //datos que se envian a traves de ajax
            url: 'eliminarCobro', //constante que recibe la peticion
            type: 'post' //método de envio
        }).done(function (tipoError) {
            if (parseInt(tipoError) !== 1) {
                $("#tablaCobros tbody").html(tipoError);
            } else
                alert('Se ha presentado un error en el sistema. Porfavor comunicarse con el administrador del sistema.');
        });
    }
}

//------------------------------------------------------------------------------

function resetActualizarCobro(idCobro) {
    $("#concepto_" + idCobro).removeAttr('required');
    $("#concepto_" + idCobro).attr('readonly', true);
    $("#concepto_" + idCobro).val($("#conceptoOLD_" + idCobro).val());
    $("#vlrbase_" + idCobro).removeAttr('required');
    $("#vlrbase_" + idCobro).attr('readonly', true);
    $("#vlrbase_" + idCobro).val($("#vlrbaseOLD_" + idCobro).val());
    $("#vlriva_" + idCobro).removeAttr('required');
    $("#vlriva_" + idCobro).attr('readonly', true);
    $("#vlriva_" + idCobro).val($("#vlrivaOLD_" + idCobro).val());
    $("#vlrtotal_" + idCobro).removeAttr('required');
    $("#vlrtotal_" + idCobro).attr('readonly', true);
    $("#vlrtotal_" + idCobro).val($("#vlrtotalOLD_" + idCobro).val());
    $("#actualizarCobro_" + idCobro).show('slow');
    $("#eliminarCobro_" + idCobro).show('slow');
    $("#resetActualizarCobro_" + idCobro).hide();
    $("#guardarCobro_" + idCobro).hide();
}
//------------------------------------------------------------------------------


function calcularBase(idCobro) {
    var total = $("#vlrtotal_" + idCobro).val();
    if (total === '' || parseInt(total) < 0) {
        $("#vlrtotal_" + idCobro).val(0);
        alert(" EL VALOR TOTAL DEL COBRO NO PUEDE SER MENOR, VACIO O IGUAL A CERO !");
        $("#vlrtotal_" + idCobro).focus();
        $("#vlr-total-proforma").val("$ 0");
        return false;
    }
    total = parseInt(total);
    if (total > 0) {
        if ($("#aplicaiva_" + idCobro).is(':checked')) {
            var base = Math.round(total / 1.19);
            var iva = total - base;
            $("#vlriva_" + idCobro).val(iva);
            $("#vlrbase_" + idCobro).val(base);
        } else {
            $("#vlriva_" + idCobro).val(0);
            $("#vlrbase_" + idCobro).val(total);
        }
    }
    calcularVlrTotalProforma();
}
function calcularVlrTotalProforma() {
    var txtNumConceptos = document.getElementById('numConceptos').value;
    var total = 0;
    for (var i = 1; i <= parseInt(txtNumConceptos); i++) {
        total = Math.floor(parseInt(total) + parseInt($("#vlrtotal_" + i).val()));
    }
    $("#vlr-total-proforma").val("$ " + new Intl.NumberFormat().format(total));
}
//------------------------------------------------------------------------------
function validarBusqueda() {
    if ($("#identificacionBusq").val() === '' && $("#clienteBusq").val() === '' && $("#anioBusq").val() === '' && $("#mesBusq").val() === '' && $("#idDpto").val() === '' && $("#idMcpo").val() === '') {
        alert('¡ CAMPOS VACIOS PARA REALIZAR LA BUSQUEDA !');
        return false;
    }
    if ($("#anioBusq").val() !== '' || $("#mesBusq").val() !== '') {
        if (!($("#anioBusq").val() !== '' && $("#mesBusq").val() !== '')) {
            alert('¡ AÑO Y/O MES VACIO, IMPOSIBLE REALIZAR LA BUSQUEDA !');
            return false;
        }
    }
    if ($("#idDpto").val() !== '' || $("#idMcpo").val() !== '') {
        if (!($("#idDpto").val() !== '' && $("#idMcpo").val() !== '')) {
            alert('¡ DEPARTAMENTO Y/O MUNICIPIO VACIO, IMPOSIBLE REALIZAR LA BUSQUEDA !');
            return false;
        }
    }
    activarBloqueoAjax();
    $("#clienteBusq").val($("#clienteBusq").val().trim());
    var url = window.location.href;
    url = url.split('?')[0];
    url = url.split('/');
    $("#frmFiltroBusq").attr("action", url[url.length - 1]);
}
function setLimpiar() {
    activarBloqueoAjax();
    var url = window.location.href;
    url = url.split('?')[0];
    location.href = url;
}
//------------------------------------------------------------------------------
function verRegistrarCobroProforma() {
    $.get('verRegistrarCobroProforma', {}, setRegistrarCobroProforma);
}
function setRegistrarCobroProforma(respuestaServidor) {
    if (respuestaServidor !== 0) {
        $("#divContenido").html(respuestaServidor);
        $('#modalFormulario').modal('show');
    } else {
        swal.close();
        swal({
            title: "¡Error en el sistema!",
            text: "Se ha presentado un error en el sistema. Porfavor comunicarse con el administrador del sistema.",
            type: "error",
            timer: 3000,
            showConfirmButton: false
        });
    }
}
//==============================================================================
function getMunicipios(idDpto) {
    if (idDpto === '') {
        $("#idMcpo").val('');
        $("#idMcpo").attr('disabled', 'disabled');
        return false;
    }
    $.get('getMunicipios', {idDpto: idDpto}, setMunicipios);
}
function setMunicipios(datos) {
    $("#idMcpo").html(datos);
    $("#idMcpo").removeAttr('disabled');
}
//==============================================================================
function getDescuentosCobro(idCobro) {
    $("#idCobroDescuento").val(idCobro);
    $("#total-total-2").val($("#vlrtotal_" + idCobro).val());
    $("#vlrcobro_2").val($("#vlrtotal_" + idCobro).val());
    $.get('getDescuentosCobro', {idCobro: idCobro}, setDescuentosCobro, 'json');
}
function setDescuentosCobro(respuesta) {
    $("#modalDescuento").modal('show');
    if (parseInt(respuesta['error']) === 0) {
        $("#idCobroDescuento").val(respuesta['idCobro']);
        $("#descuentoCobro").val(respuesta['vlrDescuento']);
        $("#vlrcobro_2").val($("#vlrtotal_" + respuesta['idCobro']).val());
        //----------------------------------------------------------------------
        var total2 = 0;
        total2 = Math.floor(parseInt(parseInt($("#vlrcobro_2").val()) - respuesta['vlrDescuento']));
        //----------------------------------------------------------------------
        $("#total-total-2").val(total2);
        $("#tabla-descuentos tbody").html(respuesta['tabla']);
    }
    $("#diasDescuento").focus();
}
function setDescuentoForm(diasDescuento) {
    var vlr = 0;
//    var idCobroDescuento = $("#idCobroDescuento").val();
    //---------------------------------------------------
    var vlrtotal = parseInt($("#total-total-2").val());
    //---------------------------------------------------
    var vlrTotalDescuento = $("#vlrTotalDescuento").val();
    //---------------------------------------------------
    if (diasDescuento === '' || diasDescuento < 0) {
        $("#diasDescuento").val(0);
        return false;
    }
    if (vlrTotalDescuento === '' || parseInt(vlrTotalDescuento) < 0) {
        $("#diasDescuento").val(0);
        $("#vlrTotalDescuento").val(0);
        return false;
    }
    if (parseInt(vlrTotalDescuento) > 0) {
        vlr = Math.floor(parseInt(vlrtotal) - parseInt(vlrTotalDescuento));
        $("#vlrdescuento").val(vlrTotalDescuento);
    }
    if (parseInt(diasDescuento) > 0) {
        var descuento = 0;
        //---------------------------------------------------
        descuento = Math.floor(parseInt(vlrtotal / 30));
        //---------------------------------------------------
        descuento = Math.floor(parseInt(descuento) * parseInt(diasDescuento));
        descuento = parseInt(descuento / 100) * 100;
        //---------------------------------------------------
        $("#vlrdescuento").val(descuento);
        //---------------------------------------------------
        $("#vlrTotalDescuento").val(descuento);
        //---------------------------------------------------
        vlr = Math.floor(parseInt(vlrtotal) - parseInt(descuento));
        //---------------------------------------------------
    }
    vlr = parseInt(parseInt(vlr) / 100) * 100;
    if (parseInt(vlr) >= 1000) {
        $("#vlrTotalL").val(vlr);
        $("#vlrTotalHiddeDescuento").val(vlr);
    } else {
        $("#vlrTotalDescuento").val(0);
        $("#diasDescuento").val(0);
        $("#vlrTotalL").val(0);
        $("#vlrTotalHiddeDescuento").val(0);
        alert("EL VALOR TOTAL NO DEBE SER MENOR A MIL PESOS");
    }
}
function saveDescuentoCobro() {
    var vlrtotal = parseInt($("#vlrTotalHiddeDescuento").val());
    var total = parseInt($("#total-total-2").val());
    var validacionTotal = Math.floor(parseInt(total) + parseInt(vlrtotal));
    if (validacionTotal < 1000) {
        alert("EL VALOR TOTAL NO DEBE SER MENOR A MIL PESOS ($1,000).");
        return false;
    }
    if (confirm("¿ DESEA APLICAR DESCUENTO A ESTE COBRO ?")) {
        $.ajax({
            data: {
                "vlrTotal": $("#vlrTotalHiddeDescuento").val(),
                "idCobro": $("#idCobroDescuento").val(),
                "vlrdescuento": $("#vlrdescuento").val()
            }, //datos que se envian a traves de ajax
            url: 'descuentoCobro', //constante que recibe la peticion
            type: 'post' //método de envio
        }).done(function (tipoError) {
            if (parseInt(tipoError) !== 1) {
                $("#vlrTotalDescuento").val(0);
                $("#vlrTotalHiddeDescuento").val(0);
                $("#vlrTotalL").val(0);
                $("#diasDescuento").val(0);
                $("#modalDescuento").modal('hide');
                $("#tablaCobros tbody").html(tipoError);
            } else
                alert('Se ha presentado un error en el sistema. Porfavor comunicarse con el administrador del sistema.');
        });
    }
}
//==============================================================================
function setFechaCorte(value_limite_pago) {
    $("#fechacorte").attr('min', value_limite_pago);
}
//==============================================================================

function eliminarDescuento(idDescuento) {
    if (confirm(" DESEA ELIMINAR ESTE DESCUENTO ? ")) {
        $.get('eliminardescuento', {idDescuento: idDescuento}, setRespuesta, 'json');
        activarBloqueoAjax();
    }
    return false;
}
function setRespuesta(respuesta) {
    switch (parseInt(respuesta['error'])) {
        case 0:
            msg = " [ OK ] EL DESCUENTO FUE ELIMINADO";
            break;
        case 1:
            msg = " [ ERROR ] - EL DESCUENTO NO FUE ELIMINADO";
            break;
    }
    alert(msg);
    location.reload();
}

function enviarFacturaElectronica(idProforma) {
    if (confirm(' DESEA ENVIAR ESTA PROFORMA A FACTURA ELECTRONICA ?')) {
        activarBloqueoAjax();
        $(location).attr('href', "generarFacturaElectronica?idProforma=" + idProforma);
    }
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

function verRegistrarCobroProformaCorp() {
    $.get('verRegistrarCorp', {}, setRegistrarCobroProforma);
}
function setRegistrarCobroProforma(respuestaServidor) {
    if (respuestaServidor !== 0) {
        $("#divContenido").html(respuestaServidor);
        $('#modalFormulario').modal('show');
    } else {
        swal.close();
        swal({
            title: "Error en el sistema!",
            text: "Se ha presentado un error en el sistema. Porfavor comunicarse con el administrador del sistema.",
            type: "error",
            timer: 3000,
            showConfirmButton: false
        });
    }
}
//------------------------------------------------------------------------------

function setNuevoConceptoCorp() {
    if (parseInt($('#clienteSeleccionado').val()) < 1) {
        swal.close();
        swal({
            title: "POR FAVOR, SELECCIONE UN CLIENTE",
            type: "warning",
            timer: 2000,
            showCalcelButton: false,
            showConfirmButton: false
        }).then(function () {
            $("#busqueda").focus();
        });
        $("#tipocobro_" + i).val("");
        return false;
    }
    if ($('#servicioSelect').val() === '') {
        swal.close();
        swal({
            title: "POR FAVOR, SELECCIONE UN SERVICIO",
            type: "warning",
            timer: 2000,
            showCalcelButton: false,
            showConfirmButton: false
        }).then(function () {
            $("#servicioSelect").focus();
        });
        $("#tipocobro_" + i).val("");
        return false;
    }

    var idServicio = $('#servicioSelect').val();

    var newfila = '<tr>';
    newfila += '<td>';
    newfila += '<input type="number" name="idServicio_' + i + '" id="idServicio_' + i + '" value="' + idServicio + '" style="width: 80px !important" class="form-control" readonly>';
    newfila += '</td>';
    newfila += '<td>';
    newfila += '<select id="tipoCobro_' + i + '" name="tipoCobro_' + i + '" class="form-control" style="width: 130px" onchange="conceptoCobro(this.value, this.id)">';
    newfila += '<option value="SERVICIO INTERNET_1">SERVICIO INTERNET</option>';
    newfila += '<option value="SERVICIO TV_2">SERVICIO TV</option>';
    newfila += '</select>';
    newfila += '</td>';
    newfila += '<td>';
    newfila += '<input class="form-control" name="concepto_' + i + '" id="concepto_' + i + '" value="">';
    newfila += '</td>';
    newfila += '<td>';
    newfila += '<input class="form-control" value="0" type="number" name="vlrbase_' + i + '" id="vlrbase_' + i + '" min="0" onchange="calcularBase(' + i + ')" style="width: 100px" readonly>';
    newfila += '</td>';
    newfila += '<td>';
    newfila += '<input class="form-control" value="0" type="number" name="vlriva_' + i + '" id="vlriva_' + i + '" min="0" onchange="calcularBase(' + i + ')" style="width: 100px" readonly>';
    newfila += '<input type="checkbox" id="aplicaiva_' + i + '" name="aplicaiva_' + i + '" onclick="calcularBase(' + i + ')"> <label for="aplicaiva_' + i + '">Aplica IVA</label>';
    newfila += '</td>';
    newfila += '<td>';
    newfila += '<input class="form-control" value="0" type="number" name="vlrtotal_' + i + '" id="vlrtotal_' + i + '" min="1" onchange="calcularBase(' + i + ')" style="width: 100px" required>';
    newfila += '</td>';
    newfila += '</tr>';

    $("#tablaCobros").append(newfila);
    $("#numConceptos").val(parseInt($("#numConceptos").val()) + 1);
}


//==============================================================================

