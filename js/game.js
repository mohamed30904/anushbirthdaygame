import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Reflector } from "three/addons/objects/Reflector.js";
import {
  GAME,
  PLAYER_MODEL,
  CAFE,
  CAFE_BANNER,
  CAFE_TRIGGER,
  COLLECTIBLE,
  INTRO_MESSAGE,
  WIN_MESSAGE,
  PLAYER_MODEL_2,
  GYM,
  GYM_TRIGGER,
  STRENGTH,
  GYM_EQUIPMENT,
  LEVEL2_INTRO_MESSAGE,
  LEVEL2_WIN_MESSAGE,
  PLAYER_MODEL_3,
  LOYOLA,
  LOYOLA_TRIGGER,
  LEVEL3_INTRO_MESSAGE,
  TITRATION,
  FLASK,
  MOLECULE_BUILDER,
  LEVEL3_WIN_MESSAGE,
  LEVEL1_THEME,
  LEVEL1_SPAWN,
  LEVEL2_THEME,
  LEVEL2_SPAWN,
  LEVEL3_THEME,
  LEVEL3_SPAWN,
  LEVEL3_GARDEN_PROPS,
  PLAYER_MODEL_4,
  LEVEL4_THEME,
  LEVEL4_SPAWN,
  MIRRORS,
  MIRROR_SELFIE,
  LEVEL4_INTRO_MESSAGE,
  LEVEL4_WIN_MESSAGE,
  CLOUDS,
  URBAN_PROPS,
  CITY_PROPS,
  PHOTO_WALL_PROPS,
  JON,
  DESTROY_JON,
  LEVEL5_THEME,
  LEVEL5_SPAWN,
  LEVEL5_INTRO_MESSAGE,
  GARDEN_PROPS,
  HEARTS,
  CANDLES,
  CAKES,
  MESSAGE_WALL,
  GIANT_MATCHA,
  BIRD_COMPANION,
  BIRD_MESSAGES,
} from "./config.js";

// ------------------------------------------------------------
// Renderer / camera — shared across every level. Each level, however,
// gets its own completely separate THREE.Scene (own ground, own lighting,
// own background/fog color, own props) — see createLevelScene() below.
// Nothing is shared between them; the player and camera are the only
// things that move from one scene into the next at a level transition.
// ------------------------------------------------------------
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.7, 8);

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

// Builds one level's fully self-contained scene: its own background/fog
// color, its own ambient + sun light, its own ground disc. Pass a THEME
// object from config.js (LEVEL1_THEME / LEVEL2_THEME / LEVEL3_THEME) to
// give that level its own look without touching any other level.
function createLevelScene(theme) {
  const levelScene = new THREE.Scene();
  levelScene.background = new THREE.Color(theme.background);
  levelScene.fog = new THREE.FogExp2(theme.fogColor, theme.fogDensity);

  levelScene.add(new THREE.AmbientLight(0xffffff, 0.85));

  const sun = new THREE.DirectionalLight(0xfff6e0, 1.3);
  sun.position.set(-30, 40, -10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -80;
  sun.shadow.camera.right = 80;
  sun.shadow.camera.top = 80;
  sun.shadow.camera.bottom = -80;
  levelScene.add(sun);

  const groundGeo = new THREE.CircleGeometry(
    (theme.groundRadius ?? GAME.worldRadius) + 20,
    64
  );
  const groundMat = new THREE.MeshStandardMaterial({
    color: theme.groundColor,
    roughness: 1,
    metalness: 0,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  levelScene.add(ground);

  return levelScene;
}

// ------------------------------------------------------------
// Clouds — soft, faded white cloud cover (no textures/GLBs needed), added
// independently to every level's own scene so each level has its own set
// drifting overhead. Built from camera-facing sprites with a soft radial
// gradient (solid white center fading to fully transparent edges) instead
// of solid shapes, so they blend gently into the sky/fog instead of
// reading as distinct hard-edged objects. `cloudRefs` (used in animate())
// tracks all of them across every scene so they keep drifting no matter
// which level is currently active.
// ------------------------------------------------------------
const cloudRefs = []; // { group, speed }

// A soft circular gradient, generated once and reused by every cloud
// sprite in every scene — white in the middle, fading all the way to
// transparent at the edge, so overlapping sprites blend into soft, hazy
// shapes rather than showing a hard circular outline.
function createCloudTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  gradient.addColorStop(0, "rgba(255,255,255,0.85)");
  gradient.addColorStop(0.45, "rgba(255,255,255,0.4)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const cloudTexture = createCloudTexture();

function createCloudCluster(scale, opacity) {
  const group = new THREE.Group();
  const puffCount = THREE.MathUtils.randInt(
    CLOUDS.puffsPerCluster.min,
    CLOUDS.puffsPerCluster.max
  );
  for (let i = 0; i < puffCount; i++) {
    const puffScale = THREE.MathUtils.randFloat(0.7, 1.3) * scale;
    const mat = new THREE.SpriteMaterial({
      map: cloudTexture,
      color: CLOUDS.color,
      transparent: true,
      opacity: opacity * THREE.MathUtils.randFloat(0.8, 1),
      depthWrite: false,
      fog: true,
    });
    const puff = new THREE.Sprite(mat);
    // Flattened a bit vertically so clusters read as clouds, not balloons.
    puff.scale.set(puffScale, puffScale * 0.6, 1);
    puff.position.set(
      THREE.MathUtils.randFloatSpread(scale * 1.2),
      THREE.MathUtils.randFloatSpread(scale * 0.25),
      THREE.MathUtils.randFloatSpread(scale * 1.2)
    );
    group.add(puff);
  }
  return group;
}

function addCloudsToScene(targetScene) {
  if (!CLOUDS) return;
  for (let i = 0; i < CLOUDS.count; i++) {
    const scale = THREE.MathUtils.randFloat(CLOUDS.scale.min, CLOUDS.scale.max);
    const opacity = THREE.MathUtils.randFloat(CLOUDS.opacity.min, CLOUDS.opacity.max);
    const cluster = createCloudCluster(scale, opacity);

    // Uniform coverage across the whole spawn disc, not just clustered
    // near the center, so there's soft cloud cover overhead everywhere.
    const angle = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * CLOUDS.radius;
    cluster.position.set(
      Math.cos(angle) * r,
      THREE.MathUtils.randFloat(CLOUDS.height.min, CLOUDS.height.max),
      Math.sin(angle) * r
    );
    targetScene.add(cluster);

    cloudRefs.push({
      group: cluster,
      speed:
        THREE.MathUtils.randFloat(CLOUDS.driftSpeed.min, CLOUDS.driftSpeed.max) *
        (Math.random() < 0.5 ? -1 : 1),
    });
  }
}

// ------------------------------------------------------------
// Level 1 urban surroundings — a cute little procedural street scene
// around the café (light stone plaza, pastel buildings with lit windows,
// street lamps, planter bushes). All simple shapes, no GLBs needed, and
// only ever added to sceneLevel1 — no other level sees any of this.
// ------------------------------------------------------------
function createBuilding(cfg) {
  const group = new THREE.Group();

  const wallMat = new THREE.MeshStandardMaterial({
    color: cfg.color,
    roughness: 0.85,
    metalness: 0.05,
  });
  const wall = new THREE.Mesh(new THREE.BoxGeometry(cfg.width, cfg.height, cfg.depth), wallMat);
  wall.position.y = cfg.height / 2;
  wall.castShadow = true;
  wall.receiveShadow = true;
  group.add(wall);

  // Two roof styles: "pyramid" (a cute little peaked roof, the level 1
  // village look) or "flat" (a thin parapet cap, for skyscrapers — the
  // level 2 city look). Defaults to pyramid so level 1's config, which
  // doesn't set roofStyle, keeps looking exactly the way it did.
  const roofStyle = cfg.roofStyle || "pyramid";
  const roofMat = new THREE.MeshStandardMaterial({
    color: cfg.roofColor,
    roughness: 0.9,
    metalness: 0,
  });

  if (roofStyle === "flat") {
    const capHeight = Math.max(0.3, cfg.height * 0.03);
    const cap = new THREE.Mesh(
      new THREE.BoxGeometry(cfg.width * 1.03, capHeight, cfg.depth * 1.03),
      roofMat
    );
    cap.position.y = cfg.height + capHeight / 2;
    cap.castShadow = true;
    group.add(cap);
  } else {
    // Simple square pyramid roof — a 4-sided cone rotated 45° so its
    // faces line up with the box's flat sides instead of its corners.
    const roofHeight = cfg.height * 0.35;
    const roofRadius = Math.max(cfg.width, cfg.depth) * 0.72;
    const roof = new THREE.Mesh(new THREE.ConeGeometry(roofRadius, roofHeight, 4), roofMat);
    roof.position.y = cfg.height + roofHeight / 2;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);
  }

  // Glowing windows on the front face for a lit-up look at any time of
  // day — emissive, so they read as "lit" without needing an actual light
  // source per window. Warm yellow for the cute village style, cool
  // glassy blue-white for skyscrapers, unless overridden per building.
  const windowColor = cfg.windowColor ?? (roofStyle === "flat" ? 0xcfe8ff : 0xfff2b8);
  const windowMat = new THREE.MeshStandardMaterial({
    color: windowColor,
    emissive: windowColor,
    emissiveIntensity: roofStyle === "flat" ? 0.5 : 0.6,
    roughness: 0.6,
  });
  const cols = cfg.windowCols || 2;
  const rows = cfg.windowRows || 2;
  const windowSize = Math.min(cfg.width / cols, cfg.height / rows) * 0.45;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(windowSize, windowSize), windowMat);
      const spanX = cfg.width * 0.82;
      const spanY = cfg.height * 0.82;
      const x = -spanX / 2 + (c + 0.5) * (spanX / cols);
      const y = cfg.height * 0.09 + (r + 0.5) * (spanY / rows);
      win.position.set(x, y, cfg.depth / 2 + 0.02);
      group.add(win);
    }
  }

  group.position.set(cfg.position.x, cfg.position.y, cfg.position.z);
  group.rotation.y = cfg.rotationY || 0;
  return group;
}

function createStreetLamp(x, z) {
  const group = new THREE.Group();

  const poleMat = new THREE.MeshStandardMaterial({
    color: 0x2b2b2b,
    roughness: 0.6,
    metalness: 0.4,
  });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 3, 8), poleMat);
  pole.position.y = 1.5;
  pole.castShadow = true;
  group.add(pole);

  const headMat = new THREE.MeshStandardMaterial({
    color: 0xfff2c2,
    emissive: 0xffe9a8,
    emissiveIntensity: 0.9,
    roughness: 0.4,
  });
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), headMat);
  head.position.y = 3.05;
  group.add(head);

  group.position.set(x, 0, z);
  return group;
}

function createPlanter(x, z) {
  const group = new THREE.Group();

  const potMat = new THREE.MeshStandardMaterial({ color: 0x9c6b45, roughness: 0.9 });
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.28, 0.4, 12), potMat);
  pot.position.y = 0.2;
  pot.castShadow = true;
  pot.receiveShadow = true;
  group.add(pot);

  const bushMat = new THREE.MeshStandardMaterial({ color: 0x5f9e6f, roughness: 0.9 });
  const bush = new THREE.Mesh(new THREE.IcosahedronGeometry(0.45, 0), bushMat);
  bush.position.y = 0.65;
  bush.castShadow = true;
  group.add(bush);

  group.position.set(x, 0, z);
  return group;
}

// A simple park bench — wooden slat seat + backrest on two metal-look
// legs. Procedural, no GLB needed, matching the style of the other
// small props (streetlamps/planters) reused across every level's garden.
function createBench(cfg) {
  const group = new THREE.Group();

  const woodMat = new THREE.MeshStandardMaterial({ color: 0x9c6b45, roughness: 0.85 });
  const legMat = new THREE.MeshStandardMaterial({ color: 0x2b2b2b, roughness: 0.5, metalness: 0.4 });

  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.5), woodMat);
  seat.position.y = 0.45;
  seat.castShadow = true;
  seat.receiveShadow = true;
  group.add(seat);

  const back = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 0.08), woodMat);
  back.position.set(0, 0.72, -0.21);
  back.castShadow = true;
  group.add(back);

  [-0.6, 0.6].forEach((x) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.45), legMat);
    leg.position.set(x, 0.225, 0);
    leg.castShadow = true;
    group.add(leg);
  });

  group.position.set(cfg.x, 0, cfg.z);
  group.rotation.y = cfg.rotationY || 0;
  return group;
}

// A straight road segment: dark asphalt strip with a dashed white center
// line and a lighter concrete sidewalk running along each side. `length`
// runs along the segment's own local Z before rotationY is applied, so
// rotationY: 0 makes a north-south street and Math.PI/2 makes east-west.
function createRoad(cfg) {
  const group = new THREE.Group();

  const asphaltMat = new THREE.MeshStandardMaterial({ color: 0x3a3d42, roughness: 1 });
  const asphalt = new THREE.Mesh(new THREE.PlaneGeometry(cfg.width, cfg.length), asphaltMat);
  asphalt.rotation.x = -Math.PI / 2;
  asphalt.position.y = 0.005;
  asphalt.receiveShadow = true;
  group.add(asphalt);

  const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0xc7c7c7, roughness: 1 });
  const sidewalkWidth = 1.6;
  [-1, 1].forEach((side) => {
    const sidewalk = new THREE.Mesh(
      new THREE.PlaneGeometry(sidewalkWidth, cfg.length),
      sidewalkMat
    );
    sidewalk.rotation.x = -Math.PI / 2;
    sidewalk.position.set(side * (cfg.width / 2 + sidewalkWidth / 2), 0.006, 0);
    sidewalk.receiveShadow = true;
    group.add(sidewalk);
  });

  const dashMat = new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 0.8 });
  const dashLength = 1.2;
  const gap = 1.4;
  const step = dashLength + gap;
  const count = Math.floor(cfg.length / step);
  for (let i = 0; i < count; i++) {
    const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.18, dashLength), dashMat);
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(0, 0.007, -cfg.length / 2 + step * i + dashLength / 2);
    group.add(dash);
  }

  group.position.set(cfg.position.x, 0, cfg.position.z);
  group.rotation.y = cfg.rotationY || 0;
  return group;
}

