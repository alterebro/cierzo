
function getData() {

	var request = ajax()
		.get('../api/')
		.then(function(res, xhr) {
			// console.log(res);
			renderData(res);
		})
		.catch(function() {})
		.always(function() {});
}

function renderData(data) {

	var filter = {
		timestamp : function(timestamp) {
			return new Date(timestamp*1000).format('d.m.Y @H:i:s');
		},
		hour : function(timestamp) {
			return new Date(timestamp*1000).format('h A');
		},
		day : function(timestamp) {
			return new Date(timestamp*1000).format('d.m');
		},
		wind_direction : function(degrees) {
			var v = Math.floor( (degrees/22.5) + 0.5 );
			var directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
			return directions[(v%16)];
		}
	}

	// Remove contents first
	var content = document.querySelector('main');
	while (content.firstChild) {
	    content.removeChild(content.firstChild);
	}

	var tpl = document.querySelector('#app');
	var template = new t(tpl.innerHTML);
		template.register("timestamp", filter.timestamp );
		template.register("hour", filter.hour );
		template.register("day", filter.day );
		template.register("wind_direction", filter.wind_direction );

	var app = document.createElement('div');
		app.innerHTML = template.render(data);
	document.querySelector('main').appendChild(app);

	router.init();
	// timer.init(2);
}

var timer = {

	seconds : 60,
	mins : null,

	tick : function() {
		var current_minutes = this.mins-1;
		this.seconds--;

		// output
		console.log( current_minutes.toString() + ":" + (this.seconds < 10 ? "0" : "") + String(this.seconds) , this.seconds, current_minutes );
		console.log();

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
				el.onclick = function(e) {
					self.showBlock(block);
					e.preventDefault();
				}
			});

	},
	showBlock : function(block) {
		for (var i = 0; i < this.blocks.length; i++) {
			document.getElementById(this.blocks[i]).style.display = 'none';
		}
		document.getElementById(block).style.display = 'block';
		this.current_block = block;
	},
	init : function() {
		var self = this;
		self.activateMenu();
		var blocks = document.querySelectorAll('main section');
			blocks.forEach(function(el, i) {
				self.blocks.push( el.getAttribute('id') );
			});

		// TODO : get block from URL hash
		if (!this.current_block) { this.current_block = this.blocks[0]; }
		this.showBlock(this.current_block);
	}
}

// Init
window.onload = function() {

	getData();
}
