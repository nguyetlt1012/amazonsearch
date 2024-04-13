import { BarChart } from "@mui/x-charts/BarChart";
import { Checkbox, List, Pagination, Select } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { brands, colors, discounts, sort_by } from "../Config/MockedData";
import mockedData from "../mockData.json";
import { NavBar, ProductDetails, ProductRatings } from "./";
import { getSearchResults } from "../utils/CallApi";

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    query: searchParams.get("searchTerm"),
    category: searchParams.get("category"),
    sortBy: searchParams.get("sortBy"),
    page:  searchParams.get("page") ?  searchParams.get("page"): 1,
  });

  const handleChange = (value) => {
    setFilters({
      ...filters,
      sortBy: value,
    });
  };
  const handlePageChange = (current, pageSize) => {
    setFilters({...filters, page: current})
    navigate(`/?category=${filters.category ? filters.category : "All"}&searchTerm=${filters.query ? filters.query : ""}&page=${current}`)
  }

  useEffect(() => {
    getSearchResults(filters, (res) => {
      setData(res)
    });
  }, [filters]);
  console.log(filters)
  return (
    <div style={{ width: "100%" }}>
      <NavBar filters={filters} setFilters={setFilters}/>
      <div
        className="sort-by"
        style={{
          height: "30px",
          borderBottom: "1px solid #e2e2e2",
          fontSize: "14px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "95%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p>
            {data.length} results of{" "}
            <span style={{ color: "red", fontWeight: "bold" }}>
              "{filters.query}"
            </span>
          </p>
          <div className="sort">
            <Select
              placeholder="Sort by: featured"
              style={{
                width: 200,
                height: 25,
              }}
              onChange={handleChange}
              options={sort_by}
            />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <div className="filters" style={{ width: "18%" }}>
          <div className="customer-review" style={{ marginTop: "10px" }}>
            <p
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              Customer review
            </p>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <ProductRatings starNumber={4} />
              <p style={{ fontSize: "12px", marginLeft: "5px" }}>& Up</p>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <ProductRatings starNumber={3} />
              <p style={{ fontSize: "12px", marginLeft: "5px" }}>& Up</p>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <ProductRatings starNumber={2} />
              <p style={{ fontSize: "12px", marginLeft: "5px" }}>& Up</p>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <ProductRatings starNumber={1} />
              <p style={{ fontSize: "12px", marginLeft: "5px" }}>& Up</p>
            </div>
          </div>
          <div className="is-top-brand" style={{ marginTop: "10px" }}>
            <p
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              All top brand
            </p>
            <Checkbox>Top Brands</Checkbox>
          </div>
          <div className="price" style={{ marginTop: "10px" }}>
            <p
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              Price
            </p>
            <div style={{ marginLeft: "-20px" }}>
              <BarChart
                xAxis={[
                  {
                    id: "barCategories",
                    data: [
                      "Under $25",
                      "$25 to $50",
                      "$50 to $100",
                      "$100 to $200",
                      "$200 $ above",
                    ],
                    scaleType: "band",
                  },
                ]}
                series={[
                  {
                    data: [215, 527, 461, 128, 38],
                    color: "#F1B61F",
                  },
                ]}
                width={240}
                height={200}
              />
            </div>
          </div>
          <div className="brands" style={{ marginTop: "10px" }}>
            <p
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              Brands
            </p>
            <Checkbox.Group
              options={brands}
              style={{ display: "flex", flexDirection: "column" }}
            />
          </div>
          <div className="discounts" style={{ marginTop: "10px" }}>
            <p
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              Deals & Discounts
            </p>
            <Checkbox.Group
              options={discounts}
              style={{ display: "flex", flexDirection: "column" }}
            />
          </div>
          <div className="colors" style={{ marginTop: "10px" }}>
            <p
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              Colors
            </p>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {colors.map((item, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      background: `#${item}`,
                      width: "27px",
                      height: "27px",
                      borderRadius: "5px",
                      margin: "2px",
                    }}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="products" style={{ width: "78%" }}>
          {data.length > 0 &&
            <div>
              <List
                grid={{
                  gutter: 25,
                  column: 4,
                }}
                dataSource={data}
                renderItem={(item, index) => {
                  return (
                    <List.Item key={index}>
                      <ProductDetails item={item.data} />
                    </List.Item>
                  );
                }}
              />
              <div style={{width: "100%", display: "flex", justifyContent: "flex-end"}}>
                <Pagination total={50} onChange={handlePageChange} pageSize={12} current={filters.page}/> 
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
