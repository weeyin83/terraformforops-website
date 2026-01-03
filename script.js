// Configuration
const RSS_FEED_URL = 'https://www.techielass.com/tag/terraform/feed/';
const TERRAFORM_KEYWORDS = ['terraform', 'tf', 'infrastructure as code', 'iac', 'terraform cloud', 'terraform enterprise', 'terragrunt', 'hcl'];

// Elements
const blogGrid = document.getElementById('blog-grid');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const noPosts = document.getElementById('no-posts');

/**
 * Check if a post is related to Terraform
 */
function isTerraformRelated(post) {
    const title = post.title.toLowerCase();
    const description = post.description.toLowerCase();
    const content = post.content ? post.content.toLowerCase() : '';
    const categories = post.categories ? post.categories.join(' ').toLowerCase() : '';
    
    const searchText = `${title} ${description} ${content} ${categories}`;
    
    return TERRAFORM_KEYWORDS.some(keyword => searchText.includes(keyword));
}

/**
 * Strip HTML tags and decode HTML entities
 */
function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

/**
 * Truncate text to a specific length
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + '...';
}

/**
 * Format date to readable string
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

/**
 * Extract image from post
 */
function extractImage(post) {
    // Try thumbnail first
    if (post.thumbnail && post.thumbnail !== '') {
        return post.thumbnail;
    }
    
    // Try to extract from content
    if (post.content) {
        const imgRegex = /<img[^>]+src="([^">]+)"/i;
        const match = imgRegex.exec(post.content);
        if (match && match[1]) {
            return match[1];
        }
    }
    
    // Return placeholder if no image found
    return null;
}

/**
 * Create a blog card element
 */
function createBlogCard(post) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    
    const image = extractImage(post);
    const imageHtml = image 
        ? `<img src="${image}" alt="${post.title}" class="blog-card-image" onerror="this.style.display='none'">` 
        : '<div class="blog-card-image"></div>';
    
    const description = stripHtml(post.description || post.content || '');
    const truncatedDescription = truncateText(description, 150);
    
    const date = post.pubDate ? formatDate(post.pubDate) : '';
    
    card.innerHTML = `
        ${imageHtml}
        <div class="blog-card-content">
            <h2 class="blog-card-title">
                <a href="${post.link}" target="_blank" rel="noopener noreferrer">${post.title}</a>
            </h2>
            <p class="blog-card-description">${truncatedDescription}</p>
            <div class="blog-card-meta">
                <span class="blog-card-date">${date}</span>
                <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="blog-card-link">Read More →</a>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Parse RSS feed from XML
 */
async function parseRSSFeed(xmlText) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
        throw new Error('Failed to parse RSS feed');
    }
    
    const items = xmlDoc.querySelectorAll('item');
    const posts = [];
    
    items.forEach(item => {
        const title = item.querySelector('title')?.textContent || '';
        const link = item.querySelector('link')?.textContent || '';
        const description = item.querySelector('description')?.textContent || '';
        const content = item.querySelector('content\\:encoded, encoded')?.textContent || description;
        const pubDate = item.querySelector('pubDate')?.textContent || '';
        
        // Try to get thumbnail from media:content or enclosure
        let thumbnail = null;
        const mediaContent = item.querySelector('media\\:content, content');
        if (mediaContent) {
            thumbnail = mediaContent.getAttribute('url');
        }
        if (!thumbnail) {
            const enclosure = item.querySelector('enclosure[type^="image"]');
            if (enclosure) {
                thumbnail = enclosure.getAttribute('url');
            }
        }
        
        // Get categories
        const categories = Array.from(item.querySelectorAll('category')).map(cat => cat.textContent);
        
        posts.push({
            title,
            link,
            description,
            content,
            pubDate,
            thumbnail,
            categories
        });
    });
    
    return posts;
}

/**
 * Fetch and display blog posts
 */
async function fetchBlogPosts() {
    try {
        console.log('Fetching RSS feed from:', RSS_FEED_URL);
        
        // Try all CORS proxies simultaneously and use whichever responds first
        const corsProxies = [
            `https://api.allorigins.win/raw?url=${encodeURIComponent(RSS_FEED_URL)}`,
            `https://corsproxy.io/?${encodeURIComponent(RSS_FEED_URL)}`,
            RSS_FEED_URL // Direct attempt as fallback
        ];
        
        // Create fetch promises with timeout
        const fetchWithTimeout = (url, timeout = 8000) => {
            return Promise.race([
                fetch(url).then(response => {
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    return response.text();
                }),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout')), timeout)
                )
            ]);
        };
        
        // Try all proxies at once, use first successful response
        const xmlText = await Promise.any(
            corsProxies.map(url => fetchWithTimeout(url))
        ).catch(err => {
            console.error('All fetch attempts failed:', err);
            throw new Error('Unable to fetch RSS feed from any source');
        });
        
        console.log('Successfully fetched RSS feed');
        
        // Parse the RSS feed
        const posts = await parseRSSFeed(xmlText);
        console.log('Parsed', posts.length, 'total posts');
        
        // Filter for Terraform-related posts (as backup check)
        const terraformPosts = posts.filter(isTerraformRelated);
        console.log('Found', terraformPosts.length, 'Terraform-related posts');
        
        // Hide loading
        loading.style.display = 'none';
        
        if (terraformPosts.length === 0) {
            noPosts.style.display = 'block';
            return;
        }
        
        // Display posts
        terraformPosts.forEach(post => {
            const card = createBlogCard(post);
            blogGrid.appendChild(card);
        });
        
    } catch (err) {
        console.error('Error fetching blog posts:', err);
        loading.style.display = 'none';
        error.style.display = 'block';
        
        // Show more detailed error in console for debugging
        error.innerHTML = `
            <p>Unable to load articles. Please try again later.</p>
            <p style="font-size: 0.9rem; color: #666; margin-top: 10px;">
                Check the browser console for more details.
            </p>
        `;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', fetchBlogPosts);
