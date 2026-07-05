/**
 * Config + resultado de "¿esta entidad está tocando el piso?".
 * GroundCheckSystem escribe .grounded cada frame; cualquier otro system
 * (como PlayerControlSystem, para decidir si puede saltar) solo lo lee.
 *
 * rayLength: qué tan largo es el rayo que se tira hacia abajo desde el
 * centro del RigidBody. Tiene que ser un poco más que el "radio" o media
 * altura de la forma física, si no nunca va a tocar el piso antes de que
 * el propio cuerpo ya esté enterrado en él.
 */
export class GroundChecker {
  constructor({ rayLength = 0.6 } = {}) {
    this.rayLength = rayLength;
    this.grounded = false;
  }
}
