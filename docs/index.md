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

### Dependencies 

We're going to add the CDN links for the Bootstrap and Font Awesome CSS, plus
a link to our **custom.css** file. Also, we're adding the JavaScript CDN links 
for BootStrap and JQuery, plus our **app.js** file. 

Edit the of your web page so that it looks like the following HTML:

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
 
Feel edit the `<title>`. The `<meta>` elements above are important for Bootstrap and 
must be included. You can add other `<meta>` elements like author, description, etc. 


### NavBar: Main menu

Our web app uses a Bootstrap [Navbar](https://getbootstrap.com/docs/4.0/components/navbar/) 
component to render the main menu at the top of the page. The Navbar is responsive: 
it automatically adjusts its layout based on the page width.

The Navbar component is placed the beginning of the `<body>` element.

We'll add menu items for the features that we will implement in this tutorial, including:

- Layer panel for managing the layers displayed on the globe
- Makers panel for managing markers placed on the globe
- Settings panel for configuring the WorldWind globe
- Search box for place name searches and geocoding

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
    <form class="form-inline">
      <input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">
      <button class="btn btn-outline-success">
            <span class="fas fa-search" aria-hidden="true"></span>
      </button>
    </form>
  </div>
</nav>
```

At this point you have a basic menu system. It doesn't do much yet, but it is
responsive. Opent the web page in your browser and experiment with different 
page sizes.  Also open your browser's development tools and try out the page
using the mobile emulation settings.

### Main element

The `<main/>` element will host main content of our web app: the globe and other 
content. In this tutorial, we want the element to be the full width of the page 
so we apply the Bootstrap `container-fluid` class to the element. The `container` 
element used in many Bootstrap templates constrains the width.

We also override Bootstrap's default padding around the element via Bootstrap's 
[spacing utilities](https://getbootstrap.com/docs/4.0/utilities/spacing/). 
We use `p-0` which sets the padding to zero. You can experiment with other padding 
options.

```html
<!-- Use container-fluid for 100% width and set padding to 0 -->
<main role="main" class="container-fluid p-0">
  <!-- WorldWindow -->
  <div id="globe" class="worldwindow p-0">
  </div>

  <!--WorldWindow overlays-->
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
    <div id="preview" class="hidden">
    </div>
</main>
```

To make layout easier, we add some padding to the top of the `body` element so that children do not slide 
under the Navbar.

```css
body {
    /*Account for the height of the navbar component*/
    padding-top: 3.5rem;
}
```


### Cards: Panels for layers and settings

We'll use Bootstrap [Card](https://getbootstrap.com/docs/4.0/components/card/) components 
to host the WorldWind layers and settings content. Bootstrap includes a few options for 
laying out a series of cards. We'll use Masonry-like columns by wrapping them in `.card-columns`.

---


## Lesson 2: WorldWind Globe 
- Add a globe to the application
- Add elemental layers

## Lesson 3: Layer Management
- Configure layers and layer categories
- Enable and disable layers
- Configure WMS/WMTS layers

## Lesson 4: Geocoding