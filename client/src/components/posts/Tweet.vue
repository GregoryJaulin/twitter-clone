<template>
  <div
    class="tweet"
    :class="{
      error: status === 'error',
      waiting: status === 'waiting'
    }"
  >
    <slot name="parent" />
    <div
      class="main"
      @click="$router.push(`/${author.tag}/status/${_id}`)"
    >
      <div
        class="profile"
        style="--src: url('')"
        @click.stop="$router.push(`/${author.tag}`)"
      />

      <div class="user row">
        <div class="name">{{ author.name }}</div>
        <div class="tag">@{{ author.tag }}</div>
        <span>·</span>
        <div
          class="date"
          :aria-label="
            new Date(createdAt).toLocaleDateString('fr-FR', {
              hour: 'numeric',
              minute: '2-digit',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })
          "
        >
          {{ formatedDate }}
        </div>
      </div>

      <div class="content">
        {{ content }}
        <slot name="quote" />
      </div>

      <div class="interactions">
        <Icon
          name="comment"
          color="#657786"
          :size="32"
          :outerTxt="repliesCount !== 0 ? repliesCount.toString() : null"
          class="hover-blue"
          @click.stop="
            $router.push({
              name: $route.meta.tweet,
              params: {
                _id, author: author.name
              }
            })
          "
        />
        <Icon
          name="retweet"
          color="#657786"
          :size="32"
          :outerTxt="
            retweetsCount !== 0 ? retweetsCount.toString() : null
          "
          class="hover-green"
          :class="{ 'active-green': retweet.active }"
          @click.stop="toggleRetweet"
        />
        <Icon
          name="like"
          color="#657786"
          :size="32"
          :outerTxt="likesCount !== 0 ? likesCount.toString() : null"
          class="hover-red"
          :class="{ 'active-red': like.active }"
          @click.stop="toggleLike"
        />
        <Icon
          name="share"
          color="#657786"
          :size="32"
          class="hover-blue"
          disabled
        />
      </div>
    </div>
  </div>
</template>

<script>
import Icon from "@/components/Icon.vue";

export default {
  name: "Tweet",
  components: {
    Icon
  },
  props: {
    status: String,
    _id: String,
    type: String,
    author: {
      _id: String,
      tag: String,
      name: String
    },
    content: String,
    target: String,
    createdAt: Number,
    repliesCount: {
      type: Number,
      default: 0
    },
    likesCount: {
      type: Number,
      default: 0
    },
    retweetsCount: {
      type: Number,
      default: 0
    },
    isLiked: Boolean,
    isRetweeted: Boolean
  },
  data() {
    return {
      formatedDate: new Date(this.createdAt).formatTwitter(),
      like: {
        active: this.isLiked,
        canChange: true
      },
      retweet: {
        active: this.isRetweeted,
        canChange: true
      }
    };
  },
  methods: {
    toggleLike() {
      if (!this.like.canChange) return;
      this.like.canChange = false;

      (!this.like.active
        ? this.$API.posts.like(this._id)
        : this.$API.posts.deleteLike(this._id)
      )
        .then(res => !res.isError && (this.like.active = !this.like.active))
        .then(
          () =>
            (this.like.canChange = true) &&
            this.$store.commit("setLike", this._id)
        );
    },
    toggleRetweet() {
      if (!this.retweet.canChange) return;
      this.retweet.canChange = false;

      (!this.retweet.active
        ? this.$API.posts.retweet(this._id)
        : this.$API.posts.deleteRetweet(this._id)
      )
        .then(
          res => !res.isError && (this.retweet.active = !this.retweet.active)
        )
        .then(
          () =>
            (this.retweet.canChange = true) &&
            this.$store.commit("setRetweet", this._id)
        );
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/_variables.scss";

.tweet.waiting {
  pointer-events: none;
  opacity: 0.5;
}

.tweet.error {
  opacity: 0.5;

  * {
    color: $red !important;
  }
}

.tweet .main {
  position: relative;
  cursor: pointer;

  display: grid;
  grid-template-areas:
    "profile author"
    "profile content"
    "profile interactions";
  grid-template-columns: auto 1fr;
  column-gap: 0.5rem;
  row-gap: 0.5rem;

  padding: 0.75rem;
  padding-bottom: 0.25rem;

  &:hover {
    background: rgba($extra-light-gray, 0.03);
  }
}

.tweet.parent {
  position: relative;

  &.minified::before {
    top: 4.2rem;
    left: 2.5rem;

    height: 57.5%;
  }

  &:before {
    content: "";
    position: absolute;
    top: 4.25rem;
    left: 2.25rem;

    height: 42.5%;
    width: 0.1rem;

    background: rgba($gray, .5);
  }
}
</style>