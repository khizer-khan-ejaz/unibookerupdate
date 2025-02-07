// components/common/LoadingSkeleton.tsx
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadingSkeleton = () => {
  return (
    <div style={{ padding: "20px" }}>
      <Skeleton height={50} width={`100%`} />
      <Skeleton height={30} width={`80%`} style={{ margin: "20px 0" }} />
      <Skeleton height={200} width={`100%`} />
      <Skeleton height={50} width={`90%`} style={{ marginTop: "20px" }} />
    </div>
  );
};

export default LoadingSkeleton;
