import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
  },
  theme: {
    defaultTheme: "light",
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        colors: {
          background: "#f9f9f9",
          // surface: "#f9f9f9"
        },
      },
    },
  },
});

export default vuetify;
