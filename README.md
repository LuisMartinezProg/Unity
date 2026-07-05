Motor 3D — sistemas base
Motor ligero para juegos 3D en el navegador: ECS + física + input + cámara +
inspector de debug, corriendo con módulos ES nativos vía CDN. Sin build step,
sin node_modules, sin terminal — subís los archivos a GitHub y Pages lo sirve
tal cual.
Qué hay ya andando (la demo)
Al abrir index.html ya ves algo funcionando, no una pantalla vacía:
Un piso.
Un cubo naranja que cae solo por gravedad (prueba que la física pura funciona).
Una esfera celeste que movés con WASD / flechas / el joystick táctil
(esquina inferior izquierda) — prueba que input → física → render funciona.
Un botón 🔧 arriba a la derecha: abre un inspector donde tocás una
entidad de la lista y le editás posición/escala en vivo.
Estructura de carpetas
Código
18 archivos en total (17 .js + index.html).
Decisiones de diseño (para que no te sorprendan después)
ECS simple, no "puro": cada Entity es un objeto con un Map de
componentes, no un ID suelto en arrays paralelos. Se lee mucho más fácil
desde el editor web de GitHub que un ECS data-oriented "de verdad", y a
esta escala no perdés nada de performance por eso.
El orden de los systems en main.js importa:
input → playerControl → physics → camera → render → inspector.
Si lo cambiás vas a sentir el input con un frame de atraso, o la cámara
"temblando". Está comentado ahí mismo, pero es la parte más fácil de romper
sin darte cuenta si después reorganizás el bootstrap.
RigidBody cubre también los objetos estáticos: no hay un componente
Collider aparte. mass: 0 = estático (el piso), mismo componente.
Transform usa quaternion, no Euler: porque Cannon trabaja en
quaternions por dentro, y convertir de un lado a otro cada frame es trabajo
de más y fuente de bugs raros tipo gimbal lock. Para rotar algo a mano en
grados, usá transform.setRotationFromEuler(x, y, z).
Versiones fijas en el importmap (three@0.185.1, cannon-es@0.20.0),
no @latest: así el proyecto no se rompe solo un día porque una librería
sacó una versión nueva incompatible.
fixedRotation: true en el jugador: sin esto, la esfera empieza a
"rodar" de forma rara por el torque que genera el roce contra el piso al
moverse. Con fixedRotation se desliza como un personaje, no como una pelota.
Antes de entregarte esto corrí los sistemas de física y de ECS contra las
librerías reales (no solo revisión de sintaxis): confirmé que el cubo cae y
efectivamente reposa a la altura esperada sobre el piso, que el piso estático
nunca se mueve, y que el input del jugador se traduce en el desplazamiento
exacto esperado. La parte de render/DOM (three.js dibujando, el joystick
táctil) no se puede probar sin navegador, así que esa la vas a validar vos al
abrir la página — pero usa las mismas APIs estables que ya usaste en tus
otros proyectos.
Cómo subir esto a GitHub desde el celular
GitHub Pages sirve cualquier archivo estático del repo, carpetas anidadas
incluidas. El truco para crear esas carpetas sin terminal:
Entrá a tu repo (o creá uno nuevo) en github.com desde Chrome.
Tocá Add file → Create new file.
En el campo de nombre escribí la ruta completa, ej: src/core/Entity.js.
Apenas escribís la /, GitHub arma la carpeta sola — no hace falta
crearla aparte.
Pegá el contenido de ese archivo en el área de texto grande de abajo.
Bajá del todo y tocá Commit changes (directo a main está bien).
Repetí para cada uno de los 18 archivos.
Orden sugerido (para que si revisás el repo a mitad de camino tenga
sentido lo que ya subiste): index.html → todo src/core → todo
src/components → src/physics → todo src/systems → src/debug →
src/scenes → por último src/main.js.
Para index.html no hace falta ruta, va directo en la raíz del repo.
Activar GitHub Pages
Settings → Pages → Source: "Deploy from a branch" → rama main, carpeta
/ (root) → Save. Este paso ya te resulta conocido de tus otros proyectos.
Qué falta a propósito (próximos pasos lógicos)
Salto: no está todavía. Se agrega fácil en PlayerControlSystem: si
isKeyDown('Space') y el jugador está tocando el piso, body.velocity.y = fuerzaDeSalto.
Detectar "está tocando el piso": Cannon expone eventos de colisión
(body.addEventListener('collide', ...)). No lo agregué en este primer
entregable para no sumar más superficie, pero es el paso siguiente lógico
antes de saltar o animar aterrizajes.
Modelos .glb, animaciones esqueléticas, sonido: nada de eso está acá
todavía. Este entregable es la base de sistemas, no un juego terminado.
Rapier en vez de Cannon-es: si más adelante la física se queda corta
(muchos objetos, necesitás más performance), Rapier (WASM) es la alternativa
más activa hoy. Se eligió Cannon-es acá porque es JS puro — sin instanciar
WASM — que es más simple para este primer entregable.
