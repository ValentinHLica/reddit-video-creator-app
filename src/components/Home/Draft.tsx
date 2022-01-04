import React, { useEffect, useState } from "react";

import { DraftItem } from "@interface/reddit";

import { CardWrapper, Card, Progress } from "@ui";

const Draft: React.FC = () => {
  const [draft, setDraft] = useState<DraftItem[]>([]);

  const fetchDraft = () => {
    const draftData = localStorage.getItem("draft");

    if (draftData) {
      try {
        const drafted = JSON.parse(draftData) as DraftItem[];

        setDraft(drafted);
      } catch (error) {}
    }
  };

  useEffect(() => {
    fetchDraft();
  }, []);

  return (
    <ul>
      <CardWrapper>
        {draft.map((item, index) => {
          if (item.comments.length === 0) {
            return;
          }

          return (
            <Card
              key={index}
              title={item.post.title}
              children={<Progress max={10} value={2} />}
            />
          );
        })}
      </CardWrapper>
    </ul>
  );
};

export default Draft;
