import { MdSupervisedUserCircle } from "react-icons/md"


const Card = () => {
  return (
    <div className="bg-[--bgSoft] hover:bg-[#2e374a] p-[20px] rounded-[10px] flex gap-[20px] lg:gap-[16px] cursor-pointer w-auto sm:w-[100%]">
      <MdSupervisedUserCircle size={24} />
      <div className="flex flex-col gap-[20px]">
        <span>Total Users</span>
        <span className="text-[23px] font-semibold">10435</span>
        <span className="text-[14px] font-light"><span className="text-[lime]">14%</span> more than previous week</span>
      </div>
    </div>
  )
}

export default Card