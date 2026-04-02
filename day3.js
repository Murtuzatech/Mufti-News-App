//  1️ API KEY (Apni API key yahan paste karo)
const apiKey = "c3a76feca80d4c27b3d60d71f60d324a";

//  2️ News Container
const newsContainer = document.getElementById("news");

//  3️ Pagination Variables
let currentPage = 1;
const articlesPerPage = 6;
let currentArticles = [];

// Load general news on page load
document.addEventListener('DOMContentLoaded', function() {
    getNews('general');
});

// ==========================================================
//  Dummy News Data
// ==========================================================
function getDummyNews() {
    return [
        {
            title: "Welcome to Mufti News - Your Daily News Source",
            description: "Stay informed with the latest news from around the world. Browse through different categories or search for specific topics.",
            url: "#",
            urlToImage: "https://i.pinimg.com/474x/87/93/de/8793defd4cab21a334ceeb82b126fb55.jpg"
        },
        {
            title: "Breaking News: Technology Advancements",
            description: "Explore the latest in technology, from AI innovations to cutting-edge gadgets that are shaping our future.",
            url: "#",
            urlToImage: "https://via.placeholder.com/350x200/764ba2/ffffff?text=Tech+News"
        },
        {
            title: "Health & Wellness Updates",
            description: "Get the most recent health tips, medical breakthroughs, and wellness advice to maintain a healthy lifestyle.",
            url: "#",
            urlToImage: "https://via.placeholder.com/350x200/667eea/ffffff?text=Health+News"
        },
        {
            title: "Sports Highlights",
            description: "Catch up on the latest sports events, match results, and athlete achievements from around the globe.",
            url: "#",
            urlToImage: "https://via.placeholder.com/350x200/764ba2/ffffff?text=Sports+News"
        },
        {
            title: "Business & Finance Insights",
            description: "Stay updated with market trends, economic news, and business strategies that impact your financial future.",
            url: "#",
            urlToImage: "https://via.placeholder.com/350x200/667eea/ffffff?text=Business+News"
        },
        {
            title: "Science & Discovery",
            description: "Discover amazing scientific breakthroughs, space exploration updates, and innovative research findings.",
            url: "#",
            urlToImage: "https://via.placeholder.com/350x200/764ba2/ffffff?text=Science+News"
        }
    ];
}

// ==========================================================
//  4️ Category News Function
// ==========================================================
function getNews(category) {

    newsContainer.innerHTML = "<p>Loading news...</p>";
    currentPage = 1; // Reset to first page

    const url = `https://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {

            if (!data.articles || data.articles.length === 0) {
                // Show dummy news only for general category (homepage)
                if (category === 'general') {
                    currentArticles = getDummyNews();
                    displayNews(currentArticles, currentPage);
                } else {
                    newsContainer.innerHTML = "<p>No news found.</p>";
                }
                return;
            }

            currentArticles = data.articles;
            displayNews(currentArticles, currentPage);
        })
        .catch(error => {
            // Show dummy news on API error for general category
            if (category === 'general') {
                currentArticles = getDummyNews();
                displayNews(currentArticles, currentPage);
            } else {
                newsContainer.innerHTML = "<p>Something went wrong!</p>";
            }
            console.log(error);
        });
}


// ==========================================================
//  5️ Search News Function
// ==========================================================
function handleSearch() {

    const query = document.getElementById("searchInput").value.trim();

    if (query === "") {
        alert("Please enter something to search!");
        return;
    }

    newsContainer.innerHTML = "<p>Searching news...</p>";
    currentPage = 1; // Reset to first page

    const url = `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {

            if (!data.articles || data.articles.length === 0) {
                newsContainer.innerHTML = "<p>No news found.</p>";
                return;
            }

            currentArticles = data.articles;
            displayNews(currentArticles, currentPage);
        })
        .catch(error => {
            newsContainer.innerHTML = "<p>Something went wrong!</p>";
            console.log(error);
        });
}


// ==========================================================
//  6️ Display News Function with Pagination
// ==========================================================
function displayNews(articles, page) {

    const startIndex = (page - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const paginatedArticles = articles.slice(startIndex, endIndex);

    let output = "";

    paginatedArticles.forEach(article => {

        // Use placeholder image if no image is available
        const imageUrl = article.urlToImage || "https://via.placeholder.com/350x200/667eea/ffffff?text=No+Image";

        output += `
            <div class="card">
                <img src="${imageUrl}" alt="news image">
                <div class="card-content">
                    <h3>${article.title}</h3>
                    <p>${article.description ? article.description : "No description available."}</p>
                    <a href="${article.url}" target="_blank">Read More</a>
                </div>
            </div>
        `;
    });

    // Add pagination controls
    const totalPages = Math.ceil(articles.length / articlesPerPage);
    output += createPaginationControls(totalPages, page);

    newsContainer.innerHTML = output;
}

// ==========================================================
//  7️ Create Pagination Controls
// ==========================================================
function createPaginationControls(totalPages, currentPage) {

    if (totalPages <= 1) return "";

    let paginationHTML = '<div class="pagination">';

    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button onclick="changePage(${currentPage - 1})" class="pagination-btn">Previous</button>`;
    }

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
        paginationHTML += `<button onclick="changePage(1)" class="pagination-btn">1</button>`;
        if (startPage > 2) {
            paginationHTML += '<span class="pagination-dots">...</span>';
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationHTML += `<button onclick="changePage(${i})" class="pagination-btn ${activeClass}">${i}</button>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += '<span class="pagination-dots">...</span>';
        }
        paginationHTML += `<button onclick="changePage(${totalPages})" class="pagination-btn">${totalPages}</button>`;
    }

    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button onclick="changePage(${currentPage + 1})" class="pagination-btn">Next</button>`;
    }

    paginationHTML += '</div>';
    return paginationHTML;
}

// ==========================================================
//  8️ Change Page Function
// ==========================================================
function changePage(page) {
    currentPage = page;
    displayNews(currentArticles, currentPage);
    // Scroll to top of news section
    document.getElementById("news").scrollIntoView({ behavior: 'smooth' });
}