
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

function verRegistrarOportunidad() {
    $("#tituloModal").html(' <i class="fa fa-user"></i> - REGISTRO DE OPORTUNIDAD');
    $.get('registrarOportunidad', {}, setFormulario, 'json');
    activarBloqueoAjax();
}
function verRegistrarSolicitud() {
    $("#tituloModal").html(' <i class="fa fa-user"></i> - REGISTRO DE SOLICITUD');
    $.get('registrarSolicitud', {}, setFormulario, 'json');
    activarBloqueoAjax();
}
function verActualizar(idOportunidad) {
    $.get('actualizar', {idOportunidad: idOportunidad}, setFormulario, 'json');
    activarBloqueoAjax();
}
function verEliminar(idOportunidad) {
    $.get('eliminar', {idOportunidad: idOportunidad}, setFormulario, 'json');
    activarBloqueoAjax();
}
function verDetalle(idOportunidad) {
    $.get('detalle', {idOportunidad: idOportunidad}, setFormulario, 'json');
    activarBloqueoAjax();
}
function responderViabilidad(idViabilidad) {
    $.get('confirmarViabilidad', {idViabilidad: idViabilidad}, setFormulario, 'json');
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
function tipoCliente() {
    if ($("#tipocliente").val() === 'Persona Juridica') {
        $("#personaNatural").attr("hidden", "hidden");
        $("#sexo").attr("hidden", "hidden");
        $("#personaJuridica").removeAttr("hidden");
        $("#nombres").removeAttr("required");
        $("#razonsocial").attr("required", "required");
    } else if ($("#tipocliente").val() === 'Persona Natural') {
        $("#personaNatural").removeAttr("hidden");
        $("#sexo").removeAttr("hidden");
        $("#personaJuridica").attr("hidden", "hidden");
        $("#nombres").attr("required", "required");
        $("#razonsocial").removeAttr("required");
    } else {
        $("#personaNatural").attr("hidden", "hidden");
        $("#personaJuridica").attr("hidden", "hidden");
    }
}
function getMunicipios(idDpto) {
    if (idDpto !== '') {
        $.get("getMcpos", {idDpto: idDpto}, mostrarMcpos);
        activarBloqueoAjax();
    } else {
        $("#idMunicipio").val('');
        $("#idMunicipio").attr("disabled", "disabled");
        alert("[ X ] NO SE ENCONTRO MUNICIPIOS PARA ESTE DEPARTAMENTO");
    }
}

function mostrarMcpos(mcpos) {
    $("#idMunicipio").removeAttr("disabled");
    $("#idMunicipio").html(mcpos);
}

//==============================================================================
//                                CHAT OPORTUNIDAD
//==============================================================================

function abrirChat(idOportunidad) {
    $.get('abrirChat', {idOportunidad: idOportunidad}, setChat, 'json');
}
function setChat(datos) {
    if (datos['error'] === 0) {
        if (datos['chat'] !== "") {
            $("#divContenido").html(datos['chat']);
            $("#modalFormulario").modal('show');
        } else {
            alert(" NO SE ENCONTRO MENSAJES DISPONIBLES PARA ESTE CHAT.");
        }
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function crearChat(chat, adjuntos, desde, cant_mensajes) {
    window.location = "#openModal";
    $("#cant_mensajes").html(cant_mensajes + " Mensajes");
    $("#container_all_chats").html("");
    $.each(chat, function (i, item) {
        if (i === 0) {
            $("#nombre_cliente_chat").html(item["nombres"] + " " + item["apellidos"]);
            $("#idOportunidad").html(item["idOportunidad"]);
            $("#idIncidente").html(item["idIncidente"]);
        }
        if (desde === item["registradopormsj"]) {
            $("#container_all_chats").append(
                    `<div class="d-flex justify-content-end mb-4">
                <div class="msg_cotainer_send" id="">
                `
                    + item["texto"] +
                    `
                <span class="msg_time_send">
                    `
                    + item["fechahoraregmsj"] +
                    `
                </span>
                </div>
                <div class="img_cont_msg">
                <img src="../../public/img/user2.png" class="rounded-circle user_img_msg">
                </div>
                </div>
                `
                    );
            for (i in adjuntos) {
                if (parseInt(adjuntos[i]["idMensaje"]) === parseInt(item["idMensaje"])) {
                    if (adjuntos[i]["extencion"] === 'jpg' || adjuntos[i]["extencion"] === 'jpeg' || adjuntos[i]["extencion"] === 'png') {
                        txtAdjuntos = "&nbsp <a href='verAdjuntoMensaje?idAdjunto=" + adjuntos[i]["idAdjunto"] + "&origen=1' target='_blank' </a>";
                    } else if (adjuntos[i]["extencion"] === 'pdf') {
                        txtAdjuntos = "&nbsp <a href='verAdjuntoMensaje?idAdjunto=" + adjuntos[i]["idAdjunto"] + "&origen=1' target='_blank' </a>";
                    } else if (adjuntos[i]["extencion"] === 'rar' || adjuntos[i]["extencion"] === 'zip') {
                        txtAdjuntos = "&nbsp <a href='verAdjuntoMensaje?idAdjunto=" + adjuntos[i]["idAdjunto"] + "&origen=1' </a>";
                    } else {
                        txtAdjuntos = "&nbsp <a href='verAdjuntoMensaje?idAdjunto=" + adjuntos[i]["idAdjunto"] + "&origen=1'></a>";
                    }


                    $("#container_all_chats").append(
                            `<div class="d-flex justify-content-end mb-4">
                            <div class="msg_cotainer_send" id="">
                            `
                            + txtAdjuntos + " " + adjuntos[i]["nombreArchivo"] +
                            `
                            <span class="msg_time_send">
                                `
                            + adjuntos[i]["extencion"] +
                            `
                            </span>
                            </div>
                            <div class="img_cont_msg">
                            <img src="../../public/img/adjunto.png" class="rounded-circle user_img_msg">
                            </div>
                            </div>
                            `
                            );
                }
            }

        } else {
            $("#container_all_chats").append(
                    `<div class="d-flex justify-content-start mb-4">
                            <div class="img_cont_msg">
                            <img src="../../public/img/adjunto.png" class="rounded-circle user_img_msg">
                            </div>
                            <div class="msg_cotainer">
                            `
                    + item["texto"] +
                    `
                            <span class="msg_time">
                                `
                    + item["fechahoraregmsj"] + " - " + item["registradopormsj"] +
                    `
                            </span>
                            </div>
                            </div>
                            `
                    );
            for (i in adjuntos) {
                if (parseInt(adjuntos[i]["idMensaje"]) === parseInt(item["idMensaje"])) {
                    if (adjuntos[i]["extencion"] === 'jpg' || adjuntos[i]["extencion"] === 'jpeg' || adjuntos[i]["extencion"] === 'png') {
                        txtAdjuntos = "&nbsp <a href='verAdjuntoMensaje?idAdjunto=" + adjuntos[i]["idAdjunto"] + "&origen=1' target='_blank' </a>";
                    } else if (adjuntos[i]["extencion"] === 'pdf') {
                        txtAdjuntos = "&nbsp <a href='verAdjuntoMensaje?idAdjunto=" + adjuntos[i]["idAdjunto"] + "&origen=1' target='_blank' </a>";
                    } else if (adjuntos[i]["extencion"] === 'rar' || adjuntos[i]["extencion"] === 'zip') {
                        txtAdjuntos = "&nbsp <a href='verAdjuntoMensaje?idAdjunto=" + adjuntos[i]["idAdjunto"] + "&origen=1' </a>";
                    } else {
                        txtAdjuntos = "&nbsp <a href='verAdjuntoMensaje?idAdjunto=" + adjuntos[i]["idAdjunto"] + "&origen=1'></a>";
                    }

                    $("#container_all_chats").append(
                            `<div class="d-flex justify-content-start mb-4">
                                <div class="img_cont_msg">
                                <img src="../../public/img/user.png" class="rounded-circle user_img_msg">
                                </div>
                                <div class="msg_cotainer">
                                `
                            + txtAdjuntos + " " + adjuntos[i]["nombreArchivo"] +
                            `
                                <span class="msg_time">
                                    `
                            + adjuntos[i]["extencion"] +
                            `
                                </span>
                                </div>
                                </div>
                                `
                            );
                }
            }

        }
        var desplaza = $(".msg_card_body")[0].scrollHeight;
        $(".msg_card_body").animate({
            scrollTop: desplaza
        }, 60);
    });
}

function validarRespuesta() {
    var respuesta = $.trim($("#respuesta").val());
    if (respuesta !== '') {
        if (confirm("¿ DESEA  << ENVIAR >>  ESTE MENSAJE ?")) {
            var formulario = new FormData();
            var i = 0;
            $("#divArchivosAdjuntos input:file").each(function () {
                formulario.append('fileAdjunto_' + i, this.files[0]);
                i++;
            });
            formulario.append('contArchivos', i);
            formulario.append('texto', respuesta);
            formulario.append('idOportunidad', $("#idOportunidad").html());
            formulario.append('idIncidente', $("#idIncidente").html());
            $("#tablaAdjuntos_backgroundOscuro").attr("hidden", "hidden");
            $.ajax({
                url: 'responder',
                type: 'POST',
                contentType: false,
                data: formulario,
                dataType: "json",
                processData: false,
                cache: false
            }).done(function (msg) {
                $("#divArchivosAdjuntos input:file").each(function () {
                    $(this).remove();
                });
                $("#contArchivos").val(0);
                $("#numArchivos").val(0);
                $("#nuevoMensaje").val('');
                $("#listaAdjuntos").html('');
                $("#listaOrdenes").html('');

                var f = new Date();
                cad = f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds();
                if (msg["error"] === 0) {
                    $("#container_all_chats").append(
                            `<div class="d-flex justify-content-end mb-4">
                                <div class="msg_cotainer_send">
                                `
                            + respuesta +
                            `
                                <span class="msg_time_send">
                                    `
                            + cad + " - " + "yo" +
                            `
                                </span>
                                </div>
                                <div class="img_cont_msg">
                                <img src="../../public/img/user2.png" class="rounded-circle user_img_msg">
                                </div>
                                </div>
                                `
                            );
                    var desplaza = $(".msg_card_body")[0].scrollHeight;
                    $(".msg_card_body").animate({
                        scrollTop: desplaza
                    }, 60);
                    if (msg["mensaje"] !== "") {
                        alert(msg["mensaje"]);
                    }
                    $("#respuesta").val("");
                } else {
                    alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
                }
            });
        }
    } else {
        alert("DEBE ESCRIBIR ALGO EN EL MENSAJE. \n\nNO ES POSIBLE ENVIAR UN MENSAJE VACIO ");
        $("#respuesta").focus();
        return;
    }
}

function adjuntarArchivo() {
    var contArchivos = $("#contArchivos").val();
    var numArchivos = $("#numArchivos").val();
    if (numArchivos >= 5) {
        alert('  USTED ALCANZO EL LIMITE DE ARCHIVOS ADJUNTOS ! ! !. \n\n  NO ES POSIBLE ADJUNTAR MAS ARCHIVOS');
        return;
    }
    var nuevoAdjunto = "<input type='file' id='archivoAdjunto_" + contArchivos + "' onchange='setArchivoCargado(this.id)'>";
    $("#divArchivosAdjuntos").append(nuevoAdjunto);
    $("#archivoAdjunto_" + contArchivos).click();
    contArchivos++;
    numArchivos++;
    $("#contArchivos").val(contArchivos);
    $("#numArchivos").val(numArchivos);
}
function setArchivoCargado(id) {
    $("#tablaAdjuntos_backgroundOscuro").removeAttr("hidden");
    var infoAdjunto = "<li>" + $("#" + id).val().replace(/.*(\/|\\)/, '') + " -- [ <a href='#' onclick='return eliminarAdjunto(" + id + ", this); return false;' style='color: #00F'>X</a> ]</li>";
    $("#listaAdjuntos").append(infoAdjunto);
}
function eliminarAdjunto(id, padre) {
    $(id).remove();
    $(padre).parent().remove();
    var numArchivos = $("#numArchivos").val();
    numArchivos--;
    $("#numArchivos").val(numArchivos);
    if (parseInt(numArchivos) === 0) {
        $("#tablaAdjuntos_backgroundOscuro").attr("hidden", "hidden");
    }
    return false;
}

function abrirCerrarFieldset(abrirCerrar) {
    var $BOX_PANEL = $(abrirCerrar).closest("fieldset"),
            $ICON = $(abrirCerrar).find("i"),
            $BOX_CONTENT = $BOX_PANEL.find(".colapseFieldset");
    $BOX_CONTENT.slideToggle(500);
    $BOX_PANEL.css("height", "auto");
    $ICON.toggleClass("fa-chevron-up fa-chevron-down");
}

function registrarMensaje() {
    var viabilidad = 0;
    if ($('#viabilidad').is(':checked')) {
        $("#texto").val('VIABILIDAD: ' + $("#coordenadas").val() + ' -- ' + $("#tecnologia").val());
        viabilidad = 1;
    }
    var msg = $.trim($("#texto").val());
    var tipomensaje = $("#tipomensaje").val();
    if (msg !== '' && tipomensaje !== '') {
        var msgConfirm = "¿ DESEA  << REGISTRAR >>  ESTE MENSAJE ?";
        if ($("#estado").val() === 'Solucionado') {
            msgConfirm = " EL PRESENTE TICKET YA ESTA SOLUCIONADO \n SI USTED REGISTRA ESTE MENSAJE EL TICKET VOLVERA A ESTADO EN PROCESO. \n\n ¿ DESEA  << REGISTRAR >>  ESTE MENSAJE ?";
        }
        if (confirm(msgConfirm)) {
            var formulario = new FormData();
            formulario.append('idOportunidad', $("#idOportunidad").val());
            formulario.append('idIncidente', $("#idIncidente").val());
            formulario.append('texto', msg);
            formulario.append('tipomensaje', $("#tipomensaje").val());
            formulario.append('viabilidad', viabilidad);
            formulario.append('coordenadas', $("#coordenadas").val());
            formulario.append('tecnologia', $("#tecnologia").val());
            if ($.trim($("#adjunto")) !== '') {
                formulario.append('adjunto', $("#adjunto")[0].files[0]);
            }
            $.ajax({
                url: 'responder',
                type: 'POST',
                contentType: false,
                data: formulario,
                dataType: "json",
                processData: false,
                cache: false
            }).done(function (respuestaArray) {
                if (parseInt(respuestaArray['error']) === 0) {
                    var newDiv = '';
                    switch (respuestaArray['mensaje']['tipomensaje']) {
                        case 'Solucion':
                            alert(" EL TICKET HA SIDO SOLUCIONADO SATISFACTORIAMENTE. ");
                            location.reload();
                            break;
                        case 'Cliente':
                            newDiv = '<div class="cliente"><p><b>';
                            break;
                        case 'Soporte':
                            newDiv = '<div class="asesor"><p><b>';
                            break;
                    }
                    newDiv += respuestaArray['mensaje']['fechahorareg'] + ' -- '
                            + respuestaArray['mensaje']['registradopor']
                            + '</b></p>'
                            + respuestaArray['mensaje']['texto'];
                    if (respuestaArray['adjuntoOK']) {
                        newDiv += '<div class="ln_solid"></div><h5>ARCHIVOS ADJUNTOS</h5>'
                                + '<a href="/mesadeayuda/tickets/adjunto/descargar/' + respuestaArray['idAdjunto'] + '/' + respuestaArray['idProyecto'] + '" title="VISUALIZAR O DESCARGAR ESTE ADJUNTO" target="_blank">'
                                + '<i style="font-size: 15px" class="' + respuestaArray['tipoAdjunto'] + '"></i>'
                                + '</a>';
                    }
                    newDiv += '</div>';
                    $("#panelChat").append(newDiv);
                    var desplaza = $("#panelChat")[0].scrollHeight;
                    $("#panelChat").animate({
                        scrollTop: desplaza
                    }, 1500);
                    $("#texto").val('');
                    $("#tipomensaje").val('');
                    $("#adjunto").val('');
                    $("#texto").focus();
                    alert(" MENSAJE REGISTRADO EXITOSAMENTE.");
                } else {
                    alert(" SE HA PRESENTADO UN INCONVENIENTE. \n\n EL MENSAJE NO HA SIDO REGISTRADO.");
                }
                return false;
            });
            return false;
            bloqueoAjax();
        }
    } else {
        alert(" LOS CAMPOS MARCADOS CON (*) SON OBLIGATORIOS ");
    }
    return false;
}

function setViabilidad() {
    $("#texto").val('');
    if ($('#viabilidad').is(':checked')) {
        $("#coordenadas").attr('required', true);
        $("#tecnologia").attr('required', true);
        $("#texto").removeAttr('required');
        $("#divViabilidad").show('slow');
        $("#divMensaje").hide('slow');
    } else {
        $("#coordenadas").removeAttr('required');
        $("#tecnologia").removeAttr('required');
        $("#texto").attr('required', true);
        $("#divMensaje").show('slow');
        $("#divViabilidad").hide('slow');
    }
}

function validarRegistro() {
    if (confirm(' DESEA REALIZAR ESTE REGISTRO ?')) {
        if ($('#viabilidad').is(':checked')) {
            $("#texto").val('VIABILIDAD: ' + $("#coordenadas").val() + ' -- ' + $("#tecnologia").val());
        }
        return true;
    }
    return false;
}

function setViable() {
    if ($("#estado").val() === 'Viable') {
        $("#nodo").attr('required', true);
        $("#divViable").show('slow');
    } else {
        $("#nodo").removeAttr('required');
        $("#divViable").hide('slow');
    }
}
