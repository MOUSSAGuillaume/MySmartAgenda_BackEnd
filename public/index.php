<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use App\Repository\UserRepository;
use App\Security\JwtService;

$dotenv = Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();

header('Content-Type: application/json');

$userRepository = new UserRepository();

$user = $userRepository->findByEmail('mehdi@test.fr');

$jwtService = new JwtService();

$token = $jwtService->generateToken($user);

echo json_encode([
    'token' => $token
]);