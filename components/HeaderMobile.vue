<template>
  <div>
    <v-app-bar fixed app color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="drawerMobile = !drawerMobile" />

      <v-toolbar-title class="font-weight-black" v-text="title" />
    </v-app-bar>
    <v-navigation-drawer v-model="drawerMobile" fixed bottom temporary>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              Navigation
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              Categories
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/apps" router exact>
          <v-list-item-action>
            <v-icon>mdi-star</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>All</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/category/games" router exact>
          <v-list-item-action>
            <v-icon>mdi-gamepad-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Games</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/category/tools" router exact>
          <v-list-item-action>
            <v-icon>mdi-tools</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Tools</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/category/misc" router exact>
          <v-list-item-action>
            <v-icon>mdi-cube-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Misc</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data: () => ({
    items: [
      {
        icon: 'mdi-home',
        title: 'Home',
        to: '/',
      },
      {
        icon: 'mdi-apps',
        title: 'Submit',
        to: '/submit',
      },
    ],
    title: 'TinyDB',
    drawerMobile: false,
  }),
}
</script>

<style></style>
