import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./draw-calc.form-context";

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField: (props) => <input type="text" {...props} />,
    NumberField: (props) => <input type="number" {...props} />,
    SelectField: (props) => <select {...props} />,
  },
  formComponents: {
    SubmitButton: (props) => <button type="button" {...props}>Submit</button>,
  },
  fieldContext,
  formContext
});