<?php
    require_once 'config.php';
    $conn = new mysqli($DB_host,$DB_user,$DB_pass,$DB_name);

    if($conn->connect_error){
        die("Connection failed: " . $conn->connect_error);
        echo 'failed';
    }         
        $data = json_decode(file_get_contents("php://input"));
        $plantationID = urldecode($data->plantationID);

        $sql = "SELECT plantationID,plantName,plantDescription FROM plantations WHERE plantationID = '$plantationID'";


        $result = $conn->query($sql);

        if($result->num_rows > 0){
            echo json_encode($result->fetch_all(MYSQLI_ASSOC));
        }
        else
        {
            echo 'failed';
        }

    $conn->close();
?>