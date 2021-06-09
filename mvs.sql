SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `hashrates` (
  `time` bigint(20) NOT NULL,
  `hashrate` bigint(20) NOT NULL,
  `minersTotal` int(11) NOT NULL,
  `difficulty` bigint(20) NOT NULL,
  `priceUSD` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `miner_ids` (
  `id` bigint(20) NOT NULL,
  `miner` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `miner_info` (
  `id` bigint(20) NOT NULL,
  `miner_id` bigint(20) NOT NULL,
  `time` bigint(20) NOT NULL,
  `currentHashrate` bigint(20) NOT NULL,
  `hashrate` bigint(20) NOT NULL,
  `workersOnline` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `hashrates`
  ADD PRIMARY KEY (`time`);

ALTER TABLE `miner_ids`
  ADD PRIMARY KEY (`id`,`miner`) USING BTREE;

ALTER TABLE `miner_info`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `miner_id__id` (`miner_id`,`id`);

ALTER TABLE `miner_ids`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `miner_info`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `miner_info`
  ADD CONSTRAINT `fk__miner_ids__id` FOREIGN KEY (`miner_id`) REFERENCES `miner_ids` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;