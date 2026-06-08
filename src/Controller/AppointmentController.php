<?php

namespace App\Controller;

use App\Config\Database;
use App\Middleware\AuthMiddleware;
use App\Repository\AppointmentRepository;

class AppointmentController
{
    private AppointmentRepository $appointmentRepository;

    public function __construct()
    {
        $this->appointmentRepository = new AppointmentRepository(
            Database::getConnection()
        );
    }

    public function create(): void
    {
        $userToken = AuthMiddleware::getAuthenticatedUser();

        if (!$userToken) {
            http_response_code(401);
            echo json_encode(['error' => 'Token manquant ou invalide']);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);

        $appointmentId = $this->appointmentRepository->create(
            $userToken->user_id,
            $data['title'],
            $data['description'] ?? null,
            $data['appointment_date']
        );

        http_response_code(201);

        echo json_encode([
            'message' => 'Rendez-vous créé',
            'appointment_id' => $appointmentId
        ]);
    }

    public function list(): void
    {
        $userToken = AuthMiddleware::getAuthenticatedUser();

        if (!$userToken) {
            http_response_code(401);
            echo json_encode(['error' => 'Token manquant ou invalide']);
            return;
        }

        echo json_encode(
            $this->appointmentRepository->findByUser($userToken->user_id)
        );
    }
}