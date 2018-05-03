$(document).ready(function () {
    "use strict";

    // Set your Bing Maps key to use when requesting Bing Maps resources.
    // Without your own key you will be using a limited WorldWind developer's key.
    // See: https://www.bingmapsportal.com/ to register for your own key and then enter it below
    const BING_API_KEY = "";

    // Set the MapQuest API key used for the Nominatim service.
    // Get your own key at https://developer.mapquest.com/
    // Without your own key you will be using a limited WorldWind developer's key.
    const MAPQUEST_API_KEY = "";

    /**
     * The Globe encapulates the WorldWindow object (wwd) and provides application
     * specific logic for interacting with layers.
     * @param {String} canvasId
     * @param {String|null} projectionName
     * @returns {Globe}
     */
    class Globe {
        constructor(canvasId, projectionName) {
            // Create a WorldWindow globe on the specified HTML5 canvas
            this.wwd = new WorldWind.WorldWindow(canvasId);
            // Projection support
            this.roundGlobe = this.wwd.globe;
            this.flatGlobe = null;
            if (projectionName) {
                this.changeProjection(projectionName);
            }
            // Observables
            this.baseLayersLastUpdate = ko.observable(new Date());
            this.overlayLayersLastUpdate = ko.observable(new Date());
            this.settingLayersLastUpdate = ko.observable(new Date());
            // Add a BMNGOneImageLayer background layer. We're overriding the default 
            // minimum altitude of the BMNGOneImageLayer so this layer always available.
            this.addLayer(new WorldWind.BMNGOneImageLayer(), {category: "background", minActiveAltitude: 0});
        }

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

        getLayers(category) {
            return this.wwd.layers.filter(layer => layer.category === category);
        }

        /**
         * Add a layer to the globe and applies options object properties to the 
         * the layer.
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
            // Assign a category property for layer management 
            if (typeof layer.category === 'undefined') {
                layer.category = 'overlay'; // default category
            }

            // Assign a unique layer ID to ease layer management 
            layer.uniqueId = this.nextLayerId++;

            // Add the layer to the globe
            this.wwd.addLayer(layer);

            // Notify observers of a change
            this.updateLayers(layer.category);
        }

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

            // Notify observers of a change
            this.updateLayers(layer.category);
        }

        updateLayers(category) {
            const timestamp = new Date();
            switch (category) {
                case 'base':
                    this.baseLayersLastUpdate(timestamp);
                    break;
                case 'overlay':
                    this.overlayLayersLastUpdate(timestamp);
                    break;
                case 'setting':
                    this.settingLayersLastUpdate(timestamp);
                    break;
                default:
            }
        }
    }

    function LayersViewModel(globe) {
        var self = this;
        self.globe = globe;
        self.baseLayers = ko.observableArray(globe.getLayers('base').reverse());
        self.overlayLayers = ko.observableArray(globe.getLayers('overlay').reverse());

        // Update the view model whenever the model changes
        globe.baseLayersLastUpdate.subscribe(lastUpdated =>
            self.loadLayers(globe.getLayers('base'), self.baseLayers));
        globe.overlayLayersLastUpdate.subscribe(lastUpdated =>
            self.loadLayers(globe.getLayers('overlay'), self.overlayLayers));

        self.loadLayers = function (layers, observableArray) {
            observableArray.removeAll();
            layers.reverse().forEach(layer => observableArray.push(layer));
        };

        self.toggleLayer = function (layer) {
            self.globe.toggleLayer(layer);
        };

    }

    function SettingsViewModel(globe) {
        var self = this;
        self.globe = globe;
        self.settingLayers = ko.observableArray(globe.getLayers('setting').reverse());

        // Update the view model whenever the model changes
        globe.settingLayersLastUpdate.subscribe(lastUpdated =>
            self.loadLayers(globe.getLayers('setting'), self.settingLayers));

        self.loadLayers = function (layers, observableArray) {
            observableArray.removeAll();
            layers.reverse().forEach(layer => observableArray.push(layer));
        };

        self.toggleLayer = function (layer) {
            self.globe.toggleLayer(layer);
        };
    }

    /**
     * Define the view model for the Search. Uses the MapQuest Nominatim API. 
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
                    globe.goTo(new WorldWind.Location(latitude, longitude));
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

    /**
     * Define the view model for the Search Preview.
     * @param {WorldWindow} primaryGlobe
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
        this.previewSelection = function (selection) {
            let latitude = parseFloat(selection.lat),
                longitude = parseFloat(selection.lon),
                location = new WorldWind.Location(latitude, longitude);
            // Update our observable holding the selected location
            self.selected(location);
            // Go to the posiion
            self.previewGlobe.wwd.goTo(location);
        };
        this.gotoSelected = function () {
            // Go to the location held in the selected observable
            primaryGlobe.wwd.goTo(self.selected());
        };
    }

    // ---------------------
    // Construct our web app
    // ----------------------

    // Initialize WorldWind properties before creating the first WorldWindow
    if (BING_API_KEY === null || BING_API_KEY === "") {
        // Warning: using a limited WorldWind developer's key for Bing resources.
    } else {
        WorldWind.BingMapsKey = BING_API_KEY;
    }

    // Create the primary globe
    let globe = new Globe("globe-canvas");
    // Add layers ordered by drawing order: first to last
    globe.addLayer(new WorldWind.BMNGLayer(), {category: "base"});
    globe.addLayer(new WorldWind.BMNGLandsatLayer(), {category: "base", enabled: false});
    globe.addLayer(new WorldWind.BingAerialLayer(), {category: "base", enabled: false});
    globe.addLayer(new WorldWind.BingAerialWithLabelsLayer(), {category: "base", enabled: false, detailControl: 1.5});
    globe.addLayer(new WorldWind.BingRoadsLayer(), {category: "overlay", enabled: false, detailControl: 1.5, opacity: 0.75});
    globe.addLayer(new WorldWind.CoordinatesDisplayLayer(globe.wwd), {category: "setting"});
    globe.addLayer(new WorldWind.ViewControlsLayer(globe.wwd), {category: "setting"});
    globe.addLayer(new WorldWind.CompassLayer(), {category: "setting", enabled: false});

    // Activate the Knockout bindings between our view models and the html
    this.layers = new LayersViewModel(globe);
    this.settings = new SettingsViewModel(globe);
    this.preview = new PreviewViewModel(globe);
    this.search = new SearchViewModel(globe, this.preview.previewResults);
    ko.applyBindings(this.search, document.getElementById('search'));
    ko.applyBindings(this.preview, document.getElementById('preview'));
    ko.applyBindings(this.layers, document.getElementById('layers'));
    ko.applyBindings(this.settings, document.getElementById('settings'));
    // Auto-collapse the main menu when its button items are clicked
    $('.navbar-collapse a[role="button"]').click(function () {
        $('.navbar-collapse').collapse('hide');
    });
    // Collapse card ancestors when the close icon is clicked
    $('.collapse .close').on('click', function () {
        $(this).closest('.collapse').collapse('hide');
    });
});