import * as React from "react";
import { signOut } from "next-auth/react";

// bootstrap
import Dropdown from "react-bootstrap/Dropdown";
import Image from "react-bootstrap/Image";
import { Modal } from "react-bootstrap";
import { trpc } from "../../utils/trpc";
import Link from "next/link";
import { useAtom } from "jotai";
import { sessionAtom } from "../../utils/stateStore";

export default function UserDropdownMenu() {
  const [sess, _setSession] = useAtom(sessionAtom);

  const [pass, setPass] = React.useState("");
  const [showAdmin, setShowAdmin] = React.useState(false);

  const makeAdmin = trpc.useMutation("user.makeAdmin");

  const adminHandler = async () => {
    await makeAdmin.mutateAsync({ password: pass });

    setShowAdmin(false);
  };

  return (
    <>
      <Modal show={showAdmin} onHide={() => setShowAdmin(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Please enter Admin password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type={"text"}
            onChange={(e) => setPass(e.target.value)}
            placeholder="password"
            className="border-2 bg-brown-1"
            value={pass}
          />
          <button onClick={() => adminHandler()}>Submit</button>
        </Modal.Body>
      </Modal>
      <Dropdown>
        <Dropdown.Toggle id="userDropdown" className="bg-blue-4 my-5 flex">
          <Image
            src={sess?.image ?? ""}
            alt="user pfp"
            thumbnail={false}
            className="w-8 mr-2"
            onDoubleClick={() => setShowAdmin(true)}
          />
          {sess?.name}
        </Dropdown.Toggle>
        <Dropdown.Menu id="userDropdown" className="bg-blue-3">
          {sess?.role === "admin" && (
            <Dropdown.Item>
              <Link href={"/dbconfig"}>Configure Database</Link>
            </Dropdown.Item>
          )}
          <Dropdown.Item onClick={() => signOut()}>Sign Out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
