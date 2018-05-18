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
        $type = urldecode($data->type);
        
        if ($type == "summary"){
            $sql = "SELECT plantationID, DATE(dateTime) as date, ROUND(AVG(airTemp),1) as avgAirTemp, ROUND(AVG(humidity),1) as avgHumidity, NULL as avgLightIntensity, ROUND(AVG(soilMoisture),1) as avgSoilMoisture FROM conditionLevels WHERE MONTH(dateTime) = '$month' AND YEAR(dateTime) = '$year' GROUP BY DATE(dateTime)";

            $lightSQL = "SELECT plantationID, DATE(dateTime) as date, ROUND(AVG(lightIntensity),1) AS avgLightIntensity FROM conditionLevels WHERE MONTH(dateTime) = '$month' AND YEAR(dateTime) = '$year' AND HOUR(dateTime) BETWEEN 7 AND 18 GROUP BY DATE(dateTime)";
            
        } else if ($type == "yield"){
            $sql = "SELECT c.plantationID, DATE_FORMAT(c.dateTime,'%M %Y') as date, ROUND(AVG(c.airTemp),1) as avgAirTemp, ROUND(AVG(c.humidity),1) as avgHumidity, NULL as avgLightIntensity, ROUND(AVG(c.soilMoisture),1) as avgSoilMoisture, y.yield as yieldValue FROM conditionLevels c LEFT OUTER JOIN plantationyields y ON c.plantationID = y.plantationID AND MONTH(c.dateTime) = MONTH(y.monthYear) WHERE MONTH(dateTime) = '$month' AND YEAR(dateTime) = '$year' GROUP BY MONTH(dateTime)";

            $lightSQL = "SELECT plantationID, DATE_FORMAT(dateTime,'%M %Y') as date, ROUND(AVG(lightIntensity),1) AS avgLightIntensity FROM conditionLevels WHERE MONTH(dateTime) = '$month' AND YEAR(dateTime) = '$year' AND HOUR(dateTime) BETWEEN 7 AND 18 GROUP BY MONTH(dateTime)";
        }

        $result = $conn->query($sql);
        $resultLight = $conn->query($lightSQL);

        if($result->num_rows >= 0){
            $summary = $result->fetch_all(MYSQLI_ASSOC);
            $lightSummary = $resultLight->fetch_all(MYSQLI_ASSOC);
            
            if($resultLight->num_rows >= 0){
                for ($i=0;$i<count($summary);$i++) {
                    $summary[$i]['avgLightIntensity'] = null;
                    for ($j=0;$j<count($lightSummary);$j++){
                        if($summary[$i]['date'] == $lightSummary[$j]['date']){
                            $summary[$i]['avgLightIntensity'] = $lightSummary[$j]['avgLightIntensity'];
                        }
                    }
                } 
                
            } else {
                foreach ($summary as $reading) {
                    $reading['avgLightIntensity'] = null;
                } 
            }
            
            echo json_encode($summary);
        }
        else
        {
            echo 'failed';
        }

    $conn->close();
?>
