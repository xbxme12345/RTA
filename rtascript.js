// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var map, infoWindow, pos;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: -34.397, lng: 150.644},
  zoom: 6
});
infoWindow = new google.maps.InfoWindow;
// Try HTML5 geolocation.
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
  pos = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
  infoWindow.setPosition(pos);
  var geocoder = new google.maps.Geocoder;
  geocodeLatLng(geocoder, map, infoWindow);
  infoWindow.open(map);
  map.setCenter(pos);
}, function() {
  handleLocationError(true, infoWindow, map.getCenter());
});
} else {
  // Browser doesn't support Geolocation
  handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

//Display the address/location using reverse geocoding
function geocodeLatLng(geocoder, map, infowindow) {
  var latlngStr = pos;
  var latlng = {lat: latlngStr.lat, lng: latlngStr.lng};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        map.setZoom(11);
        var marker = new google.maps.Marker({
          position: latlng,
          map: map
        });
        infowindow.setContent(results[0].formatted_address);
        infowindow.open(map, marker);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}

// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

function initAutocomplete() {
 var map = new google.maps.Map(document.getElementById('map'), {
   center: {lat: -33.8688, lng: 151.2195},
   zoom: 13,
   mapTypeId: 'roadmap'
 });

 // Create the search box and link it to the UI element.
 var input = document.getElementById('tmp');
 var searchBox = new google.maps.places.SearchBox(input);

 // Bias the SearchBox results towards current map's viewport.
 map.addListener('bounds_changed', function() {
   searchBox.setBounds(map.getBounds());
 });

 var markers = [];
 // Listen for the event fired when the user selects a prediction and retrieve
 // more details for that place.
 searchBox.addListener('places_changed', function() {
   var places = searchBox.getPlaces();

   if (places.length == 0) {
     return;
   }

   // Clear out the old markers.
   markers.forEach(function(marker) {
     marker.setMap(null);
   });
   markers = [];

   // For each place, get the icon, name and location.
   var bounds = new google.maps.LatLngBounds();
   places.forEach(function(place) {
     if (!place.geometry) {
       console.log("Returned place contains no geometry");
       return;
     }
     var icon = {
       url: place.icon,
       size: new google.maps.Size(71, 71),
       origin: new google.maps.Point(0, 0),
       anchor: new google.maps.Point(17, 34),
       scaledSize: new google.maps.Size(25, 25)
     };

     // Create a marker for each place.
     markers.push(new google.maps.Marker({
       map: map,
       icon: icon,
       title: place.name,
       position: place.geometry.location
     }));

     if (place.geometry.viewport) {
       // Only geocodes have viewport.
       bounds.union(place.geometry.viewport);
     } else {
       bounds.extend(place.geometry.location);
     }
   });
   map.fitBounds(bounds);
 });
}

window.onload = function(){

	var btnAddDest = document.getElementById("myAddBtn");

	//Initialize the list
	initDest();

	btnAddDest.addEventListener("click", function(e){
		addDest();
	});
	
	var metric = document.getElementById("metric");
	var imperial = document.getElementById("imperial");
	var settings = document.getElementById("settings");
	var destination = document.getElementById("dest");
	var setting_tab = document.getElementById("setting_tab");
	var destination_tab = document.getElementById("destination_tab");
	var calendar_tab = document.getElementById("calendar_tab");
	var add = document.getElementById("myAddBtn");


	/*if(!(setting_tab.classList.contains('active') && calendar_tab.classList.contains('active') && destination_tab.classList.contains('active')){
		settings.style.display="none"
		destination.style.display="none"
		calendar.style.display="none"	
	};*/
	
	settings.style.display="none";
	document.getElementById("expand-cal").style.display="none";


	setting_tab.addEventListener("click",function(event){
		setting_tab.setAttribute('class','active');
		calendar_tab.classList.remove('active');
		destination_tab.classList.remove('active');
		
		settings.style.display='';
		destination.style.display="none";
		document.getElementById("calendar").style.display="";
		document.getElementById("expand-cal").style.display="none";
		add.style.display="none";
	});

	destination_tab.addEventListener("click",function(event){
		destination_tab.setAttribute('class','active');
		calendar_tab.classList.remove('active');
		setting_tab.classList.remove('active');
		
		destination.style.display='';
		settings.style.display="none";
		document.getElementById("calendar").style.display="";
		document.getElementById("expand-cal").style.display="none";
	});

	calendar_tab.addEventListener("click",function(event){
		calendar_tab.setAttribute('class','active');
		setting_tab.classList.remove('active');
		destination_tab.classList.remove('active');
		
		calendar.style.display='none';
		destination.style.display="none";
		settings.style.display="none";
		add.style.display="none";
		document.getElementById("expand-cal").style.display="";
	});

	settings.addEventListener("click",function(event){
		if(metric.checked){
			//event.preventDefault()
			var valueTest = 50;
			valueTest=valueTest*.621371;
			console.log(valueTest);
		}
		else if(imperial.checked){
			//event.preventDefault()
			var valueTest = 50;
			valueTest=valueTest*1.60934;
			console.log(valueTest);
		}
	});
};


function initDest() {
	addDest();
	addDest();
}

function addDest() {

	var destination = document.getElementById("dest");

	var create = document.createElement("div");
  create.setAttribute("id", "childDiv");

	create.className = "dest";
	var d = document.createElement("img");
	d.className = "d";
	d.src = "images/Dest.png";

	var del = document.createElement("img");
	del.className = "delete";
	del.setAttribute('src', 'images/delete.png');

	var drag = document.createElement("img");
	drag.className = "drag";
	drag.setAttribute('src','images/drag.png');

	var loc = document.createElement("input");
	loc.className = "location";
	loc.type = "text";

	create.appendChild(d);
	create.appendChild(loc);
	create.appendChild(del);
	create.appendChild(drag);

	destination.appendChild(create);
}
