document.addEventListener('DOMContentLoaded', function() {
    // Dynamic navigation highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('#navbar a');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
    // Project filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                // Show all projects if 'all' is selected
                if (filterValue === 'all') {
                    card.style.display = 'block';
                    return;
                }
                
                // Check if card has the selected category
                const categories = card.getAttribute('data-category').split(' ');
                if (categories.includes(filterValue)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Fetch GitHub repositories
    fetchGitHubRepos();
    
    // Check if profile image loaded correctly, use fallback if not
    const profileImg = document.getElementById('profile-img');
    profileImg.onerror = function() {
        this.src = 'images/profile-placeholder.png';
    };
    
    // Check which GitHub project links are valid
    checkGitHubLinks();
});

async function checkGitHubLinks() {
    const githubLinks = document.querySelectorAll('[id$="-link"]');
    
    githubLinks.forEach(async link => {
        try {
            const repoUrl = link.getAttribute('href');
            const response = await fetch(repoUrl, { method: 'HEAD' });
            
            if (!response.ok) {
                // If repository doesn't exist, change link to generic GitHub profile
                link.setAttribute('href', 'https://github.com/maheshmohan2804');
                link.innerHTML = '<i class="fab fa-github"></i> View My GitHub';
            }
        } catch (error) {
            // In case of error, fallback to generic GitHub profile
            link.setAttribute('href', 'https://github.com/maheshmohan2804');
            link.innerHTML = '<i class="fab fa-github"></i> View My GitHub';
        }
    });
}

async function fetchGitHubRepos() {
    const username = 'maheshmohan2804';
    const reposContainer = document.getElementById('repos-container');
    
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }
        
        const repos = await response.json();
        
        // Clear loading message
        reposContainer.innerHTML = '';
        
        if (repos.length === 0) {
            reposContainer.innerHTML = '<p class="no-repos">No repositories found.</p>';
            return;
        }
        
        // Display repositories
        repos.forEach(repo => {
            const repoCard = document.createElement('div');
            repoCard.className = 'project-card';
            
            // Format date
            const updatedDate = new Date(repo.updated_at);
            const formattedDate = updatedDate.toLocaleDateString('en-US', {
                year: 'numeric', 
                month: 'short', 
                day: 'numeric'
            });
            
            repoCard.innerHTML = `
                <div class="project-content">
                    <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
                    <p>${repo.description || 'No description available'}</p>
                    <div class="repo-stats">
                        <div><i class="fas fa-star"></i> ${repo.stargazers_count}</div>
                        <div><i class="fas fa-code-branch"></i> ${repo.forks_count}</div>
                        <div><i class="fas fa-history"></i> Updated on ${formattedDate}</div>
                    </div>
                    ${repo.language ? `
                    <div class="project-tags">
                        <span>${repo.language}</span>
                    </div>
                    ` : ''}
                </div>
            `;
            
            reposContainer.appendChild(repoCard);
        });
        
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        reposContainer.innerHTML = `
            <div class="error-message">
                <p>Failed to load GitHub repositories. Please try again later.</p>
                <p>Visit <a href="https://github.com/${username}" target="_blank">github.com/${username}</a> to see all repositories.</p>
            </div>
        `;
    }
}