// Draws one of a few fun, painted-mural-style designs onto a canvas —
// used as the face texture for a photo-op wall panel. All procedural, no
// image files needed.
function drawHeartShape(ctx, x, y, size) {
  const s = size / 16;
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(0, 4 * s);
  ctx.bezierCurveTo(0, 2 * s, -6 * s, -6 * s, -8 * s, 0);
  ctx.bezierCurveTo(-10 * s, 6 * s, -4 * s, 10 * s, 0, 14 * s);
  ctx.bezierCurveTo(4 * s, 10 * s, 10 * s, 6 * s, 8 * s, 0);
  ctx.bezierCurveTo(6 * s, -6 * s, 0, 2 * s, 0, 4 * s);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function createMuralTexture(style, text) {
  const w = 512;
  const h = 342;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");

  function verticalGradient(colors) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    colors.forEach((c, i) => g.addColorStop(i / (colors.length - 1), c));
    return g;
  }

  switch (style) {
    case "sunset": {
      ctx.fillStyle = verticalGradient(["#ff9a8b", "#ff6a88", "#a86bce"]);
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,235,180,0.9)";
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.62, 85, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.ellipse(w * (0.12 + i * 0.26), h * 0.85, 130, 36, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "confetti": {
      ctx.fillStyle = "#ffe6f0";
      ctx.fillRect(0, 0, w, h);
      const colors = ["#ff5f9e", "#ffd166", "#06d6a0", "#118ab2", "#8a5cf6"];
      for (let i = 0; i < 140; i++) {
        ctx.fillStyle = colors[i % colors.length];
        const x = Math.random() * w;
        const y = Math.random() * h;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.random() * Math.PI * 2);
        ctx.fillRect(-6, -3, 12, 6);
        ctx.restore();
      }
      break;
    }
    case "hearts": {
      ctx.fillStyle = "#ffd9ec";
      ctx.fillRect(0, 0, w, h);
      const colors = ["#ff8ac4", "#ff5f9e", "#ffffff"];
      for (let i = 0; i < 26; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const s = 14 + Math.random() * 22;
        ctx.fillStyle = colors[i % colors.length];
        drawHeartShape(ctx, x, y, s);
      }
      break;
    }
    case "phrase":
    default: {
      ctx.fillStyle = verticalGradient(["#fff2c2", "#ffd6e0"]);
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#ff5f9e";
      ctx.font = "bold 56px Georgia";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text || "SMILE!", w / 2, h / 2);
      break;
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// One painted mural panel — a shallow box (so it reads as a real wall,
// not a flat cutout) with the mural texture on its front face only.
function createMuralWall(cfg) {
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xf2ede4, roughness: 0.9 });
  const muralMat = new THREE.MeshStandardMaterial({
    map: createMuralTexture(cfg.style, cfg.text),
    roughness: 0.85,
  });
  const thickness = 0.3;
  // BoxGeometry's per-face material order is [+X, -X, +Y, -Y, +Z, -Z] —
  // the mural goes on the front (+Z) face, everything else is plain wall.
  const materials = [wallMat, wallMat, wallMat, wallMat, muralMat, wallMat];
  const wall = new THREE.Mesh(new THREE.BoxGeometry(cfg.width, cfg.height, thickness), materials);
  wall.position.set(cfg.position.x, cfg.position.y + cfg.height / 2, cfg.position.z);
  wall.rotation.y = cfg.rotationY || 0;
  wall.castShadow = true;
  wall.receiveShadow = true;
  return wall;
}

// A glowing neon-style sign — canvas text with a soft color glow,
// rendered as a camera-facing sprite.
function createNeonSign(cfg) {
  const canvas = document.createElement("canvas");
  const H = 160;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const colorHex = `#${new THREE.Color(cfg.color).getHexString()}`;
  const text = cfg.text || "SMILE";

  // Auto-sizes the canvas width (shrinking the font a bit if needed) so a
  // longer phrase doesn't get cut off/illegible on a sign originally sized
  // for a short word like "SMILE" — short text still ends up on the same
  // 512px-wide canvas as before, unchanged.
  const padding = 60;
  let fontSize = 84;
  const minFontSize = 40;
  let width;
  for (;;) {
    ctx.font = `bold ${fontSize}px 'Trebuchet MS', sans-serif`;
    width = ctx.measureText(text).width + padding * 2;
    if (width <= 1400 || fontSize <= minFontSize) break;
    fontSize -= 4;
  }
  canvas.width = Math.max(512, width);
  ctx.font = `bold ${fontSize}px 'Trebuchet MS', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = colorHex;
  ctx.shadowBlur = 28;
  ctx.fillStyle = colorHex;
  ctx.fillText(text, canvas.width / 2, H / 2);
  ctx.shadowBlur = 12;
  ctx.fillText(text, canvas.width / 2, H / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false })
  );
  const targetHeight = 1.3;
  sprite.scale.set(targetHeight * (canvas.width / H), targetHeight, 1);
  sprite.position.set(cfg.position.x, cfg.position.y, cfg.position.z);
  return sprite;
}

// A row of small glowing bulbs sagging gently between two x positions —
// simple string lights strung along the top of the mural wall.
function createStringLights(cfg) {
  const group = new THREE.Group();
  const bulbMat = new THREE.MeshStandardMaterial({
    color: cfg.color,
    emissive: cfg.color,
    emissiveIntensity: 0.9,
    roughness: 0.4,
  });
  const count = cfg.bulbCount || 12;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const x = THREE.MathUtils.lerp(cfg.xStart, cfg.xEnd, t);
    const sag = Math.sin(t * Math.PI) * (cfg.sag || 0.3);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), bulbMat);
    bulb.position.set(x, cfg.y - sag, cfg.z);
    group.add(bulb);
  }
  return group;
}

function addUrbanProps(targetScene, props) {
  if (!props) return;

  if (props.plaza) {
    const plazaGeo = new THREE.CircleGeometry(props.plaza.radius, 48);
    const plazaMat = new THREE.MeshStandardMaterial({ color: props.plaza.color, roughness: 1 });
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.set(props.plaza.position.x, props.plaza.position.y, props.plaza.position.z);
    plaza.receiveShadow = true;
    targetScene.add(plaza);
  }

  (props.roads || []).forEach((cfg) => targetScene.add(createRoad(cfg)));
  (props.buildings || []).forEach((cfg) => {
    targetScene.add(createBuilding(cfg));
    // A rectangular collider matching the building's actual footprint —
    // a circle sized off the longer side left the shorter side's corners
    // (and for a rectangular building, a fair bit of its length) walkable.
    // These are all built with rotationY 0 (upright, axis-aligned), so a
    // plain axis-aligned box matches exactly.
    addBoxCollider(
      targetScene,
      cfg.position.x - cfg.width / 2,
      cfg.position.x + cfg.width / 2,
      cfg.position.z - cfg.depth / 2,
      cfg.position.z + cfg.depth / 2
    );
  });
  (props.streetLamps || []).forEach((p) => {
    targetScene.add(createStreetLamp(p.x, p.z));
    addCollider(targetScene, p.x, p.z, 0.25);
  });
  (props.treesOrPlanters || []).forEach((p) => {
    targetScene.add(createPlanter(p.x, p.z));
    addCollider(targetScene, p.x, p.z, 0.5);
  });
  (props.benches || []).forEach((cfg) => {
    targetScene.add(createBench(cfg));
    addCollider(targetScene, cfg.x, cfg.z, 0.8);
  });
  (props.muralWalls || []).forEach((cfg) => {
    targetScene.add(createMuralWall(cfg));
    addCollider(targetScene, cfg.position.x, cfg.position.z, (cfg.width / 2) * 0.5);
  });
  if (props.neonSign) targetScene.add(createNeonSign(props.neonSign));
  if (props.stringLights) targetScene.add(createStringLights(props.stringLights));
}

// ------------------------------------------------------------
// LEVEL 5 GARDEN: hedges, floating hearts, candle ring, cake ring, and
// the final message wall. All procedural except the cakes (Cake.glb).
// ------------------------------------------------------------

// A single trimmed hedge "bush" — a squat green icosahedron sitting low
// to the ground, used all the way around the garden's hedge ring.
function createHedge(x, z) {
  const mat = new THREE.MeshStandardMaterial({ color: 0x4f8a52, roughness: 0.95 });
  const hedge = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 0), mat);
  hedge.position.set(x, 0.75, z);
  hedge.scale.y = 0.65;
  hedge.castShadow = true;
  hedge.receiveShadow = true;
  return hedge;
}

// A single cute little flower — thin green stem, a ring of small rounded
// petals around a bright center, all procedural (no GLB). Colors are
// randomized from a soft pastel palette so a scattered patch of them
// looks varied instead of a wall of identical clones.
const FLOWER_PALETTE = [0xff8fc0, 0xffd166, 0xc7a8f0, 0xff6f91, 0xffffff, 0xa0e7c4];
function createFlower(x, z, scale = 1) {
  const group = new THREE.Group();

  const stemMat = new THREE.MeshStandardMaterial({ color: 0x4f8a52, roughness: 0.9 });
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.3, 6), stemMat);
  stem.position.y = 0.15;
  group.add(stem);

  const petalColor = FLOWER_PALETTE[Math.floor(Math.random() * FLOWER_PALETTE.length)];
  const petalMat = new THREE.MeshStandardMaterial({ color: petalColor, roughness: 0.6 });
  const petalCount = 5;
  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2;
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), petalMat);
    petal.position.set(Math.cos(angle) * 0.06, 0.31, Math.sin(angle) * 0.06);
    petal.scale.set(1, 0.6, 1);
    group.add(petal);
  }

  const centerMat = new THREE.MeshStandardMaterial({
    color: 0xffe066,
    emissive: 0xffe066,
    emissiveIntensity: 0.3,
    roughness: 0.5,
  });
  const centerDot = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), centerMat);
  centerDot.position.y = 0.31;
  group.add(centerDot);

  group.position.set(x, 0, z);
  group.scale.setScalar(scale);
  group.rotation.y = Math.random() * Math.PI * 2;
  return group;
}

function addGardenProps(targetScene, props) {
  if (!props) return;

  if (props.hedgeRing) {
    const { center, radius, count } = props.hedgeRing;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = center.x + Math.cos(angle) * radius;
      const z = center.z + Math.sin(angle) * radius;
      targetScene.add(createHedge(x, z));
      addCollider(targetScene, x, z, 0.75);

      // A little flower bed lining the inside of the hedge ring, tucked
      // between each hedge bush — turns the plain green border into a
      // proper cottage-garden flowerbed.
      const innerR = radius - 1.4;
      const fx = center.x + Math.cos(angle + Math.PI / count) * innerR;
      const fz = center.z + Math.sin(angle + Math.PI / count) * innerR;
      targetScene.add(createFlower(fx, fz, 0.9 + Math.random() * 0.3));
    }
  }

  (props.treesOrPlanters || []).forEach((p) => {
    targetScene.add(createPlanter(p.x, p.z));
    addCollider(targetScene, p.x, p.z, 0.5);
  });

  // A scattered meadow of little flowers across the open lawn — purely
  // decorative (no collision, they're tiny and walkable-over like grass).
  if (props.flowerMeadow) {
    const { center, radius, count } = props.flowerMeadow;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * radius;
      const x = center.x + Math.cos(angle) * r;
      const z = center.z + Math.sin(angle) * r;
      if (isBlocked(targetScene, x, z)) continue;
      targetScene.add(createFlower(x, z, 0.7 + Math.random() * 0.5));
    }
  }
}

// Floating hearts — same soft radial-gradient sprite trick as the clouds
// (createCloudTexture), just drawn as a heart and tinted pink, then set to
// drift upward instead of sideways. `heartRefs` is drifted every frame in
// animate() regardless of which scene is active, same pattern as clouds.
let heartTexture = null;
function getHeartTexture() {
  if (heartTexture) return heartTexture;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ff6fa8";
  drawHeartShape(ctx, size / 2, size / 2, size * 0.8);
  heartTexture = new THREE.CanvasTexture(canvas);
  return heartTexture;
}

const heartRefs = []; // { sprite, speed, ceiling, floor, scene }

function addHeartsToScene(targetScene) {
  const mat = new THREE.SpriteMaterial({
    map: getHeartTexture(),
    color: HEARTS.color,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });
  for (let i = 0; i < HEARTS.count; i++) {
    const sprite = new THREE.Sprite(mat.clone());
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * HEARTS.radius;
    const x = HEARTS.center.x + Math.cos(angle) * r;
    const z = HEARTS.center.z + Math.sin(angle) * r;
    const y = THREE.MathUtils.randFloat(HEARTS.height.min, HEARTS.height.max);
    const scale = THREE.MathUtils.randFloat(HEARTS.scale.min, HEARTS.scale.max);
    sprite.position.set(x, y, z);
    sprite.scale.set(scale, scale, 1);
    targetScene.add(sprite);
    heartRefs.push({
      sprite,
      speed: THREE.MathUtils.randFloat(HEARTS.driftSpeed.min, HEARTS.driftSpeed.max),
      floor: HEARTS.height.min,
      ceiling: HEARTS.height.max,
      scene: targetScene,
    });
  }
}

// The candle ring — a striped cylinder body with a small glowing flame on
// top, no real point light per candle (22 live lights would be overkill) —
// the flame's own emissive material reads as "lit" on its own.
const candleFlameRefs = []; // material refs, flickered in animate()
const candleFlameMeshes = []; // the actual flame meshes, hidden when blown out
let candlesBlownOut = false;

function createCandle(x, z) {
  const group = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: CANDLES.bodyColor,
    roughness: 0.6,
  });
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.1, CANDLES.height, 12),
    bodyMat
  );
  body.position.y = CANDLES.height / 2;
  body.castShadow = true;
  group.add(body);

  const stripeMat = new THREE.MeshStandardMaterial({
    color: CANDLES.stripeColor,
    roughness: 0.6,
  });
  for (let i = 0; i < 3; i++) {
    const stripe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.101, 0.101, 0.08, 12),
      stripeMat
    );
    stripe.position.y = CANDLES.height * (0.25 + i * 0.25);
    group.add(stripe);
  }

  const wickMat = new THREE.MeshStandardMaterial({ color: 0x2b2b2b, roughness: 0.9 });
  const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.08, 6), wickMat);
  wick.position.y = CANDLES.height + 0.04;
  group.add(wick);

  const flameMat = new THREE.MeshStandardMaterial({
    color: CANDLES.flameColor,
    emissive: CANDLES.flameColor,
    emissiveIntensity: 1.4,
    roughness: 0.3,
  });
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.16, 8), flameMat);
  flame.position.y = CANDLES.height + 0.14;
  group.add(flame);
  candleFlameRefs.push(flameMat);
  candleFlameMeshes.push(flame);

  group.position.set(x, 0, z);
  return group;
}

function addCandlesToScene(targetScene) {
  for (let i = 0; i < CANDLES.count; i++) {
    const angle = (i / CANDLES.count) * Math.PI * 2;
    const x = CANDLES.center.x + Math.cos(angle) * CANDLES.radius;
    const z = CANDLES.center.z + Math.sin(angle) * CANDLES.radius;
    targetScene.add(createCandle(x, z));
  }
}

// Gentle candle-flame flicker — modulates each flame's emissive intensity
// with a bit of per-flame randomness so they don't all pulse in lockstep.
// Called every frame in animate() regardless of which scene is active.
function updateCandleFlicker(elapsed) {
  if (candlesBlownOut) return;
  candleFlameRefs.forEach((mat, i) => {
    const flicker = Math.sin(elapsed * (6 + (i % 5)) + i) * 0.3 + 1.4;
    mat.emissiveIntensity = flicker;
  });
}

// Shows the "make a wish" hint while she's standing near the candle ring,
// same pattern as the other proximity triggers (updateCafeTrigger, etc.).
function updateCandleTrigger() {
  if (currentScene !== sceneLevel5 || candlesBlownOut) return;
  const dx = player.position.x - CANDLES.center.x;
  const dz = player.position.z - CANDLES.center.z;
  const dist = Math.sqrt(dx * dx + dz * dz);
  if (dist <= CANDLES.radius + 3) {
    hintToast.textContent = "Make a wish and press space";
    hintToast.classList.remove("hidden");
  } else {
    hintToast.classList.add("hidden");
  }
}

// Press Space in the garden ending to blow out all 22 candles at once —
// a little "make a wish" moment. One-shot (can't be re-lit).
function tryBlowCandles() {
  if (currentScene !== sceneLevel5 || candlesBlownOut) return;
  candlesBlownOut = true;
  candleFlameMeshes.forEach((flame) => {
    flame.visible = false;
  });
  hintToast.textContent = "🎂 Make a wish...";
  hintToast.classList.remove("hidden");
  setTimeout(() => hintToast.classList.add("hidden"), 2500);
}

// 22 little birthday cakes — Cake.glb loaded once, then cloned around a
// ring just outside the candles.
function addCakesToScene(targetScene) {
  if (!CAKES || !CAKES.glb) return;
  loadGLBWithRetry(
    CAKES.glb,
    (gltf) => {
      const master = gltf.scene;
      applyGLTFMaterialFixes(master);

      // Measure the RAW (unscaled) model once — every cake (the 21 regular
      // ones and the one huge centerpiece) computes its own scale from
      // this same raw box, instead of baking one fixed scale onto `master`
      // itself, so the centerpiece can be a completely different size.
      master.updateMatrixWorld(true);
      const rawBox = coreBoundingBox(master, CAKES.excludeNodeNames || []);
      const rawSize = new THREE.Vector3();
      rawBox.getSize(rawSize);
      const rawWidth = Math.max(rawSize.x, rawSize.z) || 1;

      // Rotation is yaw-only (around Y), so it never changes how far the
      // model's bottom sits below its own origin — that lets us compute
      // each clone's ground offset directly from the raw box and its own
      // scale, without re-measuring a fresh bounding box per clone.
      function placeCake(targetWidth, x, z) {
        const scale = targetWidth / rawWidth;
        const cake = master.clone(true);
        cake.scale.setScalar(scale);
        const groundOffset = -rawBox.min.y * scale;
        cake.position.set(x, groundOffset, z);
        cake.rotation.y = Math.random() * Math.PI * 2;
        targetScene.add(cake);
      }

      // 21 regular-sized cakes around the ring.
      for (let i = 0; i < CAKES.count; i++) {
        const angle = (i / CAKES.count) * Math.PI * 2;
        const x = CAKES.center.x + Math.cos(angle) * CAKES.radius;
        const z = CAKES.center.z + Math.sin(angle) * CAKES.radius;
        placeCake(CAKES.targetWidth, x, z);
      }

      // One huge centerpiece cake right in the middle of the ring.
      if (CAKES.centerCakeTargetWidth) {
        placeCake(CAKES.centerCakeTargetWidth, CAKES.center.x, CAKES.center.z);
      }
    },
    { label: "the cakes" }
  );
}

// The finale message wall — a painted panel with your own text on canvas
// (edit MESSAGE_WALL.text in config.js), framed, standing just past the
// candle/cake ring at the far end of the garden.
// Greedy word-wrap: breaks `text` into lines that each fit within
// maxWidth at the 2D context's currently-set font, so a long message
// (any length — this doesn't assume how much she'll eventually write)
// still lays out cleanly instead of running off the edge of the canvas.
function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  words.forEach((word) => {
    const test = current ? `${current} ${word}` : word;
    if (current && ctx.measureText(test).width > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  });
  if (current) lines.push(current);
  return lines;
}

function createMessageWallTexture() {
  const w = 1400;
  const h = 800;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = `#${new THREE.Color(MESSAGE_WALL.bgColor).getHexString()}`;
  ctx.fillRect(0, 0, w, h);

  // A few soft decorative hearts scattered behind the text.
  ctx.fillStyle = "rgba(255,138,196,0.25)";
  for (let i = 0; i < 14; i++) {
    drawHeartShape(ctx, 70 + Math.random() * (w - 140), 50 + Math.random() * (h - 100), 34 + Math.random() * 36);
  }

  ctx.fillStyle = MESSAGE_WALL.textColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Long messages (this one included) auto-wrap to fit the wall — manual
  // "\n" breaks in MESSAGE_WALL.text still work as paragraph breaks, but
  // each paragraph itself gets word-wrapped instead of running off-canvas.
  const fontSize = 44;
  ctx.font = `bold ${fontSize}px Georgia`;
  const maxWidth = w * 0.84;
  const paragraphs = (MESSAGE_WALL.text || "").split("\n");
  const lines = [];
  paragraphs.forEach((p) => {
    if (p.trim() === "") {
      lines.push("");
    } else {
      lines.push(...wrapText(ctx, p, maxWidth));
    }
  });

  const lineHeight = fontSize * 1.35;
  const startY = h / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, i) => {
    ctx.fillText(line, w / 2, startY + i * lineHeight);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createMessageWall() {
  const frameMat = new THREE.MeshStandardMaterial({
    color: MESSAGE_WALL.frameColor,
    roughness: 0.7,
  });
  const panelMat = new THREE.MeshStandardMaterial({
    map: createMessageWallTexture(),
    roughness: 0.85,
  });
  const thickness = 0.35;
  // BoxGeometry face order [+X, -X, +Y, -Y, +Z, -Z] — panel texture on the
  // front (+Z) face (the side she walks up to), everything else framed.
  const materials = [frameMat, frameMat, frameMat, frameMat, panelMat, frameMat];
  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(MESSAGE_WALL.width, MESSAGE_WALL.height, thickness),
    materials
  );
  wall.position.set(
    MESSAGE_WALL.position.x,
    MESSAGE_WALL.position.y + MESSAGE_WALL.height / 2,
    MESSAGE_WALL.position.z
  );
  wall.castShadow = true;
  wall.receiveShadow = true;
  return wall;
}

