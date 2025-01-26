import { setLocale } from "yup";

setLocale({
  number: {
    min: "Value should (at least) equal ${min}",
    max: "Value should (at most) equal ${max}",
  },
  // @TODO add more messages
});
