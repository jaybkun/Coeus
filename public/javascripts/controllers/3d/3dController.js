;(function() {
    'use strict';

    /**
     *
     */
    angular.module('3dControllerModule',[])
        .controller('3dController', ['$scope', '$localStorage', function($scope, $localStorage){
            $localStorage.$reset();
            $scope.$storage = $localStorage.$default({
                objects: {},
                directionalLights: {}
            });

            // Default object and light
            var defCube = {
                name: "Companionable Cube",
                position: {x: 2, y: 6, z: 2},
                rotation: {x: 0.1, y: 0, z: 0},
                size: {x: 2, y: 2, z: 2}
            };
            var defLight = {
                name: "Default Light",
                position: {x: 4, y: 8, z: 8},
                intensity: 2.5,
                color: 0x404040
            };

            // Global objects
            var container, scene, camera, renderer, controls;
            var keyboard = new THREEx.KeyboardState();
            var clock = new THREE.Clock();

            // Common objects
            var floor;
            $scope.directionalLights = {};

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
                camera.position.set(10, 10, 7);
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
                //controls = new THREE.FirstPersonControls(camera, renderer.domElement);

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
                if ($scope.$storage.objects.length > 0) {
                    _.each($scope.$storage.objects, function(object) {
                        scene.add(object);
                    });
                } else {
                    var geometry = new THREE.BoxGeometry(defCube.size.x, defCube.size.y, defCube.size.z);
                    var material = new THREE.MeshPhongMaterial({color: 0x00ff00, specular: 0x101010});
                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.castShadow = true;
                    mesh.name = defCube.name;
                    mesh.position.x = defCube.position.x;
                    mesh.position.y = defCube.position.y;
                    mesh.position.z = defCube.position.z;

                    scene.add(mesh);
                    $scope.$storage.objects[mesh.id] = mesh;
                }

                // Create lighting
                var light = new THREE.AmbientLight( 0x303030 );
                scene.add(light);

                if ($scope.$storage.directionalLights.length > 0) {
                    _.each($scope.$storage.directionalLights, function(light) {
                        scene.add(light);
                    });
                } else {
                    createDirectionalLight(defLight.name, defLight.position, defLight.intensity, defLight.color);
                }
            }

            function animate() {
                requestAnimationFrame(animate);
                render();
                update();
            }

            function update() {
                var delta = clock.getDelta();

                controls.update(delta);
            }

            function createDirectionalLight(name, pos, intensity, color, target) {
                var directionalLight = new THREE.DirectionalLight(color, intensity);
                directionalLight.name = name;
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

                $scope.$storage.directionalLights[directionalLight.id] = directionalLight;
            }

            function render() {
                renderer.render( scene, camera );
            }

            $scope.$watch('directionalLights', function(updates) {

            });

            $scope.resetLight = function(name) {

            };

            $scope.resetAll = function() {
                $localStorage.$reset();
            };

        }]);
})();
