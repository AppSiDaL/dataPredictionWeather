<?php
$temperatura=$_GET['temperatura'];
$humedad=$_GET['humedad'];
$presion=$_GET['presion'];
$luz=$_GET['luz'];
$velocidad=$_GET['velocidad'];
$direccion=$_GET['direccion'];
$lluvia=$_GET['lluvia'];

$pdo = new PDO('mysql:host=localhost;dbname=clima', 'root', '');
$statement = $pdo->prepare('SELECT * FROM tesjo');
$statement->execute();
$results = $statement->fetchAll(PDO::FETCH_ASSOC);

?>