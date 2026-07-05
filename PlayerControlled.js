/**
 * Marca una entidad como controlable por el jugador y guarda su velocidad
 * de movimiento y de salto. El PlayerControlSystem busca entidades con este
 * componente (+ Transform + RigidBody) y les aplica velocidad según el input.
 *
 * jumpForce es la velocidad vertical que se aplica en el instante del salto
 * (no una fuerza continua). La altura máxima que alcanza depende de la
 * gravedad: altura ≈ jumpForce² / (2 * gravedad). Con la gravedad por
 * defecto del motor (9.82), jumpForce: 6 da un salto de más o menos 1.8
 * unidades de alto.
 */
export class PlayerControlled {
  constructor({ speed = 5, jumpForce = 6 } = {}) {
    this.speed = speed;
    this.jumpForce = jumpForce;
  }
}
