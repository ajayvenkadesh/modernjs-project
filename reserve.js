// reserve.js
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("reservation-form");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get form data
        const formData = new FormData(form);
        const reservationData = {
            name: formData.get('name'),  // Get the name input value
            email: formData.get('email'),  // Get the email input value
            phone: formData.get('phone'),  // Get the phone input value
            date: formData.get('date'),  // Get the date input value
            people: formData.get('people')  // Get the selected number of people
        };

        // Send reservation data to JSON server using Axios
        axios.post('http://localhost:3001/reservations', reservationData)
            .then(response => {
                // Show success message
                document.getElementById("success-message").style.display = "block";
                // Optionally, reset the form after submission
                form.reset();
            })
            .catch(error => {
                console.error("There was an error saving the reservation!", error);
                // Optional: Show an error message
            });
    });
});
