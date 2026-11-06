
/* =========================================
   BEARLOVE - MAIN JAVASCRIPT
   Author: Bear
   Description: Personal romantic website
========================================= */

(function () {
    'use strict';

    /* =====================================
       1. INITIALIZE THREE.JS
    ===================================== */

    const hero = document.getElementById('hero');
    const canvas = document.getElementById('heart-canvas');

    if (!window.THREE) {
        console.error('Three.js chưa được tải.');
        return;
    }

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 2)
    );

    renderer.setSize(
        hero.clientWidth,
        hero.clientHeight,
        false
    );

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        50,
        hero.clientWidth / hero.clientHeight,
        0.1,
        100
    );

    camera.position.z = 12;


    /* =====================================
       2. LIGHTING
    ===================================== */

    const ambientLight = new THREE.AmbientLight(
        0xffc0d8,
        0.7
    );

    scene.add(ambientLight);


    const lightOne = new THREE.PointLight(
        0xff9ec4,
        1.6,
        50
    );

    lightOne.position.set(6, 6, 8);

    scene.add(lightOne);


    const lightTwo = new THREE.PointLight(
        0xff3d8b,
        1.2,
        50
    );

    lightTwo.position.set(-7, -3, 6);

    scene.add(lightTwo);


    /* =====================================
       3. CREATE HEART GEOMETRY
    ===================================== */

    function createHeartShape() {

        const shape = new THREE.Shape();

        shape.moveTo(0.25, 0.25);

        shape.bezierCurveTo(
            0.25, 0.25,
            0.2, 0,
            0, 0
        );

        shape.bezierCurveTo(
            -0.3, 0,
            -0.3, 0.35,
            -0.3, 0.35
        );

        shape.bezierCurveTo(
            -0.3, 0.55,
            -0.1, 0.77,
            0.25, 0.95
        );

        shape.bezierCurveTo(
            0.6, 0.77,
            0.8, 0.55,
            0.8, 0.35
        );

        shape.bezierCurveTo(
            0.8, 0.35,
            0.8, 0,
            0.5, 0
        );

        shape.bezierCurveTo(
            0.35, 0,
            0.25, 0.25,
            0.25, 0.25
        );

        return shape;
    }


    /* =====================================
       4. CREATE MAIN 3D HEART
    ===================================== */

    const heartGeometry = new THREE.ExtrudeGeometry(
        createHeartShape(),
        {
            depth: 0.3,
            bevelEnabled: true,
            bevelThickness: 0.15,
            bevelSize: 0.1,
            bevelSegments: 8,
            curveSegments: 32
        }
    );

    heartGeometry.rotateZ(Math.PI);
    heartGeometry.center();


    const heartMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff4f9a,
        roughness: 0.25,
        metalness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.15,
        emissive: 0x5a0a2c
    });


    const heart = new THREE.Mesh(
        heartGeometry,
        heartMaterial
    );

    heart.scale.setScalar(3.4);

    scene.add(heart);


    /* =====================================
       5. CREATE SMALL FLOATING HEARTS
    ===================================== */

    const heartColors = [
        0xff8fb1,
        0xff5c9a,
        0xffb3d1,
        0xff3d8b,
        0xffd1e3
    ];

    const smallHearts = [];


    const smallGeometry = new THREE.ExtrudeGeometry(
        createHeartShape(),
        {
            depth: 0.1,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.04,
            bevelSegments: 2,
            curveSegments: 8
        }
    );

    smallGeometry.rotateZ(Math.PI);
    smallGeometry.center();


    for (let i = 0; i < 45; i++) {

        const material = new THREE.MeshStandardMaterial({
            color: heartColors[i % heartColors.length],
            roughness: 0.4,
            emissive: 0x3a0820
        });

        const mesh = new THREE.Mesh(
            smallGeometry,
            material
        );

        const size = 0.25 + Math.random() * 0.55;

        mesh.scale.setScalar(size);

        mesh.position.set(
            (Math.random() - 0.5) * 22,
            (Math.random() - 0.5) * 14,
            (Math.random() - 0.5) * 10 - 2
        );

        mesh.userData = {
            velocity: 0.006 + Math.random() * 0.014,
            phase: Math.random() * Math.PI * 2,
            speed: 0.3 + Math.random() * 0.6,
            rotationSpeed: (Math.random() - 0.5) * 0.02
        };

        scene.add(mesh);

        smallHearts.push(mesh);
    }


    
    /* =====================================
       6. PERSONAL MEDIA CONFIGURATION
    ===================================== */

    // 6 ảnh cá nhân
    const myPhotos = [
        'assets/images/anh1.jpg',
        'assets/images/anh2.jpg',
        'assets/images/anh3.jpg',
        'assets/images/anh4.jpg',
        'assets/images/anh5.jpg',
        'assets/images/anh6.jpg'
    ];

    // 2 video cá nhân
    const myVideos = [
        'assets/videos/video1.mp4',
        'assets/videos/video2.mp4'
    ];

    // Gộp ảnh và video thành một danh sách
    const mediaItems = [
        ...myPhotos.map(src => ({ type: 'image', src })),
        ...myVideos.map(src => ({ type: 'video', src }))
    ];

    const textureLoader = new THREE.TextureLoader();

    // Quỹ đạo chung cho cả ảnh và video
    const mediaOrbit = new THREE.Group();
    scene.add(mediaOrbit);

    const mediaSprites = [];
    const videoElements = [];

    function createMediaSprite(item, index) {

        let texture;
        let spriteMaterial;

        if (item.type === 'image') {

            texture = textureLoader.load(
                item.src,
                function (loadedTexture) {
                    loadedTexture.encoding = THREE.sRGBEncoding;
                    loadedTexture.anisotropy =
                        renderer.capabilities.getMaxAnisotropy();
                },
                undefined,
                function () {
                    console.warn('Không tìm thấy ảnh:', item.src);
                }
            );

            spriteMaterial = new THREE.SpriteMaterial({
                map: texture,
                transparent: false
            });

        } else {

            const video = document.createElement('video');

            video.src = item.src;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.autoplay = true;
            video.preload = 'auto';

            video.addEventListener('error', function () {
                console.warn('Không tải được video:', item.src);
            });

            video.addEventListener('loadeddata', function () {
                video.play().catch(function (error) {
                    console.warn('Video chưa thể tự phát:', error);
                });
            });

            video.load();

            videoElements.push(video);

            texture = new THREE.VideoTexture(video);
            texture.encoding = THREE.sRGBEncoding;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.generateMipmaps = false;

            spriteMaterial = new THREE.SpriteMaterial({
                map: texture,
                transparent: false
            });
        }

        const sprite = new THREE.Sprite(spriteMaterial);

        // Chia đều 8 nội dung trên quỹ đạo
        const angle = index / mediaItems.length * Math.PI * 2;
        const radius = 6.4;

        sprite.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle * 1.5) * 1.8,
            Math.sin(angle) * radius
        );

        if (item.type === 'image') {
            sprite.scale.set(2.3, 2.7, 1);
        } else {
            sprite.scale.set(2.7, 1.52, 1);
        }

        sprite.userData = {
            index: index,
            type: item.type,
            source: item.src
        };

        mediaOrbit.add(sprite);
        mediaSprites.push(sprite);
    }

    // Tạo 6 ảnh và 2 video
    mediaItems.forEach(function (item, index) {
        createMediaSprite(item, index);
    });

    
