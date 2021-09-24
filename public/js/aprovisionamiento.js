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
    $.blockUI(
            {
                message: $('#msgBloqueo'),
                css: {
                    border: 'none',
                    padding: '15px',
                    backgroundColor: '#000', '-webkit-border-radius': '10px', '-moz-border-radius': '10px',
                    opacity: .85,
                    color: '#fff'
                }
            }
    );
    $('.blockOverlay').attr('style', $('.blockOverlay').attr('style') + 'z-index: 1100 !important');
}

//------------------------------------------------------------------------------

function setFormulario(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divContenido").html(datos['html']);
        $("#modalFormulario").modal('show');
    } else {
        alert("SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

//------------------------------------------------------------------------------

function validarBusqueda() {
    var continuar = 0;
    if ($("#clienteResBusq").val() !== '' && $("#clienteCorpBusq").val() !== '') {
        alert("SOLO SE ADMITE UN FILTRO DE BUSQUEDA.");
        $("#clienteResBusq").focus();
        return false;
    } else {
        $("#frmFiltroBusq").find(':input').each(function () {
            if ($(this).attr('type') !== 'submit' && $(this).attr('type') !== 'button' && $(this).val() !== '') {
                continuar++;
            }
        });

        if (parseInt($("#limpiar").val()) !== 0) {
            return true;
        }

        if (continuar > 0) {
            if ($("#clienteResBusq").val().indexOf('--') !== -1 || $("#clienteCorpBusq").val().indexOf('--') !== -1) {
                return true;
            } else {
                alert("POR FAVOR LLENE UNO DE LOS CAMPOS DE BUSQUEDA CON LA AYUDA AUTOCOMPLETAR.");
                return false;
            }
        } else {
            alert("DEBE INDICAR AL MENOS UN FILTRO DE BUSQUEDA");
            $("#idOrdenBusq").focus();
            return false;
        }
    }
}

//------------------------------------------------------------------------------

function setLimpiar() {
    $("#clienteResBusq").val('');
    $("#clienteCorpBusq").val('');
}

//------------------------------------------------------------------------------

function aprovisionarOLT(idOLT) {
    $.get('aprovisionamiento', {idOLT: idOLT}, setFormulario, 'json');
    activarBloqueoAjax();
}

//------------------------------------------------------------------------------

function autofind() {
    if ($("#interface").val() === '' || $("#puerto").val() === '') {
        alert('DEBE LLENAR LOS CAMPOS');
        return false;
    } else if ($("#interface").val() > 1 || $("#interface").val() < 0 || $("#puerto").val() > 15 || $("#puerto").val() < 0) {
        alert('VALORES INCORRECTOS');
        $("#interface").val('');
        $("#puerto").val('');
        return false;
    } else {
        $("#divResultadoAutofind").html('NO SE HA EJECUTADO AUTOFIND <br><br><br>');
        $.get('autofind', {interface: $("#interface").val(), puerto: $("#puerto").val(), idOLT: $("#idOLT").val()}, setAutofind, 'json');
        activarBloqueoAjax();
    }
}

function autofindall() {
    $("#interface").val('');
    $("#puerto").val('');
    $("#divResultadoAutofind").html('NO SE HA EJECUTADO AUTOFIND <br><br><br>');
    $.get('autofind_all', {interface: $("#interface").val(), puerto: $("#puerto").val(), idOLT: $("#idOLT").val()}, setAutofind, 'json');
    activarBloqueoAjax();
}

function setAutofind(datos) {
    $("#divResultadoAutofind").html(datos['html']);
    $("#tblAutofind").DataTable({
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
            "sEmptyTable": "ONT NO ENCONTRADAS",
            "oPaginate": {
                "sFirst": "Inicio",
                "sLast": "Fin",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            }
        },
        "aaSorting": [[0, "DES"]]
    });
}

//------------------------------------------------------------------------------

function selectONT(fsp, ontsn, idOLT) {
    var ont_lineprofile = $("#ont_lineprofile").val();
    $.get('aprovisionarONT', {fsp: fsp, ontsn: ontsn, ont_lineprofile: ont_lineprofile, idOLT: idOLT}, setAprovisionarFormulario, 'json');
    activarBloqueoAjax();
}
function setAprovisionarFormulario(datos) {
//console.log(datos)
    $("#divAprovisionarONT").html(datos['html']);
    $('#modalAprovisionarONT').modal('show');
}

//------------------------------------------------------------------------------

function busquedaUsuario() {
    if (parseInt($("#busquedaOpt").val()) === 1) {
        $("#divOptCedula").show('slow');
        $("#divOptCedula").attr("required", "true");
        $("#divOptNombre").hide('slow');
        $("#divOptNombre").removeAttr("required", "true");
        $("#nombreBusq").val("");
        $("#apellidoBusq").val("");
    }
    if (parseInt($("#busquedaOpt").val()) === 2) {
        $("#divOptNombre").show('slow');
        $("#divOptNombre").attr("required", "true");
        $("#divOptCedula").hide('slow');
        $("#divOptCedula").removeAttr("required", "true");
        $("#identificacionBusq").val("");
    }
}

//------------------------------------------------------------------------------

function buscarCliente() {
    if ($("#identificacionBusq").val() !== '') {
        $("#idServicioInterno").val('');
        $("#idServicio").val('');
        $("#detalleservicio").val('');
        $("#idSucursal").val('');
        $("#sucursal").val('');
        $("#idZona").val('');
        $("#zona").val('');
        $("#idBarrio").val('');
        $("#barrio").val('');
        $("#dirdestino").val('');
        $.get('buscarcliente', {identificacionBusq: $("#identificacionBusq").val()}, setBusquedaCliente, 'json');
        activarBloqueoAjax();
    } else {
        alert('POR FAVOR DIGITE LA IDENTIFICACION');
        $("#identificacionBusq").focus();
    }
}
function setBusquedaCliente(datos) {
    $("#divInfoCliente").html(datos['html']);
    $("#divInfoCliente").show('slow');
}

//------------------------------------------------------------------------------

function buscarClienteModal() {
    var nombre = $("#nombreBusq").val();
    var apellido = $("#apellidoBusq").val();
    if (nombre !== '' && apellido !== '') {
        if (nombre.length < 3) {
            alert('EL NOMBRE DEBE TENER AL MENOS 3 LETRAS');
            $("#apellidoBusq").focus();
        }
        if (apellido.length < 3) {
            alert('EL APELLIDO DEBE TENER AL MENOS 3 LETRAS');
            $("#apellidoBusq").focus();
        }
        if (nombre.length >= 3 && apellido.length >= 3) {
            $.get('buscarclientemodal', {nombre: nombre, apellido: apellido}, setFormularioUsuario);
            activarBloqueoAjax();
        }
    } else {
        alert('LOS CAMPOS NO DEBEN DE SER VACIOS');
        $("#nombreBusq").focus();
        $("#apellidoBusq").focus();
        return false;
    }
}

//------------------------------------------------------------------------------

function seleccionarServicioOT(idServicio) {
    $("#idServicio").val(idServicio);
    $("#descripcion").val($("#idServicio").val() + ";" + $("#cliente").val());
}

//------------------------------------------------------------------------------

function getIP() {
    var idSegmetoip = $("#idSegmentoip").val();
    if (idSegmetoip === '') {
        $("#ipSelect").val('');
        $("#gateway").val('');
        alert('SELECCIONE UN SEGMENTO');
    } else {
        $.get('getiplibre', {idSegmetoip: idSegmetoip}, setIP, 'json');
        activarBloqueoAjax();
    }
}
function setIP(datos) {
    if (parseInt(datos['error']) === 0) {
        if (datos['ip'] !== -1) {
            $("#ipSelect").val(datos['ip']);
            $("#gateway").val(datos['gateway']);
            $("#divIpSelect").show('slow');
            alert(datos['ip'], 'IP DISPONIBLE EN JOSANDRO', 'success');
        } else {
            alert('NO SE ENCONTRO IPs DISPONIBLES PARA ESTE SEGMENTO');
        }
    } else {
        alert('NO SE ENCONTRO IPs DISPONIBLES PARA ESTE SEGMENTO');
    }
}

//------------------------------------------------------------------------------

function confirmarAprovisionamiento() {
    if ($("#tblServicios input:radio:checked").length === 0) {
        alert(' DEBE SELECCIONAR UN SERVICIO PARA CONTINUAR');
        return false;
    } 
    if ($("#tblServicios input:radio:checked").length === 0) {
        alert(' DEBE SELECCIONAR UN SERVICIO PARA CONTINUAR');
        return false;
    } 
    if (confirm("   DESEA APROVISIONAR ESTA ONT ?")) {
        activarBloqueoAjax();
        return true;
    } else {
        return false;
    }
}

//------------------------------------------------------------------------------

function validarInterPuer() {
    if ($("#interface").val() > 1 || $("#interface").val() < 0 || $("#puerto").val() > 15 || $("#puerto").val() < 0) {
        Swal.fire('VALORES INCORRECTOS', 'JOSANDRO', 'error');
        $("#interface").val('');
        $("#puerto").val('');
        return false;
    }
}

//------------------------------------------------------------------------------

function searchForONT(idOLT) {
    Swal.mixin({
        input: 'text',
        confirmButtonText: 'Siguiente &rarr;',
        showCancelButton: true,
        progressSteps: ['1', '2']
    }).queue([
        {
            title: 'Interface',
            text: 'JOSANDRO'
        },
        'Puerto',
    ]).then((result) => {
        if (result.value) {
            var interface = result.value[0];
            var puerto = result.value[1];
            if (interface > 1 || interface < 0 || puerto > 15 || puerto < 0 || isNaN(interface) || isNaN(puerto)) {
                Swal.fire('VALORES INCORRECTOS', 'JOSANDRO', 'error');
                return false;
            } else if (interface == '' || puerto == '') {
                Swal.fire('LOS CAMPOS NO PUEDEN ESTAR VACIOS', 'JOSANDRO', 'error');
                return false;
            } else {
                swal.fire({
                    title: 'Seleccione opcion de busqueda',
                    input: 'select',
                    inputOptions: {
                        'ALL': 'ALL',
                        'SN': 'SN',
                        'Description': 'Description',
                    },
                    inputPlaceholder: 'Seleccione..',
                    showCancelButton: true,
                    inputValidator: function (value) {
                        return new Promise(function (resolve) {
                            if (value === 'SN') {
                                $.get('searchforont', {idOLT: idOLT, interface: interface, puerto: puerto}, setSearchforont, 'json');
                                activarBloqueoAjax();
                                resolve();
                            } else if (value === 'Description') {
                                $.get('searchdescription', {idOLT: idOLT, interface: interface, puerto: puerto}, setSearchforont, 'json');
                                activarBloqueoAjax();
                                resolve();
                            } else if (value === 'ALL') {
                                $.get('searchall', {idOLT: idOLT, interface: interface, puerto: puerto}, setSearchforont, 'json');
                                activarBloqueoAjax();
                                resolve();
                            } else {
                                Swal.fire('DEBE SELECCIONAR UNA APCION', 'JOSANDRO', 'error');
                                return false;
                            }
                        });
                    }
                })
            }
        }
    })
}

//------------------------------------------------------------------------------

function setSearchforont(datos) {
    $("#divSearchforont").html(datos['html']);
    $("#tblONTs").DataTable({
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
                "sFirst": "Inicio",
                "sLast": "Fin",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            }
        },
        "aaSorting": [[0, "DES"]]
    });
    $("#tblONTs2").DataTable({
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
                "sFirst": "Inicio",
                "sLast": "Fin",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            }
        },
        "aaSorting": [[0, "DES"]]
    });
    $('#modalSearchforont').modal('show');
}

//------------------------------------------------------------------------------

function verDesaprovisionar(idONT) {
    var idOLT = $("#idOLT").val();
    var interfaz = $("#interface").val();
    var puerto = $("#puerto").val();
    console.log(idOLT);
    console.log(idONT);
    console.log(interfaz);
    console.log(puerto);
    Swal.fire({
        title: 'DESEA DES-APROVISIONAR LA ONT: ' + idONT + ' ?',
        text: "Una vez ejecutada esta operacion NO se podra deshacer!",
        allowEscapeKey: false,
        focusConfirm: false,
        showCloseButton: true,
        showConfirmButton: true,
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: '<i class="fa fa-trash-o fa-lg"></i> Confirmar',
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33',
        width: 400,
        padding: '4em',
        background: '#fff',
    }).then(function (result) {
        if (result.value) {
            location.href = "verDesaprovisionar?idOLT=" + idOLT + "&idONT=" + idONT + "&interface=" + interfaz + "&puerto=" + puerto;
//            $.get('verDesaprovisionar', {idOLT: idOLT, idONT: idONT, interface: interface, puerto: puerto}, );
            activarBloqueoAjax();
        }
    });
}

//------------------------------------------------------------------------------


//------------------------------------------------------------------------------