// ------------------------------------------------------------
// Collision so the player can't walk through buildings/props. Two shapes:
//   - circle: { scene, shape: "circle", x, z, radius } — fine for roughly
//     round/small props (lamps, planters, equipment, Jon).
//   - box: { scene, shape: "box", minX, maxX, minZ, maxZ } — an
//     axis-aligned rectangle, used for actual buildings. A circle sized to
//     a rectangular building's widest dimension still leaves its corners
//     (and, for a long/thin footprint, most of its sides) uncovered —
//     which was exactly the bug where she could walk into the gym/Loyola
//     from the side or back. A box matches the building's true footprint
//     on every side instead.
// Only colliders belonging to whichever scene is currently active are
// checked. Movement is resolved per-axis in animate() so bumping into
// something head-on still lets her slide sideways along it instead of
// getting stuck dead. Declared up here (before the scenes/props below are
// built) since several of the prop-population calls immediately below
// register colliders as they go.
// ------------------------------------------------------------
const PLAYER_RADIUS = 0.4;
const collidables = [];

function addCollider(scene, x, z, radius) {
  if (!scene || !radius) return;
  collidables.push({ scene, shape: "circle", x, z, radius });
}

function addBoxCollider(scene, minX, maxX, minZ, maxZ) {
  if (!scene) return;
  collidables.push({ scene, shape: "box", minX, maxX, minZ, maxZ });
}

// Measures an object's actual footprint (call after it's been fitted and
// added to the scene) instead of guessing a size by hand — used for the
// irregular GLB-based buildings (café, gym, Loyola). Uses the same
// coreBoundingBox() exclusion list as autoFitAndPlace — these scanned
// models often carry a huge extraneous flat/background node, and without
// excluding it here too, the measured "footprint" balloons out to cover
// half the level and blocks the player from moving anywhere at all.
// Registers a rectangular collider matching the true measured footprint
// (see the "box" shape note above) rather than a circle.
function registerColliderFromObject(scene, obj, { padding = 0.3, excludeNames } = {}) {
  obj.updateMatrixWorld(true);
  const box = coreBoundingBox(obj, excludeNames);
  if (box.isEmpty()) return;
  addBoxCollider(scene, box.min.x - padding, box.max.x + padding, box.min.z - padding, box.max.z + padding);
}

function isBlocked(scene, x, z) {
  for (let i = 0; i < collidables.length; i++) {
    const c = collidables[i];
    if (c.scene !== scene) continue;
    if (c.shape === "box") {
      // Expand the box by PLAYER_RADIUS on every side — a reasonable
      // approximation of a circular player colliding with a rectangle
      // (exact at the edges, slightly generous at the corners).
      if (
        x >= c.minX - PLAYER_RADIUS &&
        x <= c.maxX + PLAYER_RADIUS &&
        z >= c.minZ - PLAYER_RADIUS &&
        z <= c.maxZ + PLAYER_RADIUS
      ) {
        return true;
      }
    } else {
      const dx = x - c.x;
      const dz = z - c.z;
      const minDist = c.radius + PLAYER_RADIUS;
      if (dx * dx + dz * dz < minDist * minDist) return true;
    }
  }
  return false;
}

const sceneLevel1 = createLevelScene(LEVEL1_THEME);
const sceneLevel2 = createLevelScene(LEVEL2_THEME);
const sceneLevel3 = createLevelScene(LEVEL3_THEME);
const sceneLevel4 = createLevelScene(LEVEL4_THEME);
const sceneLevel5 = createLevelScene(LEVEL5_THEME);

addCloudsToScene(sceneLevel1);
addCloudsToScene(sceneLevel2);
addCloudsToScene(sceneLevel3);
addCloudsToScene(sceneLevel4);
addCloudsToScene(sceneLevel5);

addUrbanProps(sceneLevel1, URBAN_PROPS);
addUrbanProps(sceneLevel2, CITY_PROPS);
addUrbanProps(sceneLevel3, LEVEL3_GARDEN_PROPS);
addUrbanProps(sceneLevel4, PHOTO_WALL_PROPS);

addGardenProps(sceneLevel5, GARDEN_PROPS);
addHeartsToScene(sceneLevel5);
addCandlesToScene(sceneLevel5);
addCakesToScene(sceneLevel5);
sceneLevel5.add(createMessageWall());
addCollider(sceneLevel5, MESSAGE_WALL.position.x, MESSAGE_WALL.position.z, (MESSAGE_WALL.width / 2) * 0.4);

// The scene actually being rendered right now — swapped at each level
// transition (see runLevelTransition below).
let currentScene = sceneLevel1;

// ------------------------------------------------------------
// Player character (static — no walk animation)
// ------------------------------------------------------------
const player = new THREE.Group();
player.position.set(LEVEL1_SPAWN.x, LEVEL1_SPAWN.y, LEVEL1_SPAWN.z);
player.rotation.y = LEVEL1_SPAWN.rotationY; // face toward the café (-Z)
sceneLevel1.add(player);

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

// ------------------------------------------------------------
// Bird companion (Level 1 only) — a small procedural bird that floats
// beside her and pipes up with a little speech bubble over its own head.
// Attached as a child of `player` (like the studio lights above) so it
// automatically follows her position AND turns with her heading, without
// any per-frame tracking code of its own. Its visibility is toggled to
// only show up while sceneLevel1 is the active scene (see animate()).
// ------------------------------------------------------------
function createBirdCompanion() {
  const group = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({ color: BIRD_COMPANION.bodyColor, roughness: 0.7 });
  const bellyMat = new THREE.MeshStandardMaterial({ color: BIRD_COMPANION.bellyColor, roughness: 0.8 });
  const beakMat = new THREE.MeshStandardMaterial({ color: BIRD_COMPANION.beakColor, roughness: 0.5 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: BIRD_COMPANION.eyeColor, roughness: 0.3 });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), bodyMat);
  body.scale.set(1, 0.95, 1.25);
  body.castShadow = true;
  group.add(body);

  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), bellyMat);
  belly.scale.set(0.9, 0.8, 1);
  belly.position.set(0, -0.06, 0.08);
  group.add(belly);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 14), bodyMat);
  head.position.set(0, 0.18, 0.2);
  head.castShadow = true;
  group.add(head);

  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.14, 8), beakMat);
  beak.rotation.x = Math.PI / 2;
  beak.position.set(0, 0.16, 0.36);
  group.add(beak);

  [-0.07, 0.07].forEach((x) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), eyeMat);
    eye.position.set(x, 0.22, 0.3);
    group.add(eye);
  });

  const wingGeo = new THREE.ConeGeometry(0.1, 0.32, 4);
  const wingL = new THREE.Mesh(wingGeo, bodyMat);
  wingL.rotation.z = Math.PI / 2;
  wingL.rotation.y = 0.3;
  wingL.position.set(-0.2, 0.02, 0);
  wingL.castShadow = true;
  group.add(wingL);

  const wingR = new THREE.Mesh(wingGeo, bodyMat);
  wingR.rotation.z = -Math.PI / 2;
  wingR.rotation.y = -0.3;
  wingR.position.set(0.2, 0.02, 0);
  wingR.castShadow = true;
  group.add(wingR);

  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.26, 4), bodyMat);
  tail.rotation.x = Math.PI / 2;
  tail.rotation.z = Math.PI / 4;
  tail.position.set(0, 0.02, -0.32);
  group.add(tail);

  group.scale.setScalar(BIRD_COMPANION.scale || 1);
  group.position.set(BIRD_COMPANION.offset.x, BIRD_COMPANION.offset.y, BIRD_COMPANION.offset.z);

  return { group, wingL, wingR };
}

// A small floating speech bubble above the bird's head — a canvas-texture
// sprite, reused and redrawn for every new message instead of creating a
// fresh texture each time. Sprites always face the camera regardless of
// the player's/bird's own rotation, and since it's a small billboard
// hovering just over the bird (not a screen-filling overlay), it never
// blocks the view of anything else.
// Drawn in a fixed "logical" pixel space (BIRD_BUBBLE_W x BIRD_BUBBLE_H)
// for all the layout/wrap math below, but the actual canvas backing it is
// rendered at a higher resolution (BIRD_BUBBLE_SCALE) and then scaled back
// down via ctx.scale() — same layout, much crisper text instead of a
// blurry upscaled texture.
const BIRD_BUBBLE_W = 512;
const BIRD_BUBBLE_H = 420;
const BIRD_BUBBLE_SCALE = 2;
const birdBubbleCanvas = document.createElement("canvas");
birdBubbleCanvas.width = BIRD_BUBBLE_W * BIRD_BUBBLE_SCALE;
birdBubbleCanvas.height = BIRD_BUBBLE_H * BIRD_BUBBLE_SCALE;
const birdBubbleCtx = birdBubbleCanvas.getContext("2d");
const birdBubbleTexture = new THREE.CanvasTexture(birdBubbleCanvas);
birdBubbleTexture.minFilter = THREE.LinearFilter;
birdBubbleTexture.magFilter = THREE.LinearFilter;
birdBubbleTexture.anisotropy = maxAniso;
const birdBubbleSprite = new THREE.Sprite(
  new THREE.SpriteMaterial({ map: birdBubbleTexture, transparent: true, depthTest: false })
);
birdBubbleSprite.position.set(0, 0.75, 0);
birdBubbleSprite.visible = false;

