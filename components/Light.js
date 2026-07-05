/**
 * Envuelve una luz de Three.js (DirectionalLight, PointLight, etc).
 * Mismo patrón que MeshRenderer: vos creás la luz, el RenderSystem la agrega
 * a la escena y sincroniza su posición con el Transform.
 */
export class Light {
  constructor(threeLight) {
    this.light = threeLight;
  }
}