/* =====================================
   6.1 MEDIA VIEWER INTERACTION
===================================== */

const mediaViewer = document.getElementById('media-viewer');
const mediaImage = document.getElementById('media-image');
const mediaVideo = document.getElementById('media-video');
const closeMediaButton = document.getElementById('close-media-viewer');

// Ẩn nội dung media ngay khi website khởi động
mediaViewer.classList.remove('active');

mediaImage.style.display = 'none';
mediaVideo.style.display = 'none';

mediaImage.removeAttribute('src');
mediaVideo.pause();
mediaVideo.removeAttribute('src');
mediaVideo.removeAttribute('controls');
mediaVideo.load();

// Công cụ nhận diện ảnh/video trong không gian 3D
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let pointerStartX = 0;
let pointerStartY = 0;

// Ghi nhận vị trí bắt đầu nhấn chuột
canvas.addEventListener('pointerdown', function (event) {
    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
});

// Mở nội dung được chọn
function openMediaViewer(item) {
    if (!item) return;

    // Dừng và xóa video cũ
    mediaVideo.pause();
    mediaVideo.removeAttribute('src');
    mediaVideo.load();

    // Ẩn cả hai loại nội dung trước khi hiển thị
    mediaImage.hidden = true;
    mediaImage.hidden = false;
    mediaVideo.hidden = true;
    mediaVideo.hidden = false;

    mediaImage.style.visibility = 'hidden';
    mediaVideo.style.visibility = 'hidden';

    if (item.type === 'image') {
        mediaImage.src = item.source;
        mediaImage.style.display = 'block';
        mediaImage.style.visibility = 'visible';
    }

    if (item.type === 'video') {
        mediaVideo.src = item.source;
        mediaVideo.style.display = 'block';

        mediaVideo.load();

        mediaVideo.play().catch(function (error) {
            console.warn('Không thể tự phát video:', error);
        });
    }

    mediaViewer.classList.add('active');
}

