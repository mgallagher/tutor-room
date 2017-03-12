import React from 'react';
import styled from 'styled-components';

const SVG = styled.svg`
  fill: #fff;
  height: 35px;
  width: 35px;
`;

const hello = {
  yes: 3
};

const AggieIcon = () => (
  <SVG viewBox="23 53 34.728 32.982" xmlns="http://www.w3.org/2000/svg">
    <path
      id="Union_1"
      data-name="Union 1"
      d="M1712.453-9.018v-5.317h4.653l-1.827-5.905h-8.594l-1.714,5.905h3.229v5.317H1693v-5.317h4.266l6.485-22.347h-3.512V-42h21.294v5.318h-3.767l6.915,22.347h3.047v5.317Zm1.368-15.934-2.977-9.621-2.792,9.621Z"
      transform="translate(-1670 95)"
    />
  </SVG>
);

export default AggieIcon;
