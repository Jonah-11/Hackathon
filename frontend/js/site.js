document.addEventListener('DOMContentLoaded', function () {
    // Post a new job listing
    async function postJob(event) {
        event.preventDefault();

        // Get values from the job form
        const jobTitle = document.getElementById('jobTitle').value;
        const companyName = document.getElementById('companyName').value;
        const location = document.getElementById('location').value;
        const jobDescription = document.getElementById('description').value;
        const contactEmail = document.getElementById('contactEmail').value;
        const contactPhone = document.getElementById('contactPhone').value;
        const deadline = document.getElementById('deadline').value; // Get the deadline value
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
                    contact_email: contactEmail,
                    contact_phone: contactPhone,
                    deadline: deadline, // Include the deadline in the request body
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                document.getElementById('jobForm').reset(); // Reset the form
            } else {
                alert(data.error || 'Failed to create job listing.');
            }
        } catch (error) {
            console.error('Error posting job:', error);
            alert('An error occurred while posting the job.');
        }
    }

    // Fetch job listings
    async function fetchJobListings() {
        const jobList = document.getElementById('jobList');

        // Ensure jobList exists
        if (!jobList) {
            console.warn('Job list container not found. Skipping fetchJobListings.');
            return; // Stop the function if the container is missing
        }

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

            jobs.forEach(job => {
                const jobElement = document.createElement('div');
                jobElement.className = 'job-listing';
                jobElement.innerHTML = `
                    <h3>${job.job_title}</h3>
                    <p><strong>Company:</strong> ${job.company_name}</p>
                    <p><strong>Location:</strong> ${job.location}</p>
                    <p><strong>Description:</strong> ${job.job_description}</p>
                    <button class="apply-btn" data-job-id="${job.id}">Apply</button>
                `;
                jobList.appendChild(jobElement);
            });

            // Add event listener for Apply buttons
            addApplyButtonListeners();
        } catch (error) {
            console.error('Error fetching job listings:', error);
            alert('An error occurred while fetching job listings.');
        }
    }

    // Add event listeners to the apply buttons
    function addApplyButtonListeners() {
        const applyButtons = document.querySelectorAll('.apply-btn');
        applyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const jobId = this.getAttribute('data-job-id');
                window.location.href = `jobDetails.html?id=${jobId}`; // Redirect to job details page with job ID
            });
        });
    }

    // Fetch job details based on job ID
    async function fetchJobDetails() {
        const params = new URLSearchParams(window.location.search);
        const jobId = params.get('id');

        if (!jobId) {
            document.getElementById('jobDetailsContainer').innerHTML = '<p>No job ID provided.</p>';
            return;
        }

        try {
            const response = await fetch(`https://hackathon-production-c8fa.up.railway.app/jobListings/${jobId}`);
            if (response.ok) {
                const job = await response.json();
                document.getElementById('jobDetailsContainer').innerHTML = `
                    <h2>${job.job_title}</h2>
                    <p><strong>Company:</strong> ${job.company_name}</p>
                    <p><strong>Location:</strong> ${job.location}</p>
                    <p><strong>Deadline:</strong> ${job.deadline || 'No deadline specified'}</p>
                    <p><strong>Description:</strong> ${job.job_description || 'No description available.'}</p>
                `;
            } else {
                document.getElementById('jobDetailsContainer').innerHTML = '<p>No job details available.</p>';
            }
        } catch (error) {
            console.error('Error fetching job details:', error);
            document.getElementById('jobDetailsContainer').innerHTML = '<p>An error occurred while fetching job details.</p>';
        }
    }

    // Attach event listeners for forms and fetch job listings
    const jobForm = document.getElementById('jobForm');
    if (jobForm) {
        jobForm.addEventListener('submit', postJob);
    }

    // Fetch job listings on page load, but only if on the jobseeker page
    if (document.getElementById('jobList')) {
        fetchJobListings();
    }

    // Fetch job details on job details page
    if (document.getElementById('jobDetailsContainer')) {
        fetchJobDetails();
    }
});

// Set minimum date for deadline input
const deadlineInput = document.getElementById('deadline');
if (deadlineInput) {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in yyyy-mm-dd format
    deadlineInput.setAttribute('min', today); // Set the minimum date to today
}
