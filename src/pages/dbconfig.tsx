import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { trpc } from "../utils/trpc";

const DbConfig = () => {
  const { data: sess } = useSession();
  const { mutateAsync: fetchDbData } = trpc.useMutation("db.export");
  const {
    mutateAsync: importDbData,
    data,
    isLoading: isUploading,
  } = trpc.useMutation("db.import");
  const [file, setFile] = React.useState<string | null>(null);

  if (sess?.user?.name !== "Kurojin Karu") {
    return (
      <>
        <h1>Not Authorized</h1>
        <Link href={"/"}>
          <a>Go Home</a>
        </Link>
      </>
    );
  }

  const createFile = async () => {
    try {
      const res = await fetchDbData();

      if (!res) {
        return;
      }
      const blob = new Blob([JSON.stringify(res)], { type: "text/json" });
      const url = URL.createObjectURL(blob);
      setFile(url);
    } catch (err) {
      if (err) console.error(err);
    }
  };

  const fileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = await file.text();
    const json = JSON.parse(data);
    console.log(json);
  };

  return (
    <div className="">
      <h1 className="m-3">Export Database</h1>
      <button
        className=" m-3 px-2 py-1 bg-blue-400 rounded-md"
        onClick={createFile}
      >
        export!
      </button>
      {file ? (
        <a
          href={file}
          download={"db.json"}
          className="m-3 px-2 py-1 bg-green-400 rounded-md"
        >
          Download
        </a>
      ) : (
        <br />
      )}
      <br />
      <br />
      <h1 className="m-3">Import Database</h1>
      <input
        type="file"
        className=" m-3 px-2 py-1 bg-blue-400 rounded-md"
        onChange={fileUpload}
      />
    </div>
  );
};

export default DbConfig;
