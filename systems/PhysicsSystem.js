import * as CANNON from 'cannon-es';
import { Transform } from '../components/Transform.js';
import { RigidBody } from '../components/RigidBody.js';

/**
 * Dueño del mundo físico de Cannon-es. Cada frame: agrega al mundo los
 * cuerpos que sean nuevos, avanza la simulación, y copia la posición/rotación
 * resultante de cada Body hacia el Transform de su entidad.
 *
 * Este system corre el mundo físico como fuente de verdad de la posición
 * para cualquier entidad con RigidBody: si algo tiene física, la física
 * manda, y el Transform solo refleja el resultado.
 */
export class PhysicsSystem {
  constructor({ gravity = [0, -9.82, 0] } = {}) {
    this.world = new CANNON.World({ gravity: new CANNON.Vec3(...gravity) });
    this._tracked = new Set();
  }

  update(scene, delta) {
    if (!scene) return;

    const entities = scene.query(Transform, RigidBody);

    for (const entity of entities) {
      const { body } = entity.get(RigidBody);
      if (!this._tracked.has(body)) {
        this.world.addBody(body);
        this._tracked.add(body);
      }
    }

    // Paso fijo de 1/60 con hasta 3 sub-pasos para absorber deltas variables
    // sin que la simulación se vuelva inestable en un celular con frame drops.
    this.world.step(1 / 60, delta, 3);

    for (const entity of entities) {
      const t = entity.get(Transform);
      const { body } = entity.get(RigidBody);
      t.position.copy(body.position);
      t.quaternion.set(
        body.quaternion.x,
        body.quaternion.y,
        body.quaternion.z,
        body.quaternion.w
      );
    }
  }
}
