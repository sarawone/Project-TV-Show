//You can edit ALL of the code here
function setup() {
  // get all episodes array & loop each one
  const allEpisodes = getAllEpisodes().map(makePageForEpisodes);
  
  //append all the return value to the body
  document.body.append(...allEpisodes);

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

  //adding info 
  const episodeSummary = movTemplate.querySelector("p");
  episodeSummary.innerHTML = episodeList.summary;


 return movTemplate;

}





window.onload = setup;
