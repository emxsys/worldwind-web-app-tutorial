# How to Build a WorldWind Web App

## Lesson 3: Layer Management with Knockout
- Use Knockout to display model data in views
- Configure WorldWind layers and layer categories
- Enable and disable layers
- Configure WMS/WMTS layers

In a hurry? View the completed code: [Lesson 3](https://jsfiddle.net/emxsys/sggs24bL/)

### Include the Knockout library

Knockout provides a mechanism for displaying model data (e.g., layers) in 
views (e.g., the layer panel HTML). You put _observable_ model data into 
in simple _view-model_ objects which are _bound_ to the HTML views.  
When the view-model data changes, your UI automatically changes.

This is known as _model-view-view model_ (MVVM) pattern. 

We will use a Knockout library hosted on a CDN. Add this line of code to the 
list of JavaScript scripts at the bottom of your web page:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.2/knockout-min.js"></script>
```

### Add Layer Management to the Globe class


### Create a View Model for Layers


### Show the Layers in the Panel Views


## Summary

<iframe width="100%" height="500" src="//jsfiddle.net/emxsys/sggs24bL/embedded/" allowpaymentrequest allowfullscreen="allowfullscreen" frameborder="0"></iframe>

---

### Next Steps
- [Home](index.md) 
- [Prev: Lesson 2 - WorldWind Globe](lesson-2.md) 
- [Next: Lesson 4 - Geocoding](lesson-4.md)