<?php

namespace App\Repository;

use PDO;

class TaskRepository
{
    public function __construct(
        private PDO $pdo
    ) {
    }

    public function create(
        int $userId,
        string $title,
        ?string $description,
        string $status = 'TODO'
    ): int {

        $stmt = $this->pdo->prepare("
            INSERT INTO tasks (
                user_id,
                title,
                description,
                status
            )
            VALUES (
                :user_id,
                :title,
                :description,
                :status
            )
        ");

        $stmt->execute([
            'user_id' => $userId,
            'title' => $title,
            'description' => $description,
            'status' => $status
        ]);

        return (int) $this->pdo->lastInsertId();
    }

    public function findByUser(int $userId): array
    {
        $stmt = $this->pdo->prepare("
            SELECT *
            FROM tasks
            WHERE user_id = :user_id
            ORDER BY id DESC
        ");

        $stmt->execute([
            'user_id' => $userId
        ]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function update(
        int $id,
        int $userId,
        string $title,
        ?string $description,
        string $status
    ): bool {

        $stmt = $this->pdo->prepare("
            UPDATE tasks
            SET
                title = :title,
                description = :description,
                status = :status,
                updated_at = NOW()
            WHERE
                id = :id
            AND
                user_id = :user_id
        ");

        $stmt->execute([
            'id' => $id,
            'user_id' => $userId,
            'title' => $title,
            'description' => $description,
            'status' => $status
        ]);

        return $stmt->rowCount() > 0;
    }

    public function delete(
        int $id,
        int $userId
    ): bool {

        $stmt = $this->pdo->prepare("
            DELETE FROM tasks
            WHERE
                id = :id
            AND
                user_id = :user_id
        ");

        $stmt->execute([
            'id' => $id,
            'user_id' => $userId
        ]);

        return $stmt->rowCount() > 0;
    }
}