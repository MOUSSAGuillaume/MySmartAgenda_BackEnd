<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use App\Service\AuthService;

$dotenv = Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();

header('Content-Type: application/json');

try {

    $authService = new AuthService();

    $userId = $authService->register([
        'firstname' => 'Mehdi',
        'lastname' => 'Moussa',
        'email' => 'mehdi@test.fr',
        'password' => 'Password123'
    ]);

    echo json_encode([
        'status' => 'success',
        'user_id' => $userId
    ]);

} catch (Exception $e) {

    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);

}