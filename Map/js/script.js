// my selected location

 var locations = [
   {
   title:"Chili's",
   discription:"26th of July Corridor, Giza Governorate, Egypt",
   location :{lat:30.0062993,
              lng:30.97348050000005
            }
    },
   {
     title:"Dar Al Fouad",
     discription:"26th of July Corridor, Giza Governorate, Egypt",
     location:{lat:30.0554086,
              lng:31.073803099999964}
   },
   {
     title:"National Cancer Institute",
     discription:"Sheikh Zayed city, Giza Governorate, Egypt",
     location:{lat:30.0491629,
               lng:30.97615989999997}
   },
   {
     title:"Mall of Egypt",
     discription:"Giza- Al Wahat Al Baharia, Giza Governorate, Egypt",
     location:{lat:29.9719256,
              lng:31.01773019999996}
   },
   {
     title:"Mövenpick Hotels & Resorts",
     discription:"Wahat Road, opposite to El Hay El Motamayez, Giza, Giza Governorate 12451, Egypt",
     location:{lat:29.964884,
              lng:31.020453999999972}
   },
   {
     title:"Al Ahly SC",
     discription:"El-Nozha, Giza Governorate, Egypt",
     location:{ lat:30.0584144,
               lng:30.998196000000007}
   },
];
// set my pins in the map with knockout api

 var pins = ko.observableArray([]);
 var filtered = ko.observableArray([]);
 // intialize the map
 function initMap()
 {
   //set the first view for the map
    map = new google.maps.Map(document.getElementById('map'),
     {
       center:
       {
       lat:29.9719256,
       lng:31.01773019999996
      },
       zoom:11
    });
    // add the pins to the map
    function pushPin(id, location, title)
    {
      var marker = new google.maps.Marker(
       {
        map: map,
        position: location,
        title: title,
        id: id,
        icon:'img/placeholder.png'
        });
        pins.push(marker);
        marker.addListener('click', function ()
        {
          InfoWindowModel(this, largeInfowindow);
        });
      }
      // draw
    for (var i = 0; i < locations.length; i++)
    {
      pushPin(i, locations[i].location, locations[i].title);
    }
    // create the info window
     var largeInfowindow = new google.maps.InfoWindow();
  }
  // fitch the data about each location using wiki api
  // note this section most of it taken from internet and modified on it
  function InfoWindowModel(marker, infowindow) {

    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        //Wikipedia request
        var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
        var url;
        //error
        var wikiRequestTimeout = setTimeout(function() {
            alert("failed to get wikipedia resources");
        }, 8000);

        $.ajax({
            url: wikiUrl,
            dataType: "jsonp",
            success: function(response) {
                var articleList = response[0];
                var url = 'http://en.wikipedia.org/wiki/' + articleList;
                if(!url.includes('undefined')) {
                    infowindow.setContent('<div class="infowindow message">  <h3> ' + marker.title + ' </h3> <p> ' + locations[marker.id].discription + ' </p> <a href="' + url + ' "> ' + marker.title + ' <span> Wikipedia </span> </a> </div> ');
                }
                else {
                    infowindow.setContent('<div class="infowindow message">  <h3>' + marker.title + '</h3> <p>' + locations[marker.id].discription + '</p> </div>');
                }
                clearTimeout(wikiRequestTimeout);
            }
        });
        //show window and make animiation
        infowindow.open(map, marker);

        marker.setAnimation(google.maps.Animation.DROP);
        infowindow.addListener('closeclick', function () {
          infowindow.close();
        }

    );}

}
// build up the list of places
var viewModel = {
    filteredaddress: ko.observableArray(locations),
    keywords: ko.observable(''),
    //filter
    filter: function(value)
     {
        for (var i = 0; i < locations.length; i++) {
            if (!locations[i].title.toLowerCase().includes(viewModel.keywords().toLowerCase())) {
                pins()[i].setVisible(false);
            } else {
                pins()[i].setVisible(true);
            }
        }
        // show the result
        viewModel.filteredaddress([]);
        for (var j = 0; j < locations.length; j++) {
            if(locations[j].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                viewModel.filteredaddress.push(locations[j]);
    }
        }

    },
    // show info
    info: function(title) {
        var favouritePins = pins();
        for (var i = 0; i < favouritePins.length; i++){
            if(favouritePins[i].title === title) {
                  google.maps.event.trigger(pins()[i], 'click');
            }

        }
          console.log("lol");
    }


};
function Error() {
    $('.nomap').addClass('block');
}
ko.applyBindings(viewModel);
viewModel.keywords.subscribe(viewModel.filter);
