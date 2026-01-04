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
        
        // Update graph URL with new theme
        const baseUrl = `https://github-readme-activity-graph.vercel.app/graph?username=${this.username}&theme=${theme}&area=true&hide_border=true`;
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
            
            // Update public repos count
            const reposElement = document.getElementById('github-stats-repos');
            if (reposElement) {
                reposElement.textContent = userData.public_repos || '0';
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

