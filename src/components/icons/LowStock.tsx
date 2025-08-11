import React, { memo } from "react";

const SvgComponent = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M7.70703 6.29297C7.31651 5.90244 6.68349 5.90244 6.29297 6.29297C5.90244 6.68349 5.90244 7.31651 6.29297 7.70703L14.5859 16H7C6.44771 16 6 16.4477 6 17C6 17.5523 6.44771 18 7 18H17C17.5523 18 18 17.5523 18 17V7C18 6.44772 17.5523 6 17 6C16.4477 6 16 6.44772 16 7V14.5859L7.70703 6.29297Z"
      fill="currentColor"
    />
  </svg>
);

const LowStock = memo(SvgComponent);
export default LowStock;
