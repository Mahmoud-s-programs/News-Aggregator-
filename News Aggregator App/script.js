const searchButton = document.getElementById('search-button');
const searchQuery = document.getElementById('search-query');
const newsContainer = document.getElementById('news-container');
const sources = document.getElementsByName('sources');

let debounceTimeout;

// Fetch the latest news articles when the page is loaded
fetchNews('latest');

searchButton.addEventListener('click', () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    fetchNews(searchQuery.value);
  }, 300);
});

searchQuery.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      fetchNews(searchQuery.value);
    }, 300);
  }
});

function getSelectedSources() {
  return Array.from(sources)
    .filter((source) => source.checked)
    .map((source) => source.value)
    .join(',');
}

async function fetchNews(query) {
  const apiKey = '50e40c6e69d947b2a25158d81ec84718';
  const selectedSources = getSelectedSources();
  let url;

  if (query === 'latest') {
    url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}&sources=${selectedSources}`;
  } else {
    url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}&sources=${selectedSources}`;
  }

  const proxyUrl = 'https://api.allorigins.win/raw?url=';

  try {
    const response = await fetch(proxyUrl + encodeURIComponent(url));
    const data = await response.json();
    displayNews(data.articles);
  } catch (error) {
    console.error('Error fetching news:', error);
  }
}

function displayNews(articles) {
  newsContainer.innerHTML = '';

  articles.forEach(article => {
    const articleElement = document.createElement('div');
    articleElement.classList.add('article');

    articleElement.innerHTML = `
      <h2>${article.title}</h2>
      <p><strong>Source:</strong> ${article.source.name}</p>
      <img src="${article.urlToImage}" alt="${article.title}">
      <p>${article.description}</p>
      <a href="${article.url}" target="_blank">Read more</a>
    `;

    newsContainer.appendChild(articleElement);
  });
}
 
