<?php
    require_once 'config.php';
    $conn = new mysqli($DB_host,$DB_user,$DB_pass,$DB_name);

    if($conn->connect_error){
        echo 'failed';
        die("Connection failed: " . $conn->connect_error);
    }         
        $data = json_decode(file_get_contents("php://input")); 
        $userID = urldecode($data->userID);

        $sql = "SELECT m.msgID, m.fullmsg, m.admin, m.datetime, m.type, mu.ifread FROM notfmsgs m 
                INNER JOIN notfusers mu
                ON mu.msgID = m.msgID
                WHERE mu.userID = '$userID' AND mu.ifread = '0' ORDER BY m.datetime DESC";

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