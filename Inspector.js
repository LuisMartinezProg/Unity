import { Transform } from '../components/Transform.js';

/**
 * Overlay de debug: lista las entidades de la escena y permite tocar una
 * para ver/editar su posición y escala en vivo. Pensado para celular:
 * un botón fijo en la esquina (no hay tecla F1 en un teléfono) abre/cierra
 * el panel.
 *
 * Detalle importante: NO reconstruye el HTML 60 veces por segundo. Si lo
 * hiciera, cualquier <input> que estés tocando perdería el foco a mitad de
 * escritura (justo el tipo de bug que solo se nota probando en el celular).
 * Reconstruye la lista solo cuando cambia el set de entidades o la selección,
 * y el resto del tiempo solo actualiza los valores de los campos que no
 * tengas enfocados en ese momento.
 */
export class Inspector {
  constructor({ startOpen = false } = {}) {
    this.visible = startOpen;
    this.selected = null;
    this._lastKey = '';
    this._refreshTimer = 0;
    this._fields = {};
    this._buildDOM();
  }

  _buildDOM() {
    this.toggleBtn = document.createElement('button');
    this.toggleBtn.textContent = '🔧';
    Object.assign(this.toggleBtn.style, {
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: '1002',
      width: '44px',
      height: '44px',
      borderRadius: '8px',
      border: 'none',
      background: 'rgba(0,0,0,0.6)',
      color: '#fff',
      fontSize: '20px',
    });
    this.toggleBtn.addEventListener('click', () => this.toggle());
    document.body.appendChild(this.toggleBtn);

    this.panel = document.createElement('div');
    Object.assign(this.panel.style, {
      position: 'fixed',
      top: '60px',
      right: '10px',
      width: '260px',
      maxHeight: '70vh',
      overflowY: 'auto',
      zIndex: '1001',
      background: 'rgba(20,20,25,0.92)',
      color: '#e0e0e0',
      fontFamily: 'monospace',
      fontSize: '12px',
      padding: '8px',
      borderRadius: '8px',
      display: this.visible ? 'block' : 'none',
    });
    document.body.appendChild(this.panel);
  }

  toggle() {
    this.visible = !this.visible;
    this.panel.style.display = this.visible ? 'block' : 'none';
  }

  update(scene, delta = 0) {
    if (!this.visible || !scene) return;

    this._refreshTimer += delta;
    const key = `${scene.entities.map((e) => e.id).join(',')}|${this.selected ? this.selected.id : ''}`;

    if (key !== this._lastKey) {
      this._rebuild(scene);
      this._lastKey = key;
      this._refreshTimer = 0;
      return;
    }

    // Actualiza valores unas 6-7 veces por segundo, no cada frame: alcanza
    // de sobra para "en vivo" y no compite por foco con el usuario tipeando.
    if (this._refreshTimer > 0.15) {
      this._refreshTimer = 0;
      this._syncFields();
    }
  }

  _rebuild(scene) {
    this.panel.innerHTML = '';
    this._fields = {};

    for (const entity of scene.entities) {
      const row = document.createElement('div');
      row.style.marginBottom = '6px';
      row.style.paddingBottom = '6px';
      row.style.borderBottom = '1px solid rgba(255,255,255,0.1)';

      const header = document.createElement('div');
      header.textContent = `${entity.active ? '●' : '○'} ${entity.name} (#${entity.id})`;
      header.style.cursor = 'pointer';
      header.style.fontWeight = 'bold';
      header.addEventListener('click', () => {
        this.selected = this.selected === entity ? null : entity;
        this._lastKey = ''; // fuerza rebuild inmediato en el próximo update()
      });
      row.appendChild(header);

      if (this.selected === entity) {
        const t = entity.get(Transform);
        if (t) {
          row.appendChild(this._vectorField('pos', t.position));
          row.appendChild(this._vectorField('scale', t.scale));
        }
        const compList = document.createElement('div');
        compList.style.opacity = '0.7';
        compList.style.marginTop = '2px';
        compList.textContent = [...entity.components.keys()].map((c) => c.name).join(', ');
        row.appendChild(compList);
      }

      this.panel.appendChild(row);
    }

    if (scene.entities.length === 0) {
      this.panel.textContent = '(sin entidades)';
    }
  }

  _vectorField(prop, vec3) {
    const wrap = document.createElement('div');
    Object.assign(wrap.style, { display: 'flex', gap: '4px', margin: '4px 0', alignItems: 'center' });

    const tag = document.createElement('span');
    tag.textContent = prop;
    tag.style.width = '40px';
    wrap.appendChild(tag);

    for (const axis of ['x', 'y', 'z']) {
      const input = document.createElement('input');
      input.type = 'number';
      input.step = '0.1';
      input.value = vec3[axis].toFixed(2);
      input.style.width = '55px';
      input.addEventListener('change', () => {
        vec3[axis] = parseFloat(input.value) || 0;
      });
      this._fields[`${prop}.${axis}`] = input;
      wrap.appendChild(input);
    }

    return wrap;
  }

  _syncFields() {
    if (!this.selected) return;
    const t = this.selected.get(Transform);
    if (!t) return;

    for (const [key, input] of Object.entries(this._fields)) {
      if (document.activeElement === input) continue; // no pisar lo que estás tipeando
      const [prop, axis] = key.split('.');
      const vec = prop === 'pos' ? t.position : t.scale;
      input.value = vec[axis].toFixed(2);
    }
  }
}
