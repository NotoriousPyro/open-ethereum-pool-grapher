<?php
/*
 Copyright (C) Craig Crawford [NotoriousPyro], PyroNexus.com, Metaverse.farm
 Contact: admin@pyronexus.com, admin@metaverse.farm, craigcrawford1988@gmail.com
 Unauthorised reproduction, distribution or sharing without prior consent is
 strictly forbidden.
*/
class Database {
	private $mysqli;
	
	function __construct() {
		global $mysqli;
		$this->mysqli = new mysqli($mysqli->servername, $mysqli->username, $mysqli->password, $mysqli->dbname);
		if ($error = $this->mysqli->connect_error) {
			die("[ERROR] Connection failed: {$error}");
		}
	}
	
	function __destruct() {
		if ($this->mysqli) {
			$this->cleanDB();
			$this->mysqli->close();
		}
	}
	
	private function doQuery(string $query) {
		if (!$result = $this->mysqli->query($query)) {
			$this->SQLerr($query);
		}
		return $result;
	}
	
	private function SQLerr(string $query) {
		printf('%s: %s\n', $this->mysqli->errno, $this->mysqli->error);
		die("[ERROR] Query failed: {$query}");
	}
	
	private function cleanDB() {
		$tasks = [
		"	DELETE FROM hashrates
			WHERE time + {$this->pruneTime} < UNIX_TIMESTAMP();",
		"	DELETE FROM miner_info
			WHERE time + {$this->pruneTime} < UNIX_TIMESTAMP();",
		'	DELETE IDS
			FROM miner_ids AS IDS
			LEFT JOIN miner_info AS INFO
				ON INFO.miner_id = IDS.id
			WHERE INFO.miner_id IS NULL;'
		];
		foreach ($tasks as $task) {
			$this->doQuery($task);
		}
		
		return true;
	}
	
	protected function getMinerId(string $miner, bool $insert = true) {
		$query = "
			SELECT DISTINCT id
			FROM miner_ids
			WHERE miner='{$miner}';
		";
		$result = $this->doQuery($query);
		if ($result->num_rows === 0 && $insert === true) {
			$id = $this->insertMiner($miner);
		}
		else {
			$id = $result->fetch_object()->id;
		}
		$result->close();
		
		if (!$id) {
			die("[ERROR] Failed to get miner ID: {$miner}");
		}
		
		return $id;
	}
	
	private function insertMiner(string $miner) {
		$query = "
			INSERT INTO miner_ids (miner)
			VALUES ('{$miner}');
		";
		$this->doQuery($query);

		if (!$id = $this->mysqli->insert_id) {
			$id = $this->getMinerId($miner, false);
		}
		
		return $id;
	}
	
	protected function getMinerData(string $minerList) {
		$minerList = substr($minerList, 0, -2);
		$query = "
			SELECT miner, time, currentHashrate, hashrate, workersOnline
			FROM miner_info AS INFO
			INNER JOIN miner_ids AS IDS
				ON INFO.miner_id=IDS.id
			WHERE miner IN ({$minerList})
			ORDER BY miner_id, INFO.id ASC;
		";
		$result = $this->doQuery($query);
		while ($row = $result->fetch_object()) {
			$minerData[$row->miner][] = [
				'time' => $row->time,
				'currentHashrate' => $row->currentHashrate,
				'hashrate' => $row->hashrate,
				'workersOnline' => $row->workersOnline
			];
		}
		$result->close();
		
		return $minerData;
	}
	
	protected function insertMinerData(string $minerData) {
		$minerData = substr($minerData, 0, -2);
		$query = "
			INSERT INTO miner_info (
				miner_id,
				time,
				currentHashrate,
				hashrate,
				workersOnline
			)
			VALUES
				{$minerData};
		";
		$this->doQuery($query);
		
		return true;
	}
	
	protected function getPoolData() {
		$query = '
			SELECT *
			FROM (
				SELECT *
				FROM hashrates
				ORDER BY time DESC
			) AS data
			ORDER BY time ASC;
		';
        $result = $this->doQuery($query);
		while ($row = $result->fetch_object()) {
			$data[] = $row;
		}
		$result->close();
		
		return $data;
	}
	
	protected function insertPoolData(string $poolData) {
		$query = "
			INSERT INTO hashrates (
				time,
				hashrate,
				minersTotal,
				difficulty,
				priceUSD
			)
			VALUES
				{$poolData};
		";
		$this->doQuery($query);
		
		return true;
	}
}