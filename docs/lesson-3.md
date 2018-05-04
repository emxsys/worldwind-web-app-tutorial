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

In `Globe`'s constructor, add a categoryTimestamps property that maps categories 
to observable timestamps.
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
to toggled the `enabled` property of the layers. Note that toggling a layer
will invoke `updateCategoryTimestamp`.  Also note how our method enforces
a rule that only allows one 'base' layer to be enabled at a time.

```javascript
/**
 * Toggles the enabled state of the given layer and updates the layer
 * catetory timestamp. Applies a rule to the 'base' layers the ensures
 * only one base layer is enabled.
 * @param {WorldWind.Layer} layer
 */
toggleLayer(layer) {
    // Apply rule: only one "base" layer can be enabled at a time
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
Copy/paste this code to the end of our `Globe.addLayers` method

```javascript
// Signal that this layer category has changed
this.getCategoryTimestamp(layer.category);
```

### Create a view models for Layers and Settings


### Show the Layers in the Panel Views


## Summary

<iframe width="100%" height="500" src="//jsfiddle.net/emxsys/sggs24bL/embedded/" allowpaymentrequest allowfullscreen="allowfullscreen" frameborder="0"></iframe>

---

### Next Steps
- [Home](index.md) 
- [Prev: Lesson 2 - WorldWind Globe](lesson-2.md) 
- [Next: Lesson 4 - Geocoding](lesson-4.md)