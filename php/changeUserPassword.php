<?php
    require_once 'config.php';
    $conn = new mysqli($DB_host,$DB_user,$DB_pass,$DB_name);

    if($conn->connect_error){
        echo "Connection failed: ".$conn->connect_error;   
    }         
        $data = json_decode(file_get_contents("php://input")); 
        $userID = urldecode($data->userID);
        $newPass = urldecode($data->newPass);
        $adminPass = urldecode($data->adminPass);
        $adminID = urldecode($data->adminID);
            
        $adminPass = hash('sha256',$adminPass);

        $auth = "SELECT userID FROM users WHERE userID = '$adminID' AND password = '$adminPass'";

        $newPass = hash('sha256',$newPass);

        $getAuth = $conn->query($auth);

        if($getAuth->num_rows == 1){
            
            $check = "SELECT userID FROM users WHERE userID = '$userID'";    
            $checkResult = $conn->query($check);
            
            if($checkResult->num_rows == 1){
                $sql = "UPDATE users SET password='$newPass' WHERE userID='$userID'";
                $result = $conn->query($sql);

                if($conn->affected_rows >= 0)
                {
                    echo 'success';
                }
                else
                {
                    echo 'failed';
                }
            } else {
                echo 'failed';
            }

        } else {
            echo 'unauthorized';
        }


    $conn->close();
?>