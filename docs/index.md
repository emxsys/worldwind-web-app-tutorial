# How to Build a WorldWind Web App

In this tutorial, you will learn how to build WorldWind web app using 
Bootstrap and Knockout.  Upon completion you will have a feature-rich 
web application template ready for customization.

## Lesson 1: HTML with Bootstrap
- Responsive web app template for mobiles, tablets and desktops.
- Menus and panels for displaying content
- Customizable, themes, CSS

### Customizing the BootStrap 4 basic template
To start from scratch, you can download this template: [Bootstrap Starter Template](https://getbootstrap.com/docs/4.0/examples/starter-template/)


#### Dependencies 

In the `<head>` section of your web page, include the CSS for Bootstrap 4 and Font Awesome via CDNs.

```html
<!-- Bootstrap 4.0 CSS compiled and minified -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
      integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" 
      crossorigin="anonymous">

<!-- Font Awesome icons (see: https://fontawesome.com/icons?d=gallery) -->
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.10/css/all.css" 
      integrity="sha384-+d0P83n9kaQMCwj8F4RJB66tzIwOKmrdb46+porD/OvrJ+37WqIM7UoBtwHO6Nlg" 
      crossorigin="anonymous">

```

Just before the `</body>` tag, add the JavaScript dependencies for BootStrap and JQuery

```html
<!-- JavaScript is placed at the end of the document so the page loads faster -->
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>    
```

#### NavBar

Our web app will use a Bootstrap [Navbar](https://getbootstrap.com/docs/4.0/components/navbar/) component to render our main menu at the top of the page. The Navbar is responsive: it will automatically adjust its layout based on the page width.

The Navbar component is placed the beginning of the `<body>` element.

We'll add menu items for the features that we will implement in this tutorial, including:

- Layer panel for managing the layers displayed on the WorlWind globe
- Settings panel for configuring the WorldWind globe
- Search box for place name searches and geocoding

```html
    <!--Main Menu--> 
    <nav class="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
    
        <!--Branding icon and text-->
        <a class="navbar-brand" href="https://worldwind.arc.nasa.gov/web">
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
                <!--Settings-->
                <li class="nav-item">
                    <a class="nav-link" data-toggle="collapse" href="#markers" role="button">
                        <span class="fas fa-map-marker-alt" aria-hidden="true"></span>
                        <span class="d-md-none d-lg-inline" aria-hidden="true">Markers</span>
                    </a>
                </li>
            </ul>
            <!--Search Box-->
            <form class="form-inline">
                <input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">
                <button class="btn btn-outline-success" type="submit">
                    <span class="fas fa-search" aria-hidden="true"></span>
                </button>
            </form>
        </div>
    </nav>

```


## Lesson 2: WorldWind Globe 
- Add a globe to the application
- Add elemental layers

## Lesson 3: Layer Management
- Configure layers and layer categories
- Enable and disable layers
- Configure WMS/WMTS layers

## Lesson 4: Geocoding