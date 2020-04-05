<script>
  import Drawer, {
    AppContent,
    Content,
    Header,
    Title,
    Subtitle,
    Scrim
  } from "@smui/drawer";
  import List, { Item, Text, Separator, Subheader } from "@smui/list";
  import H6 from "@smui/common/H6.svelte";

  // inputs
  export let imgstry;
</script>

<Drawer>
  <Content>
    <List>
      <Item>
        <Text>Gray Kittens</Text>
      </Item>
      <Item>
        <Text>A Space Rocket</Text>
      </Item>
      <Item>
        <Text>100 Pounds of Gravel</Text>
      </Item>
      <Item>
        <Text>All of the Shrimp</Text>
      </Item>
      <Item>
        <Text>A Planet with a Mall</Text>
      </Item>
    </List>
  </Content>
</Drawer>
