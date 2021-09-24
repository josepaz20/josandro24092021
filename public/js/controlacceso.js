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

function activateEmptyError() {
    swal({
        title: " HAY CAMPOS VACIOS!",
        text: "Se encontro campos vacios en el formulario.",
        type: "error",
        timer: 3000,
        showConfirmButton: false,
        showCancelButton: false
    });
}

function activateSelectField() {
    swal({
        title: " SELECCIONA UN FILTRO DE BUSQUEDA!",
        text: "Se encontro campos vacios en el formulario.",
        type: "error",
        timer: 3000,
        showConfirmButton: false,
        showCancelButton: false
    });
}

var globalAlertIdentificationVariable = 0;
function activateSystemError() {
    globalAlertIdentificationVariable = 2;
    swal.close();
    swal({
        title: " Error en el sistema!",
        text: "Se ha presentado un error en el sistema. Porfavor comunicarse con el administrador del sistema.",
        type: "error",
        timer: 3000,
        showConfirmButton: false
    });
}
function activatePasteError() {
    globalAlertIdentificationVariable = 2;
    swal.close();
    swal({
        title: " Pegar!",
        text: "Esta accion no esta permitida.",
        type: "error",
        timer: 3000,
        showConfirmButton: false,
        showCancelButton: false
    });
}
function pasteIntruderCode() {
    $("#scannedCodeId").on('paste', function (e) {
        e.preventDefault();
        if (!activatePasteError()) {
            return false;
        }
    });
}
//##############################################################################
//                                ALERTAS DE CODIGO ESCANEADO
//##############################################################################
function activateAlertEntrada(empleado, time) {
    globalAlertIdentificationVariable = 2;
    swal.close();
    swal({
        html: '<h1> Entrada!</h1><br>' +
                '<h4>' + time + '</h4><br>' +
                '<h4>' + empleado + '</h4>',
        type: "success",
        timer: 5000,
        showConfirmButton: false,
        showCancelButton: false
    });
}
function activateAlertSalida(empleado, time) {
    globalAlertIdentificationVariable = 2;
    swal.close();
    swal({
        html: '<h1> Salida!</h1><br>' +
                '<h4>' + time + '</h4><br>' +
                '<h4>' + empleado + '</h4>',
        type: "info",
        timer: 5000,
        showConfirmButton: false,
        showCancelButton: false
    });
}
function activateAlertCodigoMalEscaneado() {
    globalAlertIdentificationVariable = 2;
    swal.close();
    swal({
        html: '<h3> Codigo mal escaneado!</h3>' +
                '<h6>Volver intentar...</h6>',
        type: "error",
        timer: 2000,
        showConfirmButton: false,
        showCancelButton: false
    }).then(function () {
        messageCodeAlert();
    });
}
function activateAlertCodigoNoPermitido() {
    globalAlertIdentificationVariable = 2;
    swal.close();
    swal({
        html: '<h3> Codigo no permitido!</h3>' +
                '<h6>Escanea un codigo valido porfavor.</h6>',
        type: "error",
        timer: 3000,
        showConfirmButton: false,
        showCancelButton: false
    });
}
function activateAlertClienteSinRegistros() {
    swal.close();
    swal({
        html: '<h3> Empleado sin registros de asistencia!</h3>' +
                '<h6>Intenta con otro</h6>',
        type: "error",
        timer: 3000,
        showConfirmButton: false,
        showCancelButton: false
    });
}
function machineDidNotDetectTheCode() {
    globalAlertIdentificationVariable = 2;
    swal.close();
    swal({
        title: " Oops!",
        text: "El ordenador cliente no ha podido leer los datos de la maquina. Escanea tu codigo nueva mente porfavor",
        type: "error",
        timer: 3000,
        showConfirmButton: false,
        showCancelButton: false
    });
}
//##############################################################################
function messageCodeAlert() {
    globalAlertIdentificationVariable = 1;
    swal.close();
    swal({
        title: ' Escanear codigo!',
        html: '<input style="background-color: #A4A4A4; color: #A4A4A4;" class="swal2-input" onkeyup="pasteIntruderCode()" id="scannedCodeId" value="" placeholder="Ingrese aqui tu codigo...">',
        timer: 2000,
        imageUrl: 'https://cdn.iconscout.com/public/images/icon/premium/png-512/barcode-tag-price-code-upc-3873b15b8d14ace0-512x512.png',
//        imageUrl: 'https://freeiconshop.com/wp-content/uploads/edd/upload-cloud-flat.png',
//        imageUrl: 'https://cdn3.iconfinder.com/data/icons/cloudcon-colored/512/upload-512.png',
//        imageUrl: 'https://www.shareicon.net/download/2016/09/29/837309_arrow_512x512.png',
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: 'Custom image',
        showCancelButton: false,
        showConfirmButton: false,
    }).then(function () {
        if ($("#scannedCodeId").val() !== '') {
            $("#permanentlySavedCode").val('');
            $("#permanentlySavedCode").val($("#scannedCodeId").val());
            analyzeCodeInaHiddenWay($("#permanentlySavedCode").val());
        } else {
            if ($("#scannedCodeId").val() === '') {
                document.getElementById("codigoMalEscaneado").play();
                machineDidNotDetectTheCode();
            }
        }
    });
}
function analyzeCodeInaHiddenWay(code) {
    if (code.length > 0) {
        var string = code.trim();
        $.ajax({
            data: {"cedula": string}, //datos que se envian a traves de ajax
            url: 'verificarCodigo', //constante que recibe la peticion
            type: 'post' //método de envio
        }).done(function (tipoError) {
            if (parseInt(tipoError) === 0) {
                $.ajax({
                    data: {"code3": string}, //datos que se envian a traves de ajax
                    dataType: "json", // formato
                    url: 'registrarEntradaSalida', //constante que recibe la peticion
                    type: 'post' //método de envio
                }).done(function (typeOfanswer) {
                    if (parseInt(typeOfanswer['error']) === 2) {
                        document.getElementById("audioRecordEntry").play();
                        if (!activateAlertEntrada(typeOfanswer['nombreCompleto'], typeOfanswer['time'])) {
                            return false;
                        }
                    }
                    if (parseInt(typeOfanswer['error']) === 3) {
                        document.getElementById("audioOutputLog").play();
                        if (!activateAlertSalida(typeOfanswer['nombreCompleto'], typeOfanswer['time'])) {
                            return false;
                        }
                    }
                    if (parseInt(typeOfanswer['error']) === 8) {
                        document.getElementById("errorEnElSistema").play();
                        if (!activateSystemError()) {
                            return false;
                        }
                    }
                });
            } else {
                document.getElementById("codigoMalEscaneado").play();
                activateAlertCodigoMalEscaneado();
            }
        });
    } else {
        document.getElementById("codigoMalEscaneado").play();
        machineDidNotDetectTheCode();
    }
}
function verDetalle(idRegistro, idEmpleado) {
    $.get('verDetalle', {idRegistro: idRegistro, idEmpleado: idEmpleado}, setFormulario);
}
function setFormulario(datos) {
    if (datos !== '') {
        $("#divContenido").html(datos);
        $('#modalFormulario').modal('show');
    } else {
        activateSystemError();
    }
}
function setLimite() {
    var cero = '';
    var ceroDia = '';
    var f = new Date();
    if (f.getMonth() < 9) {
        cero = 0;
    }
    if (f.getDate() < 9) {
        ceroDia = 0;
    }
    $('#desde').attr('max', f.getFullYear() + '-' + cero + (f.getMonth() + 1) + '-' + ceroDia + f.getDate());
    if ($('#desde').val() !== '') {
        $('#hasta').removeAttr('readonly');
        $('#hasta').attr('min', $('#desde').val());
        $('#hasta').attr('max', f.getFullYear() + '-' + cero + (f.getMonth() + 1) + '-' + ceroDia + f.getDate());
        $('#hasta').val(f.getFullYear() + '-' + cero + (f.getMonth() + 1) + '-' + ceroDia + f.getDate());
    }
}
function tipoDeDescarga() {
    if (parseInt($("#idAvanzadoSelect").val()) === 0) {
        $("#listEmpleadoDIV").show('fast');
    }
    if (parseInt($("#idAvanzadoSelect").val()) === 1) {
        $("#listEmpleadoDIV").hide('fast');
    }
}
function validarFormulario() {
    if ($("#desde").val() === '') {
        swal.close();
        swal({
            title: "!Seleccionar fecha!",
            text: "Debes seleccionar una fecha desde y hasta para saber la amplitud del reporte.",
            type: "warning",
            timer: 2000,
            showConfirmButton: false
        });
        return false;
    }
    if ($("#idAvanzadoSelect").val() === '') {
        swal.close();
        swal({
            title: "!Seleccionar opcion avanzada!",
            text: "Debes seleccionar una opcion avanzada.",
            type: "warning",
            timer: 2000,
            showConfirmButton: false
        });
        return false;
    }
    if (parseInt($("#idAvanzadoSelect").val()) === 0) {
        if ($("#idEmpleado").val() === '') {
            swal.close();
            swal({
                title: "!Seleccionar empleado!",
                text: "Debes seleccionar un empleado para generar un reporte.",
                type: "warning",
                timer: 2000,
                showConfirmButton: false
            });
            return false;
        }
        verificarDescargaReporte();
        return false;
    }
    if (parseInt($("#idAvanzadoSelect").val()) === 1) {
        if (!confirmarFormulario()) {
            return false;
        }
    }
}
function verificarDescargaReporte() {
    var parametros = {
        "idEmpleado": $("#idEmpleado").val(),
        "desde": $("#desde").val(),
        "hasta": $("#hasta").val()
    };
    $.ajax({
        data: parametros, //datos que se envian a traves de ajax        
        url: 'verificarDescargaReporte', //constante que recibe la peticion
        type: 'post' //método de envio
    }).done(function (typeOfError) {
        if (parseInt(typeOfError) === 1) {
            confirmarFormulario();
            return false;
        }
        if (parseInt(typeOfError) === 2) {
            activateAlertClienteSinRegistros();
            return false;
        }
        if (parseInt(typeOfError) === 0) {
            document.getElementById("errorEnElSistema").play();
            activateSystemError();
            return false;
        }
    });
}
function confirmarFormulario() {
    swal.close();
    swal({
        title: "¿Estás seguro?",
        text: "Que desea descargar este reporte...",
        showCancelButton: true,
        cancelButtonColor: "#FA5858",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#04B45F",
        confirmButtonText: " Descargar",
        imageUrl: 'http://icons.iconarchive.com/icons/janosch500/tropical-waters-folders/512/Downloads-icon.png',
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: 'Custom image',
        closeOnConfirm: false,
    }).then(function (result) {
        if (result.value) {
            $('#frmReporte').removeAttr('onsubmit');
            if (parseInt($("#idAvanzadoSelect").val()) === 0) {
                $('#frmReporte').attr('action', 'generarReporte');
            }
            if (parseInt($("#idAvanzadoSelect").val()) === 1) {
                $('#frmReporte').attr('action', 'generarReporteTodo');
            }
            $('#frmReporte').submit();
            $('#frmReporte').attr('onsubmit', 'return validarFormulario();');
            return false;
        } else {
            return false;
        }
    });
}

