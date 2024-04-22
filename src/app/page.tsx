import Image from "next/image";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function Home() {
  return (
    <div className="">
      <div className="max-w-2xl mx-auto mt-12 overflow-hidden">
        <Editor />
      </div>
    </div>
  );
}
