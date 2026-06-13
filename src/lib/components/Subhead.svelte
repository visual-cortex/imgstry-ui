<script lang="ts">
  interface Props {
    label: string;
  }

  const { label }: Props = $props();
</script>

<div class="subhead eyebrow-muted">{label}</div>

<style>
  .subhead {
    margin: var(--space-md) 0 var(--space-xxs);
  }
</style>
