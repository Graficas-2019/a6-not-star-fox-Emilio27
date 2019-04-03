var fondo = "img/vulcano.jpg";
var renderer = null,
    scene = null,
    camera = null,
    root = null,
    group = null,
    stone = null,
    skullTemp = null,
    floor1 = null,
    directionalLight = null,
    orbitControls = null;

var anim1 = null,
    anim2 = true,
    anim3 = true;

var objLoader = null;
//var mtlLoader = null;

var score = 0;
var gameStarted = false;
var stamina = 100;

var arwing = null,
    arwing = null,
    arwingTemp = 0,
    controls = null,
    keyboard = null,
    front = false,
    back = false,
    left = false,
    right = false;

var stonesArr = [],
    stoneTemp3 = null;
var lasers = [];
var flag = true;

var duration = 1000;
var currentTime = null;
var actTime = null;
var gameStartedTime = null;

var object;

var vel = new THREE.Vector3();
var direction = new THREE.Vector3();


function chargeArwing() {
    if (!objLoader) {
        objLoader = new THREE.OBJLoader();
    }
    objLoader.load(
        'models/Arwing_001.obj',

        function (object) {
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            arwing = object;
            arwing.scale.set(10, 10, 10);
            arwing.position.z = 0;
            arwing.position.x = 370;
            arwing.position.y = 0;
            arwing.rotation.y = Math.PI / 2;

            group.add(arwing);

        },
        function (xhr) {

            arwingTemp = (xhr.loaded / xhr.total * 100)

            if (arwingTemp >= 100 && flag) {
                controls = new THREE.PointerLockControls(group);
                scene.add(controls.getObject());
                flag = false;
            }

        });
}

function onKeyDown(event) {
    switch (event.keyCode) {
        case 87:
            front = true;
            break;
        case 65: 
            left = true;
            break;
        case 83: 
            back = true;
            break;
        case 68: 
            right = true;
            break;
        case 80:
            fireArwing()
            break;
    }
}

function onKeyUp(event) {
    switch (event.keyCode) {
        case 87:
            front = false;
            break;
        case 65:
            left = false;
            break;
        case 83:
            back = false;
            break;

        case 68:
            right = false;
            break;

    }
}

//Coloque el Arwing, porque pesa poco
function chargeStones() {

    if (!objLoader) {
        objLoader = new THREE.OBJLoader();
    }

    objLoader.load(
        'models/Arwing_001.obj',
        function (object) {
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            stone = object;
            stone.scale.set(50, 50, 50);
            stone.position.z = 100;
            stone.position.x = -250;
            stone.position.y = 00;
            stone.rotation.y = Math.PI;
            stone.rotation.x = Math.PI / 2;
        },
        function (xhr) {
            stoneTemp3 = (xhr.loaded / xhr.total * 100)
        });

}

function cStone() {
    var stoneTemp = stone.clone();
    zPos = Math.floor(Math.random() * 200) - 100
    stoneTemp.position.z = zPos;
    stoneTemp.position.x = -550;
    stoneTemp.position.y = 0;
    scene.add(stoneTemp);
    stonesArr.push(stoneTemp);
}

//Coloque el Arwing, porque pesa poco
function chargeSkulls() {
    if (!objLoader) {
        objLoader = new THREE.OBJLoader();
    }

    objLoader.load(
        'models/Arwing_001.obj',

        function (object) {
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;

                }
            });

            skullTemp = object;
            skullTemp.scale.set(30, 30, 30);
            skullTemp.position.z = 0;
            skullTemp.position.x = 300;
            skullTemp.position.y = 50;
            skullTemp.rotation.y = Math.PI / 2;

        },
        function (xhr) {
            stoneTemp3 = (xhr.loaded / xhr.total * 100);

        });
}

function cSkull() {

    var skullTemp2 = skullTemp.clone();
    zPos = Math.floor(Math.random() * 200) - 100
    yPos = Math.floor(Math.random() * 50) + 50
    skullTemp2.position.z = zPos;
    skullTemp2.position.x = -550;
    skullTemp2.position.y = yPos;
    skullTemp2.type = "arwing";
    scene.add(skullTemp2);
    stonesArr.push(skullTemp2);

}

function fireArwing() {

    var material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    var geometry = new THREE.CubeGeometry(3, 1, 1);
    laserTemp = new THREE.Mesh(geometry, material);

    laserTemp.position.y = arwing.collider.min.y;
    laserTemp.position.z = arwing.collider.min.z;
    laserTemp.position.x = arwing.collider.min.x;

    lasers.push(laserTemp);
    scene.add(laserTemp)


}

function start() {
    gameStarted = true;
    document.getElementById("startButton").innerHTML.disabled = true;
    gameStartedTime = Date.now();
    currentTime = Date.now();
    actTime = Date.now();
}

