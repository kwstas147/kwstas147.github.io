// GitHub Activity Widget
class GitHubActivity {
    constructor(username = 'kwstas147') {
        this.username = username;
        this.init();
    }

    init() {
        // Update graph theme based on current theme
        this.updateGraphTheme();
        
        // Listen for theme changes
        if (typeof themeManager !== 'undefined') {
            // Observe theme changes by checking data-theme attribute
            this.observeThemeChanges();
        }
        
        // Load GitHub stats
        this.loadGitHubStats();
    }

    updateGraphTheme() {
        const graphImg = document.getElementById('github-activity-graph');
        if (!graphImg) return;

        const currentTheme = document.documentElement.getAttribute('data-theme') || 'midnight';
        const theme = currentTheme === 'midnight' ? 'github-dark' : 'github';
        
        // Update graph URL with new theme and compact size
        const baseUrl = `https://github-readme-activity-graph.vercel.app/graph?username=${this.username}&theme=${theme}&area=true&hide_border=true&height=150`;
        graphImg.src = baseUrl;
    }

    observeThemeChanges() {
        // Create a MutationObserver to watch for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    this.updateGraphTheme();
                }
            });
        });

        // Observe the html element for data-theme changes
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }

    async loadGitHubStats() {
        try {
            // Fetch GitHub user data
            const response = await fetch(`https://api.github.com/users/${this.username}`);
            if (!response.ok) throw new Error('Failed to fetch GitHub data');
            
            const userData = await response.json();
            
            // Get total repos count (public + private if authenticated, otherwise just public)
            // Note: GitHub API only returns public_repos for unauthenticated requests
            // For total repos, we need to fetch all repos and count them
            let totalRepos = userData.public_repos || 0;
            
            // Try to fetch all repos to get total count
            try {
                const reposResponse = await fetch(`https://api.github.com/users/${this.username}/repos?per_page=100&sort=updated`);
                if (reposResponse.ok) {
                    const reposData = await reposResponse.json();
                    // Count all repos (this will be limited by API pagination, but gives a better estimate)
                    totalRepos = reposData.length;
                    // If we got 100 repos, there might be more (check if we need to fetch more pages)
                    if (reposData.length === 100) {
                        // Try to get the total from Link header or make another request
                        const linkHeader = reposResponse.headers.get('Link');
                        if (linkHeader) {
                            // Parse Link header to get total pages
                            const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
                            if (lastPageMatch) {
                                const lastPage = parseInt(lastPageMatch[1]);
                                // Fetch last page to get accurate count
                                const lastPageResponse = await fetch(`https://api.github.com/users/${this.username}/repos?per_page=100&page=${lastPage}&sort=updated`);
                                if (lastPageResponse.ok) {
                                    const lastPageData = await lastPageResponse.json();
                                    totalRepos = (lastPage - 1) * 100 + lastPageData.length;
                                }
                            }
                        }
                    }
                }
            } catch (reposError) {
                console.warn('Could not fetch all repos, using public count:', reposError);
                // Fallback to public repos count
            }
            
            // Update repos count
            const reposElement = document.getElementById('github-stats-repos');
            if (reposElement) {
                reposElement.textContent = totalRepos.toString();
                console.log('GitHub repos count updated:', totalRepos);
            } else {
                console.warn('GitHub repos element not found');
            }

            // Load contribution stats using GitHub Readme Stats
            await this.loadContributionStats();
            
        } catch (error) {
            console.warn('Could not load GitHub stats:', error);
            // Keep default values on error
            this.setDefaultStats();
        }
    }

    async loadContributionStats() {
        const commitsElement = document.getElementById('github-stats-commits');
        const streakElement = document.getElementById('github-stats-streak');
        
        try {
            // Use GitHub Readme Stats API for contribution stats
            // Note: This requires the user to have their stats public
            const theme = this.getThemeForAPI();
            
            // For commits, we can show a link to view the graph
            // The actual commit count would require parsing the contribution calendar
            if (commitsElement) {
                commitsElement.textContent = '📊';
                commitsElement.title = 'View contribution graph for details';
                commitsElement.style.cursor = 'help';
            }
            
            if (streakElement) {
                streakElement.textContent = '🔥';
                streakElement.title = 'View contribution graph for current streak';
                streakElement.style.cursor = 'help';
            }
            
        } catch (error) {
            console.warn('Could not load contribution stats:', error);
            this.setDefaultStats();
        }
    }

    setDefaultStats() {
        const commitsElement = document.getElementById('github-stats-commits');
        const streakElement = document.getElementById('github-stats-streak');
        const reposElement = document.getElementById('github-stats-repos');
        
        if (commitsElement) commitsElement.textContent = '-';
        if (streakElement) streakElement.textContent = '-';
        if (reposElement) reposElement.textContent = '-';
    }


    getThemeForAPI() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'midnight';
        return currentTheme === 'midnight' ? 'github_dark' : 'default';
    }
}

// Initialize GitHub Activity when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const githubActivity = new GitHubActivity('kwstas147');
    });
} else {
    const githubActivity = new GitHubActivity('kwstas147');
}

