import Image from "next/image";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function Home() {
  return (
    <div className="">
      <div
        className="mx-auto"
        style={{
          maxWidth: "720px",
        }}
      >
        <Editor />
      </div>
    </div>
  );
}
