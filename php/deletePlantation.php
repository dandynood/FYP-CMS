<?php
    require_once 'config.php';
    $conn = new mysqli($DB_host,$DB_user,$DB_pass,$DB_name);

    if($conn->connect_error){
        echo "Connection failed: " . $conn->connect_error;
        
    }         
        $data = json_decode(file_get_contents("php://input"));
        $plantID = urldecode($data->plantationID);
            
        $sql = "DELETE FROM plantations WHERE plantationID='$plantID'";


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