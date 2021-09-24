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
var globalAlertIdentificationVariable = 0;
function activateSystemError() {
    globalAlertIdentificationVariable = 2;
    swal.close();
    swal({
        title: "¡Error en el sistema!",
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
        title: "¡Pegar!",
        text: "Esta accion no esta permitida.",
        type: "error",
        timer: 3000,
        showConfirmButton: false,
        showCalcelButton: false
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
        html: '<h1>¡Entrada!</h1><br>' +
                '<h4>' + time + '</h4><br>' +
                '<h4>' + empleado + '</h4>',
        type: "success",
        timer: 3000,
        showConfirmButton: false,
        showCalcelButton: false
    });
}
function activateAlertSalida(empleado, time) {
    globalAlertIdentificationVariable = 2;
    swal.close();
    swal({
        html: '<h1>¡Salida!</h1><br>' +
                '<h4>' + time + '</h4><br>' +
                '<h4>' + empleado + '</h4>',
        type: "info",
        timer: 3000,
        showConfirmButton: false,
        showCalcelButton: false
    });
}
function activateAlertCodigoMalEscaneado() {
    globalAlertIdentificationVariable = 2;
    swal.close();
    swal({
        html: '<h3>¡Codigo mal escaneado!</h3>' +
                '<h6>Volver intentar...</h6>',
        type: "error",
        timer: 1000,
        showConfirmButton: false,
        showCalcelButton: false
    }).then(function () {
        messageCodeAlert();
    });
}
function activateAlertCodigoNoPermitido() {
    globalAlertIdentificationVariable = 2;
    swal.close();
    swal({
        html: '<h3>¡Codigo no permitido!</h3>' +
                '<h6>Escanea un codigo valido porfavor.</h6>',
        type: "error",
        timer: 3000,
        showConfirmButton: false,
        showCalcelButton: false
    });
}
function activateAlertClienteSinRegistros() {
    swal.close();
    swal({
        html: '<h3>¡Empleado sin registros de asistencia!</h3>' +
                '<h6>Intenta con otro</h6>',
        type: "error",
        timer: 3000,
        showConfirmButton: false,
        showCalcelButton: false
    });
}
function machineDidNotDetectTheCode() {
    globalAlertIdentificationVariable = 2;
    swal.close();
    swal({
        title: "¡Oops!",
        text: "El ordenador cliente no ha podido leer los datos de la máquina. Escanea tu codigo nueva mente porfavor",
        type: "error",
        timer: 3000,
        showConfirmButton: false,
        showCalcelButton: false
    });
}
//##############################################################################
function messageCodeAlert() {
    globalAlertIdentificationVariable = 1;
    swal.close();
    swal({
        title: '¡Escanear codigo!',
        html: '<input style="background-color: #A4A4A4; color: #A4A4A4;" class="swal2-input" onkeyup="pasteIntruderCode()" id="scannedCodeId" value="" placeholder="Ingrese aqui tu codigo...">',
        timer: 1000,
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
        if (string.indexOf("'") === -1) {
            if (!activateAlertCodigoNoPermitido()) {
                document.getElementById("codigoNoPermitido").play();
                return false;
            }
        }
        var parte = code.split("'");
        var parametrosVerificacion = {
            "idEmpleado": parte[0],
            "cedula": parte[1]
        };
        $.ajax({
            data: parametrosVerificacion, //datos que se envian a traves de ajax
            url: 'verificarCodigo', //constante que recibe la peticion
            type: 'post' //método de envio
        }).done(function (tipoError) {
            if (parseInt(tipoError) === 0) {
                var parametros = {
                    "code1": 136,
                    "code2": parte[0],
                    "code3": parte[1],
                    "code4": 223
                };
                $.ajax({
                    data: parametros, //datos que se envian a traves de ajax
                    dataType: "json", // formato
                    url: 'registrosAcceso', //constante que recibe la peticion
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
    $("#divContenido").html(datos);
    $('#modalFormulario').modal('show');
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
