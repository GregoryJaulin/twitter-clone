import { createStore } from 'vuex'
import Status from './statusEnum'

import API from '@/api'

export default createStore({
    state: {
        user: {},
        status: Status.DISCONNECTED,
        // Sorted by createdAt
        // to keep feed sorted
        postscache: [],
        // Sorted by _id
        userscache: [],
        errorQueue: [],
        currentError: undefined,
        data: {
            user: {
                id: undefined,
                posts: [],
                replies: [],
                likes: []
            },

            post: {
                id: undefined,
                parents: [],
                replies: []
            }
        },
        search: {
            query: undefined,
            users: [],
            posts: []
        }
    },
    getters: {
        fullUser: state => state.user,
        isConnected: state => state.status === Status.CONNECTED,
        feed: state => state.postscache.filter(post => post.isFeed),

        currentUser: state => {
            if (!state.data.user.id) return undefined
            const { found, index } = state.userscache.binaryFind(state.data.user.id, false, '_id')

            return found ? state.userscache[index] : undefined
        },
        userPosts: state => state.data.user.posts,
        userReplies: state => state.data.user.replies,
        userLikes: state => state.data.user.likes,
        userFollows: state => state.data.user.follows,
        userFollowers: state => state.data.user.followers,

        currentPost: (state, getters) => {
            const index = getters.currentPostIndex
            return index !== -1 ? (state.postscache[index]) : undefined
        },
        currentPostIndex: state => !state.data.post.id ? -1 : state.postscache.findIndex(post => post._id === state.data.post.id),
        postParents: (state) => state.data.post.parents,
        postReplies: (state) => state.data.post.parents,

        searchQuery: (state) => state.search.query,
        searchUsers: (state) => state.search.users,
        searchPosts: (state) => state.search.posts
    },
    mutations: {
        // Spread operator is similar to Object.assign, but could sometimes be faster
        updateAccount: (state, userInfos) => {
            state.user = { ...state.user, ...userInfos }
            state.user && (state.status = Status.CONNECTED)
        },
        upsertUser: (state, user) => state.userscache.upsertSorted(user, { property: '_id' }),
        upsertPost: (state, post) => state.postscache.upsertSorted(post, { reversed: true, property: 'createdAt' }),
        updatePost: (state, {id, data}) => {
            let index = 0
            if ((index = state.postscache.findIndex(p => p._id === id)) !== -1) state.postscache[index] = {...state.postscache[index], ...data}
        },
        createPost: (state, post) => state.postscache.unshift({...post, isFeed: true}),
        // To change by an additionnal array where we put temp posts
        errorPost: (state, id) => {
            let index = 0
            if ((index = state.postscache.findIndex(p => p._id === id)) !== -1) state.postscache[index].status = 'error'
        },
        connect: (state) => state.status = Status.CONNECTED,
        queueError: (state, error) => state.currentError ? state.errorQueue.push(error) : state.currentError = error,
        clearError: (state) => state.currentError = undefined,
        nextError: (state) => state.currentError = state.errorQueue.shift(),
        setRetweet: (state, postID) => {
            let index = state.postscache.findIndex(p => p._id === postID)
            if (index !== -1) {
                const post = state.postscache[index]
                state.postscache[index] = { ...post, isRetweeted: !post.isRetweeted, retweetsCount: post.retweetsCount + (!post.isRetweeted ? 1 : -1) }
            }
        },
        setLike: (state, postID) => {
            let index = state.postscache.findIndex(p => p._id === postID)
            if (index !== -1) {
                const post = state.postscache[index]
                state.postscache[index] = { ...post, isLiked: !post.isLiked, likesCount: post.likesCount + (!post.isLiked ? 1 : -1) }
            }
        },
        setFollow: (state, userID) => {
            const { found, index } = state.userscache.binaryFind(userID)
            if(found) {
                const user = state.userscache[index]
                state.userscache[index] = {...user, isFollowed: !user.isFollowed, followsCount: user.followsCount + (!user.isFollowed ? 1 : -1)}
            }
        }
    },
    actions: {
        getUser: async ({ commit, state }, id) => {
            let { found, index } = state.userscache.binaryFind(id, false, '_id')
            if (!found) {
                return await API.users.get(id).then(res => {
                    if (res && res.status === 200) {
                        commit('upsertUser', res.data)
                        return res.data
                    }
                })
            }

            return state.userscache[index]
        },
        getPost: async ({ commit, state }, id) => {
            if(!id) return

            let index = state.postscache.findIndex(p => p._id === id)
            if (index === -1) {
                return await API.posts.get(id).then(res => {
                    if (res && res.status === 200) {
                        res.data.postParents = []
                        res.data.postReplies = []
                        commit('upsertPost', res.data)
                        commit('upsertUser', res.data.author)
                        return res.data
                    }
                })
            }

            return state.postscache[index]
        },
        fetchPost: async ({ state, dispatch }, id) => {
            if(state.data.post === id) return
            
            const post = await dispatch('getPost', id)
            state.data.post = {
                id: post ? post._id : undefined,
                parents: [],
                replies: []
            }
        },
        fetchPostReplies: async ({ state, getters }, id) => {
            const last = getters.postReplies.slice(-1)[0]

            const replies = await API.posts.getReplies(id, last ? last.createdAt : undefined)
                .then(res => res.isError ? [] : res.data)

            state.data.post.replies.push(...replies)
        },
        fetchPostParents: async ({ state }, id) => {
            const parents = await API.posts.getParents(id).then(res => res.isError ? [] : res.data)

            state.data.post.parents.push(...parents)
        },
        fetchFeed: async ({ state, getters }) => {
            const last = getters.feed.slice(-1)[0]
            
            const feed = await API.posts.getFeed(last ? last.createdAt : undefined)
                .then(res => res.isError ? [] : res.data)
            feed.map(post => post.isFeed = true)

            state.postscache.push(...feed)
        },
        fetchUser: async ({ state, getters, dispatch, commit }, id) => {
            if (getters.currentUser && (getters.currentUser.tag === id || getters.currentUser._id === id)) return

            const user = await dispatch('getUser', id)
            if (user) {
                commit('upsertUser', { ...user })
                state.data.user.id = user._id
            } 

            state.data = {
                ...state.data,
                posts: [],
                replies: [],
                likes: []
            }
        },
        fetchFollows: async ({ state, getters, commit, dispatch }, id = state.data.user.id) => {
            const user = await dispatch('getUser', id)
            const length = user && user.follows && user.follows.length

            const follows = await API.users.getFollows(id, length)
                .then(res => res.isError ? [] : res.data)

            commit('upsertUser', { _id: id, follows: [...(getters.currentUser.follows || []), ...follows] })
        },
        fetchFollowers: async ({ state, getters, commit, dispatch }, id = state.data.user.id) => {
            const user = await dispatch('getUser', id)
            const length = user && user.followers && user.followers.length
            
            const followers = await API.users.getFollowers(id, length)
                .then(res => res.isError ? [] : res.data)

            commit('upsertUser', { _id: id, followers: [...(getters.currentUser.followers || []), ...followers] })
        },
        fetchPosts: async ({ state }, id = state.data.user.id) => {
            const length = state.data.user.posts.length

            const posts = await API.users.getPosts(id, length > 0 ? state.data.user.posts[length - 1].createdAt : undefined)
                .then(res => res.isError ? [] : res.data)

            state.data.user.posts.push(...posts)
        },
        fetchReplies: async ({ state }, id = state.data.user.id) => {
            const length = state.data.user.replies.length

            const replies = await API.users.getReplies(id, length > 0 ? state.data.user.replies[length - 1].createdAt : undefined)
                .then(res => res.isError ? [] : res.data)

            state.data.user.replies.push(...replies)
        },
        fetchRetweets: async ({ state }, id = state.data.user.id) => {
            const length = state.data.user.retweets.length

            const retweets = await API.users.getRetweets(id, length)
                .then(res => res.isError ? [] : res.data)

            state.data.user.retweets.push(...retweets)
        },
        fetchLikes: async ({ state }, id = state.data.user.id) => {
            const length = state.data.user.likes.length

            const likes = await API.users.getLikes(id, length)
                .then(res => res.isError ? [] : res.data)

            state.data.user.likes.push(...likes)
        },
        fetchSearch: async({ state }, query) => {
            state.search = await API.search.global(query)
                .then(res => res.isError ? {users: [], posts: []} : res.data)
        },
        fetchSearchUsers: async({ state, getters }, query) => {
            const users = await API.search.users(query, getters.searchUsers.length)
                .then(res => res.isError ? [] : res.data)

            state.search.users.push(...users)
        },
        fetchSearchPosts: async({ state, getters }, query) => {
            const posts = await API.search.posts(query, getters.searchPosts.length)
                .then(res => res.isError ? [] : res.data)

            state.search.posts.push(...posts)
        }
    }
})