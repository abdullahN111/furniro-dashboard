import Image from "next/image";
import { MdPlayCircleFilled, MdReadMore } from "react-icons/md";

const Rightbar = () => {
  return (
    <div className="w-full max-w-[230px]">
      <div className="hidden xl:block">
        <div className="bg-gradient-to-t from-[#182237] to-[#253352] py-[16px] px-[12px] rounded-[10px] mb-[16px] relative">
          <div className="absolute right-0 bottom-0 w-[40%] h-[40%]">
            <Image
              src="/images/astronaut.png"
              alt="astronaut visual"
              fill
              className="object-contain opacity-[0.2]"
            />
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-bold">🔥 Available Now</span>
            <h3 className="text-base">
              How to use the new version of the admin dashboard?
            </h3>
            <span className="text-[--textSoft] font-semibold text-[11px]">
              Takes less than 2 minutes to learn
            </span>
            <p className="text-[--textSoft] text-[13px]">
              In this quick guide, we’ll walk you through the updated dashboard
              interface, new navigation improvements, and shortcuts that will
              save you time managing your workflow.
            </p>
            <a
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-[10px] p-[10px] w-[max-content] bg-[#5d57c9] text-white border-none rounded-[5px] cursor-pointer"
            >
              <MdPlayCircleFilled />
              Watch
            </a>
          </div>
        </div>

        <div className="bg-gradient-to-t from-[#182237] to-[#253352] p-4 rounded-[10px] mb-4 relative">
          <div className="flex flex-col gap-3">
            <span className="font-bold">🚀 Coming Soon</span>
            <h3 className="text-base">
              An AI Agent is coming to guide you through the dashboard!
            </h3>
            <span className="text-[--textSoft] font-semibold text-[11px]">
              Your personal smart assistant
            </span>
            <p className="text-[--textSoft] text-[13px]">
              Soon, an AI-powered Agent will be available to answer your
              questions, provide step-by-step guidance, and make using the
              platform even easier.
            </p>
            <button className="flex items-center gap-2 p-2 w-[max-content] bg-[#5d57c9] text-white border-none rounded-[5px] cursor-pointer">
              <MdReadMore />
              Learn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
