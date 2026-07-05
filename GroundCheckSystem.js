import * as CANNON from 'cannon-es';
import { Transform } from '../components/Transform.js';
import { RigidBody } from '../components/RigidBody.js';
import { GroundChecker } from '../components/GroundChecker.js';

/**
 * Tira un rayo hacia abajo desde cada entidad con GroundChecker y actualiza
 * su .grounded según si ese rayo pegó contra algo.
 *
 * Tiene que correr DESPUÉS de PhysicsSystem del frame anterior (o sea, ANTES
 * de PhysicsSystem de este frame) para leer la posición ya resuelta del
 * cuerpo. En el orden del engine va: input -> groundCheck -> playerControl
 * -> physics -> camera -> render. Así, cuando PlayerControlSystem decide si
 * dejar saltar, ya tiene el dato de grounded fresco de este mismo frame.
 */
export class GroundCheckSystem {
  constructor(physicsSystem) {
    this.physicsSystem = physicsSystem;
    this._from = new CANNON.Vec3();
    this._to = new CANNON.Vec3();
    this._result = new CANNON.RaycastResult();
  }

  update(scene) {
    if (!scene) return;
    const world = this.physicsSystem.world;

    for (const entity of scene.query(Transform, RigidBody, GroundChecker)) {
      const { body } = entity.get(RigidBody);
      const checker = entity.get(GroundChecker);

      this._from.copy(body.position);
      this._to.copy(body.position);
      this._to.y -= checker.rayLength;

      this._result.reset();
      world.raycastClosest(
        this._from,
        this._to,
        { skipBackfaces: true, collisionFilterMask: -1 },
        this._result
      );

      // hasHit contra un body que no sea uno mismo (por si el propio rayo
      // rozara la propia forma al salir del centro del cuerpo).
      checker.grounded = this._result.hasHit && this._result.body !== body;
    }
  }
}
