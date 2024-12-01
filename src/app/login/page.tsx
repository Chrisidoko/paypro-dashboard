import { LoginForm } from "./LoginForm";
import Image from "next/image";

export default function Login() {
  return (
    <div className="min-h-screen">
      <div className="relative flex gap-2 items-center p-6">
        {" "}
        <Image
          src="/KD_logo.png"
          alt="Kaduna state"
          width={66}
          height={66}
          className="  md:block object-cover"
        />
        <div className="flex flex-col">
          <span className="text-[#151D48] font-bold ">
            Tertiary Institution
          </span>
          <span className="text-[#D33833] font-bold ">Dasboard</span>
        </div>
      </div>
      <div className="flex items-center justify-center ">
        <div className="relative flex m-6 space-y-8 bg-white shadow-2xl rounded-xl md: flex-row md:space-y-0">
          <LoginForm />
          <div className="relative flex flex-col items-center gap-[3px] bg-[#F3F3F3] w-[350px] h-[444px]">
            {/* <div className="flex items-center "> */}
            <Image
              src="/kadirs.png"
              alt="Kaduna state"
              width={249}
              height={410}
              className="h-full hidden rounded md:block object-contain "
            />
            {/* </div> */}
            {/* text on image */}
            <div
              className=" bottom-0  p-6 bg-white
        bg-opacity-15 backdrop-blur-sm rounded-xl drop-shadow-lg md:block"
            >
              <span className="text-[#151D48] text-md">
                Kaduna state tertiary <br /> institutions Revenue Collection{" "}
                <br />
                Analysis
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
