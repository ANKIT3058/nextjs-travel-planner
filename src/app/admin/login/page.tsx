"use client";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Input,
  Button,
} from "@heroui/react";
import Image from "next/image";
import { Architects_Daughter } from "next/font/google";
import React, { useState } from "react";
import { ADMIN_API_ROUTES } from "@/utils/api-routes";
import axios from "axios";
import { useAppStore } from "@/store";
import { useRouter } from "next/navigation";

const ArchitectsDaughter = Architects_Daughter({
  weight: "400", // if single weight, otherwise you use array like [400, 500, 700],
  style: "normal", // if single style, otherwise you use array like ['normal', 'italic']
  subsets: ["latin"],
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {setUserInfo} = useAppStore();
  const router = useRouter();

  const handleLogin = async () => {
    console.log("before");
    console.log(ADMIN_API_ROUTES.LOGIN);
    const response = await axios.post(ADMIN_API_ROUTES.LOGIN, {
      email,
      password,
    });

    console.log("after");
    console.log(response);
    if (response.data.userInfo) {
      setUserInfo(response.data.userInfo)
      router.push("/admin")
    }
  };
  return (
    <div
      className="h-[100vh] w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/home/home-bg.png")' }}
    >
      {/* <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-2xl" /></div> */}
      <div className="absolute inset-0 backdrop-blur-md bg-white/10" />

      <Card className="relative z-20 w-[480px] rounded-2xl bg-black/40 backdrop-blur-md shadow-2xl border border-white/10">
        <CardHeader className="flex flex-col gap-1 capitalize text-3xl items-center">
          <div className=" flex flex-col items-center justify-center">
            <Image
              src="/logo.png"
              alt="logo"
              height={80}
              width={80}
              className="cursor-pointer"
              //   onClick={() => router.push("/admin/dashboard")}
            />
            <span className="text-xl uppercase font-medium italic text-white">
              <span className={ArchitectsDaughter.className}>
                ARKLYTE Admin Login
              </span>
            </span>
          </div>
        </CardHeader>
        <CardBody className="flex flex-col items-center w-full justify-center">
          <div className="flex flex-col gap-2 w-full">
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              color="danger"
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              color="danger"
            />
          </div>
        </CardBody>
        <CardFooter className="flex flex-col gap-2 items-center justify-center">
          <Button
            color="danger"
            variant="shadow"
            onClick={handleLogin}
            className="w-full capitalize"
            size="lg"
          >
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
