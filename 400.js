//You can edit ALL of the code here
function setup() {
    // get all episodes array & loop each one
    const allEpisodes = getAllEpisodes().map(makePageForEpisodes);
    
    //append all the return value to the body
    document.body.append(...allEpisodes);
  
    const footer = document.createElement("footer");
    footer.innerHTML = "<h4>Data For This page provided by TVMaze</h4>";
    document.body.appendChild(footer);
    
  
  }
  
  // creating the content of each episode
  function makePageForEpisodes(episodeList) {
  
    //clone template 
    const movTemplate = document.getElementById("card").content.cloneNode(true);
    
    // adding title 
    const episodeTitle  = movTemplate.querySelector("h3");
  
    // padding 0 infront of season 
    const epiSeason = "S"+String(episodeList.season).padStart(2,"0");
    //adding 0 inforont of the episode number 
    const epiNumber = "E"+String (episodeList.number).padStart(2,"0"); 
    episodeTitle.textContent = episodeList.name + '-' + epiSeason + epiNumber;
  
    //adding image 
    const episodePic  =  movTemplate.querySelector("img");
    episodePic.src = episodeList.image.medium;
  
    //adding credit link to original 
    const epiSource = movTemplate.querySelector("a");
    epiSource.href = "https://www.tvmaze.com/";
    epiSource.textContent = "TVMaze"
  
    //adding info 
    const episodeSummary = movTemplate.querySelector("p");
    episodeSummary.innerHTML = episodeList.summary;
  
   return movTemplate;
  
  
  }
  
    // level 300 get data from API
  
      const state = {
      // Empty array to store films after get data from API
          films : [],
      
          // search key word from search box
          searchTerm : "",
          selectOption : ""
      
      };
  
  
      //fetch data from API
  
      function fetchFilms() {
       return fetch('https://api.tvmaze.com/shows').then(function(data) {
          return data.json();
  
        })
      }
  
      fetchFilms().then(function (film){
        state.films = film;

               // Creating select box for selecting season & episode
       //1. adding new title in the array 
       //2. load the new title into the select box option
  
       const selectFilm = state.films.map(select => {
  
        const epiSeason = "S"+String(select.season).padStart(2,"0");
        //adding 0 inforont of the episode number 
        const epiNumber = "E"+String (select.number).padStart(2,"0"); 
        select.title =  epiSeason + epiNumber + '-'+ select.name;
        return select;
       });
  
       // getting DOM element for select
  
        const selectSeries = document.getElementById('seri-dropdown');
    // filter the film & render content for the display 
  
          //clear the previous option 
         // selectEpi.innerHTML='';
  
          //create option and load each title 
    
          state.films.forEach(element => {
    
            const option= document.createElement('option');
            option.value = element.name;
            option.textContent = element.name;
    
            selectEpi.appendChild(option);
            
         })
  
        }
      )
  
  

    
    function render()
    {
       // filter film base on the search term.
       const fliteredFilm = state.films.filter(function(flim){
          return   flim.name.toLowerCase().includes(state.searchTerm.toLowerCase());
        
       });
  
       // clear the  template before adding content
     document.getElementById('flimContainer').innerHTML = '';
  
      const episode = fliteredFilm.map(makePageForEpisodes)
      document.getElementById('flimContainer').append(...episode);
  
  
  
     const selectEpisode = state.films.find( flim => flim.title === state.selectOption);
  
     if(selectEpisode)
     {
  
      document.getElementById('flimContainer').innerHTML = '';
  
      const selection = makePageForEpisodes(selectEpisode);
      document.getElementById('flimContainer').append(selection); 
     } 
  
    }
    
  
    // link the input from the search box to film array
    // 1. get the input from the search box.
    // 2. link the input to the search value.
    
    // selecting input element 
    const searchValue = document.querySelector("input");
    
    //capture the value while input type in search box
    searchValue.addEventListener('keyup',function() {
    
     //update the search value with the data in input text box
     state.searchTerm = searchValue.value;
     state.selectOption ="option1"
     render();
    })
  
    
     // clear the previous flim content
     //document.getElementById('flimContainer').innerHTML = '';
  
    const selectValue = document.querySelector("select");
  
     selectValue.addEventListener('change',function(){
     state.selectOption = selectValue.value;
  
     document.getElementById('flimContainer').innerHTML = '';
  
      render();
     })
     
    
  
  
  window.onload = setup;
  