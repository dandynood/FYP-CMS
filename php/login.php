<?php
    require_once 'config.php';
    $conn = new mysqli($DB_host,$DB_user,$DB_pass,$DB_name);

    if($conn->connect_error){
        echo 'failed';
        die("Connection failed: " . $conn->connect_error);
    }         
        $data = json_decode(file_get_contents("php://input")); 
        $username = urldecode($data->username);
        $password = $data->password;
        
        $password = hash('sha256',$password);

        $sql = "SELECT userID,username,firstName,lastName,phoneNumber,email,roleType FROM users WHERE userName = '$username' AND password = '$password'";


        $result = $conn->query($sql);

        if($result->num_rows > 0){
            while($row = $result->fetch_assoc()){
                echo json_encode($row);
            }
        }
        else
        {
            echo 'failed';
        }

    $conn->close();
?>