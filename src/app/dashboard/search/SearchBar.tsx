import { MdSearch } from "react-icons/md";
import { useSearch } from "./SearchContext";

const SearchBar = ({ scope = "global" }: { scope?: "global" | "page" }) => {
    const {
        globalSearchQuery,
        setGlobalSearchQuery,
        pageSearchQuery,
        setPageSearchQuery,
      } = useSearch();
      const isGlobal = scope === "global";
  return (
    <div className="flex-1 min-w-0 flex items-center gap-[7px] md:gap-[10px] bg-[#2e374a] p-[6px] sm:p-[8px] md:p-[10px] rounded-[10px] mr-[5px] sm:mr-2">
  <MdSearch size={19} />
  <input
    type="text"
    placeholder="Search.."
    value={isGlobal ? globalSearchQuery : pageSearchQuery}
    onChange={(e) =>
      isGlobal ? setGlobalSearchQuery(e.target.value) : setPageSearchQuery(e.target.value)
    }
    className="bg-transparent border-none outline-none text-[--text] w-full min-w-0"
  />
</div>

  );
};

export default SearchBar;
