# Cierzo.app

**Cierzo Maño** is a JavaScript fast dev test hybrid application built with PhoneGap, using the ~~[darksky.net](https://darksky.net/dev/)~~ [Pirate Weather](https://pirateweather.net/en/latest/) weather API. The UI targets on display the wind current conditions and forecast for a specific location, in this case: — *The windy city of Zaragoza, Spain*.


- **Online WebApp : [https://cierzo.976.es/](https://cierzo.976.es/)**
- **Android Mobile App : [https://play.google.com/store/apps/details?id=com.alterebro.cierzo](https://play.google.com/store/apps/details?id=com.alterebro.cierzo)**


<table>
<tr>
	<th>Android Mobile App</th>
	<th>Online WebApp</th>
</tr>
<tr>
	<td align="center">
	<a href="https://play.google.com/store/apps/details?id=com.alterebro.cierzo"><img alt="Get it on Google Play" src="https://play.google.com/intl/en_us/badges/images/apps/en-play-badge-border.png" width="200" /></a>
		<br><strong><a href="https://play.google.com/store/apps/details?id=com.alterebro.cierzo">play.google.com/store/apps/details?id=com.alterebro.cierzo</a></strong>
	</td>
	<td align="center">
	<a href="https://cierzo.976.es/"><img src="https://cierzo.976.es/www/img/icons/android-chrome-512x512.png" width="80" /></a>
	<br><strong><a href="https://cierzo.976.es/">https://cierzo.976.es/</a></strong>
	</td>
</tr>
</table>


---


## Development:

- Clone the repository or **[download it](https://github.com/alterebro/cierzo/archive/master.zip)**.

```
$ git clone https://github.com/alterebro/cierzo.git`
```

- Install dependencies:

```
$ npm install
```

- ~~Sign up for a Dark Sky API Key:
[https://darksky.net/dev/](https://darksky.net/dev/)~~
- Sign up for a Pirate Weather API Key:
[https://pirateweather.net/en/latest/](https://pirateweather.net/en/latest/)


- Edit the file `cierzo/api/config.sample.php` file and rename it to `cierzo/api/config.php`, use the secret API Key given to you by DarkSky.

```php
<?php
	return array(
		'darksky_api_key' 	=> 'alphanumeric API Key from PirateWeather',
		'darksky_base_url' 	=> 'https://api.pirateweather.net/forecast/',
		'latitude' 			=> 41.65, // Zaragoza, Spain (Lat)
		'longitude' 		=> -0.883, // Zaragoza, Spain (Lng)
		'lang' 				=> 'es',
		'units' 			=> 'ca', // auto | ca | uk2 | us | si
	);
?>
```

- Now you can build the project with gulp

```sh
$ gulp

# If you don't already have gulp, first do:
$ npm install gulp-cli -g
```
This will create the compiled project on the `www/` folder.

---

<a href="https://cierzo.976.es"><img src="https://cierzo.976.es/www/img/share/cierzo-zaragoza.jpg" width="500" /></a>

---


### Credits / Libraries

- **t.js** Micro templating framework by Jason Mooberry (@jasonmoo) and modified by @icyflash: [github.com/icyflash/t.js](https://github.com/icyflash/t.js)
- **Date.format** JS library with same method as PHP's date() function, by Jacob Wright, @jacwright [github.com/jacwright/date.format](https://github.com/jacwright/date.format)
- **Ajax module in Vanilla JS** by @fdaciuk [github.com/fdaciuk/ajax](https://github.com/fdaciuk/ajax)
- **Meteocons** weather icons set by Alessio Atzeni [www.alessioatzeni.com/meteocons/](http://www.alessioatzeni.com/meteocons/)

---
