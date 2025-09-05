import React, { memo } from "react";

const SvgComponent = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M8.64002 14L6.59002 11.96M15.34 15L12.88 12.54M15 9C15 9 16.86 7 18.5 7C20.67 7 22 9 22 9C22 9 20.67 11 18.5 11C16.33 11 15 9 15 9ZM15 9C15 9 13 7.67 13 5.5C13 3.33 15 2 15 2C15 2 17 3.33 17 5.5C17 7.16 15 9 15 9ZM2.27002 21.7C2.27002 21.7 12.14 18.2 15 15.34C15.4183 14.9224 15.7502 14.4265 15.9768 13.8806C16.2034 13.3347 16.3203 12.7496 16.3208 12.1585C16.3212 11.5675 16.2053 10.9821 15.9795 10.4359C15.7538 9.88968 15.4226 9.39326 15.005 8.975C14.5874 8.55674 14.0915 8.22483 13.5456 7.99822C12.9998 7.7716 12.4146 7.65473 11.8236 7.65427C11.2325 7.6538 10.6472 7.76976 10.1009 7.99551C9.5547 8.22126 9.05828 8.5524 8.64002 8.97C5.77002 11.84 2.27002 21.7 2.27002 21.7Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Ingredient = memo(SvgComponent);
export default Ingredient;