// Word-wraps into lines that fit maxWidth — and if a single "word" is
// itself wider than maxWidth (e.g. "DAMNNNNNNNNNN" with no spaces to break
// on), falls back to slicing it character-by-character so it still never
// overflows sideways past the bubble.
function wrapBirdBubbleText(ctx, text, maxWidth) {
  const lines = [];
  let line = "";
  text.split(" ").forEach((word) => {
    // Split on Unicode code points (Array.from), not raw string indices —
    // repeated emoji (like the drooling-face bird reactions) are surrogate
    // pairs in UTF-16, and slicing by raw index can cut one in half,
    // turning it into a broken/invisible glyph.
    let remainingChars = Array.from(word);
    let remaining = remainingChars.join("");
    while (ctx.measureText(remaining).width > maxWidth) {
      let cut = remainingChars.length;
      while (cut > 1 && ctx.measureText(remainingChars.slice(0, cut).join("")).width > maxWidth) cut--;
      if (line) {
        lines.push(line);
        line = "";
      }
      lines.push(remainingChars.slice(0, cut).join(""));
      remainingChars = remainingChars.slice(cut);
      remaining = remainingChars.join("");
    }
    if (!remaining) return;
    const test = line ? `${line} ${remaining}` : remaining;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = remaining;
    } else {
      line = test;
    }
  });
  if (line) lines.push(line);
  return lines;
}

function drawBirdBubbleText(text) {
  const ctx = birdBubbleCtx;
  const W = BIRD_BUBBLE_W;
  const H = BIRD_BUBBLE_H;
  ctx.setTransform(BIRD_BUBBLE_SCALE, 0, 0, BIRD_BUBBLE_SCALE, 0, 0);
  ctx.clearRect(0, 0, W, H);
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  // Auto-shrinks the font (down to a floor) until the wrapped text
  // actually fits within the canvas — guarantees a short "DAMN" gets a
  // nice big word, and a long paragraph shrinks enough to never run past
  // the bottom of the bubble instead of getting cut off/invisible.
  const maxWidth = W - 60;
  const maxTextHeight = H - 70;
  let fontSize = 40;
  const minFontSize = 20;
  let lines;
  let lineHeight;
  for (;;) {
    ctx.font = `600 ${fontSize}px -apple-system, "Segoe UI", sans-serif`;
    lines = wrapBirdBubbleText(ctx, text, maxWidth);
    lineHeight = fontSize * 1.2;
    if (lines.length * lineHeight <= maxTextHeight || fontSize <= minFontSize) break;
    fontSize -= 2;
  }

  // Bubble hugs whatever the widest actual line turned out to be (so a
  // short "DAMN" gets a tight little box) instead of always spanning the
  // full canvas width.
  const widestLine = lines.reduce((max, l) => Math.max(max, ctx.measureText(l).width), 0);
  const bubbleW = Math.min(W, widestLine + 60);
  const bubbleH = Math.min(H, lines.length * lineHeight + 50);
  const bubbleX = (W - bubbleW) / 2;
  const bubbleY = (H - bubbleH) / 2;

  // Rounded-rect speech bubble with a little tail pointing down at the bird.
  ctx.fillStyle = "rgba(255,255,255,0.94)";
  ctx.strokeStyle = "rgba(255,140,190,0.9)";
  ctx.lineWidth = 4;
  const r = 26;
  const x = bubbleX, y = bubbleY, w = bubbleW, h = bubbleH - 20;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Tail
  ctx.beginPath();
  ctx.moveTo(W / 2 - 16, y + h - 2);
  ctx.lineTo(W / 2, y + h + 26);
  ctx.lineTo(W / 2 + 16, y + h - 2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#4a2b40";
  const textStartY = bubbleY + 30 + lineHeight / 2;
  lines.forEach((l, i) => {
    ctx.fillText(l, W / 2, textStartY + i * lineHeight);
  });

  birdBubbleTexture.needsUpdate = true;
  // Keep the sprite's on-screen aspect ratio matching however big the
  // bubble actually ended up (short one-liners vs longer wrapped lines) —
  // with a minimum floor so a short "DAMN" still reads at a legible size
  // instead of shrinking down to barely-visible just because it's short.
  const aspect = bubbleW / bubbleH;
  const worldHeight = Math.max(0.55, 0.85 * (bubbleH / H));
  birdBubbleSprite.scale.set(worldHeight * aspect, worldHeight, 1);
}

let birdMsgToken = 0;
function showBirdMessage(text, { duration } = {}) {
  birdMsgToken += 1;
  const myToken = birdMsgToken;
  drawBirdBubbleText(text);
  birdBubbleSprite.visible = true;
  if (duration) {
    setTimeout(() => {
      if (birdMsgToken === myToken) birdBubbleSprite.visible = false;
    }, duration);
  }
}

const birdCompanion = createBirdCompanion();
birdCompanion.group.add(birdBubbleSprite);
player.add(birdCompanion.group);
let birdFlapTime = 0;

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

// ------------------------------------------------------------
// GLB loading with automatic retry + a visible failure message. Every
// model load in this file goes through this instead of a bare
// `new GLTFLoader().load(...)` — a flaky connection dropping one of these
// (some are 30-60MB+) used to fail completely silently (nothing but a
// console.error), leaving her stuck looking at an empty gym/campus/etc.
// with zero indication anything went wrong.
//
// This is deliberately "fail proof": it NEVER just gives up. A failed
// attempt (including one that silently hangs/stalls rather than erroring —
// GLTFLoader has no built-in timeout, so a dead connection can otherwise
// just sit there forever with no error to catch) is retried automatically
// forever, with a short, fast-ramping delay between tries so it recovers
// quickly from a dropped connection. This is entirely silent from her
// perspective — no banner, no visible error state, ever. It just keeps
// retrying in the background until it succeeds, and the level-transition
// loading screen is held long enough (see runLevelTransition) to cover
// the retries in the vast majority of cases.
// ------------------------------------------------------------
function loadGLBWithRetry(
  url,
  onSuccess,
  { label, retryDelayMs = 600, maxDelayMs = 4000, attemptTimeoutMs = 12000 } = {}
) {
  const niceLabel = label || url;
  let attempt = 0;

  function attemptLoad() {
    attempt += 1;
    let settled = false;

    // GLTFLoader has no built-in timeout — a dropped/stalled connection can
    // just hang with no error ever firing. This forces a retry after
    // attemptTimeoutMs even if nothing "failed" in the traditional sense.
    const timeoutId = setTimeout(() => {
      if (settled) return;
      settled = true;
      handleFailure(new Error(`timed out after ${attemptTimeoutMs}ms`));
    }, attemptTimeoutMs);

    new GLTFLoader().load(
      url,
      (gltf) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        onSuccess(gltf);
      },
      undefined,
      (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        handleFailure(err);
      }
    );
  }

  function handleFailure(err) {
    console.error(`[loadGLBWithRetry] failed to load ${niceLabel} (attempt ${attempt}):`, err);
    // Fast, capped backoff with jitter — no visible sign of this to the
    // user, and no upper bound on attempt count. It just quietly keeps
    // trying until it works.
    const jitter = 0.85 + Math.random() * 0.3;
    const delay = Math.min(retryDelayMs * attempt, maxDelayMs) * jitter;
    setTimeout(attemptLoad, delay);
  }

  attemptLoad();
}

// Loads a character GLB and swaps it in as the currently-visible player
// mesh — used for the initial café outfit and again for the gym outfit
// once level 2 unlocks.
function loadPlayerModel(modelConfig) {
  if (!modelConfig || !modelConfig.glb) return;
  console.log("[loadPlayerModel] requesting:", modelConfig.glb);
  loadGLBWithRetry(
    modelConfig.glb,
    (gltf) => {
      const obj = gltf.scene;
      applyGLTFMaterialFixes(obj);

      const box = new THREE.Box3().setFromObject(obj);
      const size = new THREE.Vector3();
      box.getSize(size);
      const scale = modelConfig.height / (size.y || 1);
      obj.scale.setScalar(scale);
      obj.position.y = modelConfig.yOffset;

      bobGroup.remove(playerMesh);
      playerMesh = obj;
      bobGroup.add(playerMesh);
      console.log(
        "[loadPlayerModel] loaded + swapped:",
        modelConfig.glb,
        "raw size:",
        size,
        "scale applied:",
        scale
      );
    },
    { label: "her outfit" }
  );
}

loadPlayerModel(PLAYER_MODEL);

