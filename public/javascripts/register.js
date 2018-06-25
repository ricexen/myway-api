$(document).ready(() => {
  var form = $("#register");
  var url = form.attr("action");
  var classDanger = "danger shake";
  $(".btn[type='submit']").click(e => {
    e.preventDefault();
    axios
      .post(url, getFormData(form))
      .then(response => {
        form.find("input").removeClass(classDanger);
        form.addClass("success");
        setTimeout(() => (location = "/login"), 300);
      })
      .catch(error => {
        console.log(error.response.data);
        formErrors(form, classDanger, error.response.data);
      });
  });
});
