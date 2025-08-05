import { MdSupervisedUserCircle } from "react-icons/md";

const Card = () => {
  return (
    <div className="bg-[--bgSoft] hover:bg-[#2e374a] p-3 sm:p-[20px] rounded-[10px] flex gap-3 sm:gap-[20px] lg:gap-[16px] cursor-pointer w-full">
      <MdSupervisedUserCircle size={20} className="sm:w-6 sm:h-6" />
      <div className="flex flex-col gap-2 sm:gap-[20px] min-w-0 flex-1">
        <span className="text-sm sm:text-base">Total Users</span>
        <span className="text-lg sm:text-[23px] font-semibold">10435</span>
        <span className="text-xs sm:text-[14px] font-light">
          <span className="text-[lime]">14%</span> more than previous week
        </span>
      </div>
    </div>
  );
};

export default Card;
