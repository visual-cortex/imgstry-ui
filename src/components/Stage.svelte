<script>
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import { Imgstry } from "imgstry";

  const dispatcher = createEventDispatcher();

  onMount(async () => {
    console.log(src);
    imgstry = new Imgstry(canvas);
    dispatcher("mount", { imgstry });
  });

  onDestroy(() => {
    imgstry.dispose();
  });

  const drawImage = async src => {
    if (!src) {
      return;
    }

    const image = await Imgstry.loadImage(src);
    dispatcher("load", { src, image });
    imgstry.drawImage(image);
  };

  // inputs
  export let src;
  $: {
    drawImage(src);
  }

  // private
  let canvas;
  let imgstry;
</script>

<canvas bind:this={canvas} />
