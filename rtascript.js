var map;
var index;
var searchBox = [];
var directionsService;
var directionsDisplay;
var arr = [];
var measurement;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: -34.397, lng: 150.644},
  zoom: 6
  });

  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer({
    draggable: true,
    map: map,
    panel: document.getElementById('directions')
  });
}
// initMap

function search(e) {
  var currIndex =  e.getAttribute("value");

  map.addListener('bounds_changed', function() {
    searchBox[currIndex].setBounds( map.getBounds() );
  });

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox[currIndex].addListener('places_changed', function() {
    var places = searchBox[currIndex].getPlaces();

    if (places.length == 0) {
      return;
    }

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();

    places.forEach( function(place) {
      arr[currIndex] = place;

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      }
      else {
        bounds.extend(place.geometry.location);
      }
    });
    //for each place
    update();
    map.fitBounds(bounds);
  });


  if (arr.length > 1) {
    displayRoute(directionsService, directionsDisplay);
  }

  directionsDisplay.addListener('directions_changed', function() {
    computeTotalDistance(directionsDisplay.getDirections());
  });
};

function displayRoute(service, display) {
	var size = arr.length;
	var way = [];

	if (size > 2) {
    var wayIndex = 0;
    for (var j=1; j<size-1; j++) {
      way.push({
         location: arr[j].geometry.location
       });

    }
  }

  service.route({
    origin: arr[0].geometry.location,
    destination: arr[size-1].geometry.location,
    unitSystem: measurement,
    waypoints: way,
    travelMode: 'DRIVING'
  }, function(response, status) {
    if (status === 'OK') {
      display.setDirections(response);
    }
    else {
      alert('ERROR: ' + status);
    }
  });

}
// display

function computeTotalDistance(result) {
  var total = 0;
  var myroute = result.routes[0];
  for (var i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }

  total = total / 1000;
  document.getElementById('total').innerHTML = total + ' km';
}
// compute total

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
	var settings_image=document.getElementById("gear")
	var destination = document.getElementById("dest");
	var setting_tab = document.getElementById("setting_tab");
	var destination_tab = document.getElementById("destination_tab");
	var calendar_tab = document.getElementById("calendar_tab");
	var add = document.getElementById("myAddBtn");
	var directions = document.getElementById("directions");


	settings.style.display="none";
	document.getElementById("expand-cal").style.display="none";

	settings_image.style.float="right"
	settings_image.addEventListener("click",function(event){
		var newWindow = window.open("",null,"height=100,width=100,status=yes,toolbar=no,menubar=no,location=yes,resizable=1");
		newWindow.document.body.innerHTML = settings.innerHTML;
		newWindow.resizeBy(75,75)
		newWindow.focus();
		newWindow.document.getElementById("metric").addEventListener("click",function(event){
			changeMeasurement(newWindow)
		});

		newWindow.document.getElementById("imperial").addEventListener("click",function(event){
			changeMeasurement(newWindow)
		});
	});

	destination_tab.addEventListener("click",function(event){
		destination_tab.setAttribute('class','active');
		calendar_tab.classList.remove('active');
		add.style.display='';
		destination.style.display='';
		directions.style.display="";
		settings.style.display="none";
		document.getElementById("calendar").style.display="";
		document.getElementById("expand-cal").style.display="none";
	});

	calendar_tab.addEventListener("click",function(event){
		calendar_tab.setAttribute('class','active');
		destination_tab.classList.remove('active');

		destination.style.display="none";
		settings.style.display="none";
		add.style.display="none";
    directions.style.display="none";
		document.getElementById("expand-cal").style.display="";
	});


};
function changeMeasurement(newWindow){
		if(newWindow.document.getElementById("metric").checked){
			measurement = google.maps.UnitSystem.METRIC;
			update();
		}
		else if(newWindow.document.getElementById("imperial").checked){
			measurement = google.maps.UnitSystem.IMPERIAL;
			update();
		}
	}

function initDest() {
	addDest();
	addDest();
}

function addDest() {

  var destinations = document.querySelectorAll(".dest")
  var last = destinations[destinations.length - 1];

	var create = document.createElement("div");
  create.setAttribute("id", "childDiv");
  create.draggable = "true";
	create.className = "dest";
  create.setAttribute('value', document.getElementsByClassName("location").length);

  var destination = document.getElementById("dest");

	var d = document.createElement("img");
	d.className = "d";
	d.src = "images/Dest.png";

	var del = document.createElement("img");
	del.className = "delete";
	del.setAttribute('src', 'images/delete.png');
  del.setAttribute('onclick', 'deleteLocation(event)');

	var drag = document.createElement("img");
	drag.className = "drag";
	drag.setAttribute('src','images/drag.png');
  drag.setAttribute('ondragstart', 'dragStarted(event)');
  drag.setAttribute('ondragover', 'draggingOver(event)');
  drag.setAttribute('ondrop', 'dropped(event)');

	var loc = document.createElement("input");
	loc.className = "location";
	loc.type = "text";

	create.appendChild(d);
	create.appendChild(loc);
	create.appendChild(del);
	create.appendChild(drag);

	destination.appendChild(create);

  index = document.getElementsByClassName("location").length;
  searchBox[index-1] = new google.maps.places.SearchBox(loc);

  update();

}

var source;
function dragStarted(e) {
  //start drag
  source = e.target.parentElement;
  //set data
  e.dataTransfer.setData("text/plain", source.innerHTML);

  console.log(e.dataTransfer.getData("text/plain"));
  //specify allowed transfer
  e.dataTransfer.effectAllowed = "move";
}

function draggingOver(e) {
  //drag over
  e.preventDefault();
  //specify operation
  e.dataTransfer.dropEffect = "move";
}

function dropped(e) {
  //drop
  e.preventDefault();
  e.stopPropagation();

  //update text in dragged item
  source.innerHTML = e.target.parentElement.innerHTML;
  //update text in drop target
  e.target.parentElement.innerHTML = e.dataTransfer.getData("text/plain");

  update();
}
//end of Reordering Locations

//Delete Location
function deleteLocation(e) {
  var deletedIndex = e.target.parentElement.getAttribute('value');
  e.target.parentElement.remove();
  var tmp = document.getElementById('dest').children;
  arr.splice(deletedIndex, 1);

  for (var f=deletedIndex; f<tmp.length; f++) {
    tmp[1].setAttribute('value', 1);
  }

  update();
}

function update() {
  var tmp = document.getElementById('dest').children;
  for (var l=0; l<tmp.length; l++) {
    search(tmp[l]);
  }
}
