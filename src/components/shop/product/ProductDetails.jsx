"use client";

import React from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Image } from "@nextui-org/image";
import ContentWrapper from "@/components/common/layouts/ContentWrapper";
import { Button } from "@nextui-org/button";

const ProductDetails = ({ product }) => {
  console.log("product", product);
  return (
    <>
      {!product ? ( // Check if product data is available
        <LoadingSpinner className="bg-opacity-30" />
      ) : product &&
        typeof product === "object" &&
        Object.keys(product).length > 0 ? (
        <ContentWrapper className="md:flex-row justify-centerd md:justify-between items-center bg-color-primary-p40 rounded-xl">
          <div className="flex flex-col justify-center items-center bg-color-primary-p80 rounded-xl">
            <Image
              src={product?.imageURL}
              alt={product?.name}
              width={300}
              height={300}
            />
            <p>{product?.id}</p>
          </div>
          <div className="flex flex-col justify-center items-center bg-color-primary-p60 rounded-xl">
            <h2 className="title flex justify-center text-heading-4 pb-2">
              {product?.name}
            </h2>
            <p>{product?.description}</p>
          </div>
          <Button
            size="sm"
            className=" flex bg-warning rounded-none rounded-b-lg"
            variant="solid"
            color="warning"
            // radius="md"
            onClick={() => console.log("button pressed")}
          >
            Add to Cart
          </Button>
        </ContentWrapper>
      ) : (
        <div>
          <h2 className="title flex justify-center text-heading-4 pb-2">
            No details to show!
          </h2>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
