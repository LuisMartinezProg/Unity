import * as THREE from 'three';
import { Transform } from '../components/Transform.js';

/**
 * Cámara que sigue a una entidad objetivo con un offset fijo en el mundo
 * (no relativo a hacia dónde "mira" el objetivo, porque acá el jugador no
 * gira: se mueve con velocidad directa). Es el estilo de cámara típico de
 * un juego isométrico o twin-stick.
 *
 * Si más adelante el jugador puede girar y querés una cámara "detrás del
 * personaje" de verdad, vas a necesitar trackear una dirección de facing
 * aparte, porque acá fixedRotation en el RigidBody del jugador congela su
 * rotación física.
 */
export class CameraSystem {
  constructor(renderSystem, { target = null, offset = [0, 4, 8], smoothing = 5 } = {}) {
    this.renderSystem = renderSystem;
    this.target = target;
    this.offset = new THREE.Vector3(...offset);
    this.smoothing = smoothing;
    this._desired = new THREE.Vector3();
  }

  setTarget(entity) {
    this.target = entity;
  }

  update(scene, delta) {
    if (!this.target) return;
    const t = this.target.get(Transform);
    if (!t) return;

    this._desired.copy(this.offset).add(t.position);

    const camera = this.renderSystem.camera;
    // Suavizado independiente del framerate: a mayor "smoothing", más rápido
    // alcanza el destino, sin importar si el frame duró 16ms o 40ms.
    const lerpFactor = 1 - Math.pow(0.001, delta * this.smoothing);
    camera.position.lerp(this._desired, lerpFactor);
    camera.lookAt(t.position);
  }
}
