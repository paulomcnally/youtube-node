import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Soporte Nativo de Promesas',
    Svg: require('@site/static/img/logo.svg').default,
    description: (
      <>
        Usa async/await o .then()/.catch() de forma nativa. 
        Ya no necesitas wrappers o conversiones complicadas.
      </>
    ),
  },
  {
    title: 'TypeScript Completo',
    Svg: require('@site/static/img/logo.svg').default,
    description: (
      <>
        Tipado completo incluido. Autocompletado inteligente y 
        detección de errores en tiempo de compilación.
      </>
    ),
  },
  {
    title: 'Recursos Modulares',
    Svg: require('@site/static/img/logo.svg').default,
    description: (
      <>
        API organizada por recursos: videos, canales, playlists, 
        comentarios, suscripciones y más.
      </>
    ),
  },
  {
    title: 'Manejo de Errores Avanzado',
    Svg: require('@site/static/img/logo.svg').default,
    description: (
      <>
        Clases de error específicas para cada situación: 
        QuotaExceededError, RateLimitError, y más.
      </>
    ),
  },
  {
    title: 'Paginación Integrada',
    Svg: require('@site/static/img/logo.svg').default,
    description: (
      <>
        Soporte completo para paginación con async generators, 
        obtén todos los resultados fácilmente.
      </>
    ),
  },
  {
    title: 'CLI Incluida',
    Svg: require('@site/static/img/logo.svg').default,
    description: (
      <>
        Interfaz de línea de comandos incluida para búsquedas 
        rápidas sin escribir código.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
