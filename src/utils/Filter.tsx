import { useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Grid,
} from "@mui/material";

const Filter = () => {

  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [ward, setWard] = useState("");

  const handleStateChange = (event: any) => {
    setState(event.target.value);
  };

  const handleLgaChange = (event: any) => {
    setLga(event.target.value);
  };

  const handleWardChange = (event: any) => {
    setWard(event.target.value);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "12px",
      }}
    >
      <Grid container spacing={2} alignItems="center" justifyContent="flex-start">
        <Grid item xs={12} sm={6} md={2.3}>
        </Grid>   
        <Grid item xs={12} sm={6} md={2.3}>
          <FormControl fullWidth style={{ backgroundColor: "white" }}>
            <InputLabel style={{ fontSize: "14px" }}>State</InputLabel>
            <Select value={state} onChange={handleStateChange} label="State">
              <MenuItem value="ABIA" style={{ fontSize: "14px" }}>
                ABIA
              </MenuItem>
              <MenuItem value="ADAMAWA" style={{ fontSize: "14px" }}>
                ADAMAWA
              </MenuItem>
              <MenuItem value="AKWA IBOM" style={{ fontSize: "14px" }}>
                AKWA IBOM
              </MenuItem>
              <MenuItem value="ANAMBRA" style={{ fontSize: "14px" }}>
                ANAMBRA
              </MenuItem>
              <MenuItem value="BAUCHI" style={{ fontSize: "14px" }}>
                BAUCHI
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2.3}>
          <FormControl fullWidth style={{ backgroundColor: "white" }}>
            <InputLabel style={{ fontSize: "14px" }}>LGA</InputLabel>
            <Select value={lga} onChange={handleLgaChange} label="LGA">
              <MenuItem value="LGA 1" style={{ fontSize: "14px" }}>
                LGA 1
              </MenuItem>
              <MenuItem value="LGA 2" style={{ fontSize: "14px" }}>
                LGA 2
              </MenuItem>
              <MenuItem value="LGA 3" style={{ fontSize: "14px" }}>
                LGA 3
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2.3}>
          <FormControl fullWidth style={{ backgroundColor: "white" }}>
            <InputLabel style={{ fontSize: "14px" }}>Ward</InputLabel>
            <Select value={ward} onChange={handleWardChange} label="WARD">
              <MenuItem value="Ward 1" style={{ fontSize: "14px" }}>
                Ward 1
              </MenuItem>
              <MenuItem value="Ward 2" style={{ fontSize: "14px" }}>
              Ward 2
              </MenuItem>
              <MenuItem value="Ward 3" style={{ fontSize: "14px" }}>
              Ward 3
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Filter;
