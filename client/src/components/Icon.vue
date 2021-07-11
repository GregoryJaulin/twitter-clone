<template>
  <div class="icon" :class="{ disabled, invisible }" @click="onClick">
    <svg :height="size" :width="innerTxt ? null : size" :viewBox="`0 0 ${width} 24`" ref="icon" :fill="color">
      <use :href="`#${name}`" />
      <text v-if="innerTxt">{{ innerTxt }}</text>
    </svg>
    <span class="outer-text" v-if="outerTxt">{{ outerTxt }}</span>
  </div>
</template>

<script>
export default {
  name: "Icon",
  props: {
    name: String,
    color: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: [Number, String],
      default: 24
    },
    innerTxt: String,
    outerTxt: String,
    disabled: Boolean,
    invisible: Boolean,
    onClick: Function
  },
  data() {
    return {
      width: 0
    };
  },
  methods: {
      svgWidth(ref) {
          return !!this.innerTxt && !!ref ? Math.floor(ref.getBBox().width) + 7.5 : 24;
      }
  },
  mounted() {
    this.width = this.svgWidth(this.$refs.icon)
  },
  updated() {
      this.width = this.svgWidth(this.$refs.icon)
  }
};
</script>

<style lang="scss">
@import "@/assets/_variables.scss";

.icon {
  display: flex;
  align-items: center;

  span {
    margin-left: .25rem;
  }

  text {
    transform: translate(32px, 20px);
  }

  &[class*="hover-"] {
    &:not(.disabled) {
      cursor: pointer;
    }
    
    svg {
      overflow: visible;
      padding: .5rem;
      border-radius: 2rem;
    }
  }

  &.invisible {
    pointer-events: none;
    opacity: 0;
  }
}

.icon:hover {
  &.hover-blue {
    color: $blue;

    svg {
      fill: $blue;
      background: rgba($blue, 0.1);
    }
  }

  &.hover-green {
    color: $green;

    svg {
      fill: $green;
      background: rgba($green, 0.1);
    }
  }

  &.hover-red {
    color: $red;

    svg {
      fill: $red;
      background: rgba($red, 0.1);
    }
  }
}

.icon[class*="active-"] {
  &.active-blue {
    color: $blue;

    svg {
      fill: $blue;
    }
  }

  &.active-green {
    color: $green;

    svg {
      fill: $green;
    }
  }

  &.active-red {
    color: $red;

    svg {
      fill: $red;
    }
  }
}
</style>