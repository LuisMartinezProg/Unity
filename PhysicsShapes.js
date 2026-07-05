import * as CANNON from 'cannon-es';

/**
 * Cannon-es define sus formas por "half-extents" (mitad del tamaño), pero
 * Three.js define sus geometrías por tamaño completo (BoxGeometry(2,2,2) es
 * un cubo de lado 2). Si mezclás las dos convenciones sin darte cuenta, la
 * caja física termina siendo el DOBLE o la MITAD del tamaño visual, y es un
 * bug feo de rastrear. Estos helpers reciben tamaño completo (igual que
 * Three.js) y hacen la conversión adentro, para que nunca tengas que pensar
 * en half-extents vos mismo.
 */
export const Shapes = {
  box(width, height, depth) {
    return new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
  },
  sphere(radius) {
    return new CANNON.Sphere(radius);
  },
  plane() {
    return new CANNON.Plane();
  },
};
