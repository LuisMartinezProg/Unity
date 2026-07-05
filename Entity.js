let nextId = 0;

/**
 * Una Entity es solo un contenedor de componentes.
 * No tiene comportamiento propio: todo el comportamiento vive en los Systems,
 * que leen y modifican los componentes de las entidades que les interesan.
 */
export class Entity {
  constructor(name = 'Entity') {
    this.id = nextId++;
    this.name = name;
    this.active = true;
    this.components = new Map();
  }

  /**
   * Agrega un componente. La clase del componente se usa como llave,
   * así que solo puede haber un componente de cada tipo por entidad.
   * Devuelve la propia entidad para poder encadenar .add().add().add()
   */
  add(component) {
    this.components.set(component.constructor, component);
    component.entity = this;
    return this;
  }

  /** Devuelve el componente de esa clase, o undefined si no lo tiene. */
  get(ComponentClass) {
    return this.components.get(ComponentClass);
  }

  /** true si la entidad tiene TODOS los tipos de componente pasados. */
  has(...ComponentClasses) {
    return ComponentClasses.every((C) => this.components.has(C));
  }

  remove(ComponentClass) {
    this.components.delete(ComponentClass);
    return this;
  }
}
