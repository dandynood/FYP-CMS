<?php
    require_once 'config.php';
    $conn = new mysqli($DB_host,$DB_user,$DB_pass,$DB_name);

    if($conn->connect_error){
        echo "Connection failed: ".$conn->connect_error;   
    }         
        $data = json_decode(file_get_contents("php://input")); 
        $admin = urldecode($data->choice);
            
        if($choice == true){
             $sql = "UPDATE users SET roleType=Admin WHERE userID='$userID'";
        } else if($choice == false){
             $sql = "UPDATE users SET roleType=Normal WHERE userID='$userID'";
        }

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