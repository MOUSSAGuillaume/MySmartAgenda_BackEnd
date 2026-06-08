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
        ],

        '/api/appointments' => [
            'controller' => 'AppointmentController',
            'method' => 'create'
        ]
    ],

    'GET' => [

        '/api/me' => [
            'controller' => 'AuthController',
            'method' => 'me'
        ],

        '/api/appointments' => [
            'controller' => 'AppointmentController',
            'method' => 'list'
        ]
    ]

];