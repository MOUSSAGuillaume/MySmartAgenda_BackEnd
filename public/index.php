<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use App\Config\Database;

$dotenv = Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();

header('Content-Type: application/json');

try {
    $pdo = Database::getConnection();

    echo json_encode([
        'project' => 'MySmartAgenda BackEnd',
        'database' => 'connected'
    ]);
} catch (Exception $e) {
    echo json_encode([
        'database' => 'error',
        'message' => $e->getMessage()
    ]);
}