// ------------------------------------------------------------
// Cafe environment
// ------------------------------------------------------------
function median(nums) {
  const s = [...nums].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

function coreBoundingBox(obj, excludeNames) {
  const exclude = excludeNames || [];
  const box = new THREE.Box3();
  let found = false;
  obj.children.forEach((child) => {
    if (exclude.includes(child.name)) {
      child.visible = false;
      return;
    }
    const childBox = new THREE.Box3().setFromObject(child);
    if (childBox.isEmpty()) return;
    box.union(childBox);
    found = true;
  });
  return found ? box : new THREE.Box3().setFromObject(obj);
}

function autoFitAndPlace(obj, { targetWidth, targetHeight, position, rotationY, excludeNames }) {
  obj.rotation.y = rotationY || 0;

  obj.updateMatrixWorld(true);
  let box = coreBoundingBox(obj, excludeNames);
  let size = new THREE.Vector3();
  box.getSize(size);
  // Most props are sized by width (their footprint matters more than their
  // height), but character-like models (e.g. JON) can pass targetHeight
  // instead, scaling by height so a tall/thin or short/wide raw scan still
  // ends up a consistent, proportional real-world size.
  const scale = targetHeight
    ? targetHeight / (size.y || 1)
    : targetWidth / (Math.max(size.x, size.z) || 1);
  obj.scale.setScalar(scale);

  // Box3().setFromObject() only refreshes the object's own local matrix —
  // it does NOT walk up and refresh the parent's cached world matrix. Since
  // we just changed obj.scale, we have to force a full top-down matrix
  // recompute ourselves, or every measurement below silently keeps using
  // the pre-scale transform.
  obj.updateMatrixWorld(true);

  box = coreBoundingBox(obj, excludeNames);
  box.getSize(size);
  const center = new THREE.Vector3();
  box.getCenter(center);

  obj.position.x += position.x - center.x;
  obj.position.z += position.z - center.z;
  obj.position.y += (position.y ?? 0) - box.min.y;

  // Same deal after moving obj.position — force a fresh matrix recompute.
  obj.updateMatrixWorld(true);

  // Debug: recompute the true final world-space box so we can verify in
  // DevTools (F12 -> Console) exactly where this model actually landed.
  const finalBox = coreBoundingBox(obj, excludeNames);
  const finalCenter = new THREE.Vector3();
  finalBox.getCenter(finalCenter);
  console.log("[autoFitAndPlace] target position:", position);
  console.log("[autoFitAndPlace] scale factor:", scale);
  console.log("[autoFitAndPlace] final world box min/max:", finalBox.min, finalBox.max);
  console.log("[autoFitAndPlace] final world box center:", finalCenter);
  console.log("[autoFitAndPlace] obj.position (local origin):", obj.position.clone());
}

// Samples vertex positions along one world axis and returns the value at a
// given percentile — used to exclude a handful of thin outlier bits (like a
// decorative ledge poking out sideways) from deciding where an edge sits,
// without throwing away the front/back extent info entirely.
function percentileAxisRange(obj, axis, trimFraction) {
  obj.updateMatrixWorld(true);
  const values = [];
  const v = new THREE.Vector3();

  obj.traverse((child) => {
    if (child.isMesh && child.geometry && child.geometry.attributes.position) {
      const posAttr = child.geometry.attributes.position;
      const step = Math.max(1, Math.floor(posAttr.count / 8000));
      for (let i = 0; i < posAttr.count; i += step) {
        v.fromBufferAttribute(posAttr, i);
        v.applyMatrix4(child.matrixWorld);
        values.push(v[axis]);
      }
    }
  });

  values.sort((a, b) => a - b);
  const pick = (p) =>
    values[Math.min(values.length - 1, Math.max(0, Math.floor(values.length * p)))];
  return [pick(trimFraction), pick(1 - trimFraction)];
}

// Wraps a model's bounding volume in a single solid box — not four separate
// planes — so there is no possibility of a seam or gap where two panels
// were supposed to meet. Only the front face (the side facing the player's
// approach, where the real scanned facade actually looks right) is made
// invisible so that real geometry shows through there; every other face of
// the box is a solid brick-colored wall.
function addGymCoverPanels(obj) {
  const fullBox = new THREE.Box3().setFromObject(obj);

  const minX = fullBox.min.x;
  const maxX = fullBox.max.x;
  const minY = fullBox.min.y; // keep resting on the ground
  const maxY = fullBox.max.y;
  const minZ = fullBox.min.z;
  // The box's front edge (nearest the player) was sticking out past the
  // real front facade — pull it back a bit toward the rear instead of
  // sitting exactly at the mesh's absolute frontmost point.
  const maxZ = fullBox.max.z - (fullBox.max.z - fullBox.min.z) * 0.11;

  const width = maxX - minX;
  const height = maxY - minY;
  const depth = maxZ - minZ;

  const brickColor = 0x8b6354; // sampled from the gym model's own diffuse texture
  const brickMat = new THREE.MeshStandardMaterial({
    color: brickColor,
    roughness: 0.95,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  const invisibleMat = new THREE.MeshBasicMaterial({ visible: false });

  // THREE.BoxGeometry's per-face material order is [+X, -X, +Y, -Y, +Z, -Z]
  // — right, left, top, bottom, front, back. Front (+Z, index 4) and
  // bottom (-Y, index 3) are both invisible — front so the real facade
  // shows through, bottom because it's never seen and would otherwise
  // just be a floating flat color under the building.
  const materials = [brickMat, brickMat, brickMat, invisibleMat, invisibleMat, brickMat];

  const cover = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), materials);
  cover.position.set((minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2);
  cover.castShadow = true;
  cover.receiveShadow = true;
  // Returned instead of added to the scene directly — the caller adds it
  // into the same (initially hidden) gym group as the building itself, so
  // it only appears once level 2 actually unlocks, not from game start.
  return cover;
}

if (CAFE && CAFE.glb) {
  loadGLBWithRetry(
    CAFE.glb,
    (gltf) => {
      const cafeObj = gltf.scene;
      applyGLTFMaterialFixes(cafeObj);

      // Diagnostic: print exactly what three.js parsed for each top-level
      // piece — name and size — so we can confirm the exclusion list
      // actually matches real node names instead of guessing.
      console.log("[cafe] top-level children:");
      cafeObj.children.forEach((child) => {
        const b = new THREE.Box3().setFromObject(child);
        if (b.isEmpty()) {
          console.log(`  "${child.name}" (type: ${child.type}) — empty/no geometry`);
          return;
        }
        const s = new THREE.Vector3();
        b.getSize(s);
        console.log(`  "${child.name}" maxDim=${Math.max(s.x, s.y, s.z).toFixed(2)}`);
      });

      autoFitAndPlace(cafeObj, {
        targetWidth: CAFE.targetWidth,
        position: CAFE.position,
        rotationY: CAFE.rotationY,
        excludeNames: CAFE.excludeNodeNames || [],
      });
      sceneLevel1.add(cafeObj);
      registerColliderFromObject(sceneLevel1, cafeObj, { excludeNames: CAFE.excludeNodeNames || [] });

      const cafeLight = new THREE.PointLight(0xffe8c2, 12, 20, 2);
      cafeLight.position.set(CAFE.position.x, 4, CAFE.position.z);
      sceneLevel1.add(cafeLight);
    },
    { label: "the café" }
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
  sceneLevel1.add(banner);
  console.log("[banner] position:", banner.position.clone());
}

// ------------------------------------------------------------
// Gym environment (level 2) + "Jon" (level 2 bonus, a giant version of him
// down the street kept invisible until the strength bar maxes out — see
// revealJon(), triggered from updateMachines()).
//
// Both are LAZILY loaded — only fetched the moment the level 1 -> 2
// transition actually starts (see loadLevel2Assets(), called from
// startLevel2() below) — instead of upfront at page load alongside every
// other level's assets. Loading every level's models (gym.glb alone is
// ~63MB, plus jon/loyola/etc.) all at once on page load was overwhelming
// mobile browsers' WebGL memory limits — that's what was causing the
// player model to sometimes not even render, and everything (including
// the touch Interact button) to appear "broken" on phones.
// ------------------------------------------------------------
let jonGroupRef = null;
let jonObjRef = null;
let jonMaterials = [];
let level2AssetsRequested = false;

function loadLevel2Assets() {
  if (level2AssetsRequested) return;
  level2AssetsRequested = true;

  if (GYM && GYM.glb) {
    loadGLBWithRetry(
      GYM.glb,
      (gltf) => {
        const gymObj = gltf.scene;
        applyGLTFMaterialFixes(gymObj);

        autoFitAndPlace(gymObj, {
          targetWidth: GYM.targetWidth,
          position: GYM.position,
          rotationY: GYM.rotationY,
          excludeNames: GYM.excludeNodeNames || [],
        });

        // The scanned gym model only looks right from the front (brick
        // facade) — the sides/top/back are broken/stretched geometry, so we
        // just cover them with flat panels tinted to match the front brick
        // color (sampled from the model's own diffuse texture).
        const gymCover = addGymCoverPanels(gymObj);

        const gymLight = new THREE.PointLight(0xfff0e0, 16, 50, 2);
        gymLight.position.set(GYM.position.x, 10, GYM.position.z);

        sceneLevel2.add(gymObj);
        sceneLevel2.add(gymCover);
        sceneLevel2.add(gymLight);
        registerColliderFromObject(sceneLevel2, gymObj, { excludeNames: GYM.excludeNodeNames || [] });
      },
      { label: "the gym" }
    );
  }

  if (JON && JON.glb) {
    loadGLBWithRetry(
      JON.glb,
      (gltf) => {
        const jonObj = gltf.scene;
        applyGLTFMaterialFixes(jonObj);

        // Placed at LOCAL origin (not JON.position) — the wrapping jonGroup
        // below carries JON.position instead. This matters for the "shrink
        // in place" hit effect: scaling a group multiplies its children's
        // local positions too, so if jonObj's own position held JON.position
        // directly, shrinking the group would drag him toward world (0,0,0)
        // with every hit instead of shrinking him around his own feet.
        autoFitAndPlace(jonObj, {
          targetHeight: JON.targetHeight,
          position: { x: 0, y: 0, z: 0 },
          rotationY: JON.rotationY,
          excludeNames: JON.excludeNodeNames || [],
        });

        jonObj.traverse((child) => {
          if (child.isMesh && child.material) jonMaterials.push(child.material);
        });

        const jonLight = new THREE.PointLight(0xfff0e0, 18, 40, 2);
        jonLight.position.set(0, 14, 0); // local — the group's own position below places him in the world

        const jonGroup = new THREE.Group();
        jonGroup.position.set(JON.position.x, JON.position.y || 0, JON.position.z);
        jonGroup.add(jonObj);
        jonGroup.add(jonLight);
        jonGroup.visible = false; // stays hidden until she maxes out the strength bar
        sceneLevel2.add(jonGroup);
        jonGroupRef = jonGroup;
        jonObjRef = jonObj;
      },
      { label: "Jon" }
    );
  }
}

// ------------------------------------------------------------
// Debris — a tiny, generic particle burst (little tumbling cubes with
// gravity) used for hit feedback when destroying Jon. Not tied to any one
// scene; each burst is added straight into whichever scene is passed in,
// and drifts/falls regardless of which level is currently active.
// ------------------------------------------------------------
let debrisRefs = []; // { mesh, velocity, life, scene }

function spawnDebris(targetScene, position, count, color) {
  for (let i = 0; i < count; i++) {
    const size = THREE.MathUtils.randFloat(0.15, 0.4);
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(size, size, size),
      new THREE.MeshStandardMaterial({ color: color || 0x8a7d6b, roughness: 0.9 })
    );
    mesh.position.copy(position);
    targetScene.add(mesh);

    const angle = Math.random() * Math.PI * 2;
    const speed = THREE.MathUtils.randFloat(2, 6);
    const velocity = new THREE.Vector3(
      Math.cos(angle) * speed,
      THREE.MathUtils.randFloat(3, 7),
      Math.sin(angle) * speed
    );
    debrisRefs.push({ mesh, velocity, life: 1.2, scene: targetScene });
  }
}

function updateDebris(delta) {
  for (let i = debrisRefs.length - 1; i >= 0; i--) {
    const d = debrisRefs[i];
    d.velocity.y -= 9.8 * delta;
    d.mesh.position.addScaledVector(d.velocity, delta);
    d.mesh.rotation.x += delta * 4;
    d.mesh.rotation.y += delta * 3;
    d.life -= delta;
    if (d.life <= 0 || d.mesh.position.y < -2) {
      d.scene.remove(d.mesh);
      debrisRefs.splice(i, 1);
    }
  }
}

// ------------------------------------------------------------
// Loyola Campus environment (level 3) — same idea as the gym: built
// directly into sceneLevel3, its own separate scene, so it's never part
// of what's rendered until the level 2 -> 3 transition reveals it. Lazily
// loaded (see loadLevel2Assets() above for why) — only fetched once
// startLevel3() actually runs, not at page load.
// ------------------------------------------------------------
let level3AssetsRequested = false;

function loadLevel3Assets() {
  if (level3AssetsRequested || !LOYOLA || !LOYOLA.glb) return;
  level3AssetsRequested = true;

  loadGLBWithRetry(
    LOYOLA.glb,
    (gltf) => {
      const loyolaObj = gltf.scene;
      applyGLTFMaterialFixes(loyolaObj);

      autoFitAndPlace(loyolaObj, {
        targetWidth: LOYOLA.targetWidth,
        position: LOYOLA.position,
        rotationY: LOYOLA.rotationY,
        excludeNames: LOYOLA.excludeNodeNames || [],
      });

      const loyolaLight = new THREE.PointLight(0xfff0e0, 16, 60, 2);
      loyolaLight.position.set(LOYOLA.position.x, 12, LOYOLA.position.z);

      sceneLevel3.add(loyolaObj);
      sceneLevel3.add(loyolaLight);
      registerColliderFromObject(sceneLevel3, loyolaObj, { excludeNames: LOYOLA.excludeNodeNames || [] });
    },
    { label: "the campus" }
  );
}

// ------------------------------------------------------------
// Titration flask (level 3 prop) — a big Erlenmeyer-style flask built
// procedurally (no GLB needed), placed in front of the Loyola building.
// Its liquid mesh rises with the titration progress, following the
// flask's own conical profile (instead of a plain cylinder) so it never
// pokes outside the glass, and turns pink once titrated correctly.
// ------------------------------------------------------------

// Profile traced bottom-to-top, shared by the glass and the liquid so the
// liquid always stays inside the glass's own silhouette. Radius/y pairs.
const FLASK_PROFILE = [
  { r: 0.85, y: 0.0 },
  { r: 0.85, y: 0.15 },
  { r: 0.45, y: 1.0 },
  { r: 0.16, y: 1.7 },
];
// The liquid only ever fills up through the main conical body (y:0-1.0),
// not into the narrow neck above it — 100% titration = full body.
const FLASK_LIQUID_MAX_Y = 1.0;
// Liquid radius is a touch smaller than the glass wall at every height so
// it reads as sitting inside the glass rather than clipping through it.
const FLASK_LIQUID_INSET = 0.92;

function flaskRadiusAtY(y) {
  for (let i = 0; i < FLASK_PROFILE.length - 1; i++) {
    const p0 = FLASK_PROFILE[i];
    const p1 = FLASK_PROFILE[i + 1];
    if (y >= p0.y && y <= p1.y) {
      const t = (y - p0.y) / (p1.y - p0.y || 1);
      return p0.r + (p1.r - p0.r) * t;
    }
  }
  return FLASK_PROFILE[FLASK_PROFILE.length - 1].r;
}

// Builds a liquid volume shaped like the bottom slice of the flask's own
// profile, from y:0 up to the current fill height — so the liquid's
// surface and sides always trace the inside of the glass, never a plain
// cylinder poking out past it.
function buildLiquidGeometry(fillFraction) {
  const topY = Math.max(0.02, Math.min(1, fillFraction)) * FLASK_LIQUID_MAX_Y;
  const points = [new THREE.Vector2(0.001, 0)]; // tiny point closes the bottom
  FLASK_PROFILE.forEach((p) => {
    if (p.y <= topY) points.push(new THREE.Vector2(p.r * FLASK_LIQUID_INSET, p.y));
  });
  points.push(new THREE.Vector2(flaskRadiusAtY(topY) * FLASK_LIQUID_INSET, topY));
  return new THREE.LatheGeometry(points, 32);
}

let flaskLiquidMesh = null;
let flaskLiquidMat = null;

function createFlask() {
  if (!FLASK) return;

  const group = new THREE.Group();

  // Full silhouette (body + neck + lip) for the glass itself.
  const glassPoints = [
    new THREE.Vector2(0.0, 0.0),
    ...FLASK_PROFILE.map((p) => new THREE.Vector2(p.r, p.y)),
    new THREE.Vector2(0.16, 2.15),
    new THREE.Vector2(0.24, 2.2),
  ];
  const glassGeo = new THREE.LatheGeometry(glassPoints, 32);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xdfefff,
    transparent: true,
    opacity: 0.28,
    roughness: 0.05,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  const glass = new THREE.Mesh(glassGeo, glassMat);
  group.add(glass);

  flaskLiquidMat = new THREE.MeshStandardMaterial({
    color: FLASK.liquidColor,
    transparent: true,
    opacity: 0.85,
  });
  const liquid = new THREE.Mesh(buildLiquidGeometry(0), flaskLiquidMat);
  group.add(liquid);
  flaskLiquidMesh = liquid;

  // The profile above spans y:0 to y:2.2 in its own local units — scale
  // the whole group so that maps to FLASK.height meters tall.
  const scale = (FLASK.height || 3) / 2.2;
  group.scale.set(scale, scale, scale);
  group.position.set(FLASK.position.x, FLASK.position.y, FLASK.position.z);
  sceneLevel3.add(group);
}

createFlask();

// ------------------------------------------------------------
// Mirror gallery (level 4 props) — a handful of differently-shaped,
// really-reflective surfaces (THREE.Reflector, not a fake texture) built
// procedurally, each with its own frame color/style. Built directly into
// sceneLevel4 so they're never part of any other level's scene.
// ------------------------------------------------------------

// Traces a flat 2D outline for one of the supported mirror shapes, in
// meters, centered on the origin — shared by both the mirror surface
// itself and its (slightly larger) backing frame.
function buildMirrorShape(shapeType, w, h) {
  const shape = new THREE.Shape();

  switch (shapeType) {
    case "circle": {
      const r = Math.min(w, h) / 2;
      shape.absarc(0, 0, r, 0, Math.PI * 2, false);
      break;
    }
    case "oval": {
      const rx = w / 2;
      const ry = h / 2;
      const steps = 48;
      for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const x = Math.cos(a) * rx;
        const y = Math.sin(a) * ry;
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
      }
      break;
    }
    case "arch": {
      // Rectangle body with a semicircle cap on top — the semicircle's
      // radius matches the body's half-width so it meets the sides flush.
      const topY = h / 2 - w / 2;
      shape.moveTo(-w / 2, -h / 2);
      shape.lineTo(w / 2, -h / 2);
      shape.lineTo(w / 2, topY);
      shape.absarc(0, topY, w / 2, 0, Math.PI, false);
      shape.lineTo(-w / 2, -h / 2);
      break;
    }
    case "hex": {
      const rx = w / 2;
      const ry = h / 2;
      for (let i = 0; i <= 6; i++) {
        const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
        const x = Math.cos(a) * rx;
        const y = Math.sin(a) * ry;
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
      }
      break;
    }
    case "rect":
    default: {
      shape.moveTo(-w / 2, -h / 2);
      shape.lineTo(w / 2, -h / 2);
      shape.lineTo(w / 2, h / 2);
      shape.lineTo(-w / 2, h / 2);
      shape.closePath();
      break;
    }
  }

  return shape;
}

const mirrorRefs = []; // { position: Vector3, name } — used for the proximity check

function createMirror(cfg) {
  const group = new THREE.Group();
  // Shapes are centered on the origin (from -height/2 to +height/2), so
  // lifting the whole group by half its height sits the bottom edge right
  // on the ground at cfg.position.
  group.position.set(cfg.position.x, cfg.position.y + cfg.height / 2, cfg.position.z);
  group.rotation.y = cfg.rotationY || 0;

  const border = 0.12; // meters added on every side for the frame
  const frameShape = buildMirrorShape(cfg.shape, cfg.width + border * 2, cfg.height + border * 2);
  const frameGeo = new THREE.ShapeGeometry(frameShape, 48);
  const frameMat = new THREE.MeshStandardMaterial({
    color: cfg.frameColor,
    roughness: 0.5,
    metalness: 0.35,
  });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  frame.position.z = -0.03; // just behind the mirror surface, like a real frame backing
  frame.castShadow = true;
  frame.receiveShadow = true;
  group.add(frame);

  const mirrorShape = buildMirrorShape(cfg.shape, cfg.width, cfg.height);
  const mirrorGeo = new THREE.ShapeGeometry(mirrorShape, 48);
  const reflector = new Reflector(mirrorGeo, {
    clipBias: 0.003,
    textureWidth: 512,
    textureHeight: 512,
    color: 0x889999,
  });
  group.add(reflector);

  sceneLevel4.add(group);
  // Small — kept well under MIRROR_SELFIE.mirrorRadius so she can still
  // get close enough to snap a selfie without clipping into the glass.
  addCollider(sceneLevel4, cfg.position.x, cfg.position.z, (cfg.width / 2) * 0.6);
  mirrorRefs.push({
    position: new THREE.Vector3(cfg.position.x, 0, cfg.position.z),
    name: cfg.name || "mirror",
  });
}

(MIRRORS || []).forEach((cfg) => createMirror(cfg));

// ------------------------------------------------------------
// Matcha collection minigame
// ------------------------------------------------------------
let matchaTemplate = null;
let matchaScale = 1;
const collectibles = []; // { mesh, collected }
let minigameStarted = false;
let minigameActive = false;
let collectedCount = 0;
let timeRemaining = 0;

if (COLLECTIBLE && COLLECTIBLE.glb) {
  loadGLBWithRetry(
    COLLECTIBLE.glb,
    (gltf) => {
      matchaTemplate = gltf.scene;
      applyGLTFMaterialFixes(matchaTemplate);
      const box = new THREE.Box3().setFromObject(matchaTemplate);
      const size = new THREE.Vector3();
      box.getSize(size);
      matchaScale = COLLECTIBLE.height / (size.y || 1);
    },
    { label: "the matcha" }
  );
}

function countAlive() {
  return collectibles.reduce((n, item) => n + (item.collected ? 0 : 1), 0);
}

function spawnMatcha(count) {
  if (!matchaTemplate) return;
  const room = COLLECTIBLE.maxAlive - countAlive();
  const toSpawn = Math.max(0, Math.min(count, room));
  for (let i = 0; i < toSpawn; i++) {
    // Re-roll a handful of times if the random spot lands inside the
    // café's own collision footprint (or any other collider in this
    // scene) — otherwise some matcha end up half-buried in the building,
    // unreachable behind its wall.
    let x, z;
    let attempts = 0;
    do {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * COLLECTIBLE.spawnRadius;
      x = COLLECTIBLE.spawnCenter.x + Math.cos(angle) * r;
      z = COLLECTIBLE.spawnCenter.z + Math.sin(angle) * r;
      attempts += 1;
    } while (isBlocked(sceneLevel1, x, z) && attempts < 20);
    if (isBlocked(sceneLevel1, x, z)) continue; // couldn't find a clear spot, just skip this one

    const clone = matchaTemplate.clone(true);
    clone.scale.setScalar(matchaScale);
    clone.position.set(x, 0, z);
    clone.userData.bobOffset = Math.random() * Math.PI * 2;
    sceneLevel1.add(clone);
    collectibles.push({ mesh: clone, collected: false });
  }
}

// Purely decorative — a handful of giant matcha cups that appear once the
// round is over, scattered around the café plaza for her to wander past
// while exploring. Reuses the same already-loaded matcha model, just
// scaled way up and never added to `collectibles` (so they're not
// pickable and don't interact with the timer/counter at all).
let giantMatchasSpawned = false;
function spawnGiantMatchas() {
  if (!matchaTemplate || giantMatchasSpawned) return;
  giantMatchasSpawned = true;

  const box = new THREE.Box3().setFromObject(matchaTemplate);
  const size = new THREE.Vector3();
  box.getSize(size);
  const giantScale = GIANT_MATCHA.height / (size.y || 1);

  for (let i = 0; i < GIANT_MATCHA.count; i++) {
    const clone = matchaTemplate.clone(true);
    clone.scale.setScalar(giantScale);
    const angle = (i / GIANT_MATCHA.count) * Math.PI * 2 + Math.random() * 0.4;
    const r = GIANT_MATCHA.spawnRadius * (0.5 + Math.random() * 0.5);
    clone.position.set(
      GIANT_MATCHA.spawnCenter.x + Math.cos(angle) * r,
      0,
      GIANT_MATCHA.spawnCenter.z + Math.sin(angle) * r
    );
    clone.rotation.y = Math.random() * Math.PI * 2;
    sceneLevel1.add(clone);
  }
}

function updateCounterHUD() {
  counterHUD.textContent = `Matcha collected: ${collectedCount}`;
}

function updateTimerHUD() {
  timerHUD.textContent = `Time left: ${Math.max(0, Math.ceil(timeRemaining))}s`;
}

// ------------------------------------------------------------
// Gym strength minigame (level 2)
// Unlocks once the café round finishes. Walking close just shows a hint —
// pressing Enter is what actually spawns the equipment. From there, each
// piece of equipment is its own little "station": holding R within a few
// meters of one fills that station's own even share of the bar, so all
// four need a turn before the overall strength bar reaches 100%.
// ------------------------------------------------------------
let level1Complete = false;
let nearGym = false;
let holdR = false;
let level2Won = false;
let level2MinigameStarted = false;
let machines = []; // { name, position, share, filled } — one per GYM_EQUIPMENT item
let nearMachineIndex = -1;

function startLevel2() {
  console.log("[startLevel2] called");
  level1Complete = true;

  runLevelTransition({
    label: LEVEL2_INTRO_MESSAGE.title,
    reveal: () => {
      loadPlayerModel(PLAYER_MODEL_2);
      loadLevel2Assets();
      switchToScene(sceneLevel2, LEVEL2_SPAWN);
    },
    onDone: () => {
      // Mirrors what controls.lock() does, minus re-triggering the level-1
      // intro (gameStarted is already true by this point).
      controls.isLocked = true;
      blocker.classList.add("hidden");
      setTimeout(() => {
        console.log("[startLevel2] showing level 2 intro message");
        showMessage(LEVEL2_INTRO_MESSAGE.title, LEVEL2_INTRO_MESSAGE.message, null);
        showBirdMessage(BIRD_MESSAGES.level2Intro);
      }, 300);
    },
  });
}

// Equipment props that only appear once the gym minigame is actually
// started (Enter pressed near the gym) — placed in the open area between
// the café and the gym per GYM_EQUIPMENT in config.js. Each one also
// becomes a "station" in the strength minigame (see `machines` above).
function spawnGymEquipment() {
  if (!GYM_EQUIPMENT || !GYM_EQUIPMENT.items) return;
  GYM_EQUIPMENT.items.forEach((item) => {
    if (!item.glb) return;
    loadGLBWithRetry(
      item.glb,
      (gltf) => {
        const obj = gltf.scene;
        applyGLTFMaterialFixes(obj);
        autoFitAndPlace(obj, {
          targetWidth: item.targetWidth,
          position: item.position,
          rotationY: item.rotationY || 0,
          excludeNames: item.excludeNodeNames || [],
        });
        sceneLevel2.add(obj);
        // Capped well below STRENGTH.machineRadius so she can still walk
        // close enough to hold R at it — targetWidth is often the long
        // axis of the model, not a true circular footprint.
        addCollider(sceneLevel2, item.position.x, item.position.z, Math.min(item.targetWidth / 2, 2) * 0.5);
      },
      { label: item.name || "a piece of equipment" }
    );
  });
}

function updateGymTrigger() {
  const dx = player.position.x - GYM_TRIGGER.position.x;
  const dz = player.position.z - GYM_TRIGGER.position.z;
  const dist = Math.sqrt(dx * dx + dz * dz);
  nearGym = dist <= GYM_TRIGGER.radius;

  if (!level1Complete || level2Won || level2MinigameStarted) return;

  if (nearGym) {
    hintToast.textContent = "Press Enter to start building strength";
    hintToast.classList.remove("hidden");
  } else {
    hintToast.classList.add("hidden");
  }
}

function tryStartGymMinigame() {
  if (!controls.isLocked) return;
  if (!level1Complete || level2MinigameStarted || level2Won || !nearGym) return;
  level2MinigameStarted = true;
  hintToast.classList.add("hidden");
  showBirdMessage(BIRD_MESSAGES.level2WorkoutStart);
  spawnGymEquipment();
  // Same idea as loadLevel2Assets() above — start the ~54MB Loyola model
  // downloading now, during the workout, instead of making her wait for it
  // at the level 2 -> 3 transition.
  loadLevel3Assets();

  const items = (GYM_EQUIPMENT && GYM_EQUIPMENT.items) || [];
  machines = items.map((item) => ({
    name: item.name || "machine",
    position: item.position,
    share: 100 / items.length,
    filled: 0,
  }));

  strengthHUD.classList.remove("hidden");
  strengthFill.style.width = "0%";
}

function updateMachines(delta) {
  if (!level2MinigameStarted || level2Won) return;

  nearMachineIndex = -1;
  let nearestDist = Infinity;
  machines.forEach((machine, i) => {
    const dx = player.position.x - machine.position.x;
    const dz = player.position.z - machine.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist <= STRENGTH.machineRadius && dist < nearestDist) {
      nearestDist = dist;
      nearMachineIndex = i;
    }
  });

  if (nearMachineIndex !== -1) {
    const machine = machines[nearMachineIndex];
    const fillRate = machine.share / STRENGTH.fillSeconds;
    // Progress at each machine is saved permanently once built up — letting
    // go of R (or walking to another machine) no longer drains it back
    // down, so she can freely visit machines in any order/at any pace.
    if (holdR) {
      machine.filled = Math.min(machine.share, machine.filled + fillRate * delta);
    }

    if (machine.filled >= machine.share) {
      hintToast.classList.add("hidden");
    } else {
      hintToast.textContent = `Hold R at the ${machine.name} to build strength`;
      hintToast.classList.remove("hidden");
    }
  } else {
    hintToast.classList.add("hidden");
  }

  const totalStrength = machines.reduce((sum, m) => sum + m.filled, 0);
  strengthFill.style.width = `${totalStrength}%`;

  if (totalStrength >= 99.9) {
    level2Won = true;
    hintToast.classList.add("hidden");
    strengthHUD.classList.add("hidden");
    // Maxing the bar doesn't move her to level 3 by itself anymore — it
    // unlocks the bonus "destroy Jon" beat, still inside level 2's own
    // scene. Beating that is what actually triggers LEVEL2_WIN_MESSAGE.
    setTimeout(revealJon, 400);
  }
}

