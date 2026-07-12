import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  GAME,
  PLAYER_MODEL,
  CAFE,
  CAFE_BANNER,
  CAFE_TRIGGER,
  COLLECTIBLE,
  INTRO_MESSAGE,
  WIN_MESSAGE,
} from "./config.js";

// ------------------------------------------------------------
// Basic scene / renderer / camera
// ------------------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05010f);
scene.fog = new THREE.FogExp2(0x0a0515, 0.012);

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.7, 8);
camera.rotation.order = "YXZ"; // keeps camera.rotation.y as a clean yaw value, matching PointerLockControls

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
document.body.appendChild(renderer.domElement);

document.getElementById("game-title").textContent = GAME.title;
document.getElementById("game-subtitle").textContent = GAME.subtitle;

const maxAniso = renderer.capabilities.getMaxAnisotropy();

// ------------------------------------------------------------
// Lighting
// ------------------------------------------------------------
scene.add(new THREE.AmbientLight(0x8899ff, 0.35));

const moon = new THREE.DirectionalLight(0xbcd2ff, 0.9);
moon.position.set(-30, 40, -10);
moon.castShadow = true;
moon.shadow.mapSize.set(2048, 2048);
moon.shadow.camera.left = -80;
moon.shadow.camera.right = 80;
moon.shadow.camera.top = 80;
moon.shadow.camera.bottom = -80;
scene.add(moon);

// ------------------------------------------------------------
// Ground
// ------------------------------------------------------------
const groundGeo = new THREE.CircleGeometry(GAME.worldRadius + 20, 64);
const groundMat = new THREE.MeshStandardMaterial({
  color: 0x14102a,
  roughness: 1,
  metalness: 0,
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// ------------------------------------------------------------
// Stars
// ------------------------------------------------------------
function makeStars() {
  const count = 2000;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 300 + Math.random() * 200;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = Math.abs(r * Math.cos(phi));
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.2, sizeAttenuation: true });
  scene.add(new THREE.Points(geo, mat));
}
makeStars();

// ------------------------------------------------------------
// Player character (static — no walk animation)
// ------------------------------------------------------------
const player = new THREE.Group();
player.position.set(0, 0, 10);
scene.add(player);

const bobGroup = new THREE.Group();
player.add(bobGroup);

function makePlayerPlaceholder() {
  const mesh = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.4, 1.1, 4, 8),
    new THREE.MeshStandardMaterial({ color: 0xffb6d9, roughness: 0.6, metalness: 0.1 })
  );
  mesh.position.y = 0.95;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

let playerMesh = makePlayerPlaceholder();
bobGroup.add(playerMesh);

// Mini "studio lighting" rig that travels with her, so she's lit
// consistently regardless of where she is in the world
const studioKeyLight = new THREE.PointLight(0xffffff, 6, 10, 2);
studioKeyLight.position.set(0.8, 2.4, 1.6);
player.add(studioKeyLight);

const studioFillLight = new THREE.PointLight(0xffffff, 2.5, 10, 2);
studioFillLight.position.set(-1, 1.6, 1.2);
player.add(studioFillLight);

function applyGLTFMaterialFixes(root) {
  root.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      const mat = child.material;
      if (mat) {
        [mat.map, mat.normalMap, mat.roughnessMap, mat.metalnessMap].forEach((tex) => {
          if (tex) tex.anisotropy = maxAniso;
        });
        if (mat.transparent || mat.alphaTest > 0) {
          mat.alphaToCoverage = true;
        }
        mat.needsUpdate = true;
      }
    }
  });
}

if (PLAYER_MODEL && PLAYER_MODEL.glb) {
  new GLTFLoader().load(
    PLAYER_MODEL.glb,
    (gltf) => {
      const obj = gltf.scene;
      applyGLTFMaterialFixes(obj);

      const box = new THREE.Box3().setFromObject(obj);
      const size = new THREE.Vector3();
      box.getSize(size);
      const scale = PLAYER_MODEL.height / (size.y || 1);
      obj.scale.setScalar(scale);
      obj.position.y = PLAYER_MODEL.yOffset;

      bobGroup.remove(playerMesh);
      playerMesh = obj;
      bobGroup.add(playerMesh);
    },
    undefined,
    () => {
      /* keep placeholder capsule on error */
    }
  );
}

