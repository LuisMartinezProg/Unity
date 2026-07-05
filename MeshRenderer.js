/**
 * Envuelve un THREE.Mesh (geometría + material) ya creado por vos.
 * El RenderSystem se encarga de agregarlo a la escena de Three.js y de
 * sincronizar su posición/rotación/escala con el Transform de la entidad.
 */
export class MeshRenderer {
  constructor(mesh) {
    this.mesh = mesh;
  }
}
