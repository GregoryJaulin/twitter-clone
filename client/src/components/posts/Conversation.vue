<template>
  <div class="parents">
    <TweetBase
      class="parent"
      v-for="parent in $store.state.data.post.parents"
      v-bind="parent"
      :key="parent._id"
    />
  </div>

  <div class="post">
    <div
      class="profile"
      style="--src: url('')"
      @click.stop="$router.push(`/${author.tag}`)"
    />

    <div class="user">
      <span>{{ author.name }}</span>
      <span>@{{ author.tag }}</span>
    </div>

    <div class="content">
      {{ content }}
      <div class="quote" v-if="quote"></div>
    </div>

    <div class="date border">
      {{
        new Date(this.createdAt).toLocaleDateString("fr-FR", {
          hour: "numeric",
          minute: "2-digit",
          day: "numeric",
          month: "long",
          year: "numeric"
        })
      }}
    </div>

    <div class="count border combo">
      <div v-if="likesCount > 0">{{ likesCount }} <span>J'aime{{ likesCount > 1 ? s : "" }}</span></div>
      <div v-if="retweetsCount > 0">
        {{ retweetsCount }} <span>Retweet{{ retweetsCount > 1 ? s : "" }}</span>
      </div>
    </div>

    <div class="interactions border">
      <Icon
        name="comment"
        color="#657786"
        :size="40"
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
        :size="40"
        class="hover-green"
        :class="{ 'active-green': retweet.active }"
        @click.stop="toggleRetweet"
      />
      <Icon
        name="like"
        color="#657786"
        :size="40"
        class="hover-red"
        :class="{ 'active-red': like.active }"
        @click.stop="toggleLike"
      />
      <Icon
        name="share"
        color="#657786"
        :size="40"
        class="hover-blue"
        disabled
      />
    </div>
  </div>

  <TweetField
    :to="_id"
    placeholder="Tweetez votre réponse."
    @new="replies.unshift($event)"
    @validation="validatePost"
    :minified="isFieldMinified"
  />

  <div class="separator border"></div>

  <div class="replies">
    <TweetBase
      v-for="reply in $store.state.data.post.replies"
      v-bind="reply"
      :key="reply._id"
      class="border"
    />
  </div>
</template>

<script>
import { useStore } from "vuex";

import Icon from "@/components/Icon.vue";
import TweetBase from "@/components/TweetBase.vue";
import TweetField from "@/components/TweetField.vue";

export default {
  name: "DetailledPost",
  components: {
    Icon,
    TweetBase,
    TweetField
  },
  props: {
    _id: String,
    type: String,
    author: {
      _id: String,
      tag: String,
      name: String
    },
    content: String,
    target: String,
    quote: String,
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
    isRetweeted: Boolean,
    postParents: {
      type: Array,
      default: () => []
    },
    postReplies: {
      type: Array,
      default: () => []
    }
  },
  async setup(props) {
    const store = useStore();

    store
      .dispatch("fetchPostParents", props._id)
    store
      .dispatch("fetchPostReplies", props._id)
  },
  data() {
    return {
      isFieldMinified: true,
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
  created() {
    if (this.$route.fullPath !== '/tweet' && this.author.tag !== this.$route.params.user)
      this.$router.replace(`/${this.author.tag}/status/${this._id}`);

    document.title = `${this.author.name} sur Twitter : "${this.content}" / Twitter"`;
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
    },
    validatePost({ id, post }) {
      const index = this.replies.findIndex(p => p._id === id);
      if (index !== -1)
        this.replies[index] = { ...this.replies[index], ...post };
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/_variables.scss";

.post {
  display: grid;
  grid-template-areas:
    "profile author"
    "content content"
    "date date"
    "count count"
    "interactions interactions";
  grid-template-columns: auto 1fr;
  column-gap: 0.5rem;

  z-index: 5;

  padding: 1rem 0.75rem;
  padding-bottom: 0;

  width: 100%;

  .author {
    flex-direction: column;
    gap: initial;
  }

  .date {
    grid-area: date;

    width: 100%;
    padding: 1rem 0;
    color: $gray;
  }

  .content {
    padding-top: 0.75rem;
    font-size: 1.5rem;
  }

  .count {
    grid-area: count;

    width: 100%;
    padding: 0.5rem 0;

    &:empty {
      display: none;
    }
  }

  .interactions {
    justify-content: space-around !important;

    width: 100%;
    padding: 0.5rem 0;
  }
}

.replyField {
  display: grid;
  grid-template-columns: auto 1fr auto;
  place-items: center start;
  gap: 1rem;

  padding: 1rem;

  font-size: 1.33rem;

  img {
    height: 3.5rem;
    width: 3.5rem;

    border-radius: 100%;
  }

  [contenteditable] {
    width: 100%;
  }
}

.replies {
  display: flex;
  flex-direction: column-reverse;
}
</style>