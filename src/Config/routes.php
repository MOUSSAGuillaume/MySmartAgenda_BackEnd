<?php

return [

    'POST' => [
        '/api/register' => [
            'controller' => 'AuthController',
            'method' => 'register'
        ],

        '/api/login' => [
            'controller' => 'AuthController',
            'method' => 'login'
        ]
    ],

    'GET' => [
        '/api/me' => [
            'controller' => 'AuthController',
            'method' => 'me'
        ]
    ]

];