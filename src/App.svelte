<script>
  import Stage from "./components/Stage.svelte";
  import FilterPane from "./components/FilterPane.svelte";
  import "./App.scss";

  // private
  let imgstry;
</script>

<main class="imgstry-editor">
  <div class="imgstry-stage">
    <Stage
      src={'https://i.imgur.com/Ht8sj8f.jpg'}
      on:mount={ev => (imgstry = ev.detail.imgstry)} />
  </div>
  <div class="imgstry-filter-pane">
    {#if imgstry != null}
      <FilterPane {imgstry} />
    {:else}
      <p>Loading...</p>
    {/if}
  </div>
</main>
