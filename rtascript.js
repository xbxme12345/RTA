// Google Maps API
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: -24.345, lng: 134.46}
  });

  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer({
    draggable: true,
    map: map,
    panel: document.getElementById('right-panel')
  });

  // Create the search box and link it to the UI element.
  var inputs = document.getElementsByClassName('location');

  var markers = [];

  for (var i=0; i<inputs.length; i++) {
    console.log(i);

    var searchBox = new google.maps.places.SearchBox(inputs[i]);
    map.addListener('bounds_changed', function() {
      searchBox.setBounds( map.getBounds() );
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();
      console.log(places);

      if (places.length == 0) {
        return;
      }

      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.

      // Clear out the old markers.
      markers.forEach( function(marker) {
        marker.setMap(null);
      });

      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      var end;
      places.forEach( function(place) {
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
        markers.push( new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }) );

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        }
        else {
          bounds.extend(place.geometry.location);
        }

        end = place;
      });
      map.fitBounds(bounds);

    });
  }

  directionsDisplay.addListener('directions_changed', function() {
    computeTotalDistance( directionsDisplay.getDirections() );
  });
}

function displayRoute(origin, destination, service, display) {
  service.route({
    origin: origin,
    destination: destination,
    waypoints: [{location: 'Dorchester, MA'}],
    travelMode: 'DRIVING'
  }, function(response, status) {
    if (status === 'OK') {
      display.setDirections(response);
    }
    else {
      alert('Could not display directions due to: ' + status);
    }
  });
}

function computeTotalDistance(result) {
  var total = 0;
  var myroute = result.routes[0];
  for (var i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }

  total = total / 1000;
  document.getElementById('total').innerHTML = total + ' km';
}

//end of Google Maps API

var tabs = $('.tabs > li');

tabs.on("click", function() {
  tabs.removeClass('active');
  $(this).addClass('active');
});

// Add Location
function addDest() {
	"use strict";
	var destinations = document.querySelectorAll(".dest");
	var last = destinations[destinations.length-1];
	var create = document.createElement("div");
	create.className = "dest";
  create.draggable = "true";

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
  loc.name = "index[]";

	create.appendChild(d);
	create.appendChild(loc);
	create.appendChild(del);
	create.appendChild(drag);
	last.parentElement.appendChild(create);
}
// End of Add Location

// Reorder Locations
var source;
function dragStarted(e) {
  //start drag
  source = e.target.parentElement;
  //set data
  e.dataTransfer.setData("text/plain", source.innerHTML);
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
}

//end of Reordering Locations

//Delete Location
function deleteLocation(e) {
  e.target.parentElement.remove();
}
//end of Delete Location
