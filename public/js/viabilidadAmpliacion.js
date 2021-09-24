//------------------------------------------------------------------------------
function bloqueoAjax() {
    $.blockUI(
            {
                message: $('#msgBloqueo'),
                css: {
                    border: 'none',
                    padding: '15px',
                    backgroundColor: '#000',
                    '-webkit-border-radius': '10px',
                    '-moz-border-radius': '10px',
                    opacity: .85,
                    color: '#fff',
                    'z-index': 2000
                }
            }
    );
    $('.blockOverlay').attr('style', $('.blockOverlay').attr('style') + 'z-index: 1100 !important');
}

//------------------------------------------------------------------------------

function verRegistrar() {
    $.get('registrar', {}, setFormulario);
    bloqueoAjax();
}
function setFormulario(respuesta) {
    $("#divContenido").html(respuesta);
    $('#modalFormulario').modal('show');
}
function setFormularioEliminar(respuesta) {
    $("#divContenidoEliminar").html(respuesta);
    $('#modalEliminarRecurso').modal('show');
}
function setFormularioAvance(respuesta) {
    $("#divContenido").html(respuesta);

    oTable = $('#datatableAvance').dataTable({
        "iDisplayLength": 25,
        "sPaginationType": "full_numbers",
        "oLanguage": {
            "sLengthMenu": "MOSTRAR: _MENU_ REGISTROS POR PAGINA",
            "sZeroRecords": "NO SE HA ENCONTRADO INFORMACION",
            "sInfo": "MOSTRANDO <b>_START_</b> A <b>_END_</b> REGISTROS <br>TOTAL REGISTROS: <b>_TOTAL_</b> REGISTROS</b>",
            "sInfoEmpty": "MOSTRANDO 0 A 0 REGISTROS",
            "sInfoFiltered": "(FILTRADOS DE UN TOTAL DE <b>_MAX_</b> REGISTROS)",
            "sLoadingRec\n\
\n\
\n\
ords": "CARGANDO...",
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



    $('#modalFormulario').modal('show');

}

function verDetalle(idViabilidad) {
    $.get('detalle', {idViabilidad: idViabilidad}, setFormulario);
    bloqueoAjax();
}
function verAvance(idAmpliacion) {
    $.get('avance', {idAmpliacion: idAmpliacion}, setFormularioAvance);
    bloqueoAjax();
}
function verActualizar(idViabilidad) {
    $.get('actualizar', {idViabilidad: idViabilidad}, setFormulario);
    bloqueoAjax();
}
function verViabilidad(idViabilidad) {
    $.get('viabilidad', {idViabilidad: idViabilidad}, setFormulario);
    bloqueoAjax();
}

function verEliminarRecurso(idViabilidad, idTipoRecurso) {
    $.get('eliminarrecurso', {idViabilidad: idViabilidad, idTipoRecurso: idTipoRecurso}, setFormularioEliminar);
    bloqueoAjax();
}

//---------------------------------------------------------------------------

function validarRegistrar() {
    if (confirm("   DESEA REGISTRAR ESTA VIABILIDAD DE AMPLIACIÓN?")) {
        bloqueoAjax();
        return true;
    } else {
        return false;
    }
}

function validarEditar() {
    if (confirm("   DESEA ACTUALIZAR ESTA VIABILIDAD DE AMPLIACIÓN? ")) {
        bloqueoAjax();
        return true;
    } else {
        return false;
    }
}
function validarInsavan() {
    if (confirm(" DESEA REGISTRAR ESTE AVANCE? ")) {
        bloqueoAjax();
        return verAvance;
    } else {
        return false;
    }
}
function validarRecurso() {
    if (confirm(" DESEA REGISTRAR ESTE RECURSO? ")) {
        bloqueoAjax();
        return true;
    } else {
        return false;
    }
}
function validarEliminarRecurso() {
    if (confirm(" DESEA ELIMINAR ESTE RECURSO? ")) {
        bloqueoAjax();
        return true;
    } else {
        return false;
    }
}

//---------------------------------------------------------------------------

function getMunicipios(idDpto) {
    $("#idMcpo").html('<option value="">Seleccione...</option>');
    if (idDpto !== '') {
        $.get('getMunicipio', {idDpto: idDpto}, setMunicipios);
        bloqueoAjax();
    }
}

function setMunicipios(datos) {

    $("#idMcpo").html(datos);
}

//---------------------------------------------------------------------------

function seleccionarlista()
{
    var idViabilidad = $("#idViabilidad").val();
    $.get('seleccionarlista', {idViabilidad: idViabilidad});
    alert(idViabilidad);
}
//---------------------------------------------------------------------------
function agregar() {
    var id = $("#idTipoRecurso").val();
    var yaAgregados = $("#ids").val().split(',');
    var nombre = $("#idTipoRecurso option:selected").text();
    if (id === '') {
        alert("POR FAVOR SELECCIONE UN TIPO DE RECURSO");
        return;
    }
    for (i = 0; i < yaAgregados.length; i++) {
        if (parseInt(yaAgregados[i]) === parseInt(id)) {
            alert("   ESTE TIPO DE RECURSO YA SE ENCUENTRA AGREGADO");
            return;
        }
    }
    var nuevaFila = '<tr id ="fila_' + id + '">' +
            '<td>' + id + '</td>' +
            '<td><a onclick="quitar(' + id + ',this)" title="VER ELIMINAR"><i class="fa fa-window-close "></a></i></td>' +
            '<td>' + nombre + '</td>' +
            '<td><input type="number" id="cantidad_' + id + '" name="cantidad_' + id + '" value="" min="1" onchange="obtener(' + id + ')" required/></td>' +
            '<td><input type="number" id="valor_' + id + '" name="valor_' + id + '" value="" min="1" onchange="obtener(' + id + ')" required/></td>' +
            '<td id="tdTotal_' + id + '"></td>' +
            '</tr>"';

    if ($("#trInicial").length > 0) {
        $("#datatableAvance tbody").html(nuevaFila);
    } else {
        $("#datatableAvance tbody").append(nuevaFila);
    }
    $("#ids").val($("#ids").val() + id + ",");
}

function obtener(id) {
    var cantidad = $("#cantidad_" + id).val();
    var valor = $("#valor_" + id).val();

    $("#tdTotal_" + id).html(cantidad * valor);

}

function quitar(id) {
    var ids = $("#ids").val();
    var vectores = ids.split(',');

    for (var i = 0; i < vectores.length; i++)
    {
        id = '' + id;
        if (id === vectores[i])
        {
            vectores.splice(i, 1);
            break;
        }
    }
    $("#ids").val(vectores.toString());
    $("#fila_" + id).remove();
}
