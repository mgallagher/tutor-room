import { injectGlobal } from 'styled-components';

/* eslint no-unused-vars: 0 */
const usuColors = {
  aggieBlue: '#012639',
  blue: '#2472B5',
  lightBlue: '#ECEFF4',
  grey: '#95989A',
  black: '#353535'
};

// Attempting to follow Material UI color guidelines
const colors = {
  // Main Colors
  primary: usuColors.aggieBlue,
  primaryLight: '#CFD8DC',
  primaryDark: '#455A64',
  accent: '#03A9F4',
  // Text
  textPrimary: '#212121',
  textSecondary: '#757575',
  textOnDarkPrimary: '#FFFFFF',
  divider: '#BDBDBD',
  // Background
  gray300: '#EOEOEO',
  gray100: '#F5F5F5',
  gray50: '#FAFAFA',
}

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html, body {
    margin:0;
    padding:0;
  }
  body {
    background-color: ${colors.gray100};
  }
`;

export default colors;