/*
 * HORARIOS(LLAMADOS AJAX, FUNCIONES JAVASCRIPT, VALIDCIONES FROND END) 
 * 
 */

//------------------------------------------------------------------------------

function verDetalleHorario(idHorario) {
    $.get('verDetalleHorario', {idHorario: idHorario}, setFormularioHorario, 'json');
    activarBloqueoAjax();
}
function verEliminarHorario(idHorario) {
    $.get('verEliminarHorario', {idHorario: idHorario}, setFormularioHorario, 'json');
    activarBloqueoAjax();
}
function verActualizarHorario(idHorario) {
    $.get('verActualizarHorario', {idHorario: idHorario}, setFormularioHorario, 'json');
    activarBloqueoAjax();
}
function setFormularioHorario(respuestaServidor) {
    if (respuestaServidor['error'] === 0) {
        $('#divContenido').html(respuestaServidor['html']);
        $('#modalFormulario').modal('show');
    } else {
        activateSystemError();
    }
}

function validarFormHorario(desde) {
    if ($('#idEmpleadoForm').val() === '' || $('#idHorario').val() === '') {
        activateEmptyError();
        return false;
    }
    if (!formHorarioAlert(desde)) {
        return false;
    }
}
function formHorarioAlert(desde) {
    if (desde === 'actualizar') {
        if ($("#entrada1Form").val() === '' || $("#salida1Form").val() === '' || $("#entrada2Form").val() === '' || $("#salida2Form").val() === '' || $("#desdeForm").val() === '' || $("#hastaForm").val() === '') {
            swal({
                title: '¡HAY CAMPOS VACIOS!',
                text: 'Estas seguro que desea actualizar este horario aun con estos campos vacios.',
                imageUrl: 'http://icons-for-free.com/free-icons/png/512/285657.png',
                imageWidth: 100,
                imageHeight: 100,
                imageAlt: 'Custom image',
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonClass: "btn-success",
                confirmButtonText: "Si, Actualizar",
                cancelButtonText: "No, Cancelar",
                closeOnConfirm: false,
                closeOnCancel: false
            }).then(function (result) {
                if (result.value) {
                    $("#formHorarioJIS").attr('action', 'updateHorario');
                    $("#formHorarioJIS").removeAttr('onsubmit');
                    $("#formHorarioJIS").submit();
                } else {
                    return false;
                }
            });
        } else {
            swal({
                title: '¡ACTULIZAR!',
                text: 'Estas seguro que desea actualizar este horario.',
                imageUrl: 'http://icons-for-free.com/free-icons/png/512/285657.png',
                imageWidth: 100,
                imageHeight: 100,
                imageAlt: 'Custom image',
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonClass: "btn-success",
                confirmButtonText: "Si, Actualizar",
                cancelButtonText: "No, Cancelar",
                closeOnConfirm: false,
                closeOnCancel: false
            }).then(function (result) {
                if (result.value) {
                    $("#formHorarioJIS").attr('action', 'updateHorario');
                    $("#formHorarioJIS").removeAttr('onsubmit');
                    $("#formHorarioJIS").submit();
                } else {
                    return false;
                }
            });
        }
    }
    if (desde === 'eliminar') {
        swal.close();
        swal({
            title: '¡Eliminar!',
            text: 'Esta seguro que desea eliminar este horario.',
            type: 'error',
            imageAlt: 'Custom image',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Si, Eliminar",
            cancelButtonText: "No, Cancelar",
            closeOnConfirm: false,
            closeOnCancel: false
        }).then(function (result) {
            if (result.value) {
                $("#formHorarioJIS").attr('action', 'deleteHorario');
                $("#formHorarioJIS").removeAttr('onsubmit');
                $("#formHorarioJIS").submit();
            } else {
                return false;
            }
        });
    }
}

