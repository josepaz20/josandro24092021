function selectClienteCorp(idCorporativo, form) {
    var formulario = parent.opener.document.getElementById(form);
    var txtIdCorpBusq = parent.opener.document.getElementById('idCorporativo');
    var txtIdResBusq = parent.opener.document.getElementById('idResidencial');
    // var txtIdResBusq = parent.opener.document.getElementById('idResBusq');
    txtIdCorpBusq.value = idCorporativo;
    txtIdResBusq.value = 0;

    formulario.setAttribute('action', 'nuevaCuenta');
    formulario.submit();
    self.close();
}
function selectClienteRes(idResidencial, form) {
    var formulario = parent.opener.document.getElementById(form);
    var txtIdResBusq = parent.opener.document.getElementById('idResidencial');
    var txtIdCorpBusq = parent.opener.document.getElementById('idCorporativo');
    // var txtIdResBusq = parent.opener.document.getElementById('idResBusq');
    txtIdResBusq.value = idResidencial;
    txtIdCorpBusq.value = 0;

    formulario.setAttribute('action', 'nuevaCuenta');
    formulario.submit();
    self.close();
}

function validar() {

    var contador = document.getElementById('contador').value;
    if (contador == 0) {
        alert('No puede Generar Cuentas de Cobro Sin Deudas');
        return false;
    } else {

        var chk = document.getElementsByName('idFacturasDeudas[]');
        var len = chk.length;
        var num = 0;
        for (i = 0; i < len; i++)
        {
            if (chk[i].checked) {
                num++;
            }
        }
        if (num == 0){
            alert ('Para Generar una Cuenta debe seleccionar al menos una factura vencida.');
             return false;
        }
    }

}






