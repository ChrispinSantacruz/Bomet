/**
 * Path Resolution Utility
 * Automatically detects the environment and resolves paths correctly
 * Works with Live Server from pages/ directory or from project root
 */

class PathResolver {
    constructor() {
        this.isLiveServerFromPages = this.detectLiveServerFromPages();
        console.log('PathResolver: Live Server from pages detected:', this.isLiveServerFromPages);
    }

    detectLiveServerFromPages() {
        // Live Server from pages/ directory won't have /pages/ in pathname
        // and will be running on port 5500
        return window.location.port === '5500' && 
               !window.location.pathname.includes('/pages/') &&
               window.location.pathname.endsWith('.html');
    }

    // Resolve asset paths (images, css, sounds)
    getAssetPath(path) {
        if (this.isLiveServerFromPages) {
            // Remove leading slash and add ../
            return '../' + path.replace(/^\//, '');
        }
        return path; // Use absolute path for production/root serving
    }

    // Resolve page navigation paths
    getPagePath(pageName) {
        if (this.isLiveServerFromPages) {
            // Just use the filename directly
            return pageName.replace('/pages/', '').replace(/^\//, '');
        }
        // Use absolute path for production
        return pageName.startsWith('/pages/') ? pageName : '/pages/' + pageName;
    }

    // Resolve script paths (js files)
    getScriptPath(path) {
        if (this.isLiveServerFromPages) {
            return '../' + path.replace(/^\//, '');
        }
        return path;
    }
}

// Create global instance
window.pathResolver = new PathResolver();

// Helper functions for easy access
window.resolvePath = (path) => window.pathResolver.getAssetPath(path);
window.resolvePagePath = (page) => window.pathResolver.getPagePath(page);
window.resolveScriptPath = (script) => window.pathResolver.getScriptPath(script);
