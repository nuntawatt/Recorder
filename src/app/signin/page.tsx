"use client";
import {
  Typography,
  Stack,
  TextField,
  Button,
  Link,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { FormEvent } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res: any = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      if (!res?.error) {
        router.push("/");
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
          Sign In
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
              Sign In
            </Button>
            <Typography align="center">
              Don't have an account?{" "}
              <Link href="/signup" color="primary">
                Sign Up
              </Link>
            </Typography>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