// --- Bonus: destroy Jon (unlocked once the strength bar maxes out) ------
let jonRevealed = false;
let jonDestroyed = false;
let jonHitsTaken = 0;
let nearJon = false;

function revealJon() {
  if (!jonGroupRef) return;
  jonRevealed = true;
  jonGroupRef.visible = true;
  // Only becomes solid once he's actually visible — no invisible wall
  // standing in the street before the reveal.
  if (jonObjRef) {
    registerColliderFromObject(sceneLevel2, jonObjRef, {
      padding: -0.4, // shrink in slightly — his GLB footprint box is a bit generous around his actual stance
      excludeNames: JON.excludeNodeNames || [],
    });
  }
  jonHealthFill.style.width = "100%";
  jonHealthHUD.classList.remove("hidden");
  showBirdMessage(BIRD_MESSAGES.level2JonAppears);
  hintToast.textContent = "A challenger appears! Walk up to Jon and press B to take him down.";
  hintToast.classList.remove("hidden");
  setTimeout(() => {
    if (jonRevealed && !jonDestroyed) hintToast.classList.add("hidden");
  }, 2500);
}

function updateJonTrigger() {
  if (currentScene !== sceneLevel2 || !jonRevealed || jonDestroyed) return;

  const dx = player.position.x - JON.position.x;
  const dz = player.position.z - JON.position.z;
  const dist = Math.sqrt(dx * dx + dz * dz);
  nearJon = dist <= DESTROY_JON.proximityRadius;

  if (nearJon) {
    hintToast.textContent = "Press B to hit Jon";
    hintToast.classList.remove("hidden");
  } else {
    hintToast.classList.add("hidden");
  }
}

function flashJonRed() {
  jonMaterials.forEach((mat) => {
    if (!mat.emissive) return;
    mat.emissive.setHex(0xff2222);
    mat.emissiveIntensity = 1;
  });
  setTimeout(() => {
    jonMaterials.forEach((mat) => {
      if (mat.emissive) mat.emissive.setHex(0x000000);
    });
  }, 150);
}

function jonDebrisOrigin() {
  // Roughly head-height on his (now height-based) scale.
  return new THREE.Vector3(JON.position.x, (JON.targetHeight || 5.4) * 0.85, JON.position.z);
}

function tryHitJon() {
  if (!controls.isLocked) return;
  if (!jonRevealed || jonDestroyed || !nearJon) return;

  jonHitsTaken += 1;
  flashJonRed();
  spawnDebris(sceneLevel2, jonDebrisOrigin(), DESTROY_JON.debrisPerHit, 0x8a7d6b);
  if (jonGroupRef) jonGroupRef.scale.multiplyScalar(0.85);

  const remaining = Math.max(0, DESTROY_JON.hitsRequired - jonHitsTaken);
  jonHealthFill.style.width = `${(remaining / DESTROY_JON.hitsRequired) * 100}%`;

  if (jonHitsTaken >= DESTROY_JON.hitsRequired) {
    jonDestroyed = true;
    hintToast.classList.add("hidden");
    jonHealthHUD.classList.add("hidden");
    showBirdMessage(BIRD_MESSAGES.level2JonDestroyed);
    spawnDebris(sceneLevel2, jonDebrisOrigin(), DESTROY_JON.debrisOnDestroy, 0x8a7d6b);
    if (jonGroupRef) jonGroupRef.visible = false;
    setTimeout(
      () =>
        showMessage(
          LEVEL2_WIN_MESSAGE.title,
          LEVEL2_WIN_MESSAGE.message,
          null,
          () => {
            controls.lock();
            armNextLevel(startLevel3);
          }
        ),
      500
    );
  }
}

// ------------------------------------------------------------
// Level 3 (Loyola Campus) — a little two-stage chemistry challenge.
// Stage A: titration sweet spot (hold R, release inside the target zone).
// Stage B: molecule builder (walk into the right atoms to build the
// target molecule; wrong ones are harmless decoys).
// ------------------------------------------------------------
let nearLoyola = false;
let level3MinigameStarted = false;
let level3Stage = null; // null | "titration" | "molecule"
let level3Won = false;

let titrationValue = 0;

let moleculeAtoms = []; // { mesh, label, symbol, isTarget, collected }
let moleculeCollected = {}; // symbol -> count collected so far this round
let moleculeQueue = []; // flattened list of molecule defs to build, in order
let moleculeQueueIndex = 0; // which entry in moleculeQueue is the current round

