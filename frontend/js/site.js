const API_URL = 'https://hackathon-production-c8fa.up.railway.app'; // Railway backend URL

// ------------------------ User Registration ------------------------
async function registerUser(event) {
    event.preventDefault();

    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        user_type: document.getElementById('user_type').value,
    };

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error('Failed to register user.');
        }

        const result = await response.json();
        alert('Registration successful');
    } catch (error) {
        console.error('Error:', error.message);
        alert('Registration failed: ' + error.message);
    }
}

// ------------------------ User Login ------------------------
async function loginUser(event) {
    event.preventDefault();

    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');

    if (!emailInput || !passwordInput) {
        alert('Login form elements are not available.');
        return;
    }

    const email = emailInput.value;
    const password = passwordInput.value;

    if (email === '' || password === '') {
        alert("Please enter both email and password.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Invalid credentials.');
        }

        const data = await response.json();
        alert('Logged in successfully');
        localStorage.setItem('token', data.token);
        window.location.href = 'dashboard.html'; // Redirect after successful login
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to log in. Please check your credentials.');
    }
}

// ------------------------ Job Posting ------------------------
async function submitJobForm(event) {
    event.preventDefault();

    document.querySelector('.loader').style.display = 'block'; // Show loader
    const jobTitle = document.getElementById('jobTitle').value;
    const location = document.getElementById('location').value;
    const companyName = document.getElementById('companyName').value;
    const description = document.getElementById('description').value;

    if (!jobTitle || !location || !companyName || !description) {
        alert("Please fill in all fields.");
        document.querySelector('.loader').style.display = 'none'; // Hide loader
        return;
    }

    const jobListing = {
        job_title: jobTitle,
        company_name: companyName,
        location,
        job_description: description,
    };

    try {
        const response = await fetch(`${API_URL}/jobListings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jobListing),
        });

        if (!response.ok) {
            throw new Error('Failed to post the job.');
        }

        alert('Job listing submitted successfully.');
        document.getElementById('jobForm').reset(); // Reset form after submission
        fetchJobs(); // Refresh job listings
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to post the job. Please try again.');
    } finally {
        document.querySelector('.loader').style.display = 'none'; // Hide loader after submission
    }
}

// ------------------------ Fetch and Display Jobs ------------------------
async function fetchJobs() {
    try {
        const response = await fetch(`${API_URL}/jobListings`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text(); // Get more details on the error
            throw new Error(`Failed to fetch job listings: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const jobListings = await response.json();
        const jobListContainer = document.getElementById('jobListContainer');
        jobListContainer.innerHTML = ''; // Clear previous jobs

        if (jobListings.length === 0) {
            jobListContainer.innerHTML = '<p>No jobs available.</p>';
        } else {
            jobListings.forEach(job => {
                const jobElement = `
                    <div class="job-item">
                        <h3>${job.job_title}</h3>
                        <p><strong>Company:</strong> ${job.company_name}</p>
                        <p><strong>Location:</strong> ${job.location}</p>
                        <p><strong>Description:</strong> ${job.job_description || 'No description available.'}</p>
                        <button onclick="viewJobDetails('${job.id}')">View Details</button>
                    </div>
                `;
                jobListContainer.innerHTML += jobElement;
            });
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Failed to load job listings: ${error.message}`);
    }
}

// ------------------------ Event Listeners ------------------------
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    // Check for the registration form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', registerUser);
        console.log("Register form found and event listener added.");
    } else {
        console.warn("Register form not found in the DOM.");
    }

    // Check for the login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
        console.log("Login form found and event listener added.");
    } else {
        console.warn("Login form not found in the DOM.");
    }

    // Check for the job form
    const entrepreneurForm = document.getElementById('jobForm');
    if (entrepreneurForm) {
        entrepreneurForm.addEventListener('submit', submitJobForm);
        console.log("Job form found and event listener added.");
    } else {
        console.warn("Job form not found in the DOM.");
    }

    // Fetch jobs when the entrepreneur page loads
    const jobListContainer = document.getElementById('jobListContainer');
    if (jobListContainer) {
        fetchJobs();
    }
});
