<?php

namespace App\Repository;

use PDO;

class AppointmentRepository
{
    public function __construct(
        private PDO $pdo
    ) {}

    public function create(
        int $userId,
        string $title,
        ?string $description,
        string $appointmentDate
    ): int {
        $stmt = $this->pdo->prepare("
            INSERT INTO appointments (
                user_id,
                title,
                description,
                appointment_date
            )
            VALUES (
                :user_id,
                :title,
                :description,
                :appointment_date
            )
        ");

        $stmt->execute([
            'user_id' => $userId,
            'title' => $title,
            'description' => $description,
            'appointment_date' => $appointmentDate
        ]);

        return (int) $this->pdo->lastInsertId();
    }

    public function findByUser(int $userId): array
    {
        $stmt = $this->pdo->prepare("
            SELECT *
            FROM appointments
            WHERE user_id = :user_id
            ORDER BY appointment_date ASC
        ");

        $stmt->execute([
            'user_id' => $userId
        ]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function update(
        int $appointmentId,
        int $userId,
        string $title,
        ?string $description,
        string $appointmentDate
    ): bool {
        $stmt = $this->pdo->prepare("
            UPDATE appointments
            SET title = :title,
                description = :description,
                appointment_date = :appointment_date
            WHERE id = :id
            AND user_id = :user_id
        ");

        $stmt->execute([
            'id' => $appointmentId,
            'user_id' => $userId,
            'title' => $title,
            'description' => $description,
            'appointment_date' => $appointmentDate
        ]);

        return $stmt->rowCount() > 0;
    }

    public function delete(int $appointmentId, int $userId): bool
    {
        $stmt = $this->pdo->prepare("
            DELETE FROM appointments
            WHERE id = :id
            AND user_id = :user_id
        ");

        $stmt->execute([
            'id' => $appointmentId,
            'user_id' => $userId
        ]);

        return $stmt->rowCount() > 0;
    }
}