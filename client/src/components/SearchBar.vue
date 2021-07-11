<template>
  <div class="searchbar" @click="$refs.searchInput.focus()">
    <Icon name="search" color="#657786" :size="18" />
    <input
      ref="searchInput"
      type="text"
      placeholder="Recherche Twitter"
      v-model.trim="query"
      @focus="setPopup(true)"
      @blur="setPopup(false)"
      @keyup.enter="
        $router.push({ path: '/search', query: { filter: query } }),
          $refs.searchInput.blur()
      "
    />
  </div>
  <PopupBase v-if="extended" class="searchResults max">
    <template v-slot:users>
      <div
        class="result userResume border"
        v-for="user in results"
        :key="user.tag"
        @click="$router.push(`/${user.tag}`), (query = '')"
      >
        <div
          class="profile"
          style="--src: url('')"
        />

        <div class="user">
          <span>{{ user.name }}</span>
          <span>@{{ user.tag }}</span>
        </div>
      </div>
      <div class="separator border" v-if="results.length > 0"></div>
    </template>

    <div
      class="result"
      v-if="query"
      @click="$router.push({ path: '/search', query: { filter: query } })"
    >
      Aller à @{{ query }}
    </div>
  </PopupBase>
</template>

<script>
import Icon from "@/components/Icon.vue";
import PopupBase from "@/components/PopupBase.vue";

export default {
  name: "SearchBar",
  components: {
    Icon,
    PopupBase
  },
  props: {
    initial: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      query: this.initial,
      extended: false,
      results: []
    };
  },
  watch: {
    query(value) {
      setTimeout(() => {
        if (!this.extended) return;
        // reset results if field value is empty
        if (this.query === "") {
          this.results = [];
          return;
        }
        // Cancel request if field value is different
        if (this.query === value) {
          this.$API.search.users(this.query).then(res => {
            if (!res.isError) {
              this.results = res.data;
            }
          });
        }
      }, 500);
    }
  },
  methods: {
    setPopup(value) {
      setTimeout(() => (this.extended = value), 100);
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/_variables.scss";

.searchbar {
  position: relative;

  display: flex;
  gap: 0.5rem;

  width: 100%;
  padding: 0.75rem 1rem;

  border-radius: 5rem;
  border: solid 2px $dark-gray;
  background: $dark-gray;

  font-size: 1.5rem;

  input {
    width: 100%;
  }

  input::placeholder {
    color: $gray;
  }

  &:focus-within {
    border-color: $blue;
    background: $dark;

    svg {
      fill: $blue;
    }
  }
}

.userResume, .result {
  cursor: pointer;

  display: flex;
  gap: 1rem;

  width: 100%;
  padding: 0.5rem;

  &:hover {
    background: rgba($extra-light-gray, 0.03);
  }
}

.result {
  padding: 0.75rem 1rem;
}

.searchResults {
  font-size: 1rem;
  font-weight: 400;

  &:empty {
    text-align: center;
    padding: 1rem;

    &::before {
      content: "Essayez de chercher des personnes, des sujets ou des mots-clés";
      color: $gray;
    }
  }
}
</style>