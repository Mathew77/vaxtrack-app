import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Container,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios, { AxiosResponse } from "axios";


// Validation Schema
const validationSchema = Yup.object({
  first_name: Yup.string().required("Required"),
  last_name: Yup.string().required("Required"),
  username: Yup.string().required("Required"),
  password: Yup.string().min(6, "Password too short").required("Required"),
  role_id: Yup.string().required("Required"),
  permissions_ids: Yup.array().min(1, "At least one permission is required"),
  org_unit_id: Yup.string().required("Required"),
  phone_number: Yup.string()
    .matches(/^[0-9]+$/, "Only numbers allowed")
    .min(10, "Must be at least 10 digits")
    .required("Required"),
  email_address: Yup.string().email("Invalid email").required("Required"),
  created_by: Yup.string().required("Required"),
  date_created: Yup.date().required("Required"),
  modified_by: Yup.string().required("Required"),
  date_modified: Yup.date().required("Required"),
});

// Initial Form Values
const initialValues = {
  first_name: "",
  last_name: "",
  username: "",
  password: "",
  role_id: "",
  permissions_ids: [], // Changed to array for multi-select
  org_unit_id: "",
  phone_number: "",
  email_address: "",
  created_by: "",
  date_created: "",
  modified_by: "",
  date_modified: "",
};

export default function CustomForm() {
  const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);
  const [permissions, setPermissions] = useState<{ value: string; label: string }[]>([]);

  // Fetch data from API
  useEffect(() => {
    axios
      .get<{ id: string; name: string }[]>("https://api.example.com/roles")
      .then((response: AxiosResponse<{ id: string; name: string }[]>) => {
        setRoles(
          response.data.map((role: { id: string; name: string }) => ({
            value: role.id,
            label: role.name,
          }))
        );
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          console.error("Error fetching roles:", error.message);
        } else {
          console.error("Unknown error fetching roles:", error);
        }
      });
  
    axios
      .get<{ id: string; name: string }[]>("https://api.example.com/permissions")
      .then((response: AxiosResponse<{ id: string; name: string }[]>) => {
        setPermissions(
          response.data.map((perm: { id: string; name: string }) => ({
            value: perm.id,
            label: perm.name,
          }))
        );
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          console.error("Error fetching permissions:", error.message);
        } else {
          console.error("Unknown error fetching permissions:", error);
        }
      });
  }, []);
    

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const response = await axios.post("https://api.example.com/register", values);
      console.log("Form Submitted Successfully:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom align="center">
        User Registration Form
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, values, setFieldValue }) => (
          <Form>
            <Grid container spacing={2}>
              {Object.keys(initialValues).map((key) => (
                <Grid item xs={12} sm={6} key={key}>
                  {key === "role_id" ? (
                    // Single Select Dropdown for Role
                    <Field
                      as={TextField}
                      name={key}
                      label="Role"
                      select
                      fullWidth
                      variant="outlined"
                      error={touched.role_id && Boolean(errors.role_id)}
                      helperText={touched.role_id && errors.role_id}
                    >
                      {roles.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Field>
                  ) : key === "permissions_ids" ? (
                    // Multi-Select Dropdown for Permissions
                    <FormControl fullWidth>
                      <InputLabel>Permissions</InputLabel>
                      <Select
                        multiple
                        value={values.permissions_ids}
                        onChange={(event) => setFieldValue("permissions_ids", event.target.value)}
                        renderValue={(selected) => (
                          <div>
                            {(selected as string[]).map((value) => (
                              <Chip key={value} label={permissions.find((perm) => perm.value === value)?.label} style={{ margin: 2 }} />
                            ))}
                          </div>
                        )}
                      >
                        {permissions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.permissions_ids && errors.permissions_ids && (
                        <Typography color="error" variant="caption">
                          {errors.permissions_ids}
                        </Typography>
                      )}
                    </FormControl>
                  ) : (
                    // Text Input Fields
                    <Field
                      as={TextField}
                      name={key}
                      label={key.replace(/_/g, " ")}
                      type={key.includes("password") ? "password" : "text"}
                      fullWidth
                      variant="outlined"
                      error={touched[key as keyof typeof initialValues] && Boolean(errors[key as keyof typeof initialValues])}
                      helperText={touched[key as keyof typeof initialValues] && errors[key as keyof typeof initialValues]}
                    />
                  )}
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
