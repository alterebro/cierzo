var PhoneGap = (document.URL.match(/^https?:/) === null);

function getData() {

	var request = ajax()
		// .get('../api/')
		.get('http://cierzo.976.es/api/')
		.then(function(res, xhr) {
			// console.log(res);
			renderData(res);
		})
		.catch(function() {})
		.always(function() {});
}

function renderData(data) {

	var winds = [
		{ id: 'N', name: 'Tramontana', from: 'Norte' },
		{ id: 'NNE', name: 'Tramontana', from: 'Norte-Nordeste' },
		{ id: 'NE', name: 'Gregal', from: 'Nordeste' },
		{ id: 'ENE', name: 'Levante', from: 'Este-Nordeste' },
		{ id: 'E', name: 'Levante', from: 'Este' },
		{ id: 'ESE', name: 'Levante', from: 'Este-Sudeste' },
		{ id: 'SE', name: 'Siroco', from: 'Sudeste' },
		{ id: 'SSE', name: 'Siroco', from: 'Sur-Sudeste' },
		{ id: 'S', name: 'Ostro', from: 'Sur' },
		{ id: 'SSO', name: 'Ostro', from: 'Sur-Sudoeste' },
		{ id: 'SO', name: 'Lebeche', from: 'Sudoeste' },
		{ id: 'OSO', name: 'Poniente', from: 'Oeste-Sudoeste' },
		{ id: 'O', name: 'Poniente', from: 'Oeste' },
		{ id: 'ONO', name: 'Cierzo', from: 'Oeste-Noroeste' },
		{ id: 'NO', name: 'Cierzo', from: 'Noroeste' },
		{ id: 'NNO', name: 'Cierzo', from: 'Norte-Noroeste' },
	];

	/*
	var directions = [];
	winds.forEach(function(el) {
		directions.push(el.id);
	});
	*/

	var filter = {
		timestamp : function(timestamp) {
			// return new Date(timestamp*1000).format('d.m.Y @H:i:s');
			return new Date(timestamp*1000).format('d.m.Y @H:i');
		},
		hour : function(timestamp) {
			return new Date(timestamp*1000).format('Dd hA');
		},
		day : function(timestamp) {
			return new Date(timestamp*1000).format('Dd M');
		},
		wind_direction : function(degrees) {
			var v = Math.floor( (degrees/22.5) + 0.5 );
			return winds[(v%16)]['id'];
		},
		wind_string : function(degrees) {
			var v = Math.floor( (degrees/22.5) + 0.5 );
				v = winds[(v%16)];
			var str = 'Viento ' + v.name +  ' del ' + v.from;
			return str;
		}
	}

	// Remove contents first
	var content = document.querySelector('main');
	while (content.firstChild) {
	    content.removeChild(content.firstChild);
	}

	var tpl = document.querySelector('#template');
	var template = new t(tpl.innerHTML);
		template.register("timestamp", filter.timestamp );
		template.register("hour", filter.hour );
		template.register("day", filter.day );
		template.register("wind_direction", filter.wind_direction );
		template.register("wind_string", filter.wind_string );

	var app = document.createElement('div');
		app.setAttribute('id', 'app');
		app.innerHTML = template.render(data);
	document.querySelector('main').appendChild(app);

	router.init();
	timer.init(2);
}

var timer = {

	seconds : 60,
	mins : null,

	tick : function() {
		var current_minutes = this.mins-1;
		this.seconds--;

		// Output
		var output = (current_minutes < 10 ? "0" : "") + current_minutes.toString() + ":" + (this.seconds < 10 ? "0" : "") + String(this.seconds);
		document.getElementById('timer-output').innerHTML = 'Próxima actualización de datos: ' + output;

		if ( this.seconds > 0 ) {
			var self = this;
			setTimeout( function() {
				self.tick();
			}, 1000 );

		} else {

			if ( this.mins > 1 ) {

				this.seconds = 60;
				this.init(this.mins-1);
			} else {
				this.seconds = 60;
				this.mins = null;
				getData();
			}
		}
	},

	init : function(mins) {
		this.mins = mins;
		this.tick();
	}
}


var router = {
	current_block : null,
	blocks : [],
	activateMenu : function() {
		var self = this;
		var menu = document.querySelectorAll('header nav ul li a');
			menu.forEach(function(el, i) {
				var block = el.getAttribute('href').split('#')[1];
				el.setAttribute('data-block', block);
				el.onclick = function(e) {
					self.showBlock(block);
					e.preventDefault();
				}
			});

	},
	showBlock : function(block) {

		// Block transition
		document.getElementById('app').className = 'hide';
		var self = this;
		setTimeout( function() {

			self.blocks.forEach(function(el) {
				document.getElementById(el).style.display = 'none';
			});
			document.getElementById(block).style.display = 'block';
			document.getElementById('app').className = '';

		}, 300 );


		document.querySelectorAll('header nav a').forEach(function(el) {
			el.classList.remove('active');
		});
		// document.querySelector('header nav ul li a[data-block="'+block+'"]').classList.add('active');
		document.querySelector('header nav ul li a[data-block="'+block+'"]').className = 'active';

		this.current_block = block;
	},
	init : function() {
		var self = this;
		self.activateMenu();
		var blocks = document.querySelectorAll('main section');
			blocks.forEach(function(el, i) {
				self.blocks.push( el.getAttribute('id') );
			});

		// Hide Loader
		document.getElementById('loader').className = 'hide';

		// TODO : get block from URL hash
		if (!this.current_block) { this.current_block = this.blocks[0]; }
		this.showBlock(this.current_block);
	}
}

// Init
window.onload = function() {

	getData();
}


if (!PhoneGap) {

	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

	ga('create', 'UA-63335-28', 'auto');
	ga('send', 'pageview');
}
