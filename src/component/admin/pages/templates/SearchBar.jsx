import { useState, forwardRef } from "react";
import { Input, Button, Image } from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import debounce from "lodash.debounce";
import { templateApiService } from "./services/templateApiService";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchSuggestions = debounce(async (value) => {
    if (!value) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    try {
      const options = await templateApiService.fetchTemplateSuggestions(value);
      setSuggestions(options);
      setShowDropdown(true);
    } catch (error) {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, 300);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    fetchSuggestions(val);
  };

  const handleSearch = () => {
    setShowDropdown(false);
    setSuggestions([]);
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSuggestions([]);
    setShowDropdown(false);
    onSearch("");
  };

  const handleSuggestionClick = (value) => {
    setSearchTerm(value.text);
    setShowDropdown(false);
    onSearch(value.text);
  };

  return (
    <div style={{ position: "relative", width: 300 }}>
      <Input
        placeholder="Search templates..."
        value={searchTerm}
        onChange={handleInputChange}
        onPressEnter={handleSearch}
        suffix={
          <div style={{ display: "flex", alignItems: "center" }}>
            {searchTerm && (
              <Button
                icon={<CloseOutlined />}
                onClick={handleClear}
                type="text"
                style={{
                  cursor: "pointer",
                  marginRight: 4,
                  color: "rgba(0, 0, 0, 0.45)",
                }}
              />
            )}
            <Button
              icon={<SearchOutlined />}
              onClick={handleSearch}
              type="text"
              style={{ cursor: "pointer" }}
            />
          </div>
        }
      />
      {showDropdown && suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ddd",
            zIndex: 10,
            maxHeight: 200,
            overflowY: "auto",
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              onClick={() => handleSuggestionClick(s)}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {s.image && (
                <Image
                  src={s.image}
                  width={24}
                  height={24}
                  style={{ objectFit: "cover", borderRadius: 4 }}
                  preview={false}
                />
              )}
              <span>{s.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
