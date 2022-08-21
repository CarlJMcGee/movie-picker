import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import * as React from "react";
import Button from "react-bootstrap/Button";

export interface IHeaderProps {
  session: Session | null;
}

export default function Header(props: IHeaderProps) {
  const { session } = props;

  return (
    <>
      <h1 className="my-5 mx-3 text-6xl text-amber-900 font-bold font-serif text-shadow-lg shadow-brown-2  text-center">
        Shit Screen
      </h1>
      {session ? (
        <Button
          onClick={() => signOut()}
          className="text-blue-700 text-2xl justify-self-end my-5"
        >
          Sign Out
        </Button>
      ) : (
        <Button
          onClick={() => signIn()}
          className="text-blue-700 text-2xl justify-self-end my-5"
        >
          Login
        </Button>
      )}
    </>
  );
}
