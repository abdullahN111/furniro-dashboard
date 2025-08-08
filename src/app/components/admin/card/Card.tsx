
import { MdSupervisedUserCircle } from "react-icons/md";

const Card = () => {
  return (
    <div className="bg-[--bgSoft] hover:bg-[#2e374a] p-2 sm:p-4 rounded-[10px] flex items-start gap-2 sm:gap-4 lg:gap-3 cursor-pointer min-w-0">
      <MdSupervisedUserCircle
        size={20}
        className="sm:w-6 sm:h-6 flex-shrink-0"
      />
      <div className="flex flex-col gap-2 sm:gap-5 min-w-0 flex-1">
        <span className="text-sm sm:text-base truncate">Total Users</span>
        <span className="text-lg sm:text-[23px] font-semibold truncate">
          10435
        </span>
        <span className="text-xs sm:text-[14px] font-light truncate">
          <span className="text-[lime]">14%</span> more than previous week
        </span>
      </div>
    </div>
  );
};

export default Card;
