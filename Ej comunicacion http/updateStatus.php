<?php

$server     = "localhost";  // Variables para la conexion a mysql
$username   = "root";           
$password   = "";
$DB         = "prueba1";            

$Stt = $_POST["status"];        

            $update = new mysqli($server, $username, $password, $DB); // Revisamos la conexino
            if ($update->connect_error) {
                die("Connection failed: " . $update->connect_error);
            } 
            
            if($Stt == 1)                               // Si el valor recibido es 1
            {
                $sql = "UPDATE status SET status = 1";  // Actualizamos el status en la base de datos
            if ($update->query($sql) === TRUE) {        
                echo "1";                               
            }                                       
            } 
                
            else if ($Stt == 0)                         //Lo mismo que 1 pero con 0
            {
                $sql = "UPDATE status SET status = 0";  
            if ($update->query($sql) === TRUE) {        
                echo "0";                               
            } 
    
            } 
            
?>
