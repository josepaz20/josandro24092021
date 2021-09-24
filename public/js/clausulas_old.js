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
function verNuevo() {
    $.get('nuevo', {}, setFormulario);
    activarBloqueoAjax();
}
function verDetalle(idClausula) {
    $.get('detalle', {idClausula: idClausula}, setFormulario);
    activarBloqueoAjax();
}
function verActualizar(idClausula) {
    $.get('actualizar', {idClausula: idClausula}, setFormulario);
    activarBloqueoAjax();
}
function verEliminar(idClausula) {
    $.get('eliminar', {idClausula: idClausula}, setFormulario);
    activarBloqueoAjax();
}
function setFormulario(datos) {
    $("#divContenido").html(datos);
    $('#modalFormulario').modal('show');
}
function setNumCuenta(datos) {
    if (datos['existe'] === 1) {
        $("#divVerificacionNumCuenta").show('slow');
        $("#numcuenta").val('');
        $("#numcuenta").focus();
        $("#numcuenta").select();
    } else {
        $("#divVerificacionNumCuenta").hide('slow');
    }
}
//                                   FUNCIONES MIS CLAUSULAS
//=================================================================================================
function anadirMisClausulas() {
    var idContrato = parseInt($('#idContrato').val());
    var tipoClausula = $('#tipoContrato').val();
    $.get('anadirMisClausulas', {idContrato: idContrato, tipoClausula: tipoClausula}, setFormularioMisClausulas, 'json');
    activarBloqueoAjax();
}
function verActualizarMisClausulas(idClausula) {
    var idContrato = parseInt($('#idContrato').val());
    var tipoClausula = $('#tipoContrato').val();
    $.get('actualizar', {idClausula: idClausula, idContrato: idContrato, tipoClausula: tipoClausula}, setFormularioEliminarActulizar);
    activarBloqueoAjax();
}
function verEliminarMisClausulas(idClausula) {
    var idContrato = parseInt($('#idContrato').val());
    var tipoClausula = $('#tipoContrato').val();
    $.get('eliminar', {idClausula: idClausula, idContrato: idContrato, tipoClausula: tipoClausula}, setFormularioEliminarActulizar);
    activarBloqueoAjax();
}
function verDetalleMisClausulas(idClausula) {
    var idContrato = parseInt($('#idContrato').val());
    var tipoClausula = $('#tipoContrato').val();
    $.get('detalle', {idClausula: idClausula, idContrato: idContrato, tipoClausula: tipoClausula}, setFormularioEliminarActulizar);
    activarBloqueoAjax();
}
function copiarSeleccionarClausula(idClausula, desde) {
    if (desde === 'copiar') {
        $.get('copiarClausula', {idClausula: idClausula}, setFormularioEditarClausulas, 'json');
    } else if (desde === 'seleccionar') {
        $.get('copiarClausula', {idClausula: idClausula}, seleccionarMiClausula, 'json');
    }
}
function setFormularioEliminarActulizar(datos) {
    if (datos !== '') {
        $("#divContenido").html(datos);
        $('#modalFormulario').modal('show');
    } else {
        alert('PARECE QUE NO SE HA PODIDO CONSEGUIR DATOS');
    }
}

