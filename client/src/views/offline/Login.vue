<template>
  <div class="router-view opaque">
    <div class="login pop-up flex">
      <div class="header">
        <Icon :name="'logo'" :size="48" />
        <h2 class="fancy-font">Se connecter à Twitter</h2>
      </div>
      <form action="">
        <Input
          label="Téléphone, email ou nom d'utilisateur"
          isRequired
          hasAutofocus
          v-model:value="credential"
          :invalid="error"
          @click="error = false"
        />
        <Input
          label="Mot de passe"
          :type="'password'"
          isRequired
          v-model:value="password"
          :invalid="error"
          @click="error = false"
        />
      </form>
      <button
          class="btn btn-style-1"
          :disabled="credential === '' || password === ''"
          @click="connect"
        >
          Se connecter
        </button>
      <div class="actions">
        <span class="link colored">Mot de passe oublié ?</span>
        <span>·</span>
        <router-link to="/register" class="link colored"
          >S'inscrire sur Twitter</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import Icon from "@/components/Icon.vue";
import Input from "@/components/Input.vue";

export default {
  name: "Login",
  components: {
    Icon,
    Input
  },
  data() {
    return {
      credential: "",
      password: "",
      error: false
    };
  },
  methods: {
    connect() {
      this.$API.auth
        .login({
          credential: this.credential,
          password: this.password
        })
        .then(res => {
          if (!res.isError) {
            this.$store.commit("updateUser", res.data)
            this.$store.commit('connect')
            this.$router.push("/home");
            return;
          }

          this.error = true
        })
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/_variables.scss";

.login.pop-up {
  align-self: start;

  gap: 1rem;

  height: 100%;
  width: 22.5rem;
  padding: 2rem 1rem;

  .header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2rem;

    color: $extra-light-gray;

    font-size: 1.25rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .actions {
    display: flex;
    justify-content: center;
    gap: 0.5rem;

    :nth-child(2) {
      color: $extra-light-gray;
      font-weight: 400;
    }
  }
}
</style>