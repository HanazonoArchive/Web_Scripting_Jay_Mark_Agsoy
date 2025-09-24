document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/CS15Laboratory/source-code/Controller/mainpageController.php");
        const data = await response.json();

        if (data.status === "error") {
            window.location.href = "/CS15Laboratory/source-code/Webpage/login.html";
            return;
        }

        const user = data.user;

        // Map country code to name
        let countryname = "";
        switch (user.country) {
            case "ph":
                countryname = "Philippines";
                break;
            case "us":
                countryname = "United States";
                break;
            case "jp":
                countryname = "Japan";
                break;
            case "de":
                countryname = "Germany";
                break;
            default:
                countryname = "Unknown";
        }

        // Map gender code to display text
        let genderDisplay = "";
        switch (user.gender) {
            case "male":
                genderDisplay = "Male";
                break;
            case "female":
                genderDisplay = "Female";
                break;
            case "other":
                genderDisplay = "Other";
                break;
            default:
                genderDisplay = "Unknown";
        }

        // Populate readonly input fields
        document.getElementById("fullname").value = user.fullname;
        document.getElementById("email").value = user.email;
        document.getElementById("username").value = user.username;
        document.getElementById("country").value = countryname;
        document.getElementById("gender").value = genderDisplay;
        document.getElementById("created_at").value = user.created_at;

        // Populate hashed password
        const hashedInput = document.getElementById("hashed_password");
        if (hashedInput) {
            hashedInput.value = user.password || "N/A";
        }

        // Populate hobbies as bullet points
        const hobbiesList = document.getElementById("hobbies");
        if (hobbiesList) {
            hobbiesList.innerHTML = ""; // Clear previous entries
            if (user.hobbies && Array.isArray(user.hobbies) && user.hobbies.length > 0) {
                user.hobbies.forEach(hobby => {
                    const li = document.createElement("li");
                    li.textContent = hobby.charAt(0).toUpperCase() + hobby.slice(1); // Capitalize first letter
                    hobbiesList.appendChild(li);
                });
            } else {
                const li = document.createElement("li");
                li.textContent = "No hobbies listed";
                hobbiesList.appendChild(li);
            }
        }

    } catch (err) {
        console.error("Error fetching user data:", err);
    }
});
