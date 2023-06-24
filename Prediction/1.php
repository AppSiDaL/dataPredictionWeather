<?php
$temperatura=$_GET['temperatura'];

$pdo = new PDO('mysql:host=localhost;dbname=id20748349_congreso', 'id20748349_root', 'AppS!DaL6181');

$consulta = "INSERT INTO pruebas VALUES ('" . $temperatura . "','','','');";
$statement = $pdo->prepare($consulta);
$statement->execute();
$results = $statement->fetchAll(PDO::FETCH_ASSOC);

$json = json_encode($results);

header('Access-Control-Allow-Origin: *');
echo $json;

?>