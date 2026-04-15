import { useQuery } from "@tanstack/vue-query";
import { useDependencies } from "@/modules/app/ui/hooks/use-dependencies";

export function useGetOrders() {
  const { orderPort } = useDependencies();
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => orderPort.getAll(),
  });
}
