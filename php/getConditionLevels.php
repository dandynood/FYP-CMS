<?php
    require_once 'config.php';
    $conn = new mysqli($DB_host,$DB_user,$DB_pass,$DB_name);

    if($conn->connect_error){
        die("Connection failed: " . $conn->connect_error);
        echo 'failed';
    }         
        $data = json_decode(file_get_contents("php://input")); 
        $plantationID = urldecode($data->plantationID);

        $sql = "SELECT p.plantName, p.plantDescription, c.dateTime, c.airTemp, c.humidity, c.windSpeed, c.lightIntensity, c.soilTemp, c.soilMoisture FROM plantations AS p INNER JOIN conditionLevels AS c ON p.plantationID = c.plantationID WHERE c.plantationID = '$plantationID'";

        $result = $conn->query($sql);

        if($result->num_rows > 0){
            $outp = array();
            $outp[] = $result->fetch_all(MYSQLI_ASSOC);

            echo json_encode($outp);
        }
        else
        {
            echo 'failed';
        }

    $conn->close();
?>