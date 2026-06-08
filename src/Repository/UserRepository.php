<?php

namespace App\Repository;

use App\Config\Database;
use PDO;

class UserRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = Database::getConnection();
    }

    public function findByEmail(string $email): ?array
    {
        $sql = "SELECT * FROM users WHERE email = :email";

        $stmt = $this->pdo->prepare($sql);

        $stmt->execute([
            'email' => $email
        ]);

        $user = $stmt->fetch();

        return $user ?: null;
    }

    public function create(array $data): int
    {
        $sql = "
            INSERT INTO users (
                firstname,
                lastname,
                email,
                password_hash
            )
            VALUES (
                :firstname,
                :lastname,
                :email,
                :password_hash
            )
        ";

        $stmt = $this->pdo->prepare($sql);

        $stmt->execute($data);

        return (int) $this->pdo->lastInsertId();
    }

    public function findById(int $id): ?array
    {
        $sql = "SELECT * FROM users WHERE id = :id";

        $stmt = $this->pdo->prepare($sql);

        $stmt->execute([
            'id' => $id
        ]);

        $user = $stmt->fetch();

        return $user ?: null;
    }
}