(function() {
    'use strict';

    /**
     *
     */
    angular.module('3dControllerModule',[])
        .controller('3dController', ['$scope', function($scope){
            $scope.light = {
                pos: {
                    x: 1,
                    y: 1,
                    z: -1
                },
                color: 0xffffff,
                intensity: 1.35
            };

            $scope.cube = {
                pos: {
                    x: 0,
                    y: 1,
                    z: 0
                },
                rotation: {
                    x: 0.01,
                    y: 0.00,
                    z: 0.0
                }
            };

            // Global objects
            var container, scene, camera, renderer, controls;
            var keyboard = new THREEx.KeyboardState();
            var clock = new THREE.Clock();

            // Common objects
            var floor, cube;
            var directionalLights = [];

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
                camera.position.set(50, 50, 90);
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
                    new THREE.PlaneBufferGeometry(SCREEN_WIDTH, SCREEN_WIDTH),
                    new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
                );
                floor.rotation.x = -Math.PI/2;
                floor.position.y = -0.5;
                floor.receiveShadow = true;
                scene.add( floor );

                // Create a cube
                var geometry = new THREE.BoxGeometry(20,20,20);
                var material = new THREE.MeshPhongMaterial({color:0x00ff00, specular: 0x101010});
                cube = new THREE.Mesh(geometry, material);
                cube.castShadow = true;
                scene.add(cube);

                // Create lighting
                scene.fog = new THREE.FogExp2( 0x13fd25, 0.0025 );
                createDirectionalLight($scope.light.pos, $scope.light.intensity, $scope.light.color);
            }

            function animate() {
                requestAnimationFrame(animate);
                render();
                update();
            }

            function update() {
                 cube.rotation.x += $scope.cube.rotation.x;
                 cube.rotation.y += $scope.cube.rotation.y;
                 cube.rotation.z += $scope.cube.rotation.z;

                 cube.position.x = $scope.cube.pos.x;
                 cube.position.y = $scope.cube.pos.y;
                 cube.position.z = $scope.cube.pos.z;

                controls.update();
            }

            function createDirectionalLight(pos, intensity, color) {
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

                directionalLights.push(directionalLight);
            }

            function render() {
                renderer.render( scene, camera );
            }

            $scope.$watchCollection('light', function(newValues) {
                console.log("updated ", angular.toJson(newValues));
                directionalLight.position.x = $scope.light.x;
                directionalLight.position.y = $scope.light.y;
                directionalLight.position.z = $scope.light.z;
                directionalLight.intensity = $scope.light.intensity;
            });

            $scope.resetLight = function() {
                $scope.light.x = 1;
                $scope.light.y = 1;
                $scope.light.z = -1;
                $scope.light.intensity = 1.35;
            };

            $scope.resetCube = function() {
                $scope.cube = {
                    rotation: {
                        x: 0.01,
                        y: 0.00,
                        z: 0.0
                    },
                    pos: {
                        x: 0,
                        y: 1,
                        z: 0
                    }
                };
            };
        }]);
})();
