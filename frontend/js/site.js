// Constants for API URLs
const API_BASE_URL = 'http://localhost:3000'; // Update with your backend URL if different

// Function to register a new user
async function registerUser() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const user_type = document.getElementById('user_type').value;

    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, user_type }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            // Redirect or clear form after successful registration
            // window.location.href = '/login.html'; // Example redirect
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred during registration.');
    }
}

// Function to log in a user
async function loginUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            localStorage.setItem('token', data.token); // Store the token for future requests
            // Redirect to dashboard or another page
            // window.location.href = '/dashboard.html'; // Example redirect
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login.');
    }
}

// Function to post a new job listing
async function postJob() {
    const job_title = document.getElementById('job_title').value;
    const company_name = document.getElementById('company_name').value;
    const location = document.getElementById('location').value;
    const job_description = document.getElementById('job_description').value;
    const token = localStorage.getItem('token'); // Retrieve the JWT token

    try {
        const response = await fetch(`${API_BASE_URL}/jobListings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Attach token for authentication
            },
            body: JSON.stringify({ job_title, company_name, location, job_description }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            // Clear form fields or redirect
        } else {
            alert(data.error || 'Failed to create job listing.');
        }
    } catch (error) {
        console.error('Error during job posting:', error);
        alert('An error occurred while posting the job.');
    }
}

// Function to fetch job listings (optional)
async function fetchJobListings() {
    try {
        const response = await fetch(`${API_BASE_URL}/jobListings`);
        const listings = await response.json();

        if (response.ok) {
            console.log(listings); // Process and display job listings as needed
        } else {
            alert('Failed to fetch job listings.');
        }
    } catch (error) {
        console.error('Error fetching job listings:', error);
        alert('An error occurred while fetching job listings.');
    }
}

// Example event listeners (assuming you have buttons with these IDs)
document.getElementById('registerBtn').addEventListener('click', registerUser);
document.getElementById('loginBtn').addEventListener('click', loginUser);
document.getElementById('postJobBtn').addEventListener('click', postJob);
document.getElementById('fetchJobsBtn').addEventListener('click', fetchJobListings);