function setFechaHorario() {
    if ($("#desde").val() !== '') {
        $("#hasta").removeAttr('readonly');
        $("#hasta").attr('required', 'true');
    }
}
function validarFormRegistro() {
    if ($("#entrada1").val() === '' || $("#salida1").val() === '' || $('#idEmpleado').val() === '') {
        activateEmptyError();
        return false;
    }
    if (!formHorarioCreateAlert()) {
        return false;
    }
}
function formHorarioCreateAlert(desde) {
    if ($("#entrada2").val() === '' || $("#salida2").val() === '' || $("#desde").val() === '' || $("#hasta").val() === '') {
        swal({
            title: '¡HAY CAMPOS VACIOS!',
            text: 'Esta seguro que desea guardar este horario aun con estos campos vacios.',
            imageUrl: 'http://icons-for-free.com/free-icons/png/512/285657.png',
            imageWidth: 100,
            imageHeight: 100,
            imageAlt: 'Custom image',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonClass: "btn-success",
            confirmButtonText: "Si, Guardar",
            cancelButtonText: "No, Cancelar",
            closeOnConfirm: false,
            closeOnCancel: false
        }).then(function (result) {
            if (result.value) {
                $("#formHorario").attr('action', 'registrarHorario');
                $("#formHorario").removeAttr('onsubmit');
                $("#formHorario").submit();
            } else {
                return false;
            }
        });
    } else {
        swal({
            title: '¡GUARDAR!',
            text: 'Esta seguro que desea guardar este horario.',
            imageUrl: 'http://icons-for-free.com/free-icons/png/512/285657.png',
            imageWidth: 100,
            imageHeight: 100,
            imageAlt: 'Custom image',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonClass: "btn-success",
            confirmButtonText: "Si, Guardar",
            cancelButtonText: "No, Cancelar",
            closeOnConfirm: false,
            closeOnCancel: false
        }).then(function (result) {
            if (result.value) {
                $("#formHorario").attr('action', 'registrarHorario');
                $("#formHorario").removeAttr('onsubmit');
                $("#formHorario").submit();
            } else {
                return false;
            }
        });
    }
}