// ------------------------------------------------------------
// Cafe environment
// ------------------------------------------------------------
// Generic helper: some source models come out of Blender/export pipelines
// with wildly unreliable internal scale (a model that should be a few
// meters wide can come out hundreds or thousands of units across). Rather
// than trust a fixed scale multiplier, measure the model after loading and
// fit it to a known target size, then re-center/ground it at the desired
// world position — this works regardless of what unit mess is baked in.
function median(nums) {
  const s = [...nums].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

// Measures each top-level piece separately and hides anything wildly
// larger/further away than the rest — broken/stray geometry (leftover from
// an export mistake) otherwise dominates a whole-object bounding box and
// throws the scale/position off.
function coreBoundingBox(obj) {
  const parts = [];
  obj.children.forEach((child) => {
    const box = new THREE.Box3().setFromObject(child);
    if (box.isEmpty()) return;
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    parts.push({ child, box, center, maxDim: Math.max(size.x, size.y, size.z) });
  });
  if (parts.length === 0) return new THREE.Box3().setFromObject(obj);

  // Use the median center point (robust to outliers, unlike a bounding-box
  // center) to find where the "main cluster" of furniture actually is,
  // ignoring any absurdly huge stray pieces first.
  const pool = parts.filter((p) => p.maxDim < 100);
  const usable = pool.length ? pool : parts;
  const medianCenter = new THREE.Vector3(
    median(usable.map((p) => p.center.x)),
    median(usable.map((p) => p.center.y)),
    median(usable.map((p) => p.center.z))
  );
  const medianDist = median(usable.map((p) => p.center.distanceTo(medianCenter))) || 1;

  const core = new THREE.Box3();
  parts.forEach((p) => {
    const dist = p.center.distanceTo(medianCenter);
    // Exclude pieces that are either absurdly large (a broken stray slab)
    // or positioned way outside where the rest of the furniture actually
    // clusters (a piece that inherited a broken parent transform)
    if (p.maxDim > 100 || dist > medianDist * 5 + 1) {
      p.child.visible = false;
    } else {
      core.union(p.box);
    }
  });
  return core.isEmpty() ? new THREE.Box3().setFromObject(obj) : core;
}

function autoFitAndPlace(obj, { targetWidth, position, rotationY }) {
  obj.rotation.y = rotationY || 0;

  let box = coreBoundingBox(obj);
  let size = new THREE.Vector3();
  box.getSize(size);
  const currentWidth = Math.max(size.x, size.z) || 1;
  const scale = targetWidth / currentWidth;
  obj.scale.setScalar(scale);

  // Recompute after scaling, then shift so it's centered at (x, z) and
  // sitting flush on the ground (y = 0) regardless of its original origin
  box = coreBoundingBox(obj);
  box.getSize(size);
  const center = new THREE.Vector3();
  box.getCenter(center);

  obj.position.x += position.x - center.x;
  obj.position.z += position.z - center.z;
  obj.position.y += (position.y ?? 0) - box.min.y;
}

if (CAFE && CAFE.glb) {
  new GLTFLoader().load(
    CAFE.glb,
    (gltf) => {
      const cafeObj = gltf.scene;
      applyGLTFMaterialFixes(cafeObj);
      autoFitAndPlace(cafeObj, {
        targetWidth: CAFE.targetWidth,
        position: CAFE.position,
        rotationY: CAFE.rotationY,
      });
      scene.add(cafeObj);

      // The café's real PBR materials are invisible under this world's dim
      // night ambient without their own light source — same issue the
      // character had before her studio lights were added.
      const cafeLight = new THREE.PointLight(0xffe8c2, 12, 20, 2);
      cafeLight.position.set(CAFE.position.x, 4, CAFE.position.z);
      scene.add(cafeLight);
    },
    undefined,
    () => {
      /* if this fails, the world just won't have the cafe in it */
    }
  );
}

// Banner / sign above the cafe
if (CAFE_BANNER && CAFE_BANNER.image) {
  const bannerTex = new THREE.TextureLoader().load(CAFE_BANNER.image);
  bannerTex.colorSpace = THREE.SRGBColorSpace;
  bannerTex.anisotropy = maxAniso;
  const bannerMat = new THREE.MeshBasicMaterial({ map: bannerTex, side: THREE.DoubleSide });
  const bannerGeo = new THREE.PlaneGeometry(CAFE_BANNER.width, CAFE_BANNER.height);
  const banner = new THREE.Mesh(bannerGeo, bannerMat);
  banner.position.set(CAFE_BANNER.position.x, CAFE_BANNER.position.y, CAFE_BANNER.position.z);
  banner.rotation.y = CAFE_BANNER.rotationY || 0;
  scene.add(banner);
}

// ------------------------------------------------------------
// Matcha collection minigame
// ------------------------------------------------------------
let matchaTemplate = null;
let matchaScale = 1;
const collectibles = []; // { mesh, collected }
let minigameStarted = false;
let minigameActive = false;
let collectedCount = 0;

if (COLLECTIBLE && COLLECTIBLE.glb) {
  new GLTFLoader().load(
    COLLECTIBLE.glb,
    (gltf) => {
      matchaTemplate = gltf.scene;
      applyGLTFMaterialFixes(matchaTemplate);
      const box = new THREE.Box3().setFromObject(matchaTemplate);
      const size = new THREE.Vector3();
      box.getSize(size);
      matchaScale = COLLECTIBLE.height / (size.y || 1);
    },
    undefined,
    () => {
      /* if this fails, the minigame just won't have anything to spawn */
    }
  );
}

function spawnCollectibles() {
  if (!matchaTemplate) return;
  for (let i = 0; i < COLLECTIBLE.count; i++) {
    const clone = matchaTemplate.clone(true);
    clone.scale.setScalar(matchaScale);
    const angle = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * COLLECTIBLE.spawnRadius;
    clone.position.set(
      COLLECTIBLE.spawnCenter.x + Math.cos(angle) * r,
      0,
      COLLECTIBLE.spawnCenter.z + Math.sin(angle) * r
    );
    clone.userData.bobOffset = Math.random() * Math.PI * 2;
    scene.add(clone);
    collectibles.push({ mesh: clone, collected: false });
  }
  collectedCount = 0;
  updateCounterHUD();
  counterHUD.classList.remove("hidden");
}

function updateCounterHUD() {
  counterHUD.textContent = `Matcha collected: ${collectedCount}/${COLLECTIBLE.count}`;
}

// ------------------------------------------------------------
// Controls: pointer lock (mouse look sets the camera's yaw/pitch,
// which we then read each frame to steer the player and place the
// chase camera behind her)
// ------------------------------------------------------------
const controls = new PointerLockControls(camera, document.body);

const blocker = document.getElementById("blocker");
const startButton = document.getElementById("start-button");
const messageOverlay = document.getElementById("message-overlay");
const messageTitle = document.getElementById("message-title");
const messageText = document.getElementById("message-text");
const messageImage = document.getElementById("message-image");
const messageClose = document.getElementById("message-close");
const hintToast = document.getElementById("hint-toast");
const crosshair = document.getElementById("crosshair");
const counterHUD = document.getElementById("collect-counter");

let gameStarted = false;

startButton.addEventListener("click", () => {
  controls.lock();
});

controls.addEventListener("lock", () => {
  blocker.classList.add("hidden");
  crosshair.style.display = "block";
  if (!gameStarted) {
    gameStarted = true;
    setTimeout(() => showMessage(INTRO_MESSAGE.title, INTRO_MESSAGE.message, null), 300);
  }
});

controls.addEventListener("unlock", () => {
  if (messageOverlay.classList.contains("hidden")) {
    blocker.classList.remove("hidden");
  }
});

const move = { forward: false, backward: false, left: false, right: false };

document.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "KeyW":
    case "ArrowUp":
      move.forward = true;
      break;
    case "KeyS":
    case "ArrowDown":
      move.backward = true;
      break;
    case "KeyA":
    case "ArrowLeft":
      move.left = true;
      break;
    case "KeyD":
    case "ArrowRight":
      move.right = true;
      break;
    case "KeyP":
      tryStartMinigame();
      break;
  }
});

