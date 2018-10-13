<?php
    require_once 'config.php';
    $conn = new mysqli($DB_host,$DB_user,$DB_pass,$DB_name);

    if($conn->connect_error){
        echo 'failed';
        die("Connection failed: " . $conn->connect_error);
    }         
        $data = json_decode(file_get_contents("php://input")); 

        $sql = "SELECT msgID, fullMsg, DATE(dateTime) as date, dateTime, admin, type FROM notfmsgs ORDER BY datetime DESC";

        $sql2 = "SELECT DISTINCT DATE(datetime) as date FROM notfmsgs ORDER BY datetime DESC";

        $result = $conn->query($sql);
        $result2 = $conn->query($sql2);

        if($result->num_rows > 0 && $result2->num_rows > 0){
            $msgs = $result->fetch_all(MYSQLI_ASSOC);
            $dates = $result2->fetch_all(MYSQLI_ASSOC);
            
            $array['dates'] = $dates;
            $array['msgs'] = $msgs;

            echo json_encode($array);
        }
        else
        {
            echo 'failed';
        }

    $conn->close();
?>
