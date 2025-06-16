<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

class Database {
    private $conn;

    public function __construct() {
        $serverName = "ALE-ROMERO\SQLEXPRESS";
        $connectionInfo = array(
            "Database" => "BoutiqueDB",
            "UID" => "BoutiqueAdmin",
            "PWD" => "1234",
            "CharacterSet" => "UTF-8"
        );
        
        $this->conn = sqlsrv_connect($serverName, $connectionInfo);
        
        if (!$this->conn) {
            die(print_r(sqlsrv_errors(), true));
        }
    }

    public function query($sql, $params = array()) {
        $stmt = sqlsrv_query($this->conn, $sql, $params);
        
        if ($stmt === false) {
            die(print_r(sqlsrv_errors(), true));
        }
        
        $result = array();
        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            $result[] = $row;
        }
        
        return $result;
    }

    public function execute($sql, $params = array()) {
        $stmt = sqlsrv_query($this->conn, $sql, $params);
        
        if ($stmt === false) {
            die(print_r(sqlsrv_errors(), true));
        }
        
        return sqlsrv_rows_affected($stmt);
    }

    public function __destruct() {
        if ($this->conn) {
            sqlsrv_close($this->conn);
        }
    }
}
?>