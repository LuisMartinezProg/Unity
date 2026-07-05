/**
 * El Engine es el corazón que hace tick. No sabe de render, física ni input:
 * solo mantiene una lista ordenada de Systems y les pasa la Scene actual
 * junto con el delta time, frame tras frame.
 *
 * El ORDEN en que agregás los systems importa muchísimo. Por ejemplo:
 * input/gameplay -> physics -> camera -> render -> debug
 * así cada system trabaja con los datos ya actualizados por el anterior.
 */
export class Engine {
  constructor() {
    this.systems = [];
    this.scene = null;
    this.running = false;
    this._lastTime = 0;
    this._rafId = null;
  }

  setScene(scene) {
    this.scene = scene;
  }

  /**
   * Agrega un system. Si el system tiene un método init(engine), se llama
   * una sola vez al agregarlo (útil para setup que necesita el engine mismo).
   */
  addSystem(system) {
    this.systems.push(system);
    if (typeof system.init === 'function') system.init(this);
    return this;
  }

  /** Busca un system ya agregado por su clase. Igual patrón que Entity.get(). */
  getSystem(SystemClass) {
    return this.systems.find((s) => s instanceof SystemClass);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this._lastTime = performance.now();

    const loop = (time) => {
      if (!this.running) return;

      // Clamp: si el celular bloqueó la pestaña y volvió con un salto de 3s,
      // no queremos que la física reciba un delta de 3s y todo explote.
      const delta = Math.min((time - this._lastTime) / 1000, 0.1);
      this._lastTime = time;

      for (const system of this.systems) {
        if (typeof system.update === 'function') {
          system.update(this.scene, delta, this);
        }
      }

      this._rafId = requestAnimationFrame(loop);
    };

    this._rafId = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    if (this._rafId !== null) cancelAnimationFrame(this._rafId);
  }
}
