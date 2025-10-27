import { VStack, Input, Button } from "@chakra-ui/react";
import { PasswordInput } from "../ui/password-input";
import { Field } from "@chakra-ui/react";
import { toaster } from "../ui/toaster";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const postDetails = (pics) => {};

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toaster.create({
        description: "Please Fill all the Fields",
        type: "warning",
        duration: 5000,
        closable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
      toaster.create({
        description: "Login Successful",
        type: "success",
        duration: 5000,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toaster.create({
        description: error.response?.data?.message || "Error Occurred!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack>
      <Field.Root id="email" required>
        <Field.Label></Field.Label>
        <Input
          placeholder="Enter Your E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field.HelperText />
        <Field.ErrorText />
      </Field.Root>

      <PasswordInput
        placeholder="Enter Your Password"
        visible={visible}
        onVisibleChange={setVisible}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>

      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
