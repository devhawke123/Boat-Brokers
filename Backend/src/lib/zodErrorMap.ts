import { z } from "zod";

// Zod v4's default issue messages are technically worded ("Too small: expected
// string to have >=1 characters") and were leaking straight to end users via
// the { error } payload every route returns on a failed safeParse. Registered
// once as the global fallback here, this runs for every schema in every
// controller instead of needing a hand-written message on each individual
// .min()/.email()/etc call.
const friendlyErrorMap: z.core.$ZodErrorMap = (issue) => {
  switch (issue.code) {
    case "invalid_type":
      return issue.input === undefined ? "This field is required." : "This value isn't valid.";

    case "too_small": {
      if (issue.origin === "string") {
        return issue.minimum === 1 ? "This field is required." : `Must be at least ${issue.minimum} characters.`;
      }
      if (issue.origin === "number" || issue.origin === "int") return `Must be at least ${issue.minimum}.`;
      if (issue.origin === "array") return `Must have at least ${issue.minimum} item(s).`;
      return "This value is too small.";
    }

    case "too_big": {
      if (issue.origin === "string") return `Must be at most ${issue.maximum} characters.`;
      if (issue.origin === "number" || issue.origin === "int") return `Must be at most ${issue.maximum}.`;
      if (issue.origin === "array") return `Must have at most ${issue.maximum} item(s).`;
      return "This value is too large.";
    }

    case "invalid_format":
      if (issue.format === "email") return "Please enter a valid email address.";
      if (issue.format === "datetime" || issue.format === "date") return "Please enter a valid date.";
      if (issue.format === "url") return "Please enter a valid URL.";
      return "This value isn't formatted correctly.";

    case "invalid_value":
      return "Please choose a valid option.";

    case "not_multiple_of":
      return `Must be a multiple of ${issue.divisor}.`;

    default:
      return issue.message;
  }
};

z.config({ customError: friendlyErrorMap });
