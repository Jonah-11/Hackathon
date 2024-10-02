const API_URL = 'hackathon-production-c8fa.up.railway.app'; // Railway backend URL

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

// site.js

document.getElementById("jobForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent form submission

    // Collect form data
    const jobTitle = document.getElementById("jobTitle").value;
    const companyName = document.getElementById("companyName").value;
    const location = document.getElementById("location").value;
    const description = document.getElementById("description").value;

    // Create job object
    const jobData = {
        jobTitle: jobTitle,
        companyName: companyName,
        location: location,
        description: description
    };

    try {
        // Send the job data to the backend
        const response = await fetch('https://hackathon-production-c8fa.up.railway.app/jobListings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jobData)
        });

        if (response.ok) {
            // If the job is posted successfully
            alert("Job posted successfully!");
            document.getElementById("jobForm").reset(); // Reset the form
        } else {
            // If there was an error posting the job
            const errorData = await response.json();
            alert(`Error posting job: ${errorData.error}`);
        }
    } catch (error) {
        console.error("Error posting job:", error);
        alert("An error occurred while posting the job.");
    }
});


// ------------------------ Job Posting ------------------------
async function submitJobForm(event) {
    event.preventDefault();

    const job_title = document.getElementById('jobTitle').value; // updated variable name
    const location = document.getElementById('location').value;
    const company_name = document.getElementById('companyName').value; // updated variable name
    const job_description = document.getElementById('jobDescription').value; // updated variable name

    if (!job_title || !location || !company_name || !job_description) {
        alert("Please fill in all fields.");
        return;
    }

    const jobListing = {
        job_title,
        location,
        company_name,
        job_description,
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
        const response = await fetch('https://hackathon-production-c8fa.up.railway.app/jobListings', {
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
// Add event listeners for form submissions and job fetching
document.getElementById('registerForm')?.addEventListener('submit', registerUser);
document.getElementById('loginForm')?.addEventListener('submit', loginUser);
document.getElementById('entrepreneurForm')?.addEventListener('submit', submitJobForm);
document.addEventListener('DOMContentLoaded', fetchJobs); // Fetch jobs when the page loads
