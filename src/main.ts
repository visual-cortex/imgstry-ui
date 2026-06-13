import { mount } from 'svelte';
import App from './App.svelte';
import './app.css';
import './lib/editor/theme.svelte';
import './lib/editor/pwa.svelte';

const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app;
