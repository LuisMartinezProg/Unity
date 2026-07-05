import * as THREE from 'three';
import { Scene } from '../core/Scene.js';
import { Transform } from '../components/Transform.js';
import { MeshRenderer } from '../components/MeshRenderer.js';
import { RigidBody } from '../components/RigidBody.js';
import { PlayerControlled } from '../components/PlayerControlled.js';
import { Light } from '../components/Light.js';
import { Shapes } from '../physics/PhysicsShapes.js';

/**
 * Escena de ejemplo que prueba el pipeline completo de punta a punta:
 * - Piso estático (mass: 0)
 * - Cubo que cae solo por gravedad (demuestra física pura)
 * - Esfera controlable con WASD/flechas/joystick táctil (demuestra input)
 * - Una luz direccional con sombras
 *
 * Usá esto como plantilla: copiá el patrón create-entity + add-componentes
 * para agregar tus propios objetos.
 */
export function createDemoScene() {
  const scene = new Scene('Demo');

  // --- Piso ---
  const ground = scene.createEntity('Ground');
  const groundMesh = new THREE.Mesh(
    new THREE.BoxGeometry(20, 0.5, 20),
    new THREE.MeshStandardMaterial({ color: 0x3a3a4a })
  );
  groundMesh.receiveShadow = true;
  ground.add(new Transform({ position: [0, -0.25, 0] }));
  ground.add(new MeshRenderer(groundMesh));
  ground.add(
    new RigidBody({ mass: 0, shape: Shapes.box(20, 0.5, 20), position: [0, -0.25, 0] })
  );

  // --- Cubo que cae (física pura, sin input) ---
  const cube = scene.createEntity('Cube');
  const cubeMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xe07856 })
  );
  cubeMesh.castShadow = true;
  cube.add(new Transform({ position: [-2, 5, 0] }));
  cube.add(new MeshRenderer(cubeMesh));
  cube.add(new RigidBody({ mass: 1, shape: Shapes.box(1, 1, 1), position: [-2, 5, 0] }));

  // --- Jugador (input -> velocidad -> física) ---
  const player = scene.createEntity('Player');
  const playerMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 20, 20),
    new THREE.MeshStandardMaterial({ color: 0x5ad1e6 })
  );
  playerMesh.castShadow = true;
  player.add(new Transform({ position: [3, 1, 0] }));
  player.add(new MeshRenderer(playerMesh));
  player.add(
    new RigidBody({
      mass: 1,
      shape: Shapes.sphere(0.5),
      position: [3, 1, 0],
      linearDamping: 0.5, // sin esto se desliza como en hielo al soltar el input
      fixedRotation: true, // evita que la esfera "ruede" por el torque de contacto
    })
  );
  player.add(new PlayerControlled({ speed: 5 }));

  // --- Luz direccional con sombras ---
  const lightEntity = scene.createEntity('SunLight');
  const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(1024, 1024);
  // El frustum de sombra de una DirectionalLight es una cámara ortográfica:
  // hay que ajustarla al tamaño de la escena o las sombras se recortan.
  dirLight.shadow.camera.left = -15;
  dirLight.shadow.camera.right = 15;
  dirLight.shadow.camera.top = 15;
  dirLight.shadow.camera.bottom = -15;
  dirLight.shadow.camera.far = 40;
  lightEntity.add(new Transform({ position: [8, 12, 6] }));
  lightEntity.add(new Light(dirLight));

  // Luz ambiental suave para que las sombras no sean negro puro. La posición
  // no le afecta en nada (una AmbientLight ilumina parejo desde todos lados),
  // pero la hacemos entidad igual para no romper el patrón: así RenderSystem
  // no necesita ningún caso especial para este tipo de luz.
  const ambientEntity = scene.createEntity('AmbientLight');
  ambientEntity.add(new Transform());
  ambientEntity.add(new Light(new THREE.AmbientLight(0xffffff, 0.35)));

  scene.playerEntity = player; // referencia directa cómoda para main.js

  return scene;
}
