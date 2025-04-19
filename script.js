//You can edit ALL of the code here
function setup() {

   // show the content as soon as the page load 
   renderEpisodes();
  
  }
// format the season & episode 
function formatEpisodeCode(season, number) {
    const seasonNumber = String(season).padStart(2, '0');
    const epiNumber = String(number).padStart(2, '0');
    return `S${seasonNumber}E${epiNumber}`;
  }
  
  // build and insert episodes
  function renderEpisodes() {
    const container = document.getElementById('episodes-container');
    getAllEpisodes().forEach(ep => {
      // adding article 
      const article = document.createElement('article');
      article.classList.add('episode');
  
      // adding header & paragraph
      const hdr = document.createElement('header');
      const codeEl = document.createElement('p');
      codeEl.classList.add('episode-code');
      codeEl.textContent = `${ep.name}-${formatEpisodeCode(ep.season, ep.number)}`;

      hdr.append(codeEl);
  
      // adding image
      const fig = document.createElement('figure');
      const link = document.createElement('a');
      link.href = ep.url;
      const img = document.createElement('img');
      img.src = ep.image.medium;
      img.alt = ep.name;
      link.appendChild(img);
  
      fig.append(link);
  
      // adding section for summary
      const summarySec = document.createElement('section');
      summarySec.classList.add('episode-summary');
      summarySec.innerHTML = ep.summary;
  
      //appending tags
      article.append(hdr, fig, summarySec);
      container.appendChild(article);
    });
  }

  window.onload = setup;
  