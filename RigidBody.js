import * as CANNON from 'cannon-es';

/**
 * Envuelve un CANNON.Body. Este mismo componente sirve tanto para objetos
 * dinámicos (afectados por gravedad y fuerzas) como estáticos (el piso,
 * paredes): la diferencia es solo mass. mass: 0 => cuerpo estático, inmóvil,
 * pero que sigue chocando con todo lo demás. No hace falta un componente
 * "Collider" aparte: en Cannon la forma vive dentro del Body.
 *
 * position se pasa por separado (no al constructor de CANNON.Body) porque
 * Cannon espera ahí una instancia de Vec3, no un array plano.
 */
export class RigidBody {
  constructor({
    mass = 1,
    shape,
    position,
    linearDamping = 0.01,
    angularDamping = 0.01,
    fixedRotation = false,
    material,
  } = {}) {
    this.body = new CANNON.Body({
      mass,
      shape,
      material,
      linearDamping,
      angularDamping,
      fixedRotation,
    });
    if (position) this.body.position.set(...position);
  }
}
