document.addEventListener("DOMContentLoaded", function() {
    new createLoginForm("login_button");
    console.log("loginFunctions.js loaded");
});

class createLoginForm {
        constructor(submitButtonId) {
        this.submitButton = document.getElementById(submitButtonId);

        if (!this.submitButton) {
            console.error(`Element with ID ${submitButton} not found.`);
            return;
        }

        this.submitButton.addEventListener("click", () => this.handleSubmit());
    }

    getFormData() {
        let formData = {
            username: this.getValue("username"),
            password: this.getValue("password"),
            action: "login"
        };

        if (Object.entries(formData).some(([key, value]) => typeof value === "string" && !value.trim())) {
            this.submitButton.removeAttribute("loading");
            this.submitButton.setAttribute("variant", "danger");

            // If any field is empty, show an error message
            const message = document.getElementById("message");
            const animation = document.getElementById("animation");

            animation.play = true;
            message.style.color = "var(--sl-color-danger-600)";
            message.textContent = "Invalid username or password.";
            console.log("Username or password missing.");
            return null;
        }
        return formData;
    }

    getValue(id) {
    return (document.getElementById(id)?.value || "").replace(/\s+/g, "").toLowerCase();
    }


    clearInputField(){
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
    }

    async sendFormData(formData) {
        try {
            const response = await fetch("/Web_Scripting_Jay_Mark_Agsoy/source-code/Controller/loginController.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString(),
            });

            const data = await response.text();
            if (data.includes("success")) {
                this.submitButton.removeAttribute("loading");
                this.submitButton.setAttribute("variant", "success");
                this.clearInputField();

                // If any field is empty, show an error message
                const message = document.getElementById("message");
                const animation = document.getElementById("animation");

                animation.play = true;
                message.style.color = "var(--sl-color-success-600)";
                message.textContent = "Login successful. Redirecting...";
                console.log("Login successful.");

                setTimeout(() => { 
                    window.location.href = "/Web_Scripting_Jay_Mark_Agsoy/source-code/Webpage/mainpage.html"; 
                }, 3000);
                
            } else {
                this.submitButton.removeAttribute("loading");
                this.submitButton.setAttribute("variant", "warning");
                console.log("Login failed:", data, formData);
            }   
        } catch (error) {
            console.error("Error sending form data:", error);   
            this.submitButton.removeAttribute("loading");
            this.submitButton.setAttribute("variant", "danger");
        }
    }

    handleSubmit() {
        console.log("Submit button clicked");
        this.submitButton.setAttribute("loading", true);

        const formData = this.getFormData();
        if (formData) this.sendFormData(formData);
    }
}