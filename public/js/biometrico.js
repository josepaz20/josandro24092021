
function activarBiometrico() {
    $.ajax({
        async: true,
        type: "POST",
        url: "../biometrico/activarBiometrico",
        data: "&token=",
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data);
            console.log(json);
            if (json["filas"] === 1) {
                $("#activeSensorLocal").attr("disabled", true);
                $("#fingerPrint").css("display", "block");
            }
        }
    });
}