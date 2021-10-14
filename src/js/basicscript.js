(() => {
    require([
        "esri/config",
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/widgets/Editor",
        "esri/layers/GraphicsLayer",
        "esri/widgets/Sketch",
        "esri/widgets/Search",
    ],
        function (esriConfig, Map, MapView, FeatureLayer, Editor, GraphicsLayer, Sketch, Search) {


            esriConfig.apiKey = "AAPKd9159fee5d4f444092f9bf7e303e03f6YQJR0K3kHLezR2G951W_IyzwufRn2t7mUsh7_rU8HGO1oCMPG9gga61jSRkZcU0Q";

            const map = new Map({
                basemap: "arcgis-topographic" // Basemap layer service
                // basemap: "arcgis-terrain" // Basemap layer service
                // , layers: [ graphicsLayer ]
            });

            const view = new MapView({
                map: map,
                center: [90.39024841002772, 23.75789916914751], // Longitude, latitude
                zoom: 16, // Zoom level
                container: "viewDiv" // Div element
            });

        

        });
})();