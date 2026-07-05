/**
 * Junta el input crudo (teclado, mouse, joystick táctil) en un solo lugar
 * con estado consultable. No decide qué hacer con ese input: eso lo hacen
 * systems de gameplay como PlayerControlSystem, leyendo isKeyDown() o
 * this.joystick cada frame.
 *
 * No tiene update() propio: los listeners actualizan el estado en el momento
 * en que ocurren (evento de teclado/touch), no en el loop del engine.
 */
export class InputSystem {
  constructor({ enableTouchJoystick = true } = {}) {
    this.keys = new Set();
    this.pointerDelta = { x: 0, y: 0 };
    this.joystick = { x: 0, y: 0, active: false };

    window.addEventListener('keydown', (e) => this.keys.add(e.code));
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));

    window.addEventListener('mousemove', (e) => {
      this.pointerDelta.x += e.movementX || 0;
      this.pointerDelta.y += e.movementY || 0;
    });

    if (enableTouchJoystick) this._setupTouchJoystick();
  }

  isKeyDown(code) {
    return this.keys.has(code);
  }

  /** Lee el movimiento del mouse acumulado desde la última vez y lo resetea. */
  consumePointerDelta() {
    const d = { x: this.pointerDelta.x, y: this.pointerDelta.y };
    this.pointerDelta.x = 0;
    this.pointerDelta.y = 0;
    return d;
  }

  _setupTouchJoystick() {
    const base = document.createElement('div');
    Object.assign(base.style, {
      position: 'fixed',
      left: '30px',
      bottom: '30px',
      width: '110px',
      height: '110px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.15)',
      border: '2px solid rgba(255,255,255,0.3)',
      touchAction: 'none',
      zIndex: '1000',
    });

    const knob = document.createElement('div');
    Object.assign(knob.style, {
      position: 'absolute',
      left: '35px',
      top: '35px',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.55)',
      pointerEvents: 'none',
    });

    base.appendChild(knob);
    document.body.appendChild(base);

    const maxDist = 35;
    let touchId = null;
    let originX = 0;
    let originY = 0;

    const onStart = (e) => {
      const touch = e.changedTouches[0];
      touchId = touch.identifier;
      const rect = base.getBoundingClientRect();
      originX = rect.left + rect.width / 2;
      originY = rect.top + rect.height / 2;
      this.joystick.active = true;
    };

    const onMove = (e) => {
      for (const touch of e.changedTouches) {
        if (touch.identifier !== touchId) continue;
        let dx = touch.clientX - originX;
        let dy = touch.clientY - originY;
        const dist = Math.min(Math.hypot(dx, dy), maxDist);
        const angle = Math.atan2(dy, dx);
        dx = Math.cos(angle) * dist;
        dy = Math.sin(angle) * dist;
        knob.style.left = `${35 + dx}px`;
        knob.style.top = `${35 + dy}px`;
        this.joystick.x = dx / maxDist;
        this.joystick.y = dy / maxDist;
      }
    };

    const onEnd = (e) => {
      for (const touch of e.changedTouches) {
        if (touch.identifier !== touchId) continue;
        touchId = null;
        this.joystick.active = false;
        this.joystick.x = 0;
        this.joystick.y = 0;
        knob.style.left = '35px';
        knob.style.top = '35px';
      }
    };

    base.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    window.addEventListener('touchcancel', onEnd, { passive: true });
  }
}
