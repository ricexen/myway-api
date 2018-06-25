var formErrors = (form = $("form"), className, errors) => {
  form.find("input").removeClass(className);
  for (el in errors) {
    form.find("#" + el).addClass(className);
  }
};