document.addEventListener("keyup", (e) => {
  switch (e.code) {
    case "KeyW":
    case "ArrowUp":
      move.forward = false;
      break;
    case "KeyS":
    case "ArrowDown":
      move.backward = false;
      break;
    case "KeyA":
    case "ArrowLeft":
      move.left = false;
      break;
    case "KeyD":
    case "ArrowRight":
      move.right = false;
      break;
  }
});

// ------------------------------------------------------------
// Cafe proximity trigger
// ------------------------------------------------------------
let nearCafe = false;

function updateCafeTrigger() {
  const dx = player.position.x - CAFE_TRIGGER.position.x;
  const dz = player.position.z - CAFE_TRIGGER.position.z;
  const dist = Math.sqrt(dx * dx + dz * dz);
  nearCafe = dist <= CAFE_TRIGGER.radius;

  if (!minigameStarted && nearCafe) {
    hintToast.textContent = "Press P to start making matcha";
    hintToast.classList.remove("hidden");
  } else if (!minigameActive) {
    hintToast.classList.add("hidden");
  }
}

function tryStartMinigame() {
  if (!controls.isLocked) return;
  if (minigameStarted || !nearCafe) return;
  if (!matchaTemplate) {
    // model's still downloading — let them know instead of silently locking up
    hintToast.textContent = "Still loading the matcha model, try again in a moment...";
    hintToast.classList.remove("hidden");
    return;
  }
  minigameStarted = true;
  minigameActive = true;
  hintToast.classList.add("hidden");
  spawnCollectibles();
}

