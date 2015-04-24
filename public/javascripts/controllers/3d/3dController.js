'use strict';

angular.module('3dControllerModule',[])
    .controller('3dController', ['$scope', function($scope){
        $scope.light = {
            x: 1,
            y: 1,
            z: -1,
            color: 0xffffff,
            intensity: 1.35
        };

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

        var scene = new THREE.Scene();
        //var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(300, 300);
        renderer.shadowMapEnabled = true;

        var floor = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( 40, 40 ),
            new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
        );
        floor.rotation.x = -Math.PI/2;
        floor.position.y = -0.5;
        scene.add( floor );

        floor.receiveShadow = true;

        var geometry = new THREE.BoxGeometry(2,2,2);
        var material = new THREE.MeshPhongMaterial({color:0x00ff00, specular: 0x101010});
        var cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        scene.add(cube);
        camera.position.z = 5;

        scene.add( new THREE.AmbientLight( 0x777777) );

        var directionalLight = new THREE.DirectionalLight( $scope.light.color, $scope.light.intensity);
        directionalLight.position.set($scope.light.x, $scope.light.y, $scope.light.z);
        scene.add( directionalLight );

        directionalLight.castShadow = true;
        // directionalLight.shadowCameraVisible = true;

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


        var stage = document.getElementById('stage');
        stage.appendChild(renderer.domElement);
        //document.body.appendChild(renderer.domElement);

        function render() {
            requestAnimationFrame( render );

            cube.rotation.x += $scope.cube.rotation.x;
            cube.rotation.y += $scope.cube.rotation.y;
            cube.rotation.z += $scope.cube.rotation.z;

            cube.position.x = $scope.cube.pos.x;
            cube.position.y = $scope.cube.pos.y;
            cube.position.z = $scope.cube.pos.z;

            renderer.render( scene, camera );
        }
        render();

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
            $scope.light.intensity = 1.35
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
