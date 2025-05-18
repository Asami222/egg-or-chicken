import { useMemo } from 'react';
import { useWeatherData } from './useWeatherData';

export const useFilteredWeatherData = (place: string) => {
  const { data, isPending, error, refetch } = useWeatherData(place);

  const newFirstDataForEachDate = useMemo(() => {
    if (!data) return [];

    const uniqueDates = [
      ...new Set(
        data.list.map((entry) =>
          new Date(entry.dt * 1000).toISOString().split('T')[0]
        )
      ),
    ];

    const firstDataForEachDate = uniqueDates.map((date) =>
      data.list.find((entry) => {
        const entryDate = new Date(entry.dt * 1000)
          .toISOString()
          .split('T')[0];
        const entryTime = new Date(entry.dt * 1000).getHours();
        return entryDate === date && entryTime >= 18;
      })
    );

    return firstDataForEachDate.slice(1, 6).filter(Boolean);
  }, [data]);

  return { data: newFirstDataForEachDate, isPending, error, refetch };
};