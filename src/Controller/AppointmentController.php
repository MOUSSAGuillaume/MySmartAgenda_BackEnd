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

    public function update(array $params): void
    {
        $user = AuthMiddleware::getAuthenticatedUser();

        if (!$user) {
            http_response_code(401);

            echo json_encode([
                'error' => 'Token manquant ou invalide'
            ]);

            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);

        $success = $this->appointmentRepository->update(
            $params['id'],
            $user->user_id,
            $data['title'],
            $data['description'] ?? null,
            $data['appointment_date']
        );

        if (!$success) {
            http_response_code(404);

            echo json_encode([
                'error' => 'Rendez-vous introuvable'
            ]);

            return;
        }

        echo json_encode([
            'message' => 'Rendez-vous mis à jour'
        ]);
    }

    public function delete(array $params): void
    {
        $user = AuthMiddleware::getAuthenticatedUser();

        if (!$user) {
            http_response_code(401);

            echo json_encode([
                'error' => 'Token manquant ou invalide'
            ]);

            return;
        }

        $success = $this->appointmentRepository->delete(
            $params['id'],
            $user->user_id
        );

        if (!$success) {
            http_response_code(404);

            echo json_encode([
                'error' => 'Rendez-vous introuvable'
            ]);

            return;
        }

        echo json_encode([
            'message' => 'Rendez-vous supprimé'
        ]);
    }
}