"use client";
import { useAppStore } from "@/store";
import {
  Button,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { Architects_Daughter } from "next/font/google";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import { USER_API_ROUTES } from "@/utils/api-routes";
import axios from "axios";

const ArchitectsDaughter = Architects_Daughter({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

const AuthModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpen?: () => void;
  onOpenChange: () => void;
}) => {
  const [modalType, setModalType] = useState("login");
  const router = useRouter();
  const userInfo = useAppStore();
  const { setUserInfo } = useAppStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (onClose: () => void) => {
    const response = await axios.post(USER_API_ROUTES.SIGNUP, {
      firstName,
      lastName,
      email,
      password,
    });
    if (response.data.userInfo) {
      setUserInfo(response.data.userInfo);
      onClose();
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
    }
  };

  const handleLogin = async (onClose: () => void) => {
    const response = await axios.post(USER_API_ROUTES.LOGIN, {
      email,
      password,
    });
    if (response.data.userInfo) {
      setUserInfo(response.data.userInfo);
      onClose();
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
    }
  };

  const switchModalType = () => {
    setModalType((prev) => (prev === "login" ? "signup" : "login"));
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      className="bg-opacity-50 bg-purple-200"
    >
      <ModalContent className="rounded-xl bg-white/70 backdrop-blur-md p-6 w-full max-w-md shadow-xl">
        {(onClose) => (
          <>
            <ModalHeader className="text-center text-2xl font-bold capitalize">
              {modalType}
            </ModalHeader>

            <ModalBody className="flex flex-col items-center w-full justify-center">
              <div className="flex flex-col items-center gap-2 my-4">
                <Image src="/logo.png" alt="logo" height={80} width={80} />
                <span
                  className={`text-xl uppercase italic ${ArchitectsDaughter.className}`}
                >
                  ARKLYTE
                </span>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {modalType === "signup" && (
                  <>
                    <Input
                      placeholder="First Name"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <Input
                      placeholder="Last Name"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </>
                )}

                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </ModalBody>

            <ModalFooter className="flex flex-col gap-2 items-center justify-center">
              <Button
                color="primary"
                className="w-full capitalize"
                onPress={() => {
                  modalType === "login"
                    ? handleLogin(onClose)
                    : handleSignup(onClose);
                }}
              >
                {modalType}
              </Button>

              {modalType === "signup" ? (
                <p>
                  Already have an account?{" "}
                  <Link className="cursor-pointer" onClick={switchModalType}>
                    Login Now
                  </Link>
                </p>
              ) : (
                <p>
                  Don&apos;t have an account?{" "}
                  <Link className="cursor-pointer" onClick={switchModalType}>
                    Signup Now
                  </Link>
                </p>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;
