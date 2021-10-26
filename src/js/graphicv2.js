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
    ],
        function (
            esriConfig,
            Sketch, Map, GraphicsLayer, MapView, dom, on, GeometryService,
            Polyline, Polygon, geometryEngine, Graphic
        ) {

            esriConfig.apiKey = "AAPKd9159fee5d4f444092f9bf7e303e03f6YQJR0K3kHLezR2G951W_IyzwufRn2t7mUsh7_rU8HGO1oCMPG9gga61jSRkZcU0Q";

            var graphicsLayer = new GraphicsLayer();

            var polySymbol = {
                type: "simple-fill",  // autocasts as new SimpleFillSymbol()
                color: [0, 0, 0, 0.3],
                style: "solid",
                outline: {  // autocasts as new SimpleLineSymbol()
                    color: "red",
                    width: 1
                }
            }


            var map = new Map({
                basemap: "topo-vector",
                layers: [graphicsLayer]
            });

            const view = new MapView({
                container: "viewDiv",
                map: map,
                zoom: 5,
                center: [90, 45]
            });
            var sketch;
            view.when(() => {
                sketch = new Sketch({
                    layer: graphicsLayer,
                    view: view,
                    // graphic will be selected as soon as it is created
                    // creationMode: "update"
                });
                // sketch.on("update", function (event) {
                //     // if (event.state === "active") {
                //     //   sketch.delete();
                //     // }
                //     // if (event.graphics[0].geometry.type === "polyline") {

                //     // }
                //     event.aborted = false;
                //     console.log('update ', event);
                // });

                view.ui.add(sketch, "top-right");

                on(dom.byId("Split"), "click", function (evt) {
                    // console.log('start sketch ', sketch);
                    const allGraphics = sketch.layer.graphics;
                    const polygonGraphic = allGraphics.filter(e => e.geometry.type === "polygon").items[0].geometry;
                    // polygonGraphic.spatialReference.wkid = 3857
                    const polylineGraphic = allGraphics.filter(e => e.geometry.type === "polyline").items[0].geometry;
                    
                    const polygons = geometryEngine.cut(
                        polygonGraphic,
                        polylineGraphic
                    )

                    // remove selected graphic one
                    sketch.delete();
                    // add new poligons
                    for (let i = 0; i < polygons.length; i++) {
                        const element = polygons[i];
                        var nGraphicsLayer = new GraphicsLayer();
                        const poligonGraphic = new Graphic({
                            geometry: element,
                            symbol: polySymbol
                        });
                        nGraphicsLayer.graphics.add(poligonGraphic);
                        map.layers.add(nGraphicsLayer)
                    }
                    // console.log('end sketch ', sketch);
    
                });
            });
            
        });
})();