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
    <div className="flex items-center gap-[10px] bg-[#2e374a] p-[10px] rounded-[10px]">
      <MdSearch size={20} />
      <input
        type="text"
        placeholder="Search.."
        value={isGlobal ? globalSearchQuery : pageSearchQuery}
        onChange={(e) =>
          isGlobal ? setGlobalSearchQuery(e.target.value) : setPageSearchQuery(e.target.value)
        }
        className="bg-transparent border-none outline-none text-[--text]"
      />
    </div>
  );
};

export default SearchBar;
