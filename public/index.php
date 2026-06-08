<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();

header('Content-Type: application/json');

echo json_encode([
    'project' => 'MySmartAgenda BackEnd',
    'status' => 'running',
    'environment' => $_ENV['APP_ENV']
]);