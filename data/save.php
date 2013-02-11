<?php
error_reporting(-1);

function post($key) {
    if (isset($_POST[$key]))
        return $_POST[$key];
    return false;
}

# connect to the database
try {  
  $DBH = new PDO("mysql:host=localhost;dbname=mdbrdDB", "mdbrdadmin", "mdbrd");  
  $DBH->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ); 

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            $ID = $_GET['id'];
            
            $read = $DBH->prepare("SELECT mdbrd from mdbrds WHERE id = :id");
            $read->bindParam(':id', $ID);
            $read->execute();
            $result = $read->fetchAll();
            echo($result[0][mdbrd]);
            break;

        case 'DELETE':
            # code...
            break;

        case 'PUT':
            # code...
            break;

        case 'POST':
            $mdbrd = file_get_contents("php://input");

            #save data
            $save = $DBH->prepare("INSERT INTO mdbrds (mdbrd) value (:mdbrd)");
            $save->bindParam(':mdbrd', $mdbrd);
            $save->execute();

            $ID = $DBH->lastInsertID();

            // return new Response($ID, 200, array('Content-Type' => 'application/json'));
            echo $ID;
            break;
    }
}

catch(PDOException $e) {
    file_put_contents('PDOErrors.txt', $e->getMessage(), FILE_APPEND);
    echo "I'm sorry, Dave. I'm afraid I can't do that.";
}