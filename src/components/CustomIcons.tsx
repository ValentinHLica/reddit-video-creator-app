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
    className="feather feather-chevron-down"
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
    className="feather feather-chevron-up"
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
    className={`feather feather-heart ${added ? "isFav" : ""}`}
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
    className="feather feather-message-circle"
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
    className="feather feather-user"
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
    className="feather feather-loader"
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
