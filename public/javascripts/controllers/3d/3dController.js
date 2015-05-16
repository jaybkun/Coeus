;(function() {
    'use strict';

    /**
     *
     */
    angular.module('3dControllerModule',[])
        .controller('3dController', ['$scope', '$localStorage', function($scope, $localStorage){
            $scope.$storage = $localStorage.$default({
                directionalLights: [
                    {
                        name: "default light",
                        pos: {
                            x: 1,
                            y: 1,
                            z: -1
                        },
                        color: 0xffffff,
                        intensity: 1.35
                    }
                ],
                objects: [
                    {
                        name: 'The Cube',
                        description: 'Possibly a companionable cube...',
                        mass: 10.0,
                        type: 'cube',
                        dimensions: {
                            width: 1,
                            height: 1,
                            depth: 1
                        },
                        pos: {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                        rotation: {
                            x: 0,
                            y: 0,
                            z: 0
                        }
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
                    new THREE.PlaneBufferGeometry(10 * SCREEN_WIDTH, 10 * SCREEN_WIDTH),
                    new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
                );
                floor.rotation.x = -Math.PI/2;
                floor.position.y = -0.5;
                floor.receiveShadow = true;
                scene.add( floor );

                // Create objects
                _.each($scope.$storage.objects, function(object) {
                    var geometry = null;
                    if (object.type === "cube") {
                        geometry = new THREE.BoxGeometry(object.dimensions.length, object.dimensions.width, object.dimensions.depth);
                    }
                    var material = new THREE.MeshPhongMaterial({color:0x00ff00, specular: 0x101010});
                    var obj = new THREE.Mesh(geometry, material);
                    obj.castShadow = true;
                    scene.add(obj);
                });

                // Create lighting
                scene.fog = new THREE.FogExp2( 0x13fd25, 0.0065 );
                _.each($scope.directionalLights, function(light) {
                    createDirectionalLight(light.pos, light.intensity, light.color);
                });
            }

            function animate() {
                requestAnimationFrame(animate);
                render();
                update();
            }

            function update() {
                _.each($scope.$storage.objects, function(object) {
                    object.rotation.x += object.rotation.x;
                    object.rotation.y += object.rotation.y;
                    object.rotation.z += object.rotation.z;
                });

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

                $scope.$storage.directionalLights.push(directionalLight);
                $scope.$apply();
            }

            function render() {
                renderer.render( scene, camera );
            }

            $scope.$watchCollection('light', function(newValues) {
                _.each($scope.$storage.directionalLights, function(directionalLight) {

                });
            });

            $scope.resetLight = function(name) {
                try {
                    var idx = _.indexOf($scope.$storage.directionalLights, _.findWhere($scope.$storage.directionalLights, {name: name}));
                    $scope.$storage.directionalLights[idx].x = 1;
                    $scope.$storage.directionalLights[idx].y = 1;
                    $scope.$storage.directionalLights[idx].z = 1;
                } catch (err) {
                    console.error(err);
                }
            };
        }]);
})();
