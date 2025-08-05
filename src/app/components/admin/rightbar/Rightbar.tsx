import Image from "next/image";
import { MdPlayCircleFilled, MdReadMore } from "react-icons/md";

const Rightbar = () => {
  return (
    <div className="w-full lg:w-[260px] max-w-[260px]">
      <div className="hidden lg+:block">
        <div className="bg-gradient-to-t from-[#182237] to-[#253352] py-[20px] px-[24px] rounded-[10px] mb-[20px] relative">
          <div className="absolute right-0 bottom-0 w-[50%] h-[50%]">
            <Image
              src="/images/astronaut.png"
              alt="astronaut visual"
              fill
              className="object-contain opacity-[0.2]"
            />
          </div>
          <div className="flex flex-col gap-[20px]">
            <span className="font-bold">🔥 Available Now</span>
            <h3 className="text-[18px]">
              How to use the new version of the admin dashboard?
            </h3>
            <span className="text-[--textSoft] font-semibold text-[12px]">
              Takes 4 minutes to learn
            </span>
            <p className="text-[--textSoft] text-[14px]">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Reprehenderit eius libero perspiciatis recusandae possimus.
            </p>
            <button className="flex items-center gap-[10px] p-[10px] w-[max-content] bg-[#5d57c9] text-white border-none rounded-[5px] cursor-pointer">
              <MdPlayCircleFilled />
              Watch
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-t from-[#182237] to-[#253352] py-[20px] px-[24px] rounded-[10px] mb-[20px] relative">
          <div className="flex flex-col gap-[20px]">
            <span className="font-bold">🚀 Coming Soon</span>
            <h3 className="text-[18px]">
              New server actions are available, partial pre-rendering is coming
              up!
            </h3>
            <span className="text-[--textSoft] font-semibold text-[12px]">
              Boost your productivity
            </span>
            <p className="text-[--textSoft] text-[14px]">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Reprehenderit eius libero perspiciatis recusandae possimus.
            </p>
            <button className="flex items-center gap-[10px] p-[10px] w-[max-content] bg-[#5d57c9] text-white border-none rounded-[5px] cursor-pointer">
              <MdReadMore />
              Learn
            </button>
          </div>
        </div>
      </div>

      {/* <div className="hidden md:block relative flex-col lg:hidden gap-4 justify-center">
        <button className="flex items-center gap-2 p-2 bg-[#5d57c9] text-white rounded-md w-[100px]">
          <MdPlayCircleFilled size={20} />
          <span className="text-sm">Watch</span>
        </button>
        <button className="flex items-center gap-2 p-2 bg-[#5d57c9] text-white rounded-md w-[100px]">
          <MdReadMore size={20} />
          <span className="text-sm">Learn</span>
        </button>
      </div> */}
    </div>
  );
};

export default Rightbar;
