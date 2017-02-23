/*

	> alterebro/beaufort-scale
	Translate speed to Beaufort wind force scale in both Node and the Browser
	https://github.com/alterebro/beaufort-scale
	by Jorge Moreno @alterebro

*/
;(function (global) {
	'use strict';

	var grades = [
		{ speed: 0, desc: { en: 'Calm', es: 'Calma' } },
		{ speed: 2, desc: { en: 'Light air', es: 'Ventolina' } },
		{ speed: 6, desc: { en: 'Light breeze', es: 'Brisa muy débil' } },
		{ speed: 12, desc: { en: 'Gentle breeze', es: 'Brisa ligera' } },
		{ speed: 20, desc: { en: 'Moderate breeze', es: 'Brisa moderada' } },
		{ speed: 29, desc: { en: 'Fresh breeze', es: 'Brisa fresca' } },
		{ speed: 39, desc: { en: 'Strong breeze', es: 'Brisa fuerte' } },
		{ speed: 50, desc: { en: 'High wind', es: 'Viento fuerte' } },
		{ speed: 62, desc: { en: 'Gale', es: 'Temporal' } },
		{ speed: 75, desc: { en: 'Strong gale', es: 'Temporal fuerte' } },
		{ speed: 89, desc: { en: 'Storm', es: 'Temporal duro' } },
		{ speed: 103, desc: { en: 'Violent Storm', es: 'Borrasca' } },
		{ speed: 118, desc: { en: 'Hurricane', es: 'Huracán' } }
	];

	var remap = function(range_from, range_to, value) {
		var v = Math.floor(((value - range_from)*100) / (range_to - range_from)) / 100;
		return (v<0) ? 0 : v;
	};

	var beaufort = function(speed, options) {

		var opts = options || {};
		var settings = {
			lang: opts.lang || 'es',
			int: opts.int || false
		};

		var grade = false;
		grades.forEach(function(el, i) {
			if ( el.speed > speed && !grade ) {
				grade = i;
			}
		});
		grade = (grade) ? (grade-1) : (grades.length-1);
		var data = {
			desc : grades[grade].desc[settings.lang],
			grade : ((settings.int) ? grade : (grade + remap(grades[grade].speed, ((grades[grade+1]) ? grades[grade+1].speed : false), speed)))
		};
		return data;
	};

    if (typeof define === 'function' && define.amd) {
        define(function () { return beaufort; });
    } else if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = beaufort;
        }
        exports.beaufort = beaufort;
    } else {
        global.beaufort = beaufort;
    }

})(this);
