const container = document.querySelector(".w3-container");
const locationBtn = document.querySelector("#getLocation")
// const searchBtn = document.querySelector('#googleSearchBtn');
var query;


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  window.initMap = initMap(position);
}
locationBtn.addEventListener("click", getLocation())


function initMap(position) {
  // Create the map.
  const location = { lat: position.coords.latitude, lng: position.coords.longitude }; //35.00573247895826, -80.84910169025957 the coordinates of RV
  const map = new google.maps.Map(document.getElementById("map"), {
    center: location,
    zoom: 17,
    mapId: "8d193001f940fde3",
  });
  // Create the places service.
  const service = new google.maps.places.PlacesService(map);
  let getNextPage;
  const moreButton = document.getElementById("more");

  moreButton.onclick = function () {
    moreButton.disabled = true;
    if (getNextPage) {
      getNextPage();
    }
  };

  // Perform a nearby search.
  service.nearbySearch(
    { location: location, radius: 3500, type: "pharmacy" },
    (results, status, pagination) => {
      if (status !== "OK" || !results) return;

      addPlaces(results, map);
      moreButton.disabled = !pagination || !pagination.hasNextPage;
      if (pagination && pagination.hasNextPage) {
        getNextPage = () => {
          // Note: nextPage will call the same handler function as the initial call
          pagination.nextPage();
        };
      }
    }
  );
}

async function addPlaces(places, map) {
  const placesList = document.getElementById("places");

  for (const place of places) {
    if (place.geometry && place.geometry.location) {
      const image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      new google.maps.Marker({
        map,
        icon: image,
        title: place.name,
        position: place.geometry.location,
      });

      const li = document.createElement("li");
      const btn = document.createElement("button");

      btn.setAttribute('id', 'googleSearchBtn');
      btn.setAttribute('value', place.name)
      btn.textContent = `Search for ${place.name}`
      li.textContent = place.name;
      placesList.appendChild(li);
      placesList.appendChild(btn);
      li.addEventListener("click", () => {
        map.setCenter(place.geometry.location);
      });
      // let org = btn.value
      btn.addEventListener("click", async function () {
        let query = btn.value
        console.log(query);
        const options = {
          method: 'GET',
          headers: {
            'X-User-Agent': 'desktop',
            'X-Proxy-Location': 'EU',
            'X-RapidAPI-Key': '949aff8ad2mshf5a360e795ac417p17d83bjsn73bba83ff5ef',
            'X-RapidAPI-Host': 'google-search3.p.rapidapi.com'
        }
  };
        let response = await fetch(`https://google-search3.p.rapidapi.com/api/v1/search/q=${query}`, options)
        let data = await response.json();
        let info = data.results[0];
        const {link, title} = info;
        console.log(link, title);
        var searchedBy = 'Searched using Google';
      
        var content = `
        <div class="w3-card-4" style="align-items: center width:70%">
        <header class="w3-container w3-light-grey">
            <h3>${title}</h3>
          </header>
          <div class="w3-container">
            <hr>
            <img src="./photos/gogle.png" alt="Google" class="w3-left w3-circle w3-margin-right" style="width:60px">
            <p>${searchedBy}</p><br>
          </div>
          <a href="${link}" target="_blank" class="w3-button w3-block w3-dark-grey">${link}</a>
          </div>
        `
        container.innerHTML += content;
      })
    }
  }
}