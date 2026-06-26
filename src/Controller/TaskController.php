<?php

namespace App\Controller;

use App\Config\Database;
use App\Middleware\AuthMiddleware;
use App\Repository\TaskRepository;

class TaskController
{
    private TaskRepository $taskRepository;

    public function __construct()
    {
        $this->taskRepository = new TaskRepository(
            Database::getConnection()
        );
    }

    public function create(): void
    {
        $user = AuthMiddleware::getAuthenticatedUser();

        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Token manquant ou invalide']);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);

        $taskId = $this->taskRepository->create(
            $user->user_id,
            $data['title'],
            $data['description'] ?? null,
            $data['status'] ?? 'TODO'
        );

        http_response_code(201);

        echo json_encode([
            'message' => 'Tâche créée',
            'task_id' => $taskId
        ]);
    }

    public function list(): void
    {
        $user = AuthMiddleware::getAuthenticatedUser();

        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Token manquant ou invalide']);
            return;
        }

        echo json_encode(
            $this->taskRepository->findByUser($user->user_id)
        );
    }

    public function update(array $params): void
    {
        $user = AuthMiddleware::getAuthenticatedUser();

        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Token manquant ou invalide']);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);

        $success = $this->taskRepository->update(
            $params['id'],
            $user->user_id,
            $data['title'],
            $data['description'] ?? null,
            $data['status']
        );

        if (!$success) {
            http_response_code(404);
            echo json_encode(['error' => 'Tâche introuvable']);
            return;
        }

        echo json_encode([
            'message' => 'Tâche mise à jour'
        ]);
    }

    public function delete(array $params): void
    {
        $user = AuthMiddleware::getAuthenticatedUser();

        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Token manquant ou invalide']);
            return;
        }

        $success = $this->taskRepository->delete(
            $params['id'],
            $user->user_id
        );

        if (!$success) {
            http_response_code(404);
            echo json_encode(['error' => 'Tâche introuvable']);
            return;
        }

        echo json_encode([
            'message' => 'Tâche supprimée'
        ]);
    }
}