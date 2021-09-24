$(document).ready(function () {
    $('#action_menu_btn').click(function () {
        $('.action_menu').toggle();
    });
    $('.action_menu').click(function () {
        $('.action_menu').toggle();
    });
    $('.viable_viable').click(function () {
        var formulario = new FormData();
        formulario.append('viable', 1);
        formulario.append('idOportunidad', $("#idOportunidad").html());
        formulario.append('idIncidente', $("#idIncidente").html());
        $.ajax({
            url: 'viabilidad',
            type: 'POST',
            contentType: false,
            data: formulario,
            dataType: "json",
            processData: false,
            cache: false
        }).done(function (msg) {
            if (msg["error"] === 0) {
                window.location = "#close";
                location.reload();
                alert("[ - OK - ] Viable.");
            } else {
                alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
            }
        });
    });
    $('.no_viable_viable').click(function () {
        var formulario = new FormData();
        formulario.append('viable', 0);
        formulario.append('idOportunidad', $("#idOportunidad").html());
        formulario.append('idIncidente', $("#idIncidente").html());
        $.ajax({
            url: 'viabilidad',
            type: 'POST',
            contentType: false,
            data: formulario,
            dataType: "json",
            processData: false,
            cache: false
        }).done(function (msg) {
            if (msg["error"] === 0) {
                window.location = "#close";
                location.reload();
                alert("[ - OK - ] No viable.");
            } else {
                alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
            }
        });
    });
//    var onMensajes = false;
//
//    var temporizador = setInterval(function () {
//        contador()
//    }, 100)
//    function contador() {
//        if (onMensajes) {
//            console.log("llega");
//        } else {
//            console.log("off");
//        }
//    }

    $('#close_chat').click(function () {
        onMensajes = false;
        $("#respuesta").val("");
    });
});