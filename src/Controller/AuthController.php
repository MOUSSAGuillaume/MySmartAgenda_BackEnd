<?php

namespace App\Controller;

use App\Service\AuthService;

class AuthController
{
    private AuthService $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    public function register(): void
    {
        $data = json_decode(
            file_get_contents('php://input'),
            true
        );

        try {

            $userId = $this->authService->register([
                'firstname' => $data['firstname'],
                'lastname'  => $data['lastname'],
                'email'     => $data['email'],
                'password'  => $data['password']
            ]);

            http_response_code(201);

            echo json_encode([
                'message' => 'Utilisateur créé',
                'user_id' => $userId
            ]);

        } catch (\Exception $e) {

            http_response_code(400);

            echo json_encode([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function login(): void
    {
        $data = json_decode(
            file_get_contents('php://input'),
            true
        );

        $user = $this->authService->login(
            $data['email'],
            $data['password']
        );

        if (!$user) {

            http_response_code(401);

            echo json_encode([
                'error' => 'Identifiants invalides'
            ]);

            return;
        }

        $jwtService = new \App\Security\JwtService();

        $token = $jwtService->generateToken($user);

        echo json_encode([
            'token' => $token
        ]);
    }
}