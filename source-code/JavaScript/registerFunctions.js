document.addEventListener("DOMContentLoaded", () => {
    new createRegisterForm("register_button");
    console.log("registerFunctions.js loaded");
});

class createRegisterForm {
    constructor(submitButtonId) {
        this.submitButton = document.getElementById(submitButtonId);

        if (!this.submitButton) {
            console.error(`Element with ID ${submitButtonId} not found.`);
            return;
        }

        this.submitButton.addEventListener("click", () => this.handleSubmit());
    }

    getFormData() {
        let formData = {
            fullname: this.getValueRaw("fullname"), // leave as-is
            email: this.getValueSanitized("email"),
            username: this.getValueRaw("username"), // leave as-is
            country: this.getValueSanitized("country"),
            password: this.getValueSanitized("password"),
            confirmPassword: this.getValueSanitized("confirm_password"),
            gender: this.getValueSanitized("gender"),
            hobbies: this.getCheckedValues("hobby_"),
            action: "register"
        };

        // check if any field is empty
        if (
            Object.entries(formData).some(([key, value]) =>
                (typeof value === "string" && !value.trim()) ||
                (Array.isArray(value) && value.length === 0)
            )
        ) {
            this.showMessage("Some inputs are missing.", "danger");
            return null;
        }

        if (formData.password !== formData.confirmPassword) {
            this.showMessage("Passwords do not match.", "danger");
            return null;
        }

        return formData;
    }

    getValueRaw(id) {
        return document.getElementById(id)?.value || "";
    }

    getValueSanitized(id) {
        return (document.getElementById(id)?.value || "")
            .trim()
            .replace(/\s+/g, "")
            .toLowerCase();
    }

    getCheckedValues(prefix) {
        return Array.from(document.querySelectorAll(`sl-checkbox[id^="${prefix}"]`))
            .filter(cb => cb.checked)
            .map(cb => cb.value.toLowerCase());
    }

    clearInputField() {
        ["fullname", "email", "username", "country", "password", "confirm_password", "gender"].forEach(id => {
            document.getElementById(id).value = "";
        });

        document.querySelectorAll(`sl-checkbox[id^="hobby_"]`).forEach(cb => cb.checked = false);
    }

    // Updated showMessage to allow dynamic text and color
    showMessage(text, variant = "danger") {
        this.submitButton.removeAttribute("loading");
        this.submitButton.setAttribute("variant", variant);

        const message = document.getElementById("message");
        const animation = document.getElementById("animation");

        animation.play = true;
        message.textContent = text;

        // Apply color dynamically based on variant
        switch(variant) {
            case "success":
                message.style.color = "var(--sl-color-success-600)";
                break;
            case "warning":
                message.style.color = "var(--sl-color-warning-600)";
                break;
            case "danger":
            default:
                message.style.color = "var(--sl-color-danger-600)";
        }

        console.log(text);
    }

    async sendFormData(formData) {
        try {
            const response = await fetch("/Web_Scripting_Jay_Mark_Agsoy/source-code/Controller/registerController.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString(),
            });

            const data = await response.text();
            if (data.includes("success")) {
                this.showMessage("Registration successful! Redirecting...", "success");
                this.clearInputField();

                setTimeout(() => {  
                    window.location.href = "/Web_Scripting_Jay_Mark_Agsoy/source-code/Webpage/mainpage.html";
                }, 2000);
            } else {
                this.showMessage("Registration failed. Try again.", "warning");
                console.warn("Server response:", data);
            }
        } catch (error) {
            this.showMessage("Error sending data. Please try later.", "danger");
            console.error("Error sending form data:", error);
        }
    }

    handleSubmit() {
        console.log("Submit button clicked");
        this.submitButton.setAttribute("loading", true);

        const formData = this.getFormData();
        if (formData) this.sendFormData(formData);
    }
}
