import { createRouter, createWebHistory } from 'vue-router'
import store from "@/store"

import Entry from "@/views/Entry.vue"

import Main from "@/views/online/Main.vue"
import Home from "@/views/online/Home.vue"
import TweetCompose from "@/components/TweetCompose.vue"

import User from "@/views/online/User.vue"
import Tweets from "@/components/users/tabs/Tweets.vue"
import Replies from "@/components/users/tabs/Replies.vue"
import Likes from "@/components/users/tabs/Likes.vue"

import FollowsView from "@/views/online/Follows.vue"
import Follows from "@/components/users/Follows.vue"
import Followers from "@/components/users/Followers.vue"

import Post from "@/views/online/Post.vue"

import SearchView from "@/views/online/Search.vue"
import SearchUsers from "@/components/search/tabs/Users.vue"
import SearchActus from "@/components/search/tabs/Actu.vue"

import Register from "@/views/offline/Register.vue"
import Login from "@/views/offline/Login.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Entry,
      children: [
        { path: '/register', component: Register },
        { path: '/login', component: Login }
      ]
    },
    {
      path: "/home",
      name: "Accueil",
      component: Main,
      children: [
        {
          path: '', name: "Accueil", component: Home, meta: {
            onScroll: (percentage) => {
              if(percentage >= .8) store.dispatch('fetchFeed')
            }
          }
        },
        {
          path: '/tweet',
          name: "TweetCompose",
          components: {
            default: Home,
            popup: TweetCompose
          },
          props: true
        }
      ],
      meta: {
        tweet: 'TweetCompose',
        requireAuth: true,
        title: "Accueil / Twitter",
        menu: 1
      }
    },
    {
      path: "/:user",
      name: "Data",
      component: Main,
      children: [
        {
          path: '',
          name: "User",
          component: User,
          children: [
            {
              path: '',
              components: {
                data: Tweets
              },
              meta: {
                selected: 1,
                onScroll: (percentage) => {
                  if(percentage >= .8) store.dispatch('fetchPosts')
                }
              }
            },
            {
              path: 'replies',
              components: {
                data: Replies
              },
              meta: {
                selected: 2,
                onScroll: (percentage) => {
                  if(percentage >= .8) store.dispatch('fetchReplies')
                }
              }
            },
            {
              path: 'likes',
              components: {
                data: Likes
              },
              meta: {
                selected: 3,
                onScroll: (percentage) => {
                  if(percentage >= .8) store.dispatch('fetchLikes')
                }
              }
            }
          ],
          meta: {
            tweet: 'Mention',
            menu: 7
          }
        },
        {
          path: "follow(ers|s)",
          component: FollowsView,
          children: [
            {
              path: '/:user/follows',
              component: Follows,
              meta: {
                selected: 2,
                onScroll: (percentage) => {
                  if(percentage >= .8) store.dispatch('fetchFollows')
                }
              }
            },
            {
              path: '/:user/followers',
              component: Followers,
              meta: {
                selected: 1,
                onScroll: (percentage) => {
                  if(percentage >= .8) store.dispatch('fetchFollowers')
                }
              }
            }
          ],
          meta: {
            tweet: "Follows"
          }
        },
        {
          path: "status/:post",
          name: "Discussion",
          component: Post
        },
        /* Tweets URL */
        {
          path: "/tweet",
          name: "Mention",
          components: {
            default: User,
            popup: TweetCompose
          },
          props: true
        },
        {
          path: "/tweet",
          name: "Follows",
          components: {
            default: FollowsView,
            popup: TweetCompose
          },
          props: true
        }
      ]
    },
    {
      path: "/search",
      component: Main,
      children: [
        {
          path: '',
          name: "SearchView",
          component: SearchView,
          children: [
            {
              path: '',
              component: SearchActus,
              meta: { 
                tab: 1,
                onScroll: (percentage, data) => {
                  if(percentage >= .8) store.dispatch("fetchSearchPosts", data)
                }
              }
            },
            {
              path: 'users',
              component: SearchUsers,
              meta: {
                tab: 2,
                onScroll: (percentage, data) => {
                  if(percentage >= .8) store.dispatch("fetchSearchUsers", data)
                }
              }
            }
          ]
        }
      ],
      meta: {
        hideSearchBar: true,
        menu: 2,
      }
    }
  ]
})

router.beforeEach((to, _, next) => {
  if (!to) store.dispatch('fetchFeed', store.getters.feed.length).then(() => next('/home'))
  if (to.meta.title) document.title = to.meta.title

  if (to.meta.requireAuth) {
    return next(store.getters.isConnected ? null : '/')
  }

  next();
})

export default router