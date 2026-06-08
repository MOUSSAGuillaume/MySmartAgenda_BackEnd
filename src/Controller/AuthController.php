<?php

namespace App\Controller;

class AuthController
{
    public function register(): void
    {
        echo json_encode([
            'message' => 'register route'
        ]);
    }

    public function login(): void
    {
        echo json_encode([
            'message' => 'login route'
        ]);
    }

    public function me(): void
    {
        echo json_encode([
            'message' => 'me route'
        ]);
    }
}