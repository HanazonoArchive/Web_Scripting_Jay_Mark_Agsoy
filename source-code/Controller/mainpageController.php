<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user']) || !isset($_SESSION['expire_at']) || time() > $_SESSION['expire_at']) {
    // Session missing or expired
    echo json_encode([
        "status" => "error",
        "message" => "No active session"
    ]);
    exit;
}

// Return user session data
$user = $_SESSION['user'];
echo json_encode([
    "status" => "success",
    "user" => $user
]);
