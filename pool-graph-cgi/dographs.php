<?php
/*
 Copyright (C) Craig Crawford [NotoriousPyro], PyroNexus.com, Metaverse.farm
 Contact: admin@pyronexus.com, admin@metaverse.farm, craigcrawford1988@gmail.com
 Unauthorised reproduction, distribution or sharing without prior consent is
 strictly forbidden.
*/
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require('config.php');
require('mysql.php');

class doGraphs extends Database {
	private $config;
	private $currentTime;
	private $secondsInDay = 86400;
	private $baseSave_DIR;
	private $miners;
	protected $pruneTime;
	
	function __construct() {
		Database::__construct();
		
		global $config;
		$this->config = $config;
		
		$this->currentTime = time();
		
		$this->pruneTime = $config->daysToDisplay * $this->secondsInDay;
		if (!$this->pruneTime) {
			die('[ERROR] Could not parse pruneTime.');
		}
		if ($this->pruneTime < $this->secondsInDay) {
			die('[ERROR] pruneTime must be equal to or bigger than 1 day.');
		}
		
		$this->baseSave_DIR = $config->baseSave_DIR;
		is_dir($this->baseSave_DIR) || mkdir($this->baseSave_DIR) || die("[ERROR] Failed to create folder: {$this->baseSave_DIR}");
		
		$minersAPI = $this->getJSONData($config->minersAPI_URL, true);
		$this->miners = array_keys($minersAPI['miners']);
	}
	
	public function init() {
		$this->poolToDB();
		$this->poolToAPI();
		$this->accountsToDB();
		$this->accountsToAPI();
	}
	
	private function getJSONData(string $url, bool $asArray = false) {
		if (!$data = json_decode(file_get_contents($url), $asArray)) {
			die("[ERROR] Failed to get miner JSON data from: {$url}");
		}
		return $data;
	}

	private function saveJSONData(string $saveLocation, array $data) {
		if (!file_put_contents($saveLocation, json_encode($data))) {
			die("[ERROR] Failed to create file: {$saveLocation}");
		}
		return true;
	}

	private function getDifficulty(array $rawNodes) {
		foreach ($rawNodes as $node) {
			$nodes[$node->name] = [
				'difficulty' => $node->difficulty,
				'height' => $node->height
			];
		}
		usort($nodes, function ($a, $b) {
			return $a['height'] - $b['height'];
		});
		return max($nodes)['difficulty'];
	}
	
	private function poolToDB() {
		$statsAPI = $this->getJSONData($this->config->statsAPI_URL);
		$priceAPI = $this->getJSONData($this->config->priceAPI_URL);
		
		$hashrate = $statsAPI->hashrate;
		$minersTotal = $statsAPI->minersTotal;
		$difficulty = $this->getDifficulty($statsAPI->nodes);
		$priceUSD = $priceAPI[0]->price_usd;
		
		$poolData = "({$this->currentTime}, {$hashrate}, {$minersTotal}, {$difficulty}, {$priceUSD})";
		
		$this->insertPoolData($poolData);
	}
	
	private function poolToAPI() {
		$saveLocation = "{$this->baseSave_DIR}/data.json";
		$poolData = $this->getPoolData();
		
		$this->saveJSONData($saveLocation, $poolData);
	}
	
	private function accountsToDB() {
		$minerData = '';
		foreach ($this->miners as $miner) {
			$miner_id = $this->getMinerId($miner);
			$accountAPI = $this->getJSONData("{$this->config->accountAPI_URL}/{$miner}");
			
			$currentHashrate = $accountAPI->currentHashrate;
			$hashrate = $accountAPI->hashrate;
			$workersOnline = $accountAPI->workersOnline;
			
			$minerData = "{$minerData}({$miner_id}, {$this->currentTime}, {$currentHashrate}, {$hashrate}, {$workersOnline}), ";
		}
		
		$this->insertMinerData($minerData);
	}
	
	private function accountsToAPI() {
		$minerList = '';
		foreach ($this->miners as $miner) {
			$minerList = "{$minerList}'{$miner}', ";
		}
		
		$minerData = $this->getMinerData($minerList);
		foreach ($minerData as $miner => $data) {
			$saveLocation = "{$this->baseSave_DIR}/{$miner}.json";
			$this->saveJSONData($saveLocation, $data);
		}
	}
}

$doGraphs = new doGraphs();
$doGraphs->init();