import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={35} height={35} {...props} fill="#009bff">
    <Path d="M19.071 2.936A10 10 0 1 0 4.937 17.085L12 23.994l7.071-6.917a10 10 0 0 0 0-14.141ZM17 14H7V9.409a2.513 2.513 0 0 1 .983-1.986l2.5-1.91a2.507 2.507 0 0 1 3.035 0l2.5 1.91A2.515 2.515 0 0 1 17 9.409Zm-2.2-4.987a.5.5 0 0 1 .2.4V12h-2v-2h-2v2H9V9.409a.5.5 0 0 1 .2-.4L11.7 7.1a.5.5 0 0 1 .608 0Z" />
  </Svg>
);

export default SvgComponent;
