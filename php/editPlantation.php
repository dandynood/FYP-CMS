<?php
    require_once 'config.php';
    $conn = new mysqli($DB_host,$DB_user,$DB_pass,$DB_name);

    if($conn->connect_error){
        echo "Connection failed: ".$conn->connect_error;   
    }         
        $data = json_decode(file_get_contents("php://input")); 
        $plantID = urldecode($data->plantID);
        $originalPlantID = urldecode($data->originalPlantID);
        $nodeID = urldecode($data->nodeID);
        $plantName = urldecode($data->plantName);
        $plantDesc = urldecode($data->plantDescription);
        $numOfPlants = urldecode($data->numOfPlants);

        $airTemp = urldecode($data->airTemp);
        $humidity = urldecode($data->humidity);
        $lightIntensity = urldecode($data->lightIntensity);
        $soilMoisture = urldecode($data->soilMoisture);

        $adminPass = urldecode($data->adminPass);
        $adminID = urldecode($data->adminID);

        $adminPass = hash('sha256',$adminPass);

        $auth = "SELECT userID FROM users WHERE userID = '$adminID' AND password = '$adminPass'";

        $getAuth = $conn->query($auth);
        
        if($getAuth->num_rows == 1){
            
            $check = "SELECT plantationID FROM plantations WHERE plantationID = '$originalPlantID'";
            $checkResult = $conn->query($check);
            
            if($checkResult->num_rows == 1){
                
                $checkID = "SELECT plantationID FROM plantations WHERE plantationID='$plantID'";
                
                $checkIDResult = $conn->query($checkID);
                
                if($checkIDResult->num_rows == 0 || $plantID == $originalPlantID){

                    $sql = "UPDATE plantations SET plantationID='$plantID', nodeNumber = '$nodeID', plantName='$plantName', plantDescription='$plantDesc', numOfPlants = '$numOfPlants' WHERE plantationID='$originalPlantID'";

                    $sqlO = "UPDATE optimumLevels SET airTemp = '$airTemp', humidity ='$humidity', lightIntensity ='$lightIntensity', soilMoisture = '$soilMoisture' WHERE plantationID='$plantID'";

                    $result = $conn->query($sql);

                    $result = $conn->query($sqlO);

                    if($conn->affected_rows >= 0)
                    {
                        echo 'success';
                    }
                    else
                    {
                        echo 'failed';
                    }
                } else {
                    echo 'non-unique';
                }
            } else {
                echo 'failed';
            }
            
        } else {
            echo 'unauthorized';
        }

    $conn->close();
?>