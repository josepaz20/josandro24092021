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
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

function verRegistrar() {
    $.get('registrar', {}, setFormulario, 'json');
    activarBloqueoAjax();
}

function verRegistrarNodo() {
    $.get('registrar-nodo', {}, setFormulario, 'json');
    activarBloqueoAjax();
}

function verModificar(pk_antena_id) {
    $.get('modificar', {pk_antena_id: pk_antena_id}, setFormulario, 'json');
    activarBloqueoAjax();
}

function verModificarNodo(pk_nodo_id) {
    $.get('modificar-nodo', {pk_nodo_id: pk_nodo_id}, setFormulario, 'json');
    activarBloqueoAjax();
}

function verConfigurarAntena(pk_antena_id, ipantena, comunidadsnmp) {
    $.get('configurar-antena', {pk_antena_id: pk_antena_id, ipantena: ipantena, comunidadsnmp: comunidadsnmp}, setFormulario, 'json');
    activarBloqueoAjax();
}

function verConfigurarAntenaWireless(pk_antena_id, ipantena, comunidadsnmp) {
    $.get('configurar-antena-wireless', {pk_antena_id: pk_antena_id, ipantena: ipantena, comunidadsnmp: comunidadsnmp}, setFormulario, 'json');
    activarBloqueoAjax();
}

function verDetalle(pk_antena_id) {
    $.get('detalle', {pk_antena_id: pk_antena_id}, setFormulario, 'json');
    activarBloqueoAjax();
}

function verDetalleNodo(pk_nodo_id) {
    $.get('detalle-nodo', {pk_nodo_id: pk_nodo_id}, setFormulario, 'json');
    activarBloqueoAjax();
}

function verBackupsAntena(pk_antena_id, ipantena) {
    $.get('backups-antena', {pk_antena_id: pk_antena_id, ipantena: ipantena}, setFormulario, 'json');
    activarBloqueoAjax();
}

function verRecuperarCredenciales() {
    $.get('recuperar-credenciales', {}, setFormulario, 'json');
    activarBloqueoAjax();
}

function recuperarCredenciales() {
    var ipantena = $("#ipantena").val();
    $("#divCredenciales").hide('slow');
    $("#usuario").val('');
    $("#contrasenia").val('');
    $("#divRecuperandoCredenciales").hide('slow');
    if (ipantena !== '') {
        $("#divRecuperandoCredenciales").html('<h4 style="color: #FFFF00"> BUSCANDO CREDENCIALES... </h4>');
        $("#divRecuperandoCredenciales").show('slow');
        $.get('recuperarcredenciales', {ipantena: ipantena}, setRecuperarCredenciales, 'json');
        activarBloqueoAjax();
    } else {
        alert("DIRECCION IP REQUERIDA!");
        $("#ipantena").focus();
        return false;
    }
}
function setRecuperarCredenciales(datos) {
    if (datos['error'] === 0 && datos['credenciales'] === 'Found') {
        $("#usuario").val(datos['usuario']);
        $("#contrasenia").val(datos['contrasenia']);
        $("#divRecuperandoCredenciales").html('<h4 style="color: #00FF80"> CREDENCIALES ENCONTRADAS! </h4>');
        $("#divRecuperandoCredenciales").show('slow');
        $("#divCredenciales").show('slow');
    } else if (datos['error'] === 2 && datos['credenciales'] === 'Not Found') {
        $("#divCredenciales").hide('slow');
        $("#divRecuperandoCredenciales").hide('slow');
        $("#usuario").val('');
        $("#contrasenia").val('');
        alert('CREDENCIALES NO ENCONTRADAS.');
    } else if (datos['error'] === 3) {
        $("#divCredenciales").hide('slow');
        $("#divRecuperandoCredenciales").hide('slow');
        $("#usuario").val('');
        $("#contrasenia").val('');
        alert('ANTENA FUERA DE SERVICIO ! ! !');
    } else if (datos['error'] === 4) {
        $("#divCredenciales").hide('slow');
        $("#divRecuperandoCredenciales").hide('slow');
        $("#usuario").val('');
        $("#contrasenia").val('');
        alert('DIRECCION IP DE ANTENA NO VALIDA.');
    } else {
        $("#divCredenciales").hide('slow');
        $("#divRecuperandoCredenciales").hide('slow');
        $("#usuario").val('');
        $("#contrasenia").val('');
        alert("ERROR! SE HA PRESENADO UN INCONVENIENTE. \nPOR FAVOR COMUNIQUESE CON EL ADMINISTRADOR DEL SISTEMA.");
    }
}

function getMunicipios(fk_departamento_id) {
    $.get('getmunicipios', {fk_departamento_id: fk_departamento_id}, setMunicipios, 'json');
    activarBloqueoAjax();
}
function setMunicipios(datos) {
    if (datos['error'] === 0) {
        $("#fk_municipio_id").html(datos['html']);
        $("#fk_municipio_id").focus();
        $("#fk_centro_poblado_id").html('<option value="">Seleccione...</option>');
    } else {
        alert("HA OCURRIDO UN ERROR!");
        return false;
    }
}
function getCentrosPoblados(fk_municipio_id) {
    $.get('getcentrospoblados', {fk_municipio_id: fk_municipio_id}, setCentrosPoblados, 'json');
    activarBloqueoAjax();
}
function setCentrosPoblados(datos) {
    if (datos['error'] === 0) {
        $("#fk_centro_poblado_id").html(datos['html']);
        $("#fk_centro_poblado_id").focus();
    } else {
        alert("HA OCURRIDO UN ERROR!");
        return false;
    }
}

function verCambiarContrasenia(pk_antena_id, ipantena) {
    $.get('cambiar-contrasenia', {pk_antena_id: pk_antena_id, ipantena: ipantena}, setFormulario, 'json');
    activarBloqueoAjax();
}

