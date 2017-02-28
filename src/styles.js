import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  body {
    font-family: Roboto, sans-serif;
  }
`;

const usuTheme = {
  aggieBlue: '#012639',
  blue: '#2472B5',
  lightBlue: '#ECEFF4',
  grey: '#95989A',
  black: '#353535'
}

// const theme = {
//   colors: usuTheme,
//   transition: '300ms ease-in-out'
// };

export default usuTheme;
