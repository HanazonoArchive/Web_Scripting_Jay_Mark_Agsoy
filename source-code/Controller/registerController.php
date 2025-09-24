<?php
session_start();

class RegisterControllerFunctions {

    private $dataFile = __DIR__ . "/accounts.json";

    public function register($fullname, $email, $username, $country, $password, $confirmPassword, $gender, $hobbies = []) {
        // Validate required fields
        if (empty($fullname) || empty($email) || empty($username) || empty($country) || empty($password) || empty($confirmPassword) || empty($gender)) {
            throw new Exception("All fields are required.");
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Invalid email format.");
        }

        if ($password !== $confirmPassword) {
            throw new Exception("Passwords do not match.");
        }

        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Sanitize hobbies (optional: lowercase or trim)
        $sanitizedHobbies = array_map(function($hobby) {
            return htmlspecialchars(trim($hobby), ENT_QUOTES, 'UTF-8');
        }, $hobbies);

        // Prepare user data
        $userData = [
            "fullname" => htmlspecialchars($fullname, ENT_QUOTES, 'UTF-8'),
            "email" => htmlspecialchars($email, ENT_QUOTES, 'UTF-8'),
            "username" => htmlspecialchars($username, ENT_QUOTES, 'UTF-8'),
            "country" => htmlspecialchars($country, ENT_QUOTES, 'UTF-8'),
            "password" => $hashedPassword,
            "gender" => htmlspecialchars($gender, ENT_QUOTES, 'UTF-8'),
            "hobbies" => $sanitizedHobbies,
            "created_at" => date("Y-m-d H:i:s")
        ];

        // Load existing data
        $accounts = [];
        if (file_exists($this->dataFile)) {
            $json = file_get_contents($this->dataFile);
            $accounts = json_decode($json, true) ?? [];
        }

        // Append new account
        $accounts[] = $userData;

        // Save back to file
        file_put_contents($this->dataFile, json_encode($accounts, JSON_PRETTY_PRINT));

        // Store in session (with expiration)
        $_SESSION["user"] = $userData;
        $_SESSION["expire_at"] = time() + 3600; // 1 hour expiration

        return true;
    }
}

// Process Request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $action = $_POST["action"] ?? "";

    if ($action === "register") {
        try {
            $controller = new RegisterControllerFunctions();

            // Handle hobbies array
            $hobbies = $_POST['hobbies'] ?? [];
            if (is_string($hobbies)) {
                // Convert comma-separated string to array if needed
                $hobbies = array_map('trim', explode(',', $hobbies));
            }

            $controller->register(
                trim($_POST["fullname"] ?? ""),
                trim($_POST["email"] ?? ""),
                trim($_POST["username"] ?? ""),
                trim($_POST["country"] ?? ""),
                trim($_POST["password"] ?? ""),
                trim($_POST["confirmPassword"] ?? ""),
                trim($_POST["gender"] ?? ""),
                $hobbies
            );

            header('Content-Type: application/json');
            echo json_encode(["status" => "success", "message" => "Registration successful."]);
        } catch (Exception $e) {
            error_log("Transaction failed: " . $e->getMessage());
            header('Content-Type: application/json');
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }
}
?>