function nuevoMisClausulas() {
    $('#modalFormularioNuevaClausula').modal('show');
}
//                                    SELECCION CLAUSULAS
//=================================================================================================
function seleccionarMiClausula(datos) {
    if (datos['error'] === 0) {
        var ok = 1;
        var idClausula = datos['idClausula'];
        var ids = $("#idsClausulas").val().split(',');
        jQuery.each(ids, function (i, val) {
            if (parseInt(val) === parseInt(idClausula)) {
                alert("LA CLAUSULA YA SE ENCUENTRA ASIGNADA");
                ok = 0;
                return false;
            }
        });
        if (ok) {
            var nuevaFila = '<tr>' +
                    '<td>' + idClausula + '</td>' +
                    '<td>' + datos['titulo'] + '</td>' +
                    '<td><textarea id="contenido_' + idClausula + '" name="contenido_' + idClausula + '" class="form-control" readonly>' + datos['contenido'] + '</textarea></td>' +
                    '<td><a href="#" class="quitar"><i class="fa fa-times" style="color: blue" width:20; height:20;></i></a></td>' +
                    '</tr>';
            $("#tablaClausulasSelecionadas").append(nuevaFila);
            if ($("#idsClausulas").val() === '') {
                $("#idsClausulas").val(idClausula);
            } else {
                $("#idsClausulas").val($("#idsClausulas").val() + ',' + idClausula);
            }
            $("#contAsignados").val(parseInt($("#contAsignados").val()) + 1);
            $("#contOrden").val(parseInt($("#contOrden").val()) + 1);
        }
    } else {
        alert('NO SE PUDO OBTENER LOS DATOS DE ESTA CLAUSULA');
    }
}
function setFormularioMisClausulas(datos) {
    var tipoClausula = $('#tipoContrato').val();
    if (datos['error'] === 0) {
        $('#divContenido').html(datos['html']);
        $("#tablaClausulas").DataTable({
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
        $("#tablaClausulasSelecionadas").DataTable({
            responsive: true,
            "iDisplayLength": 25,
            "sPaginationType": "full_numbers",
            "oLanguage": {
                "sLengthMenu": "Mostrar: _MENU_ registros por pagina",
                "sZeroRecords": false,
                "sInfo": "Mostrando <b>_START_</b> a <b>_END_</b> registros <br>TOTAL REGISTROS: <b>_TOTAL_</b> Registros</b>",
                "sInfoEmpty": "Mostrando 0 A 0 registros",
                "sInfoFiltered": "(Filtrados de un total de <b>_MAX_</b> registros)",
                "sLoadingRecords": "CARGANDO...",
                "sProcessing": "EN PROCESO...",
                "sSearch": "Buscar:",
                "sEmptyTable": false,
                "oPaginate": {
                    "sFirst": "<i class='fa fa-fast-backward' aria-hidden='true' title='Inicio'></i>",
                    "sPrevious": "<i class='fa fa-step-backward' aria-hidden='true' title='Anterior'></i>",
                    "sNext": "<i class='fa fa-step-forward' aria-hidden='true' title='Siguiente'></i>",
                    "sLast": "<i class='fa fa-fast-forward' aria-hidden='true' title='Fin'></i>",
                }
            },
            "aaSorting": [[0, "desc"]]
        });
        $('#tablasOculta').show('fast');
        $('#idContratoLaboral').val(parseInt($('#idContrato').val()));
        $('#tipoClausula').val(tipoClausula);
        $('#modalFormulario').modal('show');
    } else {
        $('#divContenido').html(datos['html']);
        $('#idContratoLaboral').val(parseInt($('#idContrato').val()));
        $('#tipoClausula').val(tipoClausula);
        $('#modalFormulario').modal('show');
        alert(' NO SE HA PODIDO ENCONTRAR CLAUSULA DISPONIBLES PARA ESTE CONTRATO');
    }
}
function setFormularioEditarClausulas(datos) {
    if (datos['error'] === 0) {
        $('#tituloCopy').val(datos['titulo']);
        $('#contenidoCopy').val(datos['contenido']);
    } else {
        alert('PARECE QUE NO SE HA PODIDO CONSEGUIR DATOS');
    }
}
function pegar() {
    var titulo = '';
    var contenido = '';
    titulo = $('#tituloCopy').val();
    contenido = $('#contenidoCopy').val();
    if (titulo !== '' && contenido !== '') {
        $('#tituloNew').val('');
        $('#contenidoNew').val('');
        $('#tituloNew').val(titulo);
        $('#contenidoNew').val(contenido);
    }
}
function pegarClausulaNueva() {
    if ($('#tituloNew').val() !== '' && $('#contenidoNew').val() !== '') {
        var ids = $('#idsClausulasNew').val().split(',');
        if ($('#tituloNew').val() !== $('#tituloNew_' + ids).val()) {
            var idNuevo = parseInt($('#idNuevo').val());
            var nuevaFila = '<tr>' +
                    '<td>' + idNuevo + '</td>' +
                    '<td><a href="#" class="quitar2"><i class="fa fa-times" style="color: blue" width:20; height:20;></i></a></td>' +
                    '<td><input type="text" id="tituloNew_' + idNuevo + '" name="tituloNew_' + idNuevo + '" value="' + $('#tituloNew').val() + '" class="form-control"></td>' +
                    '<td><textarea id="contenidoNew_' + idNuevo + '" name="contenidoNew_' + idNuevo + '" class="form-control">' + $('#contenidoNew').val() + '</textarea></td>' +
                    '</tr>';
            $("#tablaClausulasNew").append(nuevaFila);
            if ($("#idsClausulasNew").val() === '') {
                $("#idsClausulasNew").val(idNuevo);
            } else {
                $("#idsClausulasNew").val($("#idsClausulasNew").val() + ',' + idNuevo);
            }
            $("#contAsignadosNew").val(parseInt($("#contAsignadosNew").val()) + 1);
            $("#idNuevo").val(parseInt($("#idNuevo").val()) + 1);
            $("#contOrden").val(parseInt($("#contOrden").val()) + 1);
            limpiar();
        } else if (confirm('AL PARECER VAS A REGISTRAR LA \n CLAUSULA CON EL MISMO TITULO. \n NO SE PUEDE REALIZAR ESTA PETICION')) {
            limpiar();
        } else {
            $('#tituloNew').focus();
        }
    } else {
        alert('FALTAN CAMPOS POR LLENAR');
    }
    return false;
}
function limpiar() {
    $('#tituloNew').val('');
    $('#contenidoNew').val('');
    $('#modalFormularioNuevaClausula').modal('hide');
}
function limpiarContenido(desde) {
    if (desde === 'actualizar') {
        $('#contenidoActualizar').val('');
    } else {
        $('#contenidoNew').val('');
    }
}

//                                   VALIDACIONES
//=================================================================================================
function validarMisClausulas() {
    if ($('#contAsignados').val() <= 0 && $('#contAsignadosNew').val() <= 0) {
        alert('ERROR DEBES SELECCIONAR ALMENOS UNA CLAUSULA.\n O REGISTRAR UNA NUEVA CLAUSULA');
        $('#contAsignados').focus();
        return false;
    }
}
function guardarOrdenMisClausulas() {
    if (confirm(' ESTA SEGURO QUE DESEA GUARDAR ESRTE ORDEN')) {
        var table = $('#tablaMisClausulas').DataTable();
        var data = '';
        var ordenEnviar = [];
        var idEnviar = [];
        var row = '';
        table.rows().eq(0).each(function (index, element) {
            row = table.row(index);
            data = row.data();
            ordenEnviar[element] = (row.data()[0]);
            idEnviar[element] = (row.data()[1]);
        });
        if (data !== '') {
            var idContrato = parseInt($('#idContrato').val());
            $.post('updateOrden', {ordenEnviar: JSON.stringify(ordenEnviar), idEnviar: JSON.stringify(idEnviar), idContrato: idContrato}, setOk, 'json');
        }
    }

}
function setOk(datos) {
    if (datos['url'] !== '') {
        location.href = datos['url'];
    }
}
function pegarMacador(marcador, desde) {
    if (desde === 'actualizar') {
        $('#contenidoActualizar').val($('#contenidoActualizar').val() + ' ' + marcador);
    } else {
        $('#contenidoNew').val($('#contenidoNew').val() + ' ' + marcador);
    }
}
function pegarMacadorClaulas(marcador, desde) {
    if (desde === 'actualizar') {
        $('#contenidoActualizarClausulas').val($('#contenidoActualizarClausulas').val() + ' ' + marcador);
    } else {
        $('#contenidoClauslas').val($('#contenidoClauslas').val() + ' ' + marcador);
    }
}
