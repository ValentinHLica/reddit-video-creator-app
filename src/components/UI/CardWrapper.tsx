import React, { useState } from "react";

import Button from "./Button";

import styles from "@styles/UI/card-wrapper.module.scss";

type Props = {
  className?: string;
  loadMore?: () => Promise<void>;
};

const CardWrapper: React.FC<Props> = ({
  className = "",
  loadMore,
  children,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className={`${styles.container} ${className} card__wrapper`}>
      {children}

      {loadMore && (
        <div className={styles.container__more}>
          <Button
            onClick={async () => {
              setLoading(true);
              await loadMore();
              setLoading(false);
            }}
            size="xs"
            loading={loading}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default CardWrapper;