function validarFormBusqueda() {
    if (!validarBusquedaAlert()) {
        return false;
    }
}
function validarBusquedaAlert() {
    var values = '';
    $('#formHorario input').each(function () {
        if ($(this).val() !== '') {
            values += $(this).val();
        }
    });
    values += $('#idEmpleado').val();
    if (values !== '') {
        swal({
            title: '¡BUSCAR!',
            text: 'Esta seguro que desea realizar esta busqueda.',
            type: 'info',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonClass: "btn-success",
            confirmButtonText: "Si, Buscar",
            cancelButtonText: "No, Cancelar",
            closeOnConfirm: false,
            closeOnCancel: false
        }).then(function (result) {
            if (result.value) {
                $("#formHorario").attr('action', 'horario');
                $("#formHorario").removeAttr('onsubmit');
                $("#formHorario").submit();
            } else {
                return false;
            }
        });
    } else {
        activateSelectField();
    }
}
function refrescarPage() {
    if (!refrescarPageNext()) {
        return false;
    }
}
function refrescarPageNext() {
    swal({
        title: '¡REFRESCAR PAGINA!',
        type: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonClass: "btn-success",
        confirmButtonText: "Si, Refrescar",
        cancelButtonText: "No, Cancelar",
        closeOnConfirm: false,
        closeOnCancel: false
    }).then(function (result) {
        if (result.value) {
            location.href = "/sw2click/modulos/controlacceso/horario";
        } else {
            return false;
        }
    });
}


