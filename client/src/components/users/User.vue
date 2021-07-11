<template>
  <div class="userdata">
    <div class="banner"></div>

    <div class="infos">
      <div class="top">
        <div
          class="profile wide"
          style="--src: url('')"
        />

        <button
          v-show="
            $store.getters.isConnected && _id !== $store.getters.fullUser._id
          "
          class="btn btn-follow"
          :class="{ active: follow.active }"
          @click="toggleFollow"
        ></button>
      </div>

      <div class="user wide">
        <span>{{ name }}</span>
        <span>@{{ tag }}</span>
      </div>

      <div class="join">
        A rejoint Twitter en
        {{
          new Date(createdAt).toLocaleDateString("fr-FR", {
            month: "long",
            year: "numeric"
          })
        }}
      </div>

      <div class="follows combo">
        <div @click="$router.push(`/${tag}/follows`)">
          {{ followsCount }}
          <span>abonnement{{ followsCount > 1 ? s : "" }}</span>
        </div>
        <div @click="$router.push(`/${tag}/followers`)">
          {{ followersCount }}
          <span>abonné{{ followersCount > 1 ? s : "" }}</span>
        </div>
      </div>
    </div>

    <div class="tabs border" style="--row-count: 3">
      <div
        :class="{ active: $route.meta.selected === 1 }"
        @click="$router.replace(`/${tag}`)"
      >
        <span>Tweets</span>
      </div>
      <div
        :class="{ active: $route.meta.selected === 2 }"
        @click="$router.replace(`/${tag}/replies`)"
      >
        <span>Tweets et réponses</span>
      </div>
      <div
        :class="{ active: $route.meta.selected === 3 }"
        @click="$router.replace(`/${tag}/likes`)"
      >
        <span>J'aime</span>
      </div>
    </div>

    <Suspense>
      <template #default>
        <router-view name="data" />
      </template>
      <template #fallback>
        <div class="loading-icon"></div>
      </template>
    </Suspense>
  </div>
</template>

<script>
export default {
  name: "User",
  components: {},
  props: {
    _id: String,
    tag: String,
    name: String,
    createdAt: String,
    followsCount: Number,
    followersCount: Number,
    tweets: {
      type: Array,
      default: () => []
    },
    replies: {
      type: Array,
      default: () => []
    },
    likes: {
      type: Array,
      default: () => []
    },
    isFollowed: Boolean
  },
  created() {
    document.title = `${this.name} (@${this.tag}) / Twitter`;
  },
  data() {
    return {
      follow: {
        active: this.isFollowed,
        canChange: true
      }
    };
  },
  methods: {
    toggleFollow() {
      if (
        !this.follow.canChange ||
        !(
          this.$store.getters.isConnected &&
          this._id !== this.$store.getters.fullUser._id
        )
      )
        return;
      this.follow.canChange = false;

      (!this.follow.active
        ? this.$API.users.follow(this._id)
        : this.$API.users.unfollow(this._id)
      )
        .then(res => !res.isError && (this.follow.active = !this.follow.active))
        .then(
          () =>
            (this.follow.canChange = true) &&
            this.$store.commit("setFollow", this._id)
        );
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/_variables.scss";

.userdata {
  .join {
    color: $gray;
  }

  .top {
    display: flex;
    justify-content: space-between;

    > :nth-child(2) {
      align-self: flex-end;
      margin-bottom: 0.5rem;
    }
  }
  .follows > :hover {
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>