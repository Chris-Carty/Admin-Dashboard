<?php

	//$cd_host = "localhost";
	//$cd_port = 8080;
	//$cd_socket = "";

	// Development
	//$cd_user = "root";
	//$cd_password = "";
	//$cd_dbname = "companydirectory";

	// Production 
	// $cd_user = "u193647531_directory";
	// $cd_password = "Directory123";
	// $cd_dbname = "u193647531_directory";

	$cleardb_url = parse_url(getenv("CLEARDB_DATABASE_URL"));
	$cleardb_server = $cleardb_url["host"];
	$cleardb_username = $cleardb_url["user"];
	$cleardb_password = $cleardb_url["pass"];
	$cleardb_db = substr($cleardb_url["path"],1);
	$active_group = 'default';
	$query_builder = TRUE;

?>