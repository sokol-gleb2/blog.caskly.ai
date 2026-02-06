<template>
  <div class="app-shell">
    <router-view />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600&display=swap');

@font-face {
  font-family: 'Clash Display';
  src: url('./fonts/TTF/ClashDisplay-Variable.ttf') format('truetype');
  font-weight: 200 700;
  font-style: normal;
  font-display: swap;
}

:root {
  --bg: #ffffff;
  --paper: #f7f7f7;
  --ink: #000000;
  --accent: #0038ff;
  --line: #000000;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Rubik', system-ui, -apple-system, sans-serif;
  color: var(--ink);
  background: var(--bg);
}

a {
  color: inherit;
  text-decoration: none;
}

.app-shell {
  min-height: 100vh;
}
</style>
