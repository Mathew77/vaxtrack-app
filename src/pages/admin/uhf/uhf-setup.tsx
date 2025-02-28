import React from "react";
import { TextField, Button, Grid, Container, Typography } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// Validation Schema
const validationSchema = Yup.object({
  State_id: Yup.string().required("Required"),
  lga_id: Yup.string().required("Required"),
  ward_id: Yup.string().required("Required"),
  org_unit_id: Yup.string().required("Required"),
  ehf_name: Yup.string().required("Required"),
  uhf_ids: Yup.string().required("Required"),
  Created_by: Yup.string().required("Required"),
  Date_created: Yup.date().required("Required"),
  Modified_by: Yup.string().required("Required"),
  date_modified: Yup.date().required("Required"),
});

// Initial Form Values
const initialValues = {
  State_id: "",
  lga_id: "",
  ward_id: "",
  org_unit_id: "",
  ehf_name: "",
  uhf_ids: "",
  Created_by: "",
  Date_created: "",
  Modified_by: "",
  date_modified: "",
};

export default function CustomForm() {
  const handleSubmit = (values: typeof initialValues) => {
    console.log("Form Data:", values);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom align="center">
        UHF SETUP
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <Grid container spacing={2}>
              {Object.keys(initialValues).map((key, index) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Field
                    as={TextField}
                    name={key}
                    label={key.replace(/_/g, " ")}
                    fullWidth
                    variant="outlined"
                    error={
                      touched[key as keyof typeof initialValues] &&
                      Boolean(errors[key as keyof typeof initialValues])
                    }
                    helperText={
                      touched[key as keyof typeof initialValues] &&
                      errors[key as keyof typeof initialValues]
                    }
                  />
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
