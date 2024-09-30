"use client";
import {
  Button,
  Stack,
  TextField,
  Typography,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import React from "react";
import { FormEvent } from "react";

export default function SignUpPage() {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(response);
      if (response.ok) {
        // ทำการ redirect หรือแสดงข้อความสำเร็จที่นี่
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 500 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <form onSubmit={(e) => handleSubmit(e)}>
          <Stack spacing={2}>
            <TextField
              name="email"
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ padding: "10px 0", fontSize: "16px" }}
            >
              Sign Up
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
