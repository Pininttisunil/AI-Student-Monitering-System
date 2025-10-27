// Back button functionality
function goBack() {
  window.location.href = "index.html"; // Redirects to the main menu
}

// Example login button action
document.querySelector(".login-btn").addEventListener("click", () => {
  
});
function goBack() {
  window.location.href = "index.html"; // redirect back
}

document.querySelector(".login-btn").addEventListener("click", async () => {
  const hallTicket = document.querySelectorAll(".input-field")[0].value;
  const password = document.querySelectorAll(".input-field")[1].value;

  if (!hallTicket || !password) {
    alert("Please enter Hall Ticket and Password");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/student-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hall_ticket: hallTicket, password })
    });

    const result = await response.json();
    if (response.ok && result.success) {
      alert(result.message);
      // ✅ Redirect after successful login
      window.location.href = "student-dashboard.html"; 
    } else {
      alert(result.message);
    }
  } catch (error) {
    alert("Error connecting to server");
    console.error(error);
  }
});
