import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import useDebounce from "../utils/useDebounce"
import { callAPI, getSearchResults } from "../utils/CallApi";
import { AutoComplete, Input, Select } from "antd";

const Search = ({filters, setFilters}) => {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const debouncedValue = useDebounce(query, 500);
  const navigate = useNavigate()
  useEffect(() => {
    if (debouncedValue) {
      getSearchResults({query: debouncedValue}, (res) => {
        setOptions(
          res.map((item) => {
            return {
              ...item,
              value: item.data.title,
              label: item.data.title
            };
          })
        );
      });
    }
  }, [debouncedValue]);
  const handleInputChange = (value) => {
    setQuery(value);
  };
  const handleInputConfirm = (value, option) => {
    setFilters({
      ...filters,
      query: `${option.value}`,
      page: 1
    });
    navigate(`/?category=All&searchTerm=${option.value}&page=1`)
  };
  const handleInputEnter = () => {
    setFilters({ ...filters, query: query, page: 1 });
    navigate(`/?category=All&searchTerm=${query}&page=1`)
  };
  const handleChange = (value) => {
    setFilters({ ...filters, category: value, page: 1 });
    navigate(encodeURI(`/?category=${value}&page=1`))
  };
  return (
    <div style={{display: "flex", width: "100%"}}>
      <Select
        defaultValue={filters.category ? filters.category:"All"}
        style={{
          width: "17%",
          height: "40px",
          marginRight: "5px"
        }}
        onChange={handleChange}
        options={[
          {
            value: 'All',
            label: 'All',
          },
          {
            value: 'Skin Care',
            label: 'Skin Care',
          },
          {
            value: 'Grocery and Gourmet Foods',
            label: 'Grocery and Gourmet Foods',
          },
          {
            value: 'Hair Care',
            label: 'Hair Care',
          },
          {
            value: 'Fragrance',
            label: 'Fragrance',
          },
          {
            value: 'Bath and Shower',
            label: 'Bath and Shower',
          },
          {
            value: 'Detergents and Dishwash',
            label: 'Detergents and Dishwash',
          },
        ]}
      />
      <AutoComplete
        options={options}
        placeholder={"Type to search"}
        onChange={handleInputChange}
        onSelect={handleInputConfirm}
        style={{ width: "80%" }}
      >
        <Input
          style={{height: "40px" }}
          onPressEnter={handleInputEnter}
        />
      </AutoComplete>
    </div>
  );
  // const [suggestions, setSuggestions] = useState(null);
  // const [searchTerm, setSearchTerm] = useState("");
  // const [category, setCategory] = useState("All");
  // const debouncedValue = useDebounce(searchTerm, 300);
  // const navigate = useNavigate();

  // const onHandleSubmit = (e) => {
  //   e.preventDefault();

  //   navigate({
  //     pathname: "",
  //     search: `${createSearchParams({
  //       category: `${category}`,
  //       searchTerm: `${searchTerm}`,
  //     })}`,
  //   });

  //   setSearchTerm("");
  //   setCategory("All");
  //   setFilters({
  //     ...filters,
  //     query: searchTerm
  //   })
  // };

  // const getSuggestions = () => {
  //   // callAPI(`data/suggestions.json`).then((suggestionResults) => {
  //   //   setSuggestions(suggestionResults);
  //   // });
  //   getSearchResults({query: debouncedValue}, (res) => {
  //     setSuggestions(res)
  //   });
  // };

  // useEffect(() => {
  //   if (debouncedValue) {
  //     getSuggestions();
  //   }
  // }, [debouncedValue]);

  // return (
  //   <div className="w-[100%]">
  //     <div className="flex items-center h-10 bg-amazonclone-yellow rounded">
  //       <select
  //         onChange={(e) => setCategory(e.target.value)}
  //         className="p-2 bg-gray-300 text-black border text-xs xl:text-sm"
  //       >
  //         <option>All</option>
  //         <option>Skin Care</option>
  //         <option>Grocery & Gourmet Foods</option>
  //         <option>Hair Care</option>
  //         <option>Fragrance</option>
  //         <option>Bath & Shower</option>
  //         <option>Detergents & Dishwash</option>
  //       </select>
  //       <input
  //         className="flex grow items-center h-[100%] rounded-l text-black"
  //         type="text"
  //         value={searchTerm}
  //         onChange={(e) => setSearchTerm(e.target.value)}
  //       />
  //       <button onClick={onHandleSubmit} className="w-[45px]">
  //         <MagnifyingGlassIcon className="h-[27px] m-auto stroke-slate-900" />
  //       </button>
  //     </div>
  //     {suggestions && (
  //       <div className="bg-white text-black w-full z-40 absolute">
  //         {suggestions
  //           // .filter((suggestion) => {
  //           //   const currentSearchTerm = searchTerm.toLowerCase();
  //           //   const title = suggestion.title.toLowerCase();
  //           //   return (
  //           //     currentSearchTerm &&
  //           //     title.startsWith(currentSearchTerm) &&
  //           //     title !== currentSearchTerm
  //           //   );
  //           // })
  //           .slice(0, 10)
  //           .map((suggestion) => (
  //             <div
  //               key={suggestion.data.id}
  //               onClick={() => setSearchTerm(suggestion.data.title)}
  //             >
  //             <p style={{ fontSize: "16px", fontWeight: "bold", display: "-webkit-box", "-webkit-line-clamp": "2",  "-webkit-box-orient": "vertical", "overflow": "hidden" }}>{suggestion.data.title}</p>
  //             </div>
  //           ))}
  //       </div>
  //     )}
  //   </div>
  // );
};

export default Search;
