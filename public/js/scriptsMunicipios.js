function cambioNombreMcpo(){
    var txtNombreMcpo = document.getElementById('nombreMcpo');
    var txtNombreMcpoOLD = document.getElementById('nombreMcpoOLD');
    
    if(txtNombreMcpo.value != txtNombreMcpoOLD.value){
        var txtCrear = document.getElementById('crear');
        var btnEnviar = document.getElementById('enviar');
        txtCrear.value = 0;
        btnEnviar.setAttribute('value', 'Crear Municipio');
    }
}