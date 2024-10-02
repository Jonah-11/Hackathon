const API_URL = 'hackathon-production-c8fa.up.railway.app'; // Replace with your actual backend API URL

// Entrepreneur Form Submission
async function submitEntrepreneurForm(event) {
    event.preventDefault(); // Prevent form from submitting

    const jobCategory = document.getElementById('jobCategory').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const location = document.getElementById('location').value;
    const position = document.getElementById('position').value;
    const salary = document.getElementById('salary').value;
    const experience = document.getElementById('experience').value;

    // Simple validation
    if (name === '' || email === '' || location === '' || position === '' || salary === '') {
        alert("Please fill in all fields.");
        return;
    }

    // Prepare job listing object
    const jobListing = {
        jobCategory,
        name,
        email,
        location,
        position,
        salary,
        experience
    };

    try {
        // Send job listing to the backend
        const response = await fetch(`${API_URL}/jobListings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jobListing)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        alert('Job listing successfully submitted!');
        document.getElementById('entrepreneurForm').reset();
    } catch (error) {
        console.error('Error:', error);
        alert('There was a problem submitting your job listing. Please try again later.');
    }
}

// Job Seeker: Display Jobs Based on Category
async function filterJobsByCategory() {
    const selectedCategory = document.getElementById('jobCategorySeeker').value;

    try {
        // Fetch job listings from the backend
        const response = await fetch(`${API_URL}/jobListings?category=${selectedCategory}`);
        const jobListings = await response.json();

        const jobListContainer = document.getElementById('jobList');
        jobListContainer.innerHTML = ''; // Clear previous listings

        if (jobListings.length === 0) {
            jobListContainer.innerHTML = '<p>No jobs available for this category.</p>';
        } else {
            jobListings.forEach(job => {
                const jobElement = `
                    <div class="job-item">
                        <h3>${job.position} (${job.salary})</h3>
                        <p>Location: ${job.location}</p>
                        <p>Experience Required: ${job.experience}</p>
                        <button onclick="viewJobDetails('${job.email}')">View Details</button>
                    </div>
                `;
                jobListContainer.innerHTML += jobElement;
            });
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was a problem fetching job listings. Please try again later.');
    }
}

// View Job Details
async function viewJobDetails(email) {
    try {
        // Fetch job details from the backend
        const response = await fetch(`${API_URL}/jobListings/${email}`);
        const job = await response.json();

        if (job) {
            alert(`
                Position: ${job.position}
                Salary: ${job.salary}
                Location: ${job.location}
                Experience Required: ${job.experience}
                Contact: ${job.email}
            `);
        } else {
            alert('Job not found.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was a problem fetching job details. Please try again later.');
    }
}

// Simple Login Functionality (for Entrepreneurs and Job Seekers)
function loginUser(event) {
    event.preventDefault();

    const userType = document.querySelector('input[name="userType"]:checked').value;
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Simple validation
    if (email === '' || password === '') {
        alert("Please enter both email and password.");
        return;
    }

    alert(`Logged in as ${userType}`);
    window.location.href = `${userType}.html`; // Redirect based on user type
}

// Display Status (Accepted/Declined)
async function displayStatus() {
    const statusTable = document.getElementById('statusTable');

    try {
        // Fetch job listings from the backend
        const response = await fetch(`${API_URL}/jobListings/status`);
        const jobListings = await response.json();

        jobListings.forEach((job, index) => {
            const status = Math.random() > 0.5 ? 'Accepted' : 'Declined'; // Random status for demo purposes
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${job.position}</td>
                    <td>${job.email}</td>
                    <td class="${status.toLowerCase()}">${status}</td>
                </tr>
            `;
            statusTable.innerHTML += row;
        });
    } catch (error) {
        console.error('Error:', error);
        alert('There was a problem fetching job status. Please try again later.');
    }
}

// Attach event listeners on document load
document.addEventListener('DOMContentLoaded', function () {
    const entrepreneurForm = document.getElementById('entrepreneurForm');
    if (entrepreneurForm) {
        entrepreneurForm.addEventListener('submit', submitEntrepreneurForm);
    }

    const jobSeekerForm = document.getElementById('jobSeekerForm');
    if (jobSeekerForm) {
        jobSeekerForm.addEventListener('submit', function (event) {
            event.preventDefault();
            filterJobsByCategory();
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    }

    const statusPage = document.getElementById('statusPage');
    if (statusPage) {
        displayStatus();
    }
});
