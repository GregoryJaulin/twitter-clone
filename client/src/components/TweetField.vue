<template>
  <div class="compose" :class="{ minified: isMinified }">
    <div class="to" v-if="to" v-show="!isMinified">
      En réponse à <span>@{{ to.author }}</span>
    </div>
    <div
      class="profile"
      style="--src: url('')"
    />
    <div
      contenteditable
      :placeholder="placeholder"
      autocomplete="off"
      v-text="value"
      @input="setValue"
      @click.once="isMinified = false"
    />
    <div class="params" v-show="!isMinified">
      <Icon
        name="image"
        color="#1DA1F2"
        :size="40"
        class="hover-blue"
        disabled
      />
      <Icon name="gif" color="#1DA1F2" :size="40" class="hover-blue" disabled />
      <Icon
        name="poll"
        color="#1DA1F2"
        :size="40"
        class="hover-blue"
        disabled
      />
      <Icon
        name="emote"
        color="#1DA1F2"
        :size="40"
        class="hover-blue"
        disabled
      />
      <Icon
        name="schedule"
        color="#1DA1F2"
        :size="40"
        class="hover-blue"
        disabled
      />
    </div>
    <button
      class="btn btn-style-1"
      :disabled="!value || value === ''"
      @click="publish(`ID${Date.now()}`)"
    >
      Tweet
    </button>
  </div>
</template>

<script>
import Icon from "@/components/Icon.vue";

export default {
  name: "TweetField",
  components: {
    Icon
  },
  props: {
    to: {
      _id: String,
      author: String
    },
    placeholder: {
      type: String,
      default: "Quoi de neuf ?"
    },
    minified: Boolean
  },
  data() {
    return {
      value: "",
      isMinified: this.minified
    };
  },
  methods: {
    setValue({ target }) {
      this.value = target.innerText;
    },
    publish(ID) {
      const post = {
        valid: false,
        _id: ID,
        author: this.$store.getters.fullUser,
        createdAt: Date.now(),
        content: this.value,
        target: this.to ? this.to._id : undefined
      };
      this.$store.commit("createPost", post);
      this.$emit("new", post);

      (!this.to
        ? this.$API.posts.create(this.value)
        : this.$API.posts.reply(this.to._id, this.value)
      ).then(res => {
        if (res && res.status === 201) {
          res = res.data;
          res.author = this.$store.getters.fullUser;
          res.status = "ready";

          this.$store.commit("updatePost", {
            id: ID,
            data: res
          });
          this.$emit("validation", { id: ID, post: res });
        } else {
          this.$store.commit("errorPost", ID);
          this.$store.commit("queueError", {
            type: "Erreur serveur",
            message:
              "Impossible de poster ce tweet, veuillez réessayer ultérieurement"
          });
        }
      });

      this.value = "";
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/_variables.scss";

.compose.minified {
  grid-template-areas: "profile input button";
}

.compose {
  display: grid;
  grid-template-columns: auto 1fr 1fr;
  grid-template-areas:
    "none to to"
    "profile input input"
    "profile icons button";
  column-gap: 0.5rem;
  row-gap: 0.5rem;

  padding: 0.5rem 1rem;

  .to {
    grid-area: to;

    color: $gray;

    span {
      color: $blue;
    }
  }

  .profile {
    grid-area: profile;
    place-self: start center;
  }

  div[contentEditable] {
    grid-area: input;
    place-self: center start;

    position: relative;

    min-height: 3rem;
    height: 100%;
    width: 100%;
    padding-top: 0.75rem;
    padding-left: 0.75rem;

    font-size: 1.25rem;
    color: $extra-light-gray;

    .overflow {
      background: $red;
    }
  }

  .params {
    grid-area: icons;
    place-self: center start;

    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  button {
    cursor: pointer;

    grid-area: button;
    place-self: center end;
  }
}
</style>