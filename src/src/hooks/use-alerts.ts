"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { alertsApi } from "@/lib/api/endpoints";
import type { AlertCreateInput, AlertListFilters, AlertStatus, AlertUpdateInput } from "@/types/domain";
import { queryKeys } from "./query-keys";

const IN_FLIGHT: readonly AlertStatus[] = ["SENDING", "SCHEDULED"];

export function useAlerts(filters: AlertListFilters) {
  return useQuery({
    queryKey: queryKeys.alerts.list(filters),
    queryFn: ({ signal }) => alertsApi.list(filters, signal),
    placeholderData: keepPreviousData,
    // Poll while anything on the page is still being broadcast.
    refetchInterval: (query) =>
      query.state.data?.data.some((a) => IN_FLIGHT.includes(a.status)) ? 5_000 : false,
  });
}

export function useAlert(id: string) {
  return useQuery({
    queryKey: queryKeys.alerts.detail(id),
    queryFn: ({ signal }) => alertsApi.get(id, signal),
    refetchInterval: (query) => (query.state.data?.status === "SENDING" ? 2_000 : false),
  });
}

function useInvalidateAlerts() {
  const qc = useQueryClient();
  return () =>
    Promise.all([
      qc.invalidateQueries({ queryKey: queryKeys.alerts.all }),
      qc.invalidateQueries({ queryKey: queryKeys.stats }),
    ]);
}

export function useCreateAlert() {
  const invalidate = useInvalidateAlerts();
  return useMutation({
    mutationFn: (input: AlertCreateInput) => alertsApi.create(input),
    onSuccess: invalidate,
  });
}

export function useUpdateAlert(id: string) {
  const invalidate = useInvalidateAlerts();
  return useMutation({
    mutationFn: (input: AlertUpdateInput) => alertsApi.update(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteAlert() {
  const invalidate = useInvalidateAlerts();
  return useMutation({
    mutationFn: (id: string) => alertsApi.remove(id),
    onSuccess: invalidate,
  });
}

export function useSendAlert() {
  const invalidate = useInvalidateAlerts();
  return useMutation({
    mutationFn: ({ id, immediate = true }: { id: string; immediate?: boolean }) => alertsApi.send(id, immediate),
    onSuccess: invalidate,
  });
}

export function useCancelAlert() {
  const invalidate = useInvalidateAlerts();
  return useMutation({
    mutationFn: (id: string) => alertsApi.cancel(id),
    onSuccess: invalidate,
  });
}
