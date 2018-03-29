var tabs = $('.tabs > li');

tabs.on("click", function(){
  tabs.removeClass('active');
  $(this).addClass('active');
});

function addDest() {
	"use strict";
	var destinations = document.querySelectorAll(".dest");
	var last = destinations[destinations.length-1];
			console.log(destinations);
	var create = document.createElement("div");
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
	last.parentElement.appendChild(create);
	
}