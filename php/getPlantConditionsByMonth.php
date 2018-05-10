<?php
    require_once 'config.php';
    $conn = new mysqli($DB_host,$DB_user,$DB_pass,$DB_name);

    if($conn->connect_error){
        die("Connection failed: " . $conn->connect_error);
        echo 'failed';
    }         
        $data = json_decode(file_get_contents("php://input"));
        $month = urldecode($data->month);
        $year = urldecode($data->year);
        
        $sql = "SELECT plantationID, DATE(dateTime) as date, ROUND(AVG(airTemp),1) as avgAirTemp, ROUND(AVG(humidity),1) as avgHumidity, ROUND(SUM(lightIntensity)/11,1) as avgLightIntensity, ROUND(AVG(soilMoisture),1) as avgSoilMoisture FROM conditionLevels WHERE MONTH(dateTime) = '$month' AND YEAR(dateTime) = '$year' GROUP BY DATE(dateTime)";

        $result = $conn->query($sql);

        if($result->num_rows >= 0){
            echo json_encode($result->fetch_all(MYSQLI_ASSOC));
        }
        else
        {
            echo 'failed';
        }

    $conn->close();
?>