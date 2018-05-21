<?php
    require_once 'config.php';
    $conn = new mysqli($DB_host,$DB_user,$DB_pass,$DB_name);

    if($conn->connect_error){
        die("Connection failed: " . $conn->connect_error);
        echo 'failed';
    }

    $url = "http://45.76.50.6:8080/api/v1/data";

    $opts = array(
        'http'=>array(
            'method'=>"GET",
            'header'=>"Gateway-API-Key: nzyT2d3Ycrs9uPIeEZDJw1rtiwOUwRIY"
            )
    );

    $context = stream_context_create($opts);

    $output = json_decode(file_get_contents($url, false, $context));

    echo json_encode($output);

    /*$sql = "SELECT nodeNumber, plantationID FROM plantations";

    $result = $conn->query($sql);

    if($result->num_rows >= 0){
        $plantCodes = $result->fetch_all(MYSQLI_ASSOC);
    }

    //TO DO extract
    $gotAirTemp = false;
    $gotHumidity = false;
    $gotLightIntensity = false;
    $gotMoisture = false;

    $airTempASCII = 65;
    $humidityASCII = 67;
    $lightASCII = 73;
    $moistureASCII = 69;

    class dataFormat{
        public $plantation = null;
        public $dateTime = null;
        public $airTemp = null;
        public $humidity = null;
        public $lightIntensity = null;
        public $soilMoisture = null;
    }
    $data = new dataFormat();

    foreach ($output->data as $reading) {
        //echo json_encode($reading->data);
        $raw = $reading->raw;
        //echo json_encode($raw);
        
        if($raw[3] == $airTempASCII){
            if(!$gotAirTemp){
                foreach($raw as $value){
                    
                }
            }
        } else if($raw[3] == $humidityASCII){
            if(!$gotHumidity){
                foreach($raw as $value){
                    
                }
            }
        } else if($raw[3] == $lightASCII){
            if(!$gotLightIntensity){
                foreach($raw as $value){
                    
                }
            }
        } else if($raw[3] == $moistureASCII){
            if(!$gotMoisture){
                foreach($raw as $value){
                    
                }
            }
        }
        
    }
    

    //TO DO insert into database
    */

?>
