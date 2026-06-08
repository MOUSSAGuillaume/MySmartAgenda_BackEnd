<?php

namespace App\Service;

use App\Repository\UserRepository;

class AuthService
{
    private UserRepository $userRepository;

    public function __construct()
    {
        $this->userRepository = new UserRepository();
    }

    public function register(array $data): int
    {
        $existingUser = $this->userRepository->findByEmail($data['email']);

        if ($existingUser) {
            throw new \Exception('Cet email existe déjà.');
        }

        $data['password_hash'] = password_hash(
            $data['password'],
            PASSWORD_DEFAULT
        );

        unset($data['password']);

        return $this->userRepository->create($data);
    }

    public function login(string $email, string $password): ?array
    {
        $user = $this->userRepository->findByEmail($email);

        if (!$user) {
            return null;
        }

        if (!password_verify($password, $user['password_hash'])) {
            return null;
        }

        return $user;
    }
}