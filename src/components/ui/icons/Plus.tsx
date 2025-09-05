import React, { memo } from "react";

const SvgComponent = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    height={24}
    width={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.51468 12C2.51468 11.4477 2.96239 11 3.51468 11L11 11L11 3.51472C11 2.96243 11.4477 2.51472 12 2.51472C12.5522 2.51472 13 2.96243 13 3.51472L13 11H20.4852C21.0375 11 21.4852 11.4477 21.4852 12C21.4852 12.5523 21.0375 13 20.4852 13H13L13 20.4853C13 21.0376 12.5522 21.4853 12 21.4853C11.4477 21.4853 11 21.0376 11 20.4853L11 13L3.51468 13C2.96239 13 2.51468 12.5523 2.51468 12Z"
      fill="currentColor"
    />
  </svg>
);

const Plus = memo(SvgComponent);
export default Plus;