function eliminarAntena(pk_antena_id) {
    if (confirm(' ¿ DESEA ELIMINAR ESTA ANTENA ? ')) {
        $.get('eliminar', {pk_antena_id: pk_antena_id}, setEliminarAntena, 'json');
        activarBloqueoAjax();
    } else {
        return false;
    }
}
function setEliminarAntena(datos) {
    if (datos === 3) {
        document.location.href = '/sw2click/modulos/infraestructura/antenas?msg=3';
    } else {
        alert("ERROR! LA ANTENA NO PUDO SER ELIMINADA. \n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR DEL SISTEMA.");
    }
}

function activarComplianceTest(ipantena) {
    if (confirm(' ¿ DESEA ACTIVAR COMPLIANCE TEST ? ')) {
        $.get('activarcompliancetest', {ipantena: ipantena}, setActivarComplianceTest, 'json');
        activarBloqueoAjax();
    } else {
        return false;
    }
}
function setActivarComplianceTest(datos) {
    if (datos === 5) {
//        document.location.href = '/sw2click/modulos/infraestructura/antenas?msg=5';
        alert('COMPLIANCE TEST ACTIVADO CON EXITO. \nPUEDE QUE TENGAS QUE ESPERAR MIENTRAS LA ANTENA SE REINICIA.');
    } else if (datos === 1) {
        alert('ERROR! NO SE PUDO ACCEDER A LA ANTENA. \nCREDENCIALES INVALIDAS.');
    } else if (datos === 2) {
        alert('ANTENA FUERA DE SERVICIO ! ! !');
    } else if (datos === 3) {
        alert('DIRECCION IP DE ANTENA NO VALIDA.');
    } else {
        alert("ERROR! NO SE PUDO ACCEDER A LA ANTENA. \nPOR FAVOR COMUNIQUESE CON EL ADMINISTRADOR DEL SISTEMA.");
    }
}

function confirmarCliente(macradio, nombreclienteradio, ipradiocliente, idservicio, nombreclientejosandro, ipradioclientejosandro, ipantena, municipioservicio, macValidada) {
    if (macValidada === 'NoMac') {
        var macradioIntro = prompt('INGRESE LA DIRECCION MAC DEL EQUIPO:', '');
        if (macradioIntro !== null) {
            //Validar que el texto introducido sea una MAC
            var regexp = new RegExp(/^[a-f0-9]{2}[:-][a-f0-9]{2}[:-][a-f0-9]{2}[:-][a-f0-9]{2}[:-][a-f0-9]{2}[:-][a-f0-9]{2}$/i);
            if (regexp.test(macradioIntro)) {
                if (confirm(' ¿ DESEA CONFIRMAR ESTE CLIENTE ? ')) {
                    $.get('confirmarcliente', {macradio: macradioIntro, nombreclienteradio: nombreclienteradio, ipradiocliente: ipradiocliente, idservicio: idservicio, nombreclientejosandro: nombreclientejosandro, ipradioclientejosandro: ipradioclientejosandro, ipantena: ipantena, municipio: municipioservicio, macValidada: macValidada}, setConfirmarCliente, 'json');
                    activarBloqueoAjax();
                } else {
                    return false;
                }
            } else {
                alert("DIRECCION MAC " + macradioIntro + " INCORRECTA !");
                return false;
            }
        } else {
            return false;
        }
    } else {
        if (confirm(' ¿ DESEA CONFIRMAR ESTE CLIENTE ? ')) {
            $.get('confirmarcliente', {macradio: macradio, nombreclienteradio: nombreclienteradio, ipradiocliente: ipradiocliente, idservicio: idservicio, nombreclientejosandro: nombreclientejosandro, ipradioclientejosandro: ipradioclientejosandro, ipantena: ipantena, municipio: municipioservicio, macValidada: macValidada}, setConfirmarCliente, 'json');
            activarBloqueoAjax();
        } else {
            return false;
        }
    }
}
function setConfirmarCliente(datos) {
    if (parseInt(datos['msg']) === 5) {
        alert('CLIENTE CONFIRMADO EXITOSAMENTE. \nPUEDE QUE TENGAS QUE ESPERAR MIENTRAS LA ANTENA DEL CLIENTE SE REINICIA \nPARA PODER ACCEDER A ELLA.');
        //Actualizar Tabla Estaciones
        $.get('verestacionesantena', {ipantena: datos['ipantena'], comunidadsnmp: datos['comunidadsnmp']}, setEstacionesAntena, 'json');
        activarBloqueoAjax();

    } else if (parseInt(datos['msg']) === 2 || parseInt(datos['msg']) === 4) {
        alert('ERROR! SE HA PRESENTADO UN INCONVENIENTE EN LA CONFIRMACION DEL CLIENTE. POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR DEL SISTEMA.');
    } else if (parseInt(datos['msg']) === 1) {
        alert('ERROR! NO SE PUDO ACCEDER AL RADIO DEL CLIENTE. \nCREDENCIALES INVALIDAS.');
    } else if (parseInt(datos['msg']) === 6) {
        alert('ANTENA FUERA DE SERVICIO ! ! !');
    } else if (parseInt(datos['msg']) === 7) {
        alert('DIRECCION IP DE ANTENA NO VALIDA.');
    } else {
        alert("ERROR! NO SE PUDO ACCEDER AL RADIO DEL CLIENTE. \nPOR FAVOR COMUNIQUESE CON EL ADMINISTRADOR DEL SISTEMA.");
    }
}

function verActualizarFirmware(pk_antena_id, ipantena) {
    $.get('actualizar-firmware', {pk_antena_id: pk_antena_id, ipantena: ipantena}, setFormulario, 'json');
    activarBloqueoAjax();
}

//function actualizarFirmware() {        
//    $.ajax({
//        data: $("#formAntenaFirmware").serialize(), //datos que se envian a traves de ajax
//        url: 'actualizarfirmware', //archivo que recibe la peticion
//        type: 'post', //método de envio
//        beforeSend: function () {
//            $("#ipantena").html("Procesando, espere por favor...");
//        },
//        success: function (response) { //una vez que el archivo recibe el request lo procesa y lo devuelve
//            $("#ipantena").html(response);
//        }
//    });
//}
//function setActualizarFirmware(datos) {
//    console.log(datos)
//    if (datos === 5) {
//        document.location.href = '/sw2click/modulos/infraestructura/antenas?msg=5';
//    } else if (datos === 1) {
//        alert('ERROR! NO SE PUDO ACCEDER A LA ANTENA. \nCREDENCIALES INVALIDAS.');
//    } else {
//        alert("ERROR! NO SE PUDO ACCEDER A LA ANTENA. \nPOR FAVOR COMUNIQUESE CON EL ADMINISTRADOR DEL SISTEMA.");
//    }
//}

