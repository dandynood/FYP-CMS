<?php
    require_once 'config.php';
    $conn = new mysqli($DB_host,$DB_user,$DB_pass,$DB_name);

    if($conn->connect_error){
        echo "Connection failed: ".$conn->connect_error;   
    }         
        $data = json_decode(file_get_contents("php://input")); 
        $plantID = urldecode($data->plantID);
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
        $adminUserName = urldecode($data->adminUserName);
            
        $adminPass = hash('sha256',$adminPass);

        $auth = "SELECT userID FROM users WHERE userID = '$adminID' AND password = '$adminPass'";

        $getAuth = $conn->query($auth);
        
        if($getAuth->num_rows == 1){
            
            $checkID = "SELECT plantationID FROM plantations WHERE plantationID = '$plantID'";
            
            $checkIDResult = $conn->query($checkID);
            
            if($checkIDResult->num_rows == 0){

                $sql = "INSERT INTO plantations
                (plantationID, nodeNumber, plantName, plantDescription, numOfPlants) VALUES ('$plantID','$nodeID','$plantName','$plantDesc','$numOfPlants')";

                $sqlO = "INSERT INTO optimumLevels
                (plantationID, airTemp, humidity, lightIntensity, soilMoisture) VALUES ('$plantID','$airTemp','$humidity','$lightIntensity','$soilMoisture')";

                $result = $conn->query($sql);
                $resultO = $conn->query($sqlO);

                if($conn->affected_rows > 0)
                {
                    $notfmsg = 'added a new plantation, '.$plantName.' ('. $plantID.').';
                    
                    $sqlMsg = "INSERT INTO notfmsgs 
                    (fullMsg, admin, type)
                    VALUES
                    ('$notfmsg','$adminUserName', 'add')";
                    
                    $saveMsg = $conn->query($sqlMsg);
                    
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
            echo 'unauthorized';
        }

    $conn->close();
?>
