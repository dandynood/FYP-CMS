<?php
    require_once 'config.php';
    $conn = new mysqli($DB_host,$DB_user,$DB_pass,$DB_name);

    if($conn->connect_error){
        echo "Connection failed: ".$conn->connect_error;   
    }         
        $data = json_decode(file_get_contents("php://input")); 
        $userID = urldecode($data->userID);
        $username = urldecode($data->username);
        $firstName = urldecode($data->firstName);
        $lastName = urldecode($data->lastName);
        $email = urldecode($data->email);
        $phoneNumber = urldecode($data->phoneNumber);
        $roleType = urldecode($data->roleType);
            
        $sql = "UPDATE users SET username='$username', firstName='$firstName', lastName='$lastName',email='$email',phoneNumer='$phoneNumber',role='$roleType' WHERE userID='$userID'";


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