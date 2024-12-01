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
          <div className="relative">
            <Image
              src="/Kaj_1.jpg"
              alt="Kaduna state"
              width={349}
              height={410}
              className="h-full hidden rounded  md:block object-cover"
            />
            {/* text on image */}
            <div
              className="absolute hidden bottom-10 right-7 p-6 bg-white
        bg-opacity-15 backdrop-blur-sm rounded-xl drop-shadow-lg md:block"
            >
              <span className="text-white text-md">
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
