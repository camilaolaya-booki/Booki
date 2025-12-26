
import { City } from './types';

export const CITIES: City[] = [
  {
    id: 'iquitos',
    name: 'Iquitos',
    description: 'El corazón de la selva amazónica.',
    coordinates: { x: 72, y: 15 },
    color: 'bg-green-500',
    legend: 'La Leyenda del Bufeo Colorado'
  },
  {
    id: 'cajamarca',
    name: 'Cajamarca',
    description: 'Tierra de historia y hermosos valles.',
    coordinates: { x: 34, y: 28 },
    color: 'bg-yellow-500',
    legend: 'El Rescate de Atahualpa'
  },
  {
    id: 'trujillo',
    name: 'Trujillo',
    description: 'La ciudad de la eterna primavera.',
    coordinates: { x: 23, y: 34 },
    color: 'bg-orange-400',
    legend: 'La Leyenda de la Huaca del Sol'
  },
  {
    id: 'lima',
    name: 'Lima',
    description: 'La capital junto al Océano Pacífico.',
    coordinates: { x: 33, y: 58 },
    color: 'bg-blue-500',
    legend: 'El Puente de los Suspiros'
  },
  {
    id: 'cusco',
    name: 'Cusco',
    description: 'El ombligo del mundo e Imperio Inca.',
    coordinates: { x: 65, y: 72 },
    color: 'bg-orange-600',
    legend: 'Leyenda de Pachacútec'
  },
  {
    id: 'arequipa',
    name: 'Arequipa',
    description: 'La ciudad blanca custodiada por volcanes.',
    coordinates: { x: 62, y: 85 },
    color: 'bg-red-500',
    legend: 'El Misti Protector'
  },
  {
    id: 'puno',
    name: 'Puno',
    description: 'Cuna del Titicaca y danzas mágicas.',
    coordinates: { x: 78, y: 82 },
    color: 'bg-indigo-500',
    legend: 'Manco Cápac y Mama Ocllo'
  }
];

export const EXERCISE_LABELS: Record<string, string> = {
  ELIGE_LA_PALABRA: 'Elige la palabra',
  HALLA_EL_PROPOSITO: 'Halla el propósito',
  RETO_SORPRESA: 'Reto sorpresa'
};

export const WORLD_NAMES: Record<string, string> = {
  CAMINO_LECTOR: 'Camino Lector',
  LEYENDOPOLIS: 'Leyendópolis',
  CUENTOPIA: 'Cuentopía'
};
