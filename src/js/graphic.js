(() => {
    require([
        "esri/config",
        "esri/Map",
        "esri/views/MapView",
        "esri/Graphic",
        "esri/layers/GraphicsLayer",
        "esri/geometry/Polyline",
        // "esri/widgets/Sketch",
        // "esri/toolbars/edit",
        
    ],
        function (esriConfig, Map, MapView, Graphic, GraphicsLayer) {

            esriConfig.apiKey = "AAPKd9159fee5d4f444092f9bf7e303e03f6YQJR0K3kHLezR2G951W_IyzwufRn2t7mUsh7_rU8HGO1oCMPG9gga61jSRkZcU0Q";
            // esriConfig.apiKey = "AAPK3de8720778204aa0864bf8efa08fc9b4yzJGoapJip5eJTl5ylMxj0t9FjBbM8R9F3eEZbrmEkzPUmS07iFIpghiwWiO8Iso";

            // var pointGraphic = new Graphic({
            //     attributes: {
            //         name: "SoftBd Ltd.",
            //         address: "200 N Spring St, Los Angeles, CA 90012"
            //     },
            //     geometry: {
            //         type: "point",                     // autocasts as new Point()
            //         longitude: 90.39656228700582,
            //         latitude: 23.747115551150802
            //     },
            //     symbol: {
            //         type: "simple-marker",             // autocasts as new SimpleMarkerSymbol()
            //         color: [226, 119, 40],
            //         outline: {                         // autocasts as SimpleLineSymbol()
            //             color: [255, 255, 255],
            //             width: 2
            //         }
            //     },
            //     popupTemplate: {                     // autocasts as new PopupTemplate()
            //         title: "Places in Los Angeles",
            //         content: [{
            //             type: "fields",
            //             fieldInfos: [
            //                 {
            //                     fieldName: "name",
            //                     label: "Name",
            //                     visible: true
            //                 },
            //                 {
            //                     fieldName: "address",
            //                     label: "Address",
            //                     visible: true
            //                 }
            //             ]
            //         }]
            //     },
            // });

            // var polylineGraphic = new Graphic({
            //     geometry: {
            //         type: 'polyline',
            //         paths: [

            //             [90.39676238945162, 23.746536084983177],
            //             [90.39669822512703, 23.747046082170662],
            //             [90.39651278352243, 23.74696769448513],
            //             [90.39649028572953, 23.74724397660194],

            //         ]
            //     }
            // });

            var polygonGraphic = new Graphic({
                geometry: {
                    type: 'polygon',
                    rings: [

                        [90.39814264531441, 23.746960551125937],
                        [90.39794970055715, 23.748066349181556],
                        [90.39585716481164, 23.74795190819743],
                        [90.39603654032737, 23.7463084070989],

                    ]
                },
                symbol: {
                    type: "simple-fill",  // autocasts as new SimpleFillSymbol()
                    color: [ 0, 0, 0, 0.3 ],
                    style: "solid",
                    outline: {  // autocasts as new SimpleLineSymbol()
                      color: "red",
                      width: 1
                    }
                  }
            });

            let graphicsLayer = new GraphicsLayer({
                graphics: [
                    // pointGraphic,
                    // polylineGraphic,
                    polygonGraphic
                ]
            });

            const map = new Map({
                basemap: "arcgis-topographic", // Basemap layer service
                layers: [graphicsLayer]
            });
            // // map.on("load", createToolbar);
            // map.layers.add(graphicsLayer);

            const view = new MapView({
                map: map,
                center: [90.39658664582275, 23.747304466460907], // Longitude, latitude
                zoom: 17, // Zoom level
                container: "viewDiv" // Div element
            })
            // // .on('click', (e)=>{
            // //     console.log(e)
            // // })

            // // const sketch = new Sketch({
            // //     layer: graphicsLayer,
            // //     view: view,
            // //     // graphic will be selected as soon as it is created
            // //     creationMode: "update"
            // // });
            // // view.ui.add(sketch, "top-right");

            
            // // new Editor(map);

            // // view.on("click", function(evt) {
            // //     console.log('working ', evt)
            // //     // const area = Polygon.fromExtent(view.extent);
            // //     // const graphic = new Graphic({
            // //     //   geometry: area,
            // //     //   symbol: { type: "simple-fill" }
            // //     // });
            // //     // view.graphics.add(graphic);
            // //   });

        });
})();