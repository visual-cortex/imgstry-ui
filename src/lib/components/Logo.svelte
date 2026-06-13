<script lang="ts">
  interface Props {
    size?: number;
    spin?: boolean;
  }

  const { size = 28, spin = false }: Props = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 32 32"
  fill="none"
  class="logo"
  class:spin
  aria-hidden="true"
>
  <defs>
    <linearGradient id="img-ring" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
      <stop offset="0%"  stop-color="var(--blue-300)" />
      <stop offset="50%" stop-color="var(--color-accent)" />
      <stop offset="100%" stop-color="var(--purple-500)" />
    </linearGradient>
    <linearGradient id="img-half" x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse">
      <stop offset="0%"  stop-color="var(--color-accent)" />
      <stop offset="100%" stop-color="var(--purple-500)" />
    </linearGradient>
    <radialGradient id="img-glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="var(--color-accent)" stop-opacity="0.55" />
      <stop offset="100%" stop-color="var(--color-accent)" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- soft outer glow -->
  <circle cx="16" cy="16" r="15" fill="url(#img-glow)" />

  <!-- lens ring -->
  <circle
    cx="16"
    cy="16"
    r="13"
    fill="none"
    stroke="url(#img-ring)"
    stroke-width="2.4"
    stroke-linecap="round"
  />

  <!-- bisecting tone slash, the "develop" half -->
  <path
    d="M16 3 A13 13 0 0 1 16 29 Z"
    fill="url(#img-half)"
    opacity="0.95"
  />

  <!-- iris / pupil -->
  <circle cx="16" cy="16" r="3.6" fill="var(--shade-940)" />
  <circle cx="16" cy="16" r="1.6" fill="var(--blue-100)" />
  <circle cx="14.6" cy="14.6" r="0.7" fill="#ffffff" opacity="0.85" />
</svg>

<style>
  .logo {
    display: inline-block;
    flex-shrink: 0;
    filter: drop-shadow(0 0 6px color-mix(in srgb, var(--color-accent) 22%, transparent));
    transition: transform var(--duration-base) var(--ease-out),
                filter var(--duration-base) var(--ease-out);
  }

  .logo:hover {
    transform: rotate(-8deg) scale(1.04);
    filter: drop-shadow(0 0 10px color-mix(in srgb, var(--color-accent) 45%, transparent));
  }

  .logo.spin {
    animation: spin 4s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
