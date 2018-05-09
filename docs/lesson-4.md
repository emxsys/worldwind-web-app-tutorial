# How to Build a WorldWind Web App
- [Home](index.md) 
- [Lesson 1: HTML with Bootstrap](lesson-1.md) 
- [Lesson 2: WorldWind Globe](lesson-2.md) 
- [Lesson 3: Layer Management with Knockout](lesson-3.md) 
- Lesson 4: >> Place Search and Geocoding <<

## Lesson 4: Place Search and Geocoding

- Use the MapQuest Nominatim service for the search
- Display the search results in a modal dialog
- Preview a results on another globe with placemarks
- Go to a selected result

View the completed code: [Lesson 4](https://jsfiddle.net/emxsys/fn4bhbuf/)

### Add 2D Projection Support

We'll use a 2D map in our search preview dialog. WorldWind already has support
for 2D projections, so all we need to do is add the ability to change the 
projection to the `Globe` class. 

Change the `Globe` constructor by adding the `projectionName` argument, like this:
```javascript
constructor(canvasId, projectionName) {
```

Then add this code to the constructor's body to keep track of the current projection,
add it after the `this.wwd` property is assigned:
```javascript
// Projection support
this.roundGlobe = this.wwd.globe;   // The default is a 3D globe
this.flatGlobe = null;
if (projectionName) {
    this.changeProjection(projectionName);
}
```

Finally, add these two functions to the `Globe` class after the constructor. The
getter can be used in the UI to provide a list of supported projections. 
`changeProjection` does just what it says.
```javascript
/**
 * Returns the supported projection names.
 * @returns {Array} 
 */
get projectionNames() {
    return[
        "3D",
        "Equirectangular",
        "Mercator",
        "North Polar",
        "South Polar",
        "North UPS",
        "South UPS",
        "North Gnomonic",
        "South Gnomonic"
    ];
}
/**
 * Changes the globe's projection.
 * @param {String} projectionName
 */
changeProjection(projectionName) {
    if (projectionName === "3D") {
        if (!this.roundGlobe) {
            this.roundGlobe = new WorldWind.Globe(new WorldWind.EarthElevationModel());
        }
        if (this.wwd.globe !== this.roundGlobe) {
            this.wwd.globe = this.roundGlobe;
        }
    } else {
        if (!this.flatGlobe) {
            this.flatGlobe = new WorldWind.Globe2D();
        }
        if (projectionName === "Equirectangular") {
            this.flatGlobe.projection = new WorldWind.ProjectionEquirectangular();
        } else if (projectionName === "Mercator") {
            this.flatGlobe.projection = new WorldWind.ProjectionMercator();
        } else if (projectionName === "North Polar") {
            this.flatGlobe.projection = new WorldWind.ProjectionPolarEquidistant("North");
        } else if (projectionName === "South Polar") {
            this.flatGlobe.projection = new WorldWind.ProjectionPolarEquidistant("South");
        } else if (projectionName === "North UPS") {
            this.flatGlobe.projection = new WorldWind.ProjectionUPS("North");
        } else if (projectionName === "South UPS") {
            this.flatGlobe.projection = new WorldWind.ProjectionUPS("South");
        } else if (projectionName === "North Gnomonic") {
            this.flatGlobe.projection = new WorldWind.ProjectionGnomonic("North");
        } else if (projectionName === "South Gnomonic") {
            this.flatGlobe.projection = new WorldWind.ProjectionGnomonic("South");
        }
        if (this.wwd.globe !== this.flatGlobe) {
            this.wwd.globe = this.flatGlobe;
        }
    }
}
```

Now a 'Globe' can be created with a specific projection or you can change it later.


### Add the Search Capabilities

The search capabilities are performed by the MapQuest Open Street Map Nominatim
service.  This service requires an API key.  Copy the following block of Javascript
and paste it to app.js inside `$(document).ready(...)` function, above the 
`Globe` class:

```javascript
    // Set the MapQuest API key used for the Nominatim service.
    // Get your own key at https://developer.mapquest.com/
    // Without your own key you will be using a limited WorldWind developer's key.
    const MAPQUEST_API_KEY = "";
```

The [WorldWind.NominatimGeocoder](https://nasaworldwind.github.io/WebWorldWind/NominatimGeocoder.html) 
encapsulates the MapQuest's Nominatim service for us. We'll create a 
new `SearchViewModel` to get the user's search text and perform the 
search using the `WorldWind.NominatimGeocoder`. 

Our view model will examine the the search text and if looks like a latitude, 
longitude pair (e.g.: "34.2, -119.2") we'll simply center the globe on that 
location, otherwise we'll use the `NominatimGeocoder` to lookup places that 
match the search text. The results will be displayed in a modal dialog 
controlled by a new `PreviewViewModel`

Add the following JavaScript code for the `SearchViewModel` to app.js below the 
`SettingsViewModel`.

```javascript
/**
 * Search view model. Uses the MapQuest Nominatim API. 
 * Requires an access key. See: https://developer.mapquest.com/
 * @param {Globe} globe
 * @param {Function} preview Function to preview the results
 * @returns {SearchViewModel}
 */
function SearchViewModel(globe, preview) {
    var self = this;
    self.geocoder = new WorldWind.NominatimGeocoder();
    self.searchText = ko.observable('');
    self.performSearch = function () {
        if (!MAPQUEST_API_KEY) {
            console.error("SearchViewModel: A MapQuest API key is required to use the geocoder in production. Get your API key at https://developer.mapquest.com/");
        }
        // Get the value from the observable
        let queryString = self.searchText();
        if (queryString) {
            if (queryString.match(WorldWind.WWUtil.latLonRegex)) {
                // Treat the text as a lat, lon pair 
                let tokens = queryString.split(",");
                let latitude = parseFloat(tokens[0]);
                let longitude = parseFloat(tokens[1]);
                // Center the globe on the lat, lon
                globe.wwd.goTo(new WorldWind.Location(latitude, longitude));
            } else {
                // Treat the text as an address or place name
                self.geocoder.lookup(queryString, function (geocoder, results) {
                    if (results.length > 0) {
                        // Open the modal dialog to preview and select a result
                        preview(results);
                    }
                }, MAPQUEST_API_KEY);
            }
        }
    };
}
```

The new `PreviewViewModel` will display the search results in a table and on
a 2D map (another `Globe` object). Its `previewResults` function loads
a Knockout observable array with the results.  These results are used to populate
the table's rows and the preview globe's placemarks.  When table row is clicked, 
its onClick event invokes `previewSelection` which centers the preview globe/map
on the selected item's location. 

Add the following JavaScript code for the `PreviewViewModel` to app.js below the 
`SearchViewModel`.

```javascript
/**
 * Define the view model for the Search Preview.
 * @param {Globe} primaryGlobe
 * @returns {PreviewViewModel}
 */
function PreviewViewModel(primaryGlobe) {
    var self = this;
    // Show a warning message about the MapQuest API key if missing
    this.showApiWarning = (MAPQUEST_API_KEY === null || MAPQUEST_API_KEY === "");

    // Create secondary globe with a 2D Mercator projection for the preview
    this.previewGlobe = new Globe("preview-canvas", "Mercator");
    let resultsLayer = new WorldWind.RenderableLayer("Results");
    let bingMapsLayer = new WorldWind.BingRoadsLayer();
    bingMapsLayer.detailControl = 1.25; // Show next level-of-detail sooner. Default is 1.75
    this.previewGlobe.addLayer(bingMapsLayer);
    this.previewGlobe.addLayer(resultsLayer);

    // Set up the common placemark attributes for the results
    let placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
    placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/pushpins/castshadow-red.png";
    placemarkAttributes.imageScale = 0.5;
    placemarkAttributes.imageOffset = new WorldWind.Offset(
        WorldWind.OFFSET_FRACTION, 0.3,
        WorldWind.OFFSET_FRACTION, 0.0);

    // Create an observable array who's contents are displayed in the preview
    this.searchResults = ko.observableArray();
    this.selected = ko.observable();

    // Shows the given search results in a table with a preview globe/map
    this.previewResults = function (results) {
        if (results.length === 0) {
            return;
        }
        // Clear the previous results
        self.searchResults.removeAll();
        resultsLayer.removeAllRenderables();
        // Add the results to the observable array
        results.map(item => self.searchResults.push(item));
        // Create a simple placemark for each result
        for (let i = 0, max = results.length; i < max; i++) {
            let item = results[i];
            let placemark = new WorldWind.Placemark(
                new WorldWind.Position(
                    parseFloat(item.lat),
                    parseFloat(item.lon), 100));
            placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
            placemark.displayName = item.display_name;
            placemark.attributes = placemarkAttributes;
            resultsLayer.addRenderable(placemark);
        }

        // Initialize preview with the first item
        self.previewSelection(results[0]);
        // Display the preview dialog
        $('#previewDialog').modal();
        $('#previewDialog .modal-body-table').scrollTop(0);
    };

    // Center's the preview globe on the selection and sets the selected item.
    this.previewSelection = function (selection) {
        let latitude = parseFloat(selection.lat),
            longitude = parseFloat(selection.lon),
            location = new WorldWind.Location(latitude, longitude);
        // Update our observable holding the selected location
        self.selected(location);
        // Go to the posiion
        self.previewGlobe.wwd.goTo(location);
    };

    // Centers the primary globe on the selected item
    this.gotoSelected = function () {
        // Go to the location held in the selected observable
        primaryGlobe.wwd.goTo(self.selected());
    };
}
```

### Bind the Search Box

Replace the existing Search Box `<div/>` in the Navbar with this block, which 
includes a data-binding to the `searchText` observable in the view model, and 
also a data-binding for click a handler to the `performSearch` function.

```html
<div id="search" class="form-inline">
  <input id="searchText" class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search" 
    data-bind="value: searchText, valueUpdate: 'keyup'">
  <button id="searchButton" class="btn btn-outline-success" data-bind="click: $root.performSearch">
                <span class="fas fa-search" aria-hidden="true"></span>
            </button>
</div>
```

### Show the Results in the Preview Dialog

Now we will a `<canvas/>` for the preview globe and a `<table/>` to preview the 
results. The table rows are populated from an observable array via a Knockout 
[view template](http://knockoutjs.com/documentation/template-binding.html) 
contained in a `<script/>`


In the web page, replace the Search Preview Dialog with this version which 
includes the data-bindings for the table row data and the click event handlers:

```html
<div id="preview" class="hidden">
  <div id="previewDialog" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Search Results</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                              </button>
        </div>
        <div class="modal-body">
          <div class="modal-body-canvas pb-3" title="Preview">
            <canvas id="preview-canvas" style="width: 100%; height: 100%;">
  <h1>Your browser does not support HTML5 Canvas.</h1>
</canvas>
          </div>
          <div class="modal-body-table">
            <div class="alert alert-warning alert-dismissible fade show" role="alert" data-bind="visible: showApiWarning">
              MapQuest API key missing. Get a free key at
              <a href="https://developer.mapquest.com/" class="alert-link" target="_blank">developer.mapquest.com</a> and set the MAPQUEST_API_KEY variable to your key.
              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
  </button>
            </div>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Type</th>
                </tr>
              </thead>
              <tbody data-bind="template: { name: 'search-results-template', foreach: searchResults}"></tbody>
            </table>
            <script type="text/html" id="search-results-template">
              <tr data-bind="click: $parent.previewSelection">
                <td><span data-bind="text: $data.display_name"></span></td>
                <td><span data-bind="text: $data.type"></span></td>
              </tr>
            </script>
          </div>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-dismiss="modal" data-bind="enable: selected, click: gotoSelected">Go to</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</div>
```

Now we need to bind our view models to their views.

Add this code to the list of view models being created in app.js.
```javascript
let preview = new PreviewViewModel(globe);
let search = new SearchViewModel(globe, preview.previewResults);
```

Also this code to the list of view and view model bindings in app.js.
```javascript
ko.applyBindings(search, document.getElementById('search'));
ko.applyBindings(preview, document.getElementById('preview'));
```

## Summary

Now you have a web app with a functioning globe, navigation, layer management and
a place search feature 

Here's what we accomplished:

- Added 2D projections to the Globe class
- Coupled a view model to the search box to get the search critera
- Created a view model to capture the search results and couple them to a modal dialog
- Implemented search for place names and addresses using MapQuest's Nominatim.
- Previewed search result locations on a 2D map/globe with placemarks
- Go to selected locations on the preview globe and primary globe.

Here's the complete code for lesson 3: a web app with layer management.

<iframe width="100%" height="700" src="//jsfiddle.net/emxsys/fn4bhbuf/embedded/" allowpaymentrequest allowfullscreen="allowfullscreen" frameborder="0"></iframe>

---

### Next Steps:
- [Home](index.md) 
