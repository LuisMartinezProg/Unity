import { Engine } from './core/Engine.js';
import { RenderSystem } from './systems/RenderSystem.js';
import { PhysicsSystem } from './systems/PhysicsSystem.js';
import { InputSystem } from './systems/InputSystem.js';
import { PlayerControlSystem } from './systems/PlayerControlSystem.js';
import { CameraSystem } from './systems/CameraSystem.js';
import { Inspector } from './debug/Inspector.js';
import { createDemoScene } from './scenes/DemoScene.js';

const canvas = document.getElementById('viewport');

const engine = new Engine();
const renderSystem = new RenderSystem(canvas);
const physicsSystem = new PhysicsSystem();
const inputSystem = new InputSystem();
const playerControlSystem = new PlayerControlSystem(inputSystem);
const cameraSystem = new CameraSystem(renderSystem, { offset: [0, 4, 8], smoothing: 5 });
const inspector = new Inspector({ startOpen: false });

const scene = createDemoScene();
engine.setScene(scene);
cameraSystem.setTarget(scene.playerEntity);

// El ORDEN acá es la parte más importante de todo el bootstrap:
// 1) input ya está escuchando eventos por su cuenta (no necesita update)
// 2) playerControl lee el input y decide la velocidad deseada
// 3) physics avanza el mundo usando esa velocidad y actualiza los Transform
// 4) camera sigue el Transform ya actualizado del jugador
// 5) render dibuja todo con las posiciones ya al día
// 6) inspector solo lee/edita, no afecta la simulación
engine.addSystem(inputSystem);
engine.addSystem(playerControlSystem);
engine.addSystem(physicsSystem);
engine.addSystem(cameraSystem);
engine.addSystem(renderSystem);
engine.addSystem(inspector);

engine.start();

// Acceso rápido desde la consola del navegador para debug manual:
// engine.scene, engine.getSystem(PhysicsSystem).world, etc.
window.__engine = engine;
