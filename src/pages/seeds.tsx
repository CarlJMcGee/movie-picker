import { NextPage } from "next";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { trpc } from "../utils/trpc";

const Seeds: NextPage = () => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const usersSeed = trpc.useMutation(["seed.users"]);

  const confirmSeed = () => {
    usersSeed.mutate();
    setConfirmOpen(false);
  };

  return (
    <>
      {confirmOpen ? (
        <Button
          className="bg-red-600"
          onBlur={() => setConfirmOpen(false)}
          onClick={() => confirmSeed()}
        >
          Are you Sure?
        </Button>
      ) : (
        <Button onClick={() => setConfirmOpen(true)} className={"bg-blue-2"}>
          Seed Users
        </Button>
      )}{" "}
    </>
  );
};

export default Seeds;
