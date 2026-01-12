// Build script to scan image folders and generate gallery JSON
// Run with: node build-gallery.js

const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const imagesBaseDir = path.join(baseDir, 'assets', 'images', '3d-printing');
const outputFile = path.join(baseDir, 'assets', 'data', 'gallery-images.json');
const configFile = path.join(baseDir, 'assets', 'data', 'gallery-config.json');

// Default config fallback
const defaultConfig = {
    projects: [
        { id: '3d-printed-parts', folder: '3d-printed parts', enabled: true, designProject: null },
        { id: 'replica', folder: 'replica', enabled: true, designProject: null },
        { id: 'nkua-project', folder: 'nkua-project', enabled: false, designProject: 'design.project6' },
        { id: 'ice-cream-machine', folder: 'ice-cream-machine', enabled: false, designProject: 'design.project7' },
        { id: '3d-printing', folder: '3d-printing', enabled: false, designProject: null }
    ]
};

// Ensure output directory exists
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Load gallery config from JSON (with fallback to defaults)
 * @returns {{projects: Array}}
 */
function loadConfig() {
    try {
        if (!fs.existsSync(configFile)) {
            console.warn(`⚠️  Config file not found, using defaults: ${configFile}`);
            return defaultConfig;
        }

        const raw = fs.readFileSync(configFile, 'utf8');
        const parsed = JSON.parse(raw);

        if (!parsed.projects || !Array.isArray(parsed.projects)) {
            console.warn('⚠️  Config projects missing or invalid, using defaults');
            return defaultConfig;
        }

        // Basic validation and cleanup
        const cleanedProjects = parsed.projects
            .filter(p => p && typeof p.id === 'string' && typeof p.folder === 'string')
            .map(p => ({
                id: p.id,
                folder: p.folder,
                enabled: Boolean(p.enabled),
                designProject: p.designProject || null
            }));

        if (cleanedProjects.length === 0) {
            console.warn('⚠️  No valid projects in config, using defaults');
            return defaultConfig;
        }

        return { projects: cleanedProjects };
    } catch (error) {
        console.error('❌ Error reading config, using defaults:', error);
        return defaultConfig;
    }
}

/**
 * Scan a folder for images and extract unique timestamps
 * @param {string} folderPath - Path to the folder to scan
 * @returns {string[]} Array of unique image timestamps (without size suffix)
 */
function scanImageFolder(folderPath) {
    if (!fs.existsSync(folderPath)) {
        console.log(`Folder does not exist: ${folderPath}`);
        return [];
    }

    const files = fs.readdirSync(folderPath);
    const imageTimestamps = new Set();

    // Look for images with pattern: timestamp-{400w|800w|1200w}.jpg
    files.forEach(file => {
        if (file.endsWith('.jpg')) {
            // Match pattern: timestamp-{size}w.jpg
            const match = file.match(/^(.+?)-(400w|800w|1200w)\.jpg$/);
            if (match) {
                imageTimestamps.add(match[1]);
            }
        }
    });

    // Convert to sorted array
    return Array.from(imageTimestamps).sort();
}

/**
 * Verify that all three sizes exist for each timestamp
 * @param {string} folderPath - Path to the folder
 * @param {string[]} timestamps - Array of timestamps
 * @returns {string[]} Array of timestamps that have all three sizes
 */
function verifyImageSizes(folderPath, timestamps) {
    const validTimestamps = [];

    timestamps.forEach(timestamp => {
        const has400w = fs.existsSync(path.join(folderPath, `${timestamp}-400w.jpg`));
        const has800w = fs.existsSync(path.join(folderPath, `${timestamp}-800w.jpg`));
        const has1200w = fs.existsSync(path.join(folderPath, `${timestamp}-1200w.jpg`));

        if (has400w && has800w && has1200w) {
            validTimestamps.push(timestamp);
        } else {
            console.warn(`⚠️  Incomplete image set for ${timestamp}: 400w=${has400w}, 800w=${has800w}, 1200w=${has1200w}`);
        }
    });

    return validTimestamps;
}

// Load projects from config (or defaults)
const config = loadConfig();

// Scan all projects
const projectsData = {};

config.projects.forEach(project => {
    if (!project.enabled) {
        console.log(`⏭️  Skipping disabled project: ${project.id}`);
        return;
    }

    const folderPath = path.join(imagesBaseDir, project.folder);
    console.log(`📁 Scanning project: ${project.id} (folder: ${project.folder})...`);
    
    const timestamps = scanImageFolder(folderPath);
    const validTimestamps = verifyImageSizes(folderPath, timestamps);
    
    projectsData[project.id] = {
        folder: project.folder,
        images: validTimestamps,
        designProject: project.designProject || null,
        imageCount: validTimestamps.length
    };
    
    console.log(`   ✓ Found ${validTimestamps.length} complete image sets`);
});

// Write JSON file with projects structure
const jsonData = {
    generated: new Date().toISOString(),
    projects: projectsData,
    // Legacy support: also include galleries for backward compatibility
    galleries: {
        '3d-printed parts': projectsData['3d-printed-parts']?.images || [],
        'replica': projectsData['replica']?.images || [],
        '3d-printing': projectsData['3d-printing']?.images || []
    }
};

fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 2), 'utf8');

console.log(`\n✅ Gallery JSON generated successfully!`);
console.log(`   Output: ${outputFile}`);
console.log(`   Total projects: ${Object.keys(projectsData).length}`);
console.log(`   Total images: ${Object.values(projectsData).reduce((sum, p) => sum + (p.imageCount || 0), 0)}`);

// Show project mapping
console.log(`\n📋 Project Mapping:`);
Object.keys(projectsData).forEach(projectId => {
    const project = projectsData[projectId];
    const designInfo = project.designProject ? ` → ${project.designProject}` : '';
    console.log(`   ${projectId}: ${project.imageCount} images${designInfo}`);
});
