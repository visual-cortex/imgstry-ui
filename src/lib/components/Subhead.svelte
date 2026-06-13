<script lang="ts">
  interface Props {
    label: string;
  }

  const { label }: Props = $props();
</script>

<div class="subhead">{label}</div>

<style>
  .subhead {
    font-size: 10px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1.3px;
    margin: 8px 0 -2px;
  }
</style>
