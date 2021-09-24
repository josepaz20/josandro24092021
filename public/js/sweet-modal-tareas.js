function exampleOpenModal(respuestaServidor) {
    $.sweetModal({
        title: "Dobleclick Software e Ingenieria S.A.S.",
        message: "prueba",
        content: respuestaServidor,
//        icon: $.sweetModal.ICON_WARNING,
        classes: [],
        showCloseButton: !0,
        blocking: !0,
        timeout: null,
        theme: $.sweetModal.THEME_DARK,
        type: $.sweetModal.TYPE_MODAL,
        buttons: {
            someOtherAction: {
                label: 'Cerrar',
                classes: 'redB'
            },
            someAction: {
                label: 'Registrar cliente',
                classes: 'tealB',
                action: function () {
                    if (!registerCustomerAlert()) {
                        return false;
                    }
                }
            },
        },
//        buttons: [
//            {
//                label: 'Cerrar',
//                classes: 'redB'
//            },
//            {
//                label: 'Eliminar cliente',
//                classes: 'tealB'
////                classes: 'lightGreyB bordered flat'
//            }
//        ],
//        confirm: {
//            yes: {
//                label: "Yes",
//                classes: "greenB"
//            },
//            ok: {
//                label: "OK",
//                classes: "greenB"
//            },
//            cancel: {
//                label: "Cancel",
//                classes: "redB bordered flat"
//            }
//        },
        onOpen: null,
        onClose: null
    });

//    $.sweetModal({
//        title: 'Dobleclick Software e Ingenieria S.A.S.',
//        content: respuestaServidor,
//    });
}
function openModalVideo(modal) {
    if (parseInt(modal) > 0) {
//        $.sweetModal({
//            title: 'Dobleclick Software e Ingenieria S.A.S.',
//            content: 'https://www.youtube.com/watch?v=TgQfL5enYpE',
//            theme: $.sweetModal.THEME_DARK
//        });
    }
}
function tableroTitulo(name) {
    $.sweetModal.prompt('Cambiar el nombre al tablero', 'Tablero sin título', name,
            function (val) {
                $.sweetModal({
                    message: "Esta funccion aun no esta disponible para esta version.",
                    icon: $.sweetModal.ICON_WARNING
                });
            });
}
function finishHomeworkOpenModal() {
    $.sweetModal({
        message: "Esta funccion aun no esta disponible para esta version.",
        icon: $.sweetModal.ICON_WARNING
    });
}

