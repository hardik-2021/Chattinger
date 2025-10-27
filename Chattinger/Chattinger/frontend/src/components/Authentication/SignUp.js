import { VStack, Input, Button } from "@chakra-ui/react";
import { PasswordInput } from "../ui/password-input";
import { Field } from "@chakra-ui/react";
import React, { useState } from "react";
import { toaster } from "../ui/toaster";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useNavigate();
  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toaster.create({
        description: "Please Select an Image!",
        type: "warning",
        duration: 5000,
        closable: true,
        position: "bottom",
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "Chattinger");
      data.append("cloud_name", "dceyphz0e");
      fetch("https://api.cloudinary.com/v1_1/dceyphz0e/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.secure_url.toString());
          console.log(data.secure_url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          toaster.create({
            description: "Image upload failed!",
            type: "error",
            duration: 5000,
            closable: true,
            position: "bottom",
          });
          setLoading(false);
        });
    } else {
      toaster.create({
        description: "Please Select an Image!",
        type: "warning",
        duration: 5000,
        closable: true,
        position: "bottom",
      });
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
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

    if (password !== confirmPassword) {
      toaster.create({
        description: "Password do not match",
        type: "warning",
        duration: 5000,
        closable: true,
        position: "bottom",
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config
      );
      toaster.create({
        description: "Registration Successful",
        type: "success",
        duration: 5000,
        closable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
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
      <Field.Root id="first-name" required>
        <Field.Label></Field.Label>
        <Input
          placeholder="Enter Your Name*"
          onChange={(e) => setName(e.target.value)}
        />
        <Field.HelperText />
        <Field.ErrorText />
      </Field.Root>

      <Field.Root id="email" required>
        <Field.Label></Field.Label>
        <Input
          placeholder="Enter Your E-mail*"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field.HelperText />
        <Field.ErrorText />
      </Field.Root>

      <PasswordInput
        placeholder="Enter Your Password*"
        visible={visible}
        onVisibleChange={setVisible}
        onChange={(e) => setPassword(e.target.value)}
      />

      <PasswordInput
        placeholder="Confirm Password*"
        visible={visible}
        onVisibleChange={setVisible}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <Field.Root id="pic">
        <Field.Label></Field.Label>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          placeholder="Upload Your Picture"
          onChange={(e) => postDetails(e.target.files[0])}
        />
        <Field.HelperText />
        <Field.ErrorText />
      </Field.Root>

      <Button
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
