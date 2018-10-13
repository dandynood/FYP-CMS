<?php
    require_once 'config.php';
    $conn = new mysqli($DB_host,$DB_user,$DB_pass,$DB_name);

    if($conn->connect_error){
        echo "Connection failed: " . $conn->connect_error;
        
    }         
        $data = json_decode(file_get_contents("php://input"));
        $plantID = urldecode($data->plantID);
        $plantName = urldecode($data->plantName);
        $adminPass = urldecode($data->adminPass);
        $adminID = urldecode($data->adminID);
        $adminUserName = urldecode($data->adminUserName);
            
        $adminPass = hash('sha256',$adminPass);
        $auth = "SELECT userID FROM users WHERE userID = '$adminID' AND password = '$adminPass'";

        $getAuth = $conn->query($auth);

        if($getAuth->num_rows == 1){

            $sql = "DELETE FROM plantations WHERE plantationID='$plantID'";
            $result = $conn->query($sql);

            if($conn->affected_rows > 0)
            {
                echo 'success';
                
                $notfmsg = 'deleted a plantation, '.$plantName.' ('. $plantID.').';
                    
                $sqlMsg = "INSERT INTO notfmsgs (fullMsg, admin, type) VALUES ('$notfmsg','$adminUserName','delete')";
                    
                $saveMsg = $conn->query($sqlMsg);
            }
            else
            {
                echo 'failed';
            }

        } else {
            echo 'unauthorized';
        }

    $conn->close();
?>
