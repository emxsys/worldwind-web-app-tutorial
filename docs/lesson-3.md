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

### Make changes to the Globe's layers observable

In our web app we want to know if a change occurs within a layer category.  When
a change occurs we will update a timestamp for the category. We will use a 
Knockout [observable](http://knockoutjs.com/documentation/observables.html)
to signal a change to any subscribers (e.g., the layers view-model).

In our `Globe`'s constructor, add a categoryTimestamps property that maps 
categories to observable timestamps.
```javascript
// Holds a map of category and observable timestamp pairs
this.categoryTimestamps = new Map();
```

Add the following two methods to our `Globe` that operate on the 
`categoryTimestamps` property.

```javascript
/**
 * Returns an observable containing the last update timestamp for the category.
 * @param {String} category
 * @returns {Observable} 
 */
getCategoryTimestamp(category) {
  if (!this.categoryTimestamps.has(category)) {
    this.categoryTimestamps.set(category, ko.observable());
  }
  return this.categoryTimestamps.get(category);
}
```

```javascript
/**
 * Updates the timestamp for the given category.
 * @param {String} category
 */
updateCategoryTimestamp(category) {
  let timestamp = this.getCategoryTimestamp(category);
  timestamp(new Date());
}
```

Also add the following `toggleLayer` method that will be used by the view models
to toggle the `enabled` property of a layer. Note that toggling a layer
will invoke `updateCategoryTimestamp`.  Also note how our method enforces
an application rule that only allows one 'base' layer to be enabled at a time.

```javascript
/**
 * Toggles the enabled state of the given layer and updates the layer
 * catetory timestamp. Applies a rule to the 'base' layers the ensures
 * only one base layer is enabled.
 * @param {WorldWind.Layer} layer
 */
toggleLayer(layer) {

    // Multiplicity Rule: only [0..1] "base" layers can be enabled at a time
    if (layer.category === 'base') {
        this.wwd.layers.forEach(function (item) {
            if (item.category === 'base' && item !== layer) {
                item.enabled = false;
            }
        });
    }
    // Toggle the selected layer's visibility
    layer.enabled = !layer.enabled;
    // Trigger a redraw so the globe shows the new layer state ASAP
    this.wwd.redraw();

    // Signal a change in the category
    this.updateCategoryTimestamp(layer.category);
}
```

And finally, we need to update the category timestamps when we add a layer. 
Copy/paste this code to the end of our `Globe.addLayers` method:

```javascript
// Signal that this layer category has changed
this.getCategoryTimestamp(layer.category);
```

### Create a view models for Layers and Settings

Now we will create a view model for the layers. Our view model will have two
[observable arrays](http://knockoutjs.com/documentation/observableArrays.html) 
whose contents are displayed in the Layers panel: one for the base layers and the
other for overlays. Our view model will _subscribe_ to the globe's 
`categoryTimestamp` observables. When a change occurs in a layer category, the
view model with update the corresponding observable array, which will automatically
update the view.

Add the following JavaScript code to app.js below the `Globe` class.

```javascript
/**
 * View model for the layers panel.
 * @param {Globe} globe - Our globe object
 */
function LayersViewModel(globe) {
  var self = this;
  self.baseLayers = ko.observableArray(globe.getLayers('base').reverse());
  self.overlayLayers = ko.observableArray(globe.getLayers('overlay').reverse());

  // Update the view model whenever the model changes
  globe.getCategoryTimestamp('base').subscribe(newValue =>
    self.loadLayers(globe.getLayers('base'), self.baseLayers));

  globe.getCategoryTimestamp('overlay').subscribe(newValue =>
    self.loadLayers(globe.getLayers('overlay'), self.overlayLayers));

  // Utility to load the layers in reverse order to show last rendered on top
  self.loadLayers = function(layers, observableArray) {
    observableArray.removeAll();
    layers.reverse().forEach(layer => observableArray.push(layer));
  };

  // Click event handler for the layer panel's buttons
  self.toggleLayer = function(layer) {
    globe.toggleLayer(layer);
  };
}
```

We will also create a view model for the settings. Layers within the _setting_
category will be displayed and managed by the Settings panel. The same principles
described for the layers view model apply here as well.

Add the following JavaScript code to app.js below the `LayersViewModel`.

```javascript
/**
 * View model for the settings.
 * @param {Globe} globe - Our globe object (not a WorldWind.Globe)
 */
function SettingsViewModel(globe) {
  var self = this;
  self.settingLayers = ko.observableArray(globe.getLayers('setting').reverse());

  // Update the view model whenever the model changes
  globe.getCategoryTimestamp('setting').subscribe(newValue =>
    self.loadLayers(globe.getLayers('setting'), self.settingLayers));

  // Utility to load layers in reverse order 
  self.loadLayers = function(layers, observableArray) {
    observableArray.removeAll();
    layers.reverse().forEach(layer => observableArray.push(layer));
  };

  // Click event handler for the setting panel's buttons
  self.toggleLayer = function(layer) {
    globe.toggleLayer(layer);
  };
}
```


### Show the Layers in the Panel Views

Now we will create a render buttons for all the layers in an observable array via
Knockout [view template](http://knockoutjs.com/documentation/template-binding.html).

Add the following script to the web page. Place it close to the elements that will
use it, like between the `.worldwind-overlay` `<div/>` and the search `#preview` `<div/>`.

```html
<!--Layer List Template-->
<script type="text/html" id="layer-list-template">
  <button type="button" class="list-group-item list-group-item-action" 
    data-bind="click: $root.toggleLayer, css: { active: $data.enabled }">
      <span data-bind="text: $data.displayName"></span>
  </button>
</script>
```

Now we will reference the "layer-list-template" in the Layers and Settings panels.
In the Layers panel, replace the `.card-body` `<div/>` contents with this HTML:

```html
<div class="list-group" data-bind="template: { name: 'layer-list-template', foreach: overlayLayers}"></div>
<hr/>
<div class="list-group" data-bind="template: { name: 'layer-list-template', foreach: baseLayers}"></div>
```
In the Settings panel, replace the `.card-body` `<div/>` contents with this HTML:

```html
<div class="list-group" data-bind="template: { name: 'layer-list-template', foreach: settingLayers}"></div>
```

### Bind the Views to the View Models


## Summary

<iframe width="100%" height="500" src="//jsfiddle.net/emxsys/sggs24bL/embedded/" allowpaymentrequest allowfullscreen="allowfullscreen" frameborder="0"></iframe>

---

### Next Steps
- [Home](index.md) 
- [Prev: Lesson 2 - WorldWind Globe](lesson-2.md) 
- [Next: Lesson 4 - Geocoding](lesson-4.md)