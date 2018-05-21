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
        $adminPass = urldecode($data->adminPass);
        $adminID = urldecode($data->adminID);

        $adminPass = hash('sha256',$adminPass);
        $auth = "SELECT userID FROM users WHERE userID = '$adminID' AND password = '$adminPass'";

        $getAuth = $conn->query($auth);

        if($getAuth->num_rows == 1){
            
            $check = "SELECT userID FROM users WHERE userID = '$userID'";    
            $checkResult = $conn->query($check);
            
            if($checkResult->num_rows == 1){
                
                $checkUserName = "SELECT username FROM users WHERE username='$username'";
                $checkUserNameResult = $conn->query($checkUserName);
                if($checkUserNameResult->num_rows == 0){

                    $sql = "UPDATE users SET username='$username', firstName='$firstName', lastName='$lastName',email='$email',phoneNumber='$phoneNumber',roleType='$roleType' WHERE userID='$userID'";

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
                    echo 'non-unique';
                }
                
            } else {
                echo 'failed';
            }

        } else {
            echo 'unauthorized';
        }

    $conn->close();
?>
