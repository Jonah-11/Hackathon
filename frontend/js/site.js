// site.js

// Entrepreneur Form Submission
function submitEntrepreneurForm(event) {
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
  
    // Save entrepreneur's job listing
    const jobListing = {
      jobCategory,
      name,
      email,
      location,
      position,
      salary,
      experience
    };
  
    // Store job listing in local storage (you can change this to send to a backend later)
    let jobListings = JSON.parse(localStorage.getItem('jobListings')) || [];
    jobListings.push(jobListing);
    localStorage.setItem('jobListings', JSON.stringify(jobListings));
  
    alert('Job listing successfully submitted!');
    document.getElementById('entrepreneurForm').reset();
  }
  
  // Job Seeker: Display Jobs Based on Category
  function filterJobsByCategory() {
    const selectedCategory = document.getElementById('jobCategorySeeker').value;
    const jobListings = JSON.parse(localStorage.getItem('jobListings')) || [];
  
    const filteredJobs = jobListings.filter(job => job.jobCategory === selectedCategory);
  
    const jobListContainer = document.getElementById('jobList');
    jobListContainer.innerHTML = ''; // Clear previous listings
  
    if (filteredJobs.length === 0) {
      jobListContainer.innerHTML = '<p>No jobs available for this category.</p>';
    } else {
      filteredJobs.forEach(job => {
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
  }
  
  // View Job Details
  function viewJobDetails(email) {
    const jobListings = JSON.parse(localStorage.getItem('jobListings')) || [];
    const job = jobListings.find(job => job.email === email);
  
    if (job) {
      alert(`
        Position: ${job.position}
        Salary: ${job.salary}
        Location: ${job.location}
        Experience Required: ${job.experience}
        Contact: ${job.email}
      `);
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
  function displayStatus() {
    const jobListings = JSON.parse(localStorage.getItem('jobListings')) || [];
    const statusTable = document.getElementById('statusTable');
  
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
  