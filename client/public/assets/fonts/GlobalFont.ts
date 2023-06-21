import { createGlobalStyle } from 'styled-components';

import font_dunggeunmo from '/assets/fonts/DungGeunMo.woff';

export default createGlobalStyle`
    @font-face {
        font-family: "Font_DungGeun";
        src: local("Font_DungGeun"), url(${font_dunggeunmo}) format('woff'); 
    }
`;