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
function verNuevo() {
    $.get('verNuevo', {}, setFormulario);
}
function verDetalle(idTarea) {
    $.get('verDetalle', {idTarea: idTarea}, setFormulario);
}
function verEliminar(idTarea) {
    $.get('verEliminar', {idTarea: idTarea}, setFormulario);
}
function verActualizar(idTarea) {
    $.get('verActualizar', {idTarea: idTarea}, setFormulario);
}
function setFormulario(datos) {
    if (datos !== '') {
        $("#divContenido").html(datos);
        $('#modalFormulario').modal('show');
    } else {
        alert('SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n POR FAVOR COMUNICARSE CON EL ADMINISTRADOR.');
    }
}
function siguienteEstado(idTarea, idEstado) {
    var envio = {
        "idTarea": idTarea,
        "idEstado": idEstado
    };
    $.ajax({
        data: envio, //datos que se envian a traves de ajax
        url: 'siguienteEstado', //constante que recibe la peticion
        type: 'get' //método de envio
    }).done(function (respuestaServidor) {
        if (parseInt(respuestaServidor) === 1) {
            location.href = "/sw2click/modulos/tareas/administracion";
        } else {
            alert('[ERROR].\n -NO SE HA PODIDO- REALIZAR EL CAMBIO DE ESTADO DE LA TAREA.');
        }
    });
}
function anteriorEstado(idTarea, idEstado) {
    var envio = {
        "idTarea": idTarea,
        "idEstado": idEstado
    };
    $.ajax({
        data: envio, //datos que se envian a traves de ajax
        url: 'anteriorEstado', //constante que recibe la peticion
        type: 'get' //método de envio
    }).done(function (respuestaServidor) {
        if (parseInt(respuestaServidor) === 1) {
            location.href = "/sw2click/modulos/tareas/administracion";
        } else {
            alert('[ERROR].\n -NO SE HA PODIDO- REALIZAR EL CAMBIO DE ESTADO DE LA TAREA.');
        }
    });
}