//ACTUALIZAR Detalle Inicio Antena
function actualizarDetalleInicioAntena(ipantena, comunidadsnmp) {
    $.get('actualizardetalleinicioantena', {ipantena: ipantena, comunidadsnmp: comunidadsnmp}, setActualizarDetalleInicioAntena, 'json');
    activarBloqueoAjax();
}
function setActualizarDetalleInicioAntena(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#modelodispositivo").html(datos['datos']['modelodispositivo']);
        $("#nombredispositivo").html(datos['datos']['nombredispositivo']);
//        $("#modomascarared").html(datos['datos']['modomascarared']);
        $("#modoinalambrico").html(datos['datos']['modoinalambrico']);
        $("#ssid").html(datos['datos']['ssid']);
        $("#seguridad").html(datos['datos']['seguridad']);
        $("#version").html(datos['datos']['version']);
        $("#tiempoactivo").html(datos['datos']['tiempoactivo']);
//        $("#fecha").html(datos['datos']['fecha']);
        $("#canalfrecuencia").html(datos['datos']['canalfrecuencia']);
        $("#anchocanal").html(datos['datos']['anchocanal']);
        $("#bandafrecuencia").html(datos['datos']['bandafrecuencia']);
        $("#distancia").html(datos['datos']['distancia']);
//        $("#cadenatxrx").html(datos['datos']['cadenatxrx']);
        $("#potenciatx").html(datos['datos']['potenciatx']);
        $("#antena").html(datos['datos']['antena']);
        $("#wlan0mac").html(datos['datos']['wlan0mac']);
        $("#lan0mac").html(datos['datos']['lan0mac']);
        $("#lan0").html(datos['datos']['lan0']);
//        $("#cpu").html(datos['datos']['cpu']);
//        $("#memory").html(datos['datos']['memory']);
        $("#apmac").html(datos['datos']['apmac']);
        $("#conexiones").html(datos['datos']['conexiones']);
        $("#umbralminimoruido").html(datos['datos']['umbralminimoruido']);
        $("#transmitirccq").html(datos['datos']['transmitirccq']);
        $("#airmax").html(datos['datos']['airmax']);
        $("#calidadairmax").html(datos['datos']['calidadairmax']);
        $("#capacidadairmax").html(datos['datos']['capacidadairmax']);
        $("#airSelect").html(datos['datos']['airSelect']);
//        $("#unms").html(datos['datos']['unms']);                
    } else if (parseInt(datos['error']) === 2) {
        alert("NO SE ENCONTRARON DATOS.");
    } else if (parseInt(datos['error']) === 3) {
        alert("ANTENA FUERA DE SERVICIO ! ! !");
    } else if (parseInt(datos['error']) === 4) {
        alert("DIRECCION IP DE ANTENA NO VALIDA.");
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
        $("#divDetalleInicioAntena").hide('slow');
    }
}

