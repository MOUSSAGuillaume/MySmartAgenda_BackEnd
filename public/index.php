<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();

header('Content-Type: application/json');

$routes = require __DIR__ . '/../src/Config/routes.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

if (!isset($routes[$method][$uri])) {

    http_response_code(404);

    echo json_encode([
        'error' => 'Route not found'
    ]);

    exit;
}

$route = $routes[$method][$uri];

$controllerClass = 'App\\Controller\\' . $route['controller'];

$controller = new $controllerClass();

$controller->{$route['method']}();