function verNuevoEstado() {
    $.get('verNuevoEstado', {}, setFormulario);
}
function verDetalleEstado(idEstado) {
    $.get('verDetalleEstado', {idEstado: idEstado}, setFormulario);
}
function verEliminarEstado(idEstado) {
    $.get('verEliminarEstado', {idEstado: idEstado}, setFormulario);
}
function verActualizarEstado(idEstado) {
    $.get('verActualizarEstado', {idEstado: idEstado}, setFormulario);
}
function setFormularioEstado(datos) {
    if (datos !== '') {
        $("#divContenido").html(datos);
        $('#modalFormulario').modal('show');
    } else {
        alert('SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n POR FAVOR COMUNICARSE CON EL ADMINISTRADOR.');
    }
}
//                                 OT'S
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
        $.get('getClienteRes', {tipo: tipo, busqueda: $('#busqueda').val(), urlBusq: $('#urlBusq').val()}, setFormularioCliente);
    } else if (parseInt(tipo) === 0) {
        $.get('getClienteCorp', {tipo: tipo, busqueda: $('#busqueda').val(), urlBusq: $('#urlBusq').val()}, setFormularioCliente);
    }
    activarBloqueoAjax();
}
//==============================================================================
function setFormularioCliente(datos) {
    if (datos !== '') {
        $("#divAnexar").html(datos);
        $(document).ajaxStop($.unblockUI);
        $(document).ready(function () {
            oTable = $('#tabla').dataTable({
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
        alert('SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n POR FAVOR COMUNICARSE CON EL ADMINISTRADOR.');
    }
}
function clienteSeleccionado(idCliente, tipo) {
    $.get('getClienteAjax', {idCliente: idCliente, tipo: tipo}, setCliente, 'json');
}
function setCliente(respuestaServidor) {
    if (parseInt(respuestaServidor['error']) === 0) {
        $("#clienteseSeleccionadoDiv").html(respuestaServidor['html']);
        $("#modalAnexar").modal('hide');
    } else {
        alert('SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n POR FAVOR COMUNICARSE CON EL ADMINISTRADOR.');
    }
}
function mostrarClienteRes(idCliente, idTarea) {
    $.get('mostrarClienteRes', {idCliente: idCliente, idTarea: idTarea}, clienteModal, 'json');
}
function mostrarClienteCorp(idCliente, idTarea) {
    $.get('mostrarClienteCorp', {idCliente: idCliente, idTarea: idTarea}, clienteModal, 'json');
}
function clienteModal(respuestaServidor) {
    if (parseInt(respuestaServidor['error']) === 0) {
        $("#divContenido").html(respuestaServidor['html']);
        $("#modalFormulario").modal('show');
    } else {
        alert('SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n POR FAVOR COMUNICARSE CON EL ADMINISTRADOR.');
    }
}
function clienteAsociadoModButton() {
    switch ($("#btnMulti").val()) {
        case 'Eliminar Cliente':
            $("#btnMulti").val('Actualizar Cliente');
            $("#formularioCliente").attr('onsubmit', 'return actualizarCliente();');
            $("#formularioCliente").attr('action', 'updateCliente');
            break;
        case 'Actualizar Cliente':
            $("#btnMulti").val('Eliminar Cliente');
            $("#formularioCliente").attr('onsubmit', 'return eliminarCliente();');
            $("#formularioCliente").attr('action', 'deleteCliente');
            break;
        default :
            $("#btnMulti").val('Actualizar Cliente');
            $("#formularioCliente").attr('onsubmit', 'return actualizarCliente();');
            $("#formularioCliente").attr('action', 'updateCliente');
            break;
    }
}
function agregarClienteTarea(idTarea) {
    $.get('agregarClienteTarea', {idTarea: idTarea}, clienteAgregar);
}
function clienteAgregar(respuestaServidor) {
    if (respuestaServidor !== '') {
        $("#divContenido").html(respuestaServidor);
        $("#modalFormulario").modal('show');
    } else {
        alert('SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n POR FAVOR COMUNICARSE CON EL ADMINISTRADOR.');
    }
}
function setLimite() {
    if ($('#desde').val() !== '') {
        $('#hasta').removeAttr('readonly');
        $('#hasta').attr('min', $('#desde').val());
        $('#idEmpleado').removeAttr('disabled');
        var f = new Date();
        if (f.getMonth() < 10) {
            var cero = 0;
        }
        if (f.getDate() < 10) {
            var ceroDia = 0;
        }
        $('#hasta').attr('max', f.getFullYear() + '-' + cero + (f.getMonth() + 1) + '-' + ceroDia + f.getDate());
        $('#hasta').val(f.getFullYear() + '-' + cero + (f.getMonth() + 1) + '-' + ceroDia + f.getDate());
    }
}
function ocultarTarea(ban, typeTask) {
    var coloresPrioridad = {"baja": "#497F9C", "media": "#BA630B", "alta": "#FE2E2E", "terminada": "#088A08"};
    if (ban) {
        $(".tarea-prioridad-" + typeTask + "-hidden").each(function () {
            $(this).hide();
        });
        $("#" + typeTask).removeAttr('onclick', 'style');
        $("#" + typeTask).attr('onclick', "ocultarTarea(false, '" + typeTask + "');");
        $("#" + typeTask).attr('style', "background-color: #FFFFFF;");
    } else {
        $(".tarea-prioridad-" + typeTask + "-hidden").each(function () {
            $(this).show();
        });
        $("#" + typeTask).removeAttr('onclick', 'style');
        $("#" + typeTask).attr('onclick', "ocultarTarea(true, '" + typeTask + "');");
        $("#" + typeTask).attr('style', "background-color: " + coloresPrioridad[typeTask]);
    }
}
function hiddenActividades(ban, typeHidden) {
    if (ban) {
        $("#tarea" + typeHidden).hide();
        $("#tarea" + typeHidden + typeHidden).show();
    } else {
        $("#tarea" + typeHidden).show();
        $("#tarea" + typeHidden + typeHidden).hide();
    }
}
//------------------------------------------------------------------------------
function formularioClienteNew() {
    if ($("#idCliente").val() === "") {
        return false;
    }
    if ($("#tipoCliente").val() === "") {
        return false;
    }
    if (parseInt($("#idTarea").val()) <= 0) {
        return false;
    }
    if (!registerEmployeeNewAlert()) {
        return false;
    }
}
function guardarClienteNewAjax() {
    var parametrosVerificacion = {
        "idCliente": $("#idCliente").val(),
        "tipoCliente": $("#tipoCliente").val(),
        "idTarea": $("#idTarea").val()
    };
    $.ajax({
        data: parametrosVerificacion, //datos que se envian a traves de ajax
        dataType: "json", // formato
        url: 'crudCliente', //constante que recibe la peticion
        type: 'post' //método de envio
    }).done(function (typeError) {
        if (parseInt(typeError) === 0) {
            saveClienteAlert();
        } else {
            errorClienteAlert();
        }
    });
}
//------------------------------------------------------------------------------
function actualizarCliente() {
    if ($("#idCliente").val() === "") {
        return false;
    }
    if ($("#tipoCliente").val() === "") {
        return false;
    }
    if (parseInt($("#idTarea").val()) <= 0) {
        return false;
    }
    if (!updateEmployeeNewAlert()) {
        return false;
    }
}
function actualizarClienteOldAjax() {
    var parametrosVerificacion = {
        "idCliente": $("#idCliente").val(),
        "tipoCliente": $("#tipoCliente").val(),
        "idTarea": $("#idTarea").val()
    };
    $.ajax({
        data: parametrosVerificacion, //datos que se envian a traves de ajax
        dataType: "json", // formato
        url: 'crudCliente', //constante que recibe la peticion
        type: 'post' //método de envio
    }).done(function (typeError) {
        if (parseInt(typeError) === 0) {
            updateClienteAlert();
        } else {
            errorClienteAlert();
        }
    });
}

//------------------------------------------------------------------------------
function eliminarCliente() {
    if ($("#idCliente").val() === "") {
        return false;
    }
    if ($("#tipoCliente").val() === "") {
        return false;
    }
    if (parseInt($("#idTarea").val()) <= 0) {
        return false;
    }
    if (!deleteEmployeeNewAlert()) {
        return false;
    }
}
function eliminarClienteOldAjax() {
    var parametrosVerificacion = {
        "idCliente": 0,
        "tipoCliente": $("#tipoCliente").val(),
        "idTarea": $("#idTarea").val()
    };
    $.ajax({
        data: parametrosVerificacion, //datos que se envian a traves de ajax
        dataType: "json", // formato
        url: 'crudCliente', //constante que recibe la peticion
        type: 'post' //método de envio
    }).done(function (typeError) {
        if (parseInt(typeError) === 0) {
            deleteClienteAlert();
        } else {
            errorClienteAlert();
        }
    });
}
//------------------------------------------------------------------------------
function terminarTarea() {
    if (!finishHomeworkAlert()) {
        return false;
    }
}

function actualizarTarea() {
    if (!updateTareaAlert()) {
        return false;
    }
}
function updateTareaSubmit() {
    $("#formUpdate").removeAttr('onsubmit');
    $("#formUpdate").attr('action', 'update');
    $("#formUpdate").submit();
}
function eliminarTarea() {
    if (!deleteTareaAlert()) {
        return false;
    }
}
function deleteTareaSubmit() {
    $("#formDelete").removeAttr('onsubmit');
    $("#formDelete").attr('action', 'delete');
    $("#formDelete").submit();
}
function insertarTarea() {
    if (!insertTareaAlert()) {
        return false;
    }
}
function insertTareaSubmit() {
    $("#formInsert").removeAttr('onsubmit');
    $("#formInsert").attr('action', 'insert');
    $("#formInsert").submit();
}
function actualizarEstado() {
    if (!updateEstadoAlert()) {
        return false;
    }
}
function updateEstadoSubmit() {
    $("#formUpdateEstado").removeAttr('onsubmit');
    $("#formUpdateEstado").attr('action', 'updateEstado');
    $("#formUpdateEstado").submit();
}
function eliminarEstado() {
    if (!deleteEstadoAlert()) {
        return false;
    }
}
function deleteEstadoSubmit() {
    $("#formDeleteEstado").removeAttr('onsubmit');
    $("#formDeleteEstado").attr('action', 'deleteEstado');
    $("#formDeleteEstado").submit();
}

function insertarEstado() {
    if (!insertEstadoAlert()) {
        return false;
    }
}
function insertEstadoSubmit() {
    $("#formInsertEstado").removeAttr('onsubmit');
    $("#formInsertEstado").attr('action', 'insertEstado');
    $("#formInsertEstado").submit();
}
function darInforme(idTarea) {
    $.get('darInforme', {idTarea: idTarea}, setInforme);
}
function setInforme(respuestaServidor) {
    if (respuestaServidor !== '') {
        $("#divContenido").html(respuestaServidor);
        $('#modalFormulario').modal('show');
    } else {
        errorSystemAlert();
    }
}

function guardarInforme() {
    if (!saveInformeAlert()) {
        return false;
    }
}

function saveInformeAjax() {
    var parametrosVerificacion = {
        "observacion": $("#observacion").val(),
        "idTarea": $("#idTarea").val()
    };
    $.ajax({
        data: parametrosVerificacion, //datos que se envian a traves de ajax
        dataType: "json", // formato
        url: 'guardarInforme', //constante que recibe la peticion
        type: 'post' //método de envio
    }).done(function (typeError) {
        if (parseInt(typeError) === 0) {
            informeGuardadoAlert();
        }
        if (parseInt(typeError) === 1) {
            errorSystemAlert();
        }
        if (parseInt(typeError) === 2) {
            informeErrorAlert();
        }
        $('#modalFormulario').modal('hide');
    });
}
//##############################################################################
var dataAjax = {};
var idTarea = {};
function onPageLoad() {
    $(".column").sortable({
//                    delay: 1,
//                    disabled: true,
//                    dropOnEmpty: false,
//                    forceHelperSize: false,
//                    forcePlaceholderSize: true,
//                    grid: [1, 1],
        connectWith: ".column",
        placeholder: "highlight",
        distance: 1,
        opacity: 0.6,
        scroll: true,
        start: function (event, ui) {
            dataAjax['idTarea'] = ui.item[0]['id'];
            dataAjax['idEstadoOld'] = this.id;
        },
        stop: function (event, ui) {
            dataAjax['idEstadoNew'] = this.id;
        },
        update: function (event, ui) {
            dataAjax['idEstadoNew'] = this.id;
            if (dataAjax['idEstadoOld'] !== dataAjax['idEstadoNew']) {
                var idEstadoNew = dataAjax['idEstadoNew'].split('tareaSortable');
                var idEstadoOld = dataAjax['idEstadoOld'].split('tareaSortable');
                var data = {"idEstadoTarea": dataAjax['idTarea'] + '&&' + idEstadoNew[1]};
                idTarea['idTarea'] = dataAjax['idTarea'];
                console.log(data);
                $.ajax({
                    data: data, //datos que se envian a traves de ajax
                    dataType: "json", // formato
                    url: 'cambiarEstado', //constante que recibe la peticion
                    type: 'get' //método de envio
                }).done(function (typeError) {
                    if (parseInt(typeError) === 1) {
                        errorSystemAlert();
                        return false;
                    }
                });
                if (parseInt(idEstadoNew[1]) === 3) {
                    $.ajax({
                        data: idTarea, //datos que se envian a traves de ajax
                        dataType: "json", // formato
                        url: 'prioridadTarea', //constante que recibe la peticion
                        type: 'get' //método de envio
                    }).done(function (respuestaServidor) {
                        if (parseInt(respuestaServidor['error']) === 0) {
                            tareaTerminadaCSS(respuestaServidor['prioridad']);
                        } else {
                            errorSystemAlert();
                            return false;
                        }
                    });
                } else if (parseInt(idEstadoOld[1]) === 3) {
                    $.ajax({
                        data: idTarea, //datos que se envian a traves de ajax
                        dataType: "json", // formato
                        url: 'prioridadTarea', //constante que recibe la peticion
                        type: 'get' //método de envio
                    }).done(function (respuestaServidor) {
                        if (parseInt(respuestaServidor['error']) === 0) {
                            retomarCSS(respuestaServidor['prioridad']);
                        } else {
                            errorSystemAlert();
                            return false;
                        }
                    });
                }
            }
        }
    });
    var container;
    function tareaTerminadaCSS(prioridad) {
        $("#" + dataAjax['idTarea']).each(function () {
            container = $(this);
        });
        prioridad = prioridad.toLowerCase();
        container.find('.tarea-prioridad-' + prioridad)
                .removeClass('tarea-prioridad-' + prioridad)
                .addClass('tarea-terminada');

        container.find('.tarea-prioridad-' + prioridad + '-hidden')
                .removeClass('tarea-prioridad-' + prioridad + '-hidden')
                .addClass('tarea-prioridad-terminada-hidden');

        container.find('.on-tarea')
                .removeClass('on-tarea')
                .addClass('off-off')
                .attr('onclick', 'terminarTarea();')
                .attr('data-toggle', 'tooltip')
                .attr('title', 'Tarea terminada');
    }
    function retomarCSS(prioridad) {
        $("#" + dataAjax['idTarea']).each(function () {
            container = $(this);
        });
        prioridad = prioridad.toLowerCase();
        container.find('.tarea-terminada')
                .removeClass('tarea-terminada')
                .addClass('tarea-prioridad-' + prioridad);

        container.find('.tarea-prioridad-terminada-hidden')
                .removeClass('tarea-prioridad-terminada-hidden')
                .addClass('tarea-prioridad-' + prioridad + '-hidden');

        container.find('.off-off')
                .removeClass('off-off')
                .addClass('on-tarea')
                .attr('onclick', 'terminarTarea();')
                .attr('data-toggle', 'tooltip')
                .attr('title', 'Terminar tarea');
    }
    $(".column").disableSelection();
}

function reiniciarPagina() {
    var URLsearch = window.location.search;
    URLsearch = URLsearch.split('&');
    location.href = "/sw2click/modulos/tareas/administracion" + URLsearch[0] + '&idResponsable=&btnBuscar=Buscar';
}
