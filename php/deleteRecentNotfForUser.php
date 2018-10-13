<?php
    require_once 'config.php';
    $conn = new mysqli($DB_host,$DB_user,$DB_pass,$DB_name);

    if($conn->connect_error){
        echo 'failed';
        die("Connection failed: " . $conn->connect_error);
    }         
        $data = json_decode(file_get_contents("php://input")); 
        $userID = urldecode($data->userID);

        $sql = "DELETE FROM notfusers mu
                WHERE mu.userID = '$userID' AND mu.ifread = 0";

        $sql2 = "UPDATE notfusers SET ifread = 1 WHERE userID = '$userID'";

        $result = $conn->query($sql2);

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
