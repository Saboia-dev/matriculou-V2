import type { Institution, Offer } from './content';

// Fictional institutions used only when the project has no configured backend.
export const demoInstitutions: Institution[] = [
  { id: 'demo-1', name: 'Universidade Horizonte', city: 'São Paulo', state: 'SP', network: 'privada', type: 'universidade', mec: 4, price: 790, scholarships: true, rating: 4.8, reviews: 0, image: '/images/cinema/library.jpg', vacancy: 'verde' },
  { id: 'demo-2', name: 'Instituto Novos Caminhos', city: 'Belo Horizonte', state: 'MG', network: 'publica', type: 'instituto', mec: 5, price: 0, scholarships: false, rating: 4.9, reviews: 0, image: '/images/cinema/students.jpg', vacancy: 'verde' },
  { id: 'demo-3', name: 'Faculdade Aurora', city: 'Curitiba', state: 'PR', network: 'privada', type: 'faculdade', mec: 4, price: 620, scholarships: true, rating: 4.7, reviews: 0, image: '/images/cinema/classroom.jpg', vacancy: 'verde' },
  { id: 'demo-4', name: 'Universidade do Amanhã', city: 'Rio de Janeiro', state: 'RJ', network: 'publica', type: 'universidade', mec: 5, price: 0, scholarships: false, rating: 4.8, reviews: 0, image: '/images/cinema/campus.jpg', vacancy: 'verde' },
  { id: 'demo-5', name: 'Centro Universitário Conecta', city: 'São Paulo', state: 'SP', network: 'privada', type: 'centro universitário', mec: 4, price: 980, scholarships: true, rating: 4.6, reviews: 0, image: '/images/cinema/future.jpg', vacancy: 'verde' },
  { id: 'demo-6', name: 'Instituto Perspectiva', city: 'Recife', state: 'PE', network: 'privada', type: 'instituto', mec: 4, price: 540, scholarships: true, rating: 4.7, reviews: 0, image: '/images/cinema/library.jpg', vacancy: 'verde' },
];

export const demoOffers: Offer[] = demoInstitutions.flatMap((institution, index) =>
  ['Administração', 'Análise e Desenvolvimento de Sistemas', 'Direito'].map((name, course) => ({
    id: `demo-offer-${index}-${course}`, institution_id: institution.id, course_name: name,
    level: 'Graduação', modality: course === 1 ? 'ead' : 'presencial', shift: 'Noite', period: 'Noturno',
  })),
);
