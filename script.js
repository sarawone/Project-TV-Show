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

// search box 

// state for search 
const state = {
  // films array to filter 
      films : getAllEpisodes(),
  
      // search key word from search box
      searchTerm : "",
      selectOption : "option1"
  
  };
  // filter the film & render content for the display 
  
  function render()
  {
     const fliteredFilm = state.films.filter(function(flim){
        return   flim.name.toLowerCase().includes(state.searchTerm.toLowerCase());
      
     });
     const episode = fliteredFilm.map(makePageForEpisodes)
     document.getElementById('flimContainer').append(...episode);

     // select box
     //1. adding new title in the array 
     //2. load the new title into the select box option

     const selectFilm = state.films.map(select => {

      const epiSeason = "S"+String(select.season).padStart(2,"0");
      //adding 0 inforont of the episode number 
      const epiNumber = "E"+String (select.number).padStart(2,"0"); 
      select.title =  epiSeason + epiNumber + '-'+ select.name;

     })
     

  }
// display the initial display
  render() ;
  

  
  // link the input from the search box to film array
  // 1. get the input from the search box.
  // 2. link the input to the search value.
  
  // selecting input element 
  const searchValue = document.querySelector("input");
  
  //capture the value while input type in search box
  searchValue.addEventListener('keyup',function() {
  
   //update the search value with the data in input text box
   state.searchTerm = searchValue.value;
  
   // clear the previous flim content
   document.getElementById('flimContainer').innerHTML = '';
  
   // call the render
   render();
  });
  

window.onload = setup;
