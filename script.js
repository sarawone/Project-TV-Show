//You can edit ALL of the code here
function setup() {
  fetchAllShows();
  showSelect.addEventListener("change", handleShowChange);
  searchInput.addEventListener("input", handleSearch);
  document.getElementById('controls').style.display = 'none';  // hiding controls from episode
  container.style.display = 'none'; // hiding episode display
}

let episodes = []; // for episode
let allShows = []; // for shows
let episodesCache = {};
const showSelect = document.getElementById("show-select");
const container = document.getElementById("episodes-container");
const searchInput = document.getElementById("search-input");
const selectEl = document.getElementById("episode-select");
const statusMessage = document.getElementById("status-message");
const showSearchInput = document.getElementById('show-search');
const backToShowsBtn = document.getElementById('back-to-shows');
const showListSection = document.getElementById('shows-listing');

//display status message
function showStatus(message) {
  statusMessage.textContent = message;
}

// clear status message
function clearStatus() {
  statusMessage.textContent = "";
}

// Load all shows on page load
async function fetchAllShows() {
  try {
    showStatus("Loading shows...");
    const response = await fetch("https://api.tvmaze.com/shows");
    const data = await response.json();
    allShows = data;
    clearStatus(); // Clear the loading message
    renderShowsList(allShows);
  } catch (error) {
    showStatus("Failed to load shows. Please refresh."); // Show error message
  }
}

// build and insert Shows list
function renderShowsList(shows){
  showListSection.innerHTML = '';

  shows.forEach(show =>{

  //adding article 
  const article = document.createElement('article');
  article.classList.add('show-card');
  
  //adding title
  const title = document.createElement('h2');
  title.textContent = show.name;
  title.classList.add('clickable');
  title.dataset.id = show.id;
  
  //adding image
  const img = document.createElement('img');
  img.src = show.image.medium ;
  img.alt = show.name;


  // Create genres paragraph
  const genres = document.createElement('p');
  genres.textContent = `Genres: ${show.genres}`;
  
  // Create status paragraph
  const status = document.createElement('p');
  status.textContent = `Status : ${show.status}`;

  // Create rating paragraph
  const rating = document.createElement('p');
  rating.textContent = `Rating : ${show.rating.average}`;
  
  // Create runtime paragraph
  const runtime = document.createElement('p');
  runtime.textContent = `Duration:${show.runtime}`;
  

  // Create summary section
  const summary = document.createElement('section');
  summary.innerHTML = show.summary;
  article.append(title,img,genres,status,rating,runtime,summary);
  showListSection.appendChild(article);

   // Adding an event listener to the title for clicking
  title.addEventListener('click', () => {
  const showId = title.dataset.id;
  handleShowChange(showId);
  showListSection.style.display = 'none';
  container.style.display = 'block';
  document.getElementById('controls').style.display = 'block';
  document.getElementById('show-select-label').style.display = 'none';
  document.getElementById('show-select').style.display ='none';
    });

  });
 }

/*
// Sort shows alphabetically (case-insensitive)
  allShows = data.sort(function (a, b) {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    return nameA.localeCompare(nameB);
  });
   // After shows are fetched, automatically select the first show
    if (allShows.length > 0) {
      showSelect.value = allShows[0].id; // Set the first show as selected
      handleShowChange(); // Fetch and display episodes for the first show
    }
*/

 // Populate show dropdown 
 allShows.forEach((show) => {
  const option = document.createElement("option");
  option.value = show.id;
  option.textContent = show.name;
  showSelect.appendChild(option);
});

// Fetch episodes for selected show
async function handleShowChange() {
  const showId = showSelect.value; // Get selected show ID
  if (!showId) return;

  // If episodes already fetched, use from cache
  if (episodesCache[showId]) {
    episodes = episodesCache[showId];
  } else {
    try {
      showStatus("Loading episodes...");
      const res = await fetch(
        `https://api.tvmaze.com/shows/${showId}/episodes`
      );
      const data = await res.json();
      episodesCache[showId] = data; // Save to cache
      episodes = data;
      clearStatus();
    } catch (error) {
      showStatus("Failed to load episodes. Try again.");
      return;
    }
  }
  selectEl.innerHTML = '<option value="">Select an episode</option>';

  searchInput.value = ""; // Clear any previous search term
  populateSelect(); // Fill episode dropdown
  renderEpisodes(episodes); // Show episodes
}

// adding option values in select box
function populateSelect() {
  episodes.forEach((ep) => {
    const option = document.createElement("option");
    option.value = ep.id;
    option.textContent = `${formatEpisodeCode(ep.season, ep.number)} - ${
      ep.name
    }`;
    selectEl.appendChild(option);
  });
}

//filtering search
function handleSearch() {
  const term = searchInput.value.trim().toLowerCase();
  if (!term) {
    renderEpisodes(episodes);
    return;
  }
  const filtered = episodes.filter((ep) => {
    const inName = ep.name.toLowerCase().includes(term);
    const inSummary = ep.summary.toLowerCase().includes(term);

    return inName || inSummary;
  });
  renderEpisodes(filtered);
}
// adding listener for search box
searchInput.addEventListener("input", handleSearch);

//filtering select box
function handleSelect() {
  const selectedId = selectEl.value;

  if (!selectedId) {
    renderEpisodes(episodes); // Show all episodes
    return;
  }

  const episode = episodes.find((ep) => ep.id == selectedId);
  if (episode) {
    renderEpisodes([episode]); // Show selected episode
  }
}

//adding listener for select box
selectEl.addEventListener("change", handleSelect);

// format the season & episode
function formatEpisodeCode(season, number) {
  const seasonNumber = String(season).padStart(2, "0");
  const epiNumber = String(number).padStart(2, "0");
  return `S${seasonNumber}E${epiNumber}`;
}

// build and insert episode
function renderEpisodes(list) {
  container.innerHTML = "";
  list.forEach((ep) => {
    // adding article
    const article = document.createElement("article");
    article.classList.add("episode");
    article.id = `episode-${ep.id}`; // to popup for select box when select

    // adding header & paragraph
    const hdr = document.createElement("header");
    const codeEl = document.createElement("p");
    codeEl.classList.add("episode-code");
    codeEl.textContent = `${ep.name}-${formatEpisodeCode(
      ep.season,
      ep.number
    )}`;

    hdr.append(codeEl);

    // adding image
    const fig = document.createElement("figure");
    const link = document.createElement("a");
    link.href = ep.url;
    const img = document.createElement("img");
    img.src = ep.image.medium;
    img.alt = ep.name;
    link.appendChild(img);

    fig.append(link);

    // adding section for summary
    const summarySec = document.createElement("section");
    summarySec.classList.add("episode-summary");
    summarySec.innerHTML = ep.summary;

    //appending tags
    article.append(hdr, fig, summarySec);
    container.appendChild(article);
  });
}

window.onload = setup;
