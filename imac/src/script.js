/* Inicialización de algunas variables globales */
var mostradores, indicemostrador, altura = 0, encv = false, retardo = 100, techs, indicetech,
paginasweb = [	{ 'url' : 'www.inspeccionamostuedificio.es', 'imagen' : 'inspeccionamostuedificio', 'tech' : [ 'html', 'javascript' , 'css' , 'jquery' , 'jqueryui' ] },
				{ 'url' : 'www.arqxml.es/westieinversiones', 'imagen' : 'westieinversiones', 'tech' : [ 'html', 'javascript' , 'css' ] },
				{ 'url' : 'www.arqxml.es', 'imagen' : 'arqxml', 'tech' : [ 'html', 'javascript' , 'css' , 'prototype', 'php', 'mysql', 'soap', 'xml', 'prototype', 'tcpdf' ] },
				{ 'url' : 'alkite.xarq.es', 'imagen' : 'alkite', 'tech' : [ 'html', 'javascript' , 'css' , 'jquery', 'openlayers', 'php', 'mysql', 'soap' ]},
				{ 'url' : 'www.arqxml.es/ite/consultasite', 'imagen' : 'consultasITE', 'tech' : [ 'html', 'javascript' , 'css' , 'jquery', 'jquerymobile', 'openlayers', 'php', 'mysql', 'soap' ]} ],