function startLevel3() {
  console.log("[startLevel3] called");

  runLevelTransition({
    label: LEVEL3_INTRO_MESSAGE.title,
    reveal: () => {
      loadPlayerModel(PLAYER_MODEL_3);
      loadLevel3Assets();
      switchToScene(sceneLevel3, LEVEL3_SPAWN);
    },
    onDone: () => {
      // Mirrors what controls.lock() does, minus re-triggering earlier intros.
      controls.isLocked = true;
      blocker.classList.add("hidden");
      setTimeout(() => {
        console.log("[startLevel3] showing level 3 intro message");
        showMessage(LEVEL3_INTRO_MESSAGE.title, LEVEL3_INTRO_MESSAGE.message, null);
        showBirdMessage(BIRD_MESSAGES.level3Intro);
      }, 300);
    },
  });
}

function updateLoyolaTrigger() {
  const dx = player.position.x - LOYOLA_TRIGGER.position.x;
  const dz = player.position.z - LOYOLA_TRIGGER.position.z;
  const dist = Math.sqrt(dx * dx + dz * dz);
  nearLoyola = dist <= LOYOLA_TRIGGER.radius;

  if (!level2Won || level3MinigameStarted) return;

  if (nearLoyola) {
    hintToast.textContent = "Press Enter to start";
    hintToast.classList.remove("hidden");
  } else {
    hintToast.classList.add("hidden");
  }
}

function tryStartLevel3Minigame() {
  if (!controls.isLocked) return;
  if (!level2Won || level3MinigameStarted || !nearLoyola) return;
  level3MinigameStarted = true;
  hintToast.classList.add("hidden");
  startTitrationStage();
}

// --- Stage A: titration sweet spot ---------------------------------
// Click-based, not hold: each press of R adds one "drop" (see
// tryTitrationClick, called from the keydown handler below).
let titrationLocked = false; // true briefly during the success/overshoot pause

function setFlaskLiquidLevel(fraction) {
  if (!flaskLiquidMesh) return;
  flaskLiquidMesh.geometry.dispose();
  flaskLiquidMesh.geometry = buildLiquidGeometry(fraction);
}

function setFlaskLiquidColor(color) {
  if (flaskLiquidMat) flaskLiquidMat.color.set(color);
}

function startTitrationStage() {
  level3Stage = "titration";
  titrationValue = 0;
  titrationLocked = false;
  titrationFill.style.width = "0%";
  titrationZone.style.left = `${TITRATION.targetMin}%`;
  titrationZone.style.width = `${TITRATION.targetMax - TITRATION.targetMin}%`;
  titrationHUD.classList.remove("hidden");
  setFlaskLiquidColor(FLASK.liquidColor);
  setFlaskLiquidLevel(0);
  hintToast.textContent = "Press R to add a drop of reagent";
  hintToast.classList.remove("hidden");
}

function tryTitrationClick() {
  if (level3Stage !== "titration" || titrationLocked) return;

  titrationValue = Math.min(100, titrationValue + TITRATION.clickAmount);
  titrationFill.style.width = `${titrationValue}%`;
  setFlaskLiquidLevel(titrationValue / 100);

  if (titrationValue >= TITRATION.targetMin && titrationValue <= TITRATION.targetMax) {
    titrationLocked = true;
    setFlaskLiquidColor(FLASK.successColor);
    hintToast.textContent = "Perfect — that's the endpoint!";
    hintToast.classList.remove("hidden");
    setTimeout(() => {
      titrationHUD.classList.add("hidden");
      hintToast.classList.add("hidden");
      startMoleculeStage();
    }, 1000);
  } else if (titrationValue > TITRATION.targetMax) {
    titrationLocked = true;
    hintToast.textContent = "Missed the endpoint — resetting, try again";
    hintToast.classList.remove("hidden");
    setTimeout(() => {
      titrationValue = 0;
      titrationFill.style.width = "0%";
      setFlaskLiquidLevel(0);
      titrationLocked = false;
      hintToast.textContent = "Press R to add a drop of reagent";
      hintToast.classList.remove("hidden");
    }, 1200);
  }
}

// --- Stage B: molecule builder --------------------------------------
function makeAtomLabel(text) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.font = "bold 72px Georgia";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 64, 68);
  const texture = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: texture, depthTest: false })
  );
  sprite.scale.set(0.7, 0.7, 1);
  return sprite;
}

// Builds the full play order once per stage start: every molecule in
// MOLECULE_BUILDER.molecules, repeated roundsPerMolecule times each — e.g.
// H2O, H2O, CO2, CO2, O2, O2, CH4, CH4 with the default config.
function buildMoleculeQueue() {
  const queue = [];
  const rounds = MOLECULE_BUILDER.roundsPerMolecule || 1;
  (MOLECULE_BUILDER.molecules || []).forEach((molecule) => {
    for (let i = 0; i < rounds; i++) queue.push(molecule);
  });
  return queue;
}

function currentMolecule() {
  return moleculeQueue[moleculeQueueIndex];
}

function startMoleculeStage() {
  level3Stage = "molecule";
  moleculeQueue = buildMoleculeQueue();
  moleculeQueueIndex = 0;
  startMoleculeRound();
  moleculeHUD.classList.remove("hidden");
}

function startMoleculeRound() {
  const molecule = currentMolecule();
  if (!molecule) return;

  moleculeFormula.textContent = molecule.formula;
  moleculeCollected = {};
  (molecule.atoms || []).forEach((a) => {
    moleculeCollected[a.symbol] = 0;
  });
  updateMoleculeProgressHUD();
  spawnMoleculeAtoms();
}

function spawnMoleculeAtoms() {
  moleculeAtoms.forEach((a) => {
    sceneLevel3.remove(a.mesh);
  });
  moleculeAtoms = [];

  const molecule = currentMolecule();
  if (!molecule) return;

  const allTypes = [
    ...(molecule.atoms || []).map((a) => ({ ...a, isTarget: true })),
    ...(MOLECULE_BUILDER.decoys || []).map((a) => ({ ...a, isTarget: false })),
  ];

  allTypes.forEach((type) => {
    for (let i = 0; i < type.count; i++) {
      const geo = new THREE.SphereGeometry(MOLECULE_BUILDER.atomSize / 2, 20, 20);
      const mat = new THREE.MeshStandardMaterial({ color: type.color });
      const mesh = new THREE.Mesh(geo, mat);

      // Re-roll if the random spot lands inside the Loyola building's own
      // collision footprint (or any other collider in this scene) —
      // otherwise some atoms end up half-buried in the building, unreachable
      // behind its wall (same issue/fix as the café's matcha spawns).
      let x, z;
      let attempts = 0;
      do {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * MOLECULE_BUILDER.spawnRadius;
        x = MOLECULE_BUILDER.spawnCenter.x + Math.cos(angle) * r;
        z = MOLECULE_BUILDER.spawnCenter.z + Math.sin(angle) * r;
        attempts += 1;
      } while (isBlocked(sceneLevel3, x, z) && attempts < 20);
      if (isBlocked(sceneLevel3, x, z)) continue; // couldn't find a clear spot, just skip this one

      mesh.position.set(x, MOLECULE_BUILDER.atomSize / 2, z);

      const label = makeAtomLabel(type.symbol);
      label.position.set(0, MOLECULE_BUILDER.atomSize / 2 + 0.5, 0);
      mesh.add(label);

      sceneLevel3.add(mesh);
      moleculeAtoms.push({
        mesh,
        symbol: type.symbol,
        isTarget: type.isTarget,
        collected: false,
      });
    }
  });
}

function updateMoleculeProgressHUD() {
  const molecule = currentMolecule();
  const parts = (molecule ? molecule.atoms : []).map(
    (a) => `${a.symbol}: ${moleculeCollected[a.symbol] || 0}/${a.count}`
  );
  moleculeProgress.textContent = `${parts.join("   ")}   —   Molecule ${
    moleculeQueueIndex + 1
  }/${moleculeQueue.length}`;
}

function updateMoleculeStage(delta) {
  if (level3Stage !== "molecule" || level3Won) return;

  const molecule = currentMolecule();
  if (!molecule) return;

  moleculeAtoms.forEach((atom) => {
    if (atom.collected) return;
    const dx = player.position.x - atom.mesh.position.x;
    const dz = player.position.z - atom.mesh.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist <= MOLECULE_BUILDER.collectDistance) {
      atom.collected = true;
      sceneLevel3.remove(atom.mesh);
      if (atom.isTarget) {
        moleculeCollected[atom.symbol] = (moleculeCollected[atom.symbol] || 0) + 1;
        updateMoleculeProgressHUD();
      }
    }
  });

  const roundComplete = (molecule.atoms || []).every(
    (a) => (moleculeCollected[a.symbol] || 0) >= a.count
  );

  if (roundComplete) {
    moleculeQueueIndex += 1;

    if (moleculeQueueIndex >= moleculeQueue.length) {
      level3Won = true;
      moleculeHUD.classList.add("hidden");
      showBirdMessage(BIRD_MESSAGES.level3Final);
      setTimeout(
        () =>
          showMessage(
            LEVEL3_WIN_MESSAGE.title,
            LEVEL3_WIN_MESSAGE.message,
            null,
            () => {
              controls.lock();
              armNextLevel(startLevel4);
            }
          ),
        200
      );
    } else {
      hintToast.textContent = `${molecule.formula} built! Keep going...`;
      hintToast.classList.remove("hidden");
      setTimeout(() => hintToast.classList.add("hidden"), 1800);
      startMoleculeRound();
    }
  }
}

// ------------------------------------------------------------
// Level 4 (Mirror Selfies) — walk up to any mirror in the gallery and
// press P to snap a selfie (with a camera-flash effect). No separate
// start trigger needed — the mechanic is live as soon as the level begins.
// ------------------------------------------------------------
let level4Won = false;
let selfieCount = 0;
let nearMirror = null; // the closest in-range mirror ref, or null

function startLevel4() {
  console.log("[startLevel4] called");

  runLevelTransition({
    label: LEVEL4_INTRO_MESSAGE.title,
    reveal: () => {
      loadPlayerModel(PLAYER_MODEL_4);
      switchToScene(sceneLevel4, LEVEL4_SPAWN);
    },
    onDone: () => {
      controls.isLocked = true;
      blocker.classList.add("hidden");
      setTimeout(() => {
        console.log("[startLevel4] showing level 4 intro message");
        showMessage(LEVEL4_INTRO_MESSAGE.title, LEVEL4_INTRO_MESSAGE.message, null);
        showBirdMessage(BIRD_MESSAGES.level4Intro);
      }, 300);
    },
  });
}

function updateSelfieCounterHUD() {
  selfieCounterHUD.textContent = `Selfies: ${selfieCount}/${MIRROR_SELFIE.requiredSelfies}`;
}

function updateMirrorsTrigger() {
  if (currentScene !== sceneLevel4 || level4Won) return;

  let closest = null;
  let closestDist = Infinity;
  mirrorRefs.forEach((mirror) => {
    const dx = player.position.x - mirror.position.x;
    const dz = player.position.z - mirror.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist <= MIRROR_SELFIE.mirrorRadius && dist < closestDist) {
      closestDist = dist;
      closest = mirror;
    }
  });
  nearMirror = closest;

  if (nearMirror) {
    hintToast.textContent = `Press P to take a selfie at the ${nearMirror.name}`;
    hintToast.classList.remove("hidden");
  } else {
    hintToast.classList.add("hidden");
  }
}

function triggerCameraFlash() {
  cameraFlash.style.transition = "none";
  cameraFlash.style.opacity = "1";
  // Force layout so the instant opacity:1 above is applied before the
  // transition kicks in on the next frame — otherwise it would just skip
  // straight to the faded-out state with no visible flash.
  void cameraFlash.offsetWidth;
  requestAnimationFrame(() => {
    cameraFlash.style.transition = `opacity ${MIRROR_SELFIE.flashDurationMs}ms ease-out`;
    cameraFlash.style.opacity = "0";
  });
}

function tryTakeSelfie() {
  if (!controls.isLocked) return;
  if (level4Won || !nearMirror) return;

  selfieCount += 1;
  triggerCameraFlash();
  updateSelfieCounterHUD();
  selfieCounterHUD.classList.remove("hidden");
  showBirdMessage("🤤".repeat(selfieCount), { duration: 1400 });

  if (selfieCount >= MIRROR_SELFIE.requiredSelfies) {
    level4Won = true;
    hintToast.classList.add("hidden");
    showBirdMessage(BIRD_MESSAGES.level4Final);
    setTimeout(
      () =>
        showMessage(
          LEVEL4_WIN_MESSAGE.title,
          LEVEL4_WIN_MESSAGE.message,
          null,
          () => {
            controls.lock();
            armNextLevel(startLevel5);
          }
        ),
      300
    );
  }
}

function startLevel5() {
  console.log("[startLevel5] called");

  runLevelTransition({
    label: LEVEL5_INTRO_MESSAGE.title,
    reveal: () => {
      switchToScene(sceneLevel5, LEVEL5_SPAWN);
    },
    onDone: () => {
      controls.isLocked = true;
      blocker.classList.add("hidden");
      setTimeout(() => {
        console.log("[startLevel5] showing level 5 intro message");
        showMessage(LEVEL5_INTRO_MESSAGE.title, LEVEL5_INTRO_MESSAGE.message, null);
      }, 300);
    },
  });
}

// ------------------------------------------------------------
// Controls: keyboard-only. The mouse does not move the camera —
// the chase camera just follows behind whichever way the player is
// currently facing (she turns to face the direction she's walking).
// This tiny object stands in for the old PointerLockControls so the
// rest of the game logic (isLocked / lock() / unlock()) didn't need
// to change shape.
// ------------------------------------------------------------
const controls = {
  isLocked: false,
  lock() {
    this.isLocked = true;
    blocker.classList.add("hidden");
    touchControls.classList.remove("hidden");
    if (!gameStarted) {
      gameStarted = true;
      setTimeout(() => showMessage(INTRO_MESSAGE.title, INTRO_MESSAGE.message, null), 300);
      setTimeout(() => showBirdMessage(BIRD_MESSAGES.intro), 300);
    }
  },
  unlock() {
    this.isLocked = false;
    touchControls.classList.add("hidden");
    if (messageOverlay.classList.contains("hidden")) {
      blocker.classList.remove("hidden");
    }
  },
};

