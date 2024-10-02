const API_URL = 'https://hackathon-production-c8fa.up.railway.app'; // Railway backend URL

// ------------------------ User Registration ------------------------
async function registerUser(event) {
    event.preventDefault();

    const userType = document.getElementById('user-type').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (userType === '' || name === '' || email === '' || password === '') {
        alert("Please fill in all fields.");
        return;
    }

    const user = { user_type: userType, name, email, password };

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            throw new Error('Failed to register user.');
        }

        alert('User registered successfully!');
        document.getElementById('register-form').reset(); // Reset the form after successful registration
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error registering the user. Please try again.');
    }
}

// ------------------------ User Login ------------------------
async function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

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
        localStorage.setItem('token', data.token); // Store token for authenticated requests
        window.location.href = 'dashboard.html'; // Redirect to dashboard after successful login
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to log in. Please check your credentials.');
    }
}

// ------------------------ Job Posting ------------------------
async function submitJobForm(event) {
    event.preventDefault();

    const jobTitle = document.getElementById('jobTitle').value;
    const location = document.getElementById('location').value;
    const companyName = document.getElementById('companyName').value;
    const description = document.getElementById('description').value;

    if (!jobTitle || !location || !companyName || !description) {
        alert("Please fill in all fields.");
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
        document.getElementById('entrepreneurForm').reset();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to post the job. Please try again.');
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
            throw new Error('Failed to fetch job listings.');
        }

        const jobListings = await response.json();
        const jobListContainer = document.getElementById('jobListContainer');

        // Clear existing jobs
        jobListContainer.innerHTML = ''; 

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
        alert('Failed to load job listings.');
    }
}

// ------------------------ Event Listeners ------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for form submissions
    const registerForm = document.getElementById('register-form'); // Updated ID to match HTML
    const loginForm = document.getElementById('loginForm');
    const entrepreneurForm = document.getElementById('entrepreneurForm');

    if (registerForm) {
        registerForm.addEventListener('submit', registerUser);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    }

    if (entrepreneurForm) {
        entrepreneurForm.addEventListener('submit', submitJobForm);
    }

    // Fetch jobs when the page loads
    fetchJobs();
});
