// Logout button functionality
const logoutButton = document.getElementById("logout_button");
if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
        try {
            const response = await fetch("/CS15Laboratory/source-code/Controller/logout.php", {
                method: "GET"
            });
            const data = await response.json();
            if (data.status === "success") {
                // Redirect to login page after logout
                window.location.href = "/CS15Laboratory/source-code/Webpage/login.html";
            } else {
                console.warn("Logout failed:", data);
            }
        } catch (err) {
            console.error("Error during logout:", err);
        }
    });
}
