import Image from "next/image";

const Transactions = () => {
  return (
    <div className="container bg-[--bgSoft] w-full p-4 rounded-[10px]">
      <h2 className="mb-[20px] font-light text-[--textSoft] text-lg sm:text-xl">
        Latest Transactions
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-[10px] whitespace-nowrap">Name</th>
              <th className="p-[10px] whitespace-nowrap">Status</th>
              <th className="p-[10px] whitespace-nowrap">Date</th>
              <th className="p-[10px] whitespace-nowrap">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-[10px] whitespace-nowrap">
                <div className="flex items-center gap-[12px]">
                  <Image
                    src="/images/noavatar.png"
                    alt="user image"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  John Doe
                </div>
              </td>
              <td className="p-[10px] whitespace-nowrap">
                <span className="rounded-[5px] p-[5px] text-[14px] text-white bg-[#f7cb7375]">
                  Pending
                </span>
              </td>
              <td className="p-[10px] whitespace-nowrap">12.02.2025</td>
              <td className="p-[10px] whitespace-nowrap">$320.00</td>
            </tr>
            <tr>
              <td className="p-[10px] whitespace-nowrap">
                <div className="flex items-center gap-[12px]">
                  <Image
                    src="/images/noavatar.png"
                    alt="user image"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  John Doe
                </div>
              </td>
              <td className="p-[10px] whitespace-nowrap">
                <span className="rounded-[5px] p-[5px] text-[14px] text-white bg-[#afd6ee75]">
                  Done
                </span>
              </td>
              <td className="p-[10px] whitespace-nowrap">12.02.2025</td>
              <td className="p-[10px] whitespace-nowrap">$320.00</td>
            </tr>
            <tr>
              <td className="p-[10px] whitespace-nowrap">
                <div className="flex items-center gap-[12px]">
                  <Image
                    src="/images/noavatar.png"
                    alt="user image"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  John Doe
                </div>
              </td>
              <td className="p-[10px] whitespace-nowrap">
                <span className="rounded-[5px] p-[5px] text-[14px] text-white bg-[#f7737375]">
                  Cancelled
                </span>
              </td>
              <td className="p-[10px] whitespace-nowrap">12.02.2025</td>
              <td className="p-[10px] whitespace-nowrap">$320.00</td>
            </tr>
            <tr>
              <td className="p-[10px] whitespace-nowrap">
                <div className="flex items-center gap-[12px]">
                  <Image
                    src="/images/noavatar.png"
                    alt="user image"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  John Doe
                </div>
              </td>
              <td className="p-[10px] whitespace-nowrap">
                <span className="rounded-[5px] p-[5px] text-[14px] text-white bg-[#f7cb7375]">
                  Pending
                </span>
              </td>
              <td className="p-[10px] whitespace-nowrap">12.02.2025</td>
              <td className="p-[10px] whitespace-nowrap">$320.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
