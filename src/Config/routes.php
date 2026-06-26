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
        ],

        '/api/tasks' => [
            'controller' => 'TaskController',
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
        ],

        '/api/tasks' => [
            'controller' => 'TaskController',
            'method' => 'list'
        ]
    ],

    'PUT' => [
        '/api/appointments/{id}' => [
            'controller' => 'AppointmentController',
            'method' => 'update'
        ],

        '/api/tasks/{id}' => [
            'controller' => 'TaskController',
            'method' => 'update'
        ]
    ],

    'DELETE' => [
        '/api/appointments/{id}' => [
            'controller' => 'AppointmentController',
            'method' => 'delete'
        ],

        '/api/tasks/{id}' => [
            'controller' => 'TaskController',
            'method' => 'delete'
        ]
    ]

];