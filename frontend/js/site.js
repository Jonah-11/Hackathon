document.addEventListener('DOMContentLoaded', function () {

    // Post a job form handler
    async function postJob(event) {
        event.preventDefault();

        // Get values from the job form
        const jobTitle = document.getElementById('jobTitle').value;
        const companyName = document.getElementById('companyName').value;
        const location = document.getElementById('location').value;
        const jobDescription = document.getElementById('description').value;
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('https://hackathon-production-c8fa.up.railway.app/jobListings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    job_title: jobTitle,
                    company_name: companyName,
                    location: location,
                    job_description: jobDescription,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                document.getElementById('jobTitle').value = '';
                document.getElementById('companyName').value = '';
                document.getElementById('location').value = '';
                document.getElementById('description').value = '';
            } else {
                alert(data.error || 'Failed to create job listing.');
            }
        } catch (error) {
            console.error('Error posting job:', error);
            alert('An error occurred while posting the job.');
        }
    }

    // Register form handler
    async function registerUser(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('https://hackathon-production-c8fa.up.railway.app/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                window.location.href = 'login.html'; // Redirect to login page on success
            } else {
                alert(data.error || 'Registration failed.');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred while registering.');
        }
    }

    // Login form handler
    async function loginUser(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('https://hackathon-production-c8fa.up.railway.app/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                alert('Login successful!');
                window.location.href = 'entrepreneur.html'; // Redirect to entrepreneur page
            } else {
                alert(data.error || 'Login failed.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred while logging in.');
        }
    }

    // Fetch job listings automatically when the page loads
    async function fetchJobListings() {
        const jobList = document.getElementById('jobList'); // Correct ID reference for job list

        try {
            const response = await fetch('https://hackathon-production-c8fa.up.railway.app/jobListings', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const jobs = await response.json();

            // Clear existing job list before appending new entries
            jobList.innerHTML = '';

            // Loop through and display each job
            jobs.forEach(job => {
                const jobElement = document.createElement('div');
                jobElement.className = 'job-listing';
                jobElement.innerHTML = `
                    <h3>${job.job_title}</h3>
                    <p><strong>Company:</strong> ${job.company_name}</p>
                    <p><strong>Location:</strong> ${job.location}</p>
                    <p><strong>Description:</strong> ${job.job_description}</p>
                `;
                jobList.appendChild(jobElement);
            });
        } catch (error) {
            console.error('Error fetching job listings:', error);
            alert('An error occurred while fetching job listings.');
        }
    }

    // Logout functionality
    function logoutUser() {
        localStorage.removeItem('token');
        alert('You have been logged out.');
        window.location.href = 'login.html'; // Redirect to login page
    }

    // Attach event listeners for forms and logout button
    const jobForm = document.getElementById('jobForm');
    if (jobForm) {
        jobForm.addEventListener('submit', postJob);
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', registerUser);
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }

    // Automatically fetch job listings on page load
    fetchJobListings();
});
