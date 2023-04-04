<?php
$pdo = new PDO('mysql:host=localhost;dbname=clima', 'root', '');
$statement = $pdo->prepare('SELECT * FROM tesjo');
$statement->execute();
$results = $statement->fetchAll(PDO::FETCH_ASSOC);

$json = json_encode($results);

header('Access-Control-Allow-Origin: *');
echo $json;

?>
