function toggleMenu() {
    let nav = document.querySelector(".nav-links");
    if (nav.style.display === "flex") {
        nav.style.display = "none";
    } else {
        nav.style.display = "flex";
    }
}


document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".solutions .my-button");
    const sections = document.querySelectorAll(".content-section");

    // Hide all sections initially
    sections.forEach(section => section.style.display = "none");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            console.log("Button clicked:", this.getAttribute("data-target")); // Debugging log
            
            // Hide all sections
            sections.forEach(section => {
                section.classList.remove("active");
                section.style.display = "none";
            });

            // Get the target section
            const targetID = this.getAttribute("data-target");
            const targetSection = document.getElementById(targetID);

            if (targetSection) {
                console.log("Showing section:", targetID); // Debugging log
                targetSection.classList.add("active");
                targetSection.style.display = "block"; // Ensure it's visible
            }

            // Change background image
            const bgImage = this.getAttribute("data-bg-image");
            if (bgImage) {
                document.body.style.backgroundImage = `url('${bgImage}')`;
                document.body.style.backgroundSize = "cover"; // Makes the image cover the whole screen
                document.body.style.backgroundPosition = "center"; // Centers the image
                document.body.style.backgroundRepeat = "no-repeat"; // Prevents repeating
            } else {
                document.body.style.backgroundImage = "none"; // Remove background if no image provided
            }
        });
    });
});

