console.log('main.js is loaded'); // ファイルロード確認用のログ

// シーン、カメラ、レンダラーのセットアップ
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    43, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.z =5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

renderer.setClearColor(0xfff2b9); 



// OrbitControlsのセットアップ
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;

// 光源の追加
const ambientLight = new THREE.AmbientLight(0xf0f0f0);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff,0.5 ); // 1.5に増加
directionalLight.position.set(2, 30, 0).normalize();
scene.add(directionalLight);

let originalModel;
let newModel;
const clickableObjects = []; // クリック可能なオブジェクトのリスト

// オブジェクトの情報
const objectInfo = {
    'pin1': 'かき氷',
    'pin2': 'ホットドッグ',
    'pin3': '唐揚げ',
    'pin4': 'わたあめ',
    'pin5': 'クレープ',
    'pin6': 'たこ焼き',
    'pin7': 'アイスクリーム',
};

// GLTFモデルのロード
const loader = new THREE.GLTFLoader();
loader.load(
    'models/yatai.glb',
    function (gltf) {
        originalModel = gltf.scene;
        scene.add(originalModel);
        console.log('Original model loaded'); // ロード成功ログ

        // クリック可能なオブジェクトをリストに追加
        const clickable = Object.keys(objectInfo); // クリック可能なオブジェクト名のリスト

        clickable.forEach(name => {
            const clickableObject = scene.getObjectByName(name);
            if (clickableObject) {
                clickableObjects.push(clickableObject);
                console.log('Clickable object siroiyatsu', clickableObject);
            }
        });
        button()
    },
    undefined,
    function (error) {
        console.error('An error happened', error);
    }
);

// カメラの位置
camera.position.x = -80;
camera.position.y = 35;
camera.position.z = 0;

// アニメーション対象のオブジェクト
const animatedObjects = [];

// レンダリングループ
function animate() {
    requestAnimationFrame(animate);

    // アニメーション対象のオブジェクトを更新
    animatedObjects.forEach(obj => {
        if (obj.visible && obj.position.y < obj.targetY) {
            obj.position.y += 0.01;
        }
    });

    controls.update();
    renderer.render(scene, camera);
}
animate();

// クリックイベント
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(clickableObjects, true);

    if (intersects.length > 0) {
        console.log('モデルがクリックされました！');
        const intersectedObject = intersects[0].object;
        console.log('Intersected object:', intersectedObject);

        
        showInfoBox(intersectedObject);
    }
}
    

function showInfoBox(object) {
    const infoBox = document.getElementById('infoBox');
    const info = objectInfo[object.name] || '情報が見つかりません'; // オブジェクトの情報を取得
        //ボタンのつけ方分からなくてモデル情報の中に移動ボタンある。ごめん
    infoBox.innerHTML = `<strong>モデル名:</strong> ${object.name}<br><strong>情報:</strong><br> ${info}<br><button onclick="location.href='souzou.html'">移動</button>`;
    infoBox.style.display = 'block';
}





window.addEventListener('click', onMouseClick);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