function horarioMultipleBtn(desde) {
    if (!horarioMultipleBtnAlert(desde)) {
        return false;
    }
}
function horarioMultipleBtnAlert(desde) {
    if ($('#idEmpleado').val() === '') {
        activateEmptyError();
        return false;
    }
    if (desde === 'actualizar') {
        if ($("#entrada1").val() === '' || $("#salida1").val() === '' || $("#desde").val() === '' || $("#hasta").val() === '') {
            activateEmptyError();
            return false;
        }

        swal({
            title: '¡ACTULIZAR!',
            text: 'Estas seguro que desea actualizar estos horarios.',
            imageUrl: 'http://icons-for-free.com/free-icons/png/512/285657.png',
            imageWidth: 100,
            imageHeight: 100,
            imageAlt: 'Custom image',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonClass: "btn-success",
            confirmButtonText: "Si, Actualizar",
            cancelButtonText: "No, Cancelar",
            closeOnConfirm: false,
            closeOnCancel: false
        }).then(function (result) {
            if (result.value) {
                $("#formHorario").attr('action', 'updateHorario');
                $("#formHorario").removeAttr('onsubmit');
                $("#formHorario").attr('method', 'POST');
                $("#formHorario").submit();
            } else {
                return false;
            }
        });
    }

    if (desde === 'eliminar') {
        swal.close();
        swal({
            title: '¡Eliminar!',
            text: 'Esta seguro que desea eliminar este horario.',
            type: 'error',
            imageAlt: 'Custom image',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Si, Eliminar",
            cancelButtonText: "No, Cancelar",
            closeOnConfirm: false,
            closeOnCancel: false
        }).then(function (result) {
            if (result.value) {
                $("#formHorario").attr('action', 'deleteHorario');
                $("#formHorario").removeAttr('onsubmit');
                $("#formHorario").submit();
            } else {
                return false;
            }
        });
    }
}

//------------------------------------------------------------------------------