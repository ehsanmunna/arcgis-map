(function(){
    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/Graphic",
        "esri/widgets/Sketch",
        "esri/layers/GraphicsLayer",
        "esri/geometry/Geometry",
        "dojo/dom", "dojo/on",
        "esri/geometry/geometryEngine",
    ], (
        Map,
        MapView,
        Graphic,
        Sketch,
        GraphicsLayer,
        Geometry,
        dom, on,
        geometryEngine
    ) => {
        // const _rings = [
        //     [10062703.0735754, 2722478.508873152],
        //     [10063671.2760309, 2722801.243073582],
        //     [10063357.034947006, 2723370.2742753057],
        //     [10062548.076349035, 2722960.486858215],
        //     [10062703.0735754, 2722478.508873152]
        // ]
        // const _mrings = [
        //     [
        //         [10063616.330328727, 2722782.927836767],
        //         [10063643.41794903, 2722851.688793817],
        //         [10063671.2760309, 2722801.243073582],
        //         [10063616.330328727, 2722782.927836767]
        //     ],
        //     [
        //         [10062703.0735754, 2722478.508873152],
        //         [10062548.076349035, 2722960.486858215],
        //         [10063357.034947006, 2723370.2742753057],
        //         [10063643.41794903, 2722851.688793817],
        //         [10063616.330328727, 2722782.927836767],
        //         [10062703.0735754, 2722478.508873152]
        //     ]
        // ]
        // const updateRings = [
        //     [10062970.401763909, 2723129.5184100512],
        //     [10063348.340565763, 2723360.952719375],
        //     [10063668.95130482, 2722813.1540470235],
        //     [10063257.040619984, 2722660.279990449],
        //     [10062702.872164903, 2722486.1734341164],
        //     [10062552.121569702, 2722951.1653683465],
        //     [10062970.401763909, 2723129.5184100512]
        // ]
        const _center = [90.39806303907038, 23.748858777807484];
        // const _center = [-11447244.491202017, 4467769.286797373];
        // const _center = [-80, 35];
        const getData = getStorageData();
        var sketch;
        if (getData) {
            let pointsOnly = getData
            // .allGraphics
                // .filter(e => e != undefined)
                .filter(e => e.geometry.rings)
                .map(e => {
                    return e.geometry.rings[0];
                })
            // pointsOnly = [...pointsOnly, ...getData.otherGraphics
            
            // .map(e => e.geometry.rings[0])]
            
    
            // var sketch = init(_mrings);
            sketch = init(pointsOnly);
        } else {
            sketch = init([]);
        }
    
    
        // Extra buttons
        on(dom.byId("Update"), "click", function (evt) {
            const allGraphics = sketch.layer.graphics
            // let getGraphicsInfo = mapDetails();
            // const tst = getGraphicsInfo.allGraphics.items.filter(e=> e.geometry.rings.length != 0);
            // getGraphicsInfo.allGraphics.items = tst;
            // console.log(getGraphicsInfo.allGraphics.items);
            saveToStorage(allGraphics);
            // remove from sketch
            // sketch.delete();
            // get new polygon point and upate
            // console.log(sketch);
            // init(updateRings);
            // console.log(allGraphics);
            alert('Successfully updated!')
    
        });
        on(dom.byId("Split"), "click", function (evt) {
            const newPolygons = cutGraphicAndReturnPolyrings();
            if (newPolygons.otherGraphics.length > 0) {
                newPolygons.polygons = [...newPolygons.polygons, ...newPolygons.otherGraphics.map(e => e.geometry)]
            }
            let points = [];
            newPolygons.polygons.forEach(element => {
                points.push(element.rings[0]);
            });
            // console.log(points);
            // saveToStorage(points);
            // sketch.remove()
            sketch = init(points);
        });
    
        function init(pointRings, isUpdate) {
            // console.log('check point rings ', pointRings)
            const graphicsLayer = new GraphicsLayer();
            const map = new Map({
                basemap: "gray-vector",
                // basemap: "topo-vector",
                layers: [graphicsLayer]
            });
    
            const view = new MapView({
                center: _center,
                container: "viewDiv",
                map: map,
                zoom: 16
            });
            // view.on('click', function (e) {
            //     // console.log('view on click : ', e);
            //     console.log(`[${e.mapPoint.x}, ${e.mapPoint.y}]`);
            // })
            if (isMultidimentionalArray(pointRings)) {
                // console.log('multi')
                for (let i = 0; i < pointRings.length; i++) {
                    const element = pointRings[i];
                    // console.log(element);
                    const polygonGraphic = createPolygonGraphic(element);
                    graphicsLayer.add(polygonGraphic);
                }
            } else {
                const polygonGraphic = createPolygonGraphic(pointRings);
                graphicsLayer.add(polygonGraphic);
            }
            // const polygonGraphic = createPolygonGraphic(pointRings);
            // if (isUpdate) {
            //     graphicsLayer.addMany(polygonGraphic);
            // } else {
            //     graphicsLayer.add(polygonGraphic);
            // }
    
            const sketch = new Sketch({
                view: view,
                layer: graphicsLayer,
                creationMode: "update"
            });
    
            view.ui.add(sketch, 'top-right');
            return sketch;
        }
    
        function createPolygonGraphic(_rings) {
            // console.log('createPolygonGraphic ', _rings);
            var polygon = {
                type: "polygon",
                rings: _rings,
                spatialReference: { wkid: 102100 }
            };
    
            const fillSymbol = {
                type: "simple-fill",
                color: [227, 139, 79, 0.8],
                outline: {
                    color: [255, 255, 255],
                    width: 1
                }
            };
    
            const polygonGraphic = new Graphic({
                geometry: polygon,
                symbol: fillSymbol
            });
            return polygonGraphic;
        }
    
        function cutGraphicAndReturnPolyrings(params) {
            const mapDetailInfo = mapDetails();
            const otherGraphics = mapDetailInfo.otherGraphics;
            // Get All Graphics
            const allGraphics = mapDetailInfo.allGraphics;
            // Get Selected Graphics
            const selectedGraphics = mapDetailInfo.selectedGraphics.allGraphics;
            // Get Cutter line
            const cutterLine = selectedGraphics.filter(e => {
                const elem = e.geometry.type;
                return elem === "polyline";
            });
            const _cutterLine = cutterLine[0];
            // Cut the selected polygon with cutter line
            const polygons = geometryEngine.cut(
                selectedGraphics[0].geometry,
                _cutterLine.geometry
            )
            // filter polyline with points
            // mapDetailInfo.allGraphics.items = [];
            mapDetailInfo.allGraphics.items.forEach((e,i)=>{
                if (e.geometry.rings && e.geometry.rings.length == 0) {
                    // const elem = mapDetailInfo.allGraphics.items[i];
                    removeFromArray(mapDetailInfo.allGraphics.items, e.uid);
                }
            })
            mapDetailInfo.otherGraphics.forEach((e,i)=>{
                if (e.geometry.rings && e.geometry.rings.length == 0) {
                    // const elem = mapDetailInfo.allGraphics.items[i];
                    removeFromArray(mapDetailInfo.otherGraphics, e.uid);
                }
            })
            // remove selected graphic from all graphics
            selectedGraphics.forEach(e=> {
                removeFromArray(mapDetailInfo.allGraphics.items, e.uid);
            });
            // Remove cutter line from selected graphics
            // pushed new polygon to all graphics
    
    
            // remove cutterLine from all graphis
            // allGraphics.items = removeFromArray(allGraphics.items, _cutterLine.uid)
    
            return {
                ...mapDetailInfo,
                polygons
            }
        }
    
        function mapDetails() {
            const allGraphics = sketch.layer.graphics
            // .filter(e=> 
            // // e.geometry.type === "polygon" && 
            // e.geometry.rings.length > 0
            // );
            const selectedGraphics = sketch.updateGraphics.items;
            const otherGraphics = getNotInSelectedGraphic(allGraphics.items, selectedGraphics);
            const polyline = selectedGraphics.filter(e => {
                const elem = e.geometry.type;
                return elem === "polyline";
            });
            return {
                allGraphics,
                selectedGraphics: selectedGraphics.length > 0 ? {
                    allGraphics: selectedGraphics,
                    polyline: polyline
                }
                    : [],
                otherGraphics
            }
        }
    
        function isMultidimentionalArray(arrayData) {
            arrayData = arrayData.filter(e => e)
            try {
                if (arrayData.length > 0) {
                    return arrayData[0].constructor === Array && arrayData[0][1].constructor === Array
                } else {
                    return false;
                }
            } catch (error) {
                throw new Error(error);
            }
    
        }
    
        function getNotInSelectedGraphic(obj1, obj2) {
            let items = [];
            for (let i = 0; i < obj1.length; i++) {
                const elem = obj1[i];
                const chk = obj2.filter(e => e.uid === elem.uid);
                if (chk.length == 0) items.push(elem);
            }
            return items;
        }
    
        /** function to save data in [arcgis-data] key */
        function saveToStorage(params) {
            localStorage.setItem('arcgis-data', JSON.stringify(params));
        }
    
        /** function to get data from [arcgis-data] key */
        function getStorageData() {
            return JSON.parse(localStorage.getItem('arcgis-data'));
        }
    
        function removeFromArray(array, uid) {
            var idsOnly = array.map(e=> e.uid);
            const index = idsOnly.indexOf(uid);
            if (index > -1) {
                array.splice(index, 1);
            }
            return array;
        }
    });
})();