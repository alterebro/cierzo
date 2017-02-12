<?php

function getIcon($icon) {
	$_icons = ['clear-day', 'clear-night', 'rain', 'snow', 'sleet', 'wind', 'fog', 'cloudy', 'partly-cloudy-day', 'partly-cloudy-night'];
	return (in_array($icon, $_icons)) ? $icon : 'default';
}

function parseData($data) {

	$_current = $data['currently'];
	$_hourly = $data['hourly'];
	$_daily = $data['daily'];

	$output = [
		'current' => [
			'time' => $_current['time'],
			'icon' => getIcon($_current['icon']),
			'text' => $_current['summary'],
			'temp' => intval(round($_current['temperature'])),
			'speed' => intval(round($_current['windSpeed'])),
			'angle' => intval($_current['windBearing']),
		],
		'hourly' => [],
		'daily' => [],
	];

	// Next Hours
	foreach ($_hourly['data'] as $v) {
		$output['hourly'][] = [
			'time' => $v['time'],
			'icon' => getIcon($v['icon']),
			'temp' => intval(round($v['temperature'])),
			'speed' => intval(round($v['windSpeed'])),
			'angle' => intval($v['windBearing']),
		];
	}

	// Next Days
	foreach ($_daily['data'] as $v) {
		$output['daily'][] = [
			'time' => $v['time'],
			'icon' => getIcon($v['icon']),
			'text' => $v['summary'],
			'temp' => [ intval(round($v['temperatureMin'])), intval(round($v['temperatureMax']))],
			'speed' => intval(round($v['windSpeed'])),
			'angle' => intval($v['windBearing']),
		];
	}

	return json_encode($output);
}

// ------------
// CACHEDATA
// ------------
class cacheData {

	public $cache_path = 'data/';
	public $cache_time = 604800; // one week : (60 * 60 * 24 * 7) // 5 min : (60 * 5)
	public $cache_force = false;
	public $cache_filename;
	public $data_url;
	public $json_data;

	function __construct( $url, $time = false, $force = false ) {

		$this->data_url = $url;
		$this->cache_filename = $this->cache_path . md5($url);

		if ($time) { $this->cache_time = $time; }
		if ($force) { $this->cache_force = $force; }

		$this->json_data = $this->load();
	}

	function load() {

		$cache_exists = file_exists($this->cache_filename) && (filesize($this->cache_filename) > 10);
		$cache_needs_renewal = $cache_exists && ( (filemtime($this->cache_filename) + $this->cache_time) < time() );

		if ( !$cache_exists || $this->cache_force || $cache_needs_renewal ) {

			$data = $this->getRemoteData($this->data_url);
			$data = json_decode( $data, true );
			$data = parseData($data);
			$file = file_put_contents($this->cache_filename, $data);

		} else {

			$data = file_get_contents( $this->cache_filename );
		}

		return $data;
	}

	function getRemoteData($url) {

		$ch = curl_init();
		curl_setopt_array($ch, array(
			CURLOPT_URL => $url,
			CURLOPT_RETURNTRANSFER => 1,
			CURLOPT_CONNECTTIMEOUT => 0,
			CURLOPT_SSL_VERIFYPEER => FALSE, 	// https
			CURLOPT_SSL_VERIFYHOST => 2, 		// https
			CURLOPT_HTTPHEADER => array('Content-type: application/json') // JSON
		));
		$data = curl_exec($ch);
		curl_close($ch);

		return $data;
	}
}


// Loads DarkSky API Key
$_CONFIG = include('config.php');
$_ENDPOINT =
	$_CONFIG['darksky_base_url'] .
	$_CONFIG['darksky_api_key'] . '/' .
	$_CONFIG['latitude'] . ',' .
	$_CONFIG['longitude'] . '?lang=' .
	$_CONFIG['lang'] . '&units=' .
	$_CONFIG['units'] . '&exclude=minutely,alerts,flags';


// Crawl and Output Data
$data = new cacheData( $_ENDPOINT, 120 );
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json; charset=utf-8');
echo $data->json_data;




?>
