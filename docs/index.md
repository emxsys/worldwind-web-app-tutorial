# How to Build a WorldWind Web App

This tutorial shows you how to build a [WorldWind](https://worldwind.arc.nasa.gov/web/) web app
using [Bootstrap](https://getbootstrap.com/docs/4.0/getting-started/introduction/) and 
[Knockout](http://knockoutjs.com/index.html). You will build a feature-rich, responsive, 
customizable web app ready to be deployed to your site. This tutorial demonstrates:

- Initializing WorldWind with 3D globes and/or 2D maps
- Configuring and managing layers and settings
- Place name searches and geocoding
- Creating placemarks
- Going to locations
- Multi-globe support

Are you interested WorldWind web app using [React](https://reactjs.org)? Look here: [WorldWind React](https://github.com/emxsys/worldwind-react-app).

## Quick Start

Do you want to start developing right away? 

- Download the documentation and the completed web app: [Complete Source](https://github.com/emxsys/worldwind-web-app-tutorial/archive/master.zip)
- View the completed tutorial: [Final Result](https://jsfiddle.net/emxsys/e0a2z1km/)

Do you want to skip ahead to a particular subject: 

- [Lesson 1: HTML with Bootstrap](#lesson-1-html-with-boostrap) 
- [Lesson 2: WorldWind Globe](#lesson-2-worldwind-globe) 
- [Lesson 3: Layer Management with Knockout](#lesson-2-layer-management-with-knockout) 
- [Lesson 4: Place Search and Geocoding](#lesson-4-place-search-and-geocoding)

---

## Lesson 1: HTML with Bootstrap

- Create a responsive web app template for mobiles, tablets and desktops.
- Menus and panels for displaying content.
- Customizable, themes, CSS

### Prerequisites

Create the files for a basic web app in your favorite IDE or editor.

- index.html
- custom.css
- app.js

If you want to start with a Bootstrap example, you can download this template: 
[Bootstrap Starter Template](https://getbootstrap.com/docs/4.0/examples/starter-template/)

---

### Dependencies 

We're going to add the CDN links for the Bootstrap and Font Awesome CSS, plus
a link to our **custom.css** file. Also, we're adding the JavaScript CDN links 
for BootStrap and JQuery, plus our **app.js** file. 

Copy/paste the following HTML into your web page.

###### HTML
```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <title>WorldWind Starter Template</title>

        <!-- Bootstrap 4.0 CSS compiled and minified -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
              integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

        <!-- Font Awesome icons (see: https://fontawesome.com/icons?d=gallery) -->
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.10/css/all.css" 
              integrity="sha384-+d0P83n9kaQMCwj8F4RJB66tzIwOKmrdb46+porD/OvrJ+37WqIM7UoBtwHO6Nlg" crossorigin="anonymous">

        <!-- Custom styles and overrides -->
        <link href="custom.css" rel="stylesheet">
    </head>
    <body>

        <!-- JavaScript is placed at the end of the document so the page loads faster -->
        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>    
        <script src="app.js"></script>    
    </body
</html>
```
 
The `<meta>` elements above are important for Bootstrap and must be included. 
You can add other `<meta>` elements like author, description, etc. Feel fee to 
edit the `<title>`.

---

### NavBar: The Main Menu

Our web app uses a Bootstrap [Navbar](https://getbootstrap.com/docs/4.0/components/navbar/) 
component to create the main menu at the top of the page. The Navbar is responsive: 
it automatically adjusts its layout based on the page width. We'll go ahead add 
menu items all for the features that we will implement, including:

- Layer panel for managing the layers displayed on the globe
- Makers panel for managing markers placed on the globe
- Settings panel for configuring the WorldWind globe
- Search box for place name searches and geocoding

Copy the following block of HTML and paste it at the beginning of your page's `<body/>`
section:

###### HTML
```html
<nav class="navbar navbar-expand-md fixed-top navbar-dark bg-dark">

  <!--Branding icon and text-->
  <a class="navbar-brand" href="https://worldwind.arc.nasa.gov/web target=_blank">
    <img src="images/nasa-logo_32.png" width="30" height="30" class="d-inline-block align-top" alt="">
    WorldWind
  </a>

  <!--Hamburger menu displayed on small screens/windows-->
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-menu" aria-controls="main-menu" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <!--Main menu content-->
  <div class="collapse navbar-collapse" id="main-menu">
    <ul class="navbar-nav mr-auto">
      <!--Layers-->
      <li class="nav-item">
        <a class="nav-link" data-toggle="collapse" href="#layers" role="button">
                <span class="fas fa-list" aria-hidden="true"></span>
                <span class="d-md-none d-lg-inline" aria-hidden="true">Layers</span>
        </a>
      </li>
      <!--Markers-->
      <li class="nav-item">
        <a class="nav-link" data-toggle="collapse" href="#markers" role="button">
                <span class="fas fa-map-marker-alt" aria-hidden="true"></span>
                <span class="d-md-none d-lg-inline" aria-hidden="true">Markers</span>
        </a>
      </li>
      <!--Settings-->
      <li class="nav-item">
        <a class="nav-link" data-toggle="collapse" href="#settings" role="button">
                <span class="fas fa-cog" aria-hidden="true"></span>
                <span class="d-md-none d-lg-inline" aria-hidden="true">Settings</span>
        </a>
      </li>
    </ul>
    <!--Search Box-->
    <div class="form-inline">
      <input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">
      <button class="btn btn-outline-success" data-toggle="modal" data-target="#preview">
            <span class="fas fa-search" aria-hidden="true"></span>
        </button>
    </div>
  </div>
</nav>
```

At this point you have a basic menu system. It doesn't do much yet, but it is
responsive. Check it out by opening the web page in your browser and then resize 
the browser and watch how the menu responds. Also open your browser's development 
tools and try out the page using the mobile emulation settings.

Feel free to change the branding text and link from _WorldWind_ to something
else. Also, you can also replace the `.navbar-dark` and `.bg-dark` with 
alternatives to change the style. The `.navbar-dark` and `.navbar-light` classes
control the Navbar's text color and the `.bg-*` classes control the Navbar's 
[background colors](https://getbootstrap.com/docs/4.0/utilities/colors/#background-color).

---

### Main Content

Now we'll add the elements that will host the globe, the layers, markers and 
settings panels, and and the search preview modal. These elements won't have 
much to display at this stage, but they will be wired up to the menu system.

Copy the following block of HTML and paste it the below the closing `<nav/>` 
element. 

###### HTML
```html
<!-- Use container-fluid for 100% width and set padding to 0 -->
<main role="main" class="container-fluid p-0">
  <!-- Globe -->
  <div id="globe" class="worldwindow">
    <!--.d-block ensures the size is correct (prevents a scrollbar from appearing)-->
    <canvas id="globe-canvas" class="d-block"
            style="width: 100%; height: 100%; 
            background-color: rgb(36,74,101);">
        Try Chrome or FireFox.
    </canvas>   
  </div>

  <!--Panels-->
  <div class="worldwindow-overlay noninteractive w-100">
    <div class="card-columns">
      <!--Layers-->
      <div class="collapse" id="layers">
        <div class="card globe-card interactive">
          <div class="card-header">
            <h5 class="card-title">
              <span class="fas fa-list" aria-hidden="true"></span> Layers
              <button type="button" class="close pull-right" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button></h5>
          </div>
          <div class="card-body">
            <p class="card-text">Marker list goes here.</p>
          </div>
        </div>
      </div>
      <!--Markers-->
      <div class="collapse" id="markers">
        <div class="card globe-card interactive">
          <div class="card-header">
            <h5 class="card-title">
              <span class="fas fa-map-marker-alt" aria-hidden="true"></span> Markers
              <button type="button" class="close pull-right" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button></h5>
          </div>
          <div class="card-body">
            <p class="card-text">Marker list goes here.</p>
          </div>
        </div>
      </div>
      <!--Settings-->
      <div class="collapse" id="settings">
        <div class="card globe-card interactive">
          <div class="card-header">
            <h5 class="card-title">
              <span class="fas fa-cog" aria-hidden="true"></span> Settings
              <button type="button" class="close pull-right" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button></h5>
          </div>
          <div class="card-body">
            <p class="card-text">Settings go here.</p>
          </div>
        </div>
      </div>
    </div>

    <!--Search Preview Dialog-->
    <div id="preview" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Search Results</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
          </div>
          <div class="modal-body">
            <p>
              Search result go here
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal">Go to</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>
    </div>
</main>
```

Also copy/paste the following CSS into the custom.css file. This CSS adds some 
padding to the top of the `body` element so that children do not display under the 
Navbar. It also defines some custom CSS classes.

###### CSS
```css
body {
  /*Account for the height of the navbar component*/
  padding-top: 3.5rem;
}

.worldwindow {
  width: 100%;
  height: calc(100vh - 3.5rem);
  background-color: black;
}

.worldwindow-overlay {
  position: absolute;
  width: 100%;
  top: 3.5rem;
}

.noninteractive {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  pointer-events: none;
}

.interactive {
  -webkit-touch-callout: auto !important;
  -webkit-user-select: auto !important;
  -khtml-user-select: auto !important;
  -moz-user-select: auto !important;
  -ms-user-select: auto !important;
  -o-user-select: auto !important;
  pointer-events: auto !important;
}

```

Finally, copy/past the following JavaScript into your app.js file. This code
adds an event handler make the main menu easier to work with on small screens,
and it adds a handler that closes panels when their close icon is clicked.

###### JavaScript
```javascript
$(document).ready(function() {
  "use strict";

  // Auto-collapse the main menu when its button items are clicked
  $('.navbar-collapse a[role="button"]').click(function() {
    $('.navbar-collapse').collapse('hide');
  });
  // Collapse card ancestors when the close icon is clicked
  $('.collapse .close').on('click', function() {
    $(this).closest('.collapse').collapse('hide');
  });
});
```
---

#### Summary

At this stage you have a functioning prototype of the web app. The menu system is
functional and responsive:

- The Layers, Markers and Settings buttons open their respective panels
- The Search button opens the Preview modal dialog
- The `<canvas/>` element for the globe that is the full width of the page with
with a background color 
- The branding text opens a link to an external page

##### Lession 1 Code

Here's the complete code for lesson 1: A web app prototype sans globe.

<iframe id="lesson-1-code" width="100%" height="300" src="//jsfiddle.net/emxsys/wun3zg0c/embedded/" allowpaymentrequest allowfullscreen="allowfullscreen" frameborder="0"></iframe>

Following are some explanations of the components used in the HTML. If you're not
interested you can skip ahead to [Lesson 2](#lesson-2-worldwind-globe).

##### Full Width and Padding
The `<main/>` element, above, hosts main content of our web app. We want the 
element to be the full width of the page so we apply the Bootstrap `.container-fluid` 
class (versus `.container`) to the element. We also also override Bootstrap's 
default padding around the element by setting the padding to zero via `.p-0`, 
part of Bootstrap's [spacing utilities](https://getbootstrap.com/docs/4.0/utilities/spacing/). 
You can experiment with other padding options.


##### Cards: Panels for layers and settings

We'll use Bootstrap [Card](https://getbootstrap.com/docs/4.0/components/card/) 
components to host the WorldWind layers and settings content. Bootstrap includes 
a few options for laying out a series of cards. We'll use Masonry-like columns 
by wrapping them in `.card-columns`.


---


## Lesson 2: WorldWind Globe 
- Add WorldWind library to HTML
- Create a Globe class to encapsulate the WorldWindow object
- Add a globe to the application
- Add layers to the globe

### Add the WorldWind library

Add this code to the list of JavaScript script elements at the bottom of the 
web page:

```html
<script src="https://files.worldwind.arc.nasa.gov/artifactory/web/0.9.0/worldwind.min.js"></script>
```
---

### Create the Globe class

Now we will create a Globe class to encapsulate the 
[WorldWindow](https://nasaworldwind.github.io/WebWorldWind/WorldWindow.html) 
object (wwd). You create a globe and it's underlying `WorldWindow` like this:
```javascript
  let globe = new Globe("globe-canvas");
```

In our web app we will be using layer _categories_ to act on subsets of the
`WorldWindow.layers`. We add layers to the `WorldWindow` via the `Globe.addLayer` 
function to assign a category and to update the layer's properties via a 
convenient _options_ object.
 
Copy the following block of JavaScript to the __app.js__ file.

###### JavaScript
```javascript
/**
 * The Globe encapsulates the WorldWindow object (wwd) and provides application
 * specific logic for interacting with layers.
 * @param {String} canvasId The ID of the canvas element that will host the globe
 * @returns {Globe}
 */
class Globe {
  constructor(canvasId) {
    // Create a WorldWindow globe on the specified HTML5 canvas
    this.wwd = new WorldWind.WorldWindow(canvasId);

    // Holds the next unique id to be assigned to a layer
    this.nextLayerId = 1;

    // Add a BMNGOneImageLayer background layer. We're overriding the default 
    // minimum altitude of the BMNGOneImageLayer so this layer always available.
    this.addLayer(new WorldWind.BMNGOneImageLayer(), {
      category: "background",
      minActiveAltitude: 0
    });
  }

  /**
   * Adds a layer to the globe. Applies the optional options' properties to the
   * layer, and assigns the layer a unique ID and category.
   * @param {WorldWind.Layer} layer
   * @param {Object|null} options E.g., {category: "base", enabled: true}
   */
  addLayer(layer, options) {
    // Copy all properties defined on the options object to the layer
    if (options) {
      for (let prop in options) {
        if (!options.hasOwnProperty(prop)) {
          continue; // skip inherited props
        }
        layer[prop] = options[prop];
      }
    }
    // Assign a default category property if not already assigned
    if (typeof layer.category === 'undefined') {
      layer.category = 'overlay'; // the default category
    }

    // Assign a unique layer ID to ease layer management 
    layer.uniqueId = this.nextLayerId++;

    // Add the layer to the globe
    this.wwd.addLayer(layer);
  }

    /**
     * Returns a new array of layers in the given category.
     * @param {String} category E.g., "base", "overlay" or "setting".
     * @returns {Array}
     */
  getLayers(category) {
    return this.wwd.layers.filter(layer => layer.category === category);
  }
}
```
---

### Create the Globe and Add Layers

Now we will create a `Globe` object and add some layers to the globe. Some of the 
WorldWind layers require a `WorldWindow` object in their constructors (globe.wwd).
This is one of the few cases where we access the `wwd` property outside of the 
`Globe` class.

Copy this block of JavaScript code the __app.js__ file and paste it below the
Globe class declaration.

###### JavaScript

```javascript
  // Create a globe
  let globe = new Globe("globe-canvas");
  // Add layers to the globe 
  globe.addLayer(new WorldWind.BMNGLayer(), {
    category: "base"
  });
  globe.addLayer(new WorldWind.CoordinatesDisplayLayer(globe.wwd), {
    category: "setting"
  });
  globe.addLayer(new WorldWind.ViewControlsLayer(globe.wwd), {
    category: "setting"
  });
  globe.addLayer(new WorldWind.CompassLayer(), {
    category: "setting",
  });
```
---

### Summary

At this stage you have a functioning globe in the web app that responds to mouse
and touch input.

- The `Globe` class encapsulates the `WorldWindow` and contains the application 
logic for managing layers. It creates a globe with a default _background_ layer.
- The `Globe.addLayer` function is used to add layers to the globe and set the
layer's category and other layer properties.

##### Lession 2 Code

Here's the complete code for lesson 2: A web app prototype with a functioning 
globe and layers.

<iframe id="lesson-2-code" width="100%" height="500" src="//jsfiddle.net/emxsys/7x6vcf78/embedded/" allowpaymentrequest allowfullscreen="allowfullscreen" frameborder="0"></iframe>

---

## Lesson 3: Layer Management with Knockout
- Configure layers and layer categories
- Enable and disable layers
- Configure WMS/WMTS layers



## Lesson 4: Place Search and Geocoding