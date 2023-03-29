<?php

$server     = "localhost";  //Variables para la conexion a mysql
$username   = "root";           
$password   = "";
$DB         = "prueba1";        

$conn = new mysqli($server, $username, $password,$DB);      // Revisamos la conexion
    if ($conn->connect_error) 
    {
        //die("Connection failed: " . $conn->connect_error);
    } 
    //query para obtener el status
    $query ="SELECT * from status";                 
    $result = $conn->query($query);
    //Revisamos el status y lo mostramos con un echo, esto es lo que al final lee el
        while($row = $result->fetch_assoc()) 
        {
            echo $row["status"];                    
        }
?>
