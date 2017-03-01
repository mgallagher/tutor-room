import { injectGlobal } from 'styled-components';

const usuTheme = {
  aggieBlue: '#012639',
  blue: '#2472B5',
  lightBlue: '#ECEFF4',
  grey: '#95989A',
  black: '#353535'
};

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html, body {
    margin:0;
    padding:0;
  }
  body {
    font-family: Roboto, sans-serif;
    background-color: ${usuTheme.lightBlue};
  }
`;

export default usuTheme;
