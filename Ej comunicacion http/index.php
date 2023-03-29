<?php
//Crea un archivo de texto para guardar los datos que envía el ESP8266
if (!file_exists("miTemp&Hum.txt")) {
    // si no existe el archivo, lo creamos
    file_put_contents("miTemp&Hum.txt", "0.0\r\n0.0");
}

// Si se recibe Datos con el Método GET, los procesamos
if (isset($_GET['Temp']) && isset($_GET['Hum'])) {
    $var3 = $_GET['Temp'];
    $var4 = $_GET['Hum'];
    $fileContent = $var3 . "\r\n" . $var4;
    $fileSave = file_put_contents("miTemp&Hum.txt", $fileContent);
}

// Leemos los datos del archivo para guardarlos en variables
$fileStr = file_get_contents("miTemp&Hum.txt");
$pos1 = strpos($fileStr, "\r\n");
$var1 = substr($fileStr, 0, $pos1);
$var2 = substr($fileStr, $pos1 + 1); // de la pos1 +1 hasta el final
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Importante refrescar la pagina cada 5 segundos, para leer nuevos datos  -->
    <META HTTP-EQUIV="REFRESH" CONTENT="5">
    <title>SERVIDOR PHP</title>
    <!-- Importamos la biblioteca bootstrap que contiene estilos  -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
</head>
<style>
    body {
        background-color: lightgray;
    }

    .frame {
        margin: 15px 0;
    }

    h1 {
        background-color: aquamarine;
        font-weight: bold;
    }

    .button {
        background-color: gray;
        /* Green */
        border: none;
        color: white;
        padding: 16px 40px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 100px;
        margin: 20px 2px;
        cursor: pointer;
        outline: none;
        border-radius: 15px;
        box-shadow: 0 9px #999;
    }

    .button:hover {
        background-color: #3e8e41
    }

    .button:active {
        background-color: #3e8e41;
        box-shadow: 0 5px #666;
        transform: translateY(15px);
    }

    .wrapper {
        text-align: center;
    }

    .btnon {
        padding: 50px 202px;
    }

    .btnoff {
        padding: 50px 178px;
    }
</style>

<body class="container-fluid">
    <div class="row">
        <!-- La seccion de los indicadores, para esto definimos un frame con una tabla dentro y usamos el archivo.sj sevenSeg  -->
        <h1 class="text-center">IoT test by AppSiDaL </h1>
        <div class="frame">
            <!-- Display Temperatura -->
            <div class="col-sm-6">
                <h2 class="text-center">Temperatura en °C</h2>
                <div id="displayTemperatura"></div>
            </div>
            <!-- Display Humedad -->
            <div class="col-sm-6">
                <h2 class="text-center">Humedad en %</h2>
                <div id="displayHumedad"></div>
            </div>
        </div>
    </div>
    <!-- APIS que permiten la lectura de las variables y mostrarlas en el display usando ajax -->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
    <script src="js/sevenSeg.js"></script>

    <script>
        let tempVal = <?php echo $var1; ?>;
        let humVal = <?php echo $var2; ?>;

        $("#displayTemperatura").sevenSeg({
            digits: 5,
            value: tempVal + 0.01
        });
        $("#displayHumedad").sevenSeg({
            digits: 5,
            value: humVal + 0.01,
            colorOff: "#003200",
            colorOn: "lime",
            slant: 0
        });
    </script>

    <form action="" method="POST">
        <!-- Formulario para los bottones, estos mismos mandan ON/OFF usando POST -->
        <div class="wrapper">
            <h1>Control Led</h1>
            <button class="button btnon" type="submit" name="ON">ON</button>
            <button class="button btnoff" type="submit" name="OFF">OFF</button>
        </div>
    </form>

</body>

</html>

<?php

$server     = "localhost";    // Conexion a mysql
$username     = "root";
$password     = "";
$DB         = "prueba1";

$update = new mysqli($server, $username, $password, $DB);    // Revisamos si la conexion fue correcta
if ($update->connect_error) {
    die("Connection error: " . $update->connect_error);
}

if (isset($_POST['ON']))            // Si recibimos ON
{

    $sql = "UPDATE status SET status = 1";    // Actualizamos la base de datos
    if ($update->query($sql) === TRUE) {
    }
}

if (isset($_POST['OFF']))        // Si recibimos Off
{

    $sql = "UPDATE status SET status = 0";    //Actualizamos con 0 la base de datos
    if ($update->query($sql) === TRUE) {
    }
}

?>
