(() => {
    require([
        "esri/config",
        "esri/widgets/Sketch",
        "esri/Map",
        "esri/layers/GraphicsLayer",
        "esri/views/MapView",
        "dojo/dom", "dojo/on",
        "esri/tasks/GeometryService",
        "esri/geometry/Polyline",
        "esri/geometry/Polygon",
        "esri/geometry/geometryEngine",
        "esri/Graphic",
        "esri/layers/CSVLayer",
        "esri/widgets/Sketch/SketchViewModel"
    ],
        function (
            esriConfig,
            Sketch, Map, GraphicsLayer, MapView, dom, on, GeometryService,
            Polyline, Polygon, geometryEngine, Graphic, CSVLayer
            // , SketchViewModel
        ) {

            esriConfig.apiKey = "AAPKd9159fee5d4f444092f9bf7e303e03f6YQJR0K3kHLezR2G951W_IyzwufRn2t7mUsh7_rU8HGO1oCMPG9gga61jSRkZcU0Q";

            var graphicsLayer = new GraphicsLayer();

            // Create a text symbol for drawing the point
            const textKeySymbol = {
                type: "text", // autocasts as new TextSymbol()
                color: "#7A003C",
                text: "\ue656", // esri-icon-key
                font: {
                    // autocasts as new Font()
                    size: 20,
                    family: "CalciteWebCoreIcons"
                }
            };

            var polySymbol = {
                type: "simple-fill",  // autocasts as new SimpleFillSymbol()
                color: [0, 0, 0, 0.3],
                style: "solid",
                outline: {  // autocasts as new SimpleLineSymbol()
                    color: "red",
                    width: 1
                }
            }

            var polygonJson = {
                "rings": [
                    [32.59083117970399, -25.98132768275742],
                    [32.65539585982585, -25.905807602180165],
                    [32.56655981428797, -25.877162973906724],
                    [32.56601650102059, -25.917604711160223],
                    [32.53821570746876, -25.94774930370252]
                ],
                "spatialReference": { "wkid": 4326 },
                "type": "polygon"
            };
            var polygon = new Polygon(polygonJson);
            var polyGraphic = new Graphic({
                geometry: polygon,
                symbol: polySymbol
            })
            graphicsLayer.add(polyGraphic)
            var map = new Map({
                basemap: "topo-vector",
                // layers: [graphicsLayer]
            });

            const view = new MapView({
                container: "viewDiv",
                map: map,
                zoom: 12,
                center: [32.58455069470879, -25.93892584682388],
            });

            // var gl = new GraphicsLayer();
            view.when(() => {
                // console.log('do it');
                const sketch = new Sketch({
                    view: view,
                    layer: graphicsLayer,    
                    // pointSymbol: textKeySymbol,
                    // activeTool: "polygon"
                    updateOnGraphicClick: true
                });
                console.log('check ', sketch);
                view.ui.add(sketch, "top-right");

                sketch.on('update', (graphic) => {
                    // sketchViewModel.layer.remove(graphic);
                    // do something with the new graphic
                    console.log(graphic);
                });
            })

            // This function is called when user completes drawing a rectangle
            // on the map. Use the rectangle to select features in the layer and table
            function selectFeatures(geometry) {
                if (csvLayerView) {
                    // create a query and set its geometry parameter to the
                    // rectangle that was drawn on the view
                    const query = {
                        geometry: geometry,
                        outFields: ["*"]
                    };

                    // query graphics from the csv layer view. Geometry set for the query
                    // can be polygon for point features and only intersecting geometries are returned
                    csvLayerView.queryFeatures(query)
                        .then((results) => {
                            if (results.features.length === 0) {
                                clearSelection();
                            } else {
                                // pass in the query results to the table by calling its selectRows method.
                                // This will trigger FeatureTable's selection-change event
                                // where we will be setting the feature effect on the csv layer view
                                featureTable.filterGeometry = geometry;
                                featureTable.selectRows(results.features);
                            }
                        })
                        .catch(errorCallback);
                }
            }


        });
})();