<?php
session_start();

class LoginControllerFunctions {
    private $jsonFile = __DIR__ . '/accounts.json';
    
    public function login($username, $password) {
        if (!file_exists($this->jsonFile)) {
            throw new Exception("No accounts found.");
        }

        $accounts = json_decode(file_get_contents($this->jsonFile), true) ?? [];

        // Find account by username (case-insensitive)
        $user = null;
        foreach ($accounts as $account) {
            if (strtolower($account['username']) === strtolower($username)) {
                $user = $account;
                break;
            }
        }

        if (!$user) {
            throw new Exception("Invalid username or password.");
        }

        // Verify password
        if (!password_verify($password, $user['password'])) {
            throw new Exception("Invalid username or password.");
        }

        // Set session
        $_SESSION['user'] = $user;
        $_SESSION['expire_at'] = time() + 3600; // 1 hour expiration

        return $user;
    }
}

// Process Request
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $action = $_POST["action"] ?? "";

    if ($action === "login") {
        header('Content-Type: application/json');

        try {
            $username = trim($_POST["username"] ?? "");
            $password = trim($_POST["password"] ?? "");

            if (empty($username) || empty($password)) {
                throw new Exception("Username and password are required.");
            }

            $loginFunc = new LoginControllerFunctions();
            $user = $loginFunc->login($username, $password);

            echo json_encode([
                "status" => "success",
                "message" => "Login successful",
                "user" => $user
            ]);

        } catch (Exception $e) {
            error_log("Login failed: " . $e->getMessage());
            echo json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        }
    }
}
?>
