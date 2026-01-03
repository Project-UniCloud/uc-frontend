import { useAsync } from "@/lib/views/shared/hooks";
import {
  getOverallStats,
  getCostInTime,
  getCostPerResourceType,
  getCostPerGroup,
} from "@/lib/api/statisticsApi";

export function useDashboardPage() {
  const {
    data,
    loading,
    error,
    run: refetch,
  } = useAsync(
    async () => {
      const [overallStats, costPerGroup, costPerResourceType, costInTime] =
        await Promise.all([
          getOverallStats(),
          getCostPerGroup(),
          getCostPerResourceType(),
          getCostInTime(),
        ]);

      return {
        overallStats,
        costPerGroup,
        costPerResourceType,
        costInTime,
      };
    },
    [],
    {
      initialData: {
        overallStats: null,
        costPerGroup: [],
        costPerResourceType: [],
        costInTime: [],
      },
    }
  );

  return {
    ...data,
    loading,
    error,
    refetch,
  };
}