//FUncion para mostrar tabla con las estaciones conectadas a una antena
function verEstacionesAntena(ipantena, comunidadsnmp) {
    $.get('verestacionesantena', {ipantena: ipantena, comunidadsnmp: comunidadsnmp}, setEstacionesAntena, 'json');
    activarBloqueoAjax();
}
function setEstacionesAntena(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divEstacionesAntena").show('slow');
        $("#divEstacionesAntena").html(datos['html']);
        oTable1 = $('#tabla').dataTable({
            "scrollX": true,
            "iDisplayLength": 25,
            "sPaginationType": "full_numbers",
            "oLanguage": {
                "sLengthMenu": "MOSTRAR: _MENU_ REGISTROS POR PAGINA",
                "sZeroRecords": "NO SE HA ENCONTRADO INFORMACION",
                "sInfo": "MOSTRANDO <b>_START_</b> A <b>_END_</b> REGISTROS <br>TOTAL REGISTROS: <b>_TOTAL_</b> REGISTROS</b>",
                "sInfoEmpty": "MOSTRANDO 0 A 0 REGISTROS",
                "sInfoFiltered": "(FILTRADOS DE UN TOTAL DE <b>_MAX_</b> REGISTROS)",
                "sSearch": "BUSCAR: ",
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
        $('#tabla tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            } else {
                oTable1.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });
    } else if (parseInt(datos['error']) === 2) {
        alert("NO SE ENCONTRO ESTACIONES CONECTADAS.");
        $("#divEstacionesAntena").hide('slow');
    } else if (parseInt(datos['error']) === 3) {
        alert("ANTENA FUERA DE SERVICIO ! ! !");
        $("#divEstacionesAntena").hide('slow');
    } else if (parseInt(datos['error']) === 4) {
        alert("DIRECCION IP DE ANTENA NO VALIDA.");
        $("#divEstacionesAntena").hide('slow');
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
        $("#divEstacionesAntena").hide('slow');
    }
}

function setFormulario(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divContenido").html(datos['html']);
        $("#modalFormulario").modal('show');
    } else if (parseInt(datos['error']) === 2) {
        alert(" [ ERROR ] -- NO SE PUDO ACCEDER A LA ANTENA. \n\n CREDENCIALES INVALIDAS.");
    } else if (parseInt(datos['error']) === 3) {
        alert("ANTENA FUERA DE SERVICIO ! ! !");
    } else if (parseInt(datos['error']) === 4) {
        alert("DIRECCION IP DE ANTENA NO VALIDA.");
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function ocultarSnmp() {
    if ($("#agentesnmpstatus").prop("checked")) {
        $("#comunidadsnmp").attr('required', 'required');
        $("#contacto").attr('required', 'required');
        $("#ubicacion").attr('required', 'required');
        $("#infoSnmp").show('slow');
    } else {
        $("#comunidadsnmp").removeAttr('required');
        $("#contacto").removeAttr('required');
        $("#ubicacion").removeAttr('required');
        $("#infoSnmp").hide('slow');
    }
}

function ocultarreglaCortafuegos() {
    if ($("#activarcortafuegos").prop("checked")) {
        $("#destino").attr('required', 'required');
        $("#interfaz").attr('required', 'required');
        $("#tipoip").attr('required', 'required');
        $("#puerto").attr('required', 'required');
        $("#infoCortafuegos").show('slow');
    } else {
        $("#destino").removeAttr('required');
        $("#interfaz").removeAttr('required');
        $("#tipoip").removeAttr('required');
        $("#puerto").removeAttr('required');
        $("#infoCortafuegos").hide('slow');
    }
}

function ocultarreglaCienteNTP() {
    if ($("#cliententp").prop("checked")) {
        $("#servidorntp").attr('required', 'required');
        $("#infoclienteNTP").show('slow');
    } else {
        $("#servidorntp").removeAttr('required');
        $("#infoclienteNTP").hide('slow');
    }
}

function ocultarAgregacion() {
    if ($("#activaragregacion").prop("checked")) {
        $("#marcos").attr('required', 'required');
        $("#bytes").attr('required', 'required');
        $("#infoAgregacion").show('slow');
    } else {
        $("#marcos").removeAttr('required');
        $("#bytes").removeAttr('required');
        $("#infoAgregacion").hide('slow');
    }
}

function infoSistemaElectrico(sistemaelectrico) {
    if (sistemaelectrico === 'Panel Solar') {
        $("#divSistemaElectricoPanelSolar").show('slow');
    } else {
        $("#numpanel").val('');
        $("#numbateria").val('');
        $("#potencia").val('');
        $("#numequipo").val('');
        $("#divSistemaElectricoPanelSolar").hide('slow');
    }
}

function habilitarBotonActualizar() {
    $("#btnActualizar").removeAttr('disabled');
}

//FRECUENCIAS POR PAISES
function frecuenciasPais() {
    if ($("#codigopais").val() === '511') {
//        Lista de Frecuencias Compliance Test
        $("#infolistafrecuencias").html('<select class="form-control" id="listafrecuencias" name="listafrecuencias" required><option value="0">auto</option><option value="4920">4920</option><option value="4925">4925</option><option value="4930">4930</option><option value="4935">4935</option><option value="4940">4940</option><option value="4945">4945</option><option value="4950">4950</option><option value="4955">4955</option><option value="4960">4960</option><option value="4965">4965</option><option value="4970">4970</option><option value="4975">4975</option><option value="4980">4980</option><option value="4985">4985</option><option value="4990">4990</option><option value="4995">4995</option><option value="5000">5000</option><option value="5005">5005</option><option value="5010">5010</option><option value="5015">5015</option><option value="5020">5020</option><option value="5025">5025</option><option value="5030">5030</option><option value="5035">5035</option><option value="5040">5040</option><option value="5045">5045</option><option value="5050">5050</option><option value="5055">5055</option><option value="5060">5060</option><option value="5065">5065</option><option value="5070">5070</option><option value="5075">5075</option><option value="5080">5080</option><option value="5085">5085</option><option value="5090">5090</option><option value="5095">5095</option><option value="5100">5100</option><option value="5105">5105</option><option value="5110">5110</option><option value="5115">5115</option><option value="5120">5120</option><option value="5125">5125</option><option value="5130">5130</option><option value="5135">5135</option><option value="5140">5140</option><option value="5145">5145</option><option value="5150">5150</option><option value="5155">5155</option><option value="5160">5160</option><option value="5165">5165</option><option value="5170">5170</option><option value="5175">5175</option><option value="5180">5180</option><option value="5185">5185</option><option value="5190">5190</option><option value="5195">5195</option><option value="5200">5200</option><option value="5205">5205</option><option value="5210">5210</option><option value="5215">5215</option><option value="5220">5220</option><option value="5225">5225</option><option value="5230">5230</option><option value="5235">5235</option><option value="5240">5240</option><option value="5245">5245</option><option value="5250">5250</option><option value="5255">5255</option><option value="5260">5260</option><option value="5265">5265</option><option value="5270">5270</option><option value="5275">5275</option><option value="5280">5280</option><option value="5285">5285</option><option value="5290">5290</option><option value="5295">5295</option><option value="5300">5300</option><option value="5305">5305</option><option value="5310">5310</option><option value="5315">5315</option><option value="5320">5320</option><option value="5325">5325</option><option value="5330">5330</option><option value="5335">5335</option><option value="5340">5340</option><option value="5345">5345</option><option value="5350">5350</option><option value="5355">5355</option><option value="5360">5360</option><option value="5365">5365</option><option value="5370">5370</option><option value="5375">5375</option><option value="5380">5380</option><option value="5385">5385</option><option value="5390">5390</option><option value="5395">5395</option><option value="5400">5400</option><option value="5405">5405</option><option value="5410">5410</option><option value="5415">5415</option><option value="5420">5420</option><option value="5425">5425</option><option value="5430">5430</option><option value="5435">5435</option><option value="5440">5440</option><option value="5445">5445</option><option value="5450">5450</option><option value="5455">5455</option><option value="5460">5460</option><option value="5465">5465</option><option value="5470">5470</option><option value="5475">5475</option><option value="5480">5480</option><option value="5485">5485</option><option value="5490">5490</option><option value="5495">5495</option><option value="5500">5500</option><option value="5505">5505</option><option value="5510">5510</option><option value="5515">5515</option><option value="5520">5520</option><option value="5525">5525</option><option value="5530">5530</option><option value="5535">5535</option><option value="5540">5540</option><option value="5545">5545</option><option value="5550">5550</option><option value="5555">5555</option><option value="5560">5560</option><option value="5565">5565</option><option value="5570">5570</option><option value="5575">5575</option><option value="5580">5580</option><option value="5585">5585</option><option value="5590">5590</option><option value="5595">5595</option><option value="5600">5600</option><option value="5605">5605</option><option value="5610">5610</option><option value="5615">5615</option><option value="5620">5620</option><option value="5625">5625</option><option value="5630">5630</option><option value="5635">5635</option><option value="5640">5640</option><option value="5645">5645</option><option value="5650">5650</option><option value="5655">5655</option><option value="5660">5660</option><option value="5665">5665</option><option value="5670">5670</option><option value="5675">5675</option><option value="5680">5680</option><option value="5685">5685</option><option value="5690">5690</option><option value="5695">5695</option><option value="5700">5700</option><option value="5705">5705</option><option value="5710">5710</option><option value="5715">5715</option><option value="5720">5720</option><option value="5725">5725</option><option value="5730">5730</option><option value="5735">5735</option><option value="5740">5740</option><option value="5745">5745</option><option value="5750">5750</option><option value="5755">5755</option><option value="5760">5760</option><option value="5765">5765</option><option value="5770">5770</option><option value="5775">5775</option><option value="5780">5780</option><option value="5785">5785</option><option value="5790">5790</option><option value="5795">5795</option><option value="5800">5800</option><option value="5805">5805</option><option value="5810">5810</option><option value="5815">5815</option><option value="5820">5820</option><option value="5825">5825</option><option value="5830">5830</option><option value="5835">5835</option><option value="5840">5840</option><option value="5845">5845</option><option value="5850">5850</option><option value="5855">5855</option><option value="5860">5860</option><option value="5865">5865</option><option value="5870">5870</option><option value="5875">5875</option><option value="5880">5880</option><option value="5885">5885</option><option value="5890">5890</option><option value="5895">5895</option><option value="5900">5900</option><option value="5905">5905</option><option value="5910">5910</option><option value="5915">5915</option><option value="5920">5920</option><option value="5925">5925</option><option value="5930">5930</option><option value="5935">5935</option><option value="5940">5940</option><option value="5945">5945</option><option value="5950">5950</option><option value="5955">5955</option><option value="5960">5960</option><option value="5965">5965</option><option value="5970">5970</option><option value="5975">5975</option><option value="5980">5980</option><option value="5985">5985</option><option value="5990">5990</option><option value="5995">5995</option><option value="6000">6000</option><option value="6005">6005</option><option value="6010">6010</option><option value="6015">6015</option><option value="6020">6020</option><option value="6025">6025</option><option value="6030">6030</option><option value="6035">6035</option><option value="6040">6040</option><option value="6045">6045</option><option value="6050">6050</option><option value="6055">6055</option><option value="6060">6060</option><option value="6065">6065</option><option value="6070">6070</option>option value="6075">6075</option><option value="6080">6080</option><option value="6085">6085</option><option value="6090">6090</option><option value="6095">6095</option><option value="6100">6100</option></select>');
        $("#listafrecuencias").focus();
    } else {
//        Lista de Frecuencias Trinidad and Tobago
        $("#infolistafrecuencias").html('<select class="form-control" id="listafrecuencias" name="listafrecuencias" required><option value="0">auto</option><option value="5180">5180</option><option value="5185">5185</option><option value="5190">5190</option><option value="5195">5195</option><option value="5200">5200</option><option value="5205">5205</option><option value="5210">5210</option><option value="5215">5215</option><option value="5220">5220</option><option value="5225">5225</option><option value="5230">5230</option><option value="5235">5235</option><option value="5240">5240</option><option value="5260" class="">5260 (DFS)</option><option value="5265" class="">5265 (DFS)</option><option value="5270" class="">5270 (DFS)</option><option value="5275" class="">5275 (DFS)</option><option value="5280" class="">5280 (DFS)</option><option value="5285" class="">5285 (DFS)</option><option value="5290" class="">5290 (DFS)</option><option value="5295" class="">5295 (DFS)</option><option value="5300" class="">5300 (DFS)</option><option value="5305" class="">5305 (DFS)</option><option value="5310" class="">5310 (DFS)</option><option value="5315" class="">5315 (DFS)</option><option value="5320" class="">5320 (DFS)</option><option value="5500" class="">5500 (DFS)</option><option value="5505" class="">5505 (DFS)</option><option value="5510" class="">5510 (DFS)</option><option value="5515" class="">5515 (DFS)</option><option value="5520" class="">5520 (DFS)</option><option value="5525" class="">5525 (DFS)</option><option value="5530" class="">5530 (DFS)</option><option value="5535" class="">5535 (DFS)</option><option value="5540" class="">5540 (DFS)</option><option value="5545" class="">5545 (DFS)</option><option value="5550" class="">5550 (DFS)</option><option value="5555" class="">5555 (DFS)</option><option value="5560" class="">5560 (DFS)</option><option value="5565" class="">5565 (DFS)</option><option value="5570" class="">5570 (DFS)</option><option value="5575" class="">5575 (DFS)</option><option value="5580" class="">5580 (DFS)</option><option value="5585" class="">5585 (DFS)</option><option value="5590" class="">5590 (DFS)</option><option value="5595" class="">5595 (DFS)</option><option value="5600" class="">5600 (DFS)</option><option value="5605" class="">5605 (DFS)</option><option value="5610" class="">5610 (DFS)</option><option value="5615" class="">5615 (DFS)</option><option value="5620" class="">5620 (DFS)</option><option value="5625" class="">5625 (DFS)</option><option value="5630" class="">5630 (DFS)</option><option value="5635" class="">5635 (DFS)</option><option value="5640" class="">5640 (DFS)</option><option value="5645" class="">5645 (DFS)</option><option value="5650" class="">5650 (DFS)</option><option value="5655" class="">5655 (DFS)</option><option value="5660" class="">5660 (DFS)</option><option value="5665" class="">5665 (DFS)</option><option value="5670" class="">5670 (DFS)</option><option value="5675" class="">5675 (DFS)</option><option value="5680" class="">5680 (DFS)</option><option value="5685" class="">5685 (DFS)</option><option value="5690" class="">5690 (DFS)</option><option value="5695" class="">5695 (DFS)</option><option value="5700" class="">5700 (DFS)</option><option value="5745">5745</option><option value="5750">5750</option><option value="5755">5755</option><option value="5760">5760</option><option value="5765">5765</option><option value="5770">5770</option><option value="5775">5775</option><option value="5780">5780</option><option value="5785">5785</option><option value="5790">5790</option><option value="5795">5795</option><option value="5800">5800</option><option value="5805">5805</option><option value="5810">5810</option><option value="5815">5815</option><option value="5820">5820</option><option value="5825">5825</option></select>');
        $("#listafrecuencias").focus();
    }
}

//Funcion para mostrar Clave WPA compartida previamente: (Wireless)
function mostrarClave() {
    if ($("#mostrarclavewpacompartidapreviamente").prop("checked")) {
        $('#clavewpacompartidapreviamente').attr('type', 'text');

    } else {
        $('#clavewpacompartidapreviamente').attr('type', 'password');
    }
    if ($("#mostrarclavewpacompartidapreviamente_old").prop("checked")) {
        $('#clavewpacompartidapreviamente_old').attr('type', 'text');

    } else {
        $('#clavewpacompartidapreviamente_old').attr('type', 'password');
    }
}

function activarMacAcl() {
    if ($("#macacl").prop("checked")) {
        $("#politica").attr('required', 'required');
        $("#infomacacl").show('slow');
    } else {
        $("#politica").removeAttr('required');
        $("#infomacacl").hide('slow');
    }
}

function mostrarOcultarSeguridad(seguridad) {
    if (seguridad === 'none' || seguridad === '') {
        $("#autenticacionwpa").removeAttr('required');
        $("#clavewpacompartidapreviamente").removeAttr('required');
        $("#clavewpacompartidapreviamente_old").removeAttr('required');
        $("#clavewpacompartidapreviamente_old").removeAttr('required');
        $("#requiredautenticacionwpa").removeAttr('required');
        $("#infoseguridad").hide('slow');
    } else {
        $("#autenticacionwpa").attr('required', 'required');
        $("#clavewpacompartidapreviamente").attr('required', 'required');
        $("#clavewpacompartidapreviamente_old").attr('required', 'required');
        $("#requiredautenticacionwpa").attr('required', 'required');
        $("#infoseguridad").show('slow');
    }
}

//Funcion utilizada para cambiar contraseña de la antena, valida que la contraseña nuevas
//introducidas coincidada
function validarContrasenia() {
    var contrasenia_new = $("#contrasenia_new").val();
    var contrasenia_new_confirm = $("#contrasenia_new_confirm").val();
    if (contrasenia_new === contrasenia_new_confirm) {
        return confirm(' ¿ DESEA CAMBIAR LA CONTRASEÑA A ESTA ANTENA ? ');
    } else {
        alert("LAS CONTRASEÑAS NO COINCIDEN!");
        return false;
    }
}


//Funcion utilizada Para validar que Snmp Este activo
function validarSnmp() {
    $("#btnRegistrar").attr('disabled', 'disabled');
    if ($("#ipantena").val() !== '') {
        $.get('existeantena', {ipantena: $("#ipantena").val()}, setExisteAntena, 'json');
        activarBloqueoAjax();
    } else {
        alert('DIRECCION IP DE ANTENA REQUERIDA !');
        $("#ipantena").focus();
        return false;
    }
}
function setExisteAntena(datos) {
    if (parseInt(datos['error']) === 0) {
        if (parseInt(datos['existe']) === 1) {
            $("#ipantena").val('');
            $("#ipantena").focus();
            $("#divValidarSnmp").hide('slow');
            alert("ANTENA YA REGISTRADA EN EL SISTEMA.");
            $("#btnRegistrar").attr('disabled', 'disabled');
            return false;
        } else {
            $("#divValidarSnmp").html('<h4 style="color: #FFFF00"> VALIDANDO SNMP... </h4>');
            $("#divValidarSnmp").show('slow');
            $("#btnRegistrar").attr('disabled', 'disabled');
            $("#btnSnmp").attr('disabled', 'disabled');
            $.get('validarsnmp', {ipantena: $("#ipantena").val()}, setValidarSnmp, 'json');
            activarBloqueoAjax();
        }
    } else {
        $("#divValidarSnmp").hide('slow');
        $("#btnRegistrar").attr('disabled', 'disabled');
        alert("SE HA PRESENTADO UN ERROR EN EL SISTEMA. \nPOR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}
function setValidarSnmp(datos) {
    if (parseInt(datos['error']) === 0) {
        if (parseInt(datos['activado']) === 1) {
            if (datos['comunidadsnmp'] === "doble2") {
                $("#divValidarSnmp").html('<h4 style="color: #00FF80"> ANTENA CON SNMP ACTIVO Y CONFIGURADO ! <br>Antes de continuar con el registro verifique que la ANTENA se encuentra activa.</h4><button type="button" class="btn btn-primary" value="Cambiar Antena" title="Cambiar Direccion IP de Antena" onclick="cambiarIPAntena()">Cambiar Antena</button><button type="button" class="btn btn-primary" value="Ping" title="Hacer Ping" onclick="ping()">Ping</button><div id="divPing" hidden>');
                $("#divValidarSnmp").show('slow');
                $("#ipantena").attr('readonly', 'readonly');
                $("#btnRegistrar").removeAttr('disabled');
                return false;
            } else {
                if (confirm('COMUNIDAD SNMP DESCONOCIDA. ¿ DESEA CONFIGURARLA ?')) {
                    $("#divValidarSnmp").html('<h4 style="color: #FFFF00"> CONFIGURANDO COMUNIDAD SNMP... </h4>');
                    $("#divValidarSnmp").show('slow');
                    $("#btnRegistrar").attr('disabled', 'disabled');
                    $.get('activarsnmp', {ipantena: datos['ipantena']}, setActivarSnmp, 'json');
                    activarBloqueoAjax();
                } else {
                    $("#divValidarSnmp").hide('slow');
                    $("#btnRegistrar").attr('disabled', 'disabled');
                    $("#btnSnmp").removeAttr('disabled');
                }
            }
        } else {
            if (confirm('SNMP DESACTIVADO. ¿ DESEA ACTIVAR SNMP ?')) {
                $("#divValidarSnmp").html('<h4 style="color: #FFFF00"> ACTIVANDO SNMP... </h4>');
                $("#divValidarSnmp").show('slow');
                $.get('activarsnmp', {ipantena: datos['ipantena']}, setActivarSnmp, 'json');
                activarBloqueoAjax();
            } else {
                $("#divValidarSnmp").hide('slow');
                $("#btnRegistrar").attr('disabled', 'disabled');
                $("#btnSnmp").removeAttr('disabled');
            }
        }
    } else if (parseInt(datos['error']) === 4) {
        $("#divValidarSnmp").hide('slow');
        $("#ipantena").focus();
        $("#btnRegistrar").attr('disabled', 'disabled');
        $("#btnSnmp").removeAttr('disabled');
        alert("DIRECCION IP DE ANTENA NO VALIDA ! ! !");
        return false;
    } else if (parseInt(datos['error']) === 3) {
        $("#divValidarSnmp").hide('slow');
        $("#ipantena").focus();
        $("#btnRegistrar").attr('disabled', 'disabled');
        $("#btnSnmp").removeAttr('disabled');
        alert("ANTENA FUERA DE SERVICIO ! ! !");
        return false;
    } else if (parseInt(datos['error']) === 2) {
        $("#divValidarSnmp").hide('slow');
        $("#ipantena").focus();
        $("#btnRegistrar").attr('disabled', 'disabled');
        $("#btnSnmp").removeAttr('disabled');
        alert('NO SE PUDO ACCEDER A LA ANTENA. \nCREDENCIALES INVALIDAS.');
        return false;
    } else {
        $("#divValidarSnmp").hide('slow');
        $("#ipantena").focus();
        $("#btnRegistrar").attr('disabled', 'disabled');
        alert("SE HA PRESENTADO UN ERROR EN EL SISTEMA. \nPOR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
        return false;
    }
}
function setActivarSnmp(datos) {
    if (parseInt(datos['error']) === 0) {
        if (parseInt(datos['snmp']) === 1) {
            $("#divValidarSnmp").html('<h4 style="color: #00FF80"> SNMP ACTIVADO Y CONFIGURADO CON EXITO ! LA ANTENA SE HA REINICIADO.<br>Antes de continuar con el registro verifique que la ANTENA se encuentra activa.. </h4><button type="button" class="btn btn-primary" value="Cambiar Antena" title="Cambiar Direccion IP de Antena" onclick="cambiarIPAntena()">Cambiar Antena</button><button type="button" class="btn btn-primary" value="Ping" title="Hacer Ping" onclick="ping()">Ping</button><div id="divPing" hidden></div>');
            $("#divValidarSnmp").show('slow');
            $("#ipantena").attr('readonly', 'readonly');
            $("#btnRegistrar").removeAttr('disabled');
            $("#btnSnmp").attr('disabled', 'disabled');
            return false;
        } else {
            $("#divValidarSnmp").html('<h4 style="color: #ff0000"> NO SE HA PODIDO EJECUTAR LA ACCION SOLICITADA ! <br>POR FAVOR COMINUQUESE CON EL ADMINISTRADOR DEL SISTEMA. </h4><button type="button" class="btn btn-primary" value="Cambiar Antena" title="Cambiar Direccion IP de Antena" onclick="cambiarIPAntena()">Cambiar Antena</button><button type="button" class="btn btn-primary" value="Ping" title="Hacer Ping" onclick="ping()">Ping</button><div id="divPing" hidden></div>');
            $("#divValidarSnmp").show('slow');
            $("#btnRegistrar").attr('disabled', 'disabled');
            return false;
        }
    } else if (parseInt(datos['error']) === 4) {
        $("#btnRegistrar").attr('disabled', 'disabled');
        $("#btnSnmp").removeAttr('disabled');
        $("#divValidarSnmp").hide('slow');
        alert("DIRECCION IP DE ANTENA NO VALIDA ! ! !");
        return false;
    } else if (parseInt(datos['error']) === 3) {
        $("#btnRegistrar").attr('disabled', 'disabled');
        $("#btnSnmp").removeAttr('disabled');
        $("#divValidarSnmp").hide('slow');
        alert("ANTENA FUERA DE SERVICIO ! ! !");
        return false;
    } else if (parseInt(datos['error']) === 2) {
        $("#btnRegistrar").attr('disabled', 'disabled');
        $("#btnSnmp").removeAttr('disabled');
        $("#divValidarSnmp").hide('slow');
        alert('NO SE PUDO ACCEDER A LA ANTENA. \nCREDENCIALES INVALIDAS.');
        return false;
    } else {
        $("#btnRegistrar").attr('disabled', 'disabled');
        $("#btnSnmp").removeAttr('disabled');
        $("#divValidarSnmp").hide('slow');
        alert("SE HA PRESENTADO UN ERROR EN EL SISTEMA. \nPOR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
        return false;
    }
}

function cambiarIPAntena() {
    $("#ipantena").removeAttr('readonly');
    $("#ipantena").focus();
    $("#btnRegistrar").attr('disabled', 'disabled');
    $("#btnSnmp").removeAttr('disabled');
    $("#divValidarSnmp").hide('slow');
}

function ping() {
    $("#divPing").html('<h4 style="color: #FFFF00"> HACIENDO PING... </h4>');
    $("#divPing").show('slow');
    $.get('ping', {ipantena: $("#ipantena").val()}, setPing, 'json');
    activarBloqueoAjax();
}
function setPing(ping) {
    if (parseInt(ping) === 4) {
        alert("PING RECIBIDO !");
        $("#divPing").hide('slow');
    } else if (parseInt(ping) === 3) {
        alert("ANTENA FUERA DE SERVICIO !");
        $("#divPing").hide('slow');
    } else if (parseInt(ping) === 2) {
        alert("DIRECCION IP NO VALIDA !");
        $("#divPing").hide('slow');
    } else if (parseInt(ping) === 1) {
        $("#divPing").hide('slow');
        alert("SE HA PRESENTADO UN ERROR EN EL SISTEMA. \nPOR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    } else {
        $("#divPing").hide('slow');
        alert("SE HA PRESENTADO UN ERROR EN EL SISTEMA. \nPOR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

//------------------------------------------------------------------------------

function verServicios(idAntenaTX, ipantena) {
    $.get("ver-servicios", {idAntenaTX: idAntenaTX, ipantena: ipantena}, setFormularioServicio, "json");
    activarBloqueoAjax();
}
function verServicioONE(idServicio) {
    $.get("ver-servicio-one", {idServicio: idServicio}, setFormularioServicio, "json");
    activarBloqueoAjax();
}

function setFormularioServicio(respuestaServidor) {
    if (parseInt(respuestaServidor['error']) === 2) {
        alert("NO SE ENCONTRO SERVICIOS ENGANCHADOS A LA ANTENA.");
        return false;
    }
    if (parseInt(respuestaServidor['error']) === 1) {
        alert("SE HA PRESENTADO UN ERROR EN EL SISTEMA. \nPOR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
        return false;
    }
    if (parseInt(respuestaServidor['error']) === 0) {
        if (parseInt(respuestaServidor['desde']) === 1) {
            $("#divAnexar").html(respuestaServidor['html']);
            $("#modalAnexar").modal('show');
            $(document).ready(function () {
                oTable = $('#tabla-servicios').dataTable({
                    "scrollX": true,
                    "iDisplayLength": 25,
                    "sPaginationType": "full_numbers",
                    "oLanguage": {
                        "sLengthMenu": "MOSTRAR: _MENU_ REGISTROS POR PAGINA",
                        "sZeroRecords": "NO SE HA ENCONTRADO INFORMACION",
                        "sInfo": "MOSTRANDO <b>_START_</b> A <b>_END_</b> REGISTROS <br>TOTAL REGISTROS: <b>_TOTAL_</b> REGISTROS</b>",
                        "sInfoEmpty": "MOSTRANDO 0 A 0 REGISTROS",
                        "sInfoFiltered": "(FILTRADOS DE UN TOTAL DE <b>_MAX_</b> REGISTROS)",
                        "sSearch": "BUSCAR:",
                        "sEmptyTable": "NO HAY INFORMACION DISPONIBLE PARA LA TABLA",
                        "oPaginate": {
                            "sFirst": "<i class='fa fa-fast-backward' aria-hidden='true' title='Inicio'></i>",
                            "sPrevious": "<i class='fa fa-step-backward' aria-hidden='true' title='Anterior'></i>",
                            "sNext": "<i class='fa fa-step-forward' aria-hidden='true' title='Siguiente'></i>",
                            "sLast": "<i class='fa fa-fast-forward' aria-hidden='true' title='Fin'></i>",
                        }
                    },
                    "aaSorting": [[0, "desc"]],
                });
                $('#tabla-servicios tbody').on('click', 'tr', function () {
                    if ($(this).hasClass('selected')) {
                        $(this).removeClass('selected');
                    } else {
                        oTable.$('tr.selected').removeClass('selected');
                        $(this).addClass('selected');
                    }
                });
            });
        }
        if (parseInt(respuestaServidor['desde']) === 2) {
            $("#divContenido").html(respuestaServidor['html']);
            $("#modalFormulario").modal('show');
        }
    }
}

//------------------------------------------------------------------------------
function buscarServicioAntena(idAntenaTX) {
    var idContrato = prompt("INGRESA EL ID DEl CONTRATO");
    if (idContrato === null)
        return false;
    if (idContrato !== '') {
        if (!isNaN(idContrato))
            $.get('serviciosContrato', {idContrato: idContrato, idAntenaTX: idAntenaTX}, setFormularioServiciosContrato, 'json'), activarBloqueoAjax();
        else
            buscarServicioAntena();

    } else
        buscarServicioAntena();
}
function setFormularioServiciosContrato(respuestaServidor) {
    if (parseInt(respuestaServidor['error']) === 2) {
        alert("NO SE ENCONTRARON SERVICIOS DISPONIBLES.");
        buscarServicioAntena();
    }
    if (parseInt(respuestaServidor['error']) === 0) {
        $("#divAnexar").html(respuestaServidor['html']);
        $("#modalAnexar").modal('show');
        $(document).ready(function () {
            oTable = $('#tablaServiciosContrato').dataTable({
                "scrollX": true,
                "iDisplayLength": 25,
                "sPaginationType": "full_numbers",
                "oLanguage": {
                    "sLengthMenu": "MOSTRAR: _MENU_ REGISTROS POR PAGINA",
                    "sZeroRecords": "NO SE HA ENCONTRADO INFORMACION",
                    "sInfo": "MOSTRANDO <b>_START_</b> A <b>_END_</b> REGISTROS <br>TOTAL REGISTROS: <b>_TOTAL_</b> REGISTROS</b>",
                    "sInfoEmpty": "MOSTRANDO 0 A 0 REGISTROS",
                    "sInfoFiltered": "(FILTRADOS DE UN TOTAL DE <b>_MAX_</b> REGISTROS)",
                    "sSearch": "BUSCAR:",
                    "sEmptyTable": "NO HAY INFORMACION DISPONIBLE PARA LA TABLA",
                    "oPaginate": {
                        "sFirst": "<i class='fa fa-fast-backward' aria-hidden='true' title='Inicio'></i>",
                        "sPrevious": "<i class='fa fa-step-backward' aria-hidden='true' title='Anterior'></i>",
                        "sNext": "<i class='fa fa-step-forward' aria-hidden='true' title='Siguiente'></i>",
                        "sLast": "<i class='fa fa-fast-forward' aria-hidden='true' title='Fin'></i>",
                    }
                },
                "aaSorting": [[0, "desc"]],
            });
            $('#tablaServiciosContrato tbody').on('click', 'tr', function () {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                } else {
                    oTable.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                }
            });
        });
    }
    if (parseInt(respuestaServidor['error']) === 1) {
        alert("SE HA PRESENTADO UN ERROR EN EL SISTEMA. \nPOR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
        return false;
    }
}

//------------------------------------------------------------------------------
