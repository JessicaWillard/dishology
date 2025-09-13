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
      fill="currentColor"
      fillRule="evenodd"
      d="M12.497 3h.003a9 9 0 0 1 9 9 .9.9 0 0 1-1.8 0 7.2 7.2 0 0 0-7.198-7.2c-2.03.008-3.977.8-5.437 2.208l-.492.492H8.9a.9.9 0 0 1 0 1.8H4.4a.9.9 0 0 1-.9-.9V3.9a.9.9 0 1 1 1.8 0v2.327l.498-.497.01-.011A9.675 9.675 0 0 1 12.497 3ZM6.136 18.364A9 9 0 0 1 3.5 12a.9.9 0 1 1 1.8 0 7.2 7.2 0 0 0 7.198 7.2 7.875 7.875 0 0 0 5.437-2.208l.492-.492H16.1a.9.9 0 1 1 0-1.8h4.5a.9.9 0 0 1 .9.9v4.5a.9.9 0 0 1-1.8 0v-2.327l-.498.497-.01.011A9.675 9.675 0 0 1 12.503 21H12.5a9 9 0 0 1-6.364-2.636Z"
      clipRule="evenodd"
    />
  </svg>
);

const Reset = memo(SvgComponent);
export default Reset;
