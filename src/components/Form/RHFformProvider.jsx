import React from "react";
import { FormProvider } from "react-hook-form";

function RHFformProvider({ methods, onSubmit, children, ...rest }) {
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} {...rest}>
        {children}
      </form>
    </FormProvider>
  );
}

export default RHFformProvider;
