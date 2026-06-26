<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();

header('Content-Type: application/json');

$routes = require __DIR__ . '/../src/Config/routes.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

$routeFound = null;
$params = [];

foreach ($routes[$method] ?? [] as $routePath => $routeConfig) {
    $pattern = preg_replace('#\{id\}#', '([0-9]+)', $routePath);
    $pattern = '#^' . $pattern . '$#';

    if (preg_match($pattern, $uri, $matches)) {
        $routeFound = $routeConfig;

        if (isset($matches[1])) {
            $params['id'] = (int) $matches[1];
        }

        break;
    }
}

if (!$routeFound) {
    http_response_code(404);

    echo json_encode([
        'error' => 'Route not found'
    ]);

    exit;
}

$controllerClass = 'App\\Controller\\' . $routeFound['controller'];

$controller = new $controllerClass();

$controller->{$routeFound['method']}($params);