function animate() {
    var rightNow = Date.now();
    var delta = rightNow - currentTime;
    currentTime = rightNow;
    secTemp = (rightNow - actTime) / 1000

    if (secTemp >= 3) {
        cStone();
        cSkull();
        actTime = rightNow;
    }

    direction.y = Number(front) - Number(back);
    direction.z = Number(left) - Number(right);
    if (front || back) vel.y += direction.y * 0.003 * delta;
    if (left || right) vel.z += direction.z * 0.003 * delta;
    direction.normalize();
    controls.getObject().translateY(vel.y * delta);
    controls.getObject().translateZ(vel.z * delta);
    vel.y = 0;
    vel.z = 0;
    arwing.collider = new THREE.Box3().setFromObject(arwing);

    for (stoneTemp2 of stonesArr) {
        stoneTemp2.position.x += 4;
        stoneTemp2.collider = new THREE.Box3().setFromObject(stoneTemp2);
        if (stoneTemp2.position.x >= 400) {
            scene.remove(stoneTemp2);
        }
        if (arwing.collider.intersectsBox(stoneTemp2.collider) && !(stoneTemp2.type == "arwing")) {
            scene.remove(stoneTemp2);
            stamina -= 0.25;
            document.getElementById("stamina").innerHTML = "Stamina: " + stamina;
        }
    }

    if (lasers.length > 0) {
        for (laser of lasers) {
            laser.position.x -= 3;
            if (laser.position.x <= -100) {
                scene.remove(laser);
                laser.inGame = false;
            }
            else if (laser.inGame != false) {
                laser.collider = new THREE.Box3().setFromObject(laser)
                for (stoneTemp2 of stonesArr) {
                    stoneTemp2.collider = new THREE.Box3().setFromObject(stoneTemp2);
                    if (laser.collider.intersectsBox(stoneTemp2.collider) && stoneTemp2.type == "arwing") {
                        scene.remove(stoneTemp2);
                        scene.remove(laser);
                        score += 10;
                        document.getElementById("score").innerHTML = "Score: " + score;
                    }

                }
            }

        }
    }
}

function run() {
    requestAnimationFrame(function () { run(); });
    renderer.render(scene, camera);
    if (gameStarted) {
        NowTime = gameStartedTime;
        elapsedTime = (Date.now() - gameStartedTime) / 1000
        console.log(NowTime);
        console.log(elapsedTime);
        document.getElementById("timer").innerHTML = "Time: " + (60 - elapsedTime);
        if (elapsedTime >= 60 || stamina <= 0) {
            ResetGame();
            document.getElementById("startButton").innerHTML.disabled = true;
        }
        KF.update();
        anim1.start();
        animate();
    }

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function playAnimations() {
    if (anim3) {
        anim1 = new KF.KeyFrameAnimator;
        anim1.init({
            interps:
                [
                    {
                        keys: [0, 1],
                        values: [
                            { x: 0, y: 0 },
                            { x: -3, y: 0 },
                        ],
                        target: floor1.material.map.offset
                    },
                ],
            loop: anim2,
            duration: duration,
        });
    }
}

function ResetGame() {
    gameStarted = false;
    location.reload();
}

function createScene(canvas) {
    var fondoImg = new THREE.TextureLoader().load(fondo);
    var luces = new THREE.PointLight(0xffffff, 1, 0);

    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

    // Set the viewport size
    renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
    // Turn on shadows
    renderer.shadowMap.enabled = true;
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Create a new Three.js scene
    scene = new THREE.Scene();

    fondoImg.wrapS = fondoImg.wrapT = THREE.RepeatWrapping;
    fondoImg.repeat.set(1, 1);
    scene.background = fondoImg;


    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 4000);
    camera.position.set(500, 50, 0);
    camera.lookAt(new THREE.Vector3(0, 50, 0))
    scene.add(camera);

    //orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

    // Create a group to hold all the objects
    root = new THREE.Object3D;

    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    //directionalLight.castShadow = true;
    directionalLight.position.set(0, 50, 300);
    root.add(directionalLight);

    // Point light
    var pointLight = new THREE.PointLight(0xffffff, 0.5, 10000);
    pointLight.position.set(350, 350, 300);
    pointLight.castShadow = true;

    //pointLight.shadow.camera.near = 0;
    pointLight.shadow.camera.far = 4000;
    // pointLight.shadow.camera.fov = 10;

    scene.add(pointLight);

    // Create and add all the lights


    ambientLight = new THREE.AmbientLight(0x888888);
    root.add(ambientLight);

    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create grass texture map
    var map = new THREE.TextureLoader().load("img/lava.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(800, 1500, 50, 50);
    floor1 = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));
    floor1.rotation.x = -Math.PI / 2;

    // Add the mesh to our group
    root.add(floor1);
    floor1.castShadow = false;
    floor1.receiveShadow = true;

    chargeArwing();

    chargeStones();

    chargeSkulls();

    window.addEventListener('resize', onWindowResize);
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    scene.add(root);

}

