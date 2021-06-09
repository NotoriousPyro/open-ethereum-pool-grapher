<?php
/*
 Copyright (C) Craig Crawford [NotoriousPyro], PyroNexus.com, Metaverse.farm
 Contact: admin@pyronexus.com, admin@metaverse.farm, craigcrawford1988@gmail.com
 Unauthorised reproduction, distribution or sharing without prior consent is
 strictly forbidden.
*/
//MySQL
$mysqli->servername = 'localhost';
$mysqli->username = 'metaverse';
$mysqli->password = '';
$mysqli->dbname = 'metaverse';
//Other
$config->baseAPI_URL = 'http://127.0.0.1:6081/api';
$config->statsAPI_URL = "{$config->baseAPI_URL}/stats";
$config->minersAPI_URL = "{$config->baseAPI_URL}/miners";
$config->accountAPI_URL = "{$config->baseAPI_URL}/accounts";
$config->priceAPI_URL = 'https://api.coinmarketcap.com/v1/ticker/metaverse/';
$config->baseSave_DIR = '/bulk/www/graph.metaverse.farm/api';

// Configures how long data is kept. 7 days recommended. No less than 1 day.
$config->daysToDisplay = 7;