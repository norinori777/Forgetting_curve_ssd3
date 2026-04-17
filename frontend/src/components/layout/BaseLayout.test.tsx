import { renderToStaticMarkup } from "react-dom/server";

import BaseLayout from "./BaseLayout";

export const isBaseLayoutPageSlotPlacementValid = (): boolean => {
  const markup = renderToStaticMarkup(
    <BaseLayout activePage="dashboard">
      <section>
        <h1>ダッシュボード</h1>
      </section>
    </BaseLayout>
  );

  return markup.includes("<header") && markup.includes("<main") && markup.indexOf("<header") < markup.indexOf("<main") && markup.includes("ダッシュボード");
};
