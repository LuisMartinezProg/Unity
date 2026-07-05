import * as THREE from 'three';

/**
 * Posición, rotación y escala de una entidad en el mundo.
 *
 * Uso Quaternion en vez de Euler para la rotación a propósito: Cannon-es
 * trabaja internamente en quaternions, y convertir Euler <-> Quaternion cada
 * frame es trabajo extra y puede causar gimbal lock. Si necesitás poner una
 * rotación "a mano" en grados/radianes, usá setRotationFromEuler().
 */
export class Transform {
  constructor({ position, quaternion, scale } = {}) {
    this.position = new THREE.Vector3(...(position || [0, 0, 0]));
    this.quaternion = new THREE.Quaternion(...(quaternion || [0, 0, 0, 1]));
    this.scale = new THREE.Vector3(...(scale || [1, 1, 1]));
  }

  setRotationFromEuler(x, y, z) {
    this.quaternion.setFromEuler(new THREE.Euler(x, y, z));
    return this;
  }
}
