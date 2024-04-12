import { Tag } from "antd";
import { ProductRatings } from "./";

const ProductDetails = ({ item }) => {
  return (
    <div>
      <img
        style={{ width: "100%", marginBottom: "5px" }}
        src={item["Image Urls"].split("|")[0]}
        alt="product-image"
      />
      <div className="name">
        <Tag>{item.Category}</Tag>
        <p style={{ fontSize: "16px", fontWeight: "bold" }}>
          {item["Product Title"]}
        </p>
      </div>
      <div className="rating">
        <ProductRatings
          starNumber={Math.floor(Math.random() * 4) + 1}
          ratingNumber={Math.floor(Math.random() * 1000)}
        />
      </div>
      <div className="bought">
        <p style={{ color: "grey" }}>
          {Math.floor(Math.random() * 1000)} bought in past month
        </p>
      </div>
      <div
        className="price"
        style={{ display: "flex", alignItems: "flex-end" }}
      >
        <p style={{ fontWeight: "bold", marginRight: "5px" }}>${item.Price}</p>
        {item.Offers !== "0%" && (
          <p
            style={{
              fontSize: "12px",
              textDecoration: "line-through",
            }}
          >
            Typical: {item.Mrp}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
