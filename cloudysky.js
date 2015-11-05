/* ------------------------------------------------- CLOUDY SKY -------------------------------------------------*/
//See skydome.js for more information on format of a plugin.

CloudySky = function()
{
};



CloudySky.initLoadtime = function (){
    //initStatic
    availablePlugins.push("CloudySky");
}

CloudySky.prototype.init = function (){
    this.shown=false;
}

CloudySky.prototype.initMainLight = function (x,y,z, color, intensity)
{
    // LIGHTS
    //THREE.DirectionalLight (ray are parallel, source seems very far => sun) or THREE.SpotLight (ray seems coming from a unique source) can handle shadows
    light = new THREE.SpotLight(color, intensity);
    light.position.set(x,y,z);
    light.visible= true;
    light.castShadow = true; //Enable shadow casting
    light.shadowDarkness = 0.5; //0 means no shadows,1 means pure black shadow
    //light.shadowCameraVisible = true; //Show the shadow camera (debugging)
    light.shadowMapWidth = 2048; // default is 512
    light.shadowMapHeight = 2048; // default is 512
    light.name="mainlight";
    if(!light)
        Logger.info("light not initialized");
    else
        scene.add(light);
}

CloudySky.prototype.show = function (){
    assert(!this.shown);
    this.shown = true;
	function makeSkybox( urls, size ) {

            var hemiLight = new THREE.HemisphereLight(0xffbbaa, 0x040404, 1);
        	hemiLight.name = "hemiLight";
           	hemiLight.position.z = 500;
            if(!hemiLight)
                Logger.info("hemiLight not initialized");
            else
                scene.add(hemiLight);

			var skyboxCubemap = THREE.ImageUtils.loadTextureCube( urls );
			skyboxCubemap.format = THREE.RGBFormat;
			var skyboxShader = THREE.ShaderLib['cube'];
			skyboxShader.uniforms['tCube'].value = skyboxCubemap;
			return new THREE.Mesh(
				new THREE.BoxGeometry( size, size, size ),
				new THREE.ShaderMaterial({
					fragmentShader : skyboxShader.fragmentShader, vertexShader : skyboxShader.vertexShader,
					uniforms : skyboxShader.uniforms, depthWrite : false, side : THREE.BackSide
				})
			);
		}


        var mainlight = scene.getObjectByName( "mainlight" );
        if(!mainlight)
            this.initMainLight(-110*5, -90*5, 126*5, 0xff4444, 1.5);
        //this.initMainLight(-110*5, -90*5, 126*5, 0xff4444, 1.5);



	var prefix = 'plugins/cloudySky/background/';


	scene.add( makeSkybox( [
		prefix+'px.jpg',
		prefix+'nx.jpg',
		prefix+'nz.jpg',
		prefix+'pz.jpg',
		prefix+'py.jpg',
		prefix+'ny.jpg'

	], 8000 ));

    renderer.setClearColor(0xffffff);
}

CloudySky.prototype.hide = function(){
    assert(this.shown);
    this.shown=false;
    var hl = scene.getObjectByName( "hemiLight" );
    if(hl)
        scene.remove(hl); //never tested
}

CloudySky.prototype.goPerspective = function(){
}
CloudySky.prototype.goOrthographic = function(){
}

CloudySky.initLoadtime();


assert(PatternMatchClass(CloudySky, Patterns.classMethods.atmospher_plugin));

