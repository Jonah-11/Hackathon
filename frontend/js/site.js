const API_URL = 'https://hackathon-production-c8fa.up.railway.app'; // Railway backend URL

// ------------------------ User Registration ------------------------
async function registerUser(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (name === '' || email === '' || password === '') {
        alert("Please fill in all fields.");
        return;
    }

    const user = { name, email, password };

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
        document.getElementById('registerForm').reset();
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
async function submitEntrepreneurForm(event) {
    event.preventDefault();

    const jobCategory = document.getElementById('jobCategory').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const location = document.getElementById('location').value;
    const position = document.getElementById('position').value;
    const salary = document.getElementById('salary').value;
    const experience = document.getElementById('experience').value;

    if (!name || !email || !position || !salary || !location) {
        alert("Please fill in all fields.");
        return;
    }

    const jobListing = {
        jobCategory,
        name,
        email,
        location,
        position,
        salary,
        experience,
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

        if (jobListings.length === 0) {
            jobListContainer.innerHTML = '<p>No jobs available.</p>';
        } else {
            jobListContainer.innerHTML = ''; // Clear existing jobs
            jobListings.forEach(job => {
                const jobElement = `
                    <div class="job-item">
                        <h3>${job.position} (${job.salary})</h3>
                        <p><strong>Location:</strong> ${job.location}</p>
                        <p><strong>Experience Required:</strong> ${job.experience}</p>
                        <p><strong>Description:</strong> ${job.description || 'No description available.'}</p>
                        <button onclick="viewJobDetails('${job.email}')">View Details</button>
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
// Add event listeners for form submissions and job fetching
document.getElementById('registerForm')?.addEventListener('submit', registerUser);
document.getElementById('loginForm')?.addEventListener('submit', loginUser);
document.getElementById('entrepreneurForm')?.addEventListener('submit', submitEntrepreneurForm);
document.addEventListener('DOMContentLoaded', fetchJobs); // Fetch jobs when the page loads