function updateCollectibles(delta) {
  if (!minigameActive) return;

  collectibles.forEach((item) => {
    if (item.collected) return;

    // gentle bob + spin so they read as pickups
    item.mesh.userData.bobOffset += delta * 2;
    item.mesh.position.y = Math.sin(item.mesh.userData.bobOffset) * 0.08 + 0.05;
    item.mesh.rotation.y += delta * 1.2;

    const dx = player.position.x - item.mesh.position.x;
    const dz = player.position.z - item.mesh.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist <= COLLECTIBLE.collectDistance) {
      item.collected = true;
      scene.remove(item.mesh);
      collectedCount++;
      updateCounterHUD();

      if (collectedCount >= COLLECTIBLE.count) {
        minigameActive = false;
        setTimeout(() => showMessage(WIN_MESSAGE.title, WIN_MESSAGE.message, null), 200);
      }
    }
  });
}

function showMessage(title, text, image) {
  messageTitle.textContent = title;
  messageText.textContent = text;
  if (image) {
    messageImage.src = image;
    messageImage.classList.remove("hidden");
  } else {
    messageImage.classList.add("hidden");
  }
  messageOverlay.classList.remove("hidden");
  controls.unlock();
}

messageClose.addEventListener("click", () => {
  messageOverlay.classList.add("hidden");
  controls.lock();
});

// ------------------------------------------------------------
// Resize
// ------------------------------------------------------------
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ------------------------------------------------------------
// Main loop
// ------------------------------------------------------------
const clock = new THREE.Clock();

// Chase-camera tuning
const CAM_DISTANCE = 4.5;
const CAM_HEIGHT = 2.4;
const MOVE_SPEED = 6.5;

let bobTime = 0;

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.1);

  if (controls.isLocked) {
    const yaw = camera.rotation.y;
    const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
    const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));

    const isMoving = move.forward || move.backward || move.left || move.right;
    const moveVec = new THREE.Vector3();
    if (move.forward) moveVec.add(forward);
    if (move.backward) moveVec.sub(forward);
    if (move.right) moveVec.add(right);
    if (move.left) moveVec.sub(right);

    if (moveVec.lengthSq() > 0) {
      moveVec.normalize().multiplyScalar(MOVE_SPEED * delta);
      player.position.add(moveVec);

      const targetYaw = Math.atan2(moveVec.x, moveVec.z) + Math.PI;
      let diff = targetYaw - player.rotation.y;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      player.rotation.y += diff * Math.min(1, delta * 8);
    }

    const dist = Math.sqrt(player.position.x ** 2 + player.position.z ** 2);
    const maxDist = GAME.worldRadius + 15;
    if (dist > maxDist) {
      player.position.x *= maxDist / dist;
      player.position.z *= maxDist / dist;
    }

    if (isMoving) {
      bobTime += delta * 9;
      bobGroup.position.y = Math.abs(Math.sin(bobTime)) * 0.07;
      bobGroup.rotation.z = Math.sin(bobTime) * 0.025;
    } else {
      bobGroup.position.y = THREE.MathUtils.lerp(bobGroup.position.y, 0, delta * 6);
      bobGroup.rotation.z = THREE.MathUtils.lerp(bobGroup.rotation.z, 0, delta * 6);
    }

    camera.position.set(
      player.position.x - forward.x * CAM_DISTANCE,
      player.position.y + CAM_HEIGHT,
      player.position.z - forward.z * CAM_DISTANCE
    );

    updateCafeTrigger();
    updateCollectibles(delta);
  }

  renderer.render(scene, camera);
}

animate();