// Đóng khung xem ảnh/video
function closeMediaViewer() {
    mediaViewer.classList.remove('active');

    mediaVideo.pause();
    mediaVideo.removeAttribute('src');
    mediaVideo.load();

    mediaImage.removeAttribute('src');

    mediaImage.hidden = true;
    mediaVideo.hidden = true;
}

// Nhấn vào ảnh/video trên quỹ đạo
canvas.addEventListener('pointerup', function (event) {
    // Không mở nếu người dùng vừa kéo chuột
    const distance = Math.hypot(
        event.clientX - pointerStartX,
        event.clientY - pointerStartY
    );

    if (distance > 6) return;

    const rect = canvas.getBoundingClientRect();

    mouse.x = (
        (event.clientX - rect.left) / rect.width
    ) * 2 - 1;

    mouse.y = -(
        (event.clientY - rect.top) / rect.height
    ) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersections = raycaster.intersectObjects(
        mediaSprites,
        false
    );

    if (intersections.length > 0) {
        const selectedSprite = intersections[0].object;

        openMediaViewer({
            type: selectedSprite.userData.type,
            source: selectedSprite.userData.source
        });
    }
});

// Nút đóng
closeMediaButton.addEventListener(
    'click',
    closeMediaViewer
);

// Nhấn vùng tối bên ngoài để đóng
mediaViewer.addEventListener('click', function (event) {
    if (event.target === mediaViewer) {
        closeMediaViewer();
    }
});

