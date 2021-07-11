<template>
  <div class="router-view">
    <div class="register pop-up flex max">
      <div class="header">
        <Icon
          class="hover-blue"
          name="close"
          color="#1DA1F2"
          :size="40"
          :invisible="step === 1"
          @click="this.step > 1 && this.step--"
        />
        <Icon name="logo" color="#E1E8ED" />
        <button
          class="btn btn-style-1"
          :disabled="!isStepValid"
          @click="this.step < 3 ? this.step++ : register()"
        >
          Suivant
        </button>
      </div>
      <form action="">
        <h2>Créer votre compte</h2>
        <div v-if="step === 1">
          <Input
            :maxLength="25"
            label="Nom et Prénom"
            :baseValue="name"
            required
            autofocus
            counter
            v-model:value="name"
          />
          <Input
            :type="isUsingEmail ? 'email' : 'text'"
            :label="isUsingEmail ? 'Email' : 'Téléphone'"
            :baseValue="credential"
            required
            v-model:value="credential"
            :invalid="!validations.credentials.value"
            @click="validations.credentials.value = true"
          />

          <a class="link colored" @click="isUsingEmail = !isUsingEmail">
            Utiliser un {{ isUsingEmail ? "téléphone" : "email" }}
          </a>

          <div class="informations">
            <h3>Date de naissance</h3>
            <p>
              Cette information ne sera pas affichée publiquement. Confirmez
              votre âge, même si ce compte est pour une entreprise, un animal de
              compagnie ou autre chose.
            </p>
          </div>

          <div class="birthdate">
            <Select
              label="Mois"
              :options="
                Array.from({ length: 12 }, (_, i) =>
                  new Date(0, i).toLocaleString('fr-FR', { month: 'long' })
                )
              "
              disableFirst
              :selection="birthdate[1]"
              v-model:value="birthdate[1]"
            />
            <Select
              label="Jour"
              :options="Array.from({ length: 31 }, (_, i) => i + 1)"
              disableFirst
              :selection="birthdate[0]"
              v-model:value="birthdate[0]"
            />
            <Select
              label="Année"
              :options="Array.from({ length: 121 }, (_, i) => 2021 - i)"
              disableFirst
              :selection="birthdate[2]"
              v-model:value="birthdate[2]"
            />
          </div>
        </div>
        <div v-else-if="step === 2">
          <Input label="Nom" :baseValue="name" @click="step = 1" />
          <Input
            :label="isUsingEmail ? 'Email' : 'Téléphone'"
            :baseValue="credential"
            @click="step = 1"
          />
          <Input
            label="Date de Naissance"
            :baseValue="birthdates"
            @click="step = 1"
          />
        </div>
        <div v-else>
          <Input
            label="Tag"
            :baseValue="tag"
            prefix="@"
            required
            v-model:value="tag"
            :invalid="!validations.tag.value"
            @click="validations.tag.value = true"
          />
          <div class="informations">
            <h3>Mot de passe</h3>
            <p>
              Votre mot de passe doit contenir au moins 8 caractères dont une
              majuscule, une minuscule, un chiffre et un caractère spécial parmi
              les suivants : @$!%*?&
            </p>
          </div>
          <Input
            label="Mot de passe"
            :baseValue="password"
            type="password"
            required
            @update:value="password = $event"
            :invalid="!validations.password.value"
            @click="validations.password.value = true"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Icon from "@/components/Icon.vue";
import Input from "@/components/Input.vue";
import Select from "@/components/Select.vue";

export default {
  name: "Register",
  components: {
    Icon,
    Input,
    Select
  },
  data() {
    return {
      step: 1,
      name: "",
      credential: "",
      isUsingEmail: true,
      birthdate: [],
      tag: "",
      password: "",
      validations: {
        credentials: {
          value: true,
          step: 1
        },
        tag: {
          value: true,
          step: 3
        },
        password: {
          value: true,
          step: 3
        }
      }
    };
  },
  computed: {
    isNameValid() {
      return /\w+/.test(this.name);
    },
    isCredentialValid() {
      return (this.isUsingEmail
        ? /(?=^[A-z0-9])(?!.*([.-]@|@[.-]))(?!.*[.-]{2,})[A-z0-9-.]{0,64}@[A-z0-9-.]{1,253}[A-z0-9-.]*(\.[A-z0-9]+)+/
        : /^((\+33)|0)\d([.\- ]{0,1}\d{2}){4}$/
      ).test(this.credential);
    },
    birthdates: {
      get() {
        return `${this.birthdate[0]} ${this.birthdate[1]} ${this.birthdate[2]}`;
      }
    },
    isTagValid() {
      return /\w{3,}/.test(this.tag);
    },
    isPasswordValid() {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        this.password
      );
    },
    isStepValid() {
      switch (this.step) {
        case 1:
        case 2:
          return (
            this.isNameValid &&
            this.isCredentialValid &&
            this.birthdate.length === 3
          );
        case 3:
          return this.isTagValid && this.isPasswordValid;
        default:
          return false;
      }
    }
  },
  methods: {
    register() {
      this.$API.auth
        .register({
          tag: this.tag,
          credential: this.credential,
          name: this.name,
          password: this.password
        })
        .then(res => {
          if (!res.isError) {
            this.$store.commit("upsertUser", res.data)
            this.$store.commit('connect')
            this.$router.push("/home")
            return;
          }

          let minStep = 3;
          res.data.fields.forEach(field => {
            const val = this.validations[field];
            val.value = false;
            if (val.step < minStep) minStep = val.step;
          });

          this.step = minStep;
        });
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/_variables.scss";

.register.pop-up {
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  form {
    margin: 0 0.5rem;

    > div {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      margin-top: 1rem;

      .informations p {
        font-size: 0.9rem;
        color: $gray;
      }

      .birthdate {
        display: grid;
        grid-template-columns: 6fr 3fr 4fr;

        column-gap: 1rem;
      }
    }
  }
}
</style>