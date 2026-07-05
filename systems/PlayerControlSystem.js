import { Transform } from '../components/Transform.js';
import { RigidBody } from '../components/RigidBody.js';
import { PlayerControlled } from '../components/PlayerControlled.js';

const KEY_MAP = {
  forward: ['KeyW', 'ArrowUp'],
  back: ['KeyS', 'ArrowDown'],
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
};

function anyDown(input, codes) {
  return codes.some((code) => input.isKeyDown(code));
}

/**
 * Traduce input (teclado + joystick táctil) en velocidad horizontal para
 * cualquier entidad con PlayerControlled + RigidBody. Tiene que correr ANTES
 * que PhysicsSystem en el orden del engine, para que el world.step() de este
 * mismo frame ya use la velocidad recién calculada (si corriera después,
 * el input se sentiría con un frame de retraso).
 */
export class PlayerControlSystem {
  constructor(inputSystem) {
    this.input = inputSystem;
  }

  update(scene) {
    if (!scene) return;

    for (const entity of scene.query(Transform, RigidBody, PlayerControlled)) {
      const { body } = entity.get(RigidBody);
      const { speed } = entity.get(PlayerControlled);

      let moveX = 0;
      let moveZ = 0;

      if (anyDown(this.input, KEY_MAP.forward)) moveZ -= 1;
      if (anyDown(this.input, KEY_MAP.back)) moveZ += 1;
      if (anyDown(this.input, KEY_MAP.left)) moveX -= 1;
      if (anyDown(this.input, KEY_MAP.right)) moveX += 1;

      if (this.input.joystick.active) {
        moveX += this.input.joystick.x;
        moveZ += this.input.joystick.y;
      }

      const len = Math.hypot(moveX, moveZ);
      if (len > 0) {
        // Normalizar evita que moverse en diagonal (teclado) sea más rápido
        // que moverse en línea recta.
        body.velocity.x = (moveX / len) * speed;
        body.velocity.z = (moveZ / len) * speed;
      } else {
        body.velocity.x = 0;
        body.velocity.z = 0;
      }
      // body.velocity.y no se toca acá: así la gravedad y los saltos
      // (si los agregás después) siguen funcionando sin que este system
      // interfiera con el eje vertical.
    }
  }
}
