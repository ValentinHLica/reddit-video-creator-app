export const ArrowDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="icon"
    viewBox="0 0 24 24"
  >
    <path d="M6 9L12 15 18 9"></path>
  </svg>
);

export const ArrowUpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="icon"
    viewBox="0 0 24 24"
  >
    <path d="M18 15L12 9 6 15"></path>
  </svg>
);

export const HeartIcon = ({ added }: { added: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className={`icon ${added ? "isFav" : ""}`}
    viewBox="0 0 24 24"
  >
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
  </svg>
);

export const CommentsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="icon"
    viewBox="0 0 24 24"
  >
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
  </svg>
);

export const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="icon"
    viewBox="0 0 24 24"
  >
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export const SpinnerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="icon"
    viewBox="0 0 24 24"
  >
    <path d="M12 2L12 6"></path>
    <path d="M12 18L12 22"></path>
    <path d="M4.93 4.93L7.76 7.76"></path>
    <path d="M16.24 16.24L19.07 19.07"></path>
    <path d="M2 12L6 12"></path>
    <path d="M18 12L22 12"></path>
    <path d="M4.93 19.07L7.76 16.24"></path>
    <path d="M16.24 7.76L19.07 4.93"></path>
  </svg>
);

export const AddIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="icon"
    viewBox="0 0 24 24"
  >
    <path d="M12 5L12 19"></path>
    <path d="M5 12L19 12"></path>
  </svg>
);

export const PostIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="icon"
    viewBox="0 0 24 24"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
    <path d="M3 9L21 9"></path>
    <path d="M9 21L9 9"></path>
  </svg>
);

export const RissingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="icon"
    viewBox="0 0 24 24"
  >
    <path d="M23 6L13.5 15.5 8.5 10.5 1 18"></path>
    <path d="M17 6L23 6 23 12"></path>
  </svg>
);

export const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="icon"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="5"></circle>
    <path d="M12 1L12 3"></path>
    <path d="M12 21L12 23"></path>
    <path d="M4.22 4.22L5.64 5.64"></path>
    <path d="M18.36 18.36L19.78 19.78"></path>
    <path d="M1 12L3 12"></path>
    <path d="M21 12L23 12"></path>
    <path d="M4.22 19.78L5.64 18.36"></path>
    <path d="M18.36 5.64L19.78 4.22"></path>
  </svg>
);

export const HotIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="icon"
    viewBox="0 0 24 24"
  >
    <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"></path>
    <path d="M6 1L6 4"></path>
    <path d="M10 1L10 4"></path>
    <path d="M14 1L14 4"></path>
  </svg>
);

export const TopIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="icon"
    viewBox="0 0 24 24"
  >
    <path d="M17 11L12 6 7 11"></path>
    <path d="M17 18L12 13 7 18"></path>
  </svg>
);
