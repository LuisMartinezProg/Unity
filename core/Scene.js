import { Entity } from './Entity.js';

/**
 * Una Scene es una colección de entidades. No sabe nada de render ni física:
 * eso lo hacen los Systems que la reciben cada frame.
 */
export class Scene {
  constructor(name = 'Scene') {
    this.name = name;
    this.entities = [];
  }

  createEntity(name) {
    const entity = new Entity(name);
    this.entities.push(entity);
    return entity;
  }

  removeEntity(entity) {
    const index = this.entities.indexOf(entity);
    if (index !== -1) this.entities.splice(index, 1);
  }

  /**
   * Devuelve todas las entidades activas que tengan TODOS los componentes pedidos.
   * Ejemplo: scene.query(Transform, RigidBody) → todo lo que tiene física.
   */
  query(...ComponentClasses) {
    return this.entities.filter((e) => e.active && e.has(...ComponentClasses));
  }

  clear() {
    this.entities = [];
  }
}
