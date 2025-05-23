document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');

    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent actual page reload

            // Get form values
            const emailInput = document.getElementById('email');
            const fullNameInput = document.getElementById('fullName');
            const passwordInput = document.getElementById('password');

            const email = emailInput.value.trim();
            const fullName = fullNameInput.value.trim();
            const password = passwordInput.value; // Don't trim password, spaces might be intentional

            // --- Basic Client-Side Validation ---
            let isValid = true;

            // Clear previous error messages (if you were to add them)
            // Example: clearErrorMessages();

            if (!email) {
                alert('Email Address is required.');
                emailInput.focus();
                isValid = false;
            } else if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                emailInput.focus();
                isValid = false;
            }

            if (isValid && !fullName) {
                alert('Full Name is required.');
                fullNameInput.focus();
                isValid = false;
            }

            if (isValid && !password) {
                alert('Password is required.');
                passwordInput.focus();
                isValid = false;
            } else if (isValid && password.length < 6) {
                alert('Password must be at least 6 characters long.');
                passwordInput.focus();
                isValid = false;
            }

            if (!isValid) {
                return; // Stop submission if validation fails
            }

            // If validation passes
            console.log('Form Submitted (Client-Side):');
            console.log('Email:', email);
            console.log('Full Name:', fullName);
            // In a real application, NEVER log passwords to the console.
            // console.log('Password:', password); 

            alert('Account creation request sent! (This is a demo)');

            // In a real application, you would send this data to a server:
            // fetch('/api/signup', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email, fullName, password })
            // })
            // .then(response => {
            //     if (!response.ok) {
            //         return response.json().then(err => { throw err; });
            //     }
            //     return response.json();
            // })
            // .then(data => {
            //     console.log('Signup Success:', data);
            //     alert('Account created successfully! Please login.');
            //     signupForm.reset(); // Clear the form
            //     // window.location.href = '/login'; // Redirect to login page
            // })
            // .catch(error => {
            //     console.error('Signup Error:', error);
            //     alert(`Signup failed: ${error.message || 'Please try again.'}`);
            // });

            signupForm.reset(); // Clear the form for this demo
        });
    }

    function isValidEmail(email) {
        // A common regex for basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});