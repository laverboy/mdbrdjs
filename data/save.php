<?php
error_reporting(-1);

function post($key) {
    if (isset($_POST[$key]))
        return $_POST[$key];
    return false;
}
$mdbrd = file_get_contents("php://input");
print_r($mdbrd);
// # connect to the database
// try {  
//   $DBH = new PDO("mysql:host=localhost;dbname=mdbrdjs", root, root);  
//   $DBH->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );  
  
//   #save data
//   $save = $DBH->prepare("INSERT INTO mdbrds (mdbrd) value (:mdbrd)");
//   $save->bindParam(':mdbrd', $mdbrd);
//   $save->execute();

//   $ID = $DBH->lastInsertID();

//   $read = $DBH->prepare("SELECT mdbrd from mdbrds WHERE id = :id");
//   $read->bindParam(':id', $ID);
//   $read->execute();
//   $result = $read->fetchAll();
//   print_r($result[0][mdbrd]);

// }  
// catch(PDOException $e) {  
//     echo "I'm sorry, Dave. I'm afraid I can't do that.";  
//     file_put_contents('PDOErrors.txt', $e->getMessage(), FILE_APPEND);  
// }