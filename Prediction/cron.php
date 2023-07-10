<?php
$url = 'https://tesjo-clima-api.onrender.com/api/bridge'; 

$response = file_get_contents($url);

if ($response === false) {
    echo "Error al realizar la solicitud HTTP";
} else {
    echo $response;
}
?>