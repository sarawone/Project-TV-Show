/*//You can edit ALL of the code here
function setup() {
  fetchEpisodes();
}

let episodes    = []; 
const container = document.getElementById("episodes-container");
const searchInput = document.getElementById("search-input");
const selectEl = document.getElementById("episode-select");
const statusMessage = document.getElementById('status-message');

//display status message
function showStatus (message)
  {
     statusMessage.textContent = message;
  }
 
// clear status message
function clearStatus()
  {
     statusMessage.textContent ='';
  }

  //fetching data from API
async function fetchEpisodes() {
  try {
    showStatus('Loading episodes...');
  
    const response = await fetch('https://api.tvmaze.com/shows/82/episodes');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const data = await response.json();
    episodes = data;
  
    clearStatus();
    populateSelect();
    renderEpisodes(episodes);
  
    } catch (error) {
      showStatus('Failed to load episodes. Please try again later.');
    }
  }
      

  // adding option values in select box   
  function populateSelect() {
    episodes.forEach(ep => {
      const option = document.createElement('option');
      option.value = ep.id;
      option.textContent = `${formatEpisodeCode(ep.season, ep.number)} - ${ep.name}`;
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

window.onload = setup;*/
//You can edit ALL of the code here
function setup() {
  fetchAllShows();
  showSelect.addEventListener("change", handleShowChange);
  episodeSelect.addEventListener("change", handleEpisodeSelect);
  searchInput.addEventListener("input", handleSearch);
}

let episodes = []; // for episode
let allShows = []; // for shows
let episodesCache = {};
const showSelect = document.getElementById("show-select");
const container = document.getElementById("episodes-container");
const searchInput = document.getElementById("search-input");
const selectEl = document.getElementById("episode-select");
const statusMessage = document.getElementById("status-message");

//display status message
function showStatus(message) {
  statusMessage.textContent = message;
}

// clear status message
function clearStatus() {
  statusMessage.textContent = "";
}

//fetching show data from API

// Load all shows on page load
async function fetchAllShows() {
  try {
    showStatus("Loading shows...");
    const response = await fetch("https://api.tvmaze.com/shows");
    const data = await response.json();

    // Sort shows alphabetically (case-insensitive)
    allShows = data.sort(function (a, b) {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return nameA.localeCompare(nameB);
    });

    // Populate show dropdown
    allShows.forEach((show) => {
      const option = document.createElement("option");
      option.value = show.id;
      option.textContent = show.name;
      showSelect.appendChild(option);
    });

    clearStatus(); // Clear the loading message

    // After shows are fetched, automatically select the first show
    if (allShows.length > 0) {
      showSelect.value = allShows[0].id; // Set the first show as selected
      handleShowChange(); // Fetch and display episodes for the first show
    }
  } catch (error) {
    showStatus("Failed to load shows. Please refresh."); // Show error message
  }
}

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
