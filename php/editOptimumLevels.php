<?php
    require_once 'config.php';
    $conn = new mysqli($DB_host,$DB_user,$DB_pass,$DB_name);

    if($conn->connect_error){
        echo "Connection failed: ".$conn->connect_error;   
    }         
        $data = json_decode(file_get_contents("php://input")); 
        $plantID = urldecode($data->plantationID);
        $airTemp = urldecode($data->airTemp);
        $humidity = urldecode($data->humidity);
        $windspeed = urldecode($data->windSpeed);
        $lightIntensity = urldecode($data->lightIntensity);
        $soilTemp = urldecode($data->soilTemp);
        $soilMoisture = urldecode($data->soilMoisture);
            
        $sql = "UPDATE optimumLevels SET airTemp='$airTemp', humidity='$humidity', windSpeed='$windspeed', lightIntensity='$lightIntensity', soilTemp='$soilTemp', soilMoisture='$soilMoisture' WHERE plantationID='$plantID'";


        $result = $conn->query($sql);

        if($conn->affected_rows > 0)
        {
            echo 'success';
        }
        else
        {
            echo 'failed';
        }

    $conn->close();
?>