ipaginaweb = 0;
/* 	Punto de entrada 
	Tenemos en cuenta si el navegador soporta CSS Animations, según Modernizr:
	Caso afirmativo -> Usamos el evento para saber cuando acaba la animación de acercamiento del PC
	Caso negativo -> Ponemos un contador de tiempo antes de encender el PC.
*/
$(document).ready(function() {
	var e = document.getElementById('visiblepantalla');
	if ($('html').hasClass('cssanimations') && e.addEventListener ) {
		e.addEventListener('animationend', encenderPC, false);
		e.addEventListener('webkitAnimationEnd', encenderPC, false);
	} else {
		$('#ordenador').addClass('acercame');
		setTimeout('encenderPC()', 4000);
	}
});
/* Consultar o Actualizar cual es la página actualmente visible */
function pagActual(nuevapagina){
	if (typeof(nuevapagina) === 'string') {
		$('#visiblepantalla').data('paginaactual', nuevapagina);
	} else {
		return $('#visiblepantalla').data('paginaactual');
	}
}
/* Encendemos el PC */
function encenderPC() {
	$('#sociales').show();
	/*paginaactual = 'acceso';*/
	iraPagina(pagActual());
}
/* Mostramos otra página */
function iraPagina(paginaactual){
	$('.pagina', '#visiblepantalla').hide();
	$('.' + paginaactual, '#visiblepantalla').show();
	pagActual(paginaactual);
	if ($('.' + paginaactual, '#visiblepantalla').data('procesada') === 'no') {
		mostradores = $('.' + paginaactual + ' span.mostrando', '#visiblepantalla');
		indicemostrador = -1;
		preparaNuevoParrafo();
		setTimeout('irEscribiendo()', retardo);
	}
}
/* Escribir letra una a una */
function irEscribiendo() {
	var este = $(mostradores[indicemostrador]),
	entrada = este.siblings('span.entrada'),
	longeste = este.text().length,
	longentrada = entrada.text().length;
	if (longentrada < longeste) {
		entrada.append(este.text().substr(longentrada, 1));
		<!--document.getElementById('bleep').play();-->
		var tiempo = (este.text().substr(longentrada + 1, 1) === '.' ) ? retardo * 10 : retardo;
		altura = altura + 0.6;
		if (encv && altura < 194.5) {
			$('#cursorimagen').show();
			$('#foto').height(altura);
		} else {
			$('#cursorimagen').hide();
		}
		setTimeout('irEscribiendo()',tiempo);
	} else {
		entrada.text(entrada.text().replace(/#[A-Za-z]*#/gi, function(str) {
            return transcribir(str.replace(/#/gi,''));
		}));
		entrada.text(entrada.text().replace(/\([A-Z]\/[A-Z]\)/gi, function(str) {
			var opciones = [];
			opciones.push(str.substr(1,1),str.substr(3,1));
			entrada.after($('<span/>', { 'text' : '('}));
			var siguiente = entrada.next();
			siguiente.after($('<span/>', { 'class' : 'seleccionable portfolio', 'text' : opciones[0] }));
			var siguiente = siguiente.next();
			siguiente.click( function(){
				irPortfolio();
			});
			siguiente.after($('<span/>', { 'text' : '/'}));
			var siguiente = siguiente.next();
			siguiente.after($('<span/>', { 'class' : 'seleccionable noportfolio', 'text' : opciones[1] }));
			var siguiente = siguiente.next();
			siguiente.after($('<span/>', { 'text' : ')'}));
			var siguiente = siguiente.next();
			siguiente.after($('<input/>', { 'id' : 'aportfolio', 'name' : 'aportfolio', 'width' : '1em', 'type' : 'text'}));
			$('#aportfolio').focus();
			$(document).keypress(function(e) {
				var key = e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode);
				console.log(e);
				console.log(e.keyCode);
				console.log(e.which);
				console.log(key);
				console.log(String.fromCharCode(e.keyCode));
				if (key === 83 || key === 115) {
					irPortfolio();
				}
			});
			$('#aportfolio').change( function(){
				if ($(this).val().toUpperCase() === 'S') {
					irPortfolio();
				}
			});
			return '';
		}));
		encv = true;
		if (este.hasClass('temporal')) {
			setTimeout('desapareceyBorra()', retardo * 2);
		} else {
			preparaNuevoParrafo();
		}
	}
}
/* Transcribir elementos que se encuentran entre # */
function transcribir(texto) {
	var transcripciones = { 'arroba' : '@' };
	return (typeof(transcripciones[texto]) === 'string' ) ? transcripciones[texto] : '';
}
/* Saltamos a un nuevo párrafo para la escritura letra a letra */
function preparaNuevoParrafo() {
	indicemostrador++;
	var longmostrador = mostradores.length
	if (indicemostrador < longmostrador) {
		var este = $(mostradores[indicemostrador]),
		a = este.text().length;
		if ($('#cursor').length > 0 ) {
			$('#cursor').remove();
		}
		var cursor = $('<span/>', { id: 'cursor', text: '_'});
		este.parent().prepend(cursor);
		var entrada = $('<span/>', { 'class': 'entrada'});
		if (este.hasClass('temporal')) {
			entrada.addClass('temporal');	
		}
		este.parent().prepend(entrada);
		setTimeout('irEscribiendo()',retardo);
	} else {
		$('.' + pagActual(), '#visiblepantalla').data('procesada','si');
		/*document.getElementById('bleep').play();*/
		$('.' + pagActual() + ' .ira', '#visiblepantalla').click( function() {
			iraPagina($(this).data('destino'));
		})
		var destino = $(mostradores[indicemostrador - 1]).parent().data('destino');
		if (typeof(destino) === 'string') {
			iraPagina(destino);
		}
		document.getElementById('bleep').pause();
		/*clearInterval(intervaledor);
		mostradores.remove();*/
	}
}
/* Experimental pero no logro saber porque borra, a veces, los párrafos siguientes
function desapareceyBorra() {
	var este = $(mostradores[indicemostrador]),
	entrada = este.siblings('span.entrada.temporal');
	entrada.parent().hide();
	entrada.remove();
	preparaNuevoParrafo();
}*/
/* Vamos a otra página web del portfolio */
function cambiaWeb(direccion) {
	$('li','#tech').addClass('inactivo');
	if ($('#imagenweb').css('left') === '-450px' ) {
		moverImagenWeb(direccion);
	} else {
		$('#urlactiva').children('a').addClass('inactivo');
		$('span', '#controles').addClass('inactivo');
		$('#imagenweb').animate({ 'left' : 150 + ( direccion * 600) }, 2000, function(){ 
			moverImagenWeb(direccion); 
		});
	}
}
/* Gestión de los controles de avance y retroceso del portfolio*/
function gestionaControles() {
	if (ipaginaweb > 0) {
		$('span.retroceso', '#controles').removeClass('inactivo');
	} else {
		$('span.retroceso', '#controles').addClass('inactivo');
	}
	if (ipaginaweb < paginasweb.length - 1) {
		$('span.avance', '#controles').removeClass('inactivo');
	} else {
		$('span.avance', '#controles').addClass('inactivo');
	}
}
/* Procesar página del portfolio */
function irPortfolio() {
	$('div.principal', '#visiblepantalla').hide();
	$('div.portfolio', '#visiblepantalla').show();
	cambiaWeb(-1);
	$('span', '#controles').click(function() {
		if ($(this).hasClass('avance') && !$(this).hasClass('inactivo')) {
			ipaginaweb = ipaginaweb + 1;
			cambiaWeb(-1);
		} else 
			if ($(this).hasClass('retroceso') && !$(this).hasClass('inactivo')) {
				ipaginaweb = ipaginaweb - 1;
				cambiaWeb(1);
			}
	});
}
/* Activar la visibilidad las tecnologías usadas por página web en pantalla */
function activarTecnologias() {
	techs = $('li','#tech');
	indicetech = -1;
	setTimeout('gestionaTecnologia()', retardo * 7);
}
/* Gestión de la visualización de las tecnologías usadas por página web en pantalla */
function gestionaTecnologia() {
	indicetech++;
	var longtechs = techs.length;
	if (indicetech < longtechs) {
		var este = $(techs[indicetech]);
		var tech = $(este).text().replace(/\s/i, '').toLowerCase();
		if ($.inArray(tech, paginasweb[ipaginaweb]['tech']) > -1) {
			$(este).removeClass();
			setTimeout('gestionaTecnologia()', retardo * 2);
		}
		else {
			$(este).addClass('inactivo');
			setTimeout('gestionaTecnologia()', 1);
		}
	}
}
function moverImagenWeb(direccion) {
	$('#imagenweb').css({'background': 'url(/portfolio/webs/' + paginasweb[ipaginaweb]['imagen'] + '.jpg) no-repeat scroll center center'});
	activarTecnologias();
	$('#imagenweb').css({ 'left' : 150 - ( direccion * 600) });
	$('#imagenweb').animate({ 'left' : 150 }, 2000, function() { gestionaControles(); });
	$('#urlactiva').children('a').attr({'href' : 'http://' + paginasweb[ipaginaweb]['url'], 'target' : '_blank'}).text(paginasweb[ipaginaweb]['url']);
	$('#urlactiva').children('a').removeClass('inactivo');
}
