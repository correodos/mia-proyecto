const fs = require('fs');

const avisoLegal = `---
import BaseLayout from '../layouts/BaseLayout.astro';

const pageData = {
  title: 'Aviso Legal | Miaherramienta.com',
  description: 'Aviso legal de Miaherramienta.com: datos del titular, condiciones de uso, propiedad intelectual, responsabilidad, enlaces externos, proteccion de datos, cookies y legislacion aplicable.',
  canonical: 'https://miaherramienta.com/aviso-legal/'
};

const { title, description, canonical } = pageData;
---

<BaseLayout title={title} description={description} canonical={canonical}>
<main role="main">
  <article class="legal-page">
    <h1>Aviso Legal</h1>

    <section aria-labelledby="datos-identificativos">
      <h2 id="datos-identificativos">1. Datos identificativos</h2>
      <p>En cumplimiento de las obligaciones establecidas en la normativa aplicable a los servicios de la sociedad de la informacion, se informa de los siguientes datos:</p>
      <ul>
        <li><strong>Titular:</strong> Samuil Kralev</li>
        <li><strong>NIF/NIE:</strong> 18508339D</li>
        <li><strong>Domicilio:</strong> C Sequia Nova, 62, 46730, Grao de Gandia, Valencia, Espana</li>
        <li><strong>Correo electronico:</strong> <a href="mailto:correouno548@gmail.com">correouno548@gmail.com</a></li>
        <li><strong>Sitio web:</strong> <a href="https://miaherramienta.com/">https://miaherramienta.com/</a></li>
      </ul>
      <p>El titular de este sitio web es una persona fisica y no actua a traves de una sociedad mercantil.</p>
    </section>

    <section aria-labelledby="objeto">
      <h2 id="objeto">2. Objeto del sitio web</h2>
      <p>Miaherramienta.com es un sitio web que ofrece herramientas gratuitas relacionadas con el calculo de horas, horarios, turnos y tiempo de trabajo.
      <p>Las herramientas disponibles en el sitio tienen caracter meramente informativo y estan destinadas a facilitar determinados calculos relacionados con el tiempo.
      <p>Los resultados obtenidos mediante las calculadoras deben considerarse orientativos y corresponde al usuario comprobar que se ajustan a sus necesidades concretas.
    </section>

    <section aria-labelledby="condiciones-uso">
      <h2 id="condiciones-uso">3. Condiciones de uso</h2>
      <p>El acceso y uso de este sitio web atribuye la condicion de usuario e implica la aceptacion de las presentes condiciones.
      <p>El usuario se compromete a utilizar el sitio web de forma licita, respetando la legislacion aplicable y los derechos de terceros.
      <p>No esta permitido utilizar el sitio web para realizar actividades que puedan danar, sobrecargar, inutilizar o impedir el funcionamiento normal de la web o de sus servicios.
    </section>

    <section aria-labelledby="funcionamiento-calculadoras">
      <h2 id="funcionamiento-calculadoras">4. Funcionamiento de las calculadoras</h2>
      <p>Las calculadoras disponibles en Miaherramienta.com realizan operaciones matematicas a partir de los datos introducidos por el usuario.
      <p>El titular procura que las herramientas funcionen correctamente, pero no garantiza que los resultados sean adecuados para todos los usos, situaciones laborales, convenios colectivos, contratos o circunstancias particulares.
      <p>El resultado de una calculadora no constituye asesoramiento laboral, juridico, fiscal ni profesional.
    </section>

    <section aria-labelledby="propiedad-intelectual">
      <h2 id="propiedad-intelectual">5. Propiedad intelectual</h2>
      <p>Los contenidos originales de este sitio web, incluyendo textos, diseno, estructura, elementos graficos, codigo y otros materiales protegibles, estan sujetos a la normativa sobre propiedad intelectual e industrial.
      <p>Salvo que se indique expresamente lo contrario o exista una autorizacion legal, no se permite reproducir, distribuir, modificar o utilizar con fines comerciales los contenidos del sitio sin la correspondiente autorizacion.
      <p>El usuario puede utilizar los resultados obtenidos mediante las calculadoras para sus propios fines.
    </section>

    <section aria-labelledby="responsabilidad">
      <h2 id="responsabilidad">6. Responsabilidad</h2>
      <p>El titular no sera responsable de los danos o perjuicios que pudieran derivarse del uso de la informacion o de las herramientas disponibles en el sitio web cuando estos se deban a circunstancias ajenas a su control o a un uso incorrecto de las herramientas.
      <p>Tampoco se garantiza la disponibilidad permanente del sitio web, pudiendo producirse interrupciones derivadas de tareas de mantenimiento, actualizaciones, incidencias tecnicas o circunstancias ajenas al titular.
    </section>

    <section aria-labelledby="enlaces-externos">
      <h2 id="enlaces-externos">7. Enlaces externos</h2>
      <p>El sitio web puede contener enlaces hacia paginas web de terceros.
      <p>La existencia de estos enlaces no implica necesariamente una relacion, aprobacion o recomendacion de los contenidos o servicios ofrecidos por dichos terceros.
      <p>El titular no controla de forma permanente los contenidos de las paginas externas y no asume responsabilidad por ellos.
    </section>

    <section aria-labelledby="proteccion-datos">
      <h2 id="proteccion-datos">8. Proteccion de datos</h2>
      <p>El tratamiento de los datos personales que pueda realizarse a traves de este sitio web se regula mediante la correspondiente <strong>Politica de Privacidad</strong>.
      <p>Puedes consultar la informacion relativa al tratamiento de datos personales en:
      <p><a href="/politica-privacidad/">https://miaherramienta.com/politica-privacidad/</a></p>
    </section>

    <section aria-labelledby="cookies">
      <h2 id="cookies">9. Cookies</h2>
      <p>Este sitio web utiliza determinadas cookies y tecnologias similares, incluyendo herramientas de medicion y analisis cuando el usuario presta su consentimiento.
      <p>La informacion correspondiente se encuentra disponible en la <strong>Politica de Cookies</strong>.
      <p><a href="/politica-cookies/">https://miaherramienta.com/politica-cookies/</a></p>
    </section>

    <section aria-labelledby="modificaciones">
      <h2 id="modificaciones">10. Modificaciones</h2>
      <p>El titular podra modificar en cualquier momento los contenidos, servicios, condiciones o informacion incluida en este Aviso Legal cuando resulte necesario para adaptarlos a cambios en el funcionamiento del sitio web, en la normativa aplicable o en los servicios ofrecidos.
    </section>

    <section aria-labelledby="legislacion">
      <h2 id="legislacion">11. Legislacion aplicable</h2>
      <p>La relacion entre el titular del sitio web y el usuario se regira por la legislacion espanola que resulte aplicable.
      <p>Para cualquier cuestion relacionada con este sitio web seran competentes los juzgados y tribunales que correspondan de acuerdo con la normativa aplicable.
    </section>
  </article>
</main>
</BaseLayout>`;

const fs = require('fs');
fs.writeFileSync('C:\\Users\\sambo\\Desktop\\Prueba\\Visual Studio Code\\mia-proyecto\\src\\pages\\aviso-legal.astro', avisoLegal, 'utf8');
console.log('aviso-legal done');