// Nhấn Escape để đóng
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeMediaViewer();
    }
});


    /* =====================================
       7. MOUSE AND TOUCH ROTATION
    ===================================== */

    let isDragging = false;

    let previousX = 0;
    let previousY = 0;

    let velocityX = 0;
    let velocityY = 0;


    canvas.addEventListener('pointerdown', function (event) {

        isDragging = true;

        previousX = event.clientX;
        previousY = event.clientY;

        canvas.setPointerCapture(event.pointerId);

    });


    canvas.addEventListener('pointermove', function (event) {
    if (!isDragging) return;

    velocityX = (event.clientX - previousX) * 0.01;
    velocityY = (event.clientY - previousY) * 0.01;

    // Xoay trái tim
    heart.rotation.y += velocityX;
    heart.rotation.x += velocityY;

    // Xoay toàn bộ ảnh và video
    mediaOrbit.rotation.y += velocityX;
    mediaOrbit.rotation.x += velocityY;

    previousX = event.clientX;
    previousY = event.clientY;
});


    function stopDragging() {
        isDragging = false;
    }


    canvas.addEventListener('pointerup', stopDragging);

    canvas.addEventListener('pointercancel', stopDragging);

    canvas.addEventListener('lostpointercapture', stopDragging);


    /* =====================================
       8. RESPONSIVE CANVAS
    ===================================== */

    function resizeScene() {

        const width = hero.clientWidth;
        const height = hero.clientHeight;

        renderer.setSize(width, height, false);

        camera.aspect = width / height;

        camera.updateProjectionMatrix();

        camera.position.z =
            camera.aspect < 0.8 ? 17 : 12;

    }


    window.addEventListener('resize', resizeScene);

    resizeScene();


    /* =====================================
       9. ANIMATION LOOP
    ===================================== */

    function animate(time) {

        requestAnimationFrame(animate);

        const elapsed = time * 0.001;


        // Main heart rotation

        if (!isDragging) {
    // Xoay trái tim
    heart.rotation.y += velocityX + 0.008;
    heart.rotation.x += velocityY;

    // Xoay quỹ đạo ảnh và video
    mediaOrbit.rotation.y += velocityX + 0.008;
    mediaOrbit.rotation.x += velocityY;

    // Giảm tốc từ từ tạo hiệu ứng quán tính
    velocityX *= 0.95;
    velocityY *= 0.95;

    heart.rotation.x *= 0.98;
    mediaOrbit.rotation.x *= 0.98;
}

        // Heartbeat effect

        const heartbeat =
            1 + 0.04 * Math.pow(
                Math.sin(elapsed * 2.6),
                8
            );

        heart.scale.setScalar(3.4 * heartbeat);


        // Photo rotation

        mediaOrbit.rotation.y = elapsed * 0.12;


        // Small hearts movement

        smallHearts.forEach(function (mesh) {

            const data = mesh.userData;

            mesh.position.y += data.velocity;

            mesh.position.x += Math.sin(
                elapsed * data.speed + data.phase
            ) * 0.006;

            mesh.rotation.y += data.rotationSpeed * 2;

            mesh.rotation.z = Math.sin(
                elapsed * data.speed + data.phase
            ) * 0.4;


            // Reset position

            if (mesh.position.y > 8) {

                mesh.position.y = -8;

                mesh.position.x =
                    (Math.random() - 0.5) * 22;

            }

        });


        renderer.render(scene, camera);

    }


    requestAnimationFrame(animate);


    /* =====================================
       10. ENVELOPE ELEMENTS
    ===================================== */

    const envelope = document.getElementById('envelope');

    const overlay = document.getElementById('letter-overlay');

    const nameInput = document.getElementById('recipient-name');

    const recipientDisplay =
        document.getElementById('recipient-display');

    const closeButton =
        document.getElementById('close-letter');

    const envelopeScene =
        document.querySelector('.envelope-scene');


    /* =====================================
       11. OPEN LETTER
    ===================================== */

    let isLetterOpening = false;

    envelope.addEventListener('click', function () {

        if (isLetterOpening) return;

        isLetterOpening = true;

        const recipientName =
            nameInput.value.trim() || 'em yêu';

        recipientDisplay.textContent = recipientName;

        envelope.classList.add('open');

        setTimeout(function () {

            overlay.classList.add('show');

        }, 1400);

    });


    /* =====================================
       12. CLOSE LETTER
    ===================================== */

    function closeLetter() {

        overlay.classList.remove('show');

        envelope.classList.remove('open');

        isLetterOpening = false;

    }


    closeButton.addEventListener('click', closeLetter);


    // Close when clicking outside the paper

    overlay.addEventListener('click', function (event) {

        if (event.target === overlay) {
            closeLetter();
        }

    });


    // Close with Escape key

    document.addEventListener('keydown', function (event) {

        if (event.key === 'Escape' && overlay.classList.contains('show')) {
            closeLetter();
        }

    });


    /* =====================================
       13. ENVELOPE 3D HOVER EFFECT
    ===================================== */

    envelopeScene.addEventListener('pointermove', function (event) {

        const bounds = envelopeScene.getBoundingClientRect();

        const x =
            (event.clientX - bounds.left) / bounds.width - 0.5;

        const y =
            (event.clientY - bounds.top) / bounds.height - 0.5;

        envelope.style.transform =
            `rotateY(${x * 30}deg) rotateX(${ -y * 24 + 10}deg)`;

    });


    envelopeScene.addEventListener('pointerleave', function () {

        envelope.style.transform = 'rotateX(10deg)';

    });


    envelope.style.transform = 'rotateX(10deg)';


    /* =====================================
       14. FLOATING HEARTS IN LETTER SECTION
    ===================================== */

    const letterSection =
        document.getElementById('love-letter');


    for (let i = 0; i < 14; i++) {

        const heartElement = document.createElement('span');

        heartElement.className = 'floating-heart';

        heartElement.textContent = '♥';

        heartElement.style.left =
            Math.random() * 100 + '%';

        heartElement.style.fontSize =
            10 + Math.random() * 22 + 'px';

        heartElement.style.animationDuration =
            8 + Math.random() * 10 + 's';

        heartElement.style.animationDelay =
            -Math.random() * 12 + 's';

        letterSection.appendChild(heartElement);

    }


    console.log('BearLove đã khởi tạo thành công!');

})();
