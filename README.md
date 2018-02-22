# Net-Promoter-Score

Net-Promoter-Score es un sistema que permite obtener información en tiempo real referente a la satisfacción de cliente basado en pequeñas encuestas personalizadas y contextualizadas de acuerdo a la necesidad del usuario. Con una interfáz bastante amigable y parcialmente personalizable, las encuestas contienen un conjunto de cuatro opciones enmarcadas en emojis de diferentes colores que representan diferentes niveles de satisfacción con respecto a un producto o servicio. El sistema está escrito en JavaScript y utiliza el marco de trabajo Vuejs en su versión 2.

Un ejemplo en vivo en: https://nps.diwait.com/assessment/lXhLT6yG2G1WJQ16mw0X

<p align="center">
  <img src="https://nps.diwait.com/static/faces/very-good.png"/>
  <img src="https://nps.diwait.com/static/faces/good.png"/>
  <img src="https://nps.diwait.com/static/faces/bad.png"/>
  <img src="https://nps.diwait.com/static/faces/very-bad.png"/>
</p>

[![made-for-VSCode](https://img.shields.io/badge/Made%20for-VSCode-1f425f.svg)](https://code.visualstudio.com/)
[![node](https://img.shields.io/badge/node-6.11-brightgreen.svg)](https://nodejs.org/es/)
[![npm](https://img.shields.io/badge/npm-3.10-blue.svg)](https://www.npmjs.com/)
[![vuejs](https://img.shields.io/badge/vuejs-2.5-green.svg)](https://vuejs.org/)
[![firebase](https://img.shields.io/badge/Powered%20by-firebase-yellow.svg)](https://firebase.google.com/?hl=es-419)
[![pug](https://img.shields.io/badge/pug-2.0-red.svg)](https://pugjs.org/)

## Modelo de Encuestas Personalizadas

Las encuestas son un método de investigación y recopilación de datos utilizadas para obtener información de personas sobre diversos temas. Las encuestas tienen una variedad de propósitos y se pueden llevar a cabo de muchas maneras dependiendo de la metodología elegida y los objetivos que se deseen alcanzar.

En el caso de Net-Promoter-Score las encuestas siguen un flujo personalizado pero que siempre comienza con una pregunta principal con cuatro opciones genéricas; luego, a partir de la opción elegida, la segunda parte del flujo lleva al usuario a la siguiente pantalla donde se visualiza una pregunta que, básicamente, se trata de una justificación personalizada basada en la valoración anterior; en este punto las opciones contienen texto que busca entender a mayor profundidad la opinión de la persona.

El tercer paso del flujo lleva a una pantalla de contacto donde el usuario puede (o no) dejar sus datos para ser contactado por la empresa. La importancia de este paso es crucial para la toma de decisiones posterior a partir de los datos. Si el usuario opta por dejar sus datos también puede agregar un comentario que posteriormente es guardado en el sistema como un **ticket**.