const blocker = document.getElementById("blocker");
const startButton = document.getElementById("start-button");
const messageOverlay = document.getElementById("message-overlay");
const messageTitle = document.getElementById("message-title");
const messageText = document.getElementById("message-text");
const messageImage = document.getElementById("message-image");
const messageClose = document.getElementById("message-close");
const hintToast = document.getElementById("hint-toast");
const counterHUD = document.getElementById("collect-counter");
const timerHUD = document.getElementById("timer-hud");
const strengthHUD = document.getElementById("strength-hud");
const strengthFill = document.getElementById("strength-bar-fill");
const titrationHUD = document.getElementById("titration-hud");
const titrationFill = document.getElementById("titration-bar-fill");
const titrationZone = document.getElementById("titration-target-zone");
const moleculeHUD = document.getElementById("molecule-hud");
const moleculeFormula = document.getElementById("molecule-formula");
const moleculeProgress = document.getElementById("molecule-progress");
const levelTransition = document.getElementById("level-transition");
const levelTransitionText = document.getElementById("level-transition-text");
const selfieCounterHUD = document.getElementById("selfie-counter");
const cameraFlash = document.getElementById("camera-flash");
const jonHealthHUD = document.getElementById("jon-health-hud");
const jonHealthFill = document.getElementById("jon-health-fill");
const touchControls = document.getElementById("touch-controls");
const nextLevelToast = document.getElementById("next-level-toast");
const touchNextButton = document.getElementById("touch-btn-n");

// ------------------------------------------------------------
// Each scene stays fully explorable after its win condition is met —
// closing the win message just resumes play in the SAME scene instead of
// immediately jumping to the next one. `pendingLevelTransition` holds the
// actual transition function (startLevel2/3/4/5) until she's ready and
// presses N (or taps the on-screen "Next" button on touch), at which
// point it fires and clears itself.
// ------------------------------------------------------------
let pendingLevelTransition = null;

function armNextLevel(fn) {
  pendingLevelTransition = fn;
  nextLevelToast.classList.remove("hidden");
  touchNextButton.classList.remove("hidden");
}

function disarmNextLevel() {
  pendingLevelTransition = null;
  nextLevelToast.classList.add("hidden");
  touchNextButton.classList.add("hidden");
}

function tryAdvanceLevel() {
  if (!pendingLevelTransition) return;
  const next = pendingLevelTransition;
  disarmNextLevel();
  next();
}

// ------------------------------------------------------------
// Level transition — a full-screen fade to black used between levels so
// each new area (gym, campus) appears on its own instead of all being
// visible/loaded-in from the start. `reveal` runs while the screen is
// fully black (swap player model, flip environment group visibility);
// `onDone` runs once the fade back in has started.
// ------------------------------------------------------------
function runLevelTransition({ label, reveal, onDone }) {
  levelTransitionText.textContent = label || "";
  levelTransition.classList.remove("hidden");
  // Force layout so the "hidden" removal is applied before we add
  // "visible" on the next frame — otherwise the opacity transition
  // wouldn't have anything to transition from.
  void levelTransition.offsetWidth;
  requestAnimationFrame(() => {
    levelTransition.classList.add("visible");
  });

  setTimeout(() => {
    if (reveal) reveal();

    // Deliberately long hold (~17s, within the requested 15-20s window) on
    // the black loading screen after reveal() fires — reveal() is exactly
    // where the next level's heavy GLB assets start loading (see
    // loadLevel2Assets/loadLevel3Assets), so this gives them real time to
    // finish downloading/parsing before she's dropped into the new scene,
    // instead of racing the fade and sometimes popping in mid-load.
    setTimeout(() => {
      levelTransition.classList.remove("visible");
      if (onDone) onDone();
      setTimeout(() => {
        levelTransition.classList.add("hidden");
      }, 600); // matches the CSS opacity transition duration
    }, 17000);
  }, 600); // matches the CSS opacity transition duration (fade in)
}

// Moves the player (and her attached studio lights) out of whichever
// level scene she's currently in and into the next one, dropping her at
// that level's own spawn point/facing instead of carrying position over
// from the level before — each level is a clean, independent space.
function switchToScene(nextScene, spawn) {
  currentScene.remove(player);
  nextScene.add(player);
  currentScene = nextScene;

  player.position.set(spawn.x, spawn.y, spawn.z);
  player.rotation.y = spawn.rotationY || 0;
  bobGroup.position.y = 0;
  bobGroup.rotation.z = 0;
  bobGroup.rotation.y = 0;
  meshFlip = 0;
}

let gameStarted = false;

startButton.addEventListener("click", () => {
  controls.lock();
});

const move = { forward: false, backward: false, left: false, right: false };

document.addEventListener("keydown", (e) => {
  // Ignore the browser's auto-repeat keydown events while a key is held —
  // without this, holding R would fire tryTitrationClick() (and Enter
  // would fire the start-minigame functions) many times per second instead
  // of once per actual press.
  if (e.repeat) return;

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
      tryTakeSelfie();
      break;
    case "KeyR":
      holdR = true;
      tryTitrationClick();
      break;
    case "Enter":
      tryStartGymMinigame();
      tryStartLevel3Minigame();
      break;
    case "KeyB":
      tryHitJon();
      break;
    case "KeyN":
      tryAdvanceLevel();
      break;
    case "Space":
      tryBlowCandles();
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
    case "KeyR":
      holdR = false;
      break;
  }
});

// ------------------------------------------------------------
// Touch controls — on-screen movement pad + action buttons, shown only
// on touch devices (see the "pointer: coarse" media query in style.css).
// Each button drives the exact same state (move.forward/etc, holdR) and
// calls the exact same try*() functions as their keyboard equivalents,
// so nothing about the underlying game logic needed to change.
// Uses Pointer Events (not mouse/touch) so this works the same whether
// it's an actual finger or a mouse click on a touch-enabled laptop, and
// setPointerCapture keeps tracking the same button even if the finger
// drifts slightly, instead of losing the "held" state.
// ------------------------------------------------------------
function bindHoldButton(el, onDown, onUp) {
  if (!el) return;
  el.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    onDown();
  });
  const release = (e) => {
    if (onUp) onUp();
  };
  el.addEventListener("pointerup", release);
  el.addEventListener("pointercancel", release);
  el.addEventListener("lostpointercapture", release);
}

bindHoldButton(
  document.getElementById("touch-up"),
  () => (move.forward = true),
  () => (move.forward = false)
);
bindHoldButton(
  document.getElementById("touch-down"),
  () => (move.backward = true),
  () => (move.backward = false)
);
bindHoldButton(
  document.getElementById("touch-left"),
  () => (move.left = true),
  () => (move.left = false)
);
bindHoldButton(
  document.getElementById("touch-right"),
  () => (move.right = true),
  () => (move.right = false)
);

// One unified "Interact" button instead of five separate ones — every
// try*() function already guards itself on proximity/state (nearCafe,
// nearGym, nearLoyola, nearJon, nearMirror, level3Stage, etc.), so it's
// always safe to just fire all of them: only whichever one is actually
// contextually valid right now will do anything. Holding it down also
// drives holdR, for the gym's hold-to-build-strength machines.
bindHoldButton(
  document.getElementById("touch-btn-interact"),
  () => {
    holdR = true;
    tryTitrationClick();
    tryStartMinigame();
    tryTakeSelfie();
    tryStartGymMinigame();
    tryStartLevel3Minigame();
    tryHitJon();
    tryBlowCandles();
  },
  () => (holdR = false)
);
bindHoldButton(document.getElementById("touch-btn-n"), () => tryAdvanceLevel());

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
    hintToast.textContent = "Still loading the matcha model, try again in a moment...";
    hintToast.classList.remove("hidden");
    return;
  }
  minigameStarted = true;
  minigameActive = true;
  collectedCount = 0;
  timeRemaining = GAME.roundSeconds;
  hintToast.classList.add("hidden");
  // Start downloading the gym/Jon (~95MB combined) in the background right
  // now, during the round's ~timer-length of gameplay ahead — so by the
  // time she actually finishes and presses N to advance, it's usually
  // already loaded instead of making her wait through the transition.
  loadLevel2Assets();
  collectibles.length = 0;
  spawnMatcha(COLLECTIBLE.initialCount);
  updateCounterHUD();
  updateTimerHUD();
  counterHUD.classList.remove("hidden");
  timerHUD.classList.remove("hidden");
}

function endMinigame() {
  console.log("[endMinigame] café round finished, collectedCount:", collectedCount);
  minigameActive = false;
  collectibles.forEach((item) => {
    if (!item.collected) sceneLevel1.remove(item.mesh);
  });
  collectibles.length = 0;
  timerHUD.classList.add("hidden");
  counterHUD.classList.add("hidden");
  spawnGiantMatchas();
  showBirdMessage(BIRD_MESSAGES.final);
  setTimeout(
    () =>
      showMessage(
        WIN_MESSAGE.title,
        `${WIN_MESSAGE.message}\n\nYou collected ${collectedCount} matcha in ${GAME.roundSeconds} seconds!`,
        null,
        () => {
          controls.lock();
          armNextLevel(startLevel2);
        }
      ),
    200
  );
}

function updateCollectibles(delta) {
  if (!minigameActive) return;

  timeRemaining -= delta;
  updateTimerHUD();
  if (timeRemaining <= 0) {
    endMinigame();
    return;
  }

  collectibles.forEach((item) => {
    if (item.collected) return;

    item.mesh.userData.bobOffset += delta * 2;
    item.mesh.position.y = Math.sin(item.mesh.userData.bobOffset) * 0.08 + 0.05;
    item.mesh.rotation.y += delta * 1.2;

    const dx = player.position.x - item.mesh.position.x;
    const dz = player.position.z - item.mesh.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist <= COLLECTIBLE.collectDistance) {
      item.collected = true;
      sceneLevel1.remove(item.mesh);
      collectedCount++;
      updateCounterHUD();
      showBirdMessage(`DAM${"N".repeat(collectedCount)}`, { duration: 1400 });
      spawnMatcha(COLLECTIBLE.spawnPerCollect);
    }
  });
}

let messageOnClose = null;

function showMessage(title, text, image, onClose) {
  messageTitle.textContent = title;
  messageText.textContent = text;
  if (image) {
    messageImage.src = image;
    messageImage.classList.remove("hidden");
  } else {
    messageImage.classList.add("hidden");
  }
  messageOverlay.classList.remove("hidden");
  messageOnClose = typeof onClose === "function" ? onClose : null;
  controls.unlock();
}

messageClose.addEventListener("click", () => {
  messageOverlay.classList.add("hidden");
  const cb = messageOnClose;
  messageOnClose = null;
  console.log("[messageClose] onClose callback present:", !!cb);
  if (cb) {
    cb();
  } else {
    controls.lock();
  }
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

const CAM_DISTANCE = 7;
const CAM_HEIGHT = 3.4;
const MOVE_SPEED = 6.5;
const TURN_SPEED = 2.4; // radians/sec — how fast A/D spin her in place

let bobTime = 0;
let meshFlip = 0; // extra visual-only yaw applied to the mesh so she can face the camera

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.1);

  // Clouds drift regardless of which level is active or whether the game
  // is currently paused/on a menu — they just quietly wrap around once
  // they drift past the edge of their spawn radius.
  const cloudLimit = CLOUDS.radius + 20;
  cloudRefs.forEach((cloud) => {
    cloud.group.position.x += cloud.speed * delta;
    if (cloud.group.position.x > cloudLimit) cloud.group.position.x = -cloudLimit;
    if (cloud.group.position.x < -cloudLimit) cloud.group.position.x = cloudLimit;
  });

  // Same deal for debris from hitting Jon — keeps falling/tumbling
  // regardless of which level is currently active.
  updateDebris(delta);

  // Garden ending: floating hearts keep drifting upward and candle
  // flames keep flickering regardless of which level is currently active.
  heartRefs.forEach((h) => {
    h.sprite.position.y += h.speed * delta;
    if (h.sprite.position.y > h.ceiling) h.sprite.position.y = h.floor;
  });
  updateCandleFlicker(clock.elapsedTime);

  // Bird companion appears alongside her during Levels 1-3 — gently bobs
  // and flaps its wings, and its speech bubble (if any) floats along with
  // it since the bubble sprite is a child of the bird's own group.
  birdCompanion.group.visible =
    currentScene === sceneLevel1 ||
    currentScene === sceneLevel2 ||
    currentScene === sceneLevel3 ||
    currentScene === sceneLevel4;
  if (birdCompanion.group.visible) {
    birdFlapTime += delta * 6;
    const flap = Math.sin(birdFlapTime) * 0.5;
    birdCompanion.wingL.rotation.x = flap;
    birdCompanion.wingR.rotation.x = -flap;
    birdCompanion.group.position.y = BIRD_COMPANION.offset.y + Math.sin(birdFlapTime * 0.5) * 0.08;
  }

  if (controls.isLocked) {
    // Tank-style controls, all relative to the player's own heading:
    // A/D turn her in place, W/S move forward/backward along whatever
    // direction she's currently facing. (The backward visual face-flip
    // is handled separately below, on the mesh only.)
    const isMoving = move.forward || move.backward || move.left || move.right;

    if (move.left) player.rotation.y += TURN_SPEED * delta;
    if (move.right) player.rotation.y -= TURN_SPEED * delta;

    // Matches the mapping the player model was calibrated against: rotating
    // her local forward (+Z) by rotation.y lands on world (sin y, 0, cos y).
    const facing = new THREE.Vector3(
      Math.sin(player.rotation.y),
      0,
      Math.cos(player.rotation.y)
    );

    const moveVec = new THREE.Vector3();
    if (move.forward) moveVec.add(facing);
    if (move.backward) moveVec.sub(facing);

    if (moveVec.lengthSq() > 0) {
      moveVec.normalize().multiplyScalar(MOVE_SPEED * delta);
      // Resolved per-axis against the current scene's colliders — so
      // walking straight into a wall at an angle still lets her slide
      // along it instead of just stopping dead.
      const tryX = player.position.x + moveVec.x;
      if (!isBlocked(currentScene, tryX, player.position.z)) {
        player.position.x = tryX;
      }
      const tryZ = player.position.z + moveVec.z;
      if (!isBlocked(currentScene, player.position.x, tryZ)) {
        player.position.z = tryZ;
      }
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

    // Pressing back turns her to face the camera while she still steps
    // backward — this only spins the visual mesh (bobGroup), not the
    // player's actual heading, so movement direction and the camera's
    // chase position (both based on player.rotation.y) stay untouched.
    const wantFlip = move.backward && !move.forward ? Math.PI : 0;
    meshFlip = THREE.MathUtils.lerp(meshFlip, wantFlip, Math.min(1, delta * 8));
    bobGroup.rotation.y = meshFlip;

    // Camera follows behind the player's current facing direction
    // (derived from player.rotation.y), not from any mouse input.
    camera.position.set(
      player.position.x - facing.x * CAM_DISTANCE,
      player.position.y + CAM_HEIGHT,
      player.position.z - facing.z * CAM_DISTANCE
    );
    camera.lookAt(player.position.x, player.position.y + 1.3, player.position.z);

    updateCafeTrigger();
    updateCollectibles(delta);
    updateGymTrigger();
    updateMachines(delta);
    updateLoyolaTrigger();
    updateMoleculeStage(delta);
    updateMirrorsTrigger();
    updateJonTrigger();
    updateCandleTrigger();
  }

  renderer.render(currentScene, camera);
}

animate();
