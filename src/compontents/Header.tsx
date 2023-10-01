import * as React from "react";
import { signIn } from "next-auth/react";
import Button from "react-bootstrap/Button";
import UserDropdownMenu from "./UserDropdownMenu";
import { useAtom } from "jotai";
import { sessionAtom } from "../utils/stateStore";

export default function Header() {
  const [sess, _setSession] = useAtom(sessionAtom);

  return (
    <>
      <h1 className="my-5 mx-3 text-6xl text-amber-900 font-bold font-serif text-shadow-lg shadow-brown-2  text-center">
        Shit Screen
      </h1>
      {sess ? (
        <UserDropdownMenu />
      ) : (
        <Button
          onClick={() => signIn()}
          className="text-blue-700 justify-self-end my-5 h-10"
        >
          Login
        </Button>
      )}
    </>
  );
}
