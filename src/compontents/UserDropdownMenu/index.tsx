import { signOut } from "next-auth/react";
import * as React from "react";

// bootstrap
import Dropdown from "react-bootstrap/Dropdown";
import Image from "react-bootstrap/Image";
import { Modal } from "react-bootstrap";
import { trpc } from "../../utils/trpc";

export interface IUserDropdownMenuProps {
  user: string | null | undefined;
  image: string | null | undefined;
}

export default function UserDropdownMenu({
  user,
  image,
}: IUserDropdownMenuProps) {
  image = image ?? "";

  const [pass, setPass] = React.useState("");
  const [showAdmin, setShowAdmin] = React.useState(false);

  const makeAdmin = trpc.useMutation("user.makeAdmin");

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
          />
          <button
            onClick={() => makeAdmin.mutate({ password: `deeznuts, gottem!` })}
          >
            Submit
          </button>
        </Modal.Body>
      </Modal>
      <Dropdown>
        <Dropdown.Toggle id="userDropdown" className="bg-blue-4 my-5 flex">
          <Image
            src={image}
            alt="user profile picture"
            thumbnail={false}
            className="w-8 mr-2"
            onDoubleClick={() => setShowAdmin(true)}
          />
          {user}
        </Dropdown.Toggle>
        <Dropdown.Menu id="userDropdown" className="bg-blue-3">
          <Dropdown.Item onClick={() => signOut()}>Sign Out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
