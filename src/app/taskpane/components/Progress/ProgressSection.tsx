import Progress from "./Progress";
import * as React from "react";

function ProgressSection({ isLoading }: any) {
  if (isLoading) {
    return <Progress title="Loading..." message="Assistant is working..." />;
  } else {
    // @ts-ignore
    return <div> </div>;
  }
}

export default ProgressSection;
