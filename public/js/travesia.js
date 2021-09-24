function SSSearch() {
    Swal.fire({
        title: "BUSCANDO...",
        imageUrl: '/josandro/public/img/ellipsis_loader.gif',
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: 'loader.gif',
        showConfirmButton: false,
        showCancelButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        focusConfirm: false,
        showCloseButton: false,
        width: 400,
        padding: '4em',
        background: '#fff',
        showLoaderOnConfirm: false
    });
}

function verDetalle(idInscripcion) {
    $.get('verDetalle', {idInscripcion: idInscripcion}, setFormulario);
    SSSearch();
}
function verEliminar(idInscripcion) {
    $.get('verEliminar', {idInscripcion: idInscripcion}, setFormulario);
    SSSearch();
}
function verPagarInscripcion(idInscripcion) {
    $.get('getPagarInscripcion', {idInscripcion: idInscripcion}, setFormulario);
    SSSearch();
}
function setFormulario(datos) {
    $("#divContenido").html(datos);
    $('#modalFormulario').modal('show');
}
//------------------------------------------------------------------------------

function confirmFormulario(desde) {
    if (desde === "pagar")
        if (!sweetAConfirm(" ¿ DESEA REGISTRAR ESTE PAGO ? ", desde))
            return false;
    if (desde === "eliminar")
        if (!sweetAConfirm(" ¿ DESEA ELIMINAR ESTE PAGO ? ", desde))
            return false;
}

function sweetAConfirm(messege, desde) {
    Swal.fire({
        html: messege,
        allowEscapeKey: false,
        focusConfirm: false,
        showCloseButton: true,
        showConfirmButton: true,
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText:
                '<i class="fa fa-save fa-lg"></i> Aceptar',
        cancelButtonText: 'Cancelar',
        width: 400,
        padding: '4em',
        background: '#fff',
    }).then(function (result) {
        if (result.value) {
            $('#formInscripcion').removeAttr('onsubmit');
            if (desde === 'pagar') {
                $('#formInscripcion').attr('action', 'pagar_inscripcion');
            }
            if (desde === 'eliminar') {
                $('#formInscripcion').attr('action', 'delete');
            }
            $('#formInscripcion').submit();
        }
    });
}
