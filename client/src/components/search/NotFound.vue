<template>
  <div class="errorInfo margin">
    <span>Aucun résultat pour "{{ $route.query.filter }}"</span>
    <span>
      Aucun résultat n'a été trouvé pour le terme que vous avez saisi. Vous avez
      peut-être fait une faute de frappe.
    </span>
  </div>
</template>

<script>
export default {
  name: "SearchError"
};
</script>