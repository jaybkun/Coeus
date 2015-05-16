;(function() {
    'use strict';

    /**
     *
     */
    angular.module('3dControllerModule',[])
        .controller('3dController', ['$scope', '$localStorage', function($scope, $localStorage){
            $scope.$storage = $localStorage.$default({
                objects: [
                    {
                        name: "The Cube",
                        dimensions: { length: 1, width: 1, height: 1 },
                        rotation: { x: 0, y: 0, z: 0 },
                        position: { x: 1, y: 1, z: 1 }
                    }
                ],
                directionalLights: [
                    {
                        name: "Default Light",
                        position: { x: 30, y: 30, z: 10 },
                        intensity: 1.35,
                        color: 0x303030,
                        target: null
                    }
                ]
            });

            // Global objects
            var container, scene, camera, renderer, controls;
            var keyboard = new THREEx.KeyboardState();
            var clock = new THREE.Clock();

            // Common objects
            var floor;

            init();
            animate();

            function init() {
                var SCREEN_WIDTH = window.innerWidth;
                var SCREEN_HEIGHT = window.innerHeight * 0.6;
                var VIEW_ANGLE = 75;
                var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
                var NEAR = 0.1;
                var FAR = 20000;

                // Create the scene
                scene = new THREE.Scene();

                // Create the camera
                camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
                scene.add(camera);
                camera.position.set(5, 5, 5);
                camera.lookAt(scene.position);

                // Create the renderer
                renderer = new THREE.WebGLRenderer();
                renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
                renderer.shadowMapEnabled = true;

                container = document.getElementById('three_container');
                container.appendChild(renderer.domElement);

                // Create event listeners
                // TODO fullscreen event
                // TODO resize event

                // Create Controls
                controls = new THREE.OrbitControls(camera, renderer.domElement);

                // Create axis helpers
                var axisHelp = new THREE.AxisHelper(100);
                scene.add(axisHelp);

                // Create the floor
                floor = new THREE.Mesh(
                    new THREE.PlaneBufferGeometry(10 * SCREEN_WIDTH, 10 * SCREEN_WIDTH),
                    new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
                );
                floor.rotation.x = -Math.PI/2;
                floor.position.y = -0.5;
                floor.receiveShadow = true;
                scene.add( floor );

                // Create objects
                _.each($scope.$storage.objects, function(object) {
                    var geometry = new THREE.BoxGeometry(object.dimensions.length, object.dimensions.width, object.dimensions.height);
                    var material = new THREE.MeshPhongMaterial({color: 0x00ff00, specular: 0x101010});
                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.castShadow = true;
                    mesh.name = object.name;
                    mesh.position.x = object.position.x;
                    mesh.position.y = object.position.y;
                    mesh.position.z = object.position.z;
                    scene.add(mesh);
                });

                // Create lighting
                var light = new THREE.AmbientLight( 0x303030 );
                scene.add(light);
                _.each($scope.$storage.directionalLights, function(light) {
                    createDirectionalLight(light.position, light.intensity, light.color);
                });
            }

            function animate() {
                requestAnimationFrame(animate);
                render();
                update();
            }

            function update() {
                var delta = clock.getDelta();
                console.log(scene);

                controls.update(delta);
            }

            function createDirectionalLight(pos, intensity, color, target) {
                var directionalLight = new THREE.DirectionalLight(color, intensity);
                directionalLight.position.set(pos.x, pos.y, pos.z);
                scene.add( directionalLight );

                directionalLight.castShadow = true;
                directionalLight.shadowCameraVisible = true;

                var d = 1;
                directionalLight.shadowCameraLeft = -d;
                directionalLight.shadowCameraRight = d;
                directionalLight.shadowCameraTop = d;
                directionalLight.shadowCameraBottom = -d;

                directionalLight.shadowCameraNear = 1;
                directionalLight.shadowCameraFar = 4;

                directionalLight.shadowMapWidth = 1024;
                directionalLight.shadowMapHeight = 1024;

                directionalLight.shadowBias = -0.005;
                directionalLight.shadowDarkness = 0.15;

                if (target) {
                    directionalLight.target = target;
                }
            }

            function render() {
                renderer.render( scene, camera );
            }

        }